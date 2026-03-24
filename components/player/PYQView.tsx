import { LaTeXText } from '@/components/LaTeXText';
import { COLORS, STYLES, SHADOWS } from '@/constants/theme';
import { CheckCircle, ChevronDown, BookOpen, Layers } from 'lucide-react-native';
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
        case 'Easy': return { bg: '#D1FAE5', text: '#065F46', border: '#10B981' };
        case 'Hard': return { bg: '#FEE2E2', text: '#991B1B', border: '#EF4444' };
        default: return { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' }; // Medium
    }
}

export function PYQView({ data }: PYQViewProps) {
    const questions = data.questions || [data];

    return (
        <View style={styles.listContainer}>
            {/* List Header */}
            <View style={styles.listHeader}>
                <View style={styles.headerIcon}>
                    <Layers size={20} color="#FFF" />
                </View>
                <View>
                    <Text style={styles.listTitle}>Practice Set: {data.title || 'PYQs'}</Text>
                    <Text style={styles.listSubTitle}>{questions.length} Questions in this module</Text>
                </View>
            </View>

            {questions.map((q, idx) => (
                <PYQItem key={idx} data={q} index={idx} total={questions.length} />
            ))}
            
            <View style={styles.footerNote}>
                <BookOpen size={14} color="#64748B" />
                <Text style={styles.footerNoteText}>End of Practice Module</Text>
            </View>
        </View>
    );
}

function PYQItem({ data, index, total }: { data: PYQData, index: number, total: number }) {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [revealed, setRevealed] = useState(false);

    const diffColor = getDifficultyColor(data.difficulty);
    const isCorrect = (option: string) => revealed && option === data.answer;
    const isWrong = (option: string) => revealed && option === selectedOption && option !== data.answer;

    return (
        <View style={styles.itemCard}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={[styles.badge, { backgroundColor: COLORS.blue }]}>
                        <Text style={[styles.badgeText, { color: '#FFF' }]}>Q{index + 1}</Text>
                    </View>
                    {data.exam && (
                        <View style={[styles.badge, { backgroundColor: '#F1F5F9' }]}>
                            <Text style={[styles.badgeText, { color: '#475569' }]}>{data.exam}</Text>
                        </View>
                    )}
                    {data.year && (
                        <Text style={styles.yearText}>{data.year}</Text>
                    )}
                </View>
                {data.difficulty && (
                    <View style={[styles.diffBadge, { backgroundColor: diffColor.bg, borderColor: diffColor.border }]}>
                        <Text style={[styles.diffText, { color: diffColor.text }]}>{data.difficulty.toUpperCase()}</Text>
                    </View>
                )}
            </View>

            {/* Question */}
            <View style={styles.questionBox}>
                <LaTeXText
                    text={data.question || 'No question data available.'}
                    fontSize={17}
                    color="#1E293B"
                    fontWeight="700"
                    style={{ minHeight: 60 }}
                />
            </View>

            {/* Options */}
            {data.options && data.options.length > 0 && (
                <View style={styles.optionsContainer}>
                    {data.options.map((option, i) => {
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
                                <LaTeXText 
                                    text={option.replace(/^[A-D]\. */, '')} 
                                    fontSize={15} 
                                    color={correct ? '#065F46' : wrong ? '#991B1B' : '#334155'} 
                                    fontWeight="600" 
                                    style={{ flex: 1 }} 
                                />
                                {correct && <CheckCircle size={20} color="#059669" style={{ marginLeft: 'auto' }} />}
                            </Pressable>
                        );
                    })}
                </View>
            )}

            {/* Reveal Button */}
            {!revealed && selectedOption && (
                <Pressable style={styles.revealBtn} onPress={() => setRevealed(true)}>
                    <Text style={styles.revealBtnText}>VERIFY ANSWER</Text>
                </Pressable>
            )}

            {/* Solution */}
            {revealed && data.solution && (
                <View style={styles.solutionBox}>
                    <View style={styles.solutionHeaderRow}>
                        <Text style={styles.solutionHeader}>📖 DETAILED SOLUTION</Text>
                        <Pressable onPress={() => setRevealed(false)}>
                            <Text style={styles.hideText}>Hide</Text>
                        </Pressable>
                    </View>
                    <LaTeXText text={data.solution} fontSize={15} color="#166534" fontWeight="500" style={{ minHeight: 40 }} />
                </View>
            )}

            {/* Show Solution Without Selecting */}
            {!revealed && !selectedOption && (
                <Pressable style={styles.skipBtn} onPress={() => setRevealed(true)}>
                    <ChevronDown size={14} color="#64748B" />
                    <Text style={styles.skipText}>Show Solution</Text>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    listContainer: {
        width: '100%',
        gap: 24,
    },
    listHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 8,
        paddingHorizontal: 4,
    },
    headerIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: COLORS.blue,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.sm,
    },
    listTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1E293B',
    },
    listSubTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748B',
    },
    itemCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        padding: 28,
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    yearText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#94A3B8',
    },
    diffBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
    },
    diffText: {
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    questionBox: {
        backgroundColor: '#F8FAFC',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    optionsContainer: {
        gap: 12,
        marginBottom: 20,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 18,
        padding: 16,
        borderWidth: 2,
        borderColor: '#F1F5F9',
        gap: 14,
    },
    optionSelected: {
        borderColor: COLORS.blue,
        backgroundColor: '#F0F7FF',
    },
    optionCorrect: {
        borderColor: '#10B981',
        backgroundColor: '#ECFDF5',
    },
    optionWrong: {
        borderColor: '#EF4444',
        backgroundColor: '#FEF2F2',
    },
    optionCircle: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    optionCircleCorrect: {
        backgroundColor: '#10B981',
    },
    optionCircleWrong: {
        backgroundColor: '#EF4444',
    },
    optionLetter: {
        fontSize: 14,
        fontWeight: '900',
        color: '#64748B',
    },
    revealBtn: {
        backgroundColor: COLORS.blue,
        borderRadius: 16,
        padding: 18,
        alignItems: 'center',
        marginTop: 8,
        ...SHADOWS.sm,
    },
    revealBtnText: {
        color: '#fff',
        fontWeight: '900',
        fontSize: 14,
        letterSpacing: 1.5,
    },
    solutionBox: {
        backgroundColor: '#F0FDF4',
        borderRadius: 20,
        padding: 24,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#B9F6CA',
    },
    solutionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    solutionHeader: {
        fontSize: 12,
        fontWeight: '950',
        color: '#15803D',
        letterSpacing: 1,
    },
    hideText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#166534',
        opacity: 0.6,
    },
    skipBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        marginTop: 8,
    },
    skipText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#94A3B8',
    },
    footerNote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 32,
        opacity: 0.5,
    },
    footerNoteText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748B',
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
});
