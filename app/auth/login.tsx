import { AuthHeroGraphic } from '@/components/auth/AuthHeroGraphic';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { supabase } from '@/constants/supabase';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

const WEB_CSS = `
@keyframes loginFloat1 {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0px, 0px) scale(1); }
}
@keyframes loginFloat2 {
    0% { transform: translate(0px, 0px) scale(1); }
    33% { transform: translate(-30px, 60px) scale(1.2); }
    66% { transform: translate(20px, -20px) scale(0.8); }
    100% { transform: translate(0px, 0px) scale(1); }
}
.animated-bg {
    position: absolute;
    inset: 0;
    overflow: hidden;
    z-index: 0;
    pointer-events: none;
    background-color: #020617;
}
.animated-bg .orb1 {
    position: absolute;
    top: -10%; left: -10%;
    width: 50vw; height: 50vw;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(56,189,248,0.15) 0%, rgba(2,6,23,0) 70%);
    animation: loginFloat1 15s ease-in-out infinite;
}
.animated-bg .orb2 {
    position: absolute;
    bottom: -20%; right: -10%;
    width: 60vw; height: 60vw;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(234,179,8,0.1) 0%, rgba(2,6,23,0) 70%);
    animation: loginFloat2 20s ease-in-out infinite;
}
.animated-bg .orb3 {
    position: absolute;
    top: 40%; right: 20%;
    width: 30vw; height: 30vw;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(16,185,129,0.1) 0%, rgba(2,6,23,0) 70%);
    animation: loginFloat1 12s ease-in-out infinite reverse;
}
`;

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
            {Platform.OS === 'web' && (
                <>
                    <style dangerouslySetInnerHTML={{ __html: WEB_CSS }} />
                    <div className="animated-bg">
                        <div className="orb1" />
                        <div className="orb2" />
                        <div className="orb3" />
                    </div>
                </>
            )}
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
        position: 'relative',
    },
    contentLayout: {
        flexDirection: 'column',
        zIndex: 10,
    },
    desktopLayout: {
        flexDirection: 'row',
        alignItems: 'stretch',
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        marginVertical: 40,
        shadowColor: '#38BDF8',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 50,
        elevation: 10,
        ...(Platform.OS === 'web' && { backdropFilter: 'blur(30px)' }),
    },
    leftPane: {
        flex: 1.2,
        borderRightWidth: 1,
        borderRightColor: 'rgba(255, 255, 255, 0.05)',
        backgroundColor: 'transparent',
    },
    rightPane: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(2, 6, 23, 0.4)',
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
        maxWidth: 440,
    },
    cardTitle: {
        fontFamily: 'System',
        fontWeight: '900',
        fontSize: 32,
        color: '#FFFFFF',
        marginBottom: 8,
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
        paddingVertical: 20,
        borderRadius: 16,
        backgroundColor: '#38BDF8',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#38BDF8',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
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
