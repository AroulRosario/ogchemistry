import { COLORS } from '@/constants/theme';
import { CheckCircle2, Flame, Shield, Trophy } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function RightSidebar() {
    return (
        <View style={styles.container}>
            {/* Daily Quests Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>DAILY QUESTS</Text>
                <View style={styles.card}>
                    <View style={styles.questItem}>
                        <View style={styles.questIcon}>
                            <Flame size={18} color={COLORS.orange} />
                        </View>
                        <View style={styles.questInfo}>
                            <Text style={styles.questText}>Complete 2 Lessons</Text>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: '50%', backgroundColor: COLORS.orange }]} />
                            </View>
                        </View>
                        <Text style={styles.questCount}>1/2</Text>
                    </View>

                    <View style={styles.questItem}>
                        <View style={styles.questIcon}>
                            <Trophy size={18} color={COLORS.yellow} />
                        </View>
                        <View style={styles.questInfo}>
                            <Text style={styles.questText}>Earn 50 XP</Text>
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: '80%', backgroundColor: COLORS.yellow }]} />
                            </View>
                        </View>
                        <Text style={styles.questCount}>40/50</Text>
                    </View>
                </View>
            </View>

            {/* League Section */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>GOLD LEAGUE</Text>
                    <Shield size={16} color={COLORS.yellow} />
                </View>
                <View style={styles.card}>
                    <View style={styles.leagueStanding}>
                        <Text style={styles.standingRank}>4th</Text>
                        <View style={styles.standingInfo}>
                            <Text style={styles.standingSub}>Top 5 advance to Platinum</Text>
                        </View>
                    </View>
                    <View style={styles.vDivider} />
                    <View style={styles.leagueTimer}>
                        <Text style={styles.timerText}>Ends in 2d 12h</Text>
                    </View>
                </View>
            </View>

            {/* Recent Achievements */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>RECENT BADGES</Text>
                <View style={styles.badgesGrid}>
                    <View style={styles.badgeItem}>
                        <View style={[styles.badgeIcon, { backgroundColor: '#F0FDFA' }]}>
                            <CheckCircle2 size={24} color="#0D9488" />
                        </View>
                        <Text style={styles.badgeName}>Novice</Text>
                    </View>
                    <View style={styles.badgeItem}>
                        <View style={[styles.badgeIcon, { backgroundColor: '#F5F3FF' }]}>
                            <Flame size={24} color="#7C3AED" />
                        </View>
                        <Text style={styles.badgeName}>7 Day</Text>
                    </View>
                </View>
            </View>

            {/* Platform Update */}
            <View style={styles.updateCard}>
                <Text style={styles.updateTitle}>New Lesson Out Now!</Text>
                <Text style={styles.updateBody}>Hydrocarbons part 2 is live. Check it out in the Library.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 300,
        padding: 24,
        gap: 32,
    },
    section: {
        gap: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sectionTitle: {
        fontFamily: 'System',
        fontWeight: '800',
        fontSize: 14,
        color: '#64748B',
        letterSpacing: 1,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    questItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    questIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    questInfo: {
        flex: 1,
        gap: 6,
    },
    questText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#F1F5F9',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    questCount: {
        fontSize: 12,
        fontWeight: '800',
        color: '#64748B',
    },
    leagueStanding: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    standingRank: {
        fontSize: 24,
        fontWeight: '900',
        color: COLORS.yellow,
    },
    standingInfo: {
        flex: 1,
    },
    standingSub: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
    },
    vDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 12,
    },
    leagueTimer: {
        alignItems: 'center',
    },
    timerText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#94A3B8',
    },
    badgesGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    badgeItem: {
        flex: 1,
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    badgeIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeName: {
        fontSize: 11,
        fontWeight: '800',
        color: '#64748B',
    },
    updateCard: {
        backgroundColor: '#EFF6FF',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#DBEAFE',
        gap: 8,
    },
    updateTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E40AF',
    },
    updateBody: {
        fontSize: 13,
        fontWeight: '600',
        color: '#3B82F6',
        lineHeight: 18,
    },
});
