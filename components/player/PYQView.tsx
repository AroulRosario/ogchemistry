import { LaTeXText } from '@/components/LaTeXText';
import { COLORS } from '@/constants/theme';
import { CheckCircle, ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface PYQData {
    title?: string;
    question?: string;
    options?: string[];
    answer?: string;
    solution?: string;
    year?: string;
    exam?: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
}

interface PYQViewProps {
    data: PYQData & { questions?: PYQData[] };
}

function getDifficultyColor(difficulty?: string) {
    switch (difficulty) {
        case 'Easy': return { bg: '#D1FAE5', text: '#065F46' };
        case 'Hard': return { bg: '#FEE2E2', text: '#991B1B' };
        default: return { bg: '#FEF3C7', text: '#92400E' }; // Medium
    }
}

export function PYQView({ data }: PYQViewProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [revealed, setRevealed] = useState(false);

    const questions = data.questions || [data];
    const currentData = questions[currentIndex];

    const diffColor = getDifficultyColor(currentData.difficulty);
    const isCorrect = (option: string) => revealed && option === currentData.answer;
    const isWrong = (option: string) => revealed && option === selectedOption && option !== currentData.answer;

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
            setRevealed(false);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setSelectedOption(null);
            setRevealed(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={[styles.badge, { backgroundColor: '#FEE2E2' }]}>
                        <Text style={[styles.badgeText, { color: '#B91C1C' }]}>PYQ {questions.length > 1 ? `${currentIndex + 1}/${questions.length}` : ''}</Text>
                    </View>
                    {currentData.exam && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{currentData.exam}</Text>
                        </View>
                    )}
                    {currentData.year && (
                        <Text style={styles.yearText}>{currentData.year}</Text>
                    )}
                </View>
                {currentData.difficulty && (
                    <View style={[styles.diffBadge, { backgroundColor: diffColor.bg }]}>
                        <Text style={[styles.diffText, { color: diffColor.text }]}>{currentData.difficulty}</Text>
                    </View>
                )}
            </View>

            {/* Question */}
            <View style={styles.questionBox}>
                <LaTeXText
                    text={currentData.question || 'No question data available.'}
                    fontSize={16}
                    color="#1E293B"
                    fontWeight="700"
                    style={{ minHeight: 50 }}
                />
            </View>

            {/* Options */}
            {currentData.options && currentData.options.length > 0 && (
                <View style={styles.optionsContainer}>
                    {currentData.options.map((option, i) => {
                        const correct = isCorrect(option);
                        const wrong = isWrong(option);
                        return (
                            <Pressable
                                key={i}
                                style={[
                                    styles.option,
                                    selectedOption === option && !revealed && styles.optionSelected,
                                    correct && styles.optionCorrect,
                                    wrong && styles.optionWrong,
                                ]}
                                onPress={() => !revealed && setSelectedOption(option)}
                            >
                                <View style={[styles.optionCircle, correct && styles.optionCircleCorrect, wrong && styles.optionCircleWrong]}>
                                    <Text style={[styles.optionLetter, correct && { color: '#fff' }, wrong && { color: '#fff' }]}>
                                        {String.fromCharCode(65 + i)}
                                    </Text>
                                </View>
                                <LaTeXText text={option.replace(/^[A-D]\. */, '')} fontSize={14} color={correct ? '#065F46' : wrong ? '#991B1B' : '#334155'} fontWeight="600" style={{ flex: 1 }} />
                                {correct && <CheckCircle size={18} color="#059669" style={{ marginLeft: 'auto' }} />}
                            </Pressable>
                        );
                    })}
                </View>
            )}

            {/* Reveal Button */}
            {!revealed && selectedOption && (
                <Pressable style={styles.revealBtn} onPress={() => setRevealed(true)}>
                    <Text style={styles.revealBtnText}>Check Answer & See Solution</Text>
                </Pressable>
            )}

            {/* Solution */}
            {revealed && currentData.solution && (
                <View style={styles.solutionBox}>
                    <Text style={styles.solutionHeader}>📖 Detailed Solution</Text>
                    <LaTeXText text={currentData.solution} fontSize={14} color="#166534" fontWeight="500" style={{ minHeight: 40 }} />
                </View>
            )}

            {/* Navigation for Multi-Question */}
            {questions.length > 1 && (
                <View style={styles.navRow}>
                    <Pressable 
                        style={[styles.navBtn, currentIndex === 0 && { opacity: 0.3 }]} 
                        onPress={handlePrev}
                        disabled={currentIndex === 0}
                    >
                        <Text style={styles.navBtnText}>Previous</Text>
                    </Pressable>
                    <Pressable 
                        style={[styles.navBtn, currentIndex === questions.length - 1 && { opacity: 0.3 }]} 
                        onPress={handleNext}
                        disabled={currentIndex === questions.length - 1}
                    >
                        <Text style={styles.navBtnText}>Next Question</Text>
                    </Pressable>
                </View>
            )}

            {/* Show Solution Without Selecting */}
            {!revealed && !selectedOption && (
                <Pressable style={styles.skipBtn} onPress={() => setRevealed(true)}>
                    <ChevronDown size={16} color="#64748B" />
                    <Text style={styles.skipText}>Show Solution</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 22,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 14,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    badge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#1D4ED8',
        letterSpacing: 0.5,
    },
    yearText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748B',
    },
    diffBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    diffText: {
        fontSize: 11,
        fontWeight: '800',
    },
    questionBox: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 16,
        marginBottom: 18,
        borderLeftWidth: 3,
        borderLeftColor: '#2563EB',
    },
    optionsContainer: {
        gap: 10,
        marginBottom: 16,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        gap: 12,
    },
    optionSelected: {
        borderColor: '#2563EB',
        backgroundColor: '#EFF6FF',
    },
    optionCorrect: {
        borderColor: '#059669',
        backgroundColor: '#ECFDF5',
    },
    optionWrong: {
        borderColor: '#DC2626',
        backgroundColor: '#FEF2F2',
    },
    optionCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    optionCircleCorrect: {
        backgroundColor: '#059669',
    },
    optionCircleWrong: {
        backgroundColor: '#DC2626',
    },
    optionLetter: {
        fontSize: 13,
        fontWeight: '800',
        color: '#64748B',
    },
    optionText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        lineHeight: 22,
    },
    optionTextCorrect: {
        color: '#065F46',
    },
    optionTextWrong: {
        color: '#991B1B',
    },
    // removed: inlineLatex style since we now use proper LaTeXText WebView
    revealBtn: {
        backgroundColor: '#2563EB',
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
        marginTop: 4,
    },
    revealBtnText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 15,
    },
    solutionBox: {
        backgroundColor: '#F0FDF4',
        borderRadius: 14,
        padding: 18,
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#86EFAC',
    },
    solutionHeader: {
        fontSize: 14,
        fontWeight: '900',
        color: '#15803D',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    solutionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#166534',
        lineHeight: 24,
    },
    skipBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 10,
        opacity: 0.6,
    },
    skipText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748B',
    },
    navRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        gap: 12,
    },
    navBtn: {
        flex: 1,
        backgroundColor: '#F1F5F9',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    navBtnText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#475569',
    },
});
