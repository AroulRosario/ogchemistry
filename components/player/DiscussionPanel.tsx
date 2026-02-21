import { supabase } from '@/constants/supabase';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, Send, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface DiscussionPanelProps {
    contentItemId: string;
    visible: boolean;
    onClose: () => void;
}

export function DiscussionPanel({ contentItemId, visible, onClose }: DiscussionPanelProps) {
    const { user } = useAuth();
    const [discussions, setDiscussions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [newQuestion, setNewQuestion] = useState('');

    useEffect(() => {
        if (visible && contentItemId) {
            fetchDiscussions();
        }
    }, [visible, contentItemId]);

    const fetchDiscussions = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('discussions')
            .select('*, discussion_replies(*), profiles:user_id(full_name, avatar_url, role)')
            .eq('content_item_id', contentItemId)
            .order('created_at', { ascending: false });
        if (data) setDiscussions(data);
        setLoading(false);
    };

    const handlePost = async () => {
        if (!newQuestion.trim() || !user) return;

        await supabase.from('discussions').insert({
            content_item_id: contentItemId,
            user_id: user.id,
            body: newQuestion.trim()
        });

        setNewQuestion('');
        fetchDiscussions();
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.panel}>
                    <View style={styles.header}>
                        <View style={styles.titleRow}>
                            <MessageSquare color={COLORS.black} size={24} />
                            <Text style={styles.title}>Q&A Discussion</Text>
                        </View>
                        <Pressable onPress={onClose} style={styles.closeBtn}>
                            <X color={COLORS.grayDark} size={24} />
                        </Pressable>
                    </View>

                    <ScrollView style={styles.content} contentContainerStyle={{ padding: 24, gap: 16 }}>
                        {loading ? (
                            <ActivityIndicator color={COLORS.blue} />
                        ) : discussions.length === 0 ? (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>No questions yet. Be the first to ask!</Text>
                            </View>
                        ) : (
                            discussions.map(d => (
                                <View key={d.id} style={styles.discussionCard}>
                                    <View style={styles.dHeader}>
                                        <View style={styles.avatar} />
                                        <View>
                                            <Text style={styles.authorName}>{d.profiles?.full_name || 'Student'}</Text>
                                            <Text style={styles.date}>{new Date(d.created_at).toLocaleDateString()}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.bodyText}>{d.body}</Text>

                                    {d.discussion_replies && d.discussion_replies.length > 0 && (
                                        <View style={styles.repliesList}>
                                            {d.discussion_replies.map((r: any) => (
                                                <View key={r.id} style={[styles.replyCard, r.is_official_answer && styles.officialReply]}>
                                                    <Text style={styles.replyAuthor}>{r.is_official_answer ? '👨‍🏫 Official Reply' : 'Student Reply'}</Text>
                                                    <Text style={styles.replyBody}>{r.body}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            ))
                        )}
                    </ScrollView>

                    <View style={styles.inputArea}>
                        <TextInput
                            style={styles.input}
                            placeholder="Ask a question about this content..."
                            value={newQuestion}
                            onChangeText={setNewQuestion}
                            multiline
                        />
                        <Pressable
                            style={[styles.postBtn, !newQuestion.trim() && styles.postBtnDisabled]}
                            onPress={handlePost}
                            disabled={!newQuestion.trim()}
                        >
                            <Send size={20} color={COLORS.white} />
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    panel: {
        height: '80%',
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderBottomWidth: 1, borderColor: '#E2E8F0' },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    title: { fontFamily: 'System', fontSize: 20, fontWeight: '800', color: '#0F172A' },
    closeBtn: { padding: 4 },
    content: { flex: 1, backgroundColor: '#F8FAFC' },
    emptyState: { padding: 40, alignItems: 'center' },
    emptyText: { fontFamily: 'System', fontSize: 16, color: '#64748B', fontWeight: '500' },
    discussionCard: { backgroundColor: COLORS.white, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
    dHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.blue, opacity: 0.2 },
    authorName: { fontFamily: 'System', fontSize: 15, fontWeight: '700', color: '#0F172A' },
    date: { fontFamily: 'System', fontSize: 13, color: '#64748B' },
    bodyText: { fontFamily: 'System', fontSize: 16, color: '#334155', lineHeight: 24 },
    repliesList: { marginTop: 16, gap: 8, paddingLeft: 16, borderLeftWidth: 2, borderColor: '#E2E8F0' },
    replyCard: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12 },
    officialReply: { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', borderWidth: 1 },
    replyAuthor: { fontFamily: 'System', fontSize: 13, fontWeight: '700', color: '#64748B', marginBottom: 4 },
    replyBody: { fontFamily: 'System', fontSize: 15, color: '#334155', lineHeight: 22 },
    inputArea: { flexDirection: 'row', padding: 16, paddingBottom: 32, backgroundColor: COLORS.white, borderTopWidth: 1, borderColor: '#E2E8F0', gap: 12 },
    input: { flex: 1, backgroundColor: '#F1F5F9', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 12, minHeight: 48, maxHeight: 120, fontFamily: 'System', fontSize: 16, color: '#0F172A' },
    postBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.blue, alignItems: 'center', justifyContent: 'center' },
    postBtnDisabled: { opacity: 0.5 }
});
