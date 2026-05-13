import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemePalette } from '@/constants/colors';

export default function JobDetail() {
  const palette = useThemePalette();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  const router = useRouter();
  const { job } = useLocalSearchParams<{ job: string }>();
  const jobData = job ? JSON.parse(job) : null;

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.title}>{jobData?.title || 'UI Designer'}</Text>
        <Text style={styles.company}>{jobData?.company || 'NairaTech'}</Text>

        <View style={styles.badgeRow}>
          <Text style={styles.payBadge}>{jobData?.pay || '₦70,000'}</Text>
          <Text style={styles.deadlineBadge}>{jobData?.daysLeft ? `${jobData.daysLeft} days left` : '3 days left'}</Text>
          <Text style={styles.remoteBadge}>Remote</Text>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.body}>Design and improve user product interfaces for our fintech app with real user feedback from the Nigerian market.</Text>

        <View style={styles.skillMatchCard}>
          <Text style={styles.skillMatchTitle}>AI Skill Match</Text>
          <Text style={styles.skillMatchValue}>92%</Text>
          <Text style={styles.skillMatchDetails}>Missing: Figma Prototyping, Animated UI</Text>
        </View>

        <View style={styles.skillsRow}>
          {(jobData?.skills || ['Figma', 'UX', 'UI', 'Design Systems']).map((skill: string) => (
            <View key={skill} style={styles.tag}>
              <Text style={styles.tagText}>{skill}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push({ pathname: '/(student)/apply', params: { job: JSON.stringify(jobData) } })}
      >
        <Text style={styles.fabText}>Apply</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const getStyles = (palette: any) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '800', color: palette.textPrimary },
  company: { color: palette.textSecondary, marginBottom: 12 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8, flexWrap: 'wrap' },
  payBadge: { backgroundColor: '#DCFCE7', color: palette.success, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, fontWeight: '700' },
  deadlineBadge: { backgroundColor: '#FEF3C7', color: '#B45309', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, fontWeight: '700' },
  remoteBadge: { backgroundColor: '#E0E7FF', color: palette.primary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginTop: 16 },
  body: { color: palette.textSecondary, marginTop: 6 },
  skillMatchCard: { backgroundColor: '#ECFDF5', borderRadius: 12, padding: 12, marginTop: 12 },
  skillMatchTitle: { fontWeight: '700', color: palette.success },
  skillMatchValue: { fontSize: 20, fontWeight: '800', color: palette.success },
  skillMatchDetails: { color: palette.textSecondary },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  tag: { backgroundColor: '#E0E7FF', padding: 8, borderRadius: 10, marginRight: 6, marginBottom: 6 },
  tagText: { color: palette.primary, fontWeight: '700' },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 24,
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: palette.primary,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  fabText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
});
