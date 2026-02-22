import { AuthHeroGraphic } from '@/components/auth/AuthHeroGraphic';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { supabase } from '@/constants/supabase';
import { Link } from 'expo-router';
import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

export default function LoginScreen() {
    const [step, setStep] = useState(1); // 1: Email, 2: Password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { width } = useWindowDimensions();
    const isDesktop = width > 900;

    // Animation values
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    const transitionTo = (nextStep: number) => {
        // Simple fade out
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
        }).start(() => {
            setStep(nextStep);
            // Fade in
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }).start();
        });
    };

    const handleNext = () => {
        if (!email.trim()) {
            setError('Please enter your email address.');
            return;
        }
        setError('');
        transitionTo(2);
    };

    const handleBack = () => {
        setError('');
        transitionTo(1);
    };

    async function signIn() {
        setError('');
        if (!password) {
            setError('Please enter your password.');
            return;
        }
        setLoading(true);

        try {
            const { error: authError } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (authError) {
                setError(authError.message);
            }
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.mainLayout}>
            <ResponsiveContainer>
                <View style={[styles.contentLayout, isDesktop && styles.desktopLayout]}>

                    {/* LEFT PANE: Hero Graphic (Desktop Only) */}
                    {isDesktop && (
                        <View style={styles.leftPane}>
                            <AuthHeroGraphic />
                        </View>
                    )}

                    {/* RIGHT PANE: Auth Form */}
                    <View style={[styles.rightPane, !isDesktop && styles.mobilePane]}>
                        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>

                            {!isDesktop && (
                                <View style={styles.mobileHeader}>
                                    <View style={styles.mobileLogoContainer}>
                                        <Text style={styles.mobileTitle}>OG CHEM</Text>
                                    </View>
                                </View>
                            )}

                            <View style={styles.stepHeader}>
                                <Text style={styles.stepTitle}>
                                    {step === 1 ? 'Sign in' : 'Security check'}
                                </Text>
                                <Text style={styles.stepSubtitle}>
                                    {step === 1
                                        ? 'Enter your email to access your dashboard'
                                        : 'Please enter your account password'}
                                </Text>
                            </View>

                            {error ? (
                                <View style={styles.errorBox}>
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            ) : null}

                            {step === 1 ? (
                                <View>
                                    <Text style={styles.label}>EMAIL ADDRESS</Text>
                                    <TextInput
                                        style={[styles.input, error ? styles.inputError : null]}
                                        onChangeText={(t) => { setEmail(t); setError(''); }}
                                        value={email}
                                        placeholder="name@example.com"
                                        placeholderTextColor="#94A3B8"
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        onSubmitEditing={handleNext}
                                    />

                                    <Pressable
                                        style={({ pressed }) => [
                                            styles.primaryBtn,
                                            pressed && styles.btnPressed
                                        ]}
                                        onPress={handleNext}
                                    >
                                        <Text style={styles.primaryBtnText}>Continue</Text>
                                    </Pressable>
                                </View>
                            ) : (
                                <View>
                                    <View style={styles.emailDisplay}>
                                        <Text style={styles.emailDisplayText}>{email}</Text>
                                        <Pressable onPress={handleBack}>
                                            <Text style={styles.changeBtn}>Change</Text>
                                        </Pressable>
                                    </View>

                                    <Text style={styles.label}>PASSWORD</Text>
                                    <TextInput
                                        style={[styles.input, error ? styles.inputError : null]}
                                        onChangeText={(t) => { setPassword(t); setError(''); }}
                                        value={password}
                                        secureTextEntry
                                        placeholder="••••••••"
                                        placeholderTextColor="#94A3B8"
                                        autoCapitalize="none"
                                        onSubmitEditing={signIn}
                                        autoFocus
                                    />

                                    <Pressable
                                        style={({ pressed }) => [
                                            styles.primaryBtn,
                                            pressed && styles.btnPressed,
                                            loading && styles.btnDisabled
                                        ]}
                                        onPress={signIn}
                                        disabled={loading}
                                    >
                                        <Text style={styles.primaryBtnText}>
                                            {loading ? 'Authenticating...' : 'Sign In'}
                                        </Text>
                                    </Pressable>

                                    <Pressable style={styles.backBtn} onPress={handleBack}>
                                        <Text style={styles.backBtnText}>Back</Text>
                                    </Pressable>
                                </View>
                            )}

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>New to OG Chemistry? </Text>
                                <Link href="/auth/signup" asChild>
                                    <Text style={styles.footerLink}>Create account</Text>
                                </Link>
                            </View>
                        </Animated.View>
                    </View>

                </View>
            </ResponsiveContainer>
        </View>
    );
}

const styles = StyleSheet.create({
    mainLayout: {
        flex: 1,
        width: '100%',
        minHeight: '100%',
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
    },
    contentLayout: {
        flexDirection: 'column',
    },
    desktopLayout: {
        flexDirection: 'row',
        alignItems: 'stretch',
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        marginVertical: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 30,
        elevation: 10,
        minHeight: 650,
    },
    leftPane: {
        flex: 1.1,
        backgroundColor: '#FFFFFF',
        borderRightWidth: 1,
        borderRightColor: '#F1F5F9',
    },
    rightPane: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60,
        backgroundColor: '#FFFFFF',
    },
    mobilePane: {
        padding: 24,
    },
    mobileHeader: {
        alignItems: 'center',
        marginBottom: 48,
    },
    mobileLogoContainer: {
        marginBottom: 16,
    },
    mobileTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -1,
    },
    card: {
        width: '100%',
        maxWidth: 400,
    },
    stepHeader: {
        marginBottom: 40,
    },
    stepTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#0F172A',
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    stepSubtitle: {
        fontSize: 16,
        color: '#64748B',
        lineHeight: 24,
    },
    errorBox: {
        backgroundColor: '#FEF2F2',
        borderRadius: 12,
        padding: 16,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    errorText: {
        fontSize: 14,
        color: '#B91C1C',
        fontWeight: '600',
    },
    emailDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F8FAFC',
        padding: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    emailDisplayText: {
        fontSize: 15,
        color: '#475569',
        fontWeight: '600',
    },
    changeBtn: {
        fontSize: 14,
        color: '#2563EB',
        fontWeight: '700',
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: '#94A3B8',
        letterSpacing: 1,
        marginBottom: 10,
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: '#F8FAFC',
        height: 56,
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 16,
        color: '#0F172A',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 32,
    },
    inputError: {
        borderColor: '#FDA4AF',
        backgroundColor: '#FFF1F2',
    },
    primaryBtn: {
        backgroundColor: '#0F172A',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    btnPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.99 }],
    },
    btnDisabled: {
        opacity: 0.6,
    },
    backBtn: {
        alignItems: 'center',
        paddingVertical: 16,
        marginTop: 8,
    },
    backBtnText: {
        color: '#64748B',
        fontSize: 15,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 48,
    },
    footerText: {
        color: '#64748B',
        fontSize: 15,
    },
    footerLink: {
        color: '#2563EB',
        fontSize: 15,
        fontWeight: '700',
    },
});

