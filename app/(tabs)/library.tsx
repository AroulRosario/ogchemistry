import { DuoHeader } from '@/components/DuoHeader';
import { EliteNavigation } from '@/components/EliteNavigation';
import { GlobalStatsHero } from '@/components/library/GlobalStatsHero';
import { LibraryView } from '@/components/LibraryView';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { supabase } from '@/constants/supabase';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

export default function LibraryScreen() {
    const { user } = useAuth();
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isMobile = width < 600;
    const isDesktop = width > 800;
    const [lessons, setLessons] = useState<any[]>([]);
    const [stats, setStats] = useState({ streak_count: 0, xp: 0, gems: 0 });
    const [globalStats, setGlobalStats] = useState({ progress: 0, completed: 0, total: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchData();
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [{ data: profile }, { data: lessonsData }] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', user?.id).single(),
                supabase.from('lessons').select(`
            id, 
            title, 
            order,
            chapters (id, title, order)
        `).order('order')
            ]);

            if (profile) setStats(profile);
            if (lessonsData) {
                setLessons(lessonsData);
                const allChapters = lessonsData.flatMap(l => l.chapters || []);
                const total = allChapters.length;
                const completed = Math.floor(total * 0.3);
                const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
                setGlobalStats({ progress, completed, total });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

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
        <View style={isMobile ? { paddingLeft: 60 } : {}}>
          <DuoHeader streak={stats.streak_count} xp={stats.xp} gems={stats.gems} />
        </View>
                <ScrollView
                        contentContainerStyle={[
                            styles.scrollContent,
                            { paddingHorizontal: isMobile ? 0 : 0 }
                        ]}
                        showsVerticalScrollIndicator={false}
                    >
                  <ResponsiveContainer fullWidth scrollable={false}>
                        <GlobalStatsHero
                            totalProgress={globalStats.progress}
                            completedChapters={globalStats.completed}
                            totalChapters={globalStats.total}
                            onResume={() => {
                                const firstChapter = lessons[0]?.chapters?.[0]?.id;
                                if (firstChapter) router.push(`/chapter/${firstChapter}`);
                            }}
                        />
                        <LibraryView
                            lessons={lessons}
                            onSelect={(id) => router.push(`/chapter/${id}`)}
                        />
                    </ResponsiveContainer>
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: { flex: 1, backgroundColor: '#F8FAFC' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    contentArea: { flex: 1 },
    desktopContentArea: { paddingLeft: 260 },
    scrollContent: { paddingBottom: 40 },
});
