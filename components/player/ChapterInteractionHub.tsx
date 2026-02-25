import { COLORS } from '@/constants/theme';
import { BookOpen, FileText, HelpCircle, Layers, MessageSquare } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { FlashcardSet } from './FlashcardSet';

interface ChapterInteractionHubProps {
    notes?: string;
    flashcards?: any[];
    resources?: any[];
}

export function ChapterInteractionHub({ notes, flashcards, resources }: ChapterInteractionHubProps) {
    const [activeTab, setActiveTab] = useState<'notes' | 'flashcards' | 'practice' | 'community'>('notes');

    const tabs = [
        { id: 'notes', label: 'NOTES', icon: FileText },
        { id: 'flashcards', label: 'FLASHCARDS', icon: Layers },
        { id: 'practice', label: 'PRACTICE', icon: HelpCircle },
        { id: 'community', label: 'COMMUNITY', icon: MessageSquare },
    ];

    const MOCK_FLASHCARDS = flashcards || [
        { id: '1', term: 'Covalent Bond', definition: 'A chemical bond that involves the sharing of electron pairs between atoms.' },
        { id: '2', term: 'Electronegativity', definition: 'A measure of the tendency of an atom to attract a bonding pair of electrons.' },
        { id: '3', term: 'Molecule', definition: 'The smallest unit of a chemical compound that retains its chemical properties.' },
    ];

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.tabBar}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <Pressable
                            key={tab.id}
                            onPress={() => setActiveTab(tab.id as any)}
                            style={[styles.tab, isActive && styles.tabActive]}
                        >
                            <Icon size={18} color={isActive ? COLORS.blue : '#94A3B8'} />
                            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

            <View style={styles.content}>
                {activeTab === 'notes' && (
                    <View style={styles.notesContainer}>
                        <Text style={styles.sectionTitle}>Lecture Summary</Text>
                        <Text style={styles.notesText}>
                            {notes || "In this chapter, we explore the fundamental principles of organic chemistry. We start by understanding the structure of carbon atoms and how they form diverse chains and rings. Key concepts include hybridization, bond angles, and the importance of functional groups in determining chemical reactivity.\n\nCarbon's ability to form four stable covalent bonds is the foundation of the immense variety of organic molecules. We will examine alkanes, alkenes, and alkynes, focusing on their nomenclature and physical properties."}
                        </Text>
                        <View style={styles.resourceBox}>
                            <Text style={styles.resourceTitle}>Resources</Text>
                            <Pressable style={styles.resourceItem}>
                                <BookOpen size={16} color={COLORS.blue} />
                                <Text style={styles.resourceItemText}>chapter_summary_pdf.pdf</Text>
                            </Pressable>
                            <Pressable style={styles.resourceItem}>
                                <BookOpen size={16} color={COLORS.blue} />
                                <Text style={styles.resourceItemText}>practice_problems.docx</Text>
                            </Pressable>
                        </View>
                    </View>
                )}

                {activeTab === 'flashcards' && (
                    <View style={styles.flashcardsContainer}>
                        <FlashcardSet cards={MOCK_FLASHCARDS} />
                    </View>
                )}

                {activeTab === 'practice' && (
                    <View style={styles.practiceContainer}>
                        <View style={styles.emptyState}>
                            <HelpCircle size={48} color="#E2E8F0" />
                            <Text style={styles.emptyStateTitle}>Quick Practice</Text>
                            <Text style={styles.emptyStateDesc}>Test your knowledge with 5 quick questions about this video.</Text>
                            <Pressable style={styles.startBtn}>
                                <Text style={styles.startBtnText}>Start Practice</Text>
                            </Pressable>
                        </View>
                    </View>
                )}

                {activeTab === 'community' && (
                    <View style={styles.communityContainer}>
                        <View style={styles.communityCard}>
                            <View style={styles.avatarPlaceholder}><Text>👨‍🔬</Text></View>
                            <View style={styles.commentContent}>
                                <Text style={styles.commentUser}>Dr. Chem</Text>
                                <Text style={styles.commentText}>Great explanation of the bond angles here!</Text>
                            </View>
                        </View>
                        <View style={styles.communityCard}>
                            <View style={styles.avatarPlaceholder}><Text>👩‍🎓</Text></View>
                            <View style={styles.commentContent}>
                                <Text style={styles.commentUser}>Student X</Text>
                                <Text style={styles.commentText}>Can someone explain the hybridization part again?</Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#F8FAFC',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 12, // Ensure inner spacing on small screens when scrolled
        gap: 8,
        minWidth: 100, // Make sure tabs don't squish too much
    },
    tabActive: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 2,
        borderBottomColor: COLORS.blue,
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 1,
    },
    tabLabelActive: {
        color: COLORS.blue,
    },
    content: {
        padding: 24,
    },
    notesContainer: {
        gap: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
    },
    notesText: {
        fontSize: 15,
        color: '#475569',
        lineHeight: 24,
        fontWeight: '500',
    },
    resourceBox: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#F1F5F9',
        borderRadius: 16,
        gap: 12,
    },
    resourceTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#475569',
        letterSpacing: 0.5,
    },
    resourceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    resourceItemText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.blue,
        textDecorationLine: 'underline',
    },
    flashcardsContainer: {
        minHeight: 300,
        justifyContent: 'center',
    },
    practiceContainer: {
        minHeight: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyState: {
        alignItems: 'center',
        gap: 8,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1E293B',
        marginTop: 12,
    },
    emptyStateDesc: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        maxWidth: 250,
        fontWeight: '500',
    },
    startBtn: {
        marginTop: 16,
        backgroundColor: COLORS.blue,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    startBtnText: {
        color: '#FFFFFF',
        fontWeight: '800',
        fontSize: 14,
    },
    communityContainer: {
        gap: 16,
    },
    communityCard: {
        flexDirection: 'row',
        gap: 12,
        backgroundColor: '#F8FAFC',
        padding: 12,
        borderRadius: 16,
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    commentContent: {
        flex: 1,
    },
    commentUser: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
    },
    commentText: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 2,
    },
});
