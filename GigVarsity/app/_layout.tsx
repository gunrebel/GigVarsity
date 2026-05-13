import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { useAuthStore } from '../store/authStore';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const { isReady } = useAuth();
  const { user, role, isLoading } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (!isReady || isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && role === 'student') {
      router.replace('/(student)/home');
    } else if (user && role === 'company') {
      router.replace('/(company)/dashboard');
    } else if (user && !role) {
      router.replace('/(auth)/choose-role');
    }
  }, [isReady, user, role, isLoading]);

  if (!isReady || isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#F9FAFB' 
      }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(student)" />
      <Stack.Screen name="(company)" />
    </Stack>
  );
}
