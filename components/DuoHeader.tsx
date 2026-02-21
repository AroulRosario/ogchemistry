import { COLORS } from '@/constants/theme';
import { Flame, Hexagon, Star } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

interface DuoHeaderProps {
    streak: number;
    xp: number;
    gems: number;
}

export function DuoHeader({ streak, xp, gems }: DuoHeaderProps) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.headerContainer}>
                <View style={styles.content}>
                    {/* Streak */}
                    <View style={styles.stat}>
                        <View style={styles.iconCircle}>
                            <Flame size={18} color={COLORS.orange} fill={COLORS.orange} />
                        </View>
                        <Text style={[styles.statText, { color: COLORS.orange }]}>{streak}</Text>
                    </View>

                    <View style={styles.vDivider} />

                    {/* Gems */}
                    <View style={styles.stat}>
                        <View style={styles.iconCircle}>
                            <Hexagon size={18} color={COLORS.blue} fill={COLORS.blue} />
                        </View>
                        <Text style={[styles.statText, { color: COLORS.blue }]}>{gems}</Text>
                    </View>

                    <View style={styles.vDivider} />

                    {/* XP */}
                    <View style={styles.stat}>
                        <View style={[styles.iconCircle, { backgroundColor: COLORS.green }]}>
                            <Star size={16} color={COLORS.white} fill={COLORS.white} />
                        </View>
                        <View>
                            <Text style={[styles.statText, { color: COLORS.green }]}>{xp}</Text>
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
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB', // Soft gray border instead of 4px black
        borderRadius: 24, // Pill shape
        marginHorizontal: 16, // Reduced from 24
        marginVertical: 12,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignSelf: 'center', // Don't stretch full width by default
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16, // Reduced from 24
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F9FAFB',
        borderWidth: 0, // Remove 2px black border
        justifyContent: 'center',
        alignItems: 'center',
    },
    statText: {
        fontFamily: 'System',
        fontWeight: '700',
        fontSize: 16,
        color: '#374151',
        letterSpacing: 0.5,
    },
    xpMiniLabel: {
        fontFamily: 'System',
        fontWeight: '600',
        fontSize: 10,
        color: '#9CA3AF',
        marginTop: -2,
        letterSpacing: 0.5,
    },
    vDivider: {
        width: 1, // Thin modern divider
        height: 20,
        backgroundColor: '#E5E7EB',
    },
});
