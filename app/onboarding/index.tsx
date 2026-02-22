import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { COLORS } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

const SLIDES = [
    {
        isLogo: true,
        title: 'OG CHEMISTRY',
        subtitle: 'By Rosario',
        body: 'High-performance curriculum for the next generation of chemists. Professional, precise, and purely elemental.',
        accent: COLORS.blue,
    },
    {
        emoji: '🧪',
        title: 'LEARN YOUR WAY',
        subtitle: 'Videos • Sims • Quizzes',
        body: 'Watch expert explanations, interact with 3D molecules, and test your mastery — all in one place.',
        accent: COLORS.orange,
    },
    {
        emoji: '🚀',
        title: 'READY TO START?',
        subtitle: 'Elite Access',
        body: 'Create an account and wait for approval. Once vetted, you gain full access to all OG materials.',
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
        <View style={styles.mainContainer}>
            <ResponsiveContainer>
                <View style={styles.container}>
                    {/* Progress */}
                    <View style={styles.progressRow}>
                        {SLIDES.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.progressBar,
                                    i <= index ? { backgroundColor: slide.accent } : { backgroundColor: '#E2E8F0' },
                                ]}
                            />
                        ))}
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        {slide.isLogo ? (
                            <View style={styles.logoContainer}>
                                <Image
                                    source={require('../../assets/images/logo.png')}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                            </View>
                        ) : (
                            <View style={[styles.emojiContainer, { backgroundColor: slide.accent + '10' }]}>
                                <Text style={styles.emoji}>{slide.emoji}</Text>
                            </View>
                        )}

                        <Text style={styles.title}>{slide.title}</Text>
                        <Text style={[styles.subtitle, { color: slide.accent }]}>{slide.subtitle}</Text>

                        <View style={styles.card}>
                            <Text style={styles.body}>{slide.body}</Text>
                        </View>
                    </View>

                    {/* Actions */}
                    <View style={styles.footer}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.primaryBtn,
                                { backgroundColor: '#0F172A' },
                                pressed && styles.btnPressed
                            ]}
                            onPress={goNext}
                        >
                            <Text style={styles.primaryBtnText}>
                                {index === SLIDES.length - 1 ? "GET STARTED" : "CONTINUE"}
                            </Text>
                        </Pressable>
                        {index < SLIDES.length - 1 && (
                            <Pressable style={styles.skipBtn} onPress={skip}>
                                <Text style={styles.skipBtnText}>SKIP</Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            </ResponsiveContainer>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        paddingTop: 60,
        paddingBottom: 40,
        paddingHorizontal: 24,
    },
    progressRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 60,
        paddingHorizontal: 40,
    },
    progressBar: {
        flex: 1,
        height: 4,
        borderRadius: 2,
    },
    content: {
        flex: 1,
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: 48,
    },
    logo: {
        width: 160,
        height: 160,
    },
    emojiContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 48,
    },
    emoji: {
        fontSize: 64,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0F172A',
        textAlign: 'center',
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
        marginTop: 8,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    card: {
        marginTop: 32,
        paddingHorizontal: 12,
        width: '100%',
    },
    body: {
        fontSize: 17,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 28,
        fontWeight: '500',
    },
    footer: {
        paddingTop: 20,
        gap: 12,
    },
    primaryBtn: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
        letterSpacing: 1,
    },
    btnPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.98 }],
    },
    skipBtn: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    skipBtnText: {
        color: '#94A3B8',
        fontWeight: '700',
        fontSize: 14,
        letterSpacing: 1,
    }
});

