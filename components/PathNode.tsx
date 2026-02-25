import { COLORS } from '@/constants/theme';
import { Check, ChevronRight, Lock, Play } from 'lucide-react-native';
import React from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

interface PathNodeProps {
    index: number;
    title: string;
    type: string;
    isCompleted?: boolean;
    isLocked?: boolean;
    onPress: () => void;
    isLastNode?: boolean;
}

export function PathNode({
    index,
    title,
    type,
    isCompleted,
    isLocked,
    onPress,
    isLastNode = false
}: PathNodeProps) {
    const scale = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        if (!isLocked) {
            Animated.spring(scale, {
                toValue: 0.98,
                useNativeDriver: true,
            }).start();
        }
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    const isCurrent = !isLocked && !isCompleted;

    // Status colors
    const colors = isLocked
        ? { dot: '#E2E8F0', line: '#F1F5F9', border: '#F8FAFC', text: '#94A3B8' }
        : isCompleted
            ? { dot: COLORS.green, line: COLORS.green, border: COLORS.green, text: COLORS.greenDark }
            : { dot: COLORS.blue, line: '#E2E8F0', border: COLORS.blue, text: COLORS.blueDark };

    return (
        <View style={styles.container}>
            {/* Left Track & Node */}
            <View style={styles.trackColumn}>
                <View style={[styles.nodeDot, { backgroundColor: colors.dot, borderColor: colors.border, borderWidth: isCurrent ? 4 : 0 }]}>
                    {isLocked ? (
                        <Lock size={12} strokeWidth={3} color="#FFF" />
                    ) : isCompleted ? (
                        <Check size={14} strokeWidth={4} color="#FFF" />
                    ) : (
                        <View style={styles.innerPulse} />
                    )}
                </View>
                {!isLastNode && <View style={[styles.trackLine, { backgroundColor: colors.line }]} />}
            </View>

            {/* Right Content Card */}
            <Animated.View style={[styles.cardContainer, { transform: [{ scale }] }]}>
                <Pressable
                    onPress={isLocked ? undefined : onPress}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    style={[styles.card, isLocked && styles.cardLocked, isCurrent && styles.cardCurrent]}
                >
                    <View style={styles.cardHeader}>
                        <Text style={[styles.chapterLabel, { color: colors.text }]}>
                            {isLocked ? 'MISSION LOCKED' : isCompleted ? 'MISSION CLEARED' : 'CURRENT MISSION'}
                        </Text>
                        {!isLocked && (
                            <View style={[styles.actionBadge, isCompleted && { backgroundColor: COLORS.green + '20' }]}>
                                {isCompleted ? <Check size={12} color={COLORS.green} strokeWidth={3} /> : <Play size={10} color={COLORS.blue} fill={COLORS.blue} />}
                            </View>
                        )}
                    </View>

                    <Text style={[styles.title, isLocked && styles.titleLocked]}>
                        {title}
                    </Text>

                    {isCurrent && (
                        <View style={styles.currentFooter}>
                            <Text style={styles.currentDesc}>Tap to resume training and unlock the next module.</Text>
                            <ChevronRight size={16} color={COLORS.blue} strokeWidth={3} />
                        </View>
                    )}
                </Pressable>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: Platform.OS === 'web' ? 40 : 16,
    },
    trackColumn: {
        width: 40,
        alignItems: 'center',
        marginRight: 16,
    },
    nodeDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    innerPulse: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#FFF',
    },
    trackLine: {
        width: 4,
        flex: 1,
        marginTop: -16,
        marginBottom: -16, // Connect exactly to the next dot
        zIndex: 1,
        borderRadius: 2,
    },
    cardContainer: {
        flex: 1,
        paddingBottom: 32, // Space between cards
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    cardLocked: {
        backgroundColor: '#F8FAFC',
        borderColor: '#F1F5F9',
        shadowOpacity: 0,
    },
    cardCurrent: {
        borderColor: COLORS.blue,
        borderWidth: 2,
        shadowColor: COLORS.blue,
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    chapterLabel: {
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    actionBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1E293B',
        letterSpacing: -0.5,
        lineHeight: 28,
    },
    titleLocked: {
        color: '#94A3B8',
    },
    currentFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    currentDesc: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        flex: 1,
        marginRight: 16,
    }
});
