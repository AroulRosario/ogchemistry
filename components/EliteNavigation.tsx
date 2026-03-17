import { NotificationCenter } from '@/components/NotificationCenter';
import { COLORS, STYLES } from '@/constants/theme';
import { usePathname, useRouter } from 'expo-router';
import { BookOpen, Compass, Layout, Menu, Trophy, User, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function EliteNavigation() {
    const router = useRouter();
    const pathname = usePathname();
    const { width } = useWindowDimensions();
    const isDesktop = width > 800;
    const [isOpen, setIsOpen] = useState(false);
    const slideAnim = React.useRef(new Animated.Value(isDesktop ? 0 : -350)).current;
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const insets = useSafeAreaInsets();

    const toggleMenu = () => {
        const toValue = isOpen ? (isDesktop ? 0 : -350) : 0;
        const toFade = isOpen ? 0 : 1;

        if (!isOpen) setIsOpen(true);

        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue,
                duration: isOpen ? 220 : 280,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: toFade,
                duration: 200,
                useNativeDriver: true,
            })
        ]).start(() => {
            if (isOpen) setIsOpen(false);
        });
    };

    const navItems = [
        { name: 'Path', icon: Layout, path: '/' },
        { name: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
        { name: 'Library', icon: BookOpen, path: '/library' }, // Assuming switching logic or new route
        { name: 'Explore', icon: Compass, path: '/explore' },
        { name: 'Profile', icon: User, path: '/profile' },
    ];

    // ... Inside EliteNavigation component ...
    const renderNavItems = () => (
        <View style={styles.navItemsContainer}>
            {navItems.map((item) => {
                const isActive = pathname === item.path || (item.path === '/' && pathname === '/index');
                return (
                    <Pressable
                        key={item.name}
                        style={({ pressed }) => [
                            styles.navItem,
                            isActive && styles.activeNavItem,
                            pressed && { transform: [{ scale: 0.98 }] }
                        ]}
                        onPress={() => {
                            router.push(item.path as any);
                            if (!isDesktop) setIsOpen(false);
                        }}
                    >
                        <View style={[
                            styles.iconBox,
                            isActive && styles.activeIconBox,
                            isActive && STYLES.premiumShadow
                        ]}>
                            <item.icon
                                size={22}
                                color={isActive ? COLORS.white : 'rgba(255,255,255,0.7)'}
                                strokeWidth={isActive ? 3.5 : 2.5}
                            />
                        </View>
                        <Text style={[
                            styles.navText,
                            isActive && styles.activeNavText,
                        ]}>
                            {item.name.toUpperCase()}
                        </Text>
                        {isActive && (
                            <Animated.View style={styles.activeIndicator} />
                        )}
                    </Pressable>
                );
            })}
        </View>
    );

    return (
        <>
            {!isDesktop && !isOpen && (
                <Pressable
                    style={[styles.menuToggle, { top: insets.top + 8 }]}
                    onPress={toggleMenu}
                >
                    <View style={styles.toggleCard}>
                        <View style={styles.menuToggleContent}>
                            <Menu size={24} color={COLORS.black} strokeWidth={2.5} />
                        </View>
                    </View>
                </Pressable>
            )}

            <Animated.View
                style={[
                    styles.container,
                    isDesktop ? styles.desktopContainer : styles.mobileContainer,
                    { transform: [{ translateX: isDesktop ? 0 : slideAnim }] }
                ]}
            >
                <View style={[styles.inner, { paddingTop: insets.top + 16 }]}>
                    {!isDesktop && (
                        <View style={styles.mobileProfileHeader}>
                            <View style={styles.mobileAvatar}>
                                <Text style={{ fontSize: 24 }}>🎓</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.mobileName} numberOfLines={1}>Student Model</Text>
                                <View style={styles.mobileStatusBadge}>
                                    <View style={styles.dot} />
                                    <Text style={styles.mobileStatusText}>OG LEARNER</Text>
                                </View>
                            </View>
                            <Pressable style={styles.closeBtn} onPress={toggleMenu}>
                                <X size={24} color={COLORS.white} strokeWidth={2.5} />
                            </Pressable>
                        </View>
                    )}

                    <View style={styles.header}>
                        <Image source={require('../assets/images/logo.png')} style={{ width: 40, height: 40, marginRight: 12 }} resizeMode="contain" />
                        <Text style={styles.logoText}>OG CHEM</Text>
                    </View>

                    <NotificationCenter />
                    <View style={styles.divider} />

                    {renderNavItems()}

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>OG CHEMISTRY PLATFORM</Text>
                        <View style={styles.statusBadge}>
                            <View style={styles.dot} />
                            <Text style={styles.statusText}>SYSTEM ACTIVE</Text>
                        </View>
                    </View>
                </View>
            </Animated.View>

            {!isDesktop && isOpen && (
                <Pressable style={[StyleSheet.absoluteFill, { zIndex: 1050, elevation: 15 }]} onPress={toggleMenu}>
                    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
                </Pressable>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        zIndex: 1100,
        elevation: 20,
    },
    desktopContainer: {
        left: 0,
        width: 260,
    },
    mobileContainer: {
        left: 0,
        width: '85%',
        maxWidth: 320,
    },
    inner: {
        flex: 1,
        backgroundColor: COLORS.blue,
        padding: 20,
        paddingTop: 20,
        borderRightWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 32,
        paddingHorizontal: 8,
    },
    logoCircle: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: COLORS.blue,
        justifyContent: 'center',
        alignItems: 'center',
        // Removed heavy borders and comic shadows
    },
    logoText: {
        fontFamily: 'System',
        fontWeight: '800',
        fontSize: 22,
        color: COLORS.white,
        letterSpacing: -0.5,
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginBottom: 24,
    },
    navItemsContainer: {
        flex: 1,
        gap: 4, // Tighter gap for modern list feel
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16, // Increased from 12 for better touch
        paddingHorizontal: 20,
        borderRadius: 16,
        gap: 16,
        backgroundColor: 'transparent',
    },
    activeNavItem: {
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    iconBox: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeIconBox: {
        // No special background needed anymore, just icon color change
    },
    navText: {
        fontFamily: 'System',
        fontWeight: '600',
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
    },
    activeNavText: {
        color: COLORS.white,
        fontWeight: '800',
    },
    activeIndicator: {
        display: 'none', // Remove the blue dot indicator for a flatter cleaner look
    },
    footer: {
        marginTop: 'auto',
        alignItems: 'center',
        gap: 8,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
    },
    footerDash: {
        display: 'none', // Remove heavy comic dash
    },
    footerText: {
        fontFamily: 'System',
        fontWeight: '700',
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.5)',
        letterSpacing: 0.5,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.green,
    },
    statusText: {
        fontFamily: 'System',
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(255, 255, 255, 0.8)',
        letterSpacing: 0.5,
    },
    menuToggle: {
        position: 'absolute',
        left: 16,
        zIndex: 1100,
        elevation: 10,
    },
    toggleCard: {
        borderRadius: 24,
        backgroundColor: COLORS.white,
        width: 52,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 4,
    },
    menuToggleContent: {
        padding: 0,
    },
    mobileProfileHeader: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        marginHorizontal: -20,
        marginTop: -32,
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    closeBtn: {
        padding: 8,
        marginRight: -4,
    },
    mobileAvatar: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        ...STYLES.premiumShadow,
    },
    mobileName: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.white,
        marginBottom: 4,
    },
    mobileStatusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    mobileStatusText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#86efac',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
    }
});
