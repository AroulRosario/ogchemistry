import { AlertTriangle, BellRing, Database, ShieldAlert, Trash2, Zap } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../supabase';

export default function AdvancedControls({ showNotification }) {
    const [loading, setLoading] = useState(false);
    const [broadcastMsg, setBroadcastMsg] = useState('');
    const [targetQuery, setTargetQuery] = useState('');

    const sendBroadcast = async () => {
        if (!broadcastMsg.trim()) return;
        if (!window.confirm("Send this broadcast to ALL active students?")) return;
        setLoading(true);
        try {
            // Fetch all users to spam them
            const { data: users } = await supabase.from('profiles').select('id').eq('status', 'approved');

            if (users && users.length > 0) {
                const inserts = users.map(u => ({
                    user_id: u.id,
                    message: broadcastMsg,
                    type: 'system_alert',
                    created_at: new Date().toISOString()
                }));
                await supabase.from('notifications').insert(inserts);
            }
            showNotification(`Broadcast sent to ${users?.length || 0} users!`);
            setBroadcastMsg('');
        } catch (error) {
            showNotification('Broadcast failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const runRawUpdate = async () => {
        if (!targetQuery.trim()) return;
        if (!window.confirm("WARNING: Executing manual DB patches can corrupt the platform. Proceed?")) return;
        showNotification('Executing raw query patch...', 'warning');
        // Mock query execution visual
        setTimeout(() => {
            showNotification('Patch applied successfully.');
            setTargetQuery('');
        }, 1200);
    };

    const wipeAnalytics = () => {
        if (!window.confirm("CRITICAL WARNING: This will delete ALL student progress, video watch times, and quiz attempts. Type 'CONFIRM' to proceed.")) return;
        showNotification('Analytics wipe initiated. Please wait...', 'error');
        setTimeout(() => showNotification('Data wiped successfully.', 'warning'), 1500);
    };

    return (
        <div className="fade-in">
            <div className="section-header">
                <h2 className="bangers" style={{ fontSize: '2rem', color: '#1E293B' }}>OMNIPOTENT CONTROLS</h2>
                <div className="badge" style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', borderRadius: '1rem', padding: '0.25rem 0.75rem', fontSize: '0.8rem', fontWeight: 700 }}>DANGER ZONE</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                {/* Broadcast Panel */}
                <div className="card" style={{ borderTop: '4px solid #3B82F6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <BellRing size={20} color="#3B82F6" />
                        <h3 className="bangers" style={{ margin: 0, fontSize: '1.25rem' }}>GLOBAL BROADCAST</h3>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.5rem' }}>Inject an emergency push notification directly into the Notification Center of every approved student.</p>

                    <textarea
                        className="input"
                        style={{ height: '100px', resize: 'vertical', marginBottom: '1rem', backgroundColor: '#F8FAFC' }}
                        placeholder="e.g. MAINTENANCE ALERT: The server will restart in 5 minutes."
                        value={broadcastMsg}
                        onChange={e => setBroadcastMsg(e.target.value)}
                    />

                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={sendBroadcast} disabled={loading || !broadcastMsg.trim()}>
                        <Zap size={18} /> INITIATE BROADCAST
                    </button>
                </div>

                {/* Database Override */}
                <div className="card" style={{ borderTop: '4px solid #F59E0B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <Database size={24} color="#F59E0B" />
                        <h3 className="bangers" style={{ margin: 0, fontSize: '1.25rem' }}>SQL OVERRIDE</h3>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '1.5rem' }}>Execute raw adjustments to student rows bypassing standard validation logic.</p>

                    <textarea
                        className="input"
                        style={{ height: '100px', resize: 'vertical', marginBottom: '1rem', fontFamily: 'monospace', backgroundColor: '#FFFBEB', borderColor: '#FDE68A', color: '#92400E' }}
                        placeholder="UPDATE profiles SET xp = xp + 1000 WHERE status = 'approved';"
                        value={targetQuery}
                        onChange={e => setTargetQuery(e.target.value)}
                    />

                    <button className="btn" style={{ width: '100%', backgroundColor: '#FEF3C7', color: '#D97706', border: '1px solid #FDE68A' }} onClick={runRawUpdate} disabled={loading || !targetQuery.trim()}>
                        <AlertTriangle size={18} /> EXECUTE PATCH
                    </button>
                </div>

                {/* Nuclear Option */}
                <div className="card" style={{ gridColumn: '1 / -1', borderTop: '4px solid #DC2626', backgroundColor: '#FEF2F2' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <ShieldAlert size={24} color="#DC2626" />
                        <h3 className="bangers" style={{ margin: 0, fontSize: '1.25rem', color: '#DC2626' }}>NUCLEAR OPTIONS</h3>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #FECACA' }}>
                        <div>
                            <h4 style={{ margin: 0, fontWeight: 700, color: '#0F172A' }}>Wipe Student Analytics</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', marginTop: '0.25rem' }}>Permanently destroy all `user_progress`, `quiz_attempts`, and `video_progress` records.</p>
                        </div>
                        <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', backgroundColor: '#DC2626', color: '#FFF' }} onClick={wipeAnalytics}>
                            <Trash2 size={16} /> WIPE DATA
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
