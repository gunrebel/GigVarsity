import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function IndexRedirect() {
  const router = useRouter();
  const segments = useSegments();
  const { user, role, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user) {
      // Not logged in, redirect to login
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    } else if (role === 'student') {
      // Student, redirect to student home
      if (!segments.some(s => s.includes('student'))) {
        router.replace('/(student)/home');
      }
    } else if (role === 'company') {
      // Company, redirect to company dashboard
      if (!segments.some(s => s.includes('company'))) {
        router.replace('/(company)/dashboard');
      }
    }
  }, [user, role, isLoading, segments, router]);

  return null;
}
