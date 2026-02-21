import { DynamicBackground } from '@/components/DynamicBackground';
import { ModernComicButton } from '@/components/ModernComicButton';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { COLORS, STYLES } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

const SLIDES = [
    {
        isLogo: true,
        title: 'OG CHEMISTRY',
        subtitle: 'By Rosario',
        body: 'Your ultimate chemistry learning platform. Master reactions, bonds, and molecular structures with premium materials.',
        accent: COLORS.blue,
    },
    {
        emoji: '🧪',
        title: 'LEARN YOUR WAY',
        subtitle: 'Videos • Sims • Quizzes',
        body: 'Watch expert explanations, interact with 3D molecules, and test your mastery — all in one place.',
        accent: COLORS.yellow,
    },
    {
        emoji: '🚀',
        title: 'READY TO START?',
        subtitle: 'Gatekept for Quality',
        body: 'Create an account and wait for teacher approval. Once approved, you gain full access to all OG materials.',
        accent: COLORS.green,
    },
];

export default function OnboardingScreen() {
    const [index, setIndex] = useState(0);
    const router = useRouter();
    const slide = SLIDES[index];

    const goNext = async () => {
        if (index < SLIDES.length - 1) {
            setIndex(index + 1);
        } else {
            await AsyncStorage.setItem('hasLaunched', 'true');
            router.replace('/auth/login' as any);
        }
    };

    const skip = async () => {
        await AsyncStorage.setItem('hasLaunched', 'true');
        router.replace('/auth/login' as any);
    };

    return (
        <DynamicBackground>
            <ResponsiveContainer>
                <View style={styles.container}>
                    {/* Progress */}
                    <View style={styles.progressRow}>
                        {SLIDES.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.progressBar,
                                    i <= index ? { backgroundColor: slide.accent } : {},
                                ]}
                            />
                        ))}
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        {slide.isLogo ? (
                            <Image
                                source={require('../../assets/images/logo.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        ) : (
                            <Text style={styles.emoji}>{slide.emoji}</Text>
                        )}

                        <Text style={styles.title}>{slide.title}</Text>
                        <Text style={[styles.subtitle, { color: slide.accent }]}>{slide.subtitle}</Text>

                        <View style={[styles.card, STYLES.card]}>
                            <Text style={styles.body}>{slide.body}</Text>
                        </View>
                    </View>

                    {/* Actions */}
                    <View style={styles.footer}>
                        <ModernComicButton
                            title={index === SLIDES.length - 1 ? "ENTER THE LAB" : "CONTINUE"}
                            onPress={goNext}
                            variant={index === SLIDES.length - 1 ? "primary" : "secondary"}
                        />
                        {index < SLIDES.length - 1 && (
                            <ModernComicButton
                                title="SKIP"
                                onPress={skip}
                                variant="outline"
                                style={{ marginTop: 12 }}
                            />
                        )}
                    </View>
                </View>
            </ResponsiveContainer>
        </DynamicBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 30,
    },
    progressRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    progressBar: {
        flex: 1,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.gray,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 140,
        height: 140,
        marginBottom: 20,
    },
    emoji: {
        fontSize: 72,
        marginBottom: 16,
    },
    title: {
        fontFamily: 'Bangers_400Regular',
        fontSize: 40,
        color: COLORS.black,
        textAlign: 'center',
        letterSpacing: 2,
    },
    subtitle: {
        fontFamily: 'LuckiestGuy_400Regular',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 4,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    card: {
        marginTop: 32,
        padding: 24,
        width: '100%',
        backgroundColor: COLORS.white,
    },
    body: {
        fontFamily: 'System',
        fontSize: 15,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        fontWeight: '600',
    },
    footer: {
        paddingTop: 20,
    },
});
