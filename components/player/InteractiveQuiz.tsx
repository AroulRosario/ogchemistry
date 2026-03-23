import { supabase } from '@/constants/supabase';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { LaTeXText } from '@/components/LaTeXText';
import { CheckCircle, Circle, XCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

interface QuizProps {
    contentItemId: string;
    onComplete: (score: number, passed: boolean) => void;
}

export function InteractiveQuiz({ contentItemId, onComplete }: QuizProps) {
    const { user } = useAuth();
    const [quiz, setQuiz] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedOption, setSelectedOption] = useState<any>(null);
    const [isChecking, setIsChecking] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const loadQuiz = async () => {
            const { data: quizData } = await supabase
                .from('quizzes')
                .select('*')
                .eq('content_item_id', contentItemId)
                .single();

            if (quizData) {
                setQuiz(quizData);
                const { data: qData } = await supabase
                    .from('quiz_questions')
                    .select('*, question_options(*)')
                    .eq('quiz_id', quizData.id)
                    .order('order');
                if (qData) setQuestions(qData);
            }
        };
        loadQuiz();
    }, [contentItemId]);

    if (!quiz || questions.length === 0) {
        return <View style={styles.center}><ActivityIndicator color={COLORS.blue} /></View>;
    }

    if (isFinished) {
        const passed = (score / questions.length) * 100 >= (quiz.passing_score || 0);
        return (
            <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>{passed ? "Quiz Passed! 🎉" : "Keep Tryin! 💪"}</Text>
                <Text style={styles.resultScore}>Score: {score} / {questions.length}</Text>
                <Pressable style={styles.btn} onPress={() => onComplete(score, passed)}>
                    <Text style={styles.btnText}>Continue</Text>
                </Pressable>
            </View>
        );
    }

    const question = questions[currentStep];

    const handleSubmit = async () => {
        if (!selectedOption) return;
        setIsChecking(true);
        // Add minimal delay for emphasis/haptics effect
        await new Promise(r => setTimeout(r, 600));

        if (selectedOption.is_correct) {
            setScore(s => s + 1);
        }

        setIsChecking(false);
        if (currentStep < questions.length - 1) {
            setCurrentStep(c => c + 1);
            setSelectedOption(null);
        } else {
            setIsFinished(true);
            const finalScore = score + (selectedOption.is_correct ? 1 : 0);
            const passed = (finalScore / questions.length) * 100 >= (quiz.passing_score || 0);
            // Save attempt
            if (user) {
                await supabase.from('quiz_attempts').insert({
                    user_id: user.id,
                    quiz_id: quiz.id,
                    score: finalScore,
                    passed: passed
                });
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.progress}>Question {currentStep + 1} of {questions.length}</Text>
                <View style={styles.track}>
                    <View style={[styles.fill, { width: `${((currentStep + 1) / questions.length) * 100}%` }]} />
                </View>
            </View>

            <LaTeXText
                text={question.question_text || ''}
                fontSize={20}
                color="#1E293B"
                fontWeight="900"
                style={styles.questionTextContainer}
            />

            <View style={styles.optionsList}>
                {question.question_options?.sort((a: any, b: any) => a.order - b.order).map((opt: any) => {
                    const isSelected = selectedOption?.id === opt.id;
                    const showCorrectness = isChecking && isSelected;
                    const isCorrect = opt.is_correct;

                    return (
                        <Pressable
                            key={opt.id}
                            style={[
                                styles.optionCard,
                                isSelected && styles.optionSelected,
                                showCorrectness && isCorrect && styles.optionCorrect,
                                showCorrectness && !isCorrect && styles.optionIncorrect
                            ]}
                            onPress={() => !isChecking && setSelectedOption(opt)}
                        >
                            <View style={styles.radio}>
                                {showCorrectness ? (
                                    isCorrect ? <CheckCircle color={COLORS.green} size={20} /> : <XCircle color={COLORS.red} size={20} />
                                ) : (
                                    isSelected ? <CheckCircle color={COLORS.blue} size={20} /> : <Circle color={COLORS.grayDark} size={20} />
                                )}
                            </View>
                            <LaTeXText
                                text={opt.option_text || ''}
                                fontSize={14}
                                color={isSelected ? COLORS.blue : '#475569'}
                                fontWeight="700"
                                style={{ flex: 1 }}
                            />
                        </Pressable>
                    );
                })}
            </View>

            <Pressable
                style={[styles.btn, !selectedOption && styles.btnDisabled]}
                onPress={handleSubmit}
                disabled={!selectedOption || isChecking}
            >
                <Text style={styles.btnText}>{isChecking ? "Checking..." : "Submit"}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    center: { padding: 40, alignItems: 'center' },
    container: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2
    },
    header: { marginBottom: 24 },
    progress: {
        fontFamily: 'System',
        fontSize: 14,
        fontWeight: '800',
        color: '#64748B',
        marginBottom: 12,
        letterSpacing: 1
    },
    track: {
        height: 10,
        backgroundColor: '#F1F5F9',
        borderRadius: 5,
        overflow: 'hidden'
    },
    fill: {
        height: '100%',
        backgroundColor: COLORS.blue,
        borderRadius: 5
    },
    questionTextContainer: {
        marginBottom: 24,
        minHeight: 60,
    },
    optionsList: { gap: 12, marginBottom: 24 },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        backgroundColor: COLORS.white
    },
    optionSelected: {
        borderColor: COLORS.blue,
        backgroundColor: '#EFF6FF',
    },
    optionCorrect: {
        borderColor: COLORS.green,
        backgroundColor: '#F0FDF4'
    },
    optionIncorrect: {
        borderColor: COLORS.red,
        backgroundColor: '#FEF2F2'
    },
    radio: { marginRight: 16 },
    optionText: {
        flex: 1,
        fontFamily: 'System',
        fontSize: 15,
        fontWeight: '700',
        color: '#475569'
    },
    btn: {
        backgroundColor: COLORS.blue,
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
    },
    btnDisabled: {
        opacity: 0.5,
        backgroundColor: '#94A3B8',
    },
    btnText: {
        fontFamily: 'System',
        fontWeight: '800',
        fontSize: 16,
        color: COLORS.white,
        letterSpacing: 0.5
    },
    resultContainer: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: COLORS.white,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E2E8F0'
    },
    resultTitle: {
        fontFamily: 'System',
        fontSize: 32,
        fontWeight: '900',
        color: '#1E293B',
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: -1
    },
    resultScore: {
        fontFamily: 'System',
        fontSize: 18,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 32,
    },
});
