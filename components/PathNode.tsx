import { COLORS } from '@/constants/theme';
import { Check, Lock } from 'lucide-react-native';
import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

interface PathNodeProps {
    index: number;
    title: string;
    type: string;
    isCompleted?: boolean;
    isLocked?: boolean;
    onPress: () => void;
    offset?: number; // For the wavy path effect
}

export function PathNode({
    index,
    title,
    type,
    isCompleted,
    isLocked,
    onPress,
    offset = 0,
}: PathNodeProps) {
    const scale = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        if (!isLocked) {
            Animated.spring(scale, {
                toValue: 0.90,
                useNativeDriver: true,
                tension: 100,
                friction: 5,
            }).start();
        }
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 5,
        }).start();
    };

    const getColors = () => {
        if (isLocked) return { bg: '#E2E8F0', border: '#94A3B8', icon: '#64748B', ring: '#CBD5E1' };
        if (isCompleted) return { bg: COLORS.green, border: COLORS.greenDark, icon: COLORS.white, ring: '#D9F99D' };
        return { bg: COLORS.blue, border: COLORS.blueDark, icon: COLORS.white, ring: '#DBEAFE' };
    };

    const colors = getColors();

    return (
        <View style={[styles.wrapper, { transform: [{ translateX: offset }] }]}>
            <Pressable
                onPress={isLocked ? undefined : onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                style={styles.pressable}
            >
                <Animated.View style={[
                    styles.node,
                    {
                        backgroundColor: colors.bg,
                        borderColor: COLORS.black,
                        transform: [{ scale }]
                    }
                ]}>
                    {/* Ring for 3D effect */}
                    <View style={[styles.innerRing, { borderColor: colors.ring }]} />

                    {/* Glossy Overlay */}
                    <View style={styles.glossOverlay} />

                    {isLocked ? (
                        <Lock size={32} color={colors.icon} strokeWidth={3} />
                    ) : isCompleted ? (
                        <Check size={40} color={colors.icon} strokeWidth={5} />
                    ) : (
                        <Text style={styles.indexText}>{index + 1}</Text>
                    )}
                </Animated.View>
            </Pressable>

            <View style={[styles.labelWrapper, isLocked && styles.lockedLabelWrapper]}>
                <View style={styles.labelPointer} />
                <View style={[styles.labelContainer, isLocked && styles.lockedLabelContainer]}>
                    <Text style={[styles.label, isLocked && styles.lockedLabel]}>
                        {title.toUpperCase()}
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        marginVertical: 25,
        width: '100%',
    },
    pressable: {
        zIndex: 2,
    },
    node: {
        width: 80, // Slightly smaller, more refined
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0, // Remove aggressive black border
        // Soft, glowing elevation instead of flat comic shadow
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },
    innerRing: {
        position: 'absolute',
        top: 3,
        left: 3,
        right: 3,
        bottom: 3,
        borderRadius: 38,
        borderWidth: 2,
        opacity: 0.5,
    },
    glossOverlay: { // Keeping subtle gloss for a slightly tactile feel
        position: 'absolute',
        top: 4,
        left: 10,
        width: 40,
        height: 15,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 20,
        transform: [{ rotate: '-15deg' }],
    },
    indexText: {
        color: '#FFFFFF',
        fontFamily: 'System', // Use system default, bold
        fontWeight: '800',
        fontSize: 28,
        // Remove comic text shadow
    },
    labelWrapper: {
        marginTop: 12,
        alignItems: 'center',
    },
    labelPointer: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 6,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#FFFFFF', // Modern white bubble
        marginBottom: -1,
        zIndex: 1,
    },
    labelContainer: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB', // Soft gray border instead of black 3px
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    lockedLabelContainer: {
        backgroundColor: '#F9FAFB',
        borderColor: '#E5E7EB',
    },
    label: {
        fontFamily: 'System',
        fontWeight: '700',
        fontSize: 14,
        color: '#4B5563', // Soft Dark Gray
        letterSpacing: 0.5,
    },
    lockedLabel: {
        color: '#9CA3AF',
    },
    lockedLabelWrapper: {
        opacity: 0.8,
    }
});
