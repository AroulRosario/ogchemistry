import { Palette, Save, Shield } from 'lucide-react';
import { useState } from 'react';

export default function SettingsTab({ showNotification }) {
    const [saving, setSaving] = useState(false);

    // In a real app these would be fetched from a 'settings' table
    const [settings, setSettings] = useState({
        appName: 'OG CHEMISTRY',
        primaryColor: '#2563EB',
        allowSignups: true,
        requireApproval: true,
        enableGamification: true
    });

    const handleSave = async () => {
        setSaving(true);
        try {
            // Mock saving delay
            await new Promise(r => setTimeout(r, 800));
            showNotification('Settings saved successfully');
        } catch (error) {
            showNotification('Failed to save settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fade-in">
            <div className="section-header">
                <h2 className="bangers" style={{ fontSize: '1.75rem' }}>PLATFORM SETTINGS</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                        <Palette color="var(--blue)" size={20} />
                        <h3 className="bangers" style={{ fontSize: '1.1rem', margin: 0, color: '#64748B' }}>BRANDING</h3>
                    </div>

                    <div className="form-group">
                        <label>PLATFORM NAME</label>
                        <input className="input" value={settings.appName} onChange={e => setSettings({ ...settings, appName: e.target.value })} />
                    </div>

                    <div className="form-group">
                        <label>PRIMARY ACCENT COLOR</label>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <input type="color" value={settings.primaryColor} onChange={e => setSettings({ ...settings, primaryColor: e.target.value })} style={{ width: 50, height: 50, padding: 0, border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                            <input className="input" style={{ flex: 1, fontFamily: 'monospace' }} value={settings.primaryColor} onChange={e => setSettings({ ...settings, primaryColor: e.target.value })} />
                        </div>
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                        <Shield color="#EA580C" size={20} />
                        <h3 className="bangers" style={{ fontSize: '1.1rem', margin: 0, color: '#64748B' }}>SECURITY & FEATURES</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={settings.allowSignups} onChange={e => setSettings({ ...settings, allowSignups: e.target.checked })} style={{ width: 20, height: 20 }} />
                            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#334155' }}>Allow new student signups</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={settings.requireApproval} onChange={e => setSettings({ ...settings, requireApproval: e.target.checked })} style={{ width: 20, height: 20 }} />
                            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#334155' }}>Require manual admin approval for new accounts</span>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={settings.enableGamification} onChange={e => setSettings({ ...settings, enableGamification: e.target.checked })} style={{ width: 20, height: 20 }} />
                            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#334155' }}>Enable XP, Gems, and Leaderboard systems</span>
                        </label>
                    </div>
                </div>
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ padding: '0.75rem 2.5rem', fontSize: '1.1rem', border: 'none' }}>
                    <Save size={18} />
                    {saving ? 'SAVING...' : 'SAVE CONFIGURATION'}
                </button>
            </div>
        </div>
    );
}
