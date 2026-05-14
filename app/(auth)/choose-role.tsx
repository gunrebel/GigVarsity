import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/store/authStore';
import { useThemePalette } from '@/constants/colors';

export default function ChooseRoleScreen() {
  const palette = useThemePalette();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  const router = useRouter();
  const setRole = useAuthStore((state) => state.setRole);
  const [selected, setSelected] = useState<'student' | 'company' | null>(null);

  const continuePress = () => {
    if (!selected) return;
    setRole(selected);
    const targetRoute = selected === 'company' ? '/(company)/dashboard' : '/(student)/home';
    router.replace(targetRoute);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Choose your role</Text>
      <View style={styles.grid}>
        {[
          { label: 'Student', emoji: '🎓', value: 'student' as const },
          { label: 'Company', emoji: '🏢', value: 'company' as const },
        ].map((role) => {
          const active = selected === role.value;
          return (
            <TouchableOpacity
              key={role.value}
              style={[styles.card, active && { borderColor: palette.primary, borderWidth: 2 }]}
              onPress={() => setSelected(role.value)}>
              <Text style={styles.emoji}>{role.emoji}</Text>
              <Text style={styles.roleText}>{role.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity onPress={continuePress} style={[styles.submit, { opacity: selected ? 1 : 0.5 }]} disabled={!selected}>
        <Text style={styles.submitText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const getStyles = (palette: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background, padding: 20 },
  heading: { fontSize: 28, fontWeight: '800', color: palette.textPrimary, marginBottom: 24 },
  grid: { flexDirection: 'row', justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: palette.card, borderRadius: 14, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, elevation: 3, borderWidth: 1, borderColor: palette.border },
  emoji: { fontSize: 44, marginBottom: 12 },
  roleText: { fontSize: 18, fontWeight: '700', color: palette.textPrimary },
  submit: { marginTop: 30, backgroundColor: palette.primary, padding: 14, borderRadius: 10, alignItems: 'center' },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
