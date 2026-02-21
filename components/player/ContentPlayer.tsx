import { AssignmentSubmitter } from '@/components/player/AssignmentSubmitter';
import { InteractiveQuiz } from '@/components/player/InteractiveQuiz';
import { SimulationView } from '@/components/player/SimulationView';
import { VideoPlayer } from '@/components/player/VideoPlayer';
import { COLORS } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ContentPlayerProps {
    item: any;
    onQuizComplete?: (score: number, passed: boolean) => void;
    onAssignmentComplete?: () => void;
}

export function ContentPlayer({ item, onQuizComplete, onAssignmentComplete }: ContentPlayerProps) {
    if (!item) return null;

    if (item.type === 'video' && item.data?.url) {
        return <VideoPlayer url={item.data.url} contentItemId={item.id} />;
    }

    if (item.type === 'html_sim') {
        return <SimulationView content={item.data} style={styles.simContainer} />;
    }

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

    if (item.type === 'assignment') {
        return (
            <AssignmentSubmitter
                contentItemId={item.id}
                onComplete={onAssignmentComplete}
            />
        );
    }

    // Default rich text or unsupported rendering
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
    }
});
