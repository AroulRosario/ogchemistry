import { ArticleView } from '@/components/player/ArticleView';
import { AssignmentSubmitter } from '@/components/player/AssignmentSubmitter';
import { InteractiveQuiz } from '@/components/player/InteractiveQuiz';
import { PYQView } from '@/components/player/PYQView';
import { SimulationView } from '@/components/player/SimulationView';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { LaTeXText } from '@/components/LaTeXText';
import { COLORS } from '@/constants/theme';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface ContentPlayerProps {
    item: any;
    onQuizComplete?: (score: number, passed: boolean) => void;
    onAssignmentComplete?: () => void;
}

export function ContentPlayer({ item, onQuizComplete, onAssignmentComplete }: ContentPlayerProps) {
    if (!item) return null;

    // ── Video ──
    if (item.type === 'video' && item.data?.url) {
        return <VideoPlayer url={item.data.url} contentItemId={item.id} />;
    }

    // ── Audio ──
    if (item.type === 'audio' && item.data?.url) {
        return (
            <View style={styles.audioCard}>
                <Text style={styles.audioIcon}>🎧</Text>
                <Text style={styles.audioTitle}>{item.data?.title || 'Audio Resource'}</Text>
                <Text style={styles.audioUrl} numberOfLines={1}>{item.data.url}</Text>
            </View>
        );
    }

    // ── HTML Simulation ──
    if (item.type === 'html_sim') {
        return <SimulationView content={item.data} style={styles.simContainer} />;
    }

    // ── Quiz ──
    if (item.type === 'quiz') {
        return (
            <InteractiveQuiz
                contentItemId={item.id}
                onComplete={(score, passed) => {
                    if (onQuizComplete) onQuizComplete(score, passed);
                }}
            />
        );
    }

    // ── PYQ (Previous Year Question) ──
    if (item.type === 'pyq') {
        return <PYQView data={item.data || {}} />;
    }

    // ── Article / Notes ──
    if (item.type === 'text') {
        return <ArticleView content={item.data || {}} />;
    }

    // ── Assignment ──
    if (item.type === 'assignment') {
        return (
            <AssignmentSubmitter
                contentItemId={item.id}
                onComplete={onAssignmentComplete}
            />
        );
    }

    // ── Default fallback ──
    return (
        <View style={styles.defaultContainer}>
            <Text style={styles.title}>{item.data?.title || 'Content Item'}</Text>
            {item.data?.description && (
                <Text style={styles.desc}>{item.data.description}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    simContainer: { height: 450, marginBottom: 16, borderRadius: 16, overflow: 'hidden' },
    audioCard: {
        backgroundColor: '#1E293B',
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    audioIcon: {
        fontSize: 48,
    },
    audioTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#fff',
        textAlign: 'center',
    },
    audioUrl: {
        fontSize: 12,
        fontWeight: '500',
        color: '#94A3B8',
        textAlign: 'center',
    },
    defaultContainer: {
        padding: 32,
        backgroundColor: COLORS.white,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    title: {
        fontFamily: 'System',
        fontWeight: '900',
        fontSize: 28,
        color: '#1E293B',
        marginBottom: 16,
        letterSpacing: -0.5,
    },
    desc: {
        fontFamily: 'System',
        fontSize: 16,
        color: '#475569',
        fontWeight: '600',
        lineHeight: 24,
    },
});
