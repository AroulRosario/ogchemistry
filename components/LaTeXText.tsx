import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface LaTeXTextProps {
    text: string;
    fontSize?: number;
    color?: string;
    fontWeight?: string;
    style?: object;
    isMarkdown?: boolean;
}

function hasLatex(str: string): boolean {
    return /\$[\s\S]+?\$/m.test(str);
}

export function LaTeXText({ text, fontSize = 16, color = '#1E293B', fontWeight = '400', style, isMarkdown = true }: LaTeXTextProps) {
    const [height, setHeight] = useState(60);
    const needsLatex = useMemo(() => hasLatex(text || ''), [text]);

    const html = useMemo(() => {
        // Sanitize backticks and backslashes for script injection
        const escapedText = (text || '')
            .replace(/\\/g, '\\\\')
            .replace(/`/g, '\\`')
            .replace(/\${/g, '\\${');

        return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, system-ui, sans-serif;
    font-size: ${fontSize}px;
    color: ${color};
    line-height: 1.6;
    background: transparent;
    padding: 0;
    word-break: break-word;
    overflow: hidden;
  }
  #math_content { padding: 4px; }
  h1, h2, h3 { color: #111827; margin: 1.25em 0 0.5em; font-weight: 800; }
  h1 { font-size: 1.5em; }
  h2 { font-size: 1.25em; }
  h3 { font-size: 1.1em; }
  p { margin-bottom: 0.8em; }
  ul, ol { margin-left: 1.25em; margin-bottom: 0.8em; }
  li { margin-bottom: 0.4em; }
  code { background: #F1F5F9; padding: 2px 4px; borderRadius: 4px; font-size: 0.9em; }
  blockquote { border-left: 4px solid #E2E8F0; padding-left: 1rem; color: #64748B; font-style: italic; }
  hr { border: 0; border-top: 1px solid #E2E8F0; margin: 1.5rem 0; }
  .katex { font-size: 1.1em; }
  .katex-display { margin: 1em 0; overflow-x: auto; padding: 0.5em 0; overflow-y: hidden; }
</style>
</head>
<body>
  <div id="content_wrapper">
    <div id="math_content"></div>
  </div>
  <script>
    function sendHeight() {
       const el = document.getElementById('content_wrapper');
       if (!el) return;
       const h = el.scrollHeight;
       if (h > 0) window.ReactNativeWebView.postMessage(JSON.stringify({ height: h }));
    }

    window.onload = function() {
       const raw = \`${escapedText}\`;
       const contentEl = document.getElementById('math_content');
       
       if (${isMarkdown} && window.marked) {
         contentEl.innerHTML = marked.parse(raw);
       } else {
         contentEl.innerText = raw;
       }

       if (window.renderMathInElement) {
         renderMathInElement(contentEl, {
           delimiters: [
             {left: '$$', right: '$$', display: true},
             {left: '$', right: '$', display: false}
           ],
           throwOnError: false
         });
       }
       
       sendHeight();
       setTimeout(sendHeight, 100);
       setTimeout(sendHeight, 500);
       setTimeout(sendHeight, 1500);
    };
  </script>
</body>
</html>`;
    }, [text, fontSize, color, isMarkdown]);

    if (!needsLatex && !isMarkdown) {
        return <Text style={[{ fontSize, color, fontWeight: fontWeight as any }, style]}>{text}</Text>;
    }

    return (
        <View style={[{ height, overflow: 'hidden' }, style]}>
            <WebView
                source={{ html }}
                style={{ backgroundColor: 'transparent', flex: 1 }}
                scrollEnabled={false}
                onMessage={(event) => {
                    try {
                        const data = JSON.parse(event.nativeEvent.data);
                        if (data.height && Math.abs(data.height - height) > 2) {
                            setHeight(data.height + 20);
                        }
                    } catch (e) {}
                }}
                originWhitelist={['*']}
                javaScriptEnabled
            />
        </View>
    );
}

const styles = StyleSheet.create({});
