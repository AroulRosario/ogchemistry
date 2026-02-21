import { AnimatedCard } from '@/components/AnimatedCard';
import { DuoHeader } from '@/components/DuoHeader';
import { DynamicBackground } from '@/components/DynamicBackground';
import { EliteNavigation } from '@/components/EliteNavigation';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { COLORS } from '@/constants/theme';
import { Clock, GraduationCap, Lock, PlayCircle, Search, Sparkles, TrendingUp } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

export default function ExploreScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width > 800;
  const isWide = width > 1200;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChip, setActiveChip] = useState('All');

  const topics = [
    { emoji: '⚛️', title: 'Organic Chemistry', desc: 'Carbon compounds and reactions.', lessons: 24, duration: '12h', difficulty: 'Advanced', category: 'Core' },
    { emoji: '🧪', title: 'Inorganic Chemistry', desc: 'Metals and coordination compounds.', lessons: 18, duration: '8h', difficulty: 'Intermediate', category: 'Core' },
    { emoji: '🔥', title: 'Physical Chemistry', desc: 'Thermodynamics and kinetics.', lessons: 32, duration: '15h', difficulty: 'Advanced', category: 'Core' },
    { emoji: '🧬', title: 'Biochemistry', desc: 'Proteins and metabolic pathways.', lessons: 15, duration: '6h', difficulty: 'Intermediate', category: 'Bio' },
    { emoji: '⚡', title: 'Electrochemistry', desc: 'Redox and galvanic cells.', lessons: 12, duration: '5h', difficulty: 'Beginner', category: 'Applied' },
    { emoji: '💎', title: 'Solid State', desc: 'Crystal structures and unit cells.', lessons: 10, duration: '4h', difficulty: 'Intermediate', category: 'Applied' },
  ];

  const filteredTopics = useMemo(() => {
    return topics.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesChip = activeChip === 'All' || t.category === activeChip || t.difficulty === activeChip;
      return matchesSearch && matchesChip;
    });
  }, [searchQuery, activeChip]);

  return (
    <DynamicBackground>
      <EliteNavigation />

      <View style={[styles.mainContent, isDesktop && styles.desktopContent]}>
        <DuoHeader streak={0} xp={0} gems={0} />

        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <ResponsiveContainer fullWidth>
            {/* Search & Filter Header */}
            <View style={styles.headerControls}>
              <View style={styles.searchBar}>
                <Search size={20} color="#94A3B8" />
                <TextInput
                  placeholder="Find a universe..."
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
                {['All', 'Core', 'Applied', 'Bio', 'Beginner', 'Advanced'].map(chip => (
                  <Pressable
                    key={chip}
                    onPress={() => setActiveChip(chip)}
                    style={[styles.chip, activeChip === chip && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, activeChip === chip && styles.chipTextActive]}>{chip}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Featured Section */}
            <View style={styles.featuredSection}>
              <View style={[styles.featuredCard, { backgroundColor: COLORS.blue }]}>
                <View style={styles.heroContent}>
                  <View style={{ flex: 1.2 }}>
                    <View style={styles.featuredBadge}>
                      <Sparkles size={14} color={COLORS.white} />
                      <Text style={styles.featuredBadgeText}>FEATURED UNIVERSE</Text>
                    </View>
                    <Text style={[styles.featuredTitle, { fontSize: isDesktop ? 48 : 28 }]}>QUANTUM CHEMISTRY</Text>
                    <Text style={styles.featuredDesc}>Dive into the subatomic world and master electron configurations.</Text>
                    <View style={styles.featuredAction}>
                      <PlayCircle size={20} color={COLORS.blue} />
                      <Text style={styles.featuredActionText}>START ADVENTURE</Text>
                    </View>
                  </View>
                  {isDesktop && (
                    <View style={styles.heroVisual}>
                      <View style={styles.visualOrb} />
                      <Text style={{ fontSize: 80 }}>⚛️</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={[styles.sectionTitle, { fontSize: isDesktop ? 28 : 22 }]}>EXPLORE UNIVERSES</Text>
                <View style={styles.sectionLine} />
              </View>
              <TrendingUp size={24} color={COLORS.grayDark} />
            </View>

            <View style={styles.grid}>
              {filteredTopics.map((topic, i) => (
                <AnimatedCard key={i} delay={i * 100} style={[
                  styles.cardWrapper,
                  isWide ? { width: '23.5%' } : isDesktop ? { width: '31%' } : { width: '100%' }
                ]}>
                  <View style={styles.card}>
                    <View style={styles.cardTop}>
                      <View style={styles.emojiContainer}>
                        <Text style={styles.emoji}>{topic.emoji}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{topic.title.toUpperCase()}</Text>
                        <View style={styles.difficultyBadge}>
                          <Text style={styles.difficultyText}>{topic.difficulty}</Text>
                        </View>
                      </View>
                      <View style={styles.lockBadge}>
                        <Lock size={14} strokeWidth={3} color="#94A3B8" />
                      </View>
                    </View>

                    <Text style={styles.cardDesc} numberOfLines={2}>{topic.desc}</Text>

                    <View style={styles.cardMetrics}>
                      <View style={styles.metric}>
                        <GraduationCap size={14} color="#64748B" />
                        <Text style={styles.metricText}>{topic.lessons} Lessons</Text>
                      </View>
                      <View style={styles.metric}>
                        <Clock size={14} color="#64748B" />
                        <Text style={styles.metricText}>{topic.duration}</Text>
                      </View>
                    </View>
                  </View>
                </AnimatedCard>
              ))}
            </View>

            {/* Recommended Row */}
            <View style={styles.recommendedSection}>
              <Text style={styles.recommendedTitle}>RECOMMENDED FOR YOU</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendedScroll}>
                {['Lab Safety', 'Stoichiometry', 'Redox Pro', 'Hybridization', 'Valence', 'Bonding', 'Kinetics'].map((item, i) => (
                  <View key={i} style={styles.recommendCard}>
                    <View style={styles.recommendIcon}>
                      <Sparkles size={18} color={COLORS.blue} />
                    </View>
                    <Text style={styles.recommendText}>{item}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </ResponsiveContainer>
        </ScrollView>
      </View>
    </DynamicBackground>
  );
}

const styles = StyleSheet.create({
  mainContent: { flex: 1, backgroundColor: '#F8FAFC' },
  desktopContent: { paddingLeft: 260 },
  scroll: { paddingBottom: 60 },
  headerControls: {
    marginTop: 24,
    gap: 16,
    width: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  chipScroll: {
    gap: 8,
    paddingBottom: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: COLORS.blue,
    borderColor: COLORS.blue,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  chipTextActive: {
    color: '#FFF',
  },
  featuredSection: {
    marginTop: 24,
    marginBottom: 40,
    width: '100%',
  },
  featuredCard: {
    padding: 40,
    borderRadius: 32,
    overflow: 'hidden',
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroVisual: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visualOrb: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  featuredBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  featuredTitle: {
    color: '#FFF',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -1.5,
  },
  featuredDesc: {
    color: '#E0F2FE',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
    marginTop: 8,
    marginBottom: 24,
    maxWidth: 500,
  },
  featuredAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
  },
  featuredActionText: {
    color: COLORS.blue,
    fontSize: 15,
    fontWeight: '900',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  sectionTitle: {
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 28,
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  sectionLine: { height: 4, width: 40, borderRadius: 2, backgroundColor: COLORS.yellow, marginTop: 4 },
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
    padding: 24,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 28,
    gap: 12,
    height: '100%',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  emojiContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 28 },
  cardTitle: {
    fontFamily: 'System',
    fontWeight: '900',
    fontSize: 16,
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  difficultyBadge: {
    backgroundColor: '#F1F5F9',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  lockBadge: {
    padding: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  cardDesc: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    lineHeight: 20,
  },
  cardMetrics: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginTop: 'auto',
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  recommendedSection: {
    marginTop: 56,
    paddingBottom: 40,
    width: '100%',
  },
  recommendedTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#94A3B8',
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  recommendedScroll: {
    gap: 16,
  },
  recommendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  recommendIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recommendText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#334155',
  },
});
