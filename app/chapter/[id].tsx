import { DuoButton } from '@/components/DuoButton';
import { DynamicBackground } from '@/components/DynamicBackground';
import { ChapterInteractionHub } from '@/components/player/ChapterInteractionHub';
import { ContentPlayer } from '@/components/player/ContentPlayer';
import { MOCK_CONTENT } from '@/constants/mockData';
import { supabase } from '@/constants/supabase';
import { COLORS, LAYOUT, SHADOWS } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle2, ChevronLeft, PlayCircle } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

export default function ChapterScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { user } = useAuth();
    const [items, setItems] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isDesktop = width > 800;
    const isMobile = width < 600;
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => { 
        fetchContent(); 
        
        // Broad Realtime subscription for maximum target reliability
        const channel = supabase
            .channel('chapter_content_global_sync')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'content_items' }, (payload: any) => {
                // If it belongs to this chapter, refresh!
                if (payload.new && payload.new.chapter_id === id) {
                    setIsSyncing(true);
                    fetchContent().finally(() => setTimeout(() => setIsSyncing(false), 2000));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id]);

    const fetchContent = async () => {
        try {
            const { data, error } = await supabase.from('content_items').select('*').eq('chapter_id', id).order('order');
            
            if (!error && (!data || data.length === 0)) {
                // RLS Check: If no data, see if the user profile is actually approved
                const { data: profile } = await supabase.from('profiles').select('status').eq('id', user?.id).single();
                if (profile && profile.status !== 'approved') {
                    console.warn("🔐 RLS BLOCK: User status is ", profile.status, ". Content will stay hidden until approved in Admin -> Students.");
                }
            }

            setItems(error || !data || data.length === 0 ? MOCK_CONTENT : data);
        } catch (err) { 
            console.error("Fetch content failed:", err);
            setItems(MOCK_CONTENT); 
        }
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
                title: isMobile ? `MOD ${currentIndex + 1}/${items.length}` : `MODULE ${currentIndex + 1} / ${items.length}`,
                headerStyle: { backgroundColor: '#FFFFFF' },
                headerTitleStyle: { fontWeight: '900', fontSize: 18, color: '#0F172A' },
                headerTintColor: '#111827',
                headerShadowVisible: false,
                headerLeft: () => (
                    <Pressable onPress={() => router.back()} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', marginLeft: isDesktop ? 64 : 8, gap: 6 }}>
                        <ChevronLeft size={16} color={COLORS.blue} strokeWidth={2.5} />
                        <Text style={{ fontFamily: 'System', fontWeight: '700', fontSize: 13, color: COLORS.blue }}>Return</Text>
                    </Pressable>
                ),
                headerRight: () => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: isDesktop ? 64 : 12, gap: 10 }}>
                        <Image 
                            source={require('@/assets/images/logo.png')} 
                            style={{ width: 32, height: 32, borderRadius: 8 }} 
                            resizeMode="contain"
                        />
                        <Text style={{ fontFamily: 'System', fontWeight: '900', fontSize: 14, color: COLORS.blue, letterSpacing: -0.3 }}>OG CHEM</Text>
                    </View>
                ),
            }} />
            
            {isSyncing && (
                <View style={{ position: 'absolute', top: 10, left: 20, right: 20, backgroundColor: COLORS.blue, padding: 8, borderRadius: 10, alignItems: 'center', zIndex: 9999, flexDirection: 'row', justifyContent: 'center', gap: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 10 }}>
                    <ActivityIndicator size="small" color="white" />
                    <Text style={{ color: 'white', fontWeight: '800', fontSize: 13 }}>SYNCING NEW CONTENT...</Text>
                </View>
            )}

            {isDesktop ? (
                <View style={[styles.fullscreenContainer, styles.mainLayout, styles.desktopLayout]}>

                    {/* MAIN CONTENT AREA */}
                    <ScrollView style={{ flex: 3 }} contentContainerStyle={styles.mainVideoArea} showsVerticalScrollIndicator={false}>
                        <View style={styles.videoHeader}>
                            <Text style={styles.chapterTitle}>{item.data?.title || `Content Part ${currentIndex + 1}`}</Text>
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

                            <View style={styles.actionBox}>
                                {currentIndex < items.length - 1 ? (
                                    <DuoButton
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
                    </ScrollView>

                    {/* CHAPTER CONTENTS (SIDEBAR ON DESK, FIXED HEIGHT) */}
                    <View style={[styles.sidebarWrapper, { flex: 1, minWidth: 320, maxWidth: 380, height: '100%' }]}>
                        <View style={styles.sidebar}>
                            <View style={styles.sidebarHeaderOuter}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.sidebarTitle}>UP NEXT</Text>
                                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginTop: 2 }}>
                                        {currentIndex + 1} / {items.length} COMPLETED
                                    </Text>
                                </View>
                                <View style={{ backgroundColor: COLORS.blue, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }}>
                                    <Text style={{ color: '#FFF', fontWeight: '900', fontSize: 11, letterSpacing: 0.5 }}>
                                        {Math.round(((currentIndex + 1) / items.length) * 100)}%
                                    </Text>
                                </View>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }} nestedScrollEnabled>
                                <View style={styles.sidebarList}>
                                    {items.map((it, idx) => {
                                        const trueType = it.data?.typeOverride || it.type;
                                        const isActive = idx === currentIndex;
                                        const isPast = idx < currentIndex;
                                        return (
                                            <Pressable
                                                key={it.id}
                                                style={({ pressed, hovered }) => [
                                                    styles.sidebarItem, 
                                                    isActive && styles.sidebarItemActive,
                                                    Platform.OS === 'web' && { 
                                                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        cursor: 'pointer'
                                                    } as any,
                                                    hovered && { backgroundColor: '#F8FAFC', transform: [{ scale: 1.01 }] } as any,
                                                    pressed && { transform: [{ scale: 0.98 }] } as any
                                                ]}
                                                onPress={() => setCurrentIndex(idx)}
                                            >
                                                <View style={styles.iconRail}>
                                                    {isPast ? (
                                                        <CheckCircle2 size={24} color={COLORS.green} strokeWidth={3} />
                                                    ) : (
                                                        <PlayCircle size={24} color={isActive ? COLORS.blue : 'rgba(255,255,255,0.4)'} strokeWidth={isActive ? 3 : 2} />
                                                    )}
                                                    {idx !== items.length - 1 && <View style={[styles.railLine, isPast && { backgroundColor: COLORS.green }]} />}
                                                </View>
                                                <View style={styles.sidebarItemContent}>
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

                </View>
            ) : (
                <ScrollView style={styles.fullscreenContainer} contentContainerStyle={styles.fullscreenContent}>
                    <View style={styles.mainLayout}>
                        {/* MAIN CONTENT AREA */}
                        <View style={[styles.mainVideoArea, { paddingHorizontal: 16, paddingVertical: 16 }]}>
                            <View style={styles.videoHeader}>
                                <Text style={[styles.chapterTitle, { fontSize: 32 }]}>{item.data?.title || `Content Part ${currentIndex + 1}`}</Text>
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

                                <View style={[styles.actionBox, { alignItems: 'stretch' }]}>
                                    {currentIndex < items.length - 1 ? (
                                        <DuoButton
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

                        {/* CHAPTER CONTENTS (BELOW VIDEO ON MOBILE) */}
                        <View style={styles.sidebarWrapper}>
                            <View style={[styles.sidebar, { minHeight: 300 }]}>
                                <View style={styles.sidebarHeaderOuter}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.sidebarTitle}>UP NEXT</Text>
                                        <Text style={{ fontSize: 11, fontWeight: '700', color: '#94A3B8', letterSpacing: 0.5, marginTop: 2 }}>
                                            {currentIndex + 1} / {items.length} COMPLETED
                                        </Text>
                                    </View>
                                    <View style={{ backgroundColor: COLORS.blue, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 }}>
                                        <Text style={{ color: '#FFF', fontWeight: '900', fontSize: 11, letterSpacing: 0.5 }}>
                                            {Math.round(((currentIndex + 1) / items.length) * 100)}%
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.sidebarList}>
                                    {items.map((it, idx) => {
                                        const isActive = idx === currentIndex;
                                        const isPast = idx < currentIndex;
                                        return (
                                            <Pressable
                                                key={it.id}
                                                style={({ pressed, hovered }) => [
                                                    styles.sidebarItem, 
                                                    isActive && styles.sidebarItemActive,
                                                    Platform.OS === 'web' && { 
                                                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        cursor: 'pointer'
                                                    } as any,
                                                    hovered && { backgroundColor: '#F8FAFC', transform: [{ scale: 1.01 }] } as any,
                                                    pressed && { transform: [{ scale: 0.98 }] } as any
                                                ]}
                                                onPress={() => setCurrentIndex(idx)}
                                            >
                                                <View style={styles.iconRail}>
                                                    {isPast ? (
                                                        <CheckCircle2 size={24} color={COLORS.green} strokeWidth={3} />
                                                    ) : (
                                                        <PlayCircle size={24} color={isActive ? COLORS.blue : 'rgba(255,255,255,0.4)'} strokeWidth={isActive ? 3 : 2} />
                                                    )}
                                                    {idx !== items.length - 1 && <View style={[styles.railLine, isPast && { backgroundColor: COLORS.green }]} />}
                                                </View>
                                                <View style={styles.sidebarItemContent}>
                                                    <Text style={[styles.sidebarItemTitle, isActive && styles.sidebarItemTitleActive]} numberOfLines={2}>
                                                        {it.data?.title || `Content Part ${idx + 1}`}
                                                    </Text>
                                                </View>
                                            </Pressable>
                                        );
                                    })}
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            )}
        </DynamicBackground>
    );
}

