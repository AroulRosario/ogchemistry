import { supabase } from '@/constants/supabase';
import { COLORS } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { Bell } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export function NotificationCenter() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (user) fetchNotifications();
    }, [user, isOpen]); // Re-fetch when opened

    const fetchNotifications = async () => {
        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false })
            .limit(20);
        if (data) setNotifications(data);
    };

    const markAsRead = async (id: string) => {
        await supabase.from('notifications').update({ is_read: true }).eq('id', id);
        fetchNotifications();
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <View style={styles.wrapper}>
            <Pressable
                style={styles.bellBtn}
                onPress={() => setIsOpen(true)}
            >
                <Bell size={22} color={COLORS.grayDark} strokeWidth={2.5} />
                {unreadCount > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{unreadCount}</Text>
                    </View>
                )}
            </Pressable>

            <Modal visible={isOpen} transparent animationType="fade">
                <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
                    <View style={styles.dropdown} onStartShouldSetResponder={() => true}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Notifications</Text>
                        </View>

                        <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
                            {notifications.length === 0 ? (
                                <Text style={styles.emptyText}>No new notifications.</Text>
                            ) : (
                                notifications.map(n => (
                                    <Pressable
                                        key={n.id}
                                        style={[styles.notifCard, !n.is_read && styles.unreadCard]}
                                        onPress={() => !n.is_read && markAsRead(n.id)}
                                    >
                                        <View style={styles.notifContent}>
                                            <Text style={[styles.notifTitle, !n.is_read && styles.unreadText]}>{n.title}</Text>
                                            <Text style={styles.notifMsg}>{n.message}</Text>
                                            <Text style={styles.notifTime}>{new Date(n.created_at).toLocaleDateString()}</Text>
                                        </View>
                                        {!n.is_read && <View style={styles.unreadDot} />}
                                    </Pressable>
                                ))
                            )}
                        </ScrollView>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { position: 'relative' },
    bellBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 14,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        alignSelf: 'flex-start',
        marginBottom: 16
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: COLORS.red,
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    badgeText: { color: COLORS.white, fontSize: 10, fontWeight: '800', fontFamily: 'System' },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', padding: 24, justifyContent: 'center' },
    dropdown: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        maxHeight: '70%',
        maxWidth: 400,
        width: '100%',
        alignSelf: 'center'
    },
    header: { padding: 20, borderBottomWidth: 1, borderColor: '#E2E8F0' },
    title: { fontFamily: 'System', fontSize: 18, fontWeight: '800', color: '#0F172A' },
    list: { paddingVertical: 10 },
    listContent: { paddingHorizontal: 16, paddingBottom: 20, gap: 8 },
    emptyText: { fontFamily: 'System', fontSize: 15, color: '#64748B', textAlign: 'center', marginTop: 30 },
    notifCard: { padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center' },
    unreadCard: { backgroundColor: '#EFF6FF' },
    notifContent: { flex: 1 },
    notifTitle: { fontFamily: 'System', fontSize: 15, fontWeight: '600', color: '#334155', marginBottom: 4 },
    unreadText: { fontWeight: '800', color: '#0F172A' },
    notifMsg: { fontFamily: 'System', fontSize: 14, color: '#475569', lineHeight: 20, marginBottom: 6 },
    notifTime: { fontFamily: 'System', fontSize: 12, color: '#94A3B8', fontWeight: '500' },
    unreadDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.blue, marginLeft: 12 }
});
