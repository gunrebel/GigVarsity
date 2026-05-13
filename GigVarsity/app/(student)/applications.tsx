import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemePalette } from '@/constants/colors';

const applications = [
  { id: 'a1', job: 'UI Designer', company: 'NairaTech', status: 'Under Review' },
  { id: 'a2', job: 'Content Writer', company: 'EduContent', status: 'Applied' },
  { id: 'a3', job: 'Frontend Internship', company: 'Lagos Labs', status: 'Hired' },
  { id: 'a4', job: 'Backend Developer', company: 'TechHub', status: 'Saved' },
  { id: 'a5', job: 'Product Manager', company: 'InnovateCo', status: 'Saved' },
];

export default function StudentApplied() {
  const palette = useThemePalette();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Text style={styles.title}>Application Tracker</Text>
      </View>
      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.job}>{item.job}</Text>
            <Text style={styles.company}>{item.company}</Text>
            <Text style={styles.status}>{item.status}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const getStyles = (palette: any) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  header: { padding: 20, backgroundColor: palette.primary },
  title: { color: '#fff', fontSize: 22, fontWeight: '700' },
  list: { padding: 16 },
  card: { backgroundColor: palette.card, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: palette.border },
  job: { fontSize: 16, fontWeight: '700' },
  company: { color: palette.textSecondary, marginBottom: 6 },
  status: { color: palette.primary, fontWeight: '700' },
});
