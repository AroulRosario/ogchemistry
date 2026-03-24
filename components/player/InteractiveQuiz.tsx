import { supabase } from '@/constants/supabase';
import { COLORS, STYLES, SHADOWS } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { LaTeXText } from '@/components/LaTeXText';
import { CheckCircle, Circle, XCircle, Trophy, ClipboardCheck } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';

interface QuizProps {
    data: any;
    onComplete: (score: number, passed: boolean) => void;
}

export function InteractiveQuiz({ data, onComplete }: QuizProps) {
    const { user } = useAuth();
    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (data?.questions) {
            const qs = data.questions.map((q: any, i: number) => ({
                id: i,
                question_text: q.question,
                question_options: q.options.map((opt: string, oi: number) => ({
                    id: `${i}-${oi}`,
                    option_text: opt,
                    is_correct: opt === q.answer || opt.startsWith(q.answer)
                }))
            }));
            setQuestions(qs);
        }
    }, [data]);

    const handleSelect = (questionId: number, option: any) => {
        if (isFinished) return;
        setAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    const handleSubmit = async () => {
        if (Object.keys(answers).length < questions.length) {
            alert(`Please answer all questions! (${Object.keys(answers).length}/${questions.length})`);
            return;
        }

        setIsSubmitting(true);
        // Calculate score
        let finalScore = 0;
        questions.forEach(q => {
            if (answers[q.id]?.is_correct) finalScore++;
        });

        setScore(finalScore);
        const passed = (finalScore / questions.length) * 100 >= (data.passing_score || 0);

        if (user) {
            await supabase.from('quiz_attempts').insert({
                user_id: user.id,
                quiz_id: data.id || 'anonymous_quiz',
                score: finalScore,
                passed: passed
            });
        }

        setIsSubmitting(false);
        setIsFinished(true);
    };

    if (!data || questions.length === 0) {
        return <View style={styles.center}><Text style={{ color: '#64748B' }}>No questions found.</Text></View>;
    }

    if (isFinished) {
        const passed = (score / questions.length) * 100 >= (data.passing_score || 0);
        return (
            <View style={styles.resultCard}>
                <View style={[styles.resultIcon, { backgroundColor: passed ? '#DCFCE7' : '#FEE2E2' }]}>
                    <Trophy size={48} color={passed ? '#15803D' : '#991B1B'} />
                </View>
                <Text style={styles.resultTitle}>{passed ? "CONGRATULATIONS!" : "KEEP PRACTICING!"}</Text>
                <Text style={styles.resultMsg}>
                    {passed ? "You've mastered this module with elite precision." : "Review the concepts and attempt again to achieve mastery."}
                </Text>
                <View style={styles.scoreRow}>
                    <View style={styles.scoreBox}>
                        <Text style={styles.scoreValue}>{score}</Text>
                        <Text style={styles.scoreLabel}>CORRECT</Text>
                    </View>
                    <View style={styles.scoreDivider} />
                    <View style={styles.scoreBox}>
                        <Text style={styles.scoreValue}>{questions.length}</Text>
                        <Text style={styles.scoreLabel}>TOTAL</Text>
                    </View>
                </View>
                <Pressable style={styles.finishBtn} onPress={() => onComplete(score, passed)}>
                    <Text style={styles.finishBtnText}>CONTINUE TO NEXT MODULE</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.listContainer}>
            {/* Quiz Info */}
            <View style={styles.quizHeader}>
                <View style={styles.qIcon}>
                    <ClipboardCheck size={20} color="#FFF" />
                </View>
                <View>
                    <Text style={styles.quizTitle}>{data.title || 'Interactive Quiz'}</Text>
                    <Text style={styles.quizMeta}>{questions.length} Concepts • {data.passing_score || 0}% Passing Grade</Text>
                </View>
            </View>

            {questions.map((q, idx) => (
                <View key={q.id} style={styles.questionCard}>
                    <View style={styles.qRefRow}>
                        <View style={styles.qNum}><Text style={styles.qNumText}>{idx + 1}</Text></View>
                        <View style={styles.qLine} />
                    </View>
                    
                    <View style={styles.qContent}>
                        <LaTeXText
                            text={q.question_text || ''}
                            fontSize={18}
                            color="#1E293B"
                            fontWeight="800"
                            style={styles.qText}
                        />

                        <View style={styles.optionsGrid}>
                            {q.question_options?.map((opt: any) => {
                                const isSelected = answers[q.id]?.id === opt.id;
                                return (
                                    <Pressable
                                        key={opt.id}
                                        style={[styles.option, isSelected && styles.optionSelected]}
                                        onPress={() => handleSelect(q.id, opt)}
                                    >
                                        <View style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}>
                                            {isSelected && <CheckCircle size={14} color="#FFF" />}
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
                    </View>
                </View>
            ))}

            <Pressable
                style={[styles.submitBtn, Object.keys(answers).length < questions.length && styles.btnDisabled]}
                onPress={handleSubmit}
                disabled={isSubmitting || Object.keys(answers).length < questions.length}
            >
                {isSubmitting ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text style={styles.submitBtnText}>FINISH & CHECK RESULTS</Text>
                )}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    center: { padding: 60, alignItems: 'center' },
    listContainer: { gap: 24 },
    quizHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingHorizontal: 4,
        marginBottom: 8,
    },
    qIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: COLORS.blue,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.sm,
    },
    quizTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1E293B',
    },
    quizMeta: {
        fontSize: 13,
        fontWeight: '700',
        color: '#94A3B8',
    },
    questionCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    qRefRow: {
        alignItems: 'center',
        marginRight: 20,
    },
    qNum: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    qNumText: {
        fontSize: 14,
        fontWeight: '900',
        color: '#64748B',
    },
    qLine: {
        flex: 1,
        width: 2,
        backgroundColor: '#F1F5F9',
        marginTop: 8,
        borderRadius: 1,
    },
    qContent: { flex: 1 },
    qText: { marginBottom: 20 },
    optionsGrid: { gap: 10 },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#F1F5F9',
        backgroundColor: '#FFF',
        gap: 12,
    },
    optionSelected: {
        borderColor: COLORS.blue,
        backgroundColor: '#F0F7FF',
    },
    checkCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkCircleSelected: {
        backgroundColor: COLORS.blue,
        borderColor: COLORS.blue,
    },
    submitBtn: {
        backgroundColor: COLORS.blue,
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        marginTop: 16,
        ...SHADOWS.md,
    },
    btnDisabled: {
        backgroundColor: '#94A3B8',
        opacity: 0.6,
    },
    submitBtnText: {
        color: '#FFF',
        fontWeight: '950',
        fontSize: 15,
        letterSpacing: 2,
    },
    resultCard: {
        backgroundColor: '#FFF',
        borderRadius: 32,
        padding: 40,
        alignItems: 'center',
        ...SHADOWS.lg,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    resultIcon: {
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    resultTitle: {
        fontSize: 28,
        fontWeight: '950',
        color: '#1E293B',
        marginBottom: 12,
        letterSpacing: -1,
    },
    resultMsg: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 24,
        borderRadius: 24,
        width: '100%',
        marginBottom: 32,
    },
    scoreBox: { flex: 1, alignItems: 'center' },
    scoreValue: {
        fontSize: 32,
        fontWeight: '900',
        color: COLORS.blue,
    },
    scoreLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#64748B',
        marginTop: -4,
    },
    scoreDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#E2E8F0',
    },
    finishBtn: {
        backgroundColor: '#1E293B',
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 16,
        ...SHADOWS.md,
    },
    finishBtnText: {
        color: '#FFF',
        fontWeight: '900',
        fontSize: 14,
        letterSpacing: 1,
    },
});
