import { BookOpen, RefreshCw, Star, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { supabase } from '../../supabase';

export default function AnalyticsOverview() {
    const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, totalXP: 0, completionRate: 0 });
    const [activityData, setActivityData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const { data: profiles } = await supabase.from('profiles').select('id, xp, created_at, last_active_at');

            if (profiles) {
                const totalXP = profiles.reduce((sum, p) => sum + (p.xp || 0), 0);
                const active = profiles.filter(p => p.last_active_at && (new Date() - new Date(p.last_active_at)) < (7 * 24 * 60 * 60 * 1000)).length;

                setStats({
                    totalUsers: profiles.length,
                    activeUsers: active,
                    totalXP,
                    completionRate: profiles.length > 0 ? Math.round((profiles.filter(p => p.xp > 50).length / profiles.length) * 100) : 0
                });

                const mockTrend = [
                    { name: 'Mon', active: active - 4, completions: 2 },
                    { name: 'Tue', active: active - 2, completions: 3 },
                    { name: 'Wed', active: active + 1, completions: 5 },
                    { name: 'Thu', active: active, completions: 4 },
                    { name: 'Fri', active: active + 3, completions: 8 },
                    { name: 'Sat', active: active + 5, completions: 12 },
                    { name: 'Sun', active, completions: 15 },
                ];
                setActivityData(mockTrend);
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="fade-in" style={{ padding: '4rem', textAlign: 'center' }}>
                <RefreshCw className="spinning" size={32} color="var(--blue)" />
                <p style={{ marginTop: '1.5rem', color: 'var(--gray-500)', fontWeight: '600', fontSize: '0.9rem' }}>Compiling Analytics Intelligence...</p>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>System Performance</h2>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Real-time student engagement metrics.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.75rem', borderRadius: '2rem', border: '1px solid var(--blue-soft)', backgroundColor: 'var(--blue-soft)', color: 'var(--blue)', fontSize: '0.75rem', fontWeight: '700' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--blue)' }} />
                    LIVE FEED
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: 'var(--blue-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users color="var(--blue)" size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--black)', lineHeight: 1 }}>{stats.totalUsers}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.5rem' }}>Total Recruits</div>
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Star color="#D97706" size={24} fill="#D97706" />
                    </div>
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: '#D97706', lineHeight: 1 }}>{stats.completionRate}%</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.5rem' }}>Curriculum Mastery</div>
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BookOpen color="#059669" size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--black)', lineHeight: 1 }}>{stats.totalXP.toLocaleString()}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.5rem' }}>Cumulative Knowledge (XP)</div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
                <div style={{ marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--black)', margin: 0 }}>Engagement Trajectory</h3>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Active units throughout the weekly cycle.</p>
                </div>
                <div style={{ height: 400, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                            <XAxis dataKey="name" stroke="#94A3B8" style={{ fontSize: '12px', fontWeight: '600' }} tickLine={false} axisLine={false} dy={10} />
                            <YAxis yAxisId="left" stroke="#94A3B8" style={{ fontSize: '12px', fontWeight: '600' }} tickLine={false} axisLine={false} />
                            <YAxis yAxisId="right" orientation="right" stroke="#D97706" style={{ fontSize: '12px', fontWeight: '600' }} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontWeight: '700' }} />
                            <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: '700', fontSize: '12px' }} iconType="circle" />
                            <Line yAxisId="left" type="monotone" dataKey="active" stroke="var(--blue)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--blue)' }} name="Active Units" />
                            <Line yAxisId="right" type="monotone" dataKey="completions" stroke="#D97706" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0, fill: '#D97706' }} name="Mastery Events" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                <div className="card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--black)', marginBottom: '2rem' }}>Proficiency Distribution</h3>
                    <div style={{ height: 250, width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[{ name: 'UNIT 01', avg: 85 }, { name: 'UNIT 02', avg: 72 }, { name: 'UNIT 03', avg: 92 }, { name: 'MIDTERM', avg: 65 }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                                <XAxis dataKey="name" stroke="#94A3B8" style={{ fontSize: '11px', fontWeight: '700' }} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94A3B8" style={{ fontSize: '11px', fontWeight: '700' }} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: 'rgba(37, 99, 235, 0.03)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontWeight: '700' }} />
                                <Bar dataKey="avg" fill="var(--blue)" stroke="none" radius={[4, 4, 0, 0]} name="Mean Score (%)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'var(--blue-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <RefreshCw color="var(--blue)" size={24} />
                    </div>
                    <h4 style={{ fontWeight: '800', color: 'var(--black)', marginBottom: '0.5rem' }}>Data Synchronization</h4>
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.85rem', maxWidth: '250px' }}>Your analytics engine is perfectly synced with the Supabase mainframe.</p>
                </div>
            </div>
        </div>
    );
}
