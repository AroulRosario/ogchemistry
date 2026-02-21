import { STYLES } from '@/constants/theme';
import { StyleSheet, View, ViewProps } from 'react-native';

export function ComicCard({ style, children, ...props }: ViewProps) {
    return (
        <View style={[styles.card, style]} {...props}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        ...STYLES.card,
        padding: 16,
        marginBottom: 16,
    },
});
