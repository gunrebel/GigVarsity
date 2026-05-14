import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const candidates = [
  {
    id: '1',
    name: 'Amaka James',
    role: 'Content Strategist',
    match: '96%',
    availability: 'Available weekends',
    skills: ['Writing', 'SEO', 'Campaigns'],
  },
  {
    id: '2',
    name: 'Tobi Bello',
    role: 'Product Designer',
    match: '91%',
    availability: 'Available 20 hrs/week',
    skills: ['Figma', 'UX', 'Design Systems'],
  },
  {
    id: '3',
    name: 'Maya Okeke',
    role: 'Frontend Developer',
    match: '88%',
    availability: 'Available immediately',
    skills: ['React', 'TypeScript', 'Expo'],
  },
];

export default function CompanyTalent() {
  const styles = React.useMemo(() => getStyles(), []);
  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Talent Pool</Text>
          <Text style={styles.title}>Top-matched students</Text>
          <Text style={styles.subtitle}>Browse standout candidates ranked by AI fit, skill overlap, and current availability.</Text>
        </View>

        <View style={styles.spotlightCard}>
          <View style={styles.spotlightTop}>
            <View style={styles.spotlightAvatar}>
              <Text style={styles.spotlightAvatarText}>A</Text>
            </View>
            <View style={styles.spotlightInfo}>
              <Text style={styles.spotlightName}>Amaka James</Text>
              <Text style={styles.spotlightRole}>Content Strategist • University of Lagos</Text>
            </View>
            <View style={styles.matchBadge}>
              <Text style={styles.matchValue}>96%</Text>
            </View>
          </View>

          <Text style={styles.spotlightCopy}>Strong portfolio in brand storytelling, SEO writing, and fast turnarounds for youth-focused campaigns.</Text>

          <View style={styles.skillRow}>
            {['Writing', 'SEO', 'Campaigns'].map((skill) => (
              <View key={skill} style={styles.skillPill}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>

          <View style={styles.availabilityRow}>
            <Text style={styles.availabilityLabel}>Availability</Text>
            <Text style={styles.availabilityValue}>Available weekends</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>Suggested</Text>
            <Text style={styles.sectionTitle}>Candidate Queue</Text>
          </View>
          <Text style={styles.sectionAction}>Refine</Text>
        </View>

        {candidates.map((candidate, index) => (
          <TouchableOpacity
            key={candidate.id}
            style={index === 0 ? styles.candidateCard : styles.candidateCardMuted}
            activeOpacity={0.85}
          >
            <View style={styles.cardHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{candidate.name.charAt(0)}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{candidate.name}</Text>
                <Text style={styles.cardRole}>{candidate.role}</Text>
              </View>
              <Text style={styles.cardMatch}>{candidate.match}</Text>
            </View>

            <View style={styles.tagsRow}>
              {candidate.skills.map((skill) => (
                <View key={skill} style={styles.tag}>
                  <Text style={styles.tagText}>{skill}</Text>
                </View>
              ))}
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.footerLabel}>Availability</Text>
              <Text style={styles.footerValue}>{candidate.availability}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = () => StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B0B18' },
  blob1: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#3D2FA8',
    opacity: 0.22,
  },
  blob2: {
    position: 'absolute',
    top: 40,
    right: -20,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#6C5CE7',
    opacity: 0.1,
  },
  container: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 34 },
  header: { marginBottom: 18 },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A78BFA',
    letterSpacing: 1.7,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', letterSpacing: -0.6, marginBottom: 8 },
  subtitle: { color: '#8A899C', fontSize: 14, lineHeight: 22 },
  spotlightCard: {
    backgroundColor: '#161629',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2D2B5E',
    padding: 18,
    marginBottom: 20,
  },
  spotlightTop: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  spotlightAvatar: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#1E1A42',
    borderWidth: 1.5,
    borderColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spotlightAvatarText: { color: '#E0DEFF', fontSize: 20, fontWeight: '900' },
  spotlightInfo: { flex: 1 },
  spotlightName: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginBottom: 4 },
  spotlightRole: { color: '#8A899C', fontSize: 12, lineHeight: 18 },
  matchBadge: {
    backgroundColor: '#0F2A1E',
    borderWidth: 1,
    borderColor: '#065F46',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  matchValue: { color: '#34D399', fontSize: 13, fontWeight: '800' },
  spotlightCopy: { color: '#8A899C', fontSize: 13, lineHeight: 20, marginBottom: 14 },
  skillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  skillPill: {
    backgroundColor: '#1E1A42',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  skillText: { color: '#A78BFA', fontSize: 12, fontWeight: '700' },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0F0F20',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E1C40',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  availabilityLabel: { color: '#6B6A8D', fontSize: 12 },
  availabilityValue: { color: '#E0DEFF', fontSize: 12, fontWeight: '700' },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  candidateCard: {
    backgroundColor: '#161629',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2D2B5E',
    padding: 16,
    marginBottom: 12,
  },
  candidateCardMuted: {
    backgroundColor: '#0F0F20',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E1C40',
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#1E1A42',
    borderWidth: 1,
    borderColor: '#2D2B5E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#E0DEFF', fontSize: 16, fontWeight: '800' },
  cardInfo: { flex: 1 },
  cardName: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginBottom: 4 },
  cardRole: { color: '#8A899C', fontSize: 12 },
  cardMatch: { color: '#34D399', fontSize: 14, fontWeight: '800' },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  tag: { backgroundColor: '#1A1835', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
  tagText: { color: '#A78BFA', fontSize: 12, fontWeight: '700' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1E1C40',
    paddingTop: 12,
  },
  footerLabel: { color: '#6B6A8D', fontSize: 12 },
  footerValue: { color: '#E0DEFF', fontSize: 12, fontWeight: '700' },
});
