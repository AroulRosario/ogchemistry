import { LAYOUT } from '@/constants/theme';
import React from 'react';
import { Platform, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';

interface ResponsiveContainerProps {
    children: React.ReactNode;
    style?: ViewStyle;
    scrollable?: boolean;
    fullWidth?: boolean;
}

export function ResponsiveContainer({ children, style, scrollable = true, fullWidth = false }: ResponsiveContainerProps) {
    const Container = scrollable ? ScrollView : View;

    return (
        <View style={styles.outer}>
            <Container
                style={[
                    styles.container,
                    fullWidth ? { maxWidth: '100%' } : styles.maxWidth,
                    style
                ]}
                contentContainerStyle={scrollable ? styles.content : undefined}
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
        alignItems: 'center',
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
        paddingHorizontal: Platform.OS === 'web' ? 40 : 20,
    },
});
