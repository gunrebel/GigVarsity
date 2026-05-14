import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
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
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={styles.heroSection}>
          <View style={styles.companyRow}>
            <View style={styles.companyLogoBox}>
              <Text style={styles.companyEmoji}>🎨</Text>
            </View>
            <Text style={styles.company}>{jobData?.company || 'NairaTech'}</Text>
          </View>
          <Text style={styles.title}>{jobData?.title || 'UI Designer'}</Text>
          <View style={styles.badgeRow}>
            <Text style={styles.payBadge}>{jobData?.pay || '₦70,000'}</Text>
            <Text style={styles.deadlineBadge}>
              {jobData?.daysLeft ? `${jobData.daysLeft} days left` : '3 days left'}
            </Text>
            <Text style={styles.remoteBadge}>Remote</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the role</Text>
          <Text style={styles.body}>
            Design and improve user product interfaces for our fintech app with real user feedback from the Nigerian market.
          </Text>
        </View>

        {/* AI Skill Match */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Skill Match</Text>
          <View style={styles.skillMatchCard}>
            <View style={styles.skillMatchBlob} />
            <View style={styles.skillMatchHeader}>
              <View style={styles.skillMatchLeft}>
                <Text style={styles.skillMatchTitle}>Match score</Text>
                <Text style={styles.skillMatchValue}>92%</Text>
              </View>
              <View style={styles.skillMatchIcon}>
                <Text style={styles.skillMatchIconText}>🤖</Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '92%' }]} />
            </View>
            <Text style={styles.skillMatchDetails}>
              Missing: Figma Prototyping, Animated UI
            </Text>
          </View>
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills Required</Text>
          <View style={styles.tagsRow}>
            {(jobData?.skills || ['Figma', 'UX', 'UI', 'Design Systems']).map((skill: string) => (
              <View key={skill} style={styles.tag}>
                <Text style={styles.tagText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* Pinned Apply button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.applyBtn}
          activeOpacity={0.85}
          onPress={() => router.push({ pathname: '/(student)/apply', params: { job: JSON.stringify(jobData) } })}
        >
          <Text style={styles.applyBtnText}>Apply Now</Text>
          <Text style={styles.applyBtnArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (_palette: any) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B0B18' },
  blob1: { position: 'absolute', top: -40, right: -30, width: 160, height: 160, borderRadius: 80, backgroundColor: '#3D2FA8', opacity: 0.35 },
  blob2: { position: 'absolute', top: 60, right: 10, width: 80, height: 80, borderRadius: 40, backgroundColor: '#6C5CE7', opacity: 0.18 },
  scrollContent: { paddingBottom: 120 },
  heroSection: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20 },
  companyRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  companyLogoBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#1E1A42',
    borderWidth: 1,
    borderColor: '#2D2B5E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyEmoji: { fontSize: 20 },
  company: { color: '#6B6A8D', fontSize: 13 },
  title: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5, marginBottom: 14 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  payBadge: {
    backgroundColor: '#0F2A1E',
    borderWidth: 1,
    borderColor: '#065F46',
    color: '#34D399',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    fontWeight: '700',
    fontSize: 13,
  },
  deadlineBadge: {
    backgroundColor: '#2A1A00',
    borderWidth: 1,
    borderColor: '#78350F',
    color: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    fontWeight: '700',
    fontSize: 13,
  },
  remoteBadge: {
    backgroundColor: '#1E1A42',
    borderWidth: 1,
    borderColor: '#2D2B5E',
    color: '#A78BFA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    fontWeight: '700',
    fontSize: 13,
  },
  section: { paddingHorizontal: 24, marginBottom: 20 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A78BFA',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  body: { color: '#8A899C', fontSize: 14, lineHeight: 22 },
  skillMatchCard: {
    backgroundColor: '#161629',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D2B5E',
    overflow: 'hidden',
  },
  skillMatchBlob: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#34D399',
    opacity: 0.08,
  },
  skillMatchHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  skillMatchLeft: {},
  skillMatchTitle: { fontSize: 11, fontWeight: '700', color: '#A78BFA', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4 },
  skillMatchValue: { fontSize: 32, fontWeight: '900', color: '#34D399', lineHeight: 36 },
  skillMatchIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0F2A1E',
    borderWidth: 2,
    borderColor: '#34D399',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillMatchIconText: { fontSize: 20 },
  progressBar: { height: 6, backgroundColor: '#1E1C40', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: 6, backgroundColor: '#34D399', borderRadius: 4 },
  skillMatchDetails: { color: '#6B6A8D', fontSize: 12 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { backgroundColor: '#1E1A42', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  tagText: { color: '#A78BFA', fontSize: 12, fontWeight: '700' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0B0B18',
    borderTopWidth: 1,
    borderTopColor: '#1E1C40',
    padding: 20,
  },
  applyBtn: {
    backgroundColor: '#6C5CE7',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  applyBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16, letterSpacing: 0.3 },
  applyBtnArrow: { color: '#FFFFFF', fontSize: 18 },
});
