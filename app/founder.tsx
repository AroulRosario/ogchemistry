import { EliteNavigation } from '@/components/EliteNavigation';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { DuoHeader } from '@/components/DuoHeader';
import { COLORS, STYLES, SHADOWS } from '@/constants/theme';
import { Award, Book, Code, GraduationCap, Mail, MapPin, Phone, Rocket, Globe, Instagram, Linkedin, ExternalLink } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, View, ScrollView, Pressable, Linking } from 'react-native';

export default function FounderScreen() {
    const handleLink = (url: string) => Linking.openURL(url);

    return (
        <View style={styles.main}>
            <EliteNavigation />
            
            <View style={styles.contentArea}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <ResponsiveContainer fullWidth scrollable={false}>
                        
                        {/* Hero Section - Super Clean & Modern */}
                        <View style={styles.heroSection}>
                            <View style={styles.heroLayout}>
                                <View style={styles.heroText}>
                                    <View style={styles.eliteBadge}>
                                        <Award size={14} color={COLORS.blue} strokeWidth={3} />
                                        <Text style={styles.eliteBadgeText}>ELITE EDUCATOR</Text>
                                    </View>
                                    <Text style={styles.namePrefixText}>Dr. Aroul</Text>
                                    <Text style={styles.nameMainText}>Rosario . S</Text>
                                    <View style={styles.credentialsRow}>
                                        {['Ph.D', 'FRSA', 'IUPAC Affiliate', 'M.Sc', 'B.Sc', 'B.Ed'].map((item, i) => (
                                            <View key={i} style={styles.credTag}>
                                                <Text style={styles.credTagText}>{item}</Text>
                                            </View>
                                        ))}
                                    </View>
                                    
                                    <Text style={styles.heroQuote}>"A chemist who loves computers."</Text>

                                    <View style={styles.contactRow}>
                                        <ContactPill icon={Phone} text="+91 97905 17185" />
                                        <ContactPill icon={Mail} text="aroul.rosario@gmail.com" />
                                        <ContactPill icon={MapPin} text="Puducherry, India" />
                                    </View>

                                    <View style={styles.socialActionRow}>
                                        <Pressable style={styles.primaryAction} onPress={() => handleLink('https://www.aroulrosario.com')}>
                                            <Globe size={18} color="#FFF" />
                                            <Text style={styles.primaryActionText}>Visit Personal Website</Text>
                                        </Pressable>
                                        <SocialIconBtn icon={Linkedin} onPress={() => handleLink('https://linkedin.com/in/aroulrosario')} />
                                        <SocialIconBtn icon={Instagram} onPress={() => handleLink('https://instagram.com/aroulrosario')} />
                                    </View>
                                </View>

                                <View style={styles.photoContainer}>
                                    <View style={styles.photoShadowBox} />
                                    <View style={styles.photoFrame}>
                                        <Image 
                                            source={{ uri: 'https://lasndpkizduwifvrpovl.supabase.co/storage/v1/object/public/assets/founder.png' }} 
                                            style={styles.photo}
                                            resizeMode="cover"
                                        />
                                    </View>
                                    <View style={styles.statusPill}>
                                        <View style={styles.statusDot} />
                                        <Text style={styles.statusText}>ACTIVE INNOVATOR</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Core Stats / Highlights */}
                        <View style={styles.statsStrip}>
                            <StatItem value="15+" label="Years Expertise" />
                            <StatItem value="10k+" label="Simulations" />
                            <StatItem value="PhD" label="Italy/USA" />
                            <StatItem value="ACS" label="Member" />
                        </View>

                        {/* Main Grid Content */}
                        <View style={styles.mainGrid}>
                            <View style={styles.gridColumn}>
                                <SectionHeader icon={GraduationCap} title="Academic Foundation" />
                                <View style={styles.modernCard}>
                                    <AcademicRow year="2023" title="Ph.D" detail="University of Selinus, Italy/USA" />
                                    <AcademicRow year="2012" title="FRSA" detail="Royal Society of Arts, London" />
                                    <AcademicRow year="2008" title="M.Sc" detail="University of Manchester, UK" />
                                    <AcademicRow year="2006" title="B.Sc" detail="Loyola College, Chennai" />
                                    <AcademicRow year="2007" title="B.Ed" detail="Nehru College, Puducherry" />
                                </View>

                                <SectionHeader icon={Rocket} title="Technical Ecosystem" />
                                <View style={[styles.modernCard, { gap: 20 }]}>
                                    <EcosystemItem 
                                        emoji="🧪" 
                                        title="OG Chemistry" 
                                        desc="World-class modular visual learning engine for JEE & NEET." 
                                    />
                                    <EcosystemItem 
                                        emoji="🌿" 
                                        title="Starborn IVY" 
                                        desc="Transforming schools via high-fidelity digital pedagogical shifts." 
                                    />
                                    <EcosystemItem 
                                        emoji="🔬" 
                                        title="Starborn Scientist" 
                                        desc="Phy-Chem interactive simulations built with precision." 
                                    />
                                </View>
                            </View>

                            <View style={styles.gridColumn}>
                                <SectionHeader icon={Award} title="Distinguished Recognition" />
                                <View style={styles.featuredAchievement}>
                                    <View style={styles.featuredIconBox}>
                                        <Award size={32} color={COLORS.zap} />
                                    </View>
                                    <View style={{flex: 1}}>
                                        <Text style={styles.featuredTag}>KEYNOTE SPEAKER</Text>
                                        <Text style={styles.featuredTitle}>Talk at IIT Delhi</Text>
                                        <Text style={styles.featuredDesc}>Recent session on "Computational Semiotics of Multimodal STEM Pedagogies" delivering next-gen insights to India's top technical institute.</Text>
                                    </View>
                                </View>

                                <View style={styles.achievementList}>
                                    <ListItem text="President's Award - Balashree for Creative Arts" />
                                    <ListItem text="IUPAC Affiliate Member (Global Chemistry Network)" />
                                    <ListItem text="Sundaram Iyer Prize for Chemistry - Loyola College" />
                                    <ListItem text="Best AIESEC Teacher - University of Zhejiang, China" />
                                </View>

                                <SectionHeader icon={Book} title="Research & Publications" />
                                <View style={styles.publicationsCard}>
                                    <PubLink title="Ontological Commitments in Scaffolding" source="CERN, Geneva" />
                                    <PubLink title="Computational Semiotics of STEM" source="Univ. of Cambridge" />
                                    <PubLink title="Datatverse: High-Yield Chemistry Datasets" source="Harvard Univ." />
                                </View>

                                <SectionHeader icon={Code} title="Expert Stack" />
                                <View style={styles.tagCloud}>
                                    {['Microsoft CV', 'IBM Security', 'NVIDIA AI', 'Python', 'React', '3D Modeling', 'AI Pedagogy'].map((tag, i) => (
                                        <View key={i} style={styles.modernTag}>
                                            <Text style={styles.modernTagText}>{tag}</Text>
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

function ContactPill({ icon: Icon, text }: any) {
    return (
        <View style={styles.contactPill}>
            <Icon size={12} color={COLORS.blue} strokeWidth={3} />
            <Text style={styles.contactPillText}>{text}</Text>
        </View>
    );
}

function SocialIconBtn({ icon: Icon, onPress }: any) {
    return (
        <Pressable style={styles.socialIconBtn} onPress={onPress}>
            <Icon size={20} color="#1E293B" />
        </Pressable>
    );
}

function StatItem({ value, label }: any) {
    return (
        <View style={styles.statItem}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

function SectionHeader({ icon: Icon, title }: any) {
    return (
        <View style={styles.sectionHeader}>
            <Icon size={18} color={COLORS.blue} strokeWidth={3} />
            <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
        </View>
    );
}

function AcademicRow({ year, title, detail }: any) {
    return (
        <View style={styles.academicRow}>
            <Text style={styles.academicYear}>{year}</Text>
            <View style={styles.academicMain}>
                <Text style={styles.academicTitle}>{title}</Text>
                <Text style={styles.academicDetail}>{detail}</Text>
            </View>
        </View>
    );
}

function EcosystemItem({ emoji, title, desc }: any) {
    return (
        <View style={styles.ecoItem}>
            <View style={styles.ecoEmoji}><Text style={{fontSize: 20}}>{emoji}</Text></View>
            <View style={{ flex: 1 }}>
                <Text style={styles.ecoTitle}>{title}</Text>
                <Text style={styles.ecoDesc}>{desc}</Text>
            </View>
        </View>
    );
}

function ListItem({ text }: any) {
    return (
        <View style={styles.listItem}>
            <View style={styles.listDot} />
            <Text style={styles.listText}>{text}</Text>
        </View>
    );
}

function PubLink({ title, source }: any) {
    return (
        <View style={styles.pubRow}>
            <View style={{ flex: 1 }}>
                <Text style={styles.pubTitle}>{title}</Text>
                <Text style={styles.pubSource}>{source}</Text>
            </View>
            <ExternalLink size={14} color="#94A3B8" />
        </View>
    );
}

const styles = StyleSheet.create({
    main: { flex: 1, backgroundColor: '#F8FAFC' },
    contentArea: { flex: 1, paddingLeft: 260 },
    scrollContent: { paddingBottom: 100 },
    
    heroSection: {
        paddingTop: 80,
        paddingHorizontal: 80,
        marginBottom: 64,
    },
    heroLayout: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 80,
    },
    heroText: { flex: 1 },
    eliteBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 24,
    },
    eliteBadgeText: {
        color: COLORS.blue,
        fontSize: 11,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    namePrefixText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 4,
    },
    nameMainText: {
        fontSize: 88,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -4,
        lineHeight: 88,
        marginBottom: 24,
    },
    credentialsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 32,
    },
    credTag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: '#F1F5F9',
        borderRadius: 6,
    },
    credTagText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#475569',
    },
    heroQuote: {
        fontSize: 22,
        fontWeight: '500',
        color: '#475569',
        fontStyle: 'italic',
        marginBottom: 40,
        maxWidth: 600,
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 40,
    },
    contactPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...SHADOWS.sm,
    },
    contactPillText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1E293B',
    },
    socialActionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    primaryAction: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: COLORS.blue,
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 16,
        ...SHADOWS.md,
    },
    primaryActionText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '800',
    },
    socialIconBtn: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },

    photoContainer: {
        width: 420,
        height: 540,
        position: 'relative',
    },
    photoShadowBox: {
        position: 'absolute',
        top: 30,
        left: 30,
        width: '100%',
        height: '100%',
        backgroundColor: '#EFF6FF',
        borderRadius: 40,
    },
    photoFrame: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
        backgroundColor: '#CBD5E1',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...SHADOWS.lg,
    },
    photo: { width: '100%', height: '100%' },
    statusPill: {
        position: 'absolute',
        bottom: 30,
        right: -20,
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        ...SHADOWS.lg,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.green,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '900',
        color: '#111827',
        letterSpacing: 1,
    },

    statsStrip: {
        flexDirection: 'row',
        backgroundColor: '#0F172A',
        marginHorizontal: 80,
        borderRadius: 32,
        padding: 40,
        justifyContent: 'space-around',
        marginBottom: 80,
        ...SHADOWS.lg,
    },
    statItem: { alignItems: 'center' },
    statValue: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFF',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },

    mainGrid: {
        flexDirection: 'row',
        gap: 40,
        paddingHorizontal: 80,
    },
    gridColumn: { flex: 1, gap: 40 },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: -16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: COLORS.blue,
        letterSpacing: 2,
    },
    modernCard: {
        backgroundColor: '#FFF',
        borderRadius: 32,
        padding: 32,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...SHADOWS.sm,
    },

    academicRow: {
        flexDirection: 'row',
        gap: 24,
        marginBottom: 24,
    },
    academicYear: {
        fontSize: 13,
        fontWeight: '900',
        color: COLORS.blue,
        minWidth: 40,
    },
    academicMain: { flex: 1 },
    academicTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 2,
    },
    academicDetail: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748B',
    },

    ecoItem: {
        flexDirection: 'row',
        gap: 20,
    },
    ecoEmoji: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    ecoTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4,
    },
    ecoDesc: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748B',
        lineHeight: 18,
    },

    featuredAchievement: {
        backgroundColor: '#FFF',
        borderRadius: 32,
        padding: 32,
        borderWidth: 2,
        borderColor: COLORS.zap,
        flexDirection: 'row',
        gap: 24,
        ...SHADOWS.md,
    },
    featuredIconBox: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: '#FFFBEB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    featuredTag: {
        fontSize: 11,
        fontWeight: '900',
        color: '#B45309',
        letterSpacing: 1.5,
        marginBottom: 4,
    },
    featuredTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1E293B',
        marginBottom: 8,
    },
    featuredDesc: {
        fontSize: 14,
        fontWeight: '500',
        color: '#475569',
        lineHeight: 20,
    },

    achievementList: { gap: 16 },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    listDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.blue,
    },
    listText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#334155',
    },

    publicationsCard: {
        backgroundColor: '#0F172A',
        borderRadius: 32,
        padding: 32,
        gap: 24,
    },
    pubRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    pubTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 4,
    },
    pubSource: {
        fontSize: 12,
        fontWeight: '800',
        color: '#94A3B8',
    },

    tagCloud: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    modernTag: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#FFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    modernTagText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#475569',
    },
});
