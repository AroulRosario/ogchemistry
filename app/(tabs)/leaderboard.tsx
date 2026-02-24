import { DuoHeader } from '@/components/DuoHeader';
import { DynamicBackground } from '@/components/DynamicBackground';
import { EliteNavigation } from '@/components/EliteNavigation';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { supabase } from '@/constants/supabase';
import { COLORS, STYLES } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { Crown, Shield, Timer, Trophy } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

export default function LeaderboardScreen() {
    const { user } = useAuth();
    const { width } = useWindowDimensions();
    const isDesktop = width > 800;
    const isWide = width > 1200;
    const [leaders, setLeaders] = useState<any[]>([]);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        setLoading(true);
        try {
            const { data: leadersData } = await supabase
                .from('profiles')
                .select('*')
                .order('xp', { ascending: false })
                .limit(20);

            const { data: myProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
                .single();

            if (leadersData) setLeaders(leadersData);
            if (myProfile) setProfile(myProfile);
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
        } finally {
            setLoading(false);
        }
    };

    const LeagueHeader = () => (
        <View style={[styles.leagueCard, { padding: isDesktop ? 40 : 20, gap: isDesktop ? 32 : 20 }]}>
            <View style={[styles.leagueMain, !isDesktop && { flexWrap: 'wrap', gap: 16 }]}>
                <View style={styles.shieldWrapper}>
                    <Shield size={isDesktop ? 48 : 32} color={COLORS.yellow} fill={COLORS.yellow + '33'} />
                </View>
                <View style={{ flex: 1, minWidth: isDesktop ? 0 : 200 }}>
                    <Text style={[styles.leagueTitle, { fontSize: isDesktop ? 32 : 18 }]}>GOLD LEAGUE: ELITE DIVISION</Text>
                    <View style={styles.leagueTimer}>
                        <Timer size={14} color="#64748B" />
                        <Text style={[styles.leagueSubtitle, { fontSize: 13 }]}>Ends in 2 days • 12:44</Text>
                    </View>
                </View>
                <View style={[styles.trophyBadge, !isDesktop && { width: '100%', justifyContent: 'center', marginTop: 8 }]}>
                    <Trophy size={18} color={COLORS.yellow} />
                    <View>
                        <Text style={styles.trophyCount}>Top 10 Promoted</Text>
                    </View>
                </View>
            </View>

        </View>
    );

    const PodiumSection = () => {
        if (leaders.length < 3) return null;
        const [first, second, third] = leaders;

        return (
            <View style={[styles.podiumContainer, !isDesktop && { height: 260, marginTop: 40 }]}>
                {/* 2nd Place */}
                <View style={[styles.podiumCol, styles.podiumCol2, !isDesktop && { height: 180 }]}>
                    <View style={styles.podiumAvatarWrapper}>
                        <Text style={styles.podiumEmoji}>🥈</Text>
                        <View style={[styles.podiumAvatar, { borderColor: '#94A3B8', width: isDesktop ? 100 : 70, height: isDesktop ? 100 : 70, borderRadius: isDesktop ? 50 : 35, borderWidth: isDesktop ? 6 : 4 }]}>
                            <Text style={[styles.avatarEmojiMed, !isDesktop && { fontSize: 32 }]}>👩‍🔬</Text>
                        </View>
                    </View>
                    <View style={[styles.podiumBase, { height: 90, backgroundColor: '#E2E8F0' }]}>
                        <Text style={styles.podiumName} numberOfLines={1}>{second.full_name?.split(' ')[0]}</Text>
                        <Text style={styles.podiumXP}>{second.xp} XP</Text>
                        <View style={styles.rankBadgeSmall}>
                            <Text style={styles.rankTextSmall}>2</Text>
                        </View>
                    </View>
                </View>

                {/* 1st Place */}
                <View style={[styles.podiumCol, styles.podiumCol1, !isDesktop && { height: 220 }, !isDesktop && { marginHorizontal: -10 }]}>
                    <View style={styles.podiumAvatarWrapper}>
                        <Crown size={40} color={COLORS.yellow} fill={COLORS.yellow} style={styles.crown} />
                        <View style={[styles.podiumAvatar, { borderColor: COLORS.yellow, width: isDesktop ? 110 : 80, height: isDesktop ? 110 : 80, borderRadius: isDesktop ? 55 : 40, borderWidth: isDesktop ? 6 : 4 }]}>
                            <Text style={[styles.avatarEmojiMed, { fontSize: isDesktop ? 56 : 40 }]}>👨‍🔬</Text>
                        </View>
                    </View>
                    <View style={[styles.podiumBase, { height: 140, backgroundColor: '#FEF3C7' }]}>
                        <Text style={[styles.podiumName, { fontSize: 20 }]} numberOfLines={1}>{first.full_name?.split(' ')[0]}</Text>
                        <Text style={[styles.podiumXP, { fontSize: 18 }]}>{first.xp} XP</Text>
                        <View style={[styles.rankBadgeSmall, { backgroundColor: COLORS.yellow, width: 40, height: 40, borderRadius: 20 }]}>
                            <Text style={[styles.rankTextSmall, { color: '#92400E', fontSize: 16 }]}>1</Text>
                        </View>
                    </View>
                </View>

                {/* 3rd Place */}
                <View style={[styles.podiumCol, styles.podiumCol3, !isDesktop && { height: 160 }]}>
                    <View style={styles.podiumAvatarWrapper}>
                        <Text style={styles.podiumEmoji}>🥉</Text>
                        <View style={[styles.podiumAvatar, { borderColor: '#B45309', width: isDesktop ? 100 : 70, height: isDesktop ? 100 : 70, borderRadius: isDesktop ? 50 : 35, borderWidth: isDesktop ? 6 : 4 }]}>
                            <Text style={[styles.avatarEmojiMed, !isDesktop && { fontSize: 32 }]}>🧑‍🔬</Text>
                        </View>
                    </View>
                    <View style={[styles.podiumBase, { height: 70, backgroundColor: '#FDE68A' }]}>
                        <Text style={styles.podiumName} numberOfLines={1}>{third.full_name?.split(' ')[0]}</Text>
                        <Text style={styles.podiumXP}>{third.xp} XP</Text>
                        <View style={[styles.rankBadgeSmall, { backgroundColor: '#B45309' }]}>
                            <Text style={styles.rankTextSmall}>3</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const renderLeader = ({ item, index }: { item: any; index: number }) => {
        if (index < 3) return null;

        const isMe = item.id === user?.id;
        const rank = index + 1;

        return (
            <Pressable style={[styles.leaderItem, isMe && styles.meItem, !isDesktop && { padding: 16 }]}>
                <View style={styles.rankContainer}>
                    <Text style={styles.rankText}>{rank}</Text>
                </View>

                <View style={styles.avatarCircle}>
                    <Text style={styles.avatarEmoji}>{index % 2 === 0 ? '👨‍🔬' : '👩‍🔬'}</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.nameText} numberOfLines={1}>{item.full_name || 'Anonymous Learner'}</Text>
                    <View style={styles.streakRow}>
                        <Text style={styles.streakText}>🔥 {item.streak_count || 0} Day Streak</Text>
                        {index < 10 && <View style={styles.promoBadge}><Text style={styles.promoText}>PROMOTION ZONE</Text></View>}
                    </View>
                </View>

                <View style={styles.xpBox}>
                    <Text style={styles.xpTextValue}>{item.xp || 0}</Text>
                    <Text style={styles.xpLabelTag}>TOTAL XP</Text>
                </View>
            </Pressable>
        );
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={COLORS.blue} />
            </View>
        );
    }

    return (
        <DynamicBackground>
            <EliteNavigation />

            <View style={[styles.mainContent, isDesktop && styles.desktopMainContent]}>
                <DuoHeader
                    streak={profile?.streak_count || 0}
                    xp={profile?.xp || 0}
                    gems={profile?.gems || 0}
                />

                <ResponsiveContainer fullWidth>
                    <FlatList
                        data={leaders}
                        ListHeaderComponent={() => (
                            <View style={[styles.headerArea, !isDesktop && { paddingHorizontal: 4 }]}>
                                <LeagueHeader />
                                <PodiumSection />
                            </View>
                        )}
                        renderItem={renderLeader}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={[styles.scroll, !isDesktop && { paddingHorizontal: 4 }]}
                        showsVerticalScrollIndicator={false}
                    />
                </ResponsiveContainer>
            </View>
        </DynamicBackground>
    );
}

