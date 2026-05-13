import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button } from 'react-native-paper';

import { useThemePalette } from '@/constants/colors';

export default function ForgotPasswordScreen() {
  const palette = useThemePalette();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  const router = useRouter();
  const [email, setEmail] = useState('');

  const sendReset = () => {
    console.log('reset', email);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter your email to receive reset instructions.</Text>
      <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" style={styles.input} />
      <Button mode="contained" onPress={sendReset} buttonColor={palette.primary} textColor={palette.card} style={styles.button}>
        Send Reset Link
      </Button>
    </SafeAreaView>
  );
}

const getStyles = (palette: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background, padding: 24 },
  title: { fontSize: 26, fontWeight: '800', color: palette.textPrimary, marginBottom: 10 },
  subtitle: { color: palette.textSecondary, marginBottom: 16 },
  input: { marginBottom: 20, borderRadius: 8 },
  button: { borderRadius: 10 },
});
