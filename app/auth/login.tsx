import { AuthHeroGraphic } from '@/components/auth/AuthHeroGraphic';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { supabase } from '@/constants/supabase';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

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
                        <View style={styles.card}>
                            {!isDesktop && (
                                <View style={styles.mobileHeader}>
                                    <View style={styles.glowOrb} />
                                    <Text style={styles.mobileTitle}>OG CHEMISTRY</Text>
                                    <View style={styles.badge}><Text style={styles.badgeText}>ELITE ACCESS</Text></View>
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
                                placeholderTextColor="#475569"
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
                                placeholderTextColor="#475569"
                                autoCapitalize="none"
                            />

                            <View style={styles.btnWrap}>
                                <Pressable
                                    style={({ pressed }) => [
                                        styles.glowBtn,
                                        pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
                                        loading && { opacity: 0.5 }
                                    ]}
                                    onPress={signIn}
                                    disabled={loading}
                                >
                                    <Text style={styles.glowBtnText}>
                                        {loading ? "AUTHENTICATING..." : "ENTER PLATFORM"}
                                    </Text>
                                </Pressable>
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
        </View>
    );
}

const styles = StyleSheet.create({
    mainLayout: {
        flex: 1,
        width: '100%',
        minHeight: '100%',
        backgroundColor: '#020617', // Deep cinematic black
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
        borderWidth: 1,
        borderColor: '#1E293B',
        backgroundColor: '#0F172A',
        marginVertical: 40,
        shadowColor: '#38BDF8',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 40,
        elevation: 10,
    },
    leftPane: {
        flex: 1.2,
        borderRightWidth: 1,
        borderRightColor: '#1E293B',
        backgroundColor: '#020617',
    },
    rightPane: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0F172A', // Slate 900
        padding: 40,
    },
    mobilePane: {
        padding: 24,
        backgroundColor: 'transparent',
    },
    mobileHeader: {
        alignItems: 'center',
        marginBottom: 40,
        position: 'relative',
    },
    glowOrb: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#38BDF8',
        opacity: 0.15,
        top: -20,
        filter: 'blur(30px)',
    },
    mobileTitle: {
        fontFamily: 'System',
        fontWeight: '900',
        fontSize: 36,
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 1,
        marginBottom: 12,
        textShadowColor: '#38BDF8',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    badge: {
        backgroundColor: 'rgba(56, 189, 248, 0.1)', // Subtle neon blue tint
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(56, 189, 248, 0.3)',
    },
    badgeText: {
        fontFamily: 'System',
        fontWeight: '800',
        fontSize: 12,
        color: '#38BDF8',
        letterSpacing: 2,
    },
    card: {
        width: '100%',
        maxWidth: 480,
    },
    cardTitle: {
        fontFamily: 'System',
        fontWeight: '900',
        fontSize: 28,
        color: '#FFFFFF',
        marginBottom: 32,
        letterSpacing: 1,
    },
    errorBox: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 1,
        borderColor: '#EF4444',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    errorText: {
        fontFamily: 'System',
        fontSize: 14,
        color: '#FCA5A5',
        fontWeight: '600',
    },
    label: {
        fontFamily: 'System',
        fontWeight: '700',
        fontSize: 13,
        color: '#94A3B8',
        letterSpacing: 1,
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        height: 56,
        paddingHorizontal: 16,
        borderRadius: 12,
        fontSize: 16,
        fontFamily: 'System',
        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#1E293B',
        marginBottom: 24,
    },
    inputError: {
        borderColor: '#EF4444',
    },
    btnWrap: {
        marginTop: 8,
        marginBottom: 32,
    },
    glowBtn: {
        width: '100%',
        paddingVertical: 18,
        borderRadius: 16,
        backgroundColor: '#38BDF8',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#38BDF8',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 15,
        elevation: 10,
    },
    glowBtnText: {
        fontFamily: 'System',
        fontWeight: '900',
        fontSize: 15,
        color: '#020617',
        letterSpacing: 2,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    footerText: {
        fontFamily: 'System',
        color: '#64748B',
        fontSize: 15,
        fontWeight: '500',
    },
    footerLink: {
        fontFamily: 'System',
        color: '#38BDF8',
        fontSize: 15,
        fontWeight: '700',
    },
});
