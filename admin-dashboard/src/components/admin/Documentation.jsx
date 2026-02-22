import { Book, HelpCircle, LifeBuoy, Zap } from 'lucide-react';

export default function Documentation() {
    const sections = [
        {
            title: "OVERVIEW",
            icon: <HelpCircle size={20} color="var(--blue)" />,
            content: "The OG Chem Command is a high-density administrative ecosystem designed for zero-friction platform management. Use the sidebar hooks to navigate between analytics, users, and curriculum architecture."
        },
        {
            title: "STUDENT MANAGEMENT",
            icon: <Zap size={20} color="#F59E0B" />,
            content: "The 'Students' tab features a Master Profile Editor. Click the Edit icon on any student card to override their XP, Gems, Streaks, or account status. You can also award manual certificates or audit video playback logs."
        },
        {
            title: "CURRICULUM ARCHITECTURE",
            icon: <Book size={20} color="#8B5CF6" />,
            content: "The 'Course Builder' is a hierarchical tree. Create Lessons, then Chapters, then Content Items. Every item is editable via the Rich Editor on the right. Deleted items are permanently removed from the database."
        },
        {
            title: "SYSTEM RECOVERY",
            icon: <LifeBuoy size={20} color="#DC2626" />,
            content: "Use the 'Advanced' tab for global broadcasts and nuclear data wipes. Be careful: SQL Overrides bypass standard validation and should only be used for emergency database patches."
        }
    ];

    return (
        <div className="fade-in">
            <div className="section-header">
                <h2 className="bangers" style={{ fontSize: '2.5rem', color: '#1E293B' }}>ADMIN HANDBOOK</h2>
                <div className="badge badge-approved" style={{ backgroundColor: '#F0F9FF', color: '#0369A1' }}>SYSTEM DOCUMENTATION V1.0</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                {sections.map((s, i) => (
                    <div key={i} className="card" style={{ padding: '2rem', border: '1px solid var(--border)', background: 'var(--white)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                            {s.icon}
                            <h3 className="bangers" style={{ margin: 0, fontSize: '1.4rem', color: 'var(--black)' }}>{s.title}</h3>
                        </div>
                        <p style={{ color: '#64748B', fontWeight: 600, lineHeight: 1.6, fontSize: '0.95rem' }}>{s.content}</p>
                    </div>
                ))}
            </div>

            <div className="card" style={{ marginTop: '2rem', background: '#F8FAFC', padding: '2.5rem', border: '1px dashed #CBD5E1' }}>
                <h4 className="bangers" style={{ color: '#1E293B', fontSize: '1.2rem', marginBottom: '1rem' }}>ROBUSTNESS TIPS</h4>
                <ul style={{ color: '#64748B', fontWeight: 600, paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <li>Always refresh the dashboard after making structural changes to the curriculum.</li>
                    <li>Verify Student Statuses are 'APPROVED' before performing global broadcasts.</li>
                    <li>Use 'Visual Path' to verify the learner journey is logically sequenced.</li>
                    <li>Manual DB patches in SQL Override require a trailing semicolon.</li>
                </ul>
            </div>
        </div>
    );
}
