import { COLORS } from '@/constants/theme';
import React from 'react';
import {
    Animated,
    Pressable,
    StyleProp,
    StyleSheet,
    Text,
    View,
    ViewStyle,
} from 'react-native';

interface DuoButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    style?: StyleProp<ViewStyle>;
    disabled?: boolean;
    icon?: React.ReactNode;
}

export function DuoButton({
    title,
    onPress,
    variant = 'primary',
    style,
    disabled = false,
    icon,
}: DuoButtonProps) {
    const animatedValue = React.useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        Animated.spring(animatedValue, {
            toValue: 1,
            useNativeDriver: true,
            tension: 100,
            friction: 5,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(animatedValue, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 5,
        }).start();
    };

    const translateY = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 4],
    });

    const getColors = () => {
        switch (variant) {
            case 'primary':
                return { bg: COLORS.blue, border: COLORS.blueDark, text: '#FFFFFF', shadow: 'rgba(37, 99, 235, 0.4)' }; // Primary is now Brand Blue
            case 'secondary':
                return { bg: '#F3F4F6', border: '#E5E7EB', text: '#374151', shadow: 'rgba(0, 0, 0, 0.05)' }; // Clean Gray
            case 'danger':
                return { bg: COLORS.red, border: '#EF4444', text: '#FFFFFF', shadow: 'rgba(239, 68, 68, 0.4)' };
            case 'ghost':
                return { bg: 'transparent', border: 'transparent', text: '#6B7280', shadow: 'transparent' };
            default:
                return { bg: COLORS.blue, border: COLORS.blueDark, text: '#FFFFFF', shadow: 'rgba(37, 99, 235, 0.4)' };
        }
    };

    const colors = getColors();

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
            style={[styles.container, style, { opacity: disabled ? 0.6 : 1 }]}
        >
            <Animated.View
                style={[
                    styles.content,
                    {
                        backgroundColor: colors.bg,
                        borderColor: colors.border,
                        shadowColor: colors.shadow,
                        transform: [{ translateY }],
                    },
                    variant !== 'ghost' && styles.elevated,
                ]}
            >
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <Text style={[styles.text, { color: colors.text }]}>
                    {variant === 'ghost' ? title : title.toUpperCase()}
                </Text>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 52,
        minWidth: 120,
        marginVertical: 8,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 26, // Perfect pill shape
        paddingHorizontal: 24,
        borderWidth: 1, // Subtle border
    },
    elevated: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 6,
    },
    iconContainer: {
        marginRight: 8,
    },
    text: {
        fontFamily: 'System',
        fontWeight: '800', // Bold systemic font
        fontSize: 15,
        letterSpacing: 0.5,
        textAlign: 'center',
    },
});
