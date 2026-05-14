import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
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

  const getDeadlineColor = (daysLeft: number) => {
    if (daysLeft <= 3) return '#EF4444';
    if (daysLeft <= 7) return '#F59E0B';
    return '#34D399';
  };

  const renderJob = ({ item }: { item: typeof jobs[0] }) => {
    const deadlineColor = getDeadlineColor(item.daysLeft);
    return (
      <TouchableOpacity
        style={styles.jobCard}
        activeOpacity={0.8}
        onPress={() => router.push({ pathname: '/(student)/job-detail', params: { job: JSON.stringify(item) } })}
      >
        <View style={styles.jobCardBlob} />
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
        <View style={styles.cardFooter}>
          <View style={styles.deadlineRow}>
            <View style={[styles.deadlineDot, { backgroundColor: deadlineColor }]} />
            <Text style={[styles.status, { color: deadlineColor }]}>{item.daysLeft} days left</Text>
          </View>
          <View style={styles.applyBtn}>
            <Text style={styles.applyBtnText}>Apply →</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Explore</Text>
        <Text style={styles.title}>Browse Gigs</Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Filter by skill or company..."
          placeholderTextColor="#4A4870"
        />
        <View style={styles.filterRow}>
          {['All', 'Remote', 'Part-time', 'Tech'].map((f, i) => (
            <TouchableOpacity key={f} style={i === 0 ? styles.filterChipActive : styles.filterChip}>
              <Text style={i === 0 ? styles.filterTextActive : styles.filterText}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList
        data={jobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const getStyles = (_palette: any) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B0B18' },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 16 },
  eyebrow: { fontSize: 11, fontWeight: '700', color: '#A78BFA', letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 4 },
  title: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5, marginBottom: 14 },
  searchBar: { backgroundColor: '#161629', borderRadius: 14, paddingHorizontal: 14, height: 46, borderWidth: 1, borderColor: '#2D2B5E', color: '#E0DEFF', fontSize: 14, marginBottom: 12 },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  filterChip: { backgroundColor: '#161629', borderWidth: 1, borderColor: '#2D2B5E', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  filterChipActive: { backgroundColor: '#161629', borderWidth: 1, borderColor: '#6C5CE7', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  filterText: { color: '#6B6A8D', fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#A78BFA', fontSize: 12, fontWeight: '700' },
  list: { paddingHorizontal: 24, paddingBottom: 30, paddingTop: 8 },
  jobCard: { backgroundColor: '#161629', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#2D2B5E', overflow: 'hidden' },
  jobCardBlob: { position: 'absolute', top: -20, right: -20, width: 70, height: 70, borderRadius: 35, backgroundColor: '#6C5CE7', opacity: 0.1 },
  jobCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, alignItems: 'flex-start' },
  jobTitle: { color: '#E0DEFF', fontSize: 15, fontWeight: '800', flex: 1 },
  pay: { color: '#34D399', fontWeight: '800', fontSize: 15 },
  company: { color: '#6B6A8D', marginBottom: 10, fontSize: 12 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10, gap: 6 },
  tag: { backgroundColor: '#1E1A42', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  tagText: { color: '#A78BFA', fontSize: 11, fontWeight: '700' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  deadlineRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deadlineDot: { width: 6, height: 6, borderRadius: 3 },
  status: { fontSize: 11, fontWeight: '600' },
  applyBtn: { backgroundColor: '#6C5CE7', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 6 },
  applyBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
