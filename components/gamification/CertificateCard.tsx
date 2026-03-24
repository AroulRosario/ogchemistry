import { COLORS, SHADOWS } from '@/constants/theme';
import { Award, Download } from 'lucide-react-native';
import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

interface CertificateCardProps {
    certificate: any;
    courseName?: string;
}

export function CertificateCard({ certificate, courseName = 'OG Chem Mastery' }: CertificateCardProps) {

    const handleDownload = () => {
        if (certificate.certificate_url) {
            Linking.openURL(certificate.certificate_url);
        } else {
            alert("Certificate generation pending. Please check back later.");
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <Award size={40} color={COLORS.orange} />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.title}>Certificate of Completion</Text>
                <Text style={styles.course}>{courseName}</Text>
                <Text style={styles.date}>Issued: {new Date(certificate.issued_at).toLocaleDateString()}</Text>
            </View>
            <Pressable style={styles.downloadBtn} onPress={handleDownload}>
                <Download size={20} color={COLORS.white} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        backgroundColor: COLORS.white,
        borderRadius: 24,
        marginBottom: 20,
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFF7ED', // Soft orange background
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    infoContainer: {
        flex: 1,
    },
    title: {
        fontFamily: 'System',
        fontSize: 12,
        fontWeight: '900',
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4
    },
    course: {
        fontFamily: 'System',
        fontWeight: '900',
        fontSize: 22,
        color: '#0F172A',
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    date: {
        fontFamily: 'System',
        fontSize: 13,
        color: '#64748B',
        fontWeight: '700'
    },
    downloadBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.blue,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
        ...SHADOWS.sm,
    }
});
