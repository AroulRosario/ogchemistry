import { CheckCircle, MessageSquare, RefreshCw, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';

export default function QAModeratorHub({ showNotification }) {
    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchDiscussions();
    }, []);

    const fetchDiscussions = async () => {
        setLoading(true);
        try {
            const { data } = await supabase
                .from('discussions')
                .select('*, content_items(data), profiles:user_id(full_name, email), discussion_replies(*)')
                .order('created_at', { ascending: false });

            if (data) setDiscussions(data);
        } catch (error) {
            console.error('Failed to fetch Q&A:', error);
            showNotification('Failed to fetch Q&A', 'error');
        } finally {
            setLoading(false);
        }
    };

    const submitReply = async (discussionId) => {
        const text = replyText[discussionId];
        if (!text || !text.trim()) return;

        setSubmitting(true);
        try {
            // Needs admin user id. We assume admin is currently logged in.
            const { data: { session } } = await supabase.auth.getSession();
            const adminId = session?.user?.id;

            if (!adminId) throw new Error("Not authenticated");

            await supabase.from('discussion_replies').insert({
                discussion_id: discussionId,
                user_id: adminId,
                body: text.trim(),
                is_official_answer: true
            });

            // Notify the original asker
            const discussion = discussions.find(d => d.id === discussionId);
            if (discussion) {
                await supabase.from('notifications').insert({
                    user_id: discussion.user_id,
                    title: 'New Reply to Your Question',
                    message: `An instructor has replied to your question on "${discussion.content_items?.data?.title}".`,
                    type: 'discussion'
                });
            }

            showNotification('Reply posted successfully');
            setReplyText(prev => ({ ...prev, [discussionId]: '' }));
            fetchDiscussions();
        } catch (error) {
            console.error(error);
            showNotification('Failed to post reply', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
                <RefreshCw className="spinning" size={32} color="#2563EB" />
                <p style={{ marginTop: '1rem', color: '#64748B', fontFamily: 'System', fontWeight: 600 }}>Loading Q&A...</p>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div className="section-header" style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <h2 className="bangers" style={{ fontSize: '2rem', margin: 0, color: 'var(--comic-navy)' }}>Q&A HUB</h2>
                <div className="badge badge-approved" style={{ padding: '0.4rem 0.8rem', fontSize: '1rem', border: '1px solid #E5E7EB', borderRadius: '12px' }}>{discussions.length} THREADS</div>
            </div>

            <div style={{ display: 'grid', gap: '2rem' }}>
                {discussions.map(discussion => {
                    const hasOfficialReply = discussion.discussion_replies?.some(r => r.is_official_answer);

                    return (
                        <div key={discussion.id} className="comic-card" style={{ padding: '2rem', background: 'var(--comic-white)', borderLeft: hasOfficialReply ? '8px solid var(--comic-cyan)' : '8px solid var(--comic-orange)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                                    <div style={{ width: 44, height: 44, borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <MessageSquare color="var(--comic-navy)" size={20} />
                                    </div>
                                    <div>
                                        <h4 className="bangers" style={{ margin: 0, fontSize: '1.25rem', color: 'var(--comic-navy)' }}>{discussion.profiles?.full_name || discussion.profiles?.email}</h4>
                                        <p style={{ margin: 0, color: '#64748B', fontSize: '0.9rem', fontWeight: 600 }}>ON {discussion.content_items?.data?.title} • {new Date(discussion.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                {hasOfficialReply && <div className="badge badge-approved" style={{ border: '1px solid currentColor', fontSize: '0.75rem', fontWeight: 700 }}><CheckCircle size={12} style={{ marginRight: 6 }} /> ANSWERED</div>}
                            </div>

                            <p style={{ fontSize: '1.1rem', color: 'var(--comic-navy)', lineHeight: '1.6', marginBottom: '2rem', fontWeight: 500, padding: '1.5rem', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                                {discussion.body}
                            </p>

                            {discussion.discussion_replies?.length > 0 && (
                                <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', paddingLeft: '1.5rem', borderLeft: '4px solid var(--comic-cyan)' }}>
                                    {discussion.discussion_replies.map(reply => (
                                        <div key={reply.id} style={{ padding: '1.25rem', borderRadius: '12px', backgroundColor: reply.is_official_answer ? '#FEF9C3' : 'var(--comic-white)', border: '1px solid #E5E7EB' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span className="bangers" style={{ fontSize: '1.1rem', color: 'var(--comic-navy)' }}>
                                                    {reply.is_official_answer ? '👨‍🏫 INSTRUCTOR ANSWER' : 'STUDENT REPLIED'}
                                                </span>
                                            </div>
                                            <p style={{ margin: 0, color: 'var(--comic-navy)', fontSize: '1rem', fontWeight: 800 }}>{reply.body}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
                                <input
                                    className="comic-input"
                                    style={{ flex: 1 }}
                                    placeholder="Write an official answer..."
                                    value={replyText[discussion.id] || ''}
                                    onChange={(e) => setReplyText(prev => ({ ...prev, [discussion.id]: e.target.value }))}
                                    disabled={submitting}
                                />
                                <button className="comic-btn" style={{ padding: '0.5rem 1.75rem', fontSize: '1.1rem', border: 'none' }} onClick={() => submitReply(discussion.id)} disabled={submitting || !replyText[discussion.id]?.trim()}>
                                    <Send size={20} /> REPLY
                                </button>
                            </div>
                        </div>
                    );
                })}

                {discussions.length === 0 && (
                    <div className="comic-card" style={{ padding: '5rem', textAlign: 'center', backgroundColor: '#F9FAFB', border: '2px dashed #E5E7EB', boxShadow: 'none' }}>
                        <MessageSquare color="#94A3B8" size={64} style={{ margin: '0 auto 1.5rem', opacity: 0.5 }} />
                        <h3 className="bangers" style={{ margin: 0, color: '#64748B', fontSize: '2rem' }}>NO QUESTIONS YET</h3>
                        <p style={{ color: '#94A3B8', fontSize: '1.1rem', marginTop: '1rem', fontWeight: 500 }}>When students ask questions on content, they will appear here!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
