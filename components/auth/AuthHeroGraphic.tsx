import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export function AuthHeroGraphic() {
    return (
        <View style={styles.container}>
            {/* Background pattern layer */}
            <View style={styles.darkBackground} />

            {/* Glowing Orbs */}
            <View style={[styles.glowOrb, { top: '10%', left: '10%', backgroundColor: '#38BDF8' }]} />
            <View style={[styles.glowOrb, { bottom: '20%', right: '10%', backgroundColor: '#FBBF24', width: 250, height: 250 }]} />
            <View style={[styles.glowOrb, { top: '40%', right: '30%', backgroundColor: '#34D399', width: 150, height: 150, opacity: 0.1 }]} />

            <View style={styles.content}>
                <View style={styles.glassCard}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../../assets/images/logo.png')}
                            style={styles.heroImage}
                            resizeMode="contain"
                        />
                    </View>

                    <View style={styles.textStack}>
                        <Text style={styles.superTitle}>WELCOME TO</Text>
                        <Text style={styles.mainTitle}>OG CHEMISTRY</Text>

                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>ELITE LEARNING PLATFORM</Text>
                        </View>

                        <Text style={styles.subtext}>Master the elemental forces of the universe.</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    darkBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#020617',
        opacity: 0.8,
    },
    glowOrb: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        opacity: 0.15,
        filter: 'blur(80px)', // Web support
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        width: '100%',
        zIndex: 10,
    },
    glassCard: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        borderRadius: 32,
        borderWidth: 1,
        borderColor: 'rgba(56, 189, 248, 0.2)',
        width: '100%',
        maxWidth: 500,
        shadowColor: '#38BDF8',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.2,
        shadowRadius: 50,
        elevation: 10,
        backdropFilter: 'blur(20px)', // Web support
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 40,
        shadowColor: '#38BDF8',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 30,
        elevation: 15,
    },
    heroImage: {
        width: 200,
        height: 200,
        zIndex: 2,
    },
    textStack: {
        alignItems: 'center',
    },
    superTitle: {
        fontFamily: 'System',
        fontSize: 16,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 6,
        marginBottom: 8,
    },
    mainTitle: {
        fontFamily: 'System',
        fontSize: 48,
        fontWeight: '900',
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 2,
        textShadowColor: 'rgba(56, 189, 248, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
        marginBottom: 24,
    },
    badge: {
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        paddingHorizontal: 24,
        paddingVertical: 8,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(56, 189, 248, 0.4)',
        marginBottom: 24,
    },
    badgeText: {
        fontFamily: 'System',
        fontWeight: '800',
        fontSize: 12,
        color: '#38BDF8',
        letterSpacing: 3,
    },
    subtext: {
        fontFamily: 'System',
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 24,
        fontWeight: '500',
    }
});
