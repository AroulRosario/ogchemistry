import { Smartphone } from 'lucide-react';
import React from 'react';

/** Renders a string with KaTeX LaTeX support in a sandboxed iframe */
function KaTeXRenderer({ text, style = {} }) {
    if (!text) return null;
    const hasLatex = /\$[\s\S]+?\$/m.test(text);
    if (!hasLatex) return <span style={{ fontSize: style.fontSize || 13, color: style.color || '#1E293B', fontWeight: style.fontWeight || '600', lineHeight: `${style.lineHeight || 20}px` }}>{text}</span>;

    const safeText = String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const html = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"
  onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false});"></script>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,sans-serif;font-size:${style.fontSize || 13}px;color:${style.color || '#1E293B'};font-weight:${style.fontWeight || '600'};line-height:${(style.lineHeight || 20)}px;background:transparent;word-break:break-word}.katex{font-size:1em}.katex-display{margin:0.3em 0}</style>
</head><body>${safeText}</body></html>`;
    const lines = (text.match(/\n/g) || []).length + 1;
    const h = Math.max(24, lines * ((style.lineHeight || 20)) + 12);
    return (
        <iframe
            srcDoc={html}
            style={{ border: 'none', width: '100%', height: h, overflow: 'hidden', background: 'transparent', display: 'block' }}
            scrolling="no"
            sandbox="allow-scripts"
        />
    );
}

export default function MobilePreview({ type, data, title }) {
    const renderContent = () => {
        if (!data && !title) {
            return (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.3 }}>
                    <Smartphone size={48} />
                    <p style={{ fontSize: '0.8rem', marginTop: '1rem', fontWeight: '600' }}>Live Preview Window</p>
                </div>
            );
        }

        switch (type) {
            case 'text':
            case 'html_sim':
                return (
                    <div style={{ padding: '1.25rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', color: '#1E293B' }}>{title || data?.title}</h2>
                        <KaTeXRenderer text={data?.html || data?.text || 'No content provided...'} style={{ fontSize: 13, color: '#475569', lineHeight: 20 }} />
                    </div>
                );
            case 'quiz': {
                const questions = data?.questions || [];
                return (
                    <div style={{ padding: '1.25rem' }}>
                        <div style={{ padding: '0.5rem 0.75rem', backgroundColor: 'var(--blue-light)', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--blue)' }}>QUIZ UNIT</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--blue)' }}>{questions.length} Items</span>
                        </div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1.5rem' }}>{title || 'Chemistry Checkpoint'}</h2>
                        {questions.slice(0, 1).map((q, i) => (
                            <div key={i} className="card" style={{ padding: '1rem', marginBottom: '1rem' }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <KaTeXRenderer text={q.question} style={{ fontSize: 13, fontWeight: '700', color: '#1E293B', lineHeight: 20 }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {q.options?.map((opt, oi) => (
                                        <div key={oi} style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--gray-200)' }}>
                                            <KaTeXRenderer text={opt} style={{ fontSize: 12, fontWeight: '600', color: '#475569', lineHeight: 18 }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {questions.length > 1 && <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--gray-400)' }}>+ {questions.length - 1} more questions</p>}
                    </div>
                );
            }
            case 'pyq':
                return (
                    <div style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '900' }}>PYQ ARCHIVE</div>
                            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--gray-400)' }}>{data?.exam || 'JEE/NEET'}{data?.year ? ` · ${data.year}` : ''}</span>
                        </div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem' }}>{title || 'Previous Year Question'}</h2>
                        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--blue)', marginBottom: '1rem' }}>
                            <KaTeXRenderer text={data?.question || 'What is the oxidation state of Cr in K₂Cr₂O₇?'} style={{ fontSize: 13, fontWeight: '600', color: '#1E293B', lineHeight: 20 }} />
                        </div>
                        {(data?.options || []).length > 0 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.75rem' }}>
                                {(data.options || []).map((opt, i) => (
                                    <div key={i} style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                                        <KaTeXRenderer text={opt} style={{ fontSize: 12, color: '#475569', fontWeight: '600', lineHeight: 18 }} />
                                    </div>
                                ))}
                            </div>
                        )}
                        {data?.solution && (
                            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px' }}>
                                <div style={{ fontWeight: '800', color: 'var(--blue)', marginBottom: '0.5rem', fontSize: '0.7rem' }}>DETAILED SOLUTION</div>
                                <KaTeXRenderer text={data.solution} style={{ fontSize: 12, color: '#64748B', lineHeight: 18 }} />
                            </div>
                        )}
                    </div>
                );
            case 'video':
            case 'audio':
                return (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ height: '200px', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: 0, height: 0, borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '15px solid white', marginLeft: '5px' }} />
                            </div>
                        </div>
                        <div style={{ padding: '1.5rem', flex: 1 }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem' }}>{title || data?.title}</h2>
                            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', lineHeight: '1.5' }}>{data?.notes || 'No curriculum notes for this resource.'}</p>
                        </div>
                    </div>
                );
            default:
                return <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>Preview not available for this type.</div>;
        }
    };

    return (
        <div style={{
            width: '320px',
            height: '650px',
            backgroundColor: '#000',
            borderRadius: '40px',
            padding: '12px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            position: 'sticky',
            top: '20px',
            border: '4px solid #334155'
        }}>
            <div style={{
                width: '60px',
                height: '4px',
                backgroundColor: '#334155',
                borderRadius: '2px',
                margin: '0 auto 12px'
            }} />

            <div style={{
                width: '100%',
                height: 'calc(100% - 16px)',
                backgroundColor: '#fff',
                borderRadius: '28px',
                overflow: 'hidden',
                position: 'relative'
            }}>
                {/* Status Bar Shim */}
                <div style={{ height: '30px', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', fontWeight: '700' }}>
                    <span>9:41</span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        <span>📶</span>
                        <span>🔋</span>
                    </div>
                </div>

                <div style={{ height: 'calc(100% - 30px)', overflowY: 'auto' }}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
