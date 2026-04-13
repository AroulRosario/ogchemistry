import {
    AlertCircle,
    BarChart3,
    BookOpen,
    BookText,
    CheckCircle,
    Compass,
    GraduationCap,
    Map,
    MessageSquare,
    RefreshCw,
    Settings,
    Users,
    Menu,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import AdvancedControls from './components/admin/AdvancedControls';
import AnalyticsOverview from './components/admin/AnalyticsOverview';
import CourseBuilder from './components/admin/CourseBuilder';
import Documentation from './components/admin/Documentation';
import ExploreManager from './components/admin/ExploreManager';
import GradingHub from './components/admin/GradingHub';
import QAModeratorHub from './components/admin/QAModeratorHub';
import SettingsTab from './components/admin/SettingsTab';
import StudentManagement from './components/admin/StudentManagement';
import VisualPathBuilder from './components/admin/VisualPathBuilder';
import { supabase } from './supabase';

function App() {
    const [tab, setTab] = useState('analytics');
    const [lessons, setLessons] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [contentItems, setContentItems] = useState([]);
    const [profiles, setProfiles] = useState([]);

    // UI State
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [notification, setNotification] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    // Selection
    const [selectedLessonId, setSelectedLessonId] = useState('');
    const [selectedChapterId, setSelectedChapterId] = useState('');

    // Forms
    const [lessonTitle, setLessonTitle] = useState('');
    const [lessonDesc, setLessonDesc] = useState('');
    const [chapterTitle, setChapterTitle] = useState('');
    const [contentType, setContentType] = useState('video');

    // Content Inputs (Simplified)
    const [contentUrl, setContentUrl] = useState('');
    const [contentHtml, setContentHtml] = useState('');
    const [contentTitle, setContentTitle] = useState('');
    const [contentJson, setContentJson] = useState(''); // Only for Quiz

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 4000);
    };

    const fetchAll = useCallback(async (isRefresh = false) => {
        setFetching(true);
        try {
            const [l, c, ci, p] = await Promise.all([
                supabase.from('lessons').select('*').order('order'),
                supabase.from('chapters').select('*').order('order'),
                supabase.from('content_items').select('*').order('order'),
                supabase.from('profiles').select('*').order('updated_at', { ascending: false }),
            ]);

            if (l.error) throw l.error;
            if (c.error) throw c.error;
            if (ci.error) throw ci.error;
            if (p.error) throw p.error;

            setLessons(l.data || []);
            setChapters(c.data || []);
            setContentItems(ci.data || []);
            setProfiles(p.data || []);

            if (l.data?.length > 0 && !selectedLessonId) setSelectedLessonId(l.data[0].id);
            if (c.data?.length > 0 && !selectedChapterId) setSelectedChapterId(c.data[0].id);

            if (isRefresh) showNotification('Data synchronized with database');
        } catch (error) {
            console.error('Fetch error:', error);
            showNotification('Failed to fetch data: ' + error.message, 'error');
        } finally {
            setFetching(false);
        }
    }, [selectedLessonId, selectedChapterId]);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    const addLesson = async () => {
        if (!lessonTitle.trim()) return;
        setLoading(true);
        try {
            const { error } = await supabase.from('lessons').insert({
                title: lessonTitle.trim(),
                description: lessonDesc.trim(),
                order: lessons.length
            });
            if (error) throw error;
            showNotification('Lesson module added successfully');
            setLessonTitle('');
            setLessonDesc('');
            await fetchAll();
        } catch (error) {
            showNotification('Failed to add lesson: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const addChapter = async () => {
        if (!chapterTitle.trim() || !selectedLessonId) return;
        setLoading(true);
        try {
            const count = chapters.filter(c => c.lesson_id === selectedLessonId).length;
            const { error } = await supabase.from('chapters').insert({
                lesson_id: selectedLessonId,
                title: chapterTitle.trim(),
                order: count
            });
            if (error) throw error;
            showNotification('Chapter added successfully');
            setChapterTitle('');
            await fetchAll();
        } catch (error) {
            showNotification('Failed to add chapter: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const addContent = async () => {
        if (!selectedChapterId) return;

        let dataToSave = {};

        if (contentType === 'video' || contentType === 'audio') {
            if (!contentUrl.trim()) return showNotification('URL is required', 'error');
            dataToSave = { url: contentUrl.trim(), title: contentTitle.trim() || 'Untitled' };
        } else if (contentType === 'html_sim') {
            if (!contentHtml.trim()) return showNotification('HTML content is required', 'error');
            dataToSave = { html: contentHtml.trim(), title: contentTitle.trim() || 'Simulation' };
        } else if (contentType === 'quiz') {
            try {
                dataToSave = JSON.parse(contentJson);
            } catch (e) {
                return showNotification('Invalid Quiz JSON format', 'error');
            }
        }

        setLoading(true);
        try {
            const count = contentItems.filter(c => c.chapter_id === selectedChapterId).length;
            const { error } = await supabase.from('content_items').insert({
                chapter_id: selectedChapterId,
                type: contentType,
                data: dataToSave,
                order: count
            });
            if (error) throw error;
            showNotification('Content item saved successfully');
            setContentUrl('');
            setContentHtml('');
            setContentTitle('');
            setContentJson('');
            await fetchAll();
        } catch (error) {
            showNotification('Failed to save content: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const updateProfileStatus = async (id, status) => {
        setLoading(true);
        try {
            console.log(`[Admin] Updating profile ${id} status to ${status}...`);
            const { error, data } = await supabase
                .from('profiles')
                .update({ status, updated_at: new Date().toISOString() })
                .eq('id', id)
                .select();

            if (error) throw error;

            console.log('[Admin] Update successful:', data);
            showNotification(`Student status updated successfully to ${status}`);

            // Artificial delay to allow DB consistency/indexing if needed
            await new Promise(r => setTimeout(r, 500));
            await fetchAll();
        } catch (error) {
            console.error('[Admin] Status update failed:', error);
            showNotification('Status update failed: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const updateProfileStat = async (id, field, value) => {
        const newValue = parseInt(prompt(`Enter new value for ${field}:`, value));
        if (isNaN(newValue)) return;

        try {
            setLoading(true);
            const { error } = await supabase.from('profiles').update({ [field]: newValue }).eq('id', id);
            if (error) throw error;
            showNotification(`${field} updated successfully`);
            await fetchAll();
        } catch (error) {
            showNotification('Update failed: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (table, id) => {
        if (!window.confirm('Are you sure you want to delete this permanently?')) return;
        try {
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (error) throw error;
            showNotification('Item deleted successfully');
            await fetchAll();
        } catch (error) {
            showNotification('Delete failed: ' + error.message, 'error');
        }
    };

    const TYPE_EMOJI = { video: '🎥', quiz: '❓', audio: '🎧', html_sim: '🌐' };

    return (
        <div className="admin-root">
            {/* Notifications */}
            {notification && (
                <div className={`notification-toast ${notification.type}`}>
                    {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                    <span>{notification.message}</span>
                </div>
            )}

            <header className="header">
                <div className="logo-container">
                    <img src="/logo.png" className="logo-img" alt="logo" onError={(e) => e.target.src = 'https://via.placeholder.com/48?text=Atom'} />
                    <h1 className="logo-text">OG CHEMISTRY CMD</h1>
                </div>
                <div className="header-actions">
                    <button className={`refresh-btn ${fetching ? 'spinning' : ''}`} onClick={() => fetchAll(true)} disabled={fetching}>
                        <RefreshCw size={18} />
                    </button>
                    <div className="badge badge-approved" style={{ fontSize: '0.75rem', fontWeight: '700' }}>
                        {fetching ? 'SYNCING...' : 'LIVE'}
                    </div>
                </div>
            </header>

            <main className="container" style={{ maxWidth: '100%', paddingLeft: isSidebarCollapsed ? '2rem' : '3rem', paddingRight: '3rem' }}>
                <div className="grid" style={{ gridTemplateColumns: isSidebarCollapsed ? '80px 1fr' : '280px 1fr', transition: 'grid-template-columns 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                    <aside className="tabs-sidebar" style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
                        <div className="card sidebar-dark" style={{ padding: isSidebarCollapsed ? '0.75rem' : '1.5rem', transition: 'padding 0.3s' }}>
                            <div style={{ display: 'flex', justifyContent: isSidebarCollapsed ? 'center' : 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                {!isSidebarCollapsed && (
                                    <h3 style={{ fontSize: '0.8rem', color: '#BFDBFE', letterSpacing: '0.1em', fontWeight: '800', textTransform: 'uppercase', margin: 0 }}>Command Center</h3>
                                )}
                                <button 
                                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '6px', color: 'white', cursor: 'pointer', display: 'flex' }}
                                >
                                    {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                                </button>
                            </div>
                            <div className="tabs">
                                <button className={`tab ${tab === 'analytics' ? 'active' : ''}`} onClick={() => setTab('analytics')} title={isSidebarCollapsed ? "Analytics" : ""}>
                                    <BarChart3 size={18} /> {!isSidebarCollapsed && "Analytics"}
                                </button>
                                <button className={`tab ${tab === 'users' ? 'active' : ''}`} onClick={() => setTab('users')} title={isSidebarCollapsed ? "Students" : ""}>
                                    <Users size={18} /> {!isSidebarCollapsed && "Students"}
                                </button>
                                <button className={`tab ${tab === 'builder' ? 'active' : ''}`} onClick={() => setTab('builder')} title={isSidebarCollapsed ? "Course Builder" : ""}>
                                    <BookOpen size={18} /> {!isSidebarCollapsed && "Course Builder"}
                                </button>
                                <button className={`tab ${tab === 'explore' ? 'active' : ''}`} onClick={() => setTab('explore')} title={isSidebarCollapsed ? "Explore Hub" : ""}>
                                    <Compass size={18} /> {!isSidebarCollapsed && "Explore Hub"}
                                </button>
                                <button className={`tab ${tab === 'visual-path' ? 'active' : ''}`} onClick={() => setTab('visual-path')} title={isSidebarCollapsed ? "Visual Path" : ""}>
                                    <Map size={18} /> {!isSidebarCollapsed && "Visual Path"}
                                </button>
                                <button className={`tab ${tab === 'grading' ? 'active' : ''}`} onClick={() => setTab('grading')} title={isSidebarCollapsed ? "Grading Hub" : ""}>
                                    <GraduationCap size={18} /> {!isSidebarCollapsed && "Grading Hub"}
                                </button>
                                <button className={`tab ${tab === 'qa' ? 'active' : ''}`} onClick={() => setTab('qa')} title={isSidebarCollapsed ? "Q&A Board" : ""}>
                                    <MessageSquare size={18} /> {!isSidebarCollapsed && "Q&A Board"}
                                </button>
                                <button className={`tab ${tab === 'advanced' ? 'active' : ''}`} onClick={() => setTab('advanced')} title={isSidebarCollapsed ? "Advanced" : ""}>
                                    <AlertCircle size={18} /> {!isSidebarCollapsed && "Advanced"}
                                </button>
                                <button className={`tab ${tab === 'settings' ? 'active' : ''}`} onClick={() => setTab('settings')} title={isSidebarCollapsed ? "Settings" : ""}>
                                    <Settings size={18} /> {!isSidebarCollapsed && "Settings"}
                                </button>
                                <button 
                                    className={`tab ${tab === 'docs' ? 'active' : ''}`} 
                                    onClick={() => setTab('docs')} 
                                    style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}
                                    title={isSidebarCollapsed ? "HELP & GUIDE" : ""}
                                >
                                    <BookText size={18} color="#BFDBFE" /> {!isSidebarCollapsed && "HELP & GUIDE"}
                                </button>
                            </div>
                        </div>

                        {!isSidebarCollapsed && (
                            <div className="card sidebar-dark fade-in" style={{ padding: '1.25rem', marginTop: '1.5rem' }}>
                                <h4 style={{ color: '#BFDBFE', fontSize: '0.75rem', fontWeight: '700', marginBottom: '1rem', textTransform: 'uppercase' }}>Fleet Status</h4>
                                <div className="stats-list" style={{ fontSize: '0.9rem', color: 'var(--white)' }}>
                                    <div className="stat-item" style={{ marginBottom: '0.6rem', display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#BFDBFE', fontWeight: '500' }}>Active Users</span>
                                        <span style={{ fontWeight: '700' }}>{profiles.length}</span>
                                    </div>
                                    <div className="stat-item" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ color: '#BFDBFE', fontWeight: '500' }}>Pending Approval</span>
                                        <span style={{ fontWeight: '700', color: profiles.some(p => !p.approved) ? '#FCA5A5' : 'inherit' }}>
                                            {profiles.filter(p => !p.approved).length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </aside>

                    <section className="main-content">
                        {tab === 'analytics' && <AnalyticsOverview />}
                        {tab === 'users' && <StudentManagement profiles={profiles} fetchAll={fetchAll} showNotification={showNotification} />}
                        {tab === 'builder' && <CourseBuilder lessons={lessons} chapters={chapters} contentItems={contentItems} fetchAll={fetchAll} showNotification={showNotification} />}
                        {tab === 'explore' && <ExploreManager lessons={lessons} fetchAll={fetchAll} showNotification={showNotification} setTab={setTab} />}
                        {tab === 'visual-path' && <VisualPathBuilder lessons={lessons} chapters={chapters} showNotification={showNotification} />}
                        {tab === 'grading' && <GradingHub showNotification={showNotification} />}
                        {tab === 'qa' && <QAModeratorHub showNotification={showNotification} />}
                        {tab === 'advanced' && <AdvancedControls showNotification={showNotification} />}
                        {tab === 'settings' && <SettingsTab showNotification={showNotification} />}
                        {tab === 'docs' && <Documentation />}
                    </section>
                </div>
            </main >
        </div >
    );
}

export default App;
