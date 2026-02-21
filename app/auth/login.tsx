import { AuthHeroGraphic } from '@/components/auth/AuthHeroGraphic';
import { DynamicBackground } from '@/components/DynamicBackground';
import { ModernComicButton } from '@/components/ModernComicButton';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { supabase } from '@/constants/supabase';
import { COLORS } from '@/constants/theme';
import { Link } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { width } = useWindowDimensions();
    const isDesktop = width > 900;

    async function signIn() {
        setError('');
        if (!email.trim() || !password) {
            setError('Please enter your email and password.');
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
        <DynamicBackground>
            <ResponsiveContainer>
                <View style={[styles.mainLayout, isDesktop && styles.desktopLayout]}>

                    {/* LEFT PANE: Hero Graphic (Desktop Only) */}
                    {isDesktop && (
                        <View style={styles.leftPane}>
                            <AuthHeroGraphic />
                        </View>
                    )}

                    {/* RIGHT PANE: Auth Form */}
                    <View style={[styles.rightPane, !isDesktop && styles.mobilePane]}>
                        <View style={styles.card}>
                            {!isDesktop && (
                                <View style={styles.mobileHeader}>
                                    <Text style={styles.mobileTitle}>OG CHEMISTRY</Text>
                                    <View style={styles.badge}><Text style={styles.badgeText}>ELITE</Text></View>
                                </View>
                            )}

                            <Text style={styles.cardTitle}>SIGN IN</Text>

                            {error ? (
                                <View style={styles.errorBox}>
                                    <Text style={styles.errorText}>⚠️ {error}</Text>
                                </View>
                            ) : null}

                            <Text style={styles.label}>EMAIL ADDRESS</Text>
                            <TextInput
                                style={[styles.input, error ? styles.inputError : null]}
                                onChangeText={(t) => { setEmail(t); setError(''); }}
                                value={email}
                                placeholder="hero@example.com"
                                placeholderTextColor={COLORS.textMuted}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />

                            <Text style={styles.label}>SECRET PASSWORD</Text>
                            <TextInput
                                style={[styles.input, error ? styles.inputError : null]}
                                onChangeText={(t) => { setPassword(t); setError(''); }}
                                value={password}
                                secureTextEntry
                                placeholder="Enter your password..."
                                placeholderTextColor={COLORS.textMuted}
                                autoCapitalize="none"
                            />

                            <View style={styles.btnWrap}>
                                <ModernComicButton
                                    title={loading ? "AUTHENTICATING..." : "ENTER PLATFORM"}
                                    onPress={signIn}
                                    disabled={loading}
                                    variant="primary"
                                />
                            </View>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>New recruit? </Text>
                                <Link href="/auth/signup" asChild>
                                    <Text style={styles.footerLink}>Create your Hero Profile</Text>
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
        backgroundColor: COLORS.yellow, // Using yellow as secondary brand accent
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 0,
        marginBottom: 12,
        // Removed rotation
    },
    badgeText: {
        fontFamily: 'System',
        fontWeight: '700',
        fontSize: 12,
        color: '#111827', // Black text on yellow for contrast
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
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FCA5A5',
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
        height: 56, // Taller/sleeker
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
