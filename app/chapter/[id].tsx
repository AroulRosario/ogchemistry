import { DuoButton } from '@/components/DuoButton';
import { DynamicBackground } from '@/components/DynamicBackground';
import { ModernComicButton } from '@/components/ModernComicButton';
import { ChapterInteractionHub } from '@/components/player/ChapterInteractionHub';
import { ContentPlayer } from '@/components/player/ContentPlayer';
import { MOCK_CONTENT } from '@/constants/mockData';
import { supabase } from '@/constants/supabase';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle2, PlayCircle } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

export default function ChapterScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useAuth();
    const [items, setItems] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isDesktop = width > 800;

    useEffect(() => { fetchContent(); }, [id]);

    const fetchContent = async () => {
        try {
            const { data, error } = await supabase.from('content_items').select('*').eq('chapter_id', id).order('order');
            setItems(error || !data || data.length === 0 ? MOCK_CONTENT : data);
        } catch { setItems(MOCK_CONTENT); }
    };

    const handleComplete = async () => {
        if (!user) return router.back();

        try {
            // 1. Mark current item as complete
            await supabase.from('user_progress').upsert({
                user_id: user.id,
                content_item_id: items[items.length - 1]?.id || id,
                completed_at: new Date().toISOString()
            }, { onConflict: 'user_id,content_item_id' });

            // 2. Award XP/Gems
            const { data: profile } = await supabase
                .from('profiles')
                .select('xp, gems')
                .eq('id', user.id)
                .single();

            if (profile) {
                await supabase.from('profiles').update({
                    xp: (profile.xp || 0) + 10,
                    gems: (profile.gems || 0) + 5,
                    last_active_at: new Date().toISOString()
                }).eq('id', user.id);
            }

            Alert.alert("Awesome!", "You earned 10 XP and 5 Gems! ⭐💎");

            // 3. Find the next chapter in the lesson
            // First, find the current chapter to get its lesson_id and order
            const { data: currentChapter } = await supabase
                .from('chapters')
                .select('lesson_id, order')
                .eq('id', id)
                .single();

            if (currentChapter) {
                // Then, find the next chapter in the same lesson
                const { data: nextChapter } = await supabase
                    .from('chapters')
                    .select('id')
                    .eq('lesson_id', currentChapter.lesson_id)
                    .gt('order', currentChapter.order)
                    .order('order', { ascending: true })
                    .limit(1)
                    .single();

                if (nextChapter) {
                    // Route to next chapter
                    return router.replace(`/chapter/${nextChapter.id}`);
                }
            }

            // Fallback: If no next chapter or error, go back to tabs
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Error completing chapter/routing to next:', error);
            router.back();
        }
    };

    const item = items[currentIndex];
    const TYPE_EMOJI: Record<string, string> = { video: '🎥', html_sim: '🧪', quiz: '❓', audio: '🎧', reel: '📱', assignment: '📝' };

    if (!item) {
        return (
            <DynamicBackground>
                <Stack.Screen options={{ headerShown: true, title: 'Loading...', headerStyle: { backgroundColor: COLORS.white }, headerTintColor: COLORS.blue, headerShadowVisible: false }} />
                <View style={styles.center}><Text style={styles.loadingText}>Loading content...</Text></View>
            </DynamicBackground>
        );
    }

    return (
        <DynamicBackground>
            <Stack.Screen options={{
                headerShown: true,
                title: `MODULE ${currentIndex + 1} / ${items.length}`,
                headerStyle: { backgroundColor: '#FFFFFF' },
                headerTitleStyle: { fontFamily: 'System', fontWeight: '800', fontSize: 18, color: '#111827' },
                headerTintColor: '#111827',
                headerShadowVisible: false,
                headerLeft: () => (
                    <Pressable onPress={() => router.back()} style={{ marginLeft: 16, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontFamily: 'System', fontWeight: '600', fontSize: 16, color: COLORS.blue }}>← Back</Text>
                    </Pressable>
                ),
            }} />

            <ScrollView style={styles.fullscreenScroll} contentContainerStyle={styles.fullscreenContent}>
                <View style={[styles.mainLayout, isDesktop && styles.desktopLayout]}>

                    {/* MAIN CONTENT AREA */}
                    <View style={[styles.mainVideoArea, isDesktop && { flex: 3 }]}>
                        <View style={styles.videoHeader}>
                            <View style={styles.typeBadge}>
                                <Text style={styles.typeBadgeText}>{TYPE_EMOJI[item.type] || '📄'} {item.type.toUpperCase()}</Text>
                            </View>
                            <Text style={[styles.chapterTitle, !isDesktop && { fontSize: 22 }]}>{item.data?.title || `Content Part ${currentIndex + 1}`}</Text>
                        </View>

                        <View style={styles.contentArea}>
                            <ContentPlayer
                                item={item}
                                onQuizComplete={(score, passed) => {
                                    if (passed) {
                                        Alert.alert("Quiz Passed!", `Great job! You scored ${score}.`);
                                        if (currentIndex < items.length - 1) setCurrentIndex(c => c + 1);
                                        else handleComplete();
                                    } else {
                                        Alert.alert("Quiz Failed", "Review the material and try again to proceed!");
                                    }
                                }}
                            />
                        </View>

                        <View style={styles.controlsArea}>
                            <View style={styles.progressRow}>
                                <View style={styles.progressTrack}>
                                    <View style={[styles.progressFill, { width: `${((currentIndex + 1) / items.length) * 100}%` }]} />
                                </View>
                                <Text style={styles.progressText}>{currentIndex + 1}/{items.length}</Text>
                            </View>

                            <View style={[styles.actionBox, !isDesktop && { alignItems: 'stretch' }]}>
                                {currentIndex < items.length - 1 ? (
                                    <ModernComicButton
                                        title="NEXT MODULE ⚡"
                                        onPress={() => setCurrentIndex(currentIndex + 1)}
                                        variant="primary"
                                    />
                                ) : (
                                    <DuoButton
                                        title="COMPLETE CHAPTER ✓"
                                        onPress={handleComplete}
                                        variant="primary"
                                    />
                                )}
                            </View>
                        </View>

                        {/* INTERACTION HUB (Restored Flashcards/Notes) */}
                        {item.type === 'video' && (
                            <ChapterInteractionHub
                                notes={item.data?.notes}
                                flashcards={item.data?.flashcards}
                            />
                        )}
                    </View>

                    {/* CHAPTER CONTENTS (SIDEBAR ON DESK, BELOW VIDEO ON MOBILE) */}
                    <View style={[styles.sidebar, isDesktop && { flex: 1, minWidth: 350, maxWidth: 450 }]}>
                        <View style={styles.sidebarHeaderOuter}>
                            <View style={styles.sidebarHeaderInner}>
                                <Text style={styles.sidebarTitle}>UP NEXT</Text>
                            </View>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }} nestedScrollEnabled>
                            <View style={styles.sidebarList}>
                                {items.map((it, idx) => {
                                    const isActive = idx === currentIndex;
                                    const isPast = idx < currentIndex;
                                    return (
                                        <Pressable
                                            key={it.id}
                                            style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
                                            onPress={() => setCurrentIndex(idx)}
                                        >
                                            <View style={styles.iconRail}>
                                                {isPast ? (
                                                    <CheckCircle2 size={24} color={COLORS.green} strokeWidth={3} />
                                                ) : (
                                                    <PlayCircle size={24} color={isActive ? COLORS.red : COLORS.grayDark} strokeWidth={isActive ? 3 : 2} />
                                                )}
                                                {idx !== items.length - 1 && <View style={[styles.railLine, isPast && { backgroundColor: COLORS.green }]} />}
                                            </View>
                                            <View style={styles.sidebarItemContent}>
                                                <Text style={[styles.sidebarItemType, isActive && { color: COLORS.red }]}>{TYPE_EMOJI[it.type] || '📄'} {it.type.toUpperCase()}</Text>
                                                <Text style={[styles.sidebarItemTitle, isActive && styles.sidebarItemTitleActive]} numberOfLines={2}>
                                                    {it.data?.title || `Content Part ${idx + 1}`}
                                                </Text>
                                            </View>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>

                </View>
            </ScrollView>
        </DynamicBackground>
    );
}

const styles = StyleSheet.create({
    fullscreenScroll: { flex: 1, backgroundColor: '#FFFFFF' },
    fullscreenContent: { flexGrow: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
    loadingText: { fontFamily: 'System', fontWeight: '700', fontSize: 20, color: COLORS.blue, letterSpacing: 1 },
    mainLayout: { flexDirection: 'column', width: '100%', flex: 1 },
    desktopLayout: { flexDirection: 'row', alignItems: 'stretch' },

    // MAIN VIDEO AREA
    mainVideoArea: { flex: 1, paddingHorizontal: Platform.OS === 'web' ? 20 : 0, paddingVertical: 24, backgroundColor: '#FFFFFF' },
    videoHeader: { marginBottom: 20 },
    chapterTitle: { fontFamily: 'System', fontWeight: '800', fontSize: 28, color: '#111827', letterSpacing: -0.5, marginTop: 8 },
    typeBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#FEE2E2', // Soft red background
        borderWidth: 0,
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    typeBadgeText: { fontFamily: 'System', fontWeight: '700', fontSize: 13, color: COLORS.red, letterSpacing: 0.5 },
    contentArea: { width: '100%', minHeight: 300 },
    controlsArea: { marginTop: 24 },

    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        backgroundColor: '#F9FAFB', // Soft surface
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 20,
    },
    progressTrack: {
        flex: 1,
        height: 12, // Thinner, modern track
        borderRadius: 6,
        backgroundColor: '#E5E7EB',
        overflow: 'hidden'
    },
    progressFill: { height: '100%', backgroundColor: COLORS.blue },
    progressText: { fontFamily: 'System', fontWeight: '700', fontSize: 16, color: '#4B5563' },

    actionBox: { alignItems: 'flex-start' },

    qaBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    qaBtnText: { fontFamily: 'System', fontWeight: '600', fontSize: 13, color: '#4B5563' },

    // SIDEBAR
    sidebar: {
        backgroundColor: '#FFFFFF',
        borderLeftWidth: 1,
        borderLeftColor: '#E5E7EB',
        padding: 24,
        minHeight: 400,
    },
    sidebarHeaderOuter: {
        marginBottom: 24,
    },
    sidebarHeaderInner: {
    },
    sidebarTitle: {
        fontFamily: 'System',
        fontWeight: '700',
        fontSize: 20,
        color: '#111827',
    },
    sidebarList: { gap: 12 },
    sidebarItem: {
        flexDirection: 'row',
        alignItems: 'stretch',
        padding: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
    },
    sidebarItemActive: {
        backgroundColor: '#F3F4F6',
    },
    iconRail: { alignItems: 'center', marginRight: 16, width: 24 },
    railLine: { flex: 1, width: 2, backgroundColor: '#E5E7EB', marginVertical: 4, borderRadius: 1 },
    sidebarItemContent: { flex: 1, justifyContent: 'center' },
    sidebarItemType: { fontFamily: 'System', fontWeight: '600', fontSize: 12, color: '#6B7280', marginBottom: 2 },
    sidebarItemTitle: { fontFamily: 'System', fontSize: 15, fontWeight: '500', color: '#4B5563' },
    sidebarItemTitleActive: { color: '#111827', fontWeight: '700' },
});
