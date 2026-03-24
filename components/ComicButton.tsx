import { COLORS, STYLES } from '@/constants/theme';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';

interface ComicButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'yellow';
}

export function ComicButton({ title, variant = 'primary', style, ...props }: ComicButtonProps) {
    const getBackgroundColor = () => {
        switch (variant) {
            case 'primary': return COLORS.blue;
            case 'yellow': return COLORS.yellow;
            default: return COLORS.white;
        }
    };

    const getTextColor = () => {
        switch (variant) {
            case 'primary': return COLORS.white;
            default: return COLORS.black;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor() },
                style as ViewStyle
            ]}
            activeOpacity={0.8}
            {...props}
        >
            <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        ...STYLES.card,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
    text: {
        fontFamily: 'System',
        fontWeight: '900',
        fontSize: 18,
        textTransform: 'uppercase',
        letterSpacing: -0.5,
    }
});
