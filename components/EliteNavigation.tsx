import { NotificationCenter } from '@/components/NotificationCenter';
import { COLORS, STYLES } from '@/constants/theme';
import { usePathname, useRouter } from 'expo-router';
import { BookOpen, Compass, Layout, Menu, Trophy, User, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

export function EliteNavigation() {
    const router = useRouter();
    const pathname = usePathname();
    const { width } = useWindowDimensions();
    const isDesktop = width > 800;
    const [isOpen, setIsOpen] = useState(false);
    const slideAnim = React.useRef(new Animated.Value(isDesktop ? 0 : -350)).current;
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    const toggleMenu = () => {
        const toValue = isOpen ? (isDesktop ? 0 : -350) : 0;
        const toFade = isOpen ? 0 : 1;

        if (!isOpen) setIsOpen(true);

        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue,
                useNativeDriver: true,
                tension: 65,
                friction: 11,
            }),
            Animated.timing(fadeAnim, {
                toValue: toFade,
                duration: 250,
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
                                color={isActive ? COLORS.white : COLORS.black}
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
            {!isDesktop && (
                <Pressable style={styles.menuToggle} onPress={toggleMenu}>
                    <View style={styles.toggleCard}>
                        <View style={styles.menuToggleContent}>
                            {isOpen ? <X size={28} color={COLORS.black} strokeWidth={2.5} /> : <Menu size={28} color={COLORS.black} strokeWidth={2.5} />}
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
                <View style={styles.inner}>
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
                                <X size={24} color={COLORS.black} strokeWidth={2.5} />
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
                <Pressable style={StyleSheet.absoluteFill} onPress={toggleMenu}>
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
        zIndex: 1000,
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
        backgroundColor: '#FFFFFF', // Clean white background
        padding: 20,
        paddingTop: 32,
        borderRightWidth: 1,
        borderColor: '#EFEFEF', // Very subtle border instead of heavy black line
        shadowColor: '#000', // Add a very soft drop shadow for depth
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
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
        fontFamily: 'System', // Shift from LuckiestGuy to System Sans
        fontWeight: '800',
        fontSize: 22,
        color: '#1A1A1A',
        letterSpacing: -0.5,
    },
    divider: {
        height: 1,
        backgroundColor: '#EFEFEF', // Light gray divider
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
        backgroundColor: '#F3F4F6', // Soft gray background for active state like YouTube
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
        fontWeight: '500',
        fontSize: 16,
        color: '#4B5563', // Soft gray text
    },
    activeNavText: {
        color: '#111827', // Dark, bold active text
        fontWeight: '700',
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
        fontWeight: '600',
        fontSize: 11,
        color: '#6B7280',
        letterSpacing: 0.5,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F3F4F6', // Light gray instead of stark black
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
        fontWeight: '700',
        color: '#4B5563',
        letterSpacing: 0.5,
    },
    menuToggle: {
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 1100,
    },
    toggleCard: {
        borderRadius: 12,
        backgroundColor: COLORS.white,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    menuToggleContent: {
        padding: 0,
    },
    mobileProfileHeader: {
        backgroundColor: '#F3F4F6',
        padding: 16,
        marginHorizontal: -20,
        marginTop: -32,
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
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
        color: '#111827',
        marginBottom: 4,
    },
    mobileStatusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    mobileStatusText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.green,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
    }
});
