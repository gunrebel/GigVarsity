import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemePalette } from '@/constants/colors';

const jobs = [
  { id: '1', title: 'Mobile App Developer', applicants: 12, status: 'Open' },
  { id: '2', title: 'Graphic Designer', applicants: 8, status: 'Reviewing' },
];

export default function CompanyDashboard() {
  const palette = useThemePalette();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Text style={styles.greeting}>Yaba Technologies</Text>
        <Text style={styles.headerSub}>Good afternoon</Text>
      </View>

      <View style={styles.stats}> 
        <View style={styles.statCard}><Text style={styles.statLabel}>Active Jobs</Text><Text style={styles.statValue}>2</Text></View>
        <View style={styles.statCard}><Text style={styles.statLabel}>Total Applicants</Text><Text style={styles.statValue}>45</Text></View>
        <View style={styles.statCard}><Text style={styles.statLabel}>Hired</Text><Text style={styles.statValue}>5</Text></View>
      </View>

      <Text style={styles.sectionTitle}>Active Posts</Text>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.job}>{item.title}</Text>
            <Text style={styles.cardSub}>{item.applicants} applicants</Text>
            <View style={[styles.statusBadge, item.status === 'Open' ? { backgroundColor: '#D1FAE5' } : { backgroundColor: '#FEF3C7' }]}> 
              <Text style={[styles.statusText, item.status === 'Open' ? { color: palette.success } : { color: '#92400E' }]}>{item.status}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const getStyles = (palette: any) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  header: { backgroundColor: palette.secondary, padding: 16 },
  greeting: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSub: { color: '#EDE9FE' },
  stats: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  cardSub: { color: palette.textSecondary },
  statCard: { width: '31%', backgroundColor: palette.card, borderRadius: 12, padding: 12, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 3 },
  statLabel: { color: palette.textSecondary, fontSize: 12 },
  statValue: { color: palette.textPrimary, fontSize: 18, fontWeight: '700' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginHorizontal: 16, marginBottom: 8 },
  card: { backgroundColor: palette.card, marginHorizontal: 16, borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: palette.border },
  job: { fontWeight: '700' },
  sub: { color: palette.textSecondary },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 6, alignSelf: 'flex-start' },
  statusText: { fontWeight: '700', fontSize: 12 },
});
