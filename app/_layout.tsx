import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Bangers_400Regular } from '@expo-google-fonts/bangers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const { session, profile, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const hasNavigated = useRef(false);

  const [loaded] = useFonts({
    Bangers_400Regular,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (loading || !loaded) return;

    const navigate = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        const currentSegments = segments as any;
        const inAuthGroup = currentSegments[0] === 'auth';
        const inOnboardingGroup = currentSegments[0] === 'onboarding';
        const inAdminGroup = currentSegments[0] === 'admin';
        const inPendingGroup = currentSegments[0] === 'pending-approval';

        console.log('[RootLayout] Navigation check:', {
          hasLaunched,
          hasSession: !!session,
          status: profile?.status,
          segments: segments.join('/'),
          inAuthGroup,
        });

        // Always allow Admin access (for development/bypass)
        if (inAdminGroup) return;

        // 1. First launch → Onboarding
        if (hasLaunched === null && !inOnboardingGroup) {
          console.log('[RootLayout] → Redirecting to onboarding');
          router.replace('/onboarding');
          return;
        }

        // 2. Not logged in → Login
        if (hasLaunched !== null && !session && !inAuthGroup) {
          console.log('[RootLayout] → Redirecting to login');
          router.replace('/auth/login');
          return;
        }

        // 3. Logged in check
        if (session) {
          // A. If NOT approved and NOT on pending screen → Redirect to pending
          if (profile && profile.status !== 'approved' && !inPendingGroup && !inAuthGroup) {
            console.log('[RootLayout] → Redirecting to pending-approval (Status:', profile.status, ')');
            router.replace('/pending-approval' as any);
            return;
          }

          // B. If approved and on auth/onboarding/pending pages → Home
          if (profile?.status === 'approved' && (inAuthGroup || inOnboardingGroup || inPendingGroup)) {
            console.log('[RootLayout] → Redirecting to home (user is approved)');
            router.replace('/');
            return;
          }
        }

        console.log('[RootLayout] → No redirect needed');
      } catch (error) {
        console.error('[RootLayout] Navigation error:', error);
      }
    };

    navigate();
  }, [session, profile, loading, segments, loaded]);

  if (!loaded || loading) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          presentation: 'card',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth" options={{
          presentation: 'fullScreenModal',
          animation: 'slide_from_bottom',
        }} />
        <Stack.Screen name="onboarding/index" options={{
          animation: 'fade',
        }} />
        <Stack.Screen name="pending-approval" options={{
          animation: 'fade',
        }} />
        <Stack.Screen name="admin/index" options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
