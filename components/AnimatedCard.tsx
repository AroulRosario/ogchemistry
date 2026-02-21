import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

interface AnimatedCardProps {
    children: React.ReactNode;
    delay?: number;
    style?: any;
}

export const AnimatedCard = ({ children, delay = 0, style }: AnimatedCardProps) => {
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
                delay,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
                delay,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.container,
                style,
                {
                    transform: [{ scale: scaleAnim }],
                    opacity: opacityAnim,
                },
            ]}
        >
            {children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
});
