import { COLORS } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

interface ComicCalloutProps {
    text: string;
    type?: 'pow' | 'zap' | 'boom' | 'info';
    style?: ViewStyle;
    pointerPosition?: 'top' | 'bottom' | 'left' | 'right';
}

export function ComicCallout({ text, type = 'info', style, pointerPosition = 'bottom' }: ComicCalloutProps) {
    const getBgColor = () => {
        switch (type) {
            case 'pow': return COLORS.pow;
            case 'zap': return COLORS.zap;
            case 'boom': return COLORS.boom;
            default: return COLORS.white;
        }
    };

    const bgColor = getBgColor();
    const isDark = type === 'pow' || type === 'boom';

    return (
        <View style={[styles.container, { backgroundColor: bgColor }, style]}>
            <Text style={[styles.text, isDark && { color: COLORS.white }]}>
                {text.toUpperCase()}
            </Text>
            {/* Simple Pointer */}
            <View style={[styles.pointer, styles[`pointer_${pointerPosition}` as keyof typeof styles], { borderBottomColor: bgColor }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 4,
        borderColor: COLORS.black,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
    },
    text: {
        fontFamily: 'Bangers_400Regular',
        fontSize: 18,
        letterSpacing: 1,
        color: COLORS.black,
    },
    pointer: {
        position: 'absolute',
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 12,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
    } as any,
    pointer_bottom: {
        bottom: -15,
        alignSelf: 'center',
        transform: [{ rotate: '180deg' }],
    },
    pointer_top: {
        top: -15,
        alignSelf: 'center',
    },
    pointer_left: {
        left: -15,
        top: '50%',
        marginTop: -6,
        transform: [{ rotate: '-90deg' }],
    },
    pointer_right: {
        right: -15,
        top: '50%',
        marginTop: -6,
        transform: [{ rotate: '90deg' }],
    },
});
