import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

const SLIDES = [
    {
        isLogo: true,
        title: 'OG CHEMISTRY',
        subtitle: 'By Rosario',
        body: 'Your ultimate chemistry learning platform. Master reactions, bonds, and molecular structures with premium materials.',
        accent: '#38BDF8', // Neon Blue
    },
    {
        emoji: '🧪',
        title: 'LEARN YOUR WAY',
        subtitle: 'Videos • Sims • Quizzes',
        body: 'Watch expert explanations, interact with 3D molecules, and test your mastery — all in one place.',
        accent: '#FBBF24', // Neon Yellow
    },
    {
        emoji: '🚀',
        title: 'READY TO START?',
        subtitle: 'Gatekept for Quality',
        body: 'Create an account and wait for teacher approval. Once approved, you gain full access to all OG materials.',
        accent: '#34D399', // Neon Green
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
                                    i <= index ? { backgroundColor: slide.accent, shadowColor: slide.accent, shadowOpacity: 0.8, shadowRadius: 8, elevation: 4 } : {},
                                ]}
                            />
                        ))}
                    </View>

                    {/* Content */}
                    <View style={styles.content}>
                        {slide.isLogo ? (
                            <View style={styles.logoBlur}>
                                <Image
                                    source={require('../../assets/images/logo.png')}
                                    style={styles.logo}
                                    resizeMode="contain"
                                />
                            </View>
                        ) : (
                            <View style={[styles.emojiContainer, { shadowColor: slide.accent }]}>
                                <Text style={styles.emoji}>{slide.emoji}</Text>
                            </View>
                        )}

                        <Text style={[styles.title, { textShadowColor: slide.accent, textShadowRadius: 20 }]}>{slide.title}</Text>
                        <Text style={[styles.subtitle, { color: slide.accent }]}>{slide.subtitle}</Text>

                        <View style={styles.card}>
                            <Text style={styles.body}>{slide.body}</Text>
                        </View>
                    </View>

                    {/* Actions */}
                    <View style={styles.footer}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.glowBtn,
                                { backgroundColor: slide.accent, shadowColor: slide.accent },
                                pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] }
                            ]}
                            onPress={goNext}
                        >
                            <Text style={[styles.glowBtnText, { color: '#020617' }]}>
                                {index === SLIDES.length - 1 ? "ENTER THE LAB" : "CONTINUE"}
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
        backgroundColor: '#020617', // Deep slate space black
    },
    container: {
        flex: 1,
        paddingTop: 80,
        paddingBottom: 40,
        paddingHorizontal: 30,
    },
    progressRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 60,
        paddingHorizontal: 20,
    },
    progressBar: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#1E293B',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20,
    },
    logoBlur: {
        marginBottom: 40,
        shadowColor: '#38BDF8',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 40,
        elevation: 10,
    },
    logo: {
        width: 180,
        height: 180,
    },
    emojiContainer: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#0F172A',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        borderWidth: 1,
        borderColor: '#1E293B',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 30,
        elevation: 15,
    },
    emoji: {
        fontSize: 72,
    },
    title: {
        fontFamily: 'System',
        fontWeight: '900',
        fontSize: 42,
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 2,
        textShadowOffset: { width: 0, height: 0 },
    },
    subtitle: {
        fontFamily: 'System',
        fontWeight: '800',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
        letterSpacing: 4,
        textTransform: 'uppercase',
    },
    card: {
        marginTop: 40,
        padding: 24,
        width: '100%',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#1E293B',
    },
    body: {
        fontFamily: 'System',
        fontSize: 16,
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: 26,
        fontWeight: '500',
    },
    footer: {
        paddingTop: 20,
        gap: 16,
    },
    glowBtn: {
        width: '100%',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
        elevation: 10,
    },
    glowBtnText: {
        fontFamily: 'System',
        fontWeight: '900',
        fontSize: 16,
        letterSpacing: 2,
    },
    skipBtn: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    skipBtnText: {
        color: '#64748B',
        fontFamily: 'System',
        fontWeight: '700',
        fontSize: 14,
        letterSpacing: 1,
    }
});
