import { FileText, RefreshCw, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';

export default function GradingHub({ showNotification }) {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [score, setScore] = useState('');
    const [feedback, setFeedback] = useState('');
    const [submittingGrade, setSubmittingGrade] = useState(false);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const { data } = await supabase
                .from('assignment_submissions')
                .select('*, assignments(title, description, passing_score), profiles:user_id(full_name, email)')
                .order('submitted_at', { ascending: false });

            if (data) setSubmissions(data);
        } catch (error) {
            console.error('Failed to fetch submissions:', error);
            showNotification('Failed to fetch subs', 'error');
        } finally {
            setLoading(false);
        }
    };

    const submitGrade = async () => {
        if (!selectedSubmission || !score) return;
        setSubmittingGrade(true);

        try {
            const newScore = parseInt(score);

            // Validate passing
            const passing = selectedSubmission.assignments.passing_score;
            const isPassing = newScore >= passing;

            // 1. Update the submission
            const { error: subErr } = await supabase.from('assignment_submissions').update({
                score: newScore,
                feedback,
                status: 'graded'
            }).eq('id', selectedSubmission.id);

            if (subErr) throw subErr;

            // 2. Notify the user
            await supabase.from('notifications').insert({
                user_id: selectedSubmission.user_id,
                title: 'Assignment Graded',
                message: `Your assignment "${selectedSubmission.assignments.title}" has been graded. Score: ${newScore}/${passing}`,
                type: 'assignment'
            });

            // 3. Mark progress if passing (Optional logic)
            if (isPassing) {
                await supabase.from('user_progress').upsert({
                    user_id: selectedSubmission.user_id,
                    content_item_id: selectedSubmission.assignments.content_item_id, // We'd need to fetch this or assume existence
                    status: 'completed',
                    score: newScore,
                    completed_at: new Date().toISOString()
                }, { onConflict: 'user_id,content_item_id' });
            }

            showNotification('Grade submitted successfully');
            setSelectedSubmission(null);
            setScore('');
            setFeedback('');
            fetchSubmissions();

        } catch (error) {
            console.error(error);
            showNotification('Failed to submit grade', 'error');
        } finally {
            setSubmittingGrade(false);
        }
    };

    if (loading) {
        return (
            <div className="fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
                <RefreshCw className="spinning" size={32} color="#2563EB" />
                <p style={{ marginTop: '1rem', color: '#64748B', fontFamily: 'System', fontWeight: 600 }}>Loading Submissions...</p>
            </div>
        );
    }

    const pending = submissions.filter(s => s.status === 'submitted');
    const graded = submissions.filter(s => s.status === 'graded');

    return (
        <div className="fade-in">
            <div className="section-header" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <h2 className="bangers" style={{ fontSize: '2rem', margin: 0, color: 'var(--comic-navy)' }}>GRADING HUB</h2>
                <div className="badge badge-pending" style={{ padding: '0.5rem 1rem', fontSize: '1rem', border: '1px solid #E5E7EB', borderRadius: '12px' }}>{pending.length} TO REVIEW</div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 300 }}>
                    <div className="comic-card" style={{ padding: '1.5rem', marginBottom: '2rem', background: 'var(--comic-white)' }}>
                        <h3 className="bangers" style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--comic-cyan)' }}>PENDING REVIEW</h3>
                        {pending.length === 0 ? <p className="bangers" style={{ fontSize: '1.25rem', color: '#64748B' }}>Inbox zero! Great job.</p> : null}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {pending.map(sub => (
                                <div key={sub.id}
                                    onClick={() => { setSelectedSubmission(sub); setScore(''); setFeedback(''); }}
                                    style={{
                                        padding: '1rem 1.25rem',
                                        borderRadius: '12px',
                                        border: `1px solid ${selectedSubmission?.id === sub.id ? 'var(--comic-cyan)' : '#E5E7EB'}`,
                                        backgroundColor: selectedSubmission?.id === sub.id ? 'var(--blue-light)' : 'var(--comic-white)',
                                        color: 'var(--comic-navy)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: selectedSubmission?.id === sub.id ? '0 4px 12px rgba(37, 99, 235, 0.1)' : 'none',
                                    }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <h4 className="bangers" style={{ margin: 0, fontSize: '1.25rem' }}>{sub.profiles?.full_name || sub.profiles?.email}</h4>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 900, opacity: 0.8 }}>{new Date(sub.submitted_at).toLocaleDateString()}</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>{sub.assignments?.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="comic-card" style={{ padding: '1.5rem', background: 'var(--comic-white)' }}>
                        <h3 className="bangers" style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: 'var(--comic-orange)' }}>RECENTLY GRADED</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {graded.slice(0, 5).map(sub => (
                                <div key={sub.id} style={{ padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#F0FDF4' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <h4 className="bangers" style={{ margin: 0, fontSize: '1.1rem', color: 'var(--comic-navy)' }}>{sub.profiles?.full_name || sub.profiles?.email}</h4>
                                        <span style={{ fontSize: '1rem', color: '#059669', fontWeight: 900 }}>{sub.score}/100</span>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#065F46', fontWeight: 800 }}>{sub.assignments?.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ flex: 1.5, minWidth: 400 }}>
                    {selectedSubmission ? (
                        <div className="comic-card" style={{ padding: '2.5rem', background: 'var(--comic-white)', position: 'sticky', top: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #E5E7EB' }}>
                                <div style={{ width: 56, height: 56, borderRadius: '12px', border: '1px solid var(--comic-cyan)', backgroundColor: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FileText color="var(--comic-cyan)" size={28} />
                                </div>
                                <div>
                                    <h3 className="bangers" style={{ margin: 0, fontSize: '2rem', color: 'var(--comic-navy)' }}>{selectedSubmission.assignments?.title}</h3>
                                    <p className="bangers" style={{ margin: 0, color: '#64748B', fontSize: '1.2rem' }}>By {selectedSubmission.profiles?.full_name || selectedSubmission.profiles?.email}</p>
                                </div>
                            </div>

                            <div style={{ marginBottom: '2.5rem' }}>
                                <h4 className="bangers" style={{ fontSize: '1.25rem', color: 'var(--comic-navy)', marginBottom: '0.75rem' }}>STUDENT SUBMISSION</h4>
                                <div className="comic-card" style={{ padding: '1.5rem', background: '#F9FAFB', borderStyle: 'solid', borderColor: '#E5E7EB', minHeight: '200px', boxShadow: 'none' }}>
                                    <p style={{ margin: 0, color: '#334155', lineHeight: '1.6', fontSize: '1rem', fontWeight: 500, whiteSpace: 'pre-wrap' }}>{selectedSubmission.content}</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '2.5rem' }}>
                                <div>
                                    <h4 className="bangers" style={{ fontSize: '1.25rem', color: 'var(--comic-navy)', marginBottom: '0.75rem' }}>SCORE (/100)</h4>
                                    <input
                                        type="number"
                                        className="comic-input"
                                        style={{ width: '100%', fontSize: '1.25rem', fontWeight: 700, padding: '0.75rem' }}
                                        placeholder="e.g. 95"
                                        value={score}
                                        onChange={(e) => setScore(e.target.value)}
                                    />
                                    <p className="bangers" style={{ fontSize: '1rem', color: 'var(--comic-orange)', marginTop: '0.75rem' }}>PASSING: {selectedSubmission.assignments?.passing_score}</p>
                                </div>
                                <div>
                                    <h4 className="bangers" style={{ fontSize: '1.25rem', color: 'var(--comic-navy)', marginBottom: '0.75rem' }}>FEEDBACK (OPTIONAL)</h4>
                                    <textarea
                                        className="comic-input"
                                        style={{ width: '100%', height: '120px', resize: 'none', fontWeight: 700 }}
                                        placeholder="Great job explaining the mechanics..."
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                className="comic-btn comic-btn-primary"
                                style={{ width: '100%', fontSize: '1.25rem', padding: '1rem', border: 'none' }}
                                onClick={submitGrade}
                                disabled={submittingGrade || !score}
                            >
                                {submittingGrade ? <RefreshCw className="spinning" size={20} /> : <Send size={20} />}
                                {submittingGrade ? 'SUBMITTING...' : 'PUBLISH GRADE'}
                            </button>
                        </div>
                    ) : (
                        <div className="comic-card" style={{ padding: '5rem 2rem', textAlign: 'center', backgroundColor: '#F9FAFB', border: '2px dashed #E5E7EB', boxShadow: 'none' }}>
                            <FileText color="#94A3B8" size={64} style={{ margin: '0 auto 1.5rem', opacity: 0.5 }} />
                            <h3 className="bangers" style={{ margin: 0, color: '#64748B', fontSize: '2rem' }}>NO SELECTION</h3>
                            <p style={{ color: '#94A3B8', fontSize: '1.1rem', marginTop: '1rem', fontWeight: 500 }}>Pick a student from the left to start the review process!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
