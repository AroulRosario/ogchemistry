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
            showNotification(`Student status updated to ${status} `);
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
        // Mock session wipe action
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
            <div className="section-header">
                <h2 className="bangers" style={{ fontSize: '2.5rem', color: '#1E293B' }}>STUDENT MANAGEMENT</h2>
                <div className="badge badge-approved">{profiles.length} TOTAL STUDENTS</div>
            </div>

            {profiles.length === 0 && <div className="empty-state">No student profiles found.</div>}

            <div className="student-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '2rem' }}>
                {profiles.map(p => (
                    <div key={p.id} className="card student-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--white)', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                    <h4 className="bangers" style={{ margin: 0, fontSize: '1.6rem', color: 'var(--black)', letterSpacing: '-0.02em' }}>{p.full_name || p.email}</h4>
                                    <span className={`badge badge-${p.status || 'pending'}`} style={{ fontWeight: 800 }}>{p.status || 'pending'}</span>
                                </div>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>USER_ID: {p.id.slice(0, 12)}... | JOINED: {new Date(p.updated_at).toLocaleDateString()}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="action-btn" style={{ padding: '0.6rem', border: '1px solid var(--border)', borderRadius: '0.75rem', color: 'var(--blue)' }} onClick={() => openEditModal(p)}>
                                    <Edit3 size={18} />
                                </button>
                                {p.status !== 'approved' && (
                                    <button className="action-btn btn-approve" style={{ padding: '0.6rem 1.2rem', fontWeight: 800 }} onClick={() => updateProfileStatus(p.id, 'approved')} disabled={loading}>
                                        <CheckCircle size={18} /> APPROVE
                                    </button>
                                )}
                                {p.status !== 'rejected' && (
                                    <button className="action-btn btn-delete" style={{ padding: '0.6rem 1.2rem', fontWeight: 800 }} onClick={() => updateProfileStatus(p.id, 'rejected')} disabled={loading}>
                                        <Shield size={18} /> BLOCK
                                    </button>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1.5rem', background: 'var(--surface)', padding: '1.25rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                            <div className="stat-pill" onClick={() => updateProfileStat(p.id, 'streak_count', p.streak_count || 0)} style={{ background: 'var(--white)' }}>
                                <Flame size={18} color="#F97316" fill="#F97316" />
                                <span style={{ fontWeight: 800, color: '#F97316' }}>{p.streak_count || 0} STREAK</span>
                            </div>
                            <div className="stat-pill" onClick={() => updateProfileStat(p.id, 'gems', p.gems || 0)} style={{ background: 'var(--white)' }}>
                                <Hexagon size={18} color="var(--blue)" fill="var(--blue)22" />
                                <span style={{ fontWeight: 800, color: 'var(--blue)' }}>{p.gems || 0} GEMS</span>
                            </div>
                            <div className="stat-pill" onClick={() => updateProfileStat(p.id, 'xp', p.xp || 0)} style={{ background: 'var(--white)' }}>
                                <Star size={18} color="#EAB308" fill="#EAB308" />
                                <span style={{ fontWeight: 800, color: '#854D0E' }}>{p.xp || 0} XP</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                            <button className="btn btn-secondary" style={{ flex: 1, height: '44px', fontSize: '0.85rem', background: '#F8FAFC', border: '1px solid var(--border)', color: 'var(--black)' }} onClick={() => awardCertificate(p.id)}>
                                <Medal size={16} /> AWARD CERT
                            </button>
                            <button className="btn" style={{ flex: 1, height: '44px', fontSize: '0.85rem', background: 'var(--blue)', color: 'white' }} onClick={() => checkVideoProgress(p.id, p.full_name || p.email)}>
                                <PlaySquare size={16} /> VIDEO LOGS
                            </button>
                            <button className="btn" style={{ flex: 1, height: '44px', fontSize: '0.85rem', background: 'rgba(0,0,0,0.03)', color: '#64748B', border: '1px dashed #CBD5E1' }} onClick={() => resetDeviceSession(p.id)}>
                                <RotateCcw size={16} /> WIPE SESSION
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingProfile && (
                <div className="modal-overlay">
                    <div className="card modal-card" style={{ width: '500px', padding: '2.5rem', position: 'relative' }}>
                        <button className="close-btn" onClick={() => setEditingProfile(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', border: 'none', background: 'none', cursor: 'pointer' }}>
                            <X size={24} color="#64748B" />
                        </button>

                        <h3 className="bangers" style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>MASTER PROFILE EDITOR</h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label>FULL NAME</label>
                                <input className="input" value={editForm.full_name} onChange={e => setEditForm({ ...editForm, full_name: e.target.value })} />
                            </div>

                            <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label>STREAK</label>
                                    <input type="number" className="input" value={editForm.streak_count} onChange={e => setEditForm({ ...editForm, streak_count: parseInt(e.target.value) || 0 })} />
                                </div>
                                <div>
                                    <label>GEMS</label>
                                    <input type="number" className="input" value={editForm.gems} onChange={e => setEditForm({ ...editForm, gems: parseInt(e.target.value) || 0 })} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>XP POINTS</label>
                                <input type="number" className="input" value={editForm.xp} onChange={e => setEditForm({ ...editForm, xp: parseInt(e.target.value) || 0 })} />
                            </div>

                            <div className="form-group">
                                <label>ACCOUNT STATUS</label>
                                <select className="input" value={editForm.status} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
                                    <option value="pending">PENDING</option>
                                    <option value="approved">APPROVED</option>
                                    <option value="rejected">REJECTED</option>
                                </select>
                            </div>

                            <button className="btn btn-primary" style={{ marginTop: '1rem', height: '56px', fontSize: '1.1rem' }} onClick={saveMasterEdit} disabled={loading}>
                                {loading ? 'SAVING CHANGES...' : 'COMMIT MASTER OVERRIDE'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
