import { COLORS } from '@/constants/theme';
import { Flame, Hexagon, Star } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

interface DuoHeaderProps {
    streak: number;
    xp: number;
    gems: number;
}

export function DuoHeader({ streak, xp, gems }: DuoHeaderProps) {
    const { width } = useWindowDimensions();
    const isMobile = width < 600;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={[
                styles.headerContainer,
                isMobile ? {
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    marginLeft: 72, // Clear the hamburger menu area with more breathing room
                    marginRight: 16, // Don't stick to the right edge 
                    maxWidth: 'auto', // Override the 95% 
                    alignSelf: 'stretch' // Stretch across the available top space
                } : { paddingHorizontal: 24, paddingVertical: 16, marginHorizontal: 16 }
            ]}>
                <View style={[styles.content, isMobile ? { flex: 1, justifyContent: 'space-between', paddingHorizontal: 8 } : { gap: 16 }]}>
                    {/* Streak */}
                    <View style={styles.stat}>
                        <View style={styles.iconCircle}>
                            <Flame size={18} color={COLORS.orange} fill={COLORS.orange} />
                        </View>
                        <Text style={[styles.statText, { color: COLORS.orange }, isMobile && { fontSize: 14 }]}>{streak}</Text>
                    </View>

                    <View style={styles.vDivider} />

                    {/* Gems */}
                    <View style={styles.stat}>
                        <View style={styles.iconCircle}>
                            <Hexagon size={18} color={COLORS.blue} fill={COLORS.blue} />
                        </View>
                        <Text style={[styles.statText, { color: COLORS.blue }, isMobile && { fontSize: 14 }]}>{gems}</Text>
                    </View>

                    <View style={styles.vDivider} />

                    {/* XP */}
                    <View style={styles.stat}>
                        <View style={[styles.iconCircle, { backgroundColor: COLORS.green }]}>
                            <Star size={16} color={COLORS.white} fill={COLORS.white} />
                        </View>
                        <View style={isMobile ? { flexDirection: 'row', alignItems: 'baseline', gap: 2 } : {}}>
                            <Text style={[styles.statText, { color: COLORS.green }, isMobile && { fontSize: 14 }]}>{xp}</Text>
                            <Text style={styles.xpMiniLabel}>XP</Text>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: 'transparent',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        marginVertical: 12,
        alignSelf: 'center',
        maxWidth: '95%',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statText: {
        fontFamily: 'System',
        fontWeight: '900',
        fontSize: 17,
        color: '#374151',
        letterSpacing: 0.5,
    },
    xpMiniLabel: {
        fontFamily: 'System',
        fontWeight: '800',
        fontSize: 10,
        color: '#9CA3AF',
        marginLeft: 2,
        letterSpacing: 0.5,
    },
    vDivider: {
        width: 1,
        height: 20,
        backgroundColor: '#E5E7EB',
    },
});
