import { COLORS } from '@/constants/theme';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export function AuthHeroGraphic() {
    return (
        <View style={styles.container}>
            {/* Background pattern layer */}
            <View style={styles.patternOverlay} />

            <View style={styles.content}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.heroImage}
                        resizeMode="contain"
                    />
                    {/* Shadow layer for the image */}
                    <View style={styles.imageShadow} />
                </View>

                <View style={styles.textStack}>
                    <Text style={styles.superTitle}>WELCOME TO</Text>
                    <Text style={styles.mainTitle}>OG CHEMISTRY</Text>

                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>ELITE LEARNING</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.blueLight,
        overflow: 'hidden',
        borderRightWidth: 4,
        borderRightColor: COLORS.black,
        justifyContent: 'center',
        alignItems: 'center',
    },
    patternOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.blue,
        opacity: 0.1,
        // Dot pattern effect using simple CSS on web (if needed, otherwise just a solid block is fine for now, we'll rely on the bold colors)
    },
    content: {
        alignItems: 'center',
        padding: 40,
        maxWidth: 600,
    },
    imageContainer: {
        position: 'relative',
        marginBottom: 40,
    },
    heroImage: {
        width: 240,
        height: 240,
        zIndex: 2,
    },
    imageShadow: {
        position: 'absolute',
        width: 240,
        height: 240,
        backgroundColor: COLORS.black,
        borderRadius: 120, // rough shadow matching a rounded logo
        top: 12,
        left: 12,
        zIndex: 1,
    },
    textStack: {
        alignItems: 'center',
    },
    superTitle: {
        fontFamily: 'System',
        fontSize: 24,
        fontWeight: '900',
        color: COLORS.black,
        letterSpacing: 4,
        marginBottom: -10,
        zIndex: 2,
    },
    mainTitle: {
        fontFamily: 'LuckiestGuy_400Regular',
        fontSize: 72,
        color: COLORS.white,
        textAlign: 'center',
        lineHeight: 80,
        textShadowColor: COLORS.black,
        textShadowOffset: { width: 4, height: 4 },
        textShadowRadius: 0,
        marginBottom: 24,
    },
    badge: {
        backgroundColor: COLORS.yellow,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: COLORS.black,
        transform: [{ rotate: '-5deg' }],
        shadowColor: COLORS.black,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    badgeText: {
        fontFamily: 'Bangers_400Regular',
        fontSize: 24,
        color: COLORS.black,
        letterSpacing: 2,
    }
});
