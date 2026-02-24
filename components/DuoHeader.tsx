import { COLORS } from '@/constants/theme';
import { Flame, Hexagon, Star } from 'lucide-react-native';
import React from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';

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
                        <View style={Platform.OS !== 'web' ? { flexDirection: 'row', alignItems: 'baseline', gap: 2 } : {}}>
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
        borderColor: '#E5E7EB',
        borderRadius: 24,
        marginHorizontal: Platform.OS === 'web' ? 16 : 0,
        marginVertical: 12,
        paddingVertical: 6,
        paddingHorizontal: Platform.OS === 'web' ? 8 : 4,
        alignSelf: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
        maxWidth: '95%',
        minWidth: Platform.OS === 'web' ? 0 : '90%',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Platform.OS === 'web' ? 16 : 4,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Platform.OS === 'web' ? 8 : 4,
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
        fontWeight: '800',
        fontSize: 10,
        color: '#9CA3AF',
        marginLeft: Platform.OS === 'web' ? 0 : 2,
        marginTop: Platform.OS === 'web' ? -2 : 0,
        letterSpacing: 0.5,
    },
    vDivider: {
        width: 1, // Thin modern divider
        height: 20,
        backgroundColor: '#E5E7EB',
    },
});