const styles = StyleSheet.create({
    fullscreenContainer: { flex: 1, backgroundColor: '#FFFFFF' },
    fullscreenContent: { flexGrow: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' },
    loadingText: { fontFamily: 'System', fontWeight: '700', fontSize: 20, color: COLORS.blue, letterSpacing: 1 },
    mainLayout: { flexDirection: 'column', width: '100%', flex: 1 },
    desktopLayout: { flexDirection: 'row-reverse', alignItems: 'stretch' },

    // MAIN VIDEO AREA
    mainVideoArea: { paddingHorizontal: Platform.OS === 'web' ? LAYOUT.desktopPadding : LAYOUT.mobilePadding, paddingVertical: 24, paddingBottom: 64, backgroundColor: '#FFFFFF' },
    videoHeader: { marginBottom: 20 },
    chapterTitle: { 
        fontFamily: 'System', 
        fontWeight: '900', 
        fontSize: 36, 
        color: '#0F172A', 
        letterSpacing: -1, 
        marginTop: 8, 
        lineHeight: 40,
    },
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
    sidebarWrapper: {
        backgroundColor: '#FFFFFF', // Professional background
        padding: Platform.OS === 'web' ? 32 : 16,
        borderLeftWidth: 1,
        borderLeftColor: '#E2E8F0',
    },
    sidebar: {
        backgroundColor: COLORS.white,
        padding: 20,
        borderRadius: 24,
        flex: 1,
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    sidebarHeaderOuter: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    sidebarTitle: {
        fontFamily: 'System',
        fontWeight: '900',
        fontSize: 13,
        color: '#94A3B8',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
    },
    sidebarList: { gap: 10 },
    sidebarItem: {
        flexDirection: 'row',
        alignItems: 'stretch',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        marginHorizontal: 4,
    },
    sidebarItemActive: {
        backgroundColor: '#EFF6FF',
        borderColor: '#BFDBFE',
        shadowColor: COLORS.blue,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,
    },
    iconRail: { alignItems: 'center', marginRight: 12, width: 24 },
    railLine: { flex: 1, width: 2, backgroundColor: '#E2E8F0', marginVertical: 4, borderRadius: 1 },
    sidebarItemContent: { flex: 1, justifyContent: 'center' },
    sidebarItemType: { fontFamily: 'System', fontWeight: '800', fontSize: 10, color: '#64748B', marginBottom: 2, letterSpacing: 0.5, textTransform: 'uppercase' },
    sidebarItemTitle: { fontFamily: 'System', fontSize: 14, fontWeight: '700', color: '#1E293B' },
    sidebarItemTitleActive: { color: COLORS.blue, fontWeight: '800' },
});
