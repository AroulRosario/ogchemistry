import { COLORS } from '@/constants/theme';
import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

type Variant = 'primary' | 'secondary' | 'outline' | 'danger';

type Props = {
    title: string;
    onPress: () => void;
    variant?: Variant;
    disabled?: boolean;
    style?: ViewStyle;
    small?: boolean;
};

export function ModernComicButton({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    style,
    small = false,
}: Props) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.timing(scaleAnim, {
            toValue: 0.98, // Subtle, standard modern interaction scale
            duration: 100,
            useNativeDriver: true
        }).start();
    };

    const handlePressOut = () => {
        Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true
        }).start();
    };

    const getStyles = () => {
        switch (variant) {
            case 'primary':
                return { bg: COLORS.blue, text: '#FFFFFF', shadow: 'rgba(37, 99, 235, 0.4)', border: 'transparent' };
            case 'secondary':
                return { bg: '#F3F4F6', text: '#374151', shadow: 'transparent', border: '#E5E7EB' };
            case 'outline':
                return { bg: 'transparent', text: '#374151', shadow: 'transparent', border: '#D1D5DB' };
            case 'danger':
                return { bg: '#FEF2F2', text: '#DC2626', shadow: 'transparent', border: '#FCA5A5' }; // Soft danger
            default:
                return { bg: COLORS.blue, text: '#FFFFFF', shadow: 'rgba(37, 99, 235, 0.4)', border: 'transparent' };
        }
    };

    const s = getStyles();

    return (
        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onPress}
                disabled={disabled}
                style={({ pressed }) => [
                    styles.button,
                    small && styles.small,
                    {
                        backgroundColor: s.bg,
                        borderColor: s.border,
                        shadowColor: s.shadow,
                    },
                    disabled && styles.disabled,
                ]}
            >
                <Text style={[
                    styles.text,
                    small && styles.smallText,
                    { color: s.text },
                ]}>
                    {title}
                </Text>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 24, // Pill shape
        borderWidth: 1, // Clean, thin border line when defined
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 4,
    },
    small: {
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 16,
    },
    text: {
        fontFamily: 'System',
        fontWeight: '700', // Bold systemic
        fontSize: 16,
        letterSpacing: 0.5,
    },
    smallText: {
        fontSize: 14,
        letterSpacing: 0.5,
    },
    disabled: {
        opacity: 0.5,
    },
});
