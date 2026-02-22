import { AuthHeroGraphic } from '@/components/auth/AuthHeroGraphic';
import { DynamicBackground } from '@/components/DynamicBackground';
import { ModernComicButton } from '@/components/ModernComicButton';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { supabase } from '@/constants/supabase';
import { COLORS } from '@/constants/theme';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

export default function SignUpScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isDesktop = width > 900;

    async function signUp() {
        setError('');
        setSuccess('');

        if (!email.trim() || !password) {
            setError('Please enter your email and password.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: email.trim(),
                password,
            });

            if (signUpError) {
                setError(signUpError.message);
                setLoading(false);
                return;
            }

            if (data.session) {
                return; // AuthContext handles redirect
            }

            if (data.user) {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password,
                });

                if (signInError) {
                    setSuccess('Account created! Please sign in.');
                    setTimeout(() => router.replace('/auth/login'), 1500);
                }
            }
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <DynamicBackground>
            <ResponsiveContainer>
                <View style={[styles.mainLayout, isDesktop && styles.desktopLayout]}>

                    {/* LEFT PANE: Hero Graphic (Desktop Only) */}
                    {isDesktop && (
                        <View style={styles.leftPane}>
                            <AuthHeroGraphic />
                        </View>
                    )}

                    {/* RIGHT PANE: Signup Form */}
                    <View style={[styles.rightPane, !isDesktop && styles.mobilePane]}>
                        <View style={styles.card}>
                            {!isDesktop && (
                                <View style={styles.mobileHeader}>
                                    <View style={styles.badge}><Text style={styles.badgeText}>ELITE RECRUIT</Text></View>
                                    <Text style={styles.mobileTitle}>OG CHEMISTRY</Text>
                                </View>
                            )}

                            <Text style={styles.cardTitle}>JOIN THE ELITE</Text>

                            {error ? (
                                <View style={styles.errorBox}>
                                    <Text style={styles.errorText}>⚠️ {error}</Text>
                                </View>
                            ) : null}

                            {success ? (
                                <View style={styles.successBox}>
                                    <Text style={styles.successText}>✅ {success}</Text>
                                </View>
                            ) : null}

                            <Text style={styles.label}>EMAIL ADDRESS</Text>
                            <TextInput
                                style={[styles.input, error ? styles.inputError : null]}
                                onChangeText={(t) => { setEmail(t); setError(''); }}
                                value={email}
                                placeholder="hero@chemistry.com"
                                placeholderTextColor={COLORS.textMuted}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />

                            <Text style={styles.label}>SECURE PASSWORD</Text>
                            <TextInput
                                style={[styles.input, error ? styles.inputError : null]}
                                onChangeText={(t) => { setPassword(t); setError(''); }}
                                value={password}
                                secureTextEntry
                                placeholder="Min. 6 strong characters"
                                placeholderTextColor={COLORS.textMuted}
                                autoCapitalize="none"
                            />

                            <View style={styles.btnWrap}>
                                <ModernComicButton
                                    title={loading ? "PREPARING PROFILE..." : "CREATE RECRUIT PROFILE"}
                                    onPress={signUp}
                                    variant="secondary"
                                    disabled={loading}
                                />
                            </View>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Already on the team? </Text>
                                <Link href="/auth/login" asChild>
                                    <Text style={styles.footerLink}>Back to HQ (Sign In)</Text>
                                </Link>
                            </View>
                        </View>
                    </View>

                </View>
            </ResponsiveContainer>
        </DynamicBackground>
    );
}

const styles = StyleSheet.create({
    mainLayout: {
        flex: 1,
        width: '100%',
        minHeight: '100%',
        flexDirection: 'column',
    },
    desktopLayout: {
        flexDirection: 'row',
        alignItems: 'stretch',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
        marginVertical: 40,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    leftPane: {
        flex: 1.2,
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
    },
    rightPane: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB', // Very subtle off-white
        padding: 40,
    },
    mobilePane: {
        padding: 24,
        paddingTop: 60,
        backgroundColor: 'transparent',
    },
    mobileHeader: {
        alignItems: 'center',
        marginBottom: 32,
    },
    mobileTitle: {
        fontFamily: 'System',
        fontWeight: '800',
        fontSize: 32,
        color: '#111827',
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    badge: {
        backgroundColor: COLORS.blue, // Clean brand blue
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 0, // No border
        marginBottom: 12,
        // Removed rotation
    },
    badgeText: {
        fontFamily: 'System',
        fontWeight: '700',
        fontSize: 12,
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    card: {
        width: '100%',
        maxWidth: 480,
    },
    cardTitle: {
        fontFamily: 'System',
        fontWeight: '800',
        fontSize: 28,
        color: '#111827',
        marginBottom: 32,
        letterSpacing: -0.5,
    },
    errorBox: {
        backgroundColor: '#FEF2F2', // Soft red bg
        borderWidth: 1,
        borderColor: '#FCA5A5', // Soft red border
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    errorText: {
        fontFamily: 'System',
        fontSize: 14,
        color: '#991B1B', // Dark red text
        fontWeight: '600',
    },
    successBox: {
        backgroundColor: '#F0FDF4', // Soft green bg
        borderWidth: 1,
        borderColor: '#86EFAC', // Soft green border
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    successText: {
        fontFamily: 'System',
        fontSize: 14,
        color: '#166534', // Dark green text
        fontWeight: '600',
    },
    label: {
        fontFamily: 'System',
        fontWeight: '600',
        fontSize: 14,
        color: '#374151',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        height: 56, // Slightly taller/sleeker
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 16,
        fontFamily: 'System',
        color: '#111827',
        borderWidth: 1,
        borderColor: '#D1D5DB', // Standard gray border
        marginBottom: 24,
    },
    inputError: {
        borderColor: '#EF4444',
    },
    btnWrap: {
        marginTop: 8,
        marginBottom: 32,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    footerText: {
        fontFamily: 'System',
        color: '#6B7280',
        fontSize: 15,
        fontWeight: '500',
    },
    footerLink: {
        fontFamily: 'System',
        color: COLORS.blue,
        fontSize: 15,
        fontWeight: '700',
    },
});
