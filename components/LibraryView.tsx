import { AnimatedCard } from '@/components/AnimatedCard';
import { DuoHeader } from '@/components/DuoHeader';
// Deployment sync trigger - v1.0.3 (Accordion Close Fix)
import { COLORS } from '@/constants/theme';
import { Book, ChevronRight, Play, Search, SlidersHorizontal, LayoutGrid, List, ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions, LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface LibraryViewProps {
    lessons: any[];
    onSelect: (id: string, type: 'lesson' | 'chapter') => void;
}

export function LibraryView({ lessons, onSelect }: LibraryViewProps) {
    const { width } = useWindowDimensions();
    const isMobile = width < 600;
    const isDesktop = width > 800;
    const isWide = width > 1200;
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'progress' | 'completed'>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [expandedLessonId, setExpandedLessonId] = useState<any>(null);

    const toggleLesson = (id: any) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedLessonId(String(expandedLessonId) === String(id) ? null : id);
    };

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
                <View style={[
                    styles.searchBar,
                    isDesktop ? { height: 60 } : { height: 48 },
                    isMobile ? { gap: 8 } : { gap: 12 }
                ]}>
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
                    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                        <View style={styles.viewToggleGroup}>
                            <Pressable 
                                onPress={() => setViewMode('grid')} 
                                style={[styles.viewToggleBtn, viewMode === 'grid' && styles.viewToggleBtnActive]}
                            >
                                <LayoutGrid size={18} color={viewMode === 'grid' ? COLORS.blue : '#94A3B8'} />
                            </Pressable>
                            <Pressable 
                                onPress={() => setViewMode('list')} 
                                style={[styles.viewToggleBtn, viewMode === 'list' && styles.viewToggleBtnActive]}
                            >
                                <List size={18} color={viewMode === 'list' ? COLORS.blue : '#94A3B8'} />
                            </Pressable>
                        </View>
                        <Pressable style={styles.moreFiltersBtn}>
                            <SlidersHorizontal size={18} color="#475569" />
                            <Text style={styles.moreFiltersText}>Advanced Filters</Text>
                        </Pressable>
                    </View>
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
                filteredLessons.map((lesson: any) => {
                    const isExpanded = String(expandedLessonId) === String(lesson.id) || viewMode === 'grid';
                    
                    return (
                        <View key={lesson.id} style={[styles.lessonSection, viewMode === 'list' && styles.lessonSectionList]}>
                            {viewMode === 'list' ? (
                                <Pressable 
                                    onPress={() => toggleLesson(lesson.id)}
                                    style={[styles.accordionHeader, isExpanded && styles.accordionHeaderActive]}
                                >
                                    <View style={styles.sectionHeaderInner}>
                                        <View style={[styles.headerIconWrapper, { width: 40, height: 40 }]}>
                                            <Book size={20} color={COLORS.blue} strokeWidth={3} />
                                        </View>
                                        <View>
                                            <Text style={[styles.sectionTitle, { fontSize: 18 }]}>{lesson.title.toUpperCase()}</Text>
                                            <Text style={styles.sectionSubtitle}>{lesson.chapters?.length || 0} Modules Available</Text>
                                        </View>
                                    </View>
                                    {isExpanded ? <ChevronUp size={20} color="#94A3B8" /> : <ChevronDown size={20} color="#94A3B8" />}
                                </Pressable>
                            ) : (
                                <View style={[styles.sectionHeader, !isDesktop && { gap: 12, marginBottom: 16 }]}>
                                    <View style={styles.headerIconWrapper}>
                                        <Book size={24} color={COLORS.blue} strokeWidth={3} />
                                    </View>
                                    <View>
                                        <Text style={styles.sectionTitle}>{lesson.title.toUpperCase()}</Text>
                                        <Text style={styles.sectionSubtitle}>{lesson.chapters?.length || 0} Modules Available</Text>
                                    </View>
                                </View>
                            )}

                            {isExpanded && (
                                <View style={viewMode === 'grid' ? styles.grid : styles.listContainer}>
                                    {lesson.chapters?.map((chapter: any, chapterIdx: number) => {
                                        let cardStyle: any = {};
                                        if (viewMode === 'list') {
                                            cardStyle = { width: '100%', marginBottom: 8 };
                                        } else {
                                            cardStyle = { 
                                                flexGrow: 1, 
                                                flexBasis: isWide ? 280 : (isDesktop ? 300 : '100%'),
                                                maxWidth: isDesktop ? 450 : '100%'
                                            };
                                        }

                                        return (
                                            <AnimatedCard
                                                key={chapter.id}
                                                delay={chapterIdx * 50}
                                                style={[
                                                    styles.cardWrapper,
                                                    cardStyle
                                                ]}
                                            >
                                                <Pressable
                                                    onPress={() => onSelect(chapter.id, 'chapter')}
                                                    style={({ pressed }) => [
                                                        styles.card,
                                                        viewMode === 'list' && styles.cardListMode,
                                                        !isDesktop && { padding: 16 },
                                                        pressed && { transform: [{ translateY: 2 }], shadowOpacity: 0 }
                                                    ]}
                                                >
                                                    {viewMode === 'list' ? (
                                                        <View style={styles.listContentRow}>
                                                            <View style={styles.listContentMain}>
                                                                <Text style={[styles.chapterTitle, { fontSize: 16 }]} numberOfLines={1}>{chapter.title}</Text>
                                                                <View style={styles.progressSectionList}>
                                                                    <View style={[styles.progressBar, { width: 100, height: 6 }]}>
                                                                        <View style={[styles.progressFill, { width: `${Math.floor(Math.random() * 80) + 10}%` }]} />
                                                                    </View>
                                                                    <Text style={[styles.progressText, { fontSize: 10 }]}>{Math.floor(Math.random() * 8) + 1}/10 COMPLETED</Text>
                                                                </View>
                                                            </View>

                                                            <View style={styles.listActionRow}>
                                                                <View style={styles.tag}>
                                                                    <Text style={styles.tagText}>CORE</Text>
                                                                </View>
                                                                <View style={[styles.playBadge, { width: 24, height: 24 }]}>
                                                                    <Play size={10} color="#FFF" fill="#FFF" />
                                                                </View>
                                                            </View>
                                                        </View>
                                                    ) : (
                                                        <>
                                                            <View style={styles.iconCircleAbsolute}>
                                                                <ChevronRight size={18} color={COLORS.blue} strokeWidth={3} />
                                                            </View>

                                                            <View style={styles.cardContent}>
                                                                <Text style={[styles.chapterTitle, !isDesktop && { fontSize: 16, lineHeight: 20 }]} numberOfLines={2}>{chapter.title}</Text>
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
                                                        </>
                                                    )}
                                                </Pressable>
                                            </AnimatedCard>
                                        );
                                    })}
                                </View>
                            )}
                        </View>
                    );
                })
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
        marginBottom: 24,
        gap: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 20,
        paddingHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    filterLabel: {
        fontSize: 14,
        fontWeight: '800',
        color: '#64748B',
    },
    filterLabelActive: {
        color: COLORS.blue,
    },
    viewToggleGroup: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        padding: 4,
        borderRadius: 16,
        gap: 4,
    },
    viewToggleBtn: {
        padding: 8,
        borderRadius: 12,
    },
    viewToggleBtnActive: {
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
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
    lessonSectionList: {
        marginBottom: 16,
        backgroundColor: '#FFF',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    accordionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#FFF',
    },
    accordionHeaderActive: {
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    sectionHeaderInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    listContainer: {
        padding: 12,
        backgroundColor: '#F8FAFC',
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
        gap: 32,
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
        shadowOpacity: 0.04,
    },
    cardListMode: {
        paddingHorizontal: 32,
        paddingVertical: 20,
        borderRadius: 24,
    },
    listContentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 24,
    },
    listContentMain: {
        flex: 1,
        gap: 8,
    },
    progressSectionList: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    listActionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 12,
    },
    cardContent: {
        marginBottom: 12,
    },
    chapterTitle: {
        fontFamily: 'System',
        fontSize: 18,
        fontWeight: '900',
        color: '#0F172A',
        lineHeight: 22,
        letterSpacing: -0.2,
    },
    iconCircleAbsolute: {
        position: 'absolute',
        top: 20,
        right: 20,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
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
