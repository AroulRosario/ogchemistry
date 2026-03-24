import { EliteNavigation } from '@/components/EliteNavigation';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { DuoHeader } from '@/components/DuoHeader';
import { COLORS, STYLES } from '@/constants/theme';
import { Award, Book, Code, GraduationCap, Microscope, Rocket } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, View, ScrollView } from 'react-native';

export default function FounderScreen() {
    return (
        <View style={styles.main}>
            <EliteNavigation />
            
            <View style={styles.contentArea}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <ResponsiveContainer fullWidth scrollable={false}>
                        {/* Placeholder for DuoHeader since we don't have profile stats here easily, 
                            but for consistency we use it or a variant. Let's just use it with 0s for now 
                            or omit if it feels out of place. Actually, let's omit and use a custom Hero. */}
                        
                        {/* Hero Section */}
                        <View style={styles.heroSection}>
                            <View style={styles.heroLayout}>
                                <View style={styles.heroText}>
                                    <View style={styles.badge}>
                                        <Award size={14} color={COLORS.blue} />
                                        <Text style={styles.badgeText}>FOUNDER & VISIONARY</Text>
                                    </View>
                                    <Text style={styles.nameText}>Aroul Rosario . S</Text>
                                    <Text style={styles.titleText}>Vice Principal • Researcher • OG Founder</Text>
                                    <View style={styles.heroDivider} />
                                    <Text style={styles.bioText}>
                                        An educationalist with over a decade of leadership in large-scale academic environments. 
                                        Currently serving as Vice Principal at Amalorpavam Lourds Academy, oversees a student 
                                        body of 9,600. Expert in leveraging Python and HTML to engineer high-fidelity, 
                                        interactive STEM simulations.
                                    </Text>
                                </View>
                                <View style={styles.photoContainer}>
                                    <View style={styles.photoFrame}>
                                        <Image 
                                            source={{ uri: 'https://lasndpkizduwifvrpovl.supabase.co/storage/v1/object/public/assets/founder.png' }} 
                                            style={styles.photo}
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <View style={styles.experienceBox}>
                                        <Text style={styles.expNumber}>10+</Text>
                                        <Text style={styles.expLabel}>Years Experience</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Stats/Highlight Row */}
                        <View style={styles.highlightsRow}>
                            <HighlightCard 
                                icon={GraduationCap} 
                                title="Academic Leader" 
                                desc="VP at Amalorpavam Lourds Academy" 
                                color="#EFF6FF"
                                iconColor="#2563EB"
                            />
                            <HighlightCard 
                                icon={Microscope} 
                                title="STEM Pioneer" 
                                desc="Founder of OG Chemistry Ecosystem" 
                                color="#F0FDF4"
                                iconColor="#16A34A"
                            />
                            <HighlightCard 
                                icon={Code} 
                                title="Tech Architect" 
                                desc="AI/ML & Simulation Specialist" 
                                color="#FAF5FF"
                                iconColor="#9333EA"
                            />
                        </View>

                        {/* Main Info Columns */}
                        <View style={styles.infoLayout}>
                            {/* Left Column */}
                            <View style={styles.leftCol}>
                                <SectionHeader icon={GraduationCap} title="Education & Research" />
                                <View style={styles.card}>
                                    <InfoItem 
                                        label="MSc - University of Manchester" 
                                        sub="Master of Science (2018-2019)"
                                    />
                                    <InfoItem 
                                        label="BSc - Loyola College" 
                                        sub="Bachelor of Science (2014-2017)"
                                    />
                                    <View style={styles.itemDivider} />
                                    <Text style={styles.cardSubHeader}>Research Papers</Text>
                                    <Text style={styles.paperText}>• Ontological Commitments in Algorithmic Scaffolding (2023)</Text>
                                    <Text style={styles.paperText}>• Computational Semiotics of Multimodal STEM Pedagogies</Text>
                                    <Text style={styles.paperText}>• Neuro-Cognitive Correlates of Haptic-Augmented Kinesthetic Learning</Text>
                                </View>

                                <SectionHeader icon={Award} title="Key Accomplishments" />
                                <View style={styles.card}>
                                    <AchievementItem text="PRESIDENT'S AWARD - BALASHREE FOR CREATIVE ARTS" />
                                    <AchievementItem text="SUNDARAM IYER PRIZE FOR CHEMISTRY - LOYOLA COLLEGE" />
                                    <AchievementItem text="BEST AIESEC TEACHER - UNIVERSITY OF ZHEJIANG, CHINA" />
                                    <AchievementItem text="RECENT SPEAKER AT IIT DELHI ON REINVENTING STEM" />
                                </View>
                            </View>

                            {/* Right Column */}
                            <View style={styles.rightCol}>
                                <SectionHeader icon={Rocket} title="Startups & Innovations" />
                                <View style={[styles.card, { backgroundColor: COLORS.blue }]}>
                                    <Text style={[styles.cardTitle, { color: '#fff' }]}>OG Chemistry</Text>
                                    <Text style={[styles.cardDesc, { color: 'rgba(255,255,255,0.8)' }]}>
                                        A specialized ecosystem designed specifically to simplify the rigors of IIT-JEE 
                                        Advanced and NEET preparation through a modular and visual approach. (Web/Android)
                                    </Text>
                                    <View style={styles.whiteDivider} />
                                    <Text style={[styles.cardTitle, { color: '#fff' }]}>Starborn Scientist</Text>
                                    <Text style={[styles.cardDesc, { color: 'rgba(255,255,255,0.8)' }]}>
                                        Simulation Engineering firm building high-fidelity interactive modules using 
                                        HTML front-end and Python computational logic.
                                    </Text>
                                </View>

                                <SectionHeader icon={Book} title="Published Works" />
                                <View style={styles.card}>
                                    <InfoItem label="NEET/IIT-JEE Books" sub="OG Chemistry Series for competitive exams" />
                                    <InfoItem label="Advanced Chemistry" sub="Bedtime stories on molecular concepts" />
                                </View>

                                <SectionHeader icon={Code} title="Technical Specializations" />
                                <View style={styles.skillsCloud}>
                                    {['Python', 'HTML5/CSS3', 'JavaScript', 'CV', 'Gen AI', 'Liquid/JSX', 'Curriculum Mapping', '3D Modeling'].map((s, i) => (
                                        <View key={i} style={styles.skillTag}>
                                            <Text style={styles.skillTagText}>{s}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </ResponsiveContainer>
                </ScrollView>
            </View>
        </View>
    );
}

function SectionHeader({ icon: Icon, title }: { icon: any, title: string }) {
    return (
        <View style={styles.sectionHeader}>
            <View style={styles.sectionIconBox}>
                <Icon size={18} color={COLORS.blue} strokeWidth={3} />
            </View>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );
}

function HighlightCard({ icon: Icon, title, desc, color, iconColor }: any) {
    return (
        <View style={[styles.hCard, { backgroundColor: color }]}>
            <View style={[styles.hIconBox, { backgroundColor: 'white' }]}>
                <Icon size={20} color={iconColor} strokeWidth={2.5} />
            </View>
            <View>
                <Text style={styles.hTitle}>{title}</Text>
                <Text style={styles.hDesc}>{desc}</Text>
            </View>
        </View>
    );
}

function InfoItem({ label, sub }: { label: string, sub: string }) {
    return (
        <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoSub}>{sub}</Text>
        </View>
    );
}

function AchievementItem({ text }: { text: string }) {
    return (
        <View style={styles.achieveItem}>
            <View style={styles.achieveDot} />
            <Text style={styles.achieveText}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    main: { flex: 1, backgroundColor: '#F8FAFC' },
    contentArea: { flex: 1, paddingLeft: 260 },
    scrollContent: { paddingBottom: 60 },
    heroSection: {
        paddingTop: 40,
        marginBottom: 32,
    },
    heroLayout: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 40,
    },
    heroText: {
        flex: 1.2,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 20,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '900',
        color: COLORS.blue,
        letterSpacing: 1,
    },
    nameText: {
        fontSize: 48,
        fontWeight: '900',
        color: '#1E293B',
        letterSpacing: -1.5,
        marginBottom: 8,
    },
    titleText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#64748B',
        marginBottom: 24,
    },
    heroDivider: {
        width: 60,
        height: 6,
        backgroundColor: COLORS.blue,
        borderRadius: 3,
        marginBottom: 24,
    },
    bioText: {
        fontSize: 17,
        lineHeight: 26,
        color: '#475569',
        fontWeight: '600',
    },
    photoContainer: {
        flex: 0.8,
        alignItems: 'center',
        position: 'relative',
    },
    photoFrame: {
        width: 300,
        height: 300,
        borderRadius: 40,
        backgroundColor: '#E2E8F0',
        overflow: 'hidden',
        ...STYLES.premiumShadow,
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    experienceBox: {
        position: 'absolute',
        bottom: -20,
        right: -10,
        backgroundColor: COLORS.white,
        padding: 16,
        paddingHorizontal: 20,
        borderRadius: 20,
        ...STYLES.premiumShadow,
        alignItems: 'center',
    },
    expNumber: {
        fontSize: 24,
        fontWeight: '900',
        color: COLORS.blue,
    },
    expLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#64748B',
        textTransform: 'uppercase',
        marginTop: -2,
    },
    highlightsRow: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 40,
    },
    hCard: {
        flex: 1,
        padding: 20,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    hIconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    hTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 2,
    },
    hDesc: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748B',
    },
    infoLayout: {
        flexDirection: 'row',
        gap: 32,
    },
    leftCol: { flex: 1.3 },
    rightCol: { flex: 1 },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 20,
        marginTop: 10,
    },
    sectionIconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        ...STYLES.premiumShadow,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#1E293B',
        letterSpacing: -0.2,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 28,
        padding: 24,
        marginBottom: 32,
        ...STYLES.premiumShadow,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    infoItem: {
        marginBottom: 16,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 2,
    },
    infoSub: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
    },
    itemDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 16,
    },
    cardSubHeader: {
        fontSize: 12,
        fontWeight: '900',
        color: COLORS.blue,
        textTransform: 'uppercase',
        marginBottom: 12,
        letterSpacing: 1,
    },
    paperText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
        lineHeight: 20,
        marginBottom: 8,
    },
    achieveItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 14,
    },
    achieveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.blue,
    },
    achieveText: {
        flex: 1,
        fontSize: 13,
        fontWeight: '700',
        color: '#475569',
        lineHeight: 18,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '900',
        marginBottom: 8,
    },
    cardDesc: {
        fontSize: 13,
        lineHeight: 19,
        fontWeight: '500',
        marginBottom: 20,
    },
    whiteDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 20,
    },
    skillsCloud: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 40,
    },
    skillTag: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...STYLES.premiumShadow,
    },
    skillTagText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#475569',
    },
});
