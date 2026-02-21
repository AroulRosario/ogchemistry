import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface Flashcard {
    id: string;
    term: string;
    definition: string;
}

interface FlashcardSetProps {
    cards: Flashcard[];
}

export function FlashcardSet({ cards }: FlashcardSetProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const flipRotation = useSharedValue(0);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
        flipRotation.value = withSpring(isFlipped ? 0 : 180, {
            damping: 15,
            stiffness: 90,
        });
    };

    const nextCard = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
            flipRotation.value = 0;
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
            flipRotation.value = 0;
        }
    };

    const frontAnimatedStyle = useAnimatedStyle(() => {
        const rotateValue = interpolate(flipRotation.value, [0, 180], [0, 180]);
        return {
            transform: [{ rotateY: `${rotateValue}deg` }],
            backfaceVisibility: 'hidden',
        };
    });

    const backAnimatedStyle = useAnimatedStyle(() => {
        const rotateValue = interpolate(flipRotation.value, [0, 180], [180, 360]);
        return {
            transform: [{ rotateY: `${rotateValue}deg` }],
            backfaceVisibility: 'hidden',
        };
    });

    const currentCard = cards[currentIndex];

    if (!currentCard) return null;

    return (
        <View style={styles.container}>
            <View style={styles.cardContainer}>
                <Pressable onPress={handleFlip} style={styles.cardWrapper}>
                    {/* Front Side */}
                    <Animated.View style={[styles.card, styles.cardFront, frontAnimatedStyle]}>
                        <Text style={styles.cardLabel}>TERM</Text>
                        <Text style={styles.cardText}>{currentCard.term}</Text>
                        <View style={styles.flipHint}>
                            <RotateCcw size={16} color="#94A3B8" />
                            <Text style={styles.flipHintText}>Tap to flip</Text>
                        </View>
                    </Animated.View>

                    {/* Back Side */}
                    <Animated.View style={[styles.card, styles.cardBack, backAnimatedStyle]}>
                        <Text style={styles.cardLabel}>DEFINITION</Text>
                        <Text style={styles.cardTextSmall}>{currentCard.definition}</Text>
                    </Animated.View>
                </Pressable>
            </View>

            <View style={styles.controls}>
                <Pressable
                    onPress={prevCard}
                    style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
                    disabled={currentIndex === 0}
                >
                    <ChevronLeft size={24} color={currentIndex === 0 ? '#CBD5E1' : '#1E293B'} />
                </Pressable>

                <View style={styles.progress}>
                    <Text style={styles.progressText}>{currentIndex + 1} / {cards.length}</Text>
                </View>

                <Pressable
                    onPress={nextCard}
                    style={[styles.navBtn, currentIndex === cards.length - 1 && styles.navBtnDisabled]}
                    disabled={currentIndex === cards.length - 1}
                >
                    <ChevronRight size={24} color={currentIndex === cards.length - 1 ? '#CBD5E1' : '#1E293B'} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        alignItems: 'center',
    },
    cardContainer: {
        width: '100%',
        height: 240,
        maxWidth: 500,
    },
    cardWrapper: {
        width: '100%',
        height: '100%',
    },
    card: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    cardFront: {
        zIndex: 1,
    },
    cardBack: {
        backgroundColor: '#F8FAFC',
    },
    cardLabel: {
        position: 'absolute',
        top: 20,
        left: 20,
        fontSize: 10,
        fontWeight: '900',
        color: '#94A3B8',
        letterSpacing: 2,
    },
    cardText: {
        fontSize: 28,
        fontWeight: '900',
        color: '#1E293B',
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    cardTextSmall: {
        fontSize: 18,
        fontWeight: '600',
        color: '#475569',
        textAlign: 'center',
        lineHeight: 26,
    },
    flipHint: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    flipHintText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#94A3B8',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
        gap: 24,
    },
    navBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    navBtnDisabled: {
        backgroundColor: '#F1F5F9',
        borderColor: '#F1F5F9',
    },
    progress: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748B',
    },
});
