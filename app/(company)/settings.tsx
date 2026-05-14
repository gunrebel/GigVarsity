import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemePalette } from '@/constants/colors';

export default function CompanySettings() {
  const palette = useThemePalette();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.item}>Account</Text>
        <Text style={styles.item}>Notifications</Text>
        <Text style={styles.item}>Payments</Text>
        <Text style={styles.item}>Help</Text>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (palette: any) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  item: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: palette.border, color: palette.textPrimary },
});
