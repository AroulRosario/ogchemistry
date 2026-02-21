import { COLORS } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export function DynamicBackground({ children }: { children: React.ReactNode }) {
    return (
        <View style={styles.container}>
            {/* Dynamic Accents */}
            <View style={[styles.blob, styles.blob1]} />
            <View style={[styles.blob, styles.blob2]} />

            {/* Main Content */}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.paper,
    },
    content: {
        flex: 1,
    },
    blob: {
        position: 'absolute',
        borderRadius: 1000,
        opacity: 0.15,
    },
    blob1: {
        top: -100,
        right: -100,
        width: 400,
        height: 400,
        backgroundColor: COLORS.blue,
    },
    blob2: {
        bottom: -150,
        left: -150,
        width: 500,
        height: 500,
        backgroundColor: COLORS.yellow,
    },
});
