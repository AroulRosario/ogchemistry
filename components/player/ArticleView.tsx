import { COLORS } from '@/constants/theme';
import React from 'react';
import { Platform, StyleSheet, Text, View, ScrollView } from 'react-native';
import { LaTeXText } from '@/components/LaTeXText';

interface ArticleViewProps {
    content: {
        text?: string;
        title?: string;
    };
}

/**
 * ArticleView — renders AI-generated notes with full Markdown & KaTeX support.
 */
export function ArticleView({ content }: ArticleViewProps) {
    const text = content?.text || '';

    if (!text.trim()) {
        return (
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No article content available.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <LaTeXText 
                text={text} 
                isMarkdown={true}
                fontSize={15}
                color="#334155"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 2, // Minimal padding as LaTeXText has internal padding
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        minHeight: 200,
    },
    emptyState: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        color: '#94A3B8',
        fontWeight: '600',
        fontSize: 15,
    },
});
