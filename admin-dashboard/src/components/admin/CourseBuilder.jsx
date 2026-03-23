import {
    AlignLeft, CheckSquare, ChevronDown, ChevronRight, Edit3,
    File as FileIcon, Folder, Globe, Layers, PlayCircle,
    Plus, Save, Sparkles, Trash2, X
} from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../supabase';

export default function CourseBuilder({ lessons, chapters, contentItems, fetchAll, showNotification }) {
    const [expandedLessons, setExpandedLessons] = useState({});
    const [expandedChapters, setExpandedChapters] = useState({});
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formState, setFormState] = useState({
        title: '',
        description: '',
        category: 'Core',
        content_type: 'video',
        url: '',
        content: '',
        passing_score: 80,
        notes: '',
        flashcards: '',
        resources: '',
    });

    // Gemini AI state
    const [showGemini, setShowGemini] = useState(false);
    const [geminiPrompt, setGeminiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [localApiKey, setLocalApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
    const [models, setModels] = useState([]);
    const [selectedModel, setSelectedModel] = useState('');
    const [isFetchingModels, setIsFetchingModels] = useState(false);

    const fetchModels = async () => {
        if (!localApiKey.trim()) {
            showNotification('Enter Gemini API Key first', 'error');
            return;
        }
        setIsFetchingModels(true);
        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${localApiKey}`);
            const data = await res.json();
            if (data.error) throw new Error(data.error.message);
            if (data.models) {
                const available = data.models.filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'));
                setModels(available);
                if (available.length > 0) {
                    const flash = available.find(m => m.name.includes('gemini-1.5-flash'));
                    setSelectedModel(flash ? flash.name : available[0].name);
                    localStorage.setItem('gemini_api_key', localApiKey);
                    showNotification('Models fetched successfully!');
                } else {
                    showNotification('No content-generating models found.', 'error');
                }
            }
        } catch (err) {
            showNotification(`Failed to fetch models: ${err.message}`, 'error');
        } finally {
            setIsFetchingModels(false);
        }
    };

    // Add item state
    const [addingTo, setAddingTo] = useState(null);
    const [newName, setNewName] = useState('');

    const handleSelect = (type, data) => {
        setSelectedItem({ type, data });
        setFormState({
            title: data.title || (data.data && data.data.title) || '',
            description: data.description || '',
            category: data.category || 'Core',
            content_type: data.type || 'video',
            url: data.data?.url || '',
            content: data.data?.html || data.data?.text || data.data?.question ||
                (data.data?.questions ? JSON.stringify(data.data.questions, null, 2) : '') ||
                (data.data?.question ? JSON.stringify({ question: data.data.question, solution: data.data.solution, year: data.data.year, exam: data.data.exam }, null, 2) : '') ||
                data.data?.description || '',
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
                    category: formState.category
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
                } else if (formState.content_type === 'pyq') {
                    try {
                        const parsed = JSON.parse(formState.content);
                        Object.assign(dataToSave, parsed);
                    } catch (e) {
                        dataToSave.question = formState.content;
                    }
                }

                await supabase.from('content_items').update({
                    type: formState.content_type,
                    data: dataToSave
                }).eq('id', selectedItem.data.id);
            }
            showNotification('Content saved successfully');
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
        text: <AlignLeft size={14} />,
        pyq: <Sparkles size={14} color="#EF4444" />
    };

    const handleGeminiGen = async () => {
        const apiKey = localApiKey || localStorage.getItem('gemini_api_key');
        if (!apiKey) {
            showNotification('Gemini API Key missing! Please enter it in the prompt space.', 'error');
            return;
        }
        if (!selectedModel) {
            showNotification('Please fetch and select a model first.', 'error');
            return;
        }
        if (!geminiPrompt.trim()) return;

        setIsGenerating(true);
        try {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/${selectedModel}:generateContent?key=${apiKey}`;

            let systemPrompt = '';
            if (formState.content_type === 'quiz') {
                systemPrompt = `You are an expert Chemistry teacher for JEE/NEET preparation.
Generate a Chemistry quiz as a valid JSON object ONLY (no markdown fences, no explanation text).
Format: { "questions": [ { "question": "...", "options": ["A. ...", "B. ...", "C. ...", "D. ..."], "answer": "A. ..." } ] }
Use proper LaTeX for ALL chemical formulas (e.g. $H_2O$, $K_2Cr_2O_7$, $\\Delta G = \\Delta H - T\\Delta S$).
Generate exactly 5 questions.`;
            } else if (formState.content_type === 'pyq') {
                systemPrompt = `You are an expert at NEET/JEE chemistry previous year questions.
Generate a REAL Previous Year Question SPECIFICALLY from NEET, JEE Mains, or JEE Advanced as a valid JSON object ONLY.
Format: { "question": "...", "options": ["A. ...", "B. ...", "C. ...", "D. ..."], "answer": "A. ...", "solution": "Step-by-step detailed solution here...", "year": "2023", "exam": "NEET", "difficulty": "Hard" }
The question MUST be an actual past paper question with exact answers perfect latex for all formulas. Include accurate difficulty level.`;
            } else if (formState.content_type === 'html_sim') {
                systemPrompt = `You are an expert Chemistry educator creating interactive HTML simulations.
Create a self-contained HTML page (no external dependencies except CDN links) that visually simulates the requested concept.
Use inline CSS and vanilla JavaScript. Make it visually beautiful with animations. Return ONLY the complete HTML code, nothing else.`;
            } else {
                systemPrompt = `You are an expert Chemistry teacher creating beautiful "Comic Notes" for JEE/NEET learners.
Generate the content as per a premium UI and design using Markdown format. 
You MUST use PERFECT LaTeX for ALL formulas (inline math uses $...$, block math uses $$...$$).
Include: Overview, Key Concepts, Important Formulas, Common Mistakes, Solved Examples. Ensure it is highly readable and available for learners.`;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `${systemPrompt}\n\nTopic/Request: ${geminiPrompt}` }] }]
                })
            });

            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const result = await response.json();
            const text = result.candidates[0].content.parts[0].text;

            // Strip possible markdown code fences
            const jsonMatch = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
            const htmlMatch = text.match(/<!DOCTYPE html[\s\S]*/i);
            const finalContent = jsonMatch ? jsonMatch[1].trim() : (htmlMatch ? htmlMatch[0] : text.trim());

            setFormState(prev => ({ ...prev, content: finalContent }));
            setShowGemini(false);
            setGeminiPrompt('');
            showNotification('✨ AI Content Generated!');
        } catch (error) {
            console.error('Gemini error:', error);
            showNotification(`Generation failed: ${error.message}`, 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fade-in" style={{ display: 'flex', gap: '1.5rem', height: 'calc(100vh - 160px)', position: 'relative' }}>

            {/* ── Gemini AI Modal ── */}
            {showGemini && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200 }}>
                    <div className="card" style={{ width: '520px', padding: '2rem', border: '2px solid var(--blue)', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Sparkles size={18} color="white" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>Gemini AI Generator</h3>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', margin: 0 }}>Generating for: <b>{formState.content_type.toUpperCase()}</b></p>
                                </div>
                            </div>
                            <button onClick={() => { setShowGemini(false); setGeminiPrompt(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}>
                                <X size={22} />
                            </button>
                        </div>

                        {formState.content_type === 'pyq' && (
                            <div style={{ padding: '0.75rem 1rem', backgroundColor: '#FEF3C7', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.8rem', color: '#92400E' }}>
                                💡 <b>PYQ Mode:</b> Describe the exam, year, chapter or topic. AI will find a real PYQ with a detailed solution and LaTeX formulas.
                            </div>
                        )}

                        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                            <label>Gemini API Key</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="password"
                                    className="input"
                                    style={{ flex: 1 }}
                                    value={localApiKey}
                                    onChange={e => {
                                        setLocalApiKey(e.target.value);
                                        localStorage.setItem('gemini_api_key', e.target.value);
                                    }}
                                    placeholder="Enter API Key here..."
                                />
                                <button className="btn btn-secondary" onClick={fetchModels} disabled={isFetchingModels || !localApiKey}>
                                    {isFetchingModels ? 'Fetching...' : 'Fetch Models'}
                                </button>
                            </div>
                        </div>

                        {models.length > 0 && (
                            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                                <label>Select Model</label>
                                <select className="input" value={selectedModel} onChange={e => setSelectedModel(e.target.value)}>
                                    {models.map(m => (
                                        <option key={m.name} value={m.name}>{m.displayName || m.name.replace('models/', '')}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="form-group">
                            <label>What do you want to generate?</label>
                            <textarea
                                autoFocus
                                className="input"
                                style={{ minHeight: '110px', resize: 'vertical' }}
                                value={geminiPrompt}
                                onChange={e => setGeminiPrompt(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && e.ctrlKey && handleGeminiGen()}
                                placeholder={
                                    formState.content_type === 'pyq'
                                        ? 'e.g. JEE Advanced 2022 Electrochemistry hard question...'
                                        : formState.content_type === 'quiz'
                                        ? 'e.g. 5 MCQs on Aldol Condensation with concepts tested...'
                                        : formState.content_type === 'html_sim'
                                        ? 'e.g. Interactive SN1 vs SN2 reaction mechanism simulator...'
                                        : 'e.g. Comprehensive notes on Chemical Equilibrium with Le Chatelier\'s Principle...'
                                }
                            />
                            <p style={{ fontSize: '0.7rem', color: 'var(--gray-400)', marginTop: '0.4rem' }}>Ctrl+Enter to generate</p>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => { setShowGemini(false); setGeminiPrompt(''); }}>Cancel</button>
                            <button
                                className="btn btn-primary"
                                style={{ flex: 2, background: 'linear-gradient(135deg, #2563EB, #7C3AED)', border: 'none' }}
                                onClick={handleGeminiGen}
                                disabled={isGenerating || !geminiPrompt.trim()}
                            >
                                <Sparkles size={16} />
                                {isGenerating ? 'Generating…' : '✨ Generate with AI'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Add Item Modal ── */}
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

            {/* ── Column 1: Syllabus Tree ── */}
            <div style={{ flex: '0 0 300px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Syllabus</h2>
                    <button className="btn btn-primary" style={{ height: '32px', padding: '0 0.75rem', fontSize: '0.8rem' }} onClick={() => setAddingTo({ type: 'lesson' })}>
                        <Plus size={14} /> Module
                    </button>
                </div>

                <div className="card" style={{ flex: 1, padding: '0.75rem', overflowY: 'auto', background: 'var(--white)' }}>
                    {lessons.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--gray-400)', fontSize: '0.9rem' }}>No syllabus yet.</p>}
                    {lessons.map(lesson => (
                        <div key={lesson.id} style={{ marginBottom: '0.25rem' }}>
                            <div
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: selectedItem?.data?.id === lesson.id ? 'var(--blue-light)' : 'transparent', color: selectedItem?.data?.id === lesson.id ? 'var(--blue)' : 'inherit' }}
                                onClick={() => handleSelect('lesson', lesson)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => { e.stopPropagation(); toggleLesson(lesson.id); }}>
                                    {expandedLessons[lesson.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    <Folder size={16} />
                                    <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{lesson.title}</span>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); setAddingTo({ type: 'chapter', parentId: lesson.id }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5 }}><Plus size={14} /></button>
                            </div>

                            {expandedLessons[lesson.id] && (
                                <div style={{ marginLeft: '1.25rem', borderLeft: '1px solid var(--gray-200)', paddingLeft: '0.5rem' }}>
                                    {chapters.filter(c => c.lesson_id === lesson.id).map(chapter => (
                                        <div key={chapter.id}>
                                            <div
                                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: selectedItem?.data?.id === chapter.id ? 'var(--gray-100)' : 'transparent', fontSize: '0.85rem' }}
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
                                                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: selectedItem?.data?.id === item.id ? 'var(--blue-light)' : 'transparent', color: selectedItem?.data?.id === item.id ? 'var(--blue)' : 'var(--gray-600)', fontSize: '0.8rem' }}
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

            {/* ── Column 2: Editor ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Content Editor</h2>
                    {selectedItem && (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                                className="btn btn-secondary"
                                style={{ padding: '0.4rem 0.9rem', background: 'linear-gradient(135deg, #EEF2FF, #F3E8FF)', border: '1px solid #C7D2FE', color: '#4338CA' }}
                                onClick={() => setShowGemini(true)}
                            >
                                <Sparkles size={15} /> AI Generate
                            </button>
                            <button className="btn btn-primary" style={{ padding: '0.4rem 1.5rem' }} onClick={handleSaveEditor} disabled={loading}>
                                <Save size={15} /> Save
                            </button>
                        </div>
                    )}
                </div>

                <div className="card" style={{ flex: 1, padding: '1.75rem', overflowY: 'auto' }}>
                    {!selectedItem ? (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.35 }}>
                            <Edit3 size={48} style={{ marginBottom: '1rem' }} />
                            <p style={{ fontWeight: '600' }}>Select an item from the syllabus to edit</p>
                        </div>
                    ) : (
                        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Title + Type row */}
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
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
                                            <option value="video">🎥 Resource: Video</option>
                                            <option value="audio">🎧 Resource: Audio</option>
                                            <option value="text">📄 Interactive: Article</option>
                                            <option value="html_sim">🌐 Interactive: SIM Module</option>
                                            <option value="quiz">✅ Checkpoint: Quiz</option>
                                            <option value="pyq">🔥 Challenge: PYQ Archive</option>
                                            <option value="assignment">📝 Evaluation: File Drop</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            {/* Lesson description */}
                            {selectedItem.type === 'lesson' && (
                                <div className="form-group">
                                    <label>Overview Description</label>
                                    <textarea className="input" style={{ minHeight: '100px' }} value={formState.description} onChange={e => setFormState({ ...formState, description: e.target.value })} />
                                </div>
                            )}

                            {/* Content-specific fields */}
                            {selectedItem.type === 'content' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {(formState.content_type === 'video' || formState.content_type === 'audio') && (
                                        <div className="form-group">
                                            <label>Stream URL</label>
                                            <input className="input" value={formState.url} onChange={e => setFormState({ ...formState, url: e.target.value })} placeholder="https://..." />
                                        </div>
                                    )}
                                    {formState.content_type === 'quiz' && (
                                        <div className="form-group">
                                            <label>Passing Threshold (%)</label>
                                            <input type="number" className="input" style={{ maxWidth: '180px' }} value={formState.passing_score} onChange={e => setFormState({ ...formState, passing_score: parseInt(e.target.value) })} />
                                        </div>
                                    )}
                                    {/* PYQ info badge */}
                                    {formState.content_type === 'pyq' && (
                                        <div style={{ padding: '0.75rem 1rem', backgroundColor: '#FEF3C7', borderRadius: '8px', fontSize: '0.82rem', color: '#92400E', border: '1px solid #FDE68A' }}>
                                            🔥 <b>PYQ Archive</b> — Use the AI Generate button to auto-create a real JEE/NEET question with solutions and LaTeX. Or write your JSON manually below.
                                        </div>
                                    )}
                                    {/* Payload textarea */}
                                    {['html_sim', 'quiz', 'assignment', 'text', 'pyq'].includes(formState.content_type) && (
                                        <div className="form-group">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                                <label style={{ marginBottom: 0 }}>
                                                    {formState.content_type === 'quiz' ? 'Quiz JSON' :
                                                     formState.content_type === 'pyq' ? 'PYQ JSON' :
                                                     formState.content_type === 'html_sim' ? 'HTML Source' :
                                                     'Markdown / Text Content'}
                                                </label>
                                                <button
                                                    style={{ fontSize: '0.72rem', color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }}
                                                    onClick={() => setShowGemini(true)}
                                                >
                                                    <Sparkles size={12} /> Generate with AI
                                                </button>
                                            </div>
                                            <textarea
                                                className="input"
                                                style={{ minHeight: '280px', fontFamily: 'monospace', fontSize: '12.5px' }}
                                                value={formState.content}
                                                onChange={e => setFormState({ ...formState, content: e.target.value })}
                                                placeholder={
                                                    formState.content_type === 'pyq'
                                                        ? '{\n  "question": "What is the oxidation state of Cr in K₂Cr₂O₇?",\n  "options": ["A. +6", "B. +3", "C. +2", "D. +4"],\n  "answer": "A. +6",\n  "solution": "In K₂Cr₂O₇...",\n  "year": "2023",\n  "exam": "NEET",\n  "difficulty": "Medium"\n}'
                                                        : ''
                                                }
                                            />
                                        </div>
                                    )}
                                    {/* Video / Audio extra fields */}
                                    {(formState.content_type === 'video' || formState.content_type === 'audio') && (
                                        <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                            <div className="form-group">
                                                <label>Curriculum Notes (Markdown)</label>
                                                <textarea className="input" style={{ minHeight: '130px' }} value={formState.notes} onChange={e => setFormState({ ...formState, notes: e.target.value })} />
                                            </div>
                                            <div style={{ display: 'flex', gap: '1.25rem' }}>
                                                <div style={{ flex: 1 }}>
                                                    <label>Flashcards (JSON array)</label>
                                                    <textarea className="input" style={{ minHeight: '120px', fontFamily: 'monospace', fontSize: '12px' }} value={formState.flashcards} onChange={e => setFormState({ ...formState, flashcards: e.target.value })} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <label>Resources (JSON array)</label>
                                                    <textarea className="input" style={{ minHeight: '120px', fontFamily: 'monospace', fontSize: '12px' }} value={formState.resources} onChange={e => setFormState({ ...formState, resources: e.target.value })} />
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

        </div>
    );
}
