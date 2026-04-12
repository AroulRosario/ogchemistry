import { ArrowDown, ArrowUp, Edit3, Folder, Layers, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../supabase';

export default function VisualPathBuilder({ lessons, chapters, showNotification, fetchAll }) {
    const [editingNode, setEditingNode] = useState(null); // { id, title, type }
    const [loading, setLoading] = useState(false);

    const handleAssignContent = async (newTitle) => {
        setLoading(true);
        try {
            const table = editingNode.type === 'lesson' ? 'lessons' : 'chapters';
            const items = editingNode.type === 'lesson' ? lessons : chapters;
            
            // Find the target item in the library
            const target = items.find(i => i.title === newTitle);
            if (!target) {
                showNotification('Item not found in library', 'error');
                return;
            }

            // SWAP ORDERS to map this node to the new content
            const currentItem = items.find(i => i.id === editingNode.id);
            
            await Promise.all([
                supabase.from(table).update({ order: target.order }).eq('id', currentItem.id),
                supabase.from(table).update({ order: currentItem.order }).eq('id', target.id)
            ]);
            
            showNotification('Content mapped successfully!');
            setEditingNode(null);
            if (fetchAll) await fetchAll();
        } catch (e) {
            showNotification('Mapping failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleMove = async (type, id, direction, currentOrder, items) => {
        const table = type === 'lesson' ? 'lessons' : 'chapters';
        const sorted = [...items].sort((a, b) => a.order - b.order);
        const index = sorted.findIndex(i => i.id === id);
        const swapIndex = direction === 'up' ? index - 1 : index + 1;

        if (swapIndex < 0 || swapIndex >= sorted.length) return;

        const target = sorted[swapIndex];
        setLoading(true);
        try {
            await Promise.all([
                supabase.from(table).update({ order: target.order }).eq('id', id),
                supabase.from(table).update({ order: currentOrder }).eq('id', target.id)
            ]);
            if (fetchAll) await fetchAll();
        } catch (e) {
            showNotification('Rearrange failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (type, lessonId = null) => {
        setLoading(true);
        try {
            if (type === 'lesson') {
                const nextOrder = lessons.length > 0 ? Math.max(...lessons.map(l => l.order)) + 10 : 10;
                const { data } = await supabase.from('lessons').insert({ title: 'New Universe', order: nextOrder }).select().single();
                setEditingNode({ id: data.id, title: data.title, type: 'lesson' });
            } else {
                const lessonChapters = chapters.filter(c => c.lesson_id === lessonId);
                const nextOrder = lessonChapters.length > 0 ? Math.max(...lessonChapters.map(c => c.order)) + 10 : 10;
                const { data } = await supabase.from('chapters').insert({ lesson_id: lessonId, title: 'New Module', order: nextOrder, content_type: 'video' }).select().single();
                setEditingNode({ id: data.id, title: data.title, type: 'chapter' });
            }
            if (fetchAll) await fetchAll();
        } catch (e) {
            showNotification('Addition failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (type, id) => {
        if (!confirm('Are you sure you want to remove this from the path?')) return;
        setLoading(true);
        try {
            const table = type === 'lesson' ? 'lessons' : 'chapters';
            await supabase.from(table).delete().eq('id', id);
            showNotification('Removed successfuly');
            if (fetchAll) await fetchAll();
        } catch (e) {
            showNotification('Delete failed', 'error');
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
                                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '100%' }}>
                                                <select 
                                                    className="input" 
                                                    value={editingNode.title} 
                                                    onChange={e => handleAssignContent(e.target.value)}
                                                    style={{ fontWeight: '700', fontSize: '1.1rem', flex: 1 }}
                                                >
                                                    <option value="">Pick from Library...</option>
                                                    {lessons.map(l => (
                                                        <option key={l.id} value={l.title}>{l.title}</option>
                                                    ))}
                                                </select>
                                                <button className="btn btn-secondary" onClick={() => setEditingNode(null)}>Cancel</button>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: '#1E293B', letterSpacing: '-0.02em' }}>{lesson.title}</h3>
                                                </div>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => handleMove('lesson', lesson.id, 'up', lesson.order, lessons)} disabled={lIndex === 0 || loading}>
                                                        <ArrowUp size={14} />
                                                    </button>
                                                    <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => handleMove('lesson', lesson.id, 'down', lesson.order, lessons)} disabled={lIndex === lessons.length - 1 || loading}>
                                                        <ArrowDown size={14} />
                                                    </button>
                                                    <button className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', background: '#F8FAFC' }} onClick={() => setEditingNode({ id: lesson.id, title: lesson.title, type: 'lesson' })}>
                                                        <Layers size={14} /> Assign Course
                                                    </button>
                                                    <button className="btn btn-secondary" style={{ padding: '0.4rem', color: 'var(--red)' }} onClick={() => handleDelete('lesson', lesson.id)} disabled={loading}>
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
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
                                                    <select 
                                                        className="input" 
                                                        value={editingNode.title} 
                                                        onChange={e => handleAssignContent(e.target.value)}
                                                        style={{ padding: '0.5rem', fontWeight: '600', flex: 1 }}
                                                    >
                                                        <option value="">Map from Library...</option>
                                                        {chapters.map(c => (
                                                            <option key={c.id} value={c.title}>{c.title}</option>
                                                        ))}
                                                    </select>
                                                    <button className="btn btn-secondary" onClick={() => setEditingNode(null)}>Cancel</button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--gray-400)', letterSpacing: 1 }}>MOD {cIndex + 1}</span>
                                                        <span style={{ fontSize: '1rem', fontWeight: '700', color: '#334155' }}>{chapter.title}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                                        <button onClick={() => handleMove('chapter', chapter.id, 'up', chapter.order, lessonChapters)} disabled={cIndex === 0 || loading} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}>
                                                            <ArrowUp size={14} />
                                                        </button>
                                                        <button onClick={() => handleMove('chapter', chapter.id, 'down', chapter.order, lessonChapters)} disabled={cIndex === lessonChapters.length - 1 || loading} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}>
                                                            <ArrowDown size={14} />
                                                        </button>
                                                        <button onClick={() => setEditingNode({ id: chapter.id, title: chapter.title, type: 'chapter' })} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--blue)', padding: '0.5rem' }}>
                                                            <Layers size={16} title="Map Module" />
                                                        </button>
                                                        <button onClick={() => handleDelete('chapter', chapter.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)', padding: '0.5rem' }}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Add Module Button */}
                                <div style={{ marginLeft: '4.5rem', marginBottom: '2rem' }}>
                                    <button 
                                        className="btn btn-secondary" 
                                        style={{ borderStyle: 'dashed', background: 'transparent', gap: '0.5rem', padding: '0.75rem 1.5rem', opacity: 0.7 }}
                                        onClick={() => handleAdd('chapter', lesson.id)}
                                        disabled={loading}
                                    >
                                        <Plus size={16} /> Add Module to Universe {lIndex + 1}
                                    </button>
                                </div>
                            </div>
                        )
                    })}

                    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '1rem' }}>
                        <button 
                            className="btn btn-primary" 
                            style={{ gap: '0.75rem', padding: '1rem 2rem', fontSize: '1rem', borderRadius: '12px', boxShadow: '0 8px 20px rgba(37, 99, 235, 0.2)' }}
                            onClick={() => handleAdd('lesson')}
                            disabled={loading}
                        >
                            <Plus size={20} /> Add New Universe to Path
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
