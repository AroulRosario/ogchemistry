import { ArticleView } from '@/components/player/ArticleView';
import { AssignmentSubmitter } from '@/components/player/AssignmentSubmitter';
import { InteractiveQuiz } from '@/components/player/InteractiveQuiz';
import { PYQView } from '@/components/player/PYQView';
import { SimulationView } from '@/components/player/SimulationView';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { LaTeXText } from '@/components/LaTeXText';
import { COLORS, SHADOWS, TYPOGRAPHY } from '@/constants/theme';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

interface ContentPlayerProps {
    item: any;
    onQuizComplete?: (score: number, passed: boolean) => void;
    onAssignmentComplete?: () => void;
}

export function ContentPlayer({ item, onQuizComplete, onAssignmentComplete }: ContentPlayerProps) {
    if (!item) return null;

    // ── VIRTUAL TYPE FIX ──
    const trueType = item.data?.typeOverride || item.type;

    // ── Video ──
    if (trueType === 'video' && item.data?.url) {
        return <VideoPlayer url={item.data.url} contentItemId={item.id} />;
    }

    // ── Audio ──
    if (trueType === 'audio' && item.data?.url) {
        return (
            <View style={styles.audioCard}>
                <Text style={styles.audioIcon}>🎧</Text>
                <Text style={styles.audioTitle}>{item.data?.title || 'Audio Resource'}</Text>
                <Text style={styles.audioUrl} numberOfLines={1}>{item.data.url}</Text>
            </View>
        );
    }

    // ── HTML Simulation ──
    if (trueType === 'html_sim') {
        return <SimulationView content={item.data} style={styles.simContainer} />;
    }

    // ── Quiz ──
    if (trueType === 'quiz') {
        return (
            <InteractiveQuiz
                data={item.data}
                onComplete={(score, passed) => {
                    if (onQuizComplete) onQuizComplete(score, passed);
                }}
            />
        );
    }

    // ── PYQ (Previous Year Question) ──
    if (trueType === 'pyq') {
        return <PYQView data={item.data || {}} />;
    }

    // ── Article / Notes ──
    if (trueType === 'text') {
        return <ArticleView content={item.data || {}} />;
    }

    // ── Assignment ──
    if (trueType === 'assignment') {
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
    simContainer: { height: 450, marginBottom: 24, borderRadius: 24, overflow: 'hidden', ...SHADOWS.md },
    audioCard: {
        backgroundColor: '#0F172A',
        borderRadius: 32,
        padding: 40,
        alignItems: 'center',
        gap: 16,
        ...SHADOWS.lg,
    },
    audioIcon: {
        fontSize: 56,
    },
    audioTitle: {
        ...(TYPOGRAPHY.h2 as any),
        color: '#fff',
        textAlign: 'center',
    },
    audioUrl: {
        ...(TYPOGRAPHY.label as any),
        color: '#94A3B8',
        textAlign: 'center',
    },
    defaultContainer: {
        padding: 40,
        backgroundColor: COLORS.white,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        ...SHADOWS.md,
    },
    title: {
        ...(TYPOGRAPHY.h1 as any),
        color: '#1E293B',
        marginBottom: 20,
    },
    desc: {
        ...(TYPOGRAPHY.body as any),
        color: '#475569',
        fontWeight: '600',
    },
});
