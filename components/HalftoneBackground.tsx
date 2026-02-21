import { COLORS } from '@/constants/theme';
import { ImageBackground, ImageSourcePropType, StyleSheet, ViewProps } from 'react-native';

export function HalftoneBackground({ style, children, ...props }: ViewProps) {
    // Using require directly inside render to ensure it refreshes or loads correctly
    const imageSource: ImageSourcePropType = require('@/assets/images/halftone.png');

    return (
        <ImageBackground
            source={imageSource}
            style={[styles.background, style]}
            resizeMode="repeat"
            imageStyle={{ opacity: 0.05 }}
            {...props}
        >
            {children}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: COLORS.paper,
    }
});
