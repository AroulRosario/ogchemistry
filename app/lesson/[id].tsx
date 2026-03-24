import { DynamicBackground } from '@/components/DynamicBackground';
import { MOCK_CHAPTERS } from '@/constants/mockData';
import { supabase } from '@/constants/supabase';
import { COLORS, STYLES } from '@/constants/theme';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

export default function LessonScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [chapters, setChapters] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => { fetchChapters(); }, [id]);

    const fetchChapters = async () => {
        try {
            const { data, error } = await supabase.from('chapters').select('*').eq('lesson_id', id).order('order');
            setChapters(error || !data || data.length === 0 ? MOCK_CHAPTERS : data);
        } catch { setChapters(MOCK_CHAPTERS); }
    };

    return (
        <DynamicBackground>
            <Stack.Screen options={{
                headerShown: true,
                title: 'Chapters',
                headerStyle: { backgroundColor: COLORS.white },
                headerTitleStyle: { fontWeight: '900', fontSize: 22, color: COLORS.black },
                headerTintColor: COLORS.blue,
                headerShadowVisible: false,
            }} />
            <FlatList
                data={chapters}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <Pressable
                        style={({ pressed }) => [styles.card, STYLES.card, pressed && styles.cardPressed]}
                        onPress={() => router.push(`/chapter/${item.id}`)}
                    >
                        <View style={[styles.badge, { backgroundColor: index % 2 === 0 ? COLORS.yellow : COLORS.blue }]}>
                            <Text style={[styles.badgeText, { color: index % 2 === 0 ? COLORS.black : COLORS.white }]}>{index + 1}</Text>
                        </View>
                        <Text style={[styles.title, { flex: 1 }]}>{item.title}</Text>
                        <Text style={styles.arrow}>→</Text>
                    </Pressable>
                )}
            />
        </DynamicBackground>
    );
}

const styles = StyleSheet.create({
    list: { padding: 16, paddingBottom: 60 },
    card: {
        flexDirection: 'row', alignItems: 'center', padding: 16, marginBottom: 12,
    },
    cardPressed: { transform: [{ scale: 0.98 }] },
    badge: {
        width: 40, height: 40, borderRadius: 10, borderWidth: 2, borderColor: COLORS.black,
        alignItems: 'center', justifyContent: 'center', marginRight: 14,
    },
    badgeText: { fontWeight: '900', fontSize: 18 },
    title: { fontWeight: '800', fontSize: 18, color: COLORS.black, letterSpacing: -0.3 },
    arrow: { fontSize: 20, color: COLORS.blue, fontWeight: '700', marginLeft: 8 },
});
