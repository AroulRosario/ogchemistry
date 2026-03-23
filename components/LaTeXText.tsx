import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface LaTeXTextProps {
    text: string;
    fontSize?: number;
    color?: string;
    fontWeight?: string;
    style?: object;
}

/**
 * LaTeXText — renders a string that may contain inline LaTeX ($...$) or block LaTeX ($$...$$).
 * Falls back to plain <Text> for strings with no LaTeX markers, so it's zero-cost for normal text.
 */
function hasLatex(str: string): boolean {
    return /\$[\s\S]+?\$/m.test(str);
}

function buildKaTeXHtml(text: string, fontSize: number, color: string): string {
    // Escape backticks and backslashes for safe template literal injection
    const safeText = text.replace(/\\/g, '\\\\').replace(/`/g, '\\`');

    return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"
  onload="renderMathInElement(document.body, {
    delimiters: [
      {left: '$$', right: '$$', display: true},
      {left: '$', right: '$', display: false}
    ],
    throwOnError: false,
    output: 'html'
  });">
</script>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
    font-size: ${fontSize}px;
    color: ${color};
    line-height: 1.55;
    background: transparent;
    padding: 0;
    word-break: break-word;
  }
  .katex { font-size: 1em; }
  .katex-display { margin: 0.4em 0; overflow-x: auto; }
</style>
</head>
<body id="content">\${content}</body>
</html>`;
}

export function LaTeXText({ text, fontSize = 16, color = '#1E293B', fontWeight = '400', style }: LaTeXTextProps) {
    const needsLatex = useMemo(() => hasLatex(text || ''), [text]);

    if (!needsLatex) {
        return <Text style={[{ fontSize, color, fontWeight: fontWeight as any }, style]}>{text}</Text>;
    }

    // Estimate height: ~1.8× line height per newline, minimum 60px
    const lines = (text.match(/\n/g) || []).length + 1;
    const estimatedHeight = Math.max(60, lines * fontSize * 1.8 + 20);

    const html = useMemo(() => {
        const safeText = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            // Restore LaTeX delimiters after escaping
            .replace(/\\\$\\\$/g, '$$$$')
            .replace(/\\\$/g, '$');

        const template = buildKaTeXHtml(text, fontSize, color);
        // Inject the actual content
        return template.replace('${content}', () => {
            const escaped = text
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            return escaped;
        });
    }, [text, fontSize, color]);

    return (
        <View style={[{ height: estimatedHeight }, style]}>
            <WebView
                source={{ html }}
                style={{ backgroundColor: 'transparent', flex: 1 }}
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                originWhitelist={['*']}
                javaScriptEnabled
            />
        </View>
    );
}
