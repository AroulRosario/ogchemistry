import { AlignLeft, CheckSquare, ChevronDown, ChevronRight, Edit3, File as FileIcon, Folder, Globe, Layers, PlayCircle, Plus, Save, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../supabase';

export default function CourseBuilder({ lessons, chapters, contentItems, fetchAll, showNotification }) {
    const [expandedLessons, setExpandedLessons] = useState({});
    const [expandedChapters, setExpandedChapters] = useState({});
    const [selectedItem, setSelectedItem] = useState(null); // { type, data }
    const [loading, setLoading] = useState(false);

    title: '',
        description: '',
            category: 'Core', // Added category
                content_type: 'video',
                    url: '',
                        content: '',
                            passing_score: 80,
                                notes: '',
                                    flashcards: '',
                                        resources: '',
    });

const [addingTo, setAddingTo] = useState(null);
const [newName, setNewName] = useState('');

const handleSelect = (type, data) => {
    setSelectedItem({ type, data });
    setFormState({
        title: data.title || (data.data && data.data.title) || '',
        description: data.description || '',
        category: data.category || 'Core', // Added category
        content_type: data.type || 'video',
        url: data.data?.url || '',
        content: data.data?.html || data.data?.text || (data.data?.questions ? JSON.stringify(data.data.questions, null, 2) : '') || data.data?.description || '',
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
        showNotification(`${type} created`);
        setAddingTo(null);
        setNewName('');
        await fetchAll();
    } catch (error) {
        showNotification('Creation failed', 'error');
    } finally {
        setLoading(false);
    }
};

const handleSaveEditor = async () => {
    if (!selectedItem) return;
    setLoading(true);
    try {
        if (selectedItem.type === 'lesson') {
            await supabase.from('lessons').update({
                title: formState.title,
                description: formState.description,
                category: formState.category // Added category
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
                    dataToSave.rawTxt = formState.content; // Fallback for invalid JSON
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
        showNotification('Schedules & content updated');
        await fetchAll();
    } catch (error) {
        showNotification('Save failed', 'error');
    } finally {
        setLoading(false);
    }
};

const TYPE_ICONS = {
    video: <PlayCircle size={14} />,
    quiz: <CheckSquare size={14} />,
    html_sim: <Globe size={14} />,
    assignment: <Edit3 size={14} />,
    text: <AlignLeft size={14} />
};

return (
    <div className="fade-in" style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 160px)' }}>

        {/* Modal */}
        {addingTo && (
            <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                <div className="card" style={{ width: '400px', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>New {addingTo.type}</h3>
                        <button onClick={() => setAddingTo(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}><X size={20} /></button>
                    </div>
                    <div className="form-group">
                        <label>Title</label>
                        <input autoFocus className="input" value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === 'Enter' && confirmCreate()} placeholder={`Enter ${addingTo.type} name...`} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setAddingTo(null)}>Cancel</button>
                        <button className="btn btn-primary" style={{ flex: 1 }} onClick={confirmCreate} disabled={loading || !newName.trim()}>Create</button>
                    </div>
                </div>
            </div>
        )}

        {/* Tree View */}
        <div style={{ flex: '0 0 350px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Syllabus Explorer</h2>
                <button className="btn btn-primary" style={{ height: '32px', padding: '0 0.75rem', fontSize: '0.8rem' }} onClick={() => setAddingTo({ type: 'lesson' })}>
                    <Plus size={14} /> Add Module
                </button>
            </div>

            <div className="card" style={{ flex: 1, padding: '1rem', overflowY: 'auto', background: 'var(--white)' }}>
                {lessons.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)', fontSize: '0.9rem' }}>No syllabus structure found.</p>}

                {lessons.map(lesson => (
                    <div key={lesson.id} style={{ marginBottom: '0.25rem' }}>
                        <div
                            className={`tree-item ${selectedItem?.data?.id === lesson.id ? 'active' : ''}`}
                            style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '0.6rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer',
                                backgroundColor: selectedItem?.data?.id === lesson.id ? 'var(--blue-light)' : 'transparent',
                                color: selectedItem?.data?.id === lesson.id ? 'var(--blue)' : 'inherit'
                            }}
                            onClick={() => handleSelect('lesson', lesson)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.stopPropagation(); toggleLesson(lesson.id); }}>
                                {expandedLessons[lesson.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                <Folder size={16} />
                                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{lesson.title}</span>
                            </div>
                            <button className="add-btn-small" onClick={(e) => { e.stopPropagation(); setAddingTo({ type: 'chapter', parentId: lesson.id }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}><Plus size={14} /></button>
                        </div>

                        {expandedLessons[lesson.id] && (
                            <div style={{ marginLeft: '1.25rem', borderLeft: '1px solid var(--gray-200)', paddingLeft: '0.5rem' }}>
                                {chapters.filter(c => c.lesson_id === lesson.id).map(chapter => (
                                    <div key={chapter.id}>
                                        <div
                                            style={{
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                padding: '0.5rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer',
                                                backgroundColor: selectedItem?.data?.id === chapter.id ? 'var(--gray-100)' : 'transparent',
                                                fontSize: '0.85rem'
                                            }}
                                            onClick={() => handleSelect('chapter', chapter)}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.stopPropagation(); toggleChapter(chapter.id); }}>
                                                {expandedChapters[chapter.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                <Layers size={14} />
                                                <span style={{ fontWeight: '500' }}>{chapter.title}</span>
                                            </div>
                                            <button onClick={(e) => { e.stopPropagation(); setAddingTo({ type: 'content', parentId: chapter.id }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}><Plus size={12} /></button>
                                        </div>

                                        {expandedChapters[chapter.id] && (
                                            <div style={{ marginLeft: '1.5rem', borderLeft: '1px solid var(--gray-200)', paddingLeft: '0.5rem' }}>
                                                {contentItems.filter(ci => ci.chapter_id === chapter.id).map(item => (
                                                    <div
                                                        key={item.id}
                                                        style={{
                                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                            padding: '0.4rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer',
                                                            backgroundColor: selectedItem?.data?.id === item.id ? 'var(--blue-light)' : 'transparent',
                                                            color: selectedItem?.data?.id === item.id ? 'var(--blue)' : 'var(--gray-600)',
                                                            fontSize: '0.8rem'
                                                        }}
                                                        onClick={() => handleSelect('content', item)}
                                                    >
                                                        {TYPE_ICONS[item.type] || <FileIcon size={14} />}
                                                        <span style={{ fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.data?.title || 'Untitled'}</span>
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

        {/* Editor Panel */}
        <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Editor Profile</h2>
                {selectedItem && (
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }} onClick={() => {
                            const table = selectedItem.type === 'lesson' ? 'lessons' : selectedItem.type === 'chapter' ? 'chapters' : 'content_items';
                        }}><Trash2 size={16} color="var(--error)" /></button>
                        <button className="btn btn-primary" style={{ padding: '0.4rem 1.75rem' }} onClick={handleSaveEditor} disabled={loading}>
                            <Save size={16} /> Update Details
                        </button>
                    </div>
                )}
            </div>

            <div className="card" style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                {!selectedItem ? (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
                        <Edit3 size={48} style={{ marginBottom: '1rem' }} />
                        <p style={{ fontWeight: '600' }}>Select an item to modify</p>
                    </div>
                ) : (
                    <div className="fade-in">
                        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                            <div style={{ flex: 2 }}>
                                <label>Display Title</label>
                                <input className="input" value={formState.title} onChange={e => setFormState({ ...formState, title: e.target.value })} />
                            </div>
                            {selectedItem.type === 'lesson' && (
                                <div style={{ flex: 1 }}>
                                    <label>Category (Explore Chip)</label>
                                    <select className="input" value={formState.category} onChange={e => setFormState({ ...formState, category: e.target.value })}>
                                        <option value="Core">Core</option>
                                        <option value="Applied">Applied</option>
                                        <option value="Bio">Bio</option>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                            )}
                            {selectedItem.type === 'content' && (
                                <div style={{ flex: 1 }}>
                                    <label>Integration Type</label>
                                    <select className="input" value={formState.content_type} onChange={e => setFormState({ ...formState, content_type: e.target.value })}>
                                        <option value="video">Resource: Video</option>
                                        <option value="audio">Resource: Audio</option>
                                        <option value="text">Interactive: Article</option>
                                        <option value="html_sim">Interactive: SIM Module</option>
                                        <option value="quiz">Checkpoint: Quiz</option>
                                        <option value="assignment">Evaluation: File Drop</option>
                                    </select>
                                </div>
                            )}
                        </div>

                        {selectedItem.type === 'lesson' && (
                            <div className="form-group">
                                <label>Overview Description</label>
                                <textarea className="input" style={{ minHeight: '120px' }} value={formState.description} onChange={e => setFormState({ ...formState, description: e.target.value })} />
                            </div>
                        )}

                        {selectedItem.type === 'content' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {(formState.content_type === 'video' || formState.content_type === 'audio') && (
                                    <div className="form-group">
                                        <label>Stream URL (Supabase/Link)</label>
                                        <input className="input" value={formState.url} onChange={e => setFormState({ ...formState, url: e.target.value })} />
                                    </div>
                                )}

                                {formState.content_type === 'quiz' && (
                                    <div className="form-group">
                                        <label>Passing Threshold (%)</label>
                                        <input type="number" className="input" value={formState.passing_score} onChange={e => setFormState({ ...formState, passing_score: parseInt(e.target.value) })} />
                                    </div>
                                )}

                                {(formState.content_type === 'html_sim' || formState.content_type === 'quiz' || formState.content_type === 'assignment' || formState.content_type === 'text') && (
                                    <div className="form-group">
                                        <label>{formState.content_type === 'quiz' ? 'Quiz Configuration (JSON)' : 'Source Payload / Markdown'}</label>
                                        <textarea className="input" style={{ minHeight: '300px', fontFamily: 'monospace', fontSize: '13px' }} value={formState.content} onChange={e => setFormState({ ...formState, content: e.target.value })} />
                                    </div>
                                )}

                                {(formState.content_type === 'video' || formState.content_type === 'audio') && (
                                    <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div className="form-group">
                                            <label>Curriculum Notes (Markdown)</label>
                                            <textarea className="input" style={{ minHeight: '150px' }} value={formState.notes} onChange={e => setFormState({ ...formState, notes: e.target.value })} />
                                        </div>
                                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                                            <div style={{ flex: 1 }}>
                                                <label>Flashcards (JSON)</label>
                                                <textarea className="input" style={{ minHeight: '150px', fontFamily: 'monospace' }} value={formState.flashcards} onChange={e => setFormState({ ...formState, flashcards: e.target.value })} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label>Supplemental Resources (JSON)</label>
                                                <textarea className="input" style={{ minHeight: '150px', fontFamily: 'monospace' }} value={formState.resources} onChange={e => setFormState({ ...formState, resources: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* Preview Panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Live Preview</h2>
            </div>
            <div className="card" style={{ flex: 1, padding: 0, overflow: 'hidden', background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {selectedItem?.type === 'content' && formState.content_type === 'html_sim' ? (
                    <iframe title="sim-preview" srcDoc={formState.content} style={{ width: '100%', height: '100%', border: 'none' }} />
                ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.4 }}>
                        <Globe size={48} color="white" style={{ marginBottom: '1rem' }} />
                        <p style={{ color: 'white', fontWeight: 600 }}>Visual preview unavailable</p>
                    </div>
                )}
            </div>
        </div>
    </div>
);
}
