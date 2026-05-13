import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemePalette } from '@/constants/colors';

const jobs = [
  { id: '1', title: 'UI Designer', company: 'NairaTech', pay: '₦70,000', daysLeft: 5, skills: ['Figma', 'UI', 'UX'] },
  { id: '2', title: 'Frontend Internship', company: 'Lagos Labs', pay: '₦40,000', daysLeft: 12, skills: ['React', 'JavaScript'] },
  { id: '3', title: 'Content Writer', company: 'EduContent', pay: '₦25,000', daysLeft: 3, skills: ['Writing', 'SEO'] },
];

export default function StudentBrowse() {
  const palette = useThemePalette();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  const router = useRouter();

  const renderJob = ({ item }: { item: typeof jobs[0] }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => router.push({ pathname: '/(student)/job-detail', params: { job: JSON.stringify(item) } })}
    >
      <View style={styles.jobCardHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.pay}>{item.pay}</Text>
      </View>
      <Text style={styles.company}>{item.company}</Text>
      <View style={styles.tagsRow}>
        {item.skills.map((skill) => (
          <View key={`${item.id}-${skill}`} style={styles.tag}>
            <Text style={styles.tagText}>{skill}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.status}>Deadline in {item.daysLeft} days</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Text style={styles.title}>Browse Jobs</Text>
      </View>
      <FlatList
        data={jobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const getStyles = (palette: any) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  header: { padding: 20, backgroundColor: palette.primary },
  title: { color: '#fff', fontSize: 22, fontWeight: '700' },
  list: { padding: 16 },
  jobCard: { backgroundColor: palette.card, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: palette.border },
  jobCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  jobTitle: { fontSize: 16, fontWeight: '600', color: palette.textPrimary },
  pay: { fontSize: 14, fontWeight: '700', color: palette.primary },
  company: { fontSize: 14, color: palette.textSecondary, marginBottom: 8 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  tag: { backgroundColor: '#EDE9FE', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6, marginRight: 8, marginBottom: 4 },
  tagText: { color: palette.primary, fontWeight: '700' },
  status: { fontSize: 12, color: palette.textSecondary },
});
