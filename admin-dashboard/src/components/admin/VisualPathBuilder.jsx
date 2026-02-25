import { Edit3, Folder, Layers } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../supabase';

export default function VisualPathBuilder({ lessons, chapters, showNotification, fetchAll }) {
    const [editingNode, setEditingNode] = useState(null); // { id, title, type }
    const [loading, setLoading] = useState(false);

    const handleSaveTitle = async () => {
        setLoading(true);
        try {
            const table = editingNode.type === 'lesson' ? 'lessons' : 'chapters';
            await supabase.from(table).update({ title: editingNode.title }).eq('id', editingNode.id);
            showNotification('Title updated successfully!');
            setEditingNode(null);
            if (fetchAll) await fetchAll();
        } catch (e) {
            showNotification('Failed to update title', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in" style={{ height: 'calc(100vh - 160px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Visual Path Editor</h2>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Direct edit access for the linear student journey.</p>
                </div>
            </div>

            <div className="card" style={{ flex: 1, padding: '2rem', overflowY: 'auto', background: 'var(--bg-app)', border: 'none', boxShadow: 'none' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '4rem' }}>
                    {lessons.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.5 }}>
                            <Folder size={48} style={{ marginBottom: '1rem', color: 'var(--gray-400)' }} />
                            <p style={{ fontWeight: 600 }}>No curriculum path created yet.</p>
                        </div>
                    )}

                    {lessons.sort((a, b) => a.order - b.order).map((lesson, lIndex) => {
                        const lessonChapters = chapters.filter(c => c.lesson_id === lesson.id).sort((a, b) => a.order - b.order);
                        return (
                            <div key={lesson.id} style={{ marginBottom: '2rem', position: 'relative' }}>
                                {/* Track Line connecting down to the next lesson if not the last one */}
                                {lIndex < lessons.length - 1 && (
                                    <div style={{ position: 'absolute', top: 48, bottom: -64, left: 23, width: 2, backgroundColor: '#E2E8F0', zIndex: 1 }} />
                                )}

                                {/* Lesson Structure Node */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
                                    <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)' }}>
                                        <Folder size={20} color="white" />
                                    </div>

                                    <div className="card" style={{ flex: 1, padding: '1.5rem', marginBottom: '1.5rem', borderColor: 'var(--blue)', borderWidth: 2, boxShadow: '0 4px 15px rgba(37, 99, 235, 0.05)' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--blue)', letterSpacing: 1, marginBottom: 6 }}>UNIVERSE {lIndex + 1}</div>
                                        {editingNode?.id === lesson.id ? (
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                                <input className="input" autoFocus value={editingNode.title} onChange={e => setEditingNode({ ...editingNode, title: e.target.value })} style={{ fontWeight: '700', fontSize: '1.1rem' }} />
                                                <button className="btn btn-primary" onClick={handleSaveTitle} disabled={loading}>Save</button>
                                                <button className="btn btn-secondary" onClick={() => setEditingNode(null)}>Cancel</button>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#1E293B', letterSpacing: '-0.02em' }}>{lesson.title}</h3>
                                                <button className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', background: '#F8FAFC' }} onClick={() => setEditingNode({ id: lesson.id, title: lesson.title, type: 'lesson' })}>
                                                    <Edit3 size={14} /> Rename
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Track line for Chapters within the Lesson */}
                                {lessonChapters.length > 0 && (
                                    <div style={{ position: 'absolute', top: 48, bottom: 0, left: 23, width: 2, backgroundColor: '#E2E8F0', zIndex: 1 }} />
                                )}

                                {/* Chapter Nodes */}
                                {lessonChapters.map((chapter, cIndex) => (
                                    <div key={chapter.id} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: '0.5rem', marginBottom: '1rem', position: 'relative', zIndex: 2 }}>
                                        <div style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'var(--white)', border: '2px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Layers size={14} color="var(--gray-500)" />
                                        </div>
                                        <div className="card" style={{ flex: 1, padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #E2E8F0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                            {editingNode?.id === chapter.id ? (
                                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '100%' }}>
                                                    <input className="input" autoFocus style={{ padding: '0.5rem', fontWeight: '600' }} value={editingNode.title} onChange={e => setEditingNode({ ...editingNode, title: e.target.value })} />
                                                    <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={handleSaveTitle} disabled={loading}>Save</button>
                                                    <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }} onClick={() => setEditingNode(null)}>Cancel</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--gray-400)', letterSpacing: 1 }}>MOD {cIndex + 1}</span>
                                                        <span style={{ fontSize: '1rem', fontWeight: '700', color: '#334155' }}>{chapter.title}</span>
                                                    </div>
                                                    <button onClick={() => setEditingNode({ id: chapter.id, title: chapter.title, type: 'chapter' })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: '0.5rem' }}>
                                                        <Edit3 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
