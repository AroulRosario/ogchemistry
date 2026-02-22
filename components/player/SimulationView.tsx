import { STYLES } from '@/constants/theme';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { WebView } from 'react-native-webview';

import { Platform } from 'react-native';

export function SimulationView({ content, style }: { content: { html?: string; url?: string; uri?: string }, style?: StyleProp<ViewStyle> }) {
    // If url is local (file://), might need different handling in production.
    // For now assume remote or handled by expo-asset.

    if (Platform.OS === 'web') {
        return (
            <View style={[styles.container, style]}>
                {content.html ? (
                    <div dangerouslySetInnerHTML={{ __html: content.html }} style={{ width: '100%', height: '100%' }} />
                ) : (
                    <iframe
                        src={content.url || content.uri}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        title="Simulation"
                    />
                )}
            </View>
        );
    }

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
