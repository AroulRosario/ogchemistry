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
                        
                        {/* Header Banner - Robust & Vibrant */}
                        <View style={styles.headerBanner}>
                            <View style={styles.bannerContent}>
                                <View style={styles.badge}>
                                    <Award size={14} color="#FFF" />
                                    <Text style={styles.badgeText}>ELITE EDUCATOR</Text>
                                </View>
                                <Text style={styles.bannerTagline}>"A chemist who loves computers."</Text>
                            </View>
                        </View>

                        {/* Hero Section */}
                        <View style={styles.heroSection}>
                            <View style={styles.heroLayout}>
                                <View style={styles.heroText}>
                                    <Text style={styles.greetingText}>Dr. Aroul</Text>
                                    <Text style={styles.nameText}>Rosario . S</Text>
                                    <Text style={styles.titleText}>Ph.D • FRSA • M.Sc • B.Sc • B.Ed</Text>
                                    
                                    <View style={styles.contactGlass}>
                                        <ContactItem icon={Phone} text="+91 97905 17185" />
                                        <ContactItem icon={Mail} text="aroul.rosario@gmail.com" />
                                        <ContactItem icon={MapPin} text="Puducherry, India" />
                                    </View>

                                    <View style={styles.socialRow}>
                                        <SocialBtn icon={Globe} label="Website" onPress={() => handleLink('https://www.aroulrosario.com')} />
                                        <SocialBtn icon={Linkedin} label="LinkedIn" onPress={() => handleLink('https://linkedin.com/in/aroulrosario')} />
                                        <SocialBtn icon={Instagram} label="Instagram" onPress={() => handleLink('https://instagram.com/aroulrosario')} />
                                    </View>
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
                                        <Text style={styles.expNumber}>PhD</Text>
                                        <Text style={styles.expLabel}>Italy/USA</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Credentials Grid - Modern Multi-Row */}
                        <View style={styles.sectionDivider} />
                        <SectionHeader icon={GraduationCap} title="Credentials that Matter" />
                        <View style={styles.credGrid}>
                            <CredCard title="Ph.D" sub="University of Selinus" detail="Delaware, USA / Italy" />
                            <CredCard title="FRSA" sub="Royal Society, London" detail="Fellowship" />
                            <CredCard title="M.Sc" sub="University of Manchester" detail="Manchester, UK" />
                            <CredCard title="B.Sc" sub="Loyola College" detail="Chennai, India" />
                            <CredCard title="B.Ed" sub="Nehru College" detail="Puducherry, India" />
                            <CredCard title="Member" sub="American Chemical Society" detail="ACS Member" />
                        </View>

                        {/* Main Content Layout */}
                        <View style={styles.dualGrid}>
                            <View style={styles.leftCol}>
                                <SectionHeader icon={Rocket} title="Technical Ecosystem" />
                                <View style={styles.robustCard}>
                                    <Text style={styles.cardTag}>BUILT. LED. SCALED.</Text>
                                    <FeatureItem 
                                        title="OG Chemistry" 
                                        desc="Modular visual learning for IIT-JEE & NEET. 10,000+ simulations engineered."
                                        logo="🧪"
                                    />
                                    <FeatureItem 
                                        title="Starborn IVY" 
                                        desc="Next-gen pedagogical innovation & digital school transformation."
                                        logo="🌿"
                                    />
                                    <FeatureItem 
                                        title="Starborn Scientist" 
                                        desc="High-fidelity interactive lab simulations using Python & HTML."
                                        logo="🔬"
                                    />
                                </View>

                                <SectionHeader icon={Award} title="Elite Recognition" />
                                <View style={styles.simpleList}>
                                    <ListItem text="President's Award - Balashree for Creative Arts" />
                                    <ListItem text="Sundaram Iyer Prize for Chemistry - Loyola College" />
                                    <ListItem text="Best AIESEC Teacher - University of Zhejiang, China" />
                                    <ListItem text="Recent Speaker at IIT Delhi on STEM Pedagogies" />
                                </View>
                            </View>

                            <View style={styles.rightCol}>
                                <SectionHeader icon={Book} title="Published Research" />
                                <View style={styles.paperCard}>
                                    <Text style={styles.paperQuote}>"Chemistry isn't a barrier—it's a bridge."</Text>
                                    <View style={styles.pDivider} />
                                    <PaperItem title="Ontological Commitments in Algorithmic Scaffolding" source="CERN Geneva" />
                                    <PaperItem title="Computational Semiotics of Multimodal STEM Pedagogies" source="Univ. of Cambridge" />
                                    <PaperItem title="Datatverse: Curated Dataset of High-Yield Reactions" source="Harvard University" />
                                </View>

                                <SectionHeader icon={Code} title="Design & Tech Stack" />
                                <View style={styles.stackGrid}>
                                    {['Microsoft CV', 'IBM Security', 'NVIDIA AI', 'Adobe GenAI', 'Python', 'JSX/React', '3D Modeling'].map((item, i) => (
                                        <View key={i} style={styles.stackTag}>
                                            <Text style={styles.stackTagText}>{item}</Text>
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

function ContactItem({ icon: Icon, text }: any) {
    return (
        <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
                <Icon size={14} color={COLORS.blue} strokeWidth={3} />
            </View>
            <Text style={styles.contactText}>{text}</Text>
        </View>
    );
}

function SocialBtn({ icon: Icon, label, onPress }: any) {
    return (
        <Pressable style={styles.socialBtn} onPress={onPress}>
            <Icon size={18} color="#FFF" />
            <Text style={styles.socialLabel}>{label}</Text>
        </Pressable>
    );
}

function CredCard({ title, sub, detail }: any) {
    return (
        <View style={styles.credCard}>
            <Text style={styles.credTitle}>{title}</Text>
            <Text style={styles.credSub}>{sub}</Text>
            <Text style={styles.credDetail}>{detail}</Text>
        </View>
    );
}

function SectionHeader({ icon: Icon, title }: any) {
    return (
        <View style={styles.sectionHeader}>
            <View style={styles.sectionIcon}>
                <Icon size={18} color="#FFF" strokeWidth={3} />
            </View>
            <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
        </View>
    );
}

function FeatureItem({ title, desc, logo }: any) {
    return (
        <View style={styles.featureItem}>
            <View style={styles.featureLogo}><Text style={{fontSize: 20}}>{logo}</Text></View>
            <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>{title}</Text>
                <Text style={styles.featureDesc}>{desc}</Text>
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

function PaperItem({ title, source }: any) {
    return (
        <View style={styles.paperItem}>
            <View style={styles.paperIndicator} />
            <View style={{ flex: 1 }}>
                <Text style={styles.paperTitle}>{title}</Text>
                <Text style={styles.paperSource}>{source}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    main: { flex: 1, backgroundColor: '#F0F4F8' },
    contentArea: { flex: 1, paddingLeft: 260 },
    scrollContent: { paddingBottom: 100 },
    
    headerBanner: {
        height: 120,
        backgroundColor: COLORS.blue,
        marginTop: 40,
        borderRadius: 32,
        paddingHorizontal: 40,
        justifyContent: 'center',
        ...SHADOWS.lg,
    },
    bannerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bannerTagline: {
        fontSize: 20,
        fontWeight: '900',
        color: 'rgba(255,255,255,0.9)',
        fontStyle: 'italic',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1,
    },

    heroSection: {
        marginTop: -40,
        paddingHorizontal: 40,
        marginBottom: 48,
    },
    heroLayout: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 64,
    },
    heroText: { flex: 1 },
    greetingText: {
        fontSize: 32,
        fontWeight: '700',
        color: COLORS.blue,
        marginBottom: -8,
    },
    nameText: {
        fontSize: 84,
        fontWeight: '950',
        color: '#1E293B',
        letterSpacing: -4,
        marginBottom: 16,
    },
    titleText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#64748B',
        marginBottom: 32,
        letterSpacing: 0.5,
    },
    contactGlass: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: 24,
        padding: 24,
        gap: 12,
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        marginBottom: 32,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    contactIcon: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contactText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#334155',
    },
    socialRow: {
        flexDirection: 'row',
        gap: 12,
    },
    socialBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#1E293B',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 16,
    },
    socialLabel: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '800',
    },

    photoContainer: {
        width: 380,
        position: 'relative',
    },
    photoFrame: {
        width: 380,
        height: 480,
        borderRadius: 48,
        backgroundColor: '#D1D5DB',
        overflow: 'hidden',
        borderWidth: 12,
        borderColor: '#FFF',
        ...SHADOWS.lg,
    },
    photo: { width: '100%', height: '100%' },
    experienceBox: {
        position: 'absolute',
        top: 40,
        right: -30,
        backgroundColor: COLORS.zap,
        padding: 24,
        borderRadius: 24,
        alignItems: 'center',
        ...SHADOWS.md,
    },
    expNumber: {
        fontSize: 32,
        fontWeight: '950',
        color: '#000',
    },
    expLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#000',
        marginTop: -4,
    },

    sectionDivider: {
        height: 1,
        backgroundColor: '#CBD5E1',
        marginHorizontal: 40,
        marginBottom: 48,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingHorizontal: 40,
        marginBottom: 32,
    },
    sectionIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.blue,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.sm,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1E293B',
        letterSpacing: 2,
    },

    credGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
        paddingHorizontal: 40,
        marginBottom: 64,
    },
    credCard: {
        width: '31%',
        backgroundColor: '#FFF',
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...SHADOWS.sm,
    },
    credTitle: {
        fontSize: 24,
        fontWeight: '950',
        color: COLORS.blue,
        marginBottom: 4,
    },
    credSub: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4,
    },
    credDetail: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
    },

    dualGrid: {
        flexDirection: 'row',
        gap: 40,
        paddingHorizontal: 40,
    },
    leftCol: { flex: 1.2 },
    rightCol: { flex: 1 },

    robustCard: {
        backgroundColor: '#FFF',
        borderRadius: 32,
        padding: 32,
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 48,
    },
    cardTag: {
        fontSize: 11,
        fontWeight: '900',
        color: COLORS.blue,
        letterSpacing: 2,
        marginBottom: 24,
    },
    featureItem: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 24,
    },
    featureLogo: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4,
    },
    featureDesc: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748B',
        lineHeight: 18,
    },

    simpleList: {
        padding: 10,
        gap: 16,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    listDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.zap,
    },
    listText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#475569',
    },

    paperCard: {
        backgroundColor: '#0F172A',
        borderRadius: 32,
        padding: 32,
        ...SHADOWS.lg,
        marginBottom: 48,
    },
    paperQuote: {
        fontSize: 20,
        fontWeight: '800',
        color: '#F1F5F9',
        fontStyle: 'italic',
        marginBottom: 24,
    },
    pDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginBottom: 24,
    },
    paperItem: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
    },
    paperIndicator: {
        width: 4,
        height: 40,
        backgroundColor: COLORS.zap,
        borderRadius: 2,
    },
    paperTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 4,
    },
    paperSource: {
        fontSize: 12,
        fontWeight: '900',
        color: COLORS.zap,
        letterSpacing: 0.5,
    },

    stackGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    stackTag: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#FFF',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    stackTagText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#475569',
    },
});
