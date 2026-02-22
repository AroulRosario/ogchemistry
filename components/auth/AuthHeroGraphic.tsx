import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export function AuthHeroGraphic() {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.heroImage}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.textStack}>
                    <Text style={styles.superTitle}>POWERED BY</Text>
                    <Text style={styles.mainTitle}>OG CHEMISTRY</Text>
                    <View style={styles.divider} />
                    <Text style={styles.subtext}>
                        High-performance curriculum for the next generation of chemists.
                        Professional, precise, and purely elemental.
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        width: '100%',
    },
    logoContainer: {
        marginBottom: 60,
    },
    heroImage: {
        width: 240,
        height: 240,
    },
    textStack: {
        alignItems: 'center',
        maxWidth: 450,
    },
    superTitle: {
        fontFamily: 'System',
        fontSize: 14,
        fontWeight: '700',
        color: '#94A3B8',
        letterSpacing: 4,
        marginBottom: 12,
    },
    mainTitle: {
        fontFamily: 'System',
        fontSize: 48,
        fontWeight: '900',
        color: '#0F172A',
        textAlign: 'center',
        letterSpacing: -1,
    },
    divider: {
        width: 60,
        height: 4,
        backgroundColor: '#2563EB',
        borderRadius: 2,
        marginVertical: 32,
    },
    subtext: {
        fontFamily: 'System',
        fontSize: 18,
        lineHeight: 28,
        color: '#64748B',
        textAlign: 'center',
        fontWeight: '500',
    },
});
