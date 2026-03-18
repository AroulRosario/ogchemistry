import { AnimatedCard } from '@/components/AnimatedCard';
import { DuoHeader } from '@/components/DuoHeader';
import { EliteNavigation } from '@/components/EliteNavigation';
import { PathNode } from '@/components/PathNode';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { RightSidebar } from '@/components/RightSidebar';
import { supabase } from '@/constants/supabase';
import { COLORS, STYLES } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Sparkles, Trophy } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 600;
  const isDesktop = width > 800;
  const isWide = width > 1200;
  const [rawLessons, setRawLessons] = useState<any[]>([]);
  const [stats, setStats] = useState({ streak_count: 0, xp: 0, gems: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [{ data: profile }, { data: lessonsData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user?.id).single(),
        supabase.from('lessons').select('*, chapters(*)').order('order')
      ]);

      if (profile) setStats(profile);
      if (lessonsData) setRawLessons(lessonsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const flatPath = useMemo(() => {
    const path: any[] = [];
    rawLessons.forEach(lesson => {
      const sorted = (lesson.chapters || []).sort((a: any, b: any) => a.order - b.order);
      sorted.forEach((ch: any) => path.push({ ...ch, lessonTitle: lesson.title }));
    });
    return path;
  }, [rawLessons]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.blue} />
      </View>
    );
  }

  return (
    <View style={styles.main}>
      <EliteNavigation />

      <View style={[styles.contentArea, isDesktop && styles.desktopContentArea]}>
        <DuoHeader streak={stats.streak_count} xp={stats.xp} gems={stats.gems} />

        <View style={styles.layoutContainer}>
          <ScrollView
            contentContainerStyle={[
              styles.scroll,
              { paddingHorizontal: isMobile ? 0 : 0 }
            ]}
            showsVerticalScrollIndicator={false}
          >
          <ResponsiveContainer fullWidth scrollable={false}>
            <View style={styles.dashboardLayout}>
                {/* Welcome Hero - Fluid */}
                <View style={styles.heroSection}>
                  <View style={[styles.heroContent, !isDesktop && { flexDirection: 'column', alignItems: 'flex-start', gap: 16 }]}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.heroGreeting, !isDesktop && { fontSize: 24 }]}>Welcome back, {user?.email?.split('@')[0] || 'Chemist'}! 👋</Text>
                      <Text style={styles.heroSub}>You're on a {stats.streak_count} day streak. Master the next chapter to hit Gold!</Text>
                    </View>
                    <View style={styles.heroStats}>
                      <View style={styles.miniStat}>
                        <Trophy size={20} color={COLORS.yellow} />
                        <View>
                          <Text style={styles.miniStatValue}>TOP 5%</Text>
                          <Text style={styles.miniStatLabel}>This Week</Text>
                        </View>
                      </View>
                      <View style={styles.miniDivider} />
                      <View style={styles.miniStat}>
                        <Sparkles size={20} color={COLORS.blue} />
                        <View>
                          <Text style={styles.miniStatValue}>+450 XP</Text>
                          <Text style={styles.miniStatLabel}>Past 24h</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.pathWrapper}>
                  <View style={styles.journeyHeader}>
                    <View style={styles.missionBadge}>
                      <Text style={styles.missionBadgeText}>CURRENT MISSION</Text>
                    </View>
                    <Text style={styles.journeyTitle}>THE ORGANIC ODYSSEY</Text>
                    <View style={styles.journeyProgress}>
                      <View style={[styles.journeyBar, { width: '45%' }]} />
                      <Text style={styles.journeyPercent}>45% Complete</Text>
                    </View>
                  </View>

                  {flatPath.length === 0 ? (
                    <View style={styles.emptyCard}>
                      <Text style={styles.emptyText}>No training modules found yet, Recruit!</Text>
                    </View>
                  ) : (
                    <View style={styles.timelineWrapper}>
                      {flatPath.map((item, index) => (
                        <View key={item.id} style={{ width: '100%' }}>
                          {index % 4 === 0 && index !== 0 && (
                            <View style={styles.milestoneMarker}>
                              <View style={styles.milestoneBadge}>
                                <Text style={styles.milestoneText}>UNIVERSE {Math.floor(index / 4) + 1}</Text>
                              </View>
                            </View>
                          )}
                          <AnimatedCard delay={index * 100}>
                            <PathNode
                              index={index}
                              title={item.title || item.data?.title}
                              type="chapter"
                              isLocked={index > 0}
                              isCompleted={false}
                              isLastNode={index === flatPath.length - 1}
                              onPress={() => router.push(`/chapter/${item.id}`)}
                            />
                          </AnimatedCard>
                        </View>
                      ))}
                    </View>
                  )}
                  
                <View style={styles.pathFooter}>
                  <View style={styles.finishFlag}>
                    <Text style={styles.finishText}>THE MASTER LAB AWAITS...</Text>
                  </View>
                </View>
              </View>
            </View>
          </ResponsiveContainer>
        </ScrollView>

          {isWide && <RightSidebar />}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  contentArea: { flex: 1 },
  desktopContentArea: { paddingLeft: 260 },
  layoutContainer: { flex: 1, flexDirection: 'row' },
  dashboardLayout: { flex: 1, paddingBottom: 60 },
  scroll: { flexGrow: 1 },
  scrollContent: { flexGrow: 1 },
  heroSection: {
    ...STYLES.card,
    marginTop: 24,
    padding: 32,
    shadowOpacity: 0.04,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 24,
  },
  heroGreeting: {
    fontSize: Platform.OS === 'web' ? 32 : 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -1,
  },
  heroSub: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 6,
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 20,
    gap: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  miniStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  miniStatValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1E293B',
  },
  miniStatLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  miniDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
  },
  pathWrapper: {
    paddingVertical: 60,
    alignItems: 'center',
    minHeight: 1200,
    width: '100%',
  },
  journeyHeader: {
    alignItems: 'center',
    marginBottom: 60,
    width: '100%',
  },
  missionBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
  },
  missionBadgeText: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.blue,
    letterSpacing: 1.5,
  },
  journeyTitle: {
    fontFamily: 'Bangers_400Regular',
    fontSize: Platform.OS === 'web' ? 56 : 42,
    color: '#111827',
    textAlign: 'center',
    letterSpacing: 2,
    lineHeight: Platform.OS === 'web' ? 60 : 48,
    textTransform: 'uppercase',
  },
  journeyProgress: {
    width: 300,
    height: 40,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    marginTop: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  journeyBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.blue,
  },
  journeyPercent: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1E293B',
    zIndex: 1,
  },
  timelineWrapper: {
    width: '100%',
    maxWidth: 800,
    alignItems: 'flex-start',
    alignSelf: 'center',
    paddingVertical: 20,
  },
  milestoneMarker: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingLeft: Platform.OS === 'web' ? 88 : 64, // Align with cards
    marginVertical: 40,
    marginBottom: 40,
  },
  milestoneBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  milestoneText: {
    fontWeight: '900',
    fontSize: 13,
    color: COLORS.blue,
    letterSpacing: 1.5,
  },
  emptyCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 40,
    borderRadius: 24,
    marginTop: 40,
  },
  emptyText: {
    fontWeight: '600',
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
  },
  pathFooter: {
    marginTop: 80,
    marginBottom: 100,
  },
  finishFlag: {
    ...STYLES.card,
    backgroundColor: COLORS.black,
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 40,
  },
  finishText: {
    fontWeight: '900',
    fontSize: 18,
    color: COLORS.white,
    letterSpacing: 1,
  }
});
