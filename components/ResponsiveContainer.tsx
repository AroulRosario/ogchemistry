import { LAYOUT } from '@/constants/theme';
import React from 'react';
import { Platform, ScrollView, StyleSheet, useWindowDimensions, View, ViewStyle } from 'react-native';

interface ResponsiveContainerProps {
    children: React.ReactNode;
    style?: ViewStyle;
    contentContainerStyle?: ViewStyle;
    scrollable?: boolean;
    fullWidth?: boolean;
}

export function ResponsiveContainer({
    children,
    style,
    contentContainerStyle,
    scrollable = true,
    fullWidth = false
}: ResponsiveContainerProps) {
    const { width } = useWindowDimensions();
    const isDesktop = width >= 800; // Typical tablet/desktop breakpoint

    const Container = scrollable ? ScrollView : View;

    // Determine padding based on context and screen size using theme constants
    const horizontalPad = Platform.OS === 'web' ? (isDesktop ? LAYOUT.desktopPadding : LAYOUT.mobilePadding) : LAYOUT.mobilePadding;

    return (
        <View style={styles.outer}>
            <Container
                style={[
                    styles.container,
                    fullWidth ? { maxWidth: '100%' } : styles.maxWidth,
                    style
                ]}
                contentContainerStyle={scrollable ? [styles.content, { paddingHorizontal: horizontalPad }, contentContainerStyle] : [styles.content, { paddingHorizontal: horizontalPad }, contentContainerStyle]}
                showsVerticalScrollIndicator={false}
            >
                {children}
            </Container>
        </View>
    );
}

const styles = StyleSheet.create({
    outer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    container: {
        width: '100%',
    },
    maxWidth: {
        maxWidth: Platform.OS === 'web' ? LAYOUT.maxWidth : undefined,
    },
    content: {
        flexGrow: 1,
        paddingBottom: 40,
    },
});
