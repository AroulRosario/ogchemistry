import { DynamicBackground } from '@/components/DynamicBackground';
import { ModernComicButton } from '@/components/ModernComicButton';
import { supabase } from '@/constants/supabase';
import { COLORS } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function PendingApprovalScreen() {
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.replace('/auth/login');
    };

    return (
        <DynamicBackground>
            <View style={styles.container}>
                <Image
                    source={require('../assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <View style={styles.card}>
                    <Text style={styles.title}>ACCESS PENDING</Text>
                    <Text style={styles.subtitle}>
                        Your registration is complete! Our teacher needs to manually approve your account before you can access the chemistry modules.
                    </Text>
                    <Text style={styles.note}>
                        Please check back in a few hours. 🧪
                    </Text>

                    <ModernComicButton
                        title="BACK TO LOGIN"
                        onPress={handleSignOut}
                        variant="secondary"
                    />
                </View>
            </View>
        </DynamicBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 40,
    },
    card: {
        backgroundColor: COLORS.white,
        borderWidth: 3,
        borderColor: COLORS.black,
        borderRadius: 24,
        padding: 30,
        width: '100%',
        shadowColor: COLORS.black,
        shadowOffset: { width: 6, height: 6 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 10,
    },
    title: {
        fontFamily: 'Bangers_400Regular',
        fontSize: 32,
        color: COLORS.black,
        textAlign: 'center',
        marginBottom: 15,
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 15,
        fontWeight: '500',
    },
    note: {
        fontSize: 14,
        color: COLORS.blue,
        textAlign: 'center',
        fontWeight: '800',
        marginBottom: 25,
    },
});
