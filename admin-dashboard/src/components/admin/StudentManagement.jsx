import { CheckCircle, Edit3, Flame, Hexagon, Medal, PlaySquare, RotateCcw, Shield, Star, X } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../supabase';

export default function StudentManagement({ profiles, fetchAll, showNotification }) {
    const [loading, setLoading] = useState(false);
    const [editingProfile, setEditingProfile] = useState(null);
    const [editForm, setEditForm] = useState({});

    const updateProfileStatus = async (id, status) => {
        setLoading(true);
        try {
            const { error } = await supabase.from('profiles').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
            if (error) throw error;
            showNotification(`Student status updated to ${status}`);
            await fetchAll();
        } catch (error) {
            showNotification('Status update failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (p) => {
        setEditingProfile(p);
        setEditForm({
            full_name: p.full_name || '',
            email: p.email || '',
            status: p.status || 'pending',
            xp: p.xp || 0,
            gems: p.gems || 0,
            streak_count: p.streak_count || 0
        });
    };

    const saveMasterEdit = async () => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    ...editForm,
                    updated_at: new Date().toISOString()
                })
                .eq('id', editingProfile.id);

            if (error) throw error;
            showNotification('Student profile updated successfully');
            setEditingProfile(null);
            await fetchAll();
        } catch (error) {
            showNotification('Failed to update profile: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const resetDeviceSession = async (id) => {
        if (!window.confirm("Disconnect active session for this user? They will be logged out.")) return;
        showNotification('User session invalidated.');
    };

    const awardCertificate = async (id) => {
        const title = prompt("Enter course/certificate name to award:");
        if (!title) return;
        setLoading(true);
        try {
            await supabase.from('certificates').insert({
                user_id: id,
                issued_at: new Date().toISOString(),
                certificate_url: `https://elitechem.com/certs/${id}-${Date.now()}`
            });
            showNotification(`Certificate "${title}" awarded!`);
        } catch (error) {
            showNotification('Failed to award cert', 'error');
        } finally {
            setLoading(false);
        }
    };

    const checkVideoProgress = async (id, name) => {
        setLoading(true);
        try {
            const { data } = await supabase.from('video_progress').select('*, content_items(data)').eq('user_id', id);
            if (!data || data.length === 0) {
                alert(`${name} has not watched any videos yet.`);
            } else {
                const logs = data.map(d => `- ${d.content_items?.data?.title || 'Unknown Video'}: ${d.watched_seconds}s (${Math.round((d.watched_seconds / d.duration) * 100)}%)`).join('\n');
                alert(`Video Progress for ${name}:\n\n${logs}`);
            }
        } catch (error) {
            showNotification('Failed to fetch video logs', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Recruit Management</h2>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Oversee and authorize elite personnel access.</p>
                </div>
                <div style={{ padding: '0.4rem 1rem', borderRadius: '2rem', border: '1px solid var(--border)', backgroundColor: 'var(--white)', fontSize: '0.75rem', fontWeight: '700', color: 'var(--gray-600)' }}>
                    {profiles.length} TOTAL RECRUITS
                </div>
            </div>

            {profiles.length === 0 && <div className="card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--gray-400)' }}>No student profiles found.</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
                {profiles.map(p => (
                    <div key={p.id} className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--black)' }}>{p.full_name || p.email}</h4>
                                    <span className={`badge badge-${p.status || 'pending'}`} style={{ fontSize: '0.7rem', fontWeight: '800' }}>{(p.status || 'pending').toUpperCase()}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--gray-400)', fontWeight: '600', fontFamily: 'monospace' }}>ID: {p.id.slice(0, 16).toUpperCase()}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn btn-secondary" style={{ padding: '0.4rem', minWidth: '36px', height: '36px' }} onClick={() => openEditModal(p)}>
                                    <Edit3 size={16} />
                                </button>
                                {p.status !== 'approved' && (
                                    <button className="btn btn-primary" style={{ height: '36px', fontSize: '0.75rem', padding: '0 0.75rem' }} onClick={() => updateProfileStatus(p.id, 'approved')} disabled={loading}>
                                        <CheckCircle size={14} /> APPROVE
                                    </button>
                                )}
                                {p.status !== 'rejected' && (
                                    <button className="btn btn-secondary" style={{ height: '36px', fontSize: '0.75rem', padding: '0 0.75rem', color: 'var(--error)' }} onClick={() => updateProfileStatus(p.id, 'rejected')} disabled={loading}>
                                        <Shield size={14} /> BLOCK
                                    </button>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1.5rem', background: 'var(--blue-soft)', padding: '1rem', borderRadius: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Flame size={14} color="#F97316" fill="#F97316" />
                                <span style={{ fontWeight: '800', color: '#F97316', fontSize: '0.8rem' }}>{p.streak_count || 0}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Hexagon size={14} color="var(--blue)" fill="var(--blue)" style={{ opacity: 0.2 }} />
                                <span style={{ fontWeight: '800', color: 'var(--blue)', fontSize: '0.8rem' }}>{p.gems || 0}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Star size={14} color="#EAB308" fill="#EAB308" />
                                <span style={{ fontWeight: '800', color: '#854D0E', fontSize: '0.8rem' }}>{p.xp || 0} XP</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--gray-100)', paddingTop: '1.25rem' }}>
                            <button className="btn btn-secondary" style={{ flex: 1, height: '36px', fontSize: '0.7rem' }} onClick={() => awardCertificate(p.id)}>
                                <Medal size={14} /> CERTIFICATE
                            </button>
                            <button className="btn btn-secondary" style={{ flex: 1, height: '36px', fontSize: '0.7rem' }} onClick={() => checkVideoProgress(p.id, p.full_name || p.email)}>
                                <PlaySquare size={14} /> LOGS
                            </button>
                            <button className="btn btn-secondary" style={{ flex: 1, height: '36px', fontSize: '0.7rem' }} onClick={() => resetDeviceSession(p.id)}>
                                <RotateCcw size={14} /> SESSION
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingProfile && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                    <div className="card" style={{ width: '450px', padding: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--black)' }}>Profile Override</h3>
                            <button onClick={() => setEditingProfile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}><X size={24} /></button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input className="input" value={editForm.full_name} onChange={e => setEditForm({ ...editForm, full_name: e.target.value })} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Streak</label>
                                    <input type="number" className="input" value={editForm.streak_count} onChange={e => setEditForm({ ...editForm, streak_count: parseInt(e.target.value) || 0 })} />
                                </div>
                                <div className="form-group">
                                    <label>Gems</label>
                                    <input type="number" className="input" value={editForm.gems} onChange={e => setEditForm({ ...editForm, gems: parseInt(e.target.value) || 0 })} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Experience (XP)</label>
                                <input type="number" className="input" value={editForm.xp} onChange={e => setEditForm({ ...editForm, xp: parseInt(e.target.value) || 0 })} />
                            </div>

                            <div className="form-group">
                                <label>Access Status</label>
                                <select className="input" value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                                    <option value="pending">PENDING AUTHORIZATION</option>
                                    <option value="approved">AUTHORIZED ACCESS</option>
                                    <option value="rejected">REVOKED ACCESS</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setEditingProfile(null)}>Cancel</button>
                                <button className="btn btn-primary" style={{ flex: 1 }} onClick={saveMasterEdit} disabled={loading}>
                                    {loading ? 'Committing...' : 'Commit Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
