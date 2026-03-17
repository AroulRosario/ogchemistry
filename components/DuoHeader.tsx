import { COLORS } from '@/constants/theme';
import { Flame, Hexagon, Star } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DuoHeaderProps {
    streak: number;
    xp: number;
    gems: number;
}

export function DuoHeader({ streak, xp, gems }: DuoHeaderProps) {
    const { width } = useWindowDimensions();
    const isMobile = width < 600;
    const insets = useSafeAreaInsets();

    return (
        <View style={[
            styles.headerContainer,
            isMobile ? {
                paddingHorizontal: 10,
                paddingVertical: 10,
                marginLeft: 76, // Clear the hamburger (52px wide + 16px left + 8px gap)
                marginRight: 12,
                marginTop: insets.top + 8, // Respect safe area without double-counting
            } : {
                paddingHorizontal: 24,
                paddingVertical: 14,
                marginHorizontal: 16,
                marginTop: 12,
            }
        ]}>
            <View style={[styles.content, isMobile ? { flex: 1, justifyContent: 'space-around' } : { gap: 20 }]}>
                {/* Streak */}
                <View style={styles.stat}>
                    <View style={styles.iconCircle}>
                        <Flame size={isMobile ? 16 : 18} color={COLORS.orange} fill={COLORS.orange} />
                    </View>
                    <Text style={[styles.statText, { color: COLORS.orange }, isMobile && { fontSize: 14 }]}>{streak}</Text>
                </View>

                <View style={styles.vDivider} />

                {/* Gems */}
                <View style={styles.stat}>
                    <View style={styles.iconCircle}>
                        <Hexagon size={isMobile ? 16 : 18} color={COLORS.blue} fill={COLORS.blue} />
                    </View>
                    <Text style={[styles.statText, { color: COLORS.blue }, isMobile && { fontSize: 14 }]}>{gems}</Text>
                </View>

                <View style={styles.vDivider} />

                {/* XP */}
                <View style={styles.stat}>
                    <View style={[styles.iconCircle, { backgroundColor: COLORS.green }]}>
                        <Star size={isMobile ? 14 : 16} color={COLORS.white} fill={COLORS.white} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 2 }}>
                        <Text style={[styles.statText, { color: COLORS.green }, isMobile && { fontSize: 14 }]}>{xp}</Text>
                        <Text style={styles.xpMiniLabel}>XP</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
        shadowOpacity: 0.06,
        shadowRadius: 12,
        alignSelf: 'stretch',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    iconCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statText: {
        fontFamily: 'System',
        fontWeight: '900',
        fontSize: 16,
        color: '#374151',
        letterSpacing: 0.3,
    },
    xpMiniLabel: {
        fontFamily: 'System',
        fontWeight: '800',
        fontSize: 10,
        color: '#9CA3AF',
        letterSpacing: 0.5,
    },
    vDivider: {
        width: 1,
        height: 18,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 4,
    },
});
