import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button } from 'react-native-paper';
import Svg, { Path } from 'react-native-svg';

import { loginUser, loginWithGoogle, loginWithGoogleDemo } from '@/services/authService';
import LoadingScreen from '@/components/ui/LoadingScreen';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useThemePalette } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';

function GoogleIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 48 48">
      <Path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <Path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <Path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <Path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </Svg>
  );
}

const googleSpinnerStyles = StyleSheet.create({
  wrap: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#4A4870',
    borderTopColor: '#A78BFA',
    borderRightColor: '#6C5CE7',
  },
  core: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0DEFF',
  },
});

function GoogleButtonSpinner() {
  const rotateAnim = React.useRef(new Animated.Value(0)).current;
  const pulseAnim = React.useRef(new Animated.Value(0.9)).current;

  React.useEffect(() => {
    const rotateLoop = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.9,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    rotateLoop.start();
    pulseLoop.start();

    return () => {
      rotateLoop.stop();
      pulseLoop.stop();
    };
  }, [pulseAnim, rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={googleSpinnerStyles.wrap}>
      <Animated.View
        style={[
          googleSpinnerStyles.ring,
          {
            transform: [{ rotate: spin }],
          },
        ]}
      />
      <Animated.View
        style={[
          googleSpinnerStyles.core,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      />
    </View>
  );
}

export default function LoginScreen() {
  const palette = useThemePalette();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleLoadingLabel, setGoogleLoadingLabel] = useState('Connecting...');
  const [error, setError] = useState('');

  const routeAfterAuth = React.useCallback(() => {
    const nextRole = useAuthStore.getState().role;

    if (nextRole === 'student') {
      router.replace('/(student)/home');
    } else if (nextRole === 'company') {
      router.replace('/(company)/dashboard');
    } else {
      router.replace('/(auth)/choose-role');
    }
  }, [router]);

  const onLogin = async () => {
    setError('');
    setLoading(true);

    try {
      await loginUser(email, password);
      routeAfterAuth();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    setGoogleLoadingLabel('Connecting...');

    try {
      if (Platform.OS === 'web') {
        await loginWithGoogle();
      } else {
        await new Promise((resolve) => setTimeout(resolve, 700));
        setGoogleLoadingLabel('Verifying account...');
        await new Promise((resolve) => setTimeout(resolve, 650));
        setGoogleLoadingLabel('Signing you in...');
        await new Promise((resolve) => setTimeout(resolve, 550));
        await loginWithGoogleDemo();
      }
      routeAfterAuth();
    } catch (err: any) {
      setError(err.message || 'Google login failed. Please try again.');
    } finally {
      setGoogleLoading(false);
      setGoogleLoadingLabel('Connecting...');
    }
  };

  if (loading) {
    return <LoadingScreen message="Signing you in..." />;
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Hero section */}
      <View style={styles.heroSection}>
        <View style={styles.heroBubble1} />
        <View style={styles.heroBubble2} />
        <View style={styles.heroBubble3} />
        <Text style={styles.logo}>GigVarsity</Text>
        <Text style={styles.tagline}>Your campus, your career</Text>
      </View>

      <View style={styles.formSection}>
        {error ? <ErrorMessage message={error} /> : null}

        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Enter your email"
          placeholderTextColor="#6B6A8D"
          textColor="#E0DEFF"
          outlineColor="#2D2B5E"
          activeOutlineColor="#6C5CE7"
          outlineStyle={{ borderRadius: 12 }}
        />

        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
          placeholder="Enter your password"
          placeholderTextColor="#6B6A8D"
          textColor="#E0DEFF"
          outlineColor="#2D2B5E"
          activeOutlineColor="#6C5CE7"
          outlineStyle={{ borderRadius: 12 }}
        />

        <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <Button
          mode="contained"
          onPress={onLogin}
          style={styles.loginButton}
          buttonColor="#6C5CE7"
          textColor="#FFFFFF"
          contentStyle={{ height: 52 }}
          labelStyle={{ fontSize: 15, fontWeight: '700', letterSpacing: 0.5 }}
        >
          Sign in  →
        </Button>

        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR CONTINUE WITH</Text>
          <View style={styles.orLine} />
        </View>

        {googleLoading ? (
          <View style={[styles.googleButton, styles.googleButtonLoading]}>
            <View style={styles.googleLoadingContent}>
              <GoogleButtonSpinner />
              <Text style={styles.googleLoadingText}>{googleLoadingLabel}</Text>
            </View>
          </View>
        ) : (
          <Button
            mode="outlined"
            onPress={onGoogleLogin}
            style={styles.googleButton}
            icon={() => <GoogleIcon />}
            textColor="#E0DEFF"
            contentStyle={{ height: 52 }}
            labelStyle={{ fontSize: 14, fontWeight: '500' }}
          >
            Google
          </Button>
        )}

        <View style={styles.signUpRow}>
          <Text style={styles.signUpText}>New to GigVarsity?</Text>
          <Link href="/(auth)/choose-role" style={styles.signUpLink}>
            Create account
          </Link>
        </View>
      </View>

    </SafeAreaView>
  );
}

const getStyles = (_palette: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B18',
    padding: 0,
  },
  heroSection: {
    height: 200,
    paddingHorizontal: 24,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    overflow: 'hidden',
  },
  heroBubble1: {
    position: 'absolute',
    top: -40,
    right: -20,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#3D2FA8',
    opacity: 0.45,
  },
  heroBubble2: {
    position: 'absolute',
    top: 20,
    right: 50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6C5CE7',
    opacity: 0.3,
  },
  heroBubble3: {
    position: 'absolute',
    top: 80,
    left: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#7C3AED',
    opacity: 0.2,
  },
  logo: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A78BFA',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  formSection: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A78BFA',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#161629',
    marginBottom: 0,
    borderRadius: 12,
  },
  forgot: {
    color: '#A78BFA',
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 22,
    fontSize: 13,
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: 20,
    borderRadius: 14,
    elevation: 0,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2D2B5E',
  },
  orText: {
    marginHorizontal: 12,
    color: '#4A4870',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  googleButton: {
    borderColor: '#2D2B5E',
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 28,
    backgroundColor: '#161629',
  },
  googleButtonLoading: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleLoadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  googleLoadingText: {
    color: '#E0DEFF',
    fontSize: 14,
    fontWeight: '500',
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  signUpText: {
    color: '#6B6A8D',
    fontSize: 13,
  },
  signUpLink: {
    color: '#A78BFA',
    fontWeight: '700',
    fontSize: 13,
  },
});
