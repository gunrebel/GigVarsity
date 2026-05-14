import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button } from 'react-native-paper';

import { loginUser, loginWithGoogle } from '@/services/authService';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useThemePalette } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

export default function LoginScreen() {
  const palette = useThemePalette();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  const router = useRouter();
  const role = useAuthStore((state) => state.role);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onLogin = async () => {
    setError('');
    setLoading(true);

    try {
      await loginUser(email, password);
      if (role === 'student') {
        router.replace('/(student)/home');
      } else if (role === 'company') {
        router.replace('/(company)/dashboard');
      } else {
        router.replace('/(auth)/choose-role');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      await loginWithGoogle();
      if (role === 'student') {
        router.replace('/(student)/home');
      } else if (role === 'company') {
        router.replace('/(company)/dashboard');
      } else {
        router.replace('/(auth)/choose-role');
      }
    } catch (err: any) {
      setError(err.message || 'Google login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Signing you in..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.logo}>GigVarsity</Text>
      {error ? <ErrorMessage message={error} /> : null}
      <TextInput label="Email" value={email} onChangeText={setEmail} style={styles.input} mode="outlined" keyboardType="email-address" autoCapitalize="none" />
      <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} mode="outlined" />
      <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      <Button mode="contained" onPress={onLogin} style={styles.loginButton} buttonColor={palette.primary} textColor={palette.card}>
        Login
      </Button>

      <View style={styles.orRow}>
        <View style={styles.orLine} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.orLine} />
      </View>

      <Button mode="outlined" onPress={onGoogleLogin} style={styles.googleButton} textColor={palette.textPrimary}>
        Continue with Google
      </Button>

      <View style={styles.signUpRow}>
        <Text>Don&apos;t have an account?</Text>
        <Link href="/(auth)/choose-role" style={styles.signUpLink}>
          Sign up
        </Link>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (palette: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background, padding: 24 },
  logo: { fontSize: 32, fontWeight: '900', color: palette.primary, marginBottom: 40 },
  input: { marginBottom: 16, borderRadius: 8 },
  forgot: { color: palette.primary, alignSelf: 'flex-end', marginBottom: 20 },
  loginButton: { marginBottom: 16, borderRadius: 10 },
  orRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 14 },
  orLine: { flex: 1, height: 1, backgroundColor: palette.border },
  orText: { marginHorizontal: 12, color: palette.textSecondary },
  googleButton: { borderColor: palette.primary, borderWidth: 1, borderRadius: 10, marginBottom: 20 },
  signUpRow: { flexDirection: 'row', justifyContent: 'center' },
  signUpLink: { color: palette.primary, fontWeight: '700' },
});
