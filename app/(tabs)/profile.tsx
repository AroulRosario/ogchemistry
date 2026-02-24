import { DuoHeader } from '@/components/DuoHeader';
import { DynamicBackground } from '@/components/DynamicBackground';
import { EliteNavigation } from '@/components/EliteNavigation';
import { CertificateCard } from '@/components/gamification/CertificateCard';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { supabase } from '@/constants/supabase';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Award, Calendar, CheckCircle2, ChevronRight, Settings, Zap } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isDesktop = width > 800;
    const isWide = width > 1200;
    const [profile, setProfile] = useState<any>(null);
    const [certificates, setCertificates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
                .single();
            if (data) setProfile(data);

            const { data: certData } = await supabase
                .from('certificates')
                .select('*, lessons(title)')
                .eq('user_id', user?.id);
            if (certData) setCertificates(certData);
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const HeroSection = () => (
        <View style={[styles.heroCard, !isDesktop && { padding: 16, borderRadius: 20 }]}>
            <View style={[styles.heroContent, !isDesktop && { gap: 12 }]}>
                <View style={[styles.avatarWrapper, !isDesktop && { width: 60, height: 60, borderRadius: 30 }]}>
                    <Text style={[styles.avatarEmoji, !isDesktop && { fontSize: 28 }]}>🎓</Text>
                </View>
                <View style={[styles.heroInfo, { flex: 1 }]}>
                    <Text
                        style={[styles.heroName, !isDesktop && { fontSize: 22, letterSpacing: -0.5 }]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    >
                        {profile?.full_name || 'Student Model'}
                    </Text>
                    <Text style={[styles.heroEmail, !isDesktop && { fontSize: 13 }]} numberOfLines={1}>{profile?.email || user?.email}</Text>
                    <View style={[styles.statusBadge, !isDesktop && { paddingHorizontal: 10, paddingVertical: 4, marginTop: 6 }]}>
                        <CheckCircle2 size={isDesktop ? 14 : 11} color="#059669" />
                        <Text style={[styles.statusText, !isDesktop && { fontSize: 10 }]}>ELITE LEARNER</Text>
                    </View>
                </View>
            </View>
            <Pressable style={[styles.settingsBtn, !isDesktop && { padding: 4 }]}>
                <Settings size={isDesktop ? 22 : 16} color="#64748B" />
            </Pressable>
        </View>
    );

    const AchievementGallery = () => (
        <View style={[styles.sectionCard, { flex: 1.5 }]}>
            <View style={styles.sectionHeader}>
                <Award size={20} color={COLORS.blue} />
                <Text style={styles.sectionTitle}>Achievement Gallery</Text>
            </View>
            <View style={styles.achievementGrid}>
                {[
                    { icon: '🔥', label: 'Started Streak', color: profile?.streak_count >= 1 ? '#FFF7ED' : '#F1F5F9', unlocked: profile?.streak_count >= 1 },
                    { icon: '🧪', label: '100 XP Club', color: profile?.xp >= 100 ? '#F0F9FF' : '#F1F5F9', unlocked: profile?.xp >= 100 },
                    { icon: '💎', label: 'First Gem', color: profile?.gems >= 1 ? '#FAF5FF' : '#F1F5F9', unlocked: profile?.gems >= 1 },
                    { icon: '⭐', label: '500 XP Elite', color: profile?.xp >= 500 ? '#FEFCE8' : '#F1F5F9', unlocked: profile?.xp >= 500 },
                    { icon: '📚', label: 'Scholar', color: certificates.length >= 1 ? '#F0FDF4' : '#F1F5F9', unlocked: certificates.length >= 1 },
                    { icon: '🏆', label: 'Master', color: certificates.length >= 5 ? '#FFF1F2' : '#F1F5F9', unlocked: certificates.length >= 5 },
                ].map((item, i) => (
                    <View key={i} style={[styles.achievementBadge, { backgroundColor: item.color, opacity: item.unlocked ? 1 : 0.4 }]}>
                        <Text style={styles.achievementIcon}>{item.icon}</Text>
                        <Text style={styles.achievementLabel}>{item.label}</Text>
                    </View>
                ))}
            </View>
        </View>
    );

    const SkillMastery = () => {
        // Simple logic to map global XP to some specific bars to look active
        const baseXP = profile?.xp || 0;
        const orgProg = Math.min(100, (baseXP / 100) * 100);
        const inorgProg = Math.min(100, (baseXP / 200) * 100);
        const bioProg = Math.min(100, (baseXP / 500) * 100);
        const physProg = Math.min(100, (baseXP / 1000) * 100);

        return (
            <View style={[styles.sectionCard, !isDesktop && { padding: 16 }]}>
                <View style={styles.sectionHeader}>
                    <Zap size={20} color={COLORS.yellow} fill={COLORS.yellow} />
                    <Text style={[styles.sectionTitle, { lineHeight: 24 }]}>Skill Visualization</Text>
                </View>
                <View style={styles.skillList}>
                    {[
                        { label: 'Organic Chemistry', value: isNaN(orgProg) ? 0 : Math.round(orgProg), color: COLORS.blue },
                        { label: 'Inorganic Chemistry', value: isNaN(inorgProg) ? 0 : Math.round(inorgProg), color: COLORS.red },
                        { label: 'Biochemistry', value: isNaN(bioProg) ? 0 : Math.round(bioProg), color: '#10B981' },
                        { label: 'Physical Chemistry', value: isNaN(physProg) ? 0 : Math.round(physProg), color: COLORS.yellow },
                    ].map((skill, i) => (
                        <View key={i} style={styles.skillItem}>
                            <View style={styles.skillInfo}>
                                <Text style={styles.skillLabel}>{skill.label}</Text>
                                <Text style={styles.skillValue}>{skill.value}%</Text>
                            </View>
                            <View style={styles.skillTrack}>
                                <View style={[styles.skillFill, { width: `${skill.value}%`, backgroundColor: skill.color }]} />
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    const ConsistencyHeatmap = () => (
        <View style={[styles.sectionCard, !isDesktop && { padding: 24 }]}>
            <View style={styles.sectionHeader}>
                <Calendar size={20} color="#6366F1" />
                <Text style={styles.sectionTitle}>Learning Consistency</Text>
            </View>
            <View style={styles.heatmapContainer}>
                <View style={styles.heatmapRow}>
                    {Array.from({ length: 14 }).map((_, i) => {
                        // Color the last few days if streak > 0
                        let streakColor = '#F1F5F9';
                        if (profile?.streak_count > 0 && i >= (14 - profile.streak_count)) {
                            streakColor = '#3B82F6';
                        }

                        return (
                            <View
                                key={i}
                                style={[
                                    styles.heatmapCell,
                                    { backgroundColor: streakColor }
                                ]}
                            />
                        );
                    })}
                </View>
                <Text style={styles.heatmapHelper}>Last 2 weeks of activity</Text>
            </View>
        </View>
    );

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

            <View style={[styles.mainContent, isDesktop && styles.desktopMainContent, !isDesktop && { paddingTop: 0 }]}>
                <DuoHeader
                    streak={profile?.streak_count || 0}
                    xp={profile?.xp || 0}
                    gems={profile?.gems || 0}
                />

                <ScrollView
                    contentContainerStyle={[
                        styles.scroll,
                        { paddingHorizontal: isDesktop ? 0 : 4 }, // Unified 4px gutter
                        !isDesktop && { paddingVertical: 16 }
                    ]}
                    showsVerticalScrollIndicator={false}
                >
                    <ResponsiveContainer fullWidth>
                        <View style={[styles.dashboardLayout, !isDesktop && { gap: 20 }]}>
                            <HeroSection />

                            <View style={[styles.statsRow, !isDesktop && { flexDirection: 'column', gap: 16 }]}>
                                <View style={{ width: (isWide && isDesktop) ? '48%' : '100%' }}>
                                    <SkillMastery />
                                </View>
                                <View style={{ width: (isWide && isDesktop) ? '48%' : '100%' }}>
                                    <AchievementGallery />
                                </View>
                            </View>

                            <View style={[styles.columns, !isDesktop && { flexDirection: 'column', gap: 16 }]}>
                                <View style={[styles.mainColumn, { width: (isDesktop) ? '63%' : '100%', flex: isDesktop ? 2.2 : 0 }]}>
                                    <ConsistencyHeatmap />
                                    <View style={{ height: 16 }} />
                                    <View style={[styles.sectionCard, !isDesktop && { padding: 16 }]}>
                                        <Text style={styles.sectionTitle}>Certifications</Text>
                                        {certificates.length > 0 ? (
                                            certificates.map(cert => (
                                                <CertificateCard
                                                    key={cert.id}
                                                    certificate={cert}
                                                    courseName={cert.lessons?.title || 'Elite Course'}
                                                />
                                            ))
                                        ) : (
                                            <View style={styles.emptyState}>
                                                <Text style={styles.emptyStateText}>Gain mastery to unlock certificates!</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>

                                <View style={[styles.sideColumn, { width: (isDesktop) ? '33%' : '100%', flex: isDesktop ? 1 : 0 }]}>
                                    <View style={[styles.actionCard, !isDesktop && { padding: 24 }]}>
                                        <Text style={styles.actionCardTitle}>Ready for more?</Text>
                                        <Text style={styles.actionCardBody}>Your path is calling. Complete the next milestone today.</Text>
                                        <Pressable
                                            style={styles.actionBtn}
                                            onPress={() => router.push('/')}
                                        >
                                            <Text style={styles.actionBtnText}>Let's Go</Text>
                                            <ChevronRight size={18} color="#FFF" />
                                        </Pressable>
                                    </View>
                                </View>
                            </View>

                            <Pressable style={styles.logoutBtn} onPress={() => signOut()}>
                                <Text style={styles.logoutText}>Sign Out Account</Text>
                            </Pressable>
                        </View>
                    </ResponsiveContainer>
                </ScrollView>
            </View>
        </DynamicBackground>
    );
}

const styles = StyleSheet.create({
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
    mainContent: { flex: 1, backgroundColor: '#F8FAFC' },
    desktopMainContent: { paddingLeft: 260 },
    scroll: { paddingVertical: 32 },
    dashboardLayout: {
        gap: 24,
        width: '100%',
    },

    heroCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: 40,
        backgroundColor: COLORS.white,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 2,
    },
    heroContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 32,
    },
    avatarWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarEmoji: { fontSize: 56 },
    heroInfo: { gap: 6 },
    heroName: {
        fontFamily: 'System',
        fontWeight: '900',
        fontSize: 42,
        color: '#0F172A',
        letterSpacing: -1.5,
    },
    heroEmail: {
        fontSize: 18,
        fontWeight: '700',
        color: '#64748B',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 16,
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    statusText: { fontSize: 13, fontWeight: '900', color: '#065F46', letterSpacing: 0.5 },
    settingsBtn: {
        padding: 14,
        borderRadius: 16,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },

    statsRow: {
        flexDirection: 'row',
        gap: 24,
        flexWrap: 'wrap',
        width: '100%',
    },
    sectionCard: {
        flex: 1,
        padding: 24,
        backgroundColor: COLORS.white,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1E293B',
        letterSpacing: -0.5,
    },

    achievementGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    achievementBadge: {
        width: '30%',
        aspectRatio: 1,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        gap: 10,
    },
    achievementIcon: { fontSize: 32 },
    achievementLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#1E293B',
        textAlign: 'center',
    },

    skillList: { gap: 20 },
    skillItem: { gap: 10 },
    skillInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    skillLabel: { fontSize: 13, fontWeight: '800', color: '#475569', flex: 1 },
    skillValue: { fontSize: 15, fontWeight: '900', color: '#1E293B' },
    skillTrack: {
        height: 10,
        backgroundColor: '#F1F5F9',
        borderRadius: 5,
        overflow: 'hidden',
    },
    skillFill: {
        height: '100%',
        borderRadius: 5,
    },

    heatmapContainer: {
        alignItems: 'center',
        gap: 16,
    },
    heatmapRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    heatmapCell: {
        width: 18,
        height: 18,
        borderRadius: 4,
    },
    heatmapHelper: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '700',
        marginTop: 8,
    },

    columns: {
        flexDirection: 'row',
        gap: 24,
        flexWrap: 'wrap',
        width: '100%',
    },
    mainColumn: { flex: 2.2 },
    sideColumn: { flex: 1 },

    emptyState: {
        paddingVertical: 60,
        alignItems: 'center',
    },
    emptyStateText: {
        color: '#94A3B8',
        fontSize: 16,
        fontWeight: '700',
    },

    actionCard: {
        padding: 40,
        backgroundColor: COLORS.blue,
        borderRadius: 32,
        gap: 16,
    },
    actionCardTitle: { fontWeight: '900', fontSize: 28, color: '#FFF', letterSpacing: -1 },
    actionCardBody: { fontSize: 17, color: '#E0F2FE', fontWeight: '600', lineHeight: 26, marginBottom: 16 },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: COLORS.black,
        paddingVertical: 16,
        borderRadius: 20,
    },
    actionBtnText: { fontWeight: '900', fontSize: 17, color: '#FFF' },

    logoutBtn: {
        marginTop: 60,
        padding: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#FEE2E2',
        borderRadius: 24,
        alignItems: 'center',
        alignSelf: 'center',
        width: '100%',
        maxWidth: 300,
        marginBottom: 60,
    },
    logoutText: { fontWeight: '800', fontSize: 15, color: COLORS.red },
});
