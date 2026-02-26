import { supabase } from '@/constants/supabase';
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function PendingApprovalScreen() {
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.replace('/auth/login');
    };

    return (
        <View style={styles.mainLayout}>
            <View style={styles.card}>
                <Image
                    source={require('../assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.title}>ACCESS PENDING</Text>

                <View style={styles.messageBox}>
                    <Text style={styles.subtitle}>
                        Your registration is complete! Our teacher needs to manually approve your account before you can access the chemistry modules.
                    </Text>
                    <Text style={styles.note}>
                        Please check back in a few hours.
                    </Text>
                </View>

                <Pressable
                    style={({ pressed }) => [
                        styles.primaryBtn,
                        pressed && styles.btnPressed
                    ]}
                    onPress={handleSignOut}
                >
                    <Text style={styles.primaryBtnText}>Return to Login</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainLayout: {
        flex: 1,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 24,
    },
    card: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 30,
        elevation: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -0.5,
        marginBottom: 24,
    },
    messageBox: {
        backgroundColor: '#F8FAFC',
        padding: 20,
        borderRadius: 16,
        marginBottom: 32,
        width: '100%',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    subtitle: {
        fontSize: 15,
        color: '#475569',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 12,
        fontWeight: '500',
    },
    note: {
        fontSize: 15,
        color: '#2563EB',
        textAlign: 'center',
        fontWeight: '700',
    },
    primaryBtn: {
        backgroundColor: '#0F172A',
        height: 56,
        width: '100%',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryBtnText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    btnPressed: {
        opacity: 0.9,
        transform: [{ scale: 0.99 }],
    },
});
