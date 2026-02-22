import { COLORS } from '@/constants/theme';
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
        borderRadius: 20,
        borderWidth: 4,
        borderColor: COLORS.black,
        marginBottom: 20,
        shadowColor: COLORS.black,
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 8,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.paper,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        borderWidth: 2,
        borderColor: COLORS.black,
    },
    infoContainer: {
        flex: 1,
    },
    title: {
        fontFamily: 'System',
        fontSize: 12,
        fontWeight: '900',
        color: COLORS.grayDark,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 4
    },
    course: {
        fontFamily: 'Bangers_400Regular',
        fontSize: 24,
        color: COLORS.black,
        marginBottom: 4,
        letterSpacing: 1,
    },
    date: {
        fontFamily: 'System',
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: '700'
    },
    downloadBtn: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: COLORS.black,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
        borderWidth: 2,
        borderColor: COLORS.black,
        shadowColor: COLORS.black,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 0,
        elevation: 4,
    }
});
