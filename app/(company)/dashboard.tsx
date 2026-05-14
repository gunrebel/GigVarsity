import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const jobs = [
  { id: '1', title: 'Mobile App Developer', applicants: 12, status: 'Open' },
  { id: '2', title: 'Graphic Designer', applicants: 8, status: 'Reviewing' },
];

export default function CompanyDashboard() {
  const styles = React.useMemo(() => getStyles(), []);

  const metrics = [
    { label: 'Active Jobs', value: '2', accent: '#A78BFA' },
    { label: 'Total Applicants', value: '45', accent: '#34D399' },
    { label: 'Hired', value: '5', accent: '#F59E0B' },
  ];

  const insights = [
    { label: 'Shortlisted Today', value: '9' },
    { label: 'Avg Match Score', value: '91%' },
  ];

  const renderJobCard = ({ item, index }: { item: typeof jobs[number]; index: number }) => {
    const isOpen = item.status === 'Open';
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={index === 0 ? styles.jobCard : styles.jobCardMuted}
      >
        <View style={styles.jobHeader}>
          <View style={styles.jobIcon}>
            <Text style={styles.jobIconText}>{item.title.charAt(0)}</Text>
          </View>
          <View style={styles.jobHeaderText}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.jobMeta}>{item.applicants} applicants in review</Text>
          </View>
          <View style={[styles.statusBadge, isOpen ? styles.statusOpen : styles.statusReviewing]}>
            <Text style={[styles.statusText, isOpen ? styles.statusOpenText : styles.statusReviewingText]}>
              {item.status}
            </Text>
          </View>
        </View>

        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: isOpen ? '72%' : '54%', backgroundColor: isOpen ? '#6C5CE7' : '#F59E0B' },
              ]}
            />
          </View>
          <Text style={styles.progressText}>{isOpen ? '72% filled' : '54% reviewed'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJobCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.blob1} />
            <View style={styles.blob2} />

            <View style={styles.header}>
              <Text style={styles.eyebrow}>Company Hub</Text>
              <Text style={styles.greeting}>Yaba Technologies</Text>
              <Text style={styles.headerSub}>Track hiring momentum, shortlist faster, and keep every role moving.</Text>
            </View>

            <View style={styles.heroCard}>
              <View style={styles.heroTopRow}>
                <View>
                  <Text style={styles.heroLabel}>Hiring health</Text>
                  <Text style={styles.heroValue}>Strong</Text>
                </View>
                <View style={styles.heroPill}>
                  <Text style={styles.heroPillText}>+18% this week</Text>
                </View>
              </View>
              <Text style={styles.heroCopy}>Your two live roles are attracting qualified students with high AI match scores.</Text>

              <View style={styles.insightGrid}>
                {insights.map((insight) => (
                  <View key={insight.label} style={styles.insightCard}>
                    <Text style={styles.insightValue}>{insight.value}</Text>
                    <Text style={styles.insightLabel}>{insight.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.metricsRow}>
              {metrics.map((metric) => (
                <View key={metric.label} style={styles.metricCard}>
                  <View style={[styles.metricDot, { backgroundColor: metric.accent }]} />
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                  <Text style={styles.metricValue}>{metric.value}</Text>
                </View>
              ))}
            </View>

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>Live Roles</Text>
                <Text style={styles.sectionTitle}>Active Posts</Text>
              </View>
              <Text style={styles.sectionAction}>View all</Text>
            </View>
          </View>
        }
        ListFooterComponent={
          <View style={styles.footerCard}>
            <View style={styles.footerIconWrap}>
              <Text style={styles.footerIcon}>AI</Text>
            </View>
            <View style={styles.footerContent}>
              <Text style={styles.footerTitle}>Smart shortlist ready</Text>
              <Text style={styles.footerText}>Top candidates are prepared for the Mobile App Developer role based on skill fit and response speed.</Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const getStyles = () => StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B0B18' },
  listContent: { paddingBottom: 30 },
  blob1: {
    position: 'absolute',
    top: -40,
    right: -20,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#3D2FA8',
    opacity: 0.28,
  },
  blob2: {
    position: 'absolute',
    top: 55,
    right: 20,
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#6C5CE7',
    opacity: 0.14,
  },
  header: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 16 },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A78BFA',
    letterSpacing: 1.7,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  greeting: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', letterSpacing: -0.6, marginBottom: 8 },
  headerSub: { color: '#8A899C', fontSize: 14, lineHeight: 22, maxWidth: '92%' },
  heroCard: {
    marginHorizontal: 24,
    marginBottom: 14,
    backgroundColor: '#161629',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2D2B5E',
    overflow: 'hidden',
  },
  heroTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A78BFA',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  heroValue: { color: '#FFFFFF', fontSize: 30, fontWeight: '900', letterSpacing: -0.5 },
  heroPill: {
    backgroundColor: '#0F2A1E',
    borderWidth: 1,
    borderColor: '#065F46',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  heroPillText: { color: '#34D399', fontSize: 11, fontWeight: '700' },
  heroCopy: { color: '#8A899C', fontSize: 13, lineHeight: 20, marginBottom: 16 },
  insightGrid: { flexDirection: 'row', gap: 10 },
  insightCard: {
    flex: 1,
    backgroundColor: '#0F0F20',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E1C40',
    padding: 14,
  },
  insightValue: { color: '#FFFFFF', fontSize: 19, fontWeight: '800', marginBottom: 4 },
  insightLabel: { color: '#6B6A8D', fontSize: 12, lineHeight: 18 },
  metricsRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 10, marginBottom: 24 },
  metricCard: {
    flex: 1,
    backgroundColor: '#0F0F20',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E1C40',
    padding: 14,
  },
  metricDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 10 },
  metricLabel: { color: '#6B6A8D', fontSize: 11, lineHeight: 16, minHeight: 32 },
  metricValue: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginTop: 2 },
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  sectionEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A78BFA',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  sectionTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  sectionAction: { color: '#6C5CE7', fontSize: 12, fontWeight: '700' },
  jobCard: {
    marginHorizontal: 24,
    marginBottom: 12,
    backgroundColor: '#161629',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2D2B5E',
    padding: 16,
  },
  jobCardMuted: {
    marginHorizontal: 24,
    marginBottom: 12,
    backgroundColor: '#0F0F20',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E1C40',
    padding: 16,
  },
  jobHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  jobIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#1E1A42',
    borderWidth: 1,
    borderColor: '#2D2B5E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobIconText: { color: '#E0DEFF', fontSize: 16, fontWeight: '800' },
  jobHeaderText: { flex: 1 },
  jobTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', marginBottom: 3 },
  jobMeta: { color: '#6B6A8D', fontSize: 12 },
  statusBadge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  statusOpen: { backgroundColor: '#0F2A1E', borderWidth: 1, borderColor: '#065F46' },
  statusReviewing: { backgroundColor: '#2A1A00', borderWidth: 1, borderColor: '#78350F' },
  statusText: { fontSize: 11, fontWeight: '700' },
  statusOpenText: { color: '#34D399' },
  statusReviewingText: { color: '#F59E0B' },
  progressRow: { gap: 8 },
  progressTrack: {
    height: 8,
    backgroundColor: '#1E1C40',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 999 },
  progressText: { color: '#8A899C', fontSize: 12 },
  footerCard: {
    marginHorizontal: 24,
    marginTop: 12,
    backgroundColor: '#0F0F20',
    borderWidth: 1,
    borderColor: '#1E1C40',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  footerIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1E1A42',
    borderWidth: 1,
    borderColor: '#2D2B5E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerIcon: { color: '#A78BFA', fontSize: 13, fontWeight: '900' },
  footerContent: { flex: 1 },
  footerTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginBottom: 4 },
  footerText: { color: '#6B6A8D', fontSize: 12, lineHeight: 18 },
});
