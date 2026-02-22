import { AlignLeft, CheckSquare, Edit3, File as FileIcon, Folder, Globe, Layers, PlayCircle, Plus, RefreshCw, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../supabase';

export default function CourseBuilder({ lessons, chapters, contentItems, fetchAll, showNotification }) {
    const [expandedLessons, setExpandedLessons] = useState({});
    const [expandedChapters, setExpandedChapters] = useState({});
    const [selectedItem, setSelectedItem] = useState(null); // { type, data }
    const [loading, setLoading] = useState(false);

    // Form states
    const [formState, setFormState] = useState({
        title: '',
        description: '',
        content_type: 'video',
        url: '',
        content: '', // Markdown or HTML
        passing_score: 80,
        notes: '',
        flashcards: '',
        resources: '',
    });

    const [addingTo, setAddingTo] = useState(null); // { type, parentId }
    const [newName, setNewName] = useState('');

    const handleSelect = (type, data) => {
        setSelectedItem({ type, data });
        setFormState({
            title: data.title || (data.data && data.data.title) || '',
            description: data.description || '',
            content_type: data.type || 'video',
            url: data.data?.url || '',
            content: data.data?.html || data.data?.text || '',
            passing_score: data.data?.passing_score || 80,
            notes: data.data?.notes || '',
            flashcards: JSON.stringify(data.data?.flashcards || [], null, 2),
            resources: JSON.stringify(data.data?.resources || [], null, 2)
        });
    };

    const toggleLesson = (id) => setExpandedLessons(prev => ({ ...prev, [id]: !prev[id] }));
    const toggleChapter = (id) => setExpandedChapters(prev => ({ ...prev, [id]: !prev[id] }));

    const confirmCreate = async () => {
        if (!newName.trim() || !addingTo) return;
        const { type, parentId } = addingTo;

        setLoading(true);
        try {
            if (type === 'lesson') {
                await supabase.from('lessons').insert({ title: newName, order: lessons.length });
            } else if (type === 'chapter') {
                const count = chapters.filter(c => c.lesson_id === parentId).length;
                await supabase.from('chapters').insert({ lesson_id: parentId, title: newName, order: count });
            } else if (type === 'content') {
                const count = contentItems.filter(c => c.chapter_id === parentId).length;
                await supabase.from('content_items').insert({
                    chapter_id: parentId,
                    type: 'video',
                    data: { title: newName },
                    order: count
                });
            }
            showNotification(`${type} created!`);
            setAddingTo(null);
            setNewName('');
            await fetchAll();
        } catch (error) {
            showNotification(`Failed to create ${type}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (table, id) => {
        if (!window.confirm(`Delete this item?`)) return;
        try {
            await supabase.from(table).delete().eq('id', id);
            setSelectedItem(null);
            await fetchAll();
            showNotification('Deleted successfully');
        } catch (error) {
            showNotification('Failed to delete', 'error');
        }
    };

    const handleSaveEditor = async () => {
        if (!selectedItem) return;
        setLoading(true);
        try {
            if (selectedItem.type === 'lesson') {
                await supabase.from('lessons').update({
                    title: formState.title,
                    description: formState.description
                }).eq('id', selectedItem.data.id);
            } else if (selectedItem.type === 'chapter') {
                await supabase.from('chapters').update({
                    title: formState.title
                }).eq('id', selectedItem.data.id);
            } else if (selectedItem.type === 'content') {
                const dataToSave = { title: formState.title };
                if (formState.content_type === 'video' || formState.content_type === 'audio') {
                    dataToSave.url = formState.url;
                    dataToSave.notes = formState.notes;
                    try { dataToSave.flashcards = JSON.parse(formState.flashcards); } catch (e) { dataToSave.flashcards = []; }
                    try { dataToSave.resources = JSON.parse(formState.resources); } catch (e) { dataToSave.resources = []; }
                } else if (formState.content_type === 'html_sim') {
                    dataToSave.html = formState.content;
                } else if (formState.content_type === 'quiz') {
                    try {
                        dataToSave.questions = JSON.parse(formState.content);
                        dataToSave.passing_score = formState.passing_score;
                    } catch (e) {
                        dataToSave.rawTxt = formState.content;
                    }
                } else if (formState.content_type === 'assignment') {
                    dataToSave.passing_score = formState.passing_score;
                    dataToSave.description = formState.content;
                } else if (formState.content_type === 'text') {
                    dataToSave.text = formState.content;
                }

                await supabase.from('content_items').update({
                    type: formState.content_type,
                    data: dataToSave
                }).eq('id', selectedItem.data.id);
            }
            showNotification('Saved updates');
            await fetchAll();
        } catch (error) {
            showNotification('Save failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const TYPE_ICONS = {
        video: <PlayCircle size={16} color="#3B82F6" />,
        quiz: <CheckSquare size={16} color="#10B981" />,
        html_sim: <Globe size={16} color="#8B5CF6" />,
        assignment: <Edit3 size={16} color="#F59E0B" />,
        text: <AlignLeft size={16} color="#64748B" />
    };

    return (
        <div className="fade-in" style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 150px)', position: 'relative' }}>

            {/* Quick Add Modal */}
            {addingTo && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
                    <div className="card" style={{ padding: '2.5rem', width: '450px', backgroundColor: 'var(--white)', border: '1px solid var(--border)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                        <h3 className="bangers" style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--black)' }}>ADD NEW {addingTo.type.toUpperCase()}</h3>
                        <div className="form-group">
                            <label style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 800 }}>IDENTIFIER TITLE</label>
                            <input autoFocus className="input" style={{ width: '100%' }} value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && confirmCreate()} placeholder={`Enter ${addingTo.type} name...`} />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button className="btn" style={{ flex: 1, backgroundColor: 'var(--surface)', color: 'var(--black)', border: '1px solid var(--border)' }} onClick={() => setAddingTo(null)}>CANCEL</button>
                            <button className="btn btn-primary" style={{ flex: 2 }} onClick={confirmCreate} disabled={loading || !newName.trim()}>CREATE MISSION ITEM</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hierarchy Tree Panel */}
            <div style={{ flex: 1, minWidth: '380px', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 className="bangers" style={{ fontSize: '2rem', margin: 0, color: 'var(--comic-navy)' }}>MODULES</h2>
                    <button className="comic-btn comic-btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '1rem', border: 'none' }} onClick={() => setAddingTo({ type: 'lesson' })}>
                        <Plus size={16} /> MODULE
                    </button>
                </div>

                <div className="view-card" style={{ flex: 1, padding: '1.5rem 0', overflowY: 'auto', background: 'var(--white)', border: '1px solid var(--border)', boxShadow: 'none', borderRadius: '1.5rem' }}>
                    {lessons.length === 0 && <p className="empty-state">No modules built yet.</p>}

                    {lessons.map(lesson => (
                        <div key={lesson.id} style={{ marginBottom: '0.25rem', padding: '0 1.5rem' }}>
                            <div
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: selectedItem?.data?.id === lesson.id ? 'var(--blue-light)' : 'transparent', borderRadius: '1rem', border: `1px solid ${selectedItem?.data?.id === lesson.id ? 'var(--blue)' : 'transparent'}`, cursor: 'pointer', fontWeight: 700, color: 'var(--black)', transition: 'all 0.2s ease' }}
                                onClick={() => handleSelect('lesson', lesson)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }} onClick={(e) => { e.stopPropagation(); toggleLesson(lesson.id); }}>
                                    <Folder size={18} color={selectedItem?.data?.id === lesson.id ? 'var(--blue)' : '#94A3B8'} fill={expandedLessons[lesson.id] ? (selectedItem?.data?.id === lesson.id ? 'var(--blue)' : '#94A3B8') : 'transparent'} />
                                    <span className="bangers" style={{ fontSize: '1rem', letterSpacing: '0.02em', color: selectedItem?.data?.id === lesson.id ? 'var(--blue)' : 'inherit' }}>{lesson.title}</span>
                                </div>
                                <button className="action-btn" style={{ padding: 4, width: 24, height: 24, background: 'var(--white)', border: '1px solid var(--border)' }} onClick={(e) => { e.stopPropagation(); setAddingTo({ type: 'chapter', parentId: lesson.id }); }}><Plus size={14} color="var(--blue)" /></button>
                            </div>

                            {expandedLessons[lesson.id] && (
                                <div style={{ marginLeft: '1.5rem', marginTop: '0.5rem', borderLeft: '1px solid #E5E7EB', paddingLeft: '1rem' }}>
                                    {chapters.filter(c => c.lesson_id === lesson.id).map(chapter => (
                                        <div key={chapter.id} style={{ marginBottom: '0.5rem' }}>
                                            <div
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', backgroundColor: selectedItem?.data?.id === chapter.id ? '#DBEAFE' : 'transparent', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}
                                                onClick={() => handleSelect('chapter', chapter)}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.stopPropagation(); toggleChapter(chapter.id); }}>
                                                    <Layers size={16} color="#64748B" />
                                                    <span>{chapter.title}</span>
                                                </div>
                                                <button className="icon-btn" style={{ padding: 4 }} onClick={(e) => { e.stopPropagation(); setAddingTo({ type: 'content', parentId: chapter.id }); }}><Plus size={14} color="#64748B" /></button>
                                            </div>

                                            {expandedChapters[chapter.id] && (
                                                <div style={{ marginLeft: '1.5rem', marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                    {contentItems.filter(ci => ci.chapter_id === chapter.id).map(ci => (
                                                        <div
                                                            key={ci.id}
                                                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', backgroundColor: selectedItem?.data?.id === ci.id ? '#FEF9C3' : 'white', borderRadius: '8px', border: `1px solid ${selectedItem?.data?.id === ci.id ? 'var(--comic-yellow)' : '#E5E7EB'}`, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, boxShadow: 'none', transition: 'all 0.2s' }}
                                                            onClick={() => handleSelect('content', ci)}
                                                        >
                                                            {TYPE_ICONS[ci.type] || <FileIcon size={14} color="#94A3B8" />}
                                                            <span style={{ color: 'black', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ci.data?.title || 'Untitled'}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Rich Editor Panel */}
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <h2 className="bangers" style={{ fontSize: '2rem', margin: 0, marginBottom: '1rem', color: 'var(--comic-navy)' }}>EDITOR</h2>

                {selectedItem ? (
                    <div className="card" style={{ padding: '2.5rem', flex: 1, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <div className="badge badge-approved" style={{ fontSize: '0.75rem', fontWeight: 900, background: 'var(--blue-soft)', color: 'var(--blue)', borderColor: 'var(--blue)' }}>
                                ACTION: EDITING {selectedItem.type.toUpperCase()}
                            </div>
                            <button className="action-btn btn-delete" style={{ fontSize: '0.85rem', fontWeight: 800, padding: '0.5rem 1.25rem', height: 'auto', gap: '0.5rem' }} onClick={() => handleDelete(selectedItem.type === 'content' ? 'content_items' : selectedItem.type + 's', selectedItem.data.id)}>
                                <Trash2 size={16} /> DELETE PERMANENTLY
                            </button>
                        </div>

                        <div className="form-group">
                            <label style={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 800 }}>DISPLAY TITLE</label>
                            <input className="input" style={{ width: '100%', fontSize: '1.5rem', fontWeight: 900, border: '1px solid var(--border)', letterSpacing: '-0.02em' }} value={formState.title} onChange={e => setFormState({ ...formState, title: e.target.value })} />
                        </div>

                        {selectedItem.type === 'lesson' && (
                            <div className="form-group">
                                <label className="bangers" style={{ color: 'var(--comic-navy)', fontSize: '1rem' }}>DESCRIPTION</label>
                                <textarea className="comic-input" style={{ width: '100%', height: '120px', resize: 'vertical' }} value={formState.description} onChange={e => setFormState({ ...formState, description: e.target.value })} />
                            </div>
                        )}

                        {selectedItem.type === 'content' && (
                            <>
                                <div className="form-group">
                                    <label className="bangers" style={{ color: 'var(--comic-navy)', fontSize: '1rem' }}>CONTENT TYPE</label>
                                    <select className="comic-input" style={{ width: '100%' }} value={formState.content_type} onChange={e => setFormState({ ...formState, content_type: e.target.value })}>
                                        <option value="video">Video Lecture</option>
                                        <option value="text">Rich Text / Markdown</option>
                                        <option value="quiz">Interactive Quiz</option>
                                        <option value="assignment">Assignment / Project</option>
                                        <option value="html_sim">Custom HTML Simulation</option>
                                    </select>
                                </div>

                                {['video', 'audio'].includes(formState.content_type) && (
                                    <>
                                        <div className="form-group">
                                            <label className="bangers" style={{ color: 'var(--comic-navy)', fontSize: '1rem' }}>MEDIA URL</label>
                                            <input className="comic-input" style={{ width: '100%' }} placeholder="https://..." value={formState.url} onChange={e => setFormState({ ...formState, url: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label className="bangers" style={{ color: 'var(--comic-navy)', fontSize: '1rem' }}>MARKDOWN NOTES</label>
                                            <textarea className="comic-input" style={{ width: '100%', height: '100px', resize: 'vertical' }} placeholder="# Chapter Summary" value={formState.notes} onChange={e => setFormState({ ...formState, notes: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label className="bangers" style={{ color: 'var(--comic-navy)', fontSize: '1rem' }}>FLASHCARDS (JSON ARRAY)</label>
                                            <textarea className="comic-input" style={{ width: '100%', height: '100px', resize: 'vertical', fontFamily: 'monospace', fontSize: '14px' }} placeholder='[{"front": "Q", "back": "A"}]' value={formState.flashcards} onChange={e => setFormState({ ...formState, flashcards: e.target.value })} />
                                        </div>
                                        <div className="form-group">
                                            <label className="bangers" style={{ color: 'var(--comic-navy)', fontSize: '1rem' }}>RESOURCES (JSON ARRAY)</label>
                                            <textarea className="comic-input" style={{ width: '100%', height: '80px', resize: 'vertical', fontFamily: 'monospace', fontSize: '14px' }} placeholder='[{"title": "Link", "url": "https", "type": "pdf"}]' value={formState.resources} onChange={e => setFormState({ ...formState, resources: e.target.value })} />
                                        </div>
                                    </>
                                )}

                                {['text', 'html_sim', 'assignment', 'quiz'].includes(formState.content_type) && (
                                    <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <label className="bangers" style={{ margin: 0, color: 'var(--comic-navy)', fontSize: '1rem' }}>
                                                {formState.content_type === 'text' && 'MARKDOWN CONTENT'}
                                                {formState.content_type === 'quiz' && 'QUIZ JSON PAYLOAD'}
                                                {formState.content_type === 'assignment' && 'ASSIGNMENT PROMPT'}
                                                {formState.content_type === 'html_sim' && 'HTML PAYLOAD'}
                                            </label>
                                        </div>
                                        <textarea
                                            className="comic-input"
                                            style={{ width: '100%', flex: 1, minHeight: '200px', resize: 'vertical', fontFamily: ['html_sim', 'quiz'].includes(formState.content_type) ? 'monospace' : 'system-ui', fontSize: '1rem', fontWeight: 600 }}
                                            value={formState.content}
                                            onChange={e => setFormState({ ...formState, content: e.target.value })}
                                            placeholder={formState.content_type === 'quiz' ? 'Enter quiz questions JSON array...' : 'Start typing...'}
                                        />
                                    </div>
                                )}

                                {['quiz', 'assignment'].includes(formState.content_type) && (
                                    <div className="form-group">
                                        <label className="bangers" style={{ color: '#64748B', fontSize: '0.9rem' }}>PASSING SCORE (0-100)</label>
                                        <input type="number" className="comic-input" style={{ width: '100%', border: '1px solid #E5E7EB' }} value={formState.passing_score} onChange={e => setFormState({ ...formState, passing_score: e.target.value })} />
                                    </div>
                                )}
                            </>
                        )}

                        <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1rem', border: 'none', maxWidth: '300px' }} onClick={handleSaveEditor} disabled={loading}>
                                {loading ? <RefreshCw className="spinning" size={20} /> : <Save size={20} />}
                                {loading ? 'EXECUTING SAVE...' : 'SAVE ARCHITECTURE UPDATES'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: 'var(--surface)', border: '2px dashed var(--border)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: 'none', borderRadius: '1.5rem' }}>
                        <div style={{ background: 'var(--white)', padding: '2rem', borderRadius: '2rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', marginBottom: '2rem' }}>
                            <Edit3 color="var(--blue)" size={64} style={{ opacity: 0.8 }} />
                        </div>
                        <h3 className="bangers" style={{ margin: 0, color: 'var(--black)', fontSize: '2.5rem', letterSpacing: '-0.04em' }}>READY TO BUILD?</h3>
                        <p style={{ color: '#64748B', maxWidth: '350px', margin: '1rem auto', fontWeight: 600, fontSize: '1rem', lineHeight: '1.6' }}>Select a module or chapter from the sidebar to begin crafting your elite curriculum.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
