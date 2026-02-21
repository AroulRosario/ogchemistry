import { STYLES } from '@/constants/theme';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';

export function SimulationView({ content, style }: { content: { html?: string; url?: string; uri?: string }, style?: StyleProp<ViewStyle> }) {
    // If url is local (file://), might need different handling in production.
    // For now assume remote or handled by expo-asset.
    return (
        <View style={[styles.container, style]}>
            <WebView
                source={(content.html ? { html: content.html } : { uri: content.url || content.uri }) as any}
                style={styles.webview}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                originWhitelist={['*']}
                scrollEnabled={false} // Simulations usually fixed layout
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 450, // Fixed height for sims
        ...STYLES.card,
        marginBottom: 20,
    },
    webview: {
        flex: 1,
    },
});
