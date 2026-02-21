import { COLORS } from '@/constants/theme';
import { Award } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface AchievementToastProps {
    achievement: any;
    onHide: () => void;
}

export function AchievementToast({ achievement, onHide }: AchievementToastProps) {
    const slideAnim = new Animated.Value(-100);
    const opacityAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.parallel([
            Animated.spring(slideAnim, { toValue: 40, tension: 50, friction: 7, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true })
        ]).start();

        const timeout = setTimeout(() => {
            Animated.parallel([
                Animated.timing(slideAnim, { toValue: -100, duration: 300, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 0, duration: 300, useNativeDriver: true })
            ]).start(() => onHide());
        }, 4000);

        return () => clearTimeout(timeout);
    }, []);

    if (!achievement) return null;

    return (
        <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }], opacity: opacityAnim }]}>
            <View style={styles.iconBox}>
                <Award color={COLORS.orange} size={32} />
            </View>
            <View style={styles.content}>
                <Text style={styles.unlockedText}>Achievement Unlocked!</Text>
                <Text style={styles.title}>{achievement.title}</Text>
                <Text style={styles.reward}>+{achievement.xp_reward} XP</Text>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.black,
        padding: 16,
        borderRadius: 20,
        shadowColor: COLORS.orange,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
        zIndex: 9999,
        borderWidth: 1,
        borderColor: COLORS.orange,
        width: '90%',
        maxWidth: 400,
        gap: 16
    },
    iconBox: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 149, 0, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.orange
    },
    content: { flex: 1 },
    unlockedText: { fontFamily: 'System', fontSize: 13, fontWeight: '800', color: COLORS.orange, textTransform: 'uppercase', letterSpacing: 1 },
    title: { fontFamily: 'System', fontSize: 18, fontWeight: '700', color: COLORS.white, marginTop: 2 },
    reward: { fontFamily: 'System', fontSize: 14, fontWeight: '800', color: '#BBF7D0', marginTop: 4 }
});
