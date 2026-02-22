import { COLORS } from '@/constants/theme';
import { BookOpen, ChevronRight, Play, Star, Trophy } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

interface GlobalStatsHeroProps {
    totalProgress: number; // 0 to 100
    completedChapters: number;
    totalChapters: number;
    onResume: () => void;
    lastChapterTitle?: string;
}

export function GlobalStatsHero({
    totalProgress,
    completedChapters,
    totalChapters,
    onResume,
    lastChapterTitle = "Atomic Structure"
}: GlobalStatsHeroProps) {
    const { width } = useWindowDimensions();
    const isDesktop = width > 800;
    const isWide = width > 1200;

    return (
        <View style={[styles.container, !isDesktop && { padding: 16, borderRadius: 20 }]}>
            <View style={[styles.topSection, !isDesktop && { marginBottom: 16 }]}>
                <View style={styles.mainInfo}>
                    <Text style={styles.greeting}>Library Dashboard</Text>
                    <Text style={styles.subGreeting}>Continue your journey to mastery.</Text>
                </View>
                <View style={styles.badge}>
                    <Trophy size={16} color={COLORS.yellow} />
                    <Text style={styles.badgeText}>OG LEARNER</Text>
                </View>
            </View>

            <View style={[styles.statsGrid, !isWide && { flexDirection: 'column' }]}>
                <View style={[styles.mainStatBox, { width: isWide ? '60%' : '100%' }, !isDesktop && { padding: 16, gap: 16 }]}>
                    <View style={[styles.progressCircle, !isDesktop && { width: 64, height: 64, borderWidth: 4 }]}>
                        <Text style={[styles.progressValue, !isDesktop && { fontSize: 16 }]}>{totalProgress}%</Text>
                        <Text style={[styles.progressLabel, !isDesktop && { fontSize: 7 }]}>COMPLETE</Text>
                    </View>
                    <View style={styles.mainStatContent}>
                        <Text style={[styles.statTitle, !isDesktop && { fontSize: 15 }]}>Global Progress</Text>
                        <Text style={[styles.statDesc, !isDesktop && { fontSize: 12 }]} numberOfLines={2}>Mastered {completedChapters} of {totalChapters} chapters.</Text>
                    </View>
                </View>

                <View style={[styles.resumeCard, { width: isWide ? '35%' : '100%' }, !isDesktop && { padding: 16 }]}>
                    <View style={styles.resumeInfo}>
                        <View style={styles.resumeHeader}>
                            <Play size={12} color={COLORS.blue} fill={COLORS.blue} />
                            <Text style={styles.resumeLabel}>PICK UP WHERE YOU LEFT OFF</Text>
                        </View>
                        <Text style={styles.resumeTitle} numberOfLines={1}>{lastChapterTitle}</Text>
                    </View>
                    <Pressable style={styles.resumeBtn} onPress={onResume}>
                        <Text style={styles.resumeBtnText}>Resume</Text>
                        <ChevronRight size={16} color="#FFFFFF" strokeWidth={3} />
                    </Pressable>
                </View>
            </View>

            <View style={styles.miniStatsRow}>
                <View style={styles.miniStat}>
                    <Star size={14} color={COLORS.yellow} fill={COLORS.yellow} />
                    <Text style={styles.miniStatText}><Text style={styles.bold}>12</Text> Achievements</Text>
                </View>
                <View style={styles.miniDivider} />
                <View style={styles.miniStat}>
                    <BookOpen size={14} color={COLORS.blue} />
                    <Text style={styles.miniStatText}><Text style={styles.bold}>4</Text> Certifications</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    topSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    mainInfo: {
        gap: 4,
    },
    greeting: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1E293B',
        letterSpacing: -0.5,
    },
    subGreeting: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '600',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEFCE8',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FEF08A',
        gap: 6,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#854D0E',
        letterSpacing: 1,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 16,
        flexWrap: 'wrap',
    },
    mainStatBox: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 20,
        borderRadius: 20,
        gap: 20,
    },
    progressCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFFFFF',
        borderWidth: 6,
        borderColor: COLORS.blue,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressValue: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1E293B',
    },
    progressLabel: {
        fontSize: 8,
        fontWeight: '800',
        color: '#64748B',
    },
    mainStatContent: {
        flex: 1,
        gap: 4,
    },
    statTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B',
    },
    statDesc: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 18,
        fontWeight: '500',
    },
    resumeCard: {
        flex: 1,
        backgroundColor: '#EFF6FF',
        padding: 20,
        borderRadius: 20,
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    resumeInfo: {
        gap: 8,
    },
    resumeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    resumeLabel: {
        fontSize: 10,
        fontWeight: '900',
        color: COLORS.blue,
        letterSpacing: 0.5,
    },
    resumeTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
    },
    resumeBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.blue,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginTop: 12,
        gap: 6,
    },
    resumeBtnText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 14,
    },
    miniStatsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        gap: 16,
    },
    miniStat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    miniStatText: {
        fontSize: 13,
        color: '#475569',
        fontWeight: '500',
    },
    bold: {
        fontWeight: '800',
        color: '#1E293B',
    },
    miniDivider: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#CBD5E1',
    },
});
