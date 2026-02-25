import { Compass, Image, LayoutGrid, Save } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../supabase';

export default function ExploreManager({ lessons, fetchAll, showNotification }) {
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [loading, setLoading] = useState(false);

    // Internal form state for the selected lesson
    const [formState, setFormState] = useState({
        title: '',
        category: 'Core',
        description: ''
    });

    const handleSelect = (lesson) => {
        setSelectedLesson(lesson);
        setFormState({
            title: lesson.title || '',
            category: lesson.category || 'Core',
            description: lesson.description || ''
        });
    };

    const handleSave = async () => {
        if (!selectedLesson) return;
        setLoading(true);
        try {
            const { error } = await supabase.from('lessons').update({
                title: formState.title,
                category: formState.category,
                description: formState.description
            }).eq('id', selectedLesson.id);

            if (error) throw error;
            showNotification('Explore Universe updated specifically!');
            await fetchAll();

            // Re-select to update UI with latest DB row if needed, or just let React update it 
            // from the new 'lessons' prop once fetchAll completes.
        } catch (error) {
            showNotification('Update failed: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in" style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 160px)' }}>
            {/* Left side: List of Universes */}
            <div style={{ flex: '0 0 350px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Universes
                    </h2>
                </div>

                <div className="card" style={{ flex: 1, padding: '1rem', overflowY: 'auto', background: 'var(--white)' }}>
                    {lessons.length === 0 && (
                        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)', fontSize: '0.9rem' }}>
                            No universes found.
                        </p>
                    )}

                    {lessons.map((lesson) => (
                        <div
                            key={lesson.id}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '1rem',
                                padding: '1rem', borderRadius: '0.75rem', cursor: 'pointer',
                                backgroundColor: selectedLesson?.id === lesson.id ? '#EFF6FF' : 'transparent',
                                border: `1px solid ${selectedLesson?.id === lesson.id ? '#BFDBFE' : '#F1F5F9'}`,
                                marginBottom: '0.5rem'
                            }}
                            onClick={() => handleSelect(lesson)}
                        >
                            <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Compass size={20} color={selectedLesson?.id === lesson.id ? '#3B82F6' : '#94A3B8'} />
                            </div>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1E293B', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                    {lesson.title}
                                </div>
                                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748B', marginTop: '0.25rem' }}>
                                    {lesson.category || 'Core'} · {lesson.chapters?.length || 0} Lessons
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right side: Editor */}
            <div style={{ flex: 1.5, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Explore Card Editor
                    </h2>
                    {selectedLesson && (
                        <button className="btn btn-primary" style={{ padding: '0.4rem 1.75rem' }} onClick={handleSave} disabled={loading}>
                            <Save size={16} /> Save Changes
                        </button>
                    )}
                </div>

                <div className="card" style={{ flex: 1, padding: '2rem', overflowY: 'auto', backgroundColor: '#F8FAFC' }}>
                    {!selectedLesson ? (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
                            <LayoutGrid size={48} style={{ marginBottom: '1rem' }} />
                            <p style={{ fontWeight: '600' }}>Select a Universe to Edit</p>
                            <p style={{ fontSize: '0.85rem', textAlign: 'center', maxWidth: 300, marginTop: '0.5rem' }}>Customize how this content appears on the learner's Explore screen.</p>
                        </div>
                    ) : (
                        <div className="fade-in" style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1rem', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>

                            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                                <div style={{ flex: 2 }}>
                                    <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#64748B', letterSpacing: 1, marginBottom: 8, display: 'block' }}>
                                        Display Title
                                    </label>
                                    <input
                                        className="input"
                                        style={{ fontSize: '1.1rem', fontWeight: '700' }}
                                        value={formState.title}
                                        onChange={e => setFormState({ ...formState, title: e.target.value })}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#64748B', letterSpacing: 1, marginBottom: 8, display: 'block' }}>
                                        Category (Filter Chip)
                                    </label>
                                    <select
                                        className="input"
                                        value={formState.category}
                                        onChange={e => setFormState({ ...formState, category: e.target.value })}
                                        style={{ backgroundColor: '#F1F5F9', fontWeight: '600', color: '#0F172A' }}
                                    >
                                        <option value="All">All</option>
                                        <option value="Core">Core</option>
                                        <option value="Applied">Applied</option>
                                        <option value="Bio">Bio</option>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: '#64748B', letterSpacing: 1, marginBottom: 8, display: 'block' }}>
                                    Universe Description (Max 2 lines on App)
                                </label>
                                <textarea
                                    className="input"
                                    style={{ minHeight: '100px', lineHeight: '1.5', fontSize: '0.95rem' }}
                                    value={formState.description}
                                    onChange={e => setFormState({ ...formState, description: e.target.value })}
                                    placeholder="Enter a captivating description for this universe..."
                                />
                            </div>

                            <div style={{ backgroundColor: '#F8FAFC', padding: '1.5rem', borderRadius: '0.75rem', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem' }}>
                                <Image size={24} color="#94A3B8" />
                                <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: '500' }}>Custom thumbnail image uploads coming soon.</p>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
