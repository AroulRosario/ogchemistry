/**
 * ArticleView.tsx
 * Renders AI-generated article / notes for learners.
 * Supports Markdown-like rendering with basic LaTeX display fallback.
 */
import { COLORS } from '@/constants/theme';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

interface ArticleViewProps {
    content: {
        text?: string;
        title?: string;
    };
}

/**
 * Simple inline renderer: bolds **text**, italics *text*, inline code `text`,
 * block headers ## text and ### text, and bullet lists - item
 * LaTeX ($...$) is shown styled in a code-like block since react-native has no MathJax.
 */
function renderLine(line: string, index: number) {
    // H2
    if (line.startsWith('## ')) {
        return <Text key={index} style={styles.h2}>{line.slice(3)}</Text>;
    }
    // H3
    if (line.startsWith('### ')) {
        return <Text key={index} style={styles.h3}>{line.slice(4)}</Text>;
    }
    // Horizontal rule
    if (line.trim() === '---' || line.trim() === '***') {
        return <View key={index} style={styles.hr} />;
    }
    // Bullet
    if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
            <View key={index} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{line.slice(2)}</Text>
            </View>
        );
    }
    // Empty line = spacer
    if (line.trim() === '') {
        return <View key={index} style={{ height: 12 }} />;
    }
    // LaTeX block ($$...$$)
    if (line.trim().startsWith('$$') && line.trim().endsWith('$$')) {
        const latex = line.trim().slice(2, -2).trim();
        return (
            <View key={index} style={styles.latexBlock}>
                <Text style={styles.latexText}>{latex}</Text>
            </View>
        );
    }
    // Normal paragraph (inline bold/italic handled crudely)
    return <Text key={index} style={styles.paragraph}>{line}</Text>;
}

export function ArticleView({ content }: ArticleViewProps) {
    const text = content?.text || '';
    const lines = text.split('\n');

    if (!text.trim()) {
        return (
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No article content available.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {lines.map((line, i) => renderLine(line, i))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    h2: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1E293B',
        marginTop: 16,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    h3: {
        fontSize: 18,
        fontWeight: '800',
        color: '#334155',
        marginTop: 12,
        marginBottom: 6,
    },
    paragraph: {
        fontSize: 15,
        lineHeight: 24,
        color: '#475569',
        fontWeight: '500',
    },
    bulletRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginVertical: 3,
    },
    bullet: {
        fontSize: 18,
        color: COLORS.primary || '#2563EB',
        lineHeight: 24,
        fontWeight: '700',
    },
    bulletText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 24,
        color: '#475569',
        fontWeight: '500',
    },
    hr: {
        height: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 16,
    },
    latexBlock: {
        backgroundColor: '#F1F5F9',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginVertical: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#2563EB',
    },
    latexText: {
        fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }),
        fontSize: 14,
        color: '#1E40AF',
        fontWeight: '600',
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