const styles = StyleSheet.create({
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
    mainContent: { flex: 1, backgroundColor: '#F8FAFC' },
    desktopMainContent: { paddingLeft: 260 },
    scroll: { paddingBottom: 60, width: '100%', alignSelf: 'center' },
    headerArea: { paddingBottom: 40 },

    leagueCard: {
        marginTop: 24,
        padding: 40,
        backgroundColor: '#FFF',
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5,
    },
    leagueMain: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 28,
    },
    shieldWrapper: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: '#FFFBEB',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FEF3C7',
    },
    leagueTitle: {
        fontFamily: 'System',
        fontWeight: '900',
        fontSize: 32,
        color: '#1E293B',
        letterSpacing: -1,
    },
    leagueTimer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 6,
    },
    leagueSubtitle: {
        fontSize: 16,
        color: '#64748B',
        fontWeight: '700',
    },
    trophyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 20,
    },
    trophyCount: {
        fontSize: 16,
        fontWeight: '900',
        color: '#92400E',
    },
    trophySub: {
        fontSize: 11,
        fontWeight: '800',
        color: '#B45309',
        letterSpacing: 0.5,
    },

    modeToggle: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        padding: 6,
        borderRadius: 20,
        gap: 6,
    },
    toggleBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 14,
        borderRadius: 16,
    },
    toggleBtnActive: {
        backgroundColor: COLORS.blue,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    toggleText: {
        fontSize: 15,
        fontWeight: '900',
        color: '#64748B',
    },
    toggleTextActive: {
        color: '#FFF',
    },

    podiumContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginTop: 60,
        marginBottom: 40,
        height: 320,
    },
    podiumCol: {
        flex: 1,
        alignItems: 'center',
        maxWidth: 240,
    },
    podiumCol1: { zIndex: 3, marginHorizontal: -20 },
    podiumCol2: { zIndex: 2 },
    podiumCol3: { zIndex: 1 },

    podiumAvatarWrapper: {
        alignItems: 'center',
        marginBottom: 15,
    },
    podiumAvatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFF',
        borderWidth: 6,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,
    },
    podiumEmoji: { position: 'absolute', top: -15, left: -10, fontSize: 36, zIndex: 4 },
    crown: { position: 'absolute', top: -45, zIndex: 4 },
    avatarEmojiMed: { fontSize: 48 },

    podiumBase: {
        width: '100%',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        alignItems: 'center',
        paddingTop: 20,
        paddingHorizontal: 12,
        ...STYLES.card,
    },
    podiumName: {
        fontSize: 16,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -0.5,
    },
    podiumXP: {
        fontSize: 15,
        fontWeight: '900',
        color: COLORS.blue,
        marginTop: 4,
    },
    rankBadgeSmall: {
        position: 'absolute',
        bottom: -20,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#64748B',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#FFF',
    },
    rankTextSmall: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '900',
    },

    leaderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#FFF',
        marginBottom: 16,
        gap: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    meItem: {
        borderColor: '#60A5FA',
        backgroundColor: '#EFF6FF',
        shadowOpacity: 0.08,
    },
    rankContainer: {
        width: 44,
        alignItems: 'center',
    },
    rankText: {
        fontSize: 22,
        fontWeight: '900',
        color: '#94A3B8',
    },
    avatarCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    avatarEmoji: { fontSize: 32 },
    infoContainer: {
        flex: 1,
        gap: 4,
    },
    nameText: {
        fontSize: 19,
        fontWeight: '900',
        color: '#1E293B',
        letterSpacing: -0.5,
    },
    streakRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    streakText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.orange,
    },
    promoBadge: {
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    promoText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#059669',
    },
    xpBox: {
        alignItems: 'flex-end',
    },
    xpTextValue: {
        fontSize: 24,
        fontWeight: '900',
        color: COLORS.blue,
    },
    xpLabelTag: {
        fontSize: 11,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 0.5,
    },
});
