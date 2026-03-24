import { supabase } from '@/constants/supabase';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, FileText, Upload } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface AssignmentSubmitterProps {
    contentItemId: string;
    onComplete?: () => void;
}

export function AssignmentSubmitter({ contentItemId, onComplete }: AssignmentSubmitterProps) {
    const { user } = useAuth();
    const [assignment, setAssignment] = useState<any>(null);
    const [submission, setSubmission] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [textInput, setTextInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, [contentItemId, user]);

    const loadData = async () => {
        setLoading(true);
        // Load Assignment Details
        const { data: assignData } = await supabase
            .from('assignments')
            .select('*')
            .eq('content_item_id', contentItemId)
            .single();

        if (assignData) {
            setAssignment(assignData);
            if (user) {
                // Load existing submission
                const { data: subData } = await supabase
                    .from('assignment_submissions')
                    .select('*')
                    .eq('assignment_id', assignData.id)
                    .eq('user_id', user.id)
                    .single();
                if (subData) {
                    setSubmission(subData);
                    setTextInput(subData.content || '');
                }
            }
        }
        setLoading(false);
    };

    const handleSubmit = async () => {
        if (!user || !assignment || !textInput.trim()) return;
        setIsSubmitting(true);

        try {
            const { data, error } = await supabase.from('assignment_submissions').upsert({
                assignment_id: assignment.id,
                user_id: user.id,
                content: textInput.trim(),
                status: 'submitted',
                submitted_at: new Date().toISOString()
            }, { onConflict: 'assignment_id,user_id' }).select().single();

            if (error) throw error;

            setSubmission(data);
            Alert.alert("Success!", "Your assignment has been submitted for grading.");
            if (onComplete) onComplete();
        } catch (e) {
            Alert.alert("Error", "Could not submit assignment.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <View style={styles.center}><ActivityIndicator color={COLORS.blue} /></View>;
    if (!assignment) return <View style={styles.center}><Text>No assignment configured for this item.</Text></View>;

    const isGraded = submission?.status === 'graded';
    const isSubmitted = submission?.status === 'submitted';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.iconBox}>
                    <FileText color={COLORS.blue} size={28} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{assignment.title}</Text>
                    <Text style={styles.due}>Due: {assignment.due_date ? new Date(assignment.due_date).toLocaleDateString() : 'No Due Date'}</Text>
                </View>
            </View>

            <View style={styles.descBox}>
                <Text style={styles.descTitle}>Instructions</Text>
                <Text style={styles.descText}>{assignment.description}</Text>
            </View>

            {isGraded ? (
                <View style={styles.gradedBox}>
                    <View style={styles.gradeHeader}>
                        <CheckCircle color={COLORS.green} size={24} />
                        <Text style={styles.gradedTitle}>Graded</Text>
                    </View>
                    <View style={styles.scoreRow}>
                        <Text style={styles.scoreLabel}>Score:</Text>
                        <Text style={[styles.scoreVal, submission.score >= assignment.passing_score ? { color: COLORS.green } : { color: COLORS.red }]}>
                            {submission.score} / 100
                        </Text>
                    </View>
                    {submission.feedback && (
                        <View style={styles.feedbackBox}>
                            <Text style={styles.feedbackLabel}>Instructor Feedback:</Text>
                            <Text style={styles.feedbackText}>{submission.feedback}</Text>
                        </View>
                    )}
                    <Pressable style={styles.continueBtn} onPress={onComplete}>
                        <Text style={styles.continueText}>Continue</Text>
                    </Pressable>
                </View>
            ) : (
                <View style={styles.submissionBox}>
                    <Text style={styles.submitTitle}>Your Work</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Write your answer or paste a link to your work here..."
                        placeholderTextColor="#94A3B8"
                        multiline
                        textAlignVertical="top"
                        value={textInput}
                        onChangeText={setTextInput}
                        editable={!isSubmitting}
                    />

                    <View style={styles.actionRow}>
                        {isSubmitted && <Text style={styles.submittedStatus}>✅ Submitted for grading</Text>}
                        <Pressable
                            style={[styles.submitBtn, (!textInput.trim() || isSubmitting) && styles.submitDisabled]}
                            onPress={handleSubmit}
                            disabled={!textInput.trim() || isSubmitting}
                        >
                            {isSubmitting ? (
                                <ActivityIndicator color={COLORS.white} />
                            ) : (
                                <>
                                    <Upload color={COLORS.white} size={18} style={{ marginRight: 8 }} />
                                    <Text style={styles.submitBtnText}>{isSubmitted ? 'Update Submission' : 'Submit Assignment'}</Text>
                                </>
                            )}
                        </Pressable>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    center: { padding: 40, alignItems: 'center' },
    container: { backgroundColor: COLORS.white, borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 4, borderWidth: 1, borderColor: '#E2E8F0' },
    header: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
    iconBox: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
    title: { fontFamily: 'System', fontWeight: '900', fontSize: 24, color: '#0F172A', marginBottom: 4, letterSpacing: -0.5 },
    due: { fontFamily: 'System', fontSize: 13, fontWeight: '700', color: '#64748B' },
    descBox: { backgroundColor: '#F8FAFC', padding: 20, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#E2E8F0' },
    descTitle: { fontFamily: 'System', fontSize: 13, fontWeight: '800', color: '#64748B', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 },
    descText: { fontFamily: 'System', fontSize: 15, color: '#334155', lineHeight: 22, fontWeight: '500' },
    submissionBox: { gap: 12 },
    submitTitle: { fontFamily: 'System', fontWeight: '800', fontSize: 20, color: '#0F172A', letterSpacing: -0.3 },
    textInput: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 16, fontSize: 16, fontFamily: 'System', color: '#0F172A', minHeight: 150 },
    actionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 12, gap: 16 },
    submittedStatus: { fontFamily: 'System', fontSize: 14, fontWeight: '800', color: COLORS.green },
    submitBtn: { flexDirection: 'row', backgroundColor: COLORS.blue, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    submitDisabled: { opacity: 0.5 },
    submitBtnText: { fontFamily: 'System', fontSize: 16, fontWeight: '800', color: COLORS.white },
    gradedBox: { backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0', padding: 24, borderRadius: 20 },
    gradeHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
    gradedTitle: { fontFamily: 'System', fontWeight: '900', fontSize: 24, color: COLORS.green, letterSpacing: -0.5 },
    scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
    scoreLabel: { fontFamily: 'System', fontSize: 16, fontWeight: '800', color: '#64748B' },
    scoreVal: { fontFamily: 'System', fontWeight: '900', fontSize: 32 },
    feedbackBox: { backgroundColor: COLORS.white, padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0' },
    feedbackLabel: { fontFamily: 'System', fontSize: 13, fontWeight: '800', color: '#0F172A', marginBottom: 6 },
    feedbackText: { fontFamily: 'System', fontSize: 15, color: '#334155', lineHeight: 22, fontWeight: '500' },
    continueBtn: { backgroundColor: COLORS.green, padding: 16, borderRadius: 12, alignItems: 'center' },
    continueText: { fontFamily: 'System', fontWeight: '800', fontSize: 18, color: COLORS.white }
});
