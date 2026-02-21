import { AnimatedCard } from '@/components/AnimatedCard';
import { COLORS, STYLES } from '@/constants/theme';
import { Book, ChevronRight, Play, Search, SlidersHorizontal } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

interface LibraryViewProps {
    lessons: any[];
    onSelect: (id: string, type: 'lesson' | 'chapter') => void;
}

export function LibraryView({ lessons, onSelect }: LibraryViewProps) {
    const { width } = useWindowDimensions();
    const isDesktop = width > 800;
    const isWide = width > 1200;
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'progress' | 'completed'>('all');

    const filteredLessons = useMemo(() => {
        return lessons.map(lesson => {
            const filteredChapters = lesson.chapters?.filter((chapter: any) => {
                const matchesSearch = chapter.title.toLowerCase().includes(searchQuery.toLowerCase());
                if (activeFilter === 'progress') return matchesSearch && chapter.id.toString().length % 2 === 0;
                if (activeFilter === 'completed') return matchesSearch && chapter.id.toString().length % 3 === 0;
                return matchesSearch;
            });

            if (filteredChapters && filteredChapters.length > 0) {
                return { ...lesson, chapters: filteredChapters };
            }
            return null;
        }).filter(Boolean);
    }, [lessons, searchQuery, activeFilter]);

    return (
        <View style={styles.container}>
            {/* Search and Filters */}
            <View style={styles.controlsSection}>
                <View style={styles.searchBar}>
                    <Search size={20} color="#94A3B8" />
                    <TextInput
                        placeholder="Search courses or topics..."
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#94A3B8"
                    />
                </View>

                <View style={styles.filterBar}>
                    <View style={styles.tabsRow}>
                        {[
                            { id: 'all', label: 'All' },
                            { id: 'progress', label: 'In Progress' },
                            { id: 'completed', label: 'Completed' }
                        ].map((tab) => (
                            <Pressable
                                key={tab.id}
                                onPress={() => setActiveFilter(tab.id as any)}
                                style={[styles.filterTab, activeFilter === tab.id && styles.filterTabActive]}
                            >
                                <Text style={[styles.filterLabel, activeFilter === tab.id && styles.filterLabelActive]}>
                                    {tab.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                    <Pressable style={styles.moreFiltersBtn}>
                        <SlidersHorizontal size={18} color="#475569" />
                        <Text style={styles.moreFiltersText}>Advanced Filters</Text>
                    </Pressable>
                </View>
            </View>

            {filteredLessons.length === 0 ? (
                <View style={styles.emptyState}>
                    <Search size={64} color="#E2E8F0" />
                    <Text style={styles.emptyText}>No matches found for "{searchQuery}"</Text>
                    <Pressable onPress={() => { setSearchQuery(''); setActiveFilter('all'); }} style={styles.clearBtn}>
                        <Text style={styles.clearBtnText}>Clear all filters</Text>
                    </Pressable>
                </View>
            ) : (
                filteredLessons.map((lesson: any) => (
                    <View key={lesson.id} style={styles.lessonSection}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.headerIconWrapper}>
                                <Book size={24} color={COLORS.blue} strokeWidth={3} />
                            </View>
                            <View>
                                <Text style={styles.sectionTitle}>{lesson.title.toUpperCase()}</Text>
                                <Text style={styles.sectionSubtitle}>{lesson.chapters?.length || 0} Modules Available</Text>
                            </View>
                        </View>

                        <View style={styles.grid}>
                            {lesson.chapters?.map((chapter: any, chapterIdx: number) => (
                                <AnimatedCard
                                    key={chapter.id}
                                    delay={chapterIdx * 100}
                                    style={[
                                        styles.cardWrapper,
                                        isWide ? { width: '23.5%' } : isDesktop ? { width: '31%' } : { width: '100%' }
                                    ]}
                                >
                                    <Pressable
                                        onPress={() => onSelect(chapter.id, 'chapter')}
                                        style={({ pressed }) => [
                                            styles.card,
                                            pressed && { transform: [{ translateY: 2 }], shadowOpacity: 0 }
                                        ]}
                                    >
                                        <View style={styles.cardHeader}>
                                            <Text style={styles.chapterTitle} numberOfLines={2}>{chapter.title}</Text>
                                            <View style={styles.iconCircle}>
                                                <ChevronRight size={18} color={COLORS.blue} strokeWidth={3} />
                                            </View>
                                        </View>

                                        <View style={styles.progressSection}>
                                            <View style={styles.progressBar}>
                                                <View style={[styles.progressFill, { width: `${Math.floor(Math.random() * 80) + 10}%` }]} />
                                            </View>
                                            <View style={styles.progressInfo}>
                                                <Text style={styles.progressText}>{Math.floor(Math.random() * 8) + 1}/10 COMPLETED</Text>
                                                <Text style={styles.xpTip}>+50 XP</Text>
                                            </View>
                                        </View>

                                        <View style={styles.tagRow}>
                                            <View style={styles.tag}>
                                                <Text style={styles.tagText}>CORE SCIENCE</Text>
                                            </View>
                                            <View style={styles.playBadge}>
                                                <Play size={12} color="#FFF" fill="#FFF" />
                                            </View>
                                        </View>
                                    </Pressable>
                                </AnimatedCard>
                            ))}
                        </View>
                    </View>
                ))
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 24,
        width: '100%',
    },
    controlsSection: {
        marginBottom: 40,
        gap: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 20,
        paddingHorizontal: 20,
        height: 60,
        gap: 16,
        ...STYLES.card,
        shadowOpacity: 0.03,
    },
    searchInput: {
        flex: 1,
        fontSize: 17,
        fontWeight: '600',
        color: '#1E293B',
    },
    filterBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
    },
    tabsRow: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        padding: 4,
        borderRadius: 16,
        gap: 4,
    },
    filterTab: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    filterTabActive: {
        backgroundColor: '#FFF',
        ...STYLES.card,
        shadowOpacity: 0.1,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '800',
        color: '#64748B',
    },
    filterLabelActive: {
        color: COLORS.blue,
    },
    moreFiltersBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
    },
    moreFiltersText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#475569',
    },
    lessonSection: {
        marginBottom: 56,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 24,
    },
    headerIconWrapper: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionTitle: {
        fontFamily: 'System',
        fontWeight: '900',
        fontSize: 24,
        color: '#1E293B',
        letterSpacing: -0.5,
    },
    sectionSubtitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#94A3B8',
        marginTop: 2,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
        width: '100%',
    },
    cardWrapper: {
        flexGrow: 0,
        flexShrink: 0,
    },
    card: {
        width: '100%',
        padding: 24,
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 32,
        ...STYLES.card,
        shadowOpacity: 0.04,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
    },
    chapterTitle: {
        flex: 1,
        fontFamily: 'System',
        fontSize: 19,
        fontWeight: '900',
        color: '#1E293B',
        lineHeight: 24,
    },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tagRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: '#FFFBEB',
        borderWidth: 1,
        borderColor: '#FEF3C7',
    },
    tagText: {
        fontFamily: 'System',
        fontSize: 11,
        fontWeight: '900',
        color: '#B45309',
        letterSpacing: 0.5,
    },
    playBadge: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.blue,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressSection: {
        marginTop: 24,
        gap: 10,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#F1F5F9',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.blue,
        borderRadius: 4,
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressText: {
        fontSize: 12,
        fontWeight: '900',
        color: '#94A3B8',
        letterSpacing: 0.5,
    },
    xpTip: {
        fontSize: 12,
        fontWeight: '900',
        color: COLORS.green,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 100,
        gap: 24,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#64748B',
        textAlign: 'center',
    },
    clearBtn: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 16,
        backgroundColor: COLORS.blue,
    },
    clearBtnText: {
        color: '#FFF',
        fontWeight: '900',
        fontSize: 15,
    }
});
