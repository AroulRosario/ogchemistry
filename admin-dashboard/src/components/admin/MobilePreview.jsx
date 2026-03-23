import { Smartphone } from 'lucide-react';
import React from 'react';

export default function MobilePreview({ type, data, title }) {
    // Helper to render content based on type
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
            case 'text': // Article
            case 'html_sim': // SIM Module
                return (
                    <div style={{ padding: '1.25rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', color: '#1E293B' }}>{title || data?.title}</h2>
                        <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: '#475569' }}>
                            {data?.html || data?.text || 'No content provided...'}
                        </div>
                    </div>
                );
            case 'quiz':
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
                                <p style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '1rem' }}>{q.question}</p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {q.options?.map((opt, oi) => (
                                        <div key={oi} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--gray-200)', fontSize: '0.8rem', fontWeight: '600' }}>
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        {questions.length > 1 && <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--gray-400)' }}>+ {questions.length - 1} more questions</p>}
                    </div>
                );
            case 'pyq':
                return (
                    <div style={{ padding: '1.25rem' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '900' }}>PYQ ARCHIVE</div>
                            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--gray-400)' }}>JEE MAIN 2023</span>
                        </div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '1rem' }}>{title || 'Previous Year Question'}</h2>
                        <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--blue)' }}>
                            <p style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '1rem', lineHeight: '1.5' }}>
                                {data?.question || 'What is the oxidation state of Cr in K2Cr2O7?'}
                            </p>
                            <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                                <div style={{ fontWeight: '800', color: 'var(--blue)', marginBottom: '0.5rem', fontSize: '0.7rem' }}>DETAILED SOLUTION</div>
                                <p style={{ color: '#64748B', lineHeight: '1.4' }}>{data?.solution || 'According to the rules of oxidation state calculation...'}</p>
                            </div>
                        </div>
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
