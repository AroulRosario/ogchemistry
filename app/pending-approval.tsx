import { supabase } from '@/constants/supabase';
import { useRouter } from 'expo-router';
import { Clock, LogOut, RefreshCw } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PendingApprovalScreen() {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        await supabase.auth.refreshSession();
        setRefreshing(false);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.replace('/auth/login');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.mainLayout}>
                <View style={styles.card}>

                    {/* Icon */}
                    <View style={styles.iconWrapper}>
                        <Clock size={32} color="#2563EB" strokeWidth={2} />
                    </View>

                    {/* Text */}
                    <Text style={styles.title}>Access Pending</Text>
                    <Text style={styles.subtitle}>
                        Your registration is complete! Your teacher needs to manually approve your account before you can access the chemistry modules.
                    </Text>
                    <Text style={styles.hint}>
                        Please check back in a few hours. ✏️
                    </Text>

                    {/* Refresh Button */}
                    <Pressable
                        style={({ pressed }) => [styles.primaryBtn, pressed && styles.btnPressed]}
                        onPress={handleRefresh}
                        disabled={refreshing}
                    >
                        {refreshing ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <>
                                <RefreshCw size={16} color="#fff" />
                                <Text style={styles.primaryBtnText}>Check Status</Text>
                            </>
                        )}
                    </Pressable>

                    {/* Sign Out */}
                    <Pressable
                        style={({ pressed }) => [styles.secondaryBtn, pressed && { opacity: 0.7 }]}
                        onPress={handleSignOut}
                    >
                        <LogOut size={15} color="#64748B" />
                        <Text style={styles.secondaryBtnText}>Back to Login</Text>
                    </Pressable>

                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    mainLayout: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
        maxWidth: 380,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    iconWrapper: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 26,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -0.5,
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: '#475569',
        lineHeight: 23,
        textAlign: 'center',
        marginBottom: 8,
    },
    hint: {
        fontSize: 14,
        color: '#2563EB',
        fontWeight: '600',
        marginBottom: 28,
        textAlign: 'center',
    },
    primaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#2563EB',
        width: '100%',
        height: 52,
        borderRadius: 14,
        marginBottom: 12,
    },
    btnPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.99 }],
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    secondaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: 14,
        width: '100%',
    },
    secondaryBtnText: {
        color: '#64748B',
        fontSize: 14,
        fontWeight: '600',
    },
});
