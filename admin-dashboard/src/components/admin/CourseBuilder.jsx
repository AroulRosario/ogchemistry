import {
    AlignLeft, CheckSquare, ChevronDown, ChevronRight, ChevronUp, Edit3,
    File as FileIcon, Folder, Globe, GripVertical, Layers, PlayCircle,
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
    const [geminiTarget, setGeminiTarget] = useState('content');
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
        
        let initialContent = '';
        if (type === 'content') {
            const contentType = data.type;
            if (contentType === 'quiz' && data.data?.questions) {
                initialContent = JSON.stringify(data.data.questions, null, 2);
            } else if (contentType === 'pyq' && data.data?.question) {
                // If it's a PYQ, we want to edit the whole metadata object as JSON
                const { title, ...rest } = data.data; // title is already in formState
                initialContent = JSON.stringify(rest, null, 2);
            } else {
                initialContent = data.data?.html || data.data?.text || data.data?.description || '';
            }
        }

        setFormState({
            title: data.title || (data.data && data.data.title) || '',
            description: data.description || '',
            category: data.category || 'Core',
            content_type: data.type || 'video',
            url: data.data?.url || '',
            content: initialContent,
            passing_score: data.data?.passing_score || 80,
            notes: data.data?.notes || '',
            flashcards: JSON.stringify(data.data?.flashcards || [], null, 2),
            resources: JSON.stringify(data.data?.resources || [], null, 2)
        });
    };

    const toggleLesson = (id) => setExpandedLessons(prev => ({ ...prev, [id]: !prev[id] }));
    const toggleChapter = (id) => setExpandedChapters(prev => ({ ...prev, [id]: !prev[id] }));

    const handleDelete = async (type, id) => {
        if (!window.confirm(`Delete this ${type}? This cannot be undone.`)) return;
        setLoading(true);
        try {
            const table = type === 'lesson' ? 'lessons' : type === 'chapter' ? 'chapters' : 'content_items';
            await supabase.from(table).delete().eq('id', id);
            if (selectedItem?.data?.id === id) setSelectedItem(null);
            showNotification(`${type} deleted`);
            await fetchAll();
        } catch (e) {
            showNotification('Delete failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const reorderItems = async (type, items, fromIdx, direction) => {
        const toIdx = fromIdx + direction;
        if (toIdx < 0 || toIdx >= items.length) return;
        setLoading(true);
        const table = type === 'lesson' ? 'lessons' : type === 'chapter' ? 'chapters' : 'content_items';
        try {
            const a = items[fromIdx], b = items[toIdx];
            await supabase.from(table).update({ order: b.order }).eq('id', a.id);
            await supabase.from(table).update({ order: a.order }).eq('id', b.id);
            await fetchAll();
        } catch (e) {
            showNotification('Reorder failed', 'error');
        } finally {
            setLoading(false);
        }
    };

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

                // ── VIRTUAL TYPE FIX (Bypass Enum Restrictions) ──
                // If type is not in the restricted legacy list, we save as 'html_sim' 
                // but keep the real type in typeOverride.
                const LEGACY_ENUM = ['video', 'audio', 'html_sim', 'quiz', 'reel'];
                let dbType = formState.content_type;
                if (!LEGACY_ENUM.includes(dbType)) {
                    dataToSave.typeOverride = dbType;
                    dbType = 'html_sim';
                }

                const { error: saveError } = await supabase.from('content_items').update({
                    type: dbType,
                    data: dataToSave
                }).eq('id', selectedItem.data.id);

                if (saveError) throw saveError;
            }
            showNotification('Content saved successfully');
            await fetchAll();
        } catch (error) {
            console.error('Save failed:', error);
            showNotification(`Save failed: ${error.message}`, 'error');
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
            if (geminiTarget === 'notes') {
                systemPrompt = `You are a curriculum expert. Generate detailed Curriculum Notes in Markdown format for the provided topic. Focus on key concepts and summaries. Use PERFECT LaTeX for formulas (inline: $...$, block: $$...$$).`;
            } else if (geminiTarget === 'flashcards') {
                systemPrompt = `You are an expert educator. Generate EXACTLY 5 flashcards as a valid JSON array ONLY.
CRITICAL: For LaTeX formulas inside JSON, you MUST double-escape backslashes otherwise JSON.parse will crash! e.g., \\\\Delta G or \\\\frac{a}{b}.
Format MUST BE: [ { "front": "...", "back": "..." } ]`;
            } else if (geminiTarget === 'resources') {
                systemPrompt = `You are an expert educator. Generate a list of 3 helpful external resources/links as a valid JSON array ONLY.
Format MUST BE: [ { "title": "Khan Academy: Topic", "url": "https://..." } ]`;
            } else if (formState.content_type === 'quiz') {
                systemPrompt = `You are an expert Chemistry teacher for JEE/NEET preparation.
Generate a Chemistry quiz as a valid JSON object ONLY (no markdown fences, no explanation text).
CRITICAL: For LaTeX formulas inside JSON, you MUST double-escape backslashes otherwise JSON.parse will crash! e.g., \\\\Delta G or \\\\frac{a}{b}.
Format: { "questions": [ { "question": "...", "options": ["A. ...", "B. ...", "C. ...", "D. ..."], "answer": "A. ..." } ] }
Generate exactly 5 questions.`;
            } else if (formState.content_type === 'pyq') {
                systemPrompt = `You are an expert at NEET/JEE chemistry previous year questions.
Generate a REAL Previous Year Question SPECIFICALLY from NEET, JEE Mains, or JEE Advanced as a valid JSON object ONLY.
CRITICAL: For LaTeX formulas inside JSON, you MUST double-escape backslashes otherwise JSON.parse will crash! e.g., \\\\Delta G or \\\\frac{a}{b}.
Format: { "question": "...", "options": ["A. ...", "B. ...", "C. ...", "D. ..."], "answer": "A. ...", "solution": "Step-by-step detailed solution here...", "year": "2023", "exam": "NEET", "difficulty": "Hard" }
The question MUST be an actual past paper question with exact answers perfect latex for all formulas. Include accurate difficulty level.`;
            } else if (formState.content_type === 'html_sim') {
                systemPrompt = `You are an expert Chemistry educator creating interactive HTML simulations.
Create a self-contained HTML page (no external dependencies except CDN links) that visually simulates the requested concept.
Use inline CSS and vanilla JavaScript. Make it visually beautiful with animations. Return ONLY the complete HTML code, nothing else.`;
            } else if (formState.content_type === 'assignment') {
                systemPrompt = `You are an expert educator. Generate a detailed assignment/project prompt in Markdown format for the learner. Include instructions, evaluation criteria, and tips. Use PERFECT LaTeX for formulas.`;
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

            // Extract based on content type to prevent regex mangling
            let finalContent = text.trim();
            const jsonFenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
            const htmlFenceMatch = text.match(/```(?:html)?\s*([\s\S]*?)```/);

            if (geminiTarget === 'flashcards' || geminiTarget === 'resources' || (geminiTarget === 'content' && (formState.content_type === 'quiz' || formState.content_type === 'pyq'))) {
                finalContent = jsonFenceMatch ? jsonFenceMatch[1].trim() : finalContent;
                if (!finalContent.startsWith('{') && !finalContent.startsWith('[')) {
                    const pureJson = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
                    if (pureJson) finalContent = pureJson[0].trim();
                }
            } else if (geminiTarget === 'content' && formState.content_type === 'html_sim') {
                const docMatch = text.match(/<(!DOCTYPE )?html[\s\S]*<\/html>/i);
                finalContent = docMatch ? docMatch[0] : (htmlFenceMatch ? htmlFenceMatch[1].trim() : finalContent);
            } else {
                if (finalContent.startsWith('```markdown')) {
                    finalContent = finalContent.replace(/^```markdown\s*/, '').replace(/\s*```$/, '');
                } else if (finalContent.startsWith('```')) {
                    finalContent = finalContent.replace(/^```\w*\s*/, '').replace(/\s*```$/, '');
                }
            }

            if (geminiTarget === 'notes') {
                setFormState(prev => ({ ...prev, notes: finalContent }));
            } else if (geminiTarget === 'flashcards') {
                setFormState(prev => ({ ...prev, flashcards: finalContent }));
            } else if (geminiTarget === 'resources') {
                setFormState(prev => ({ ...prev, resources: finalContent }));
            } else {
                setFormState(prev => ({ ...prev, content: finalContent }));
            }
            setShowGemini(false);
            setGeminiPrompt('');
            showNotification('✨ AI Content Generated!');
            
            // Auto-save the generated content to the database
            setTimeout(() => {
                handleSaveEditor();
            }, 500);
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
                                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', margin: 0 }}>Generating for: <b>{geminiTarget === 'content' ? formState.content_type.toUpperCase() : geminiTarget.toUpperCase()}</b></p>
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
                    {lessons.map((lesson, li) => {
                        const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);
                        return (
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                    <button onClick={(e) => { e.stopPropagation(); reorderItems('lesson', sortedLessons, sortedLessons.findIndex(x => x.id === lesson.id), -1); }} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.4, padding: '2px' }} title="Move Up"><ChevronUp size={12} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); reorderItems('lesson', sortedLessons, sortedLessons.findIndex(x => x.id === lesson.id), 1); }} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.4, padding: '2px' }} title="Move Down"><ChevronDown size={12} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); setAddingTo({ type: 'chapter', parentId: lesson.id }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, padding: '2px' }}><Plus size={14} /></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete('lesson', lesson.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', opacity: 0.6, padding: '2px' }} title="Delete"><Trash2 size={12} /></button>
                                </div>
                            </div>

                            {expandedLessons[lesson.id] && (
                                <div style={{ marginLeft: '1.25rem', borderLeft: '1px solid var(--gray-200)', paddingLeft: '0.5rem' }}>
                                    {chapters.filter(c => c.lesson_id === lesson.id).sort((a,b) => a.order - b.order).map((chapter, ci) => {
                                        const siblingChapters = chapters.filter(c => c.lesson_id === lesson.id).sort((a,b) => a.order - b.order);
                                        return (
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
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                                    <button onClick={(e) => { e.stopPropagation(); reorderItems('chapter', siblingChapters, siblingChapters.findIndex(x => x.id === chapter.id), -1); }} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.4, padding: '2px' }}><ChevronUp size={11} /></button>
                                                    <button onClick={(e) => { e.stopPropagation(); reorderItems('chapter', siblingChapters, siblingChapters.findIndex(x => x.id === chapter.id), 1); }} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.4, padding: '2px' }}><ChevronDown size={11} /></button>
                                                    <button onClick={(e) => { e.stopPropagation(); setAddingTo({ type: 'content', parentId: chapter.id }); }} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.5, padding: '2px' }}><Plus size={12} /></button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDelete('chapter', chapter.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', opacity: 0.6, padding: '2px' }}><Trash2 size={11} /></button>
                                                </div>
                                            </div>

                                            {expandedChapters[chapter.id] && (
                                                <div style={{ marginLeft: '1.5rem', borderLeft: '1px solid var(--gray-200)', paddingLeft: '0.5rem' }}>
                                                    {contentItems.filter(ci => ci.chapter_id === chapter.id).sort((a,b) => a.order - b.order).map((item, ii) => {
                                                        const siblingItems = contentItems.filter(ci => ci.chapter_id === chapter.id).sort((a,b) => a.order - b.order);
                                                        return (
                                                        <div
                                                            key={item.id}
                                                            style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.3rem 0.5rem', borderRadius: '0.5rem', cursor: 'pointer', backgroundColor: selectedItem?.data?.id === item.id ? 'var(--blue-light)' : 'transparent', color: selectedItem?.data?.id === item.id ? 'var(--blue)' : 'var(--gray-600)', fontSize: '0.8rem' }}
                                                        >
                                                            <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden' }} onClick={() => handleSelect('content', item)}>
                                                                {TYPE_ICONS[item.type] || <FileIcon size={14} />}
                                                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' }}>{item.data?.title || 'Untitled'}</span>
                                                            </span>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1px', flexShrink: 0 }}>
                                                                <button onClick={(e) => { e.stopPropagation(); reorderItems('content', siblingItems, siblingItems.findIndex(x => x.id === item.id), -1); }} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.4, padding: '1px' }}><ChevronUp size={11} /></button>
                                                                <button onClick={(e) => { e.stopPropagation(); reorderItems('content', siblingItems, siblingItems.findIndex(x => x.id === item.id), 1); }} style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.4, padding: '1px' }}><ChevronDown size={11} /></button>
                                                                <button onClick={(e) => { e.stopPropagation(); handleDelete('content', item.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', opacity: 0.6, padding: '1px' }}><Trash2 size={11} /></button>
                                                            </div>
                                                        </div>
                                                    )})}
                                                </div>
                                            )}
                                        </div>
                                    )})}
                                </div>
                            )}
                        </div>
                    );
                    })}
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
                                onClick={() => { setGeminiTarget('content'); setShowGemini(true); }}
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
                                                     formState.content_type === 'assignment' ? 'Assignment Prompt' :
                                                     'Markdown / Text Content'}
                                                </label>
                                                <button
                                                    style={{ fontSize: '0.72rem', color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '700' }}
                                                    onClick={() => { setGeminiTarget('content'); setShowGemini(true); }}
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
                                    {/* Preview Section */}
                                    {formState.content.length > 0 && selectedItem.type === 'content' && (
                                        <div style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', backgroundColor: '#F8FAFC' }}>
                                            <h4 style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '1rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                🔍 LOCAL PREVIEW (UNSAVED)
                                                <span style={{ fontSize: '0.7rem', fontWeight: '500', backgroundColor: '#E2E8F0', padding: '2px 8px', borderRadius: '10px' }}>{formState.content.length} chars</span>
                                            </h4>
                                            
                                            {formState.content_type === 'text' && (
                                                <div style={{ padding: '1rem', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.9rem', lineHeight: '1.6', overflowY: 'auto', maxHeight: '300px' }}>
                                                    {formState.content.split('\n').slice(0, 10).map((l, i) => <div key={i}>{l}</div>)}
                                                    {formState.content.split('\n').length > 10 && <div style={{ color: '#94A3B8', marginTop: '4px' }}>... see full content in learner app after saving</div>}
                                                </div>
                                            )}
                                            
                                            {formState.content_type === 'html_sim' && (
                                                <div style={{ height: '300px', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                                                    <iframe 
                                                        srcDoc={formState.content} 
                                                        style={{ width: '100%', height: '100%', border: 'none' }} 
                                                        title="SIM Preview"
                                                    />
                                                </div>
                                            )}

                                            {(formState.content_type === 'quiz' || formState.content_type === 'pyq') && (
                                                <div style={{ backgroundColor: '#1E293B', color: '#818CF8', padding: '1rem', borderRadius: '8px', fontFamily: 'monospace', fontSize: '11px', overflowY: 'auto', maxHeight: '200px' }}>
                                                   {(() => {
                                                       try {
                                                           const p = JSON.parse(formState.content);
                                                           return <span>✅ VALID JSON Found: {Object.keys(p).length} keys</span>
                                                       } catch (e) {
                                                           return <span style={{ color: '#F87171' }}>❌ INVALID JSON: {e.message}</span>
                                                       }
                                                   })()}
                                                </div>
                                            )}
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
