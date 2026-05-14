import { Stack } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const sections = [
  { title: 'Account', subtitle: 'Manage your company profile and team access', icon: '◉' },
  { title: 'Notifications', subtitle: 'Stay updated on applicants and messages', icon: '◎' },
  { title: 'Payments', subtitle: 'Track payouts and billing activity', icon: '◌' },
  { title: 'Help', subtitle: 'Get support and onboarding guidance', icon: '?' },
];

export default function CompanySettings() {
  const styles = React.useMemo(() => getStyles(), []);
  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Workspace</Text>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Tune the company experience for your team, alerts, and payment flow.</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.logoWrap}>
            <Text style={styles.logoText}>YT</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.companyName}>Yaba Technologies</Text>
            <Text style={styles.companyMeta}>2 live jobs • 45 applicants • Lagos</Text>
          </View>
          <View style={styles.planBadge}>
            <Text style={styles.planBadgeText}>Pro</Text>
          </View>
        </View>

        <View style={styles.healthCard}>
          <Text style={styles.healthLabel}>Workspace health</Text>
          <Text style={styles.healthValue}>All systems ready</Text>
          <Text style={styles.healthCopy}>Notifications are on, payouts are active, and your hiring profile is visible to students.</Text>
        </View>

        <Text style={styles.sectionLabel}>Preferences</Text>
        {sections.map((item) => (
          <TouchableOpacity key={item.title} style={styles.itemCard} activeOpacity={0.85}>
            <View style={styles.itemIcon}>
              <Text style={styles.itemIconText}>{item.icon}</Text>
            </View>
            <View style={styles.itemCopy}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
            </View>
            <Text style={styles.itemArrow}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.footerCard}>
          <Text style={styles.footerTitle}>Need help polishing your hiring funnel?</Text>
          <Text style={styles.footerText}>GigVarsity support can help you tighten role copy, speed up shortlisting, and improve candidate response rates.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = () => StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B0B18' },
  blob1: {
    position: 'absolute',
    top: -40,
    right: -24,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#3D2FA8',
    opacity: 0.22,
  },
  blob2: {
    position: 'absolute',
    top: 70,
    right: 8,
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#6C5CE7',
    opacity: 0.12,
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
  profileCard: {
    backgroundColor: '#161629',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2D2B5E',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  logoWrap: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#1E1A42',
    borderWidth: 1.5,
    borderColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: { color: '#E0DEFF', fontSize: 18, fontWeight: '900' },
  profileInfo: { flex: 1 },
  companyName: { color: '#FFFFFF', fontSize: 17, fontWeight: '800', marginBottom: 4 },
  companyMeta: { color: '#8A899C', fontSize: 12, lineHeight: 18 },
  planBadge: {
    backgroundColor: '#0F2A1E',
    borderWidth: 1,
    borderColor: '#065F46',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  planBadgeText: { color: '#34D399', fontSize: 11, fontWeight: '800' },
  healthCard: {
    backgroundColor: '#0F0F20',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E1C40',
    padding: 16,
    marginBottom: 20,
  },
  healthLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A78BFA',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  healthValue: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', marginBottom: 8 },
  healthCopy: { color: '#6B6A8D', fontSize: 13, lineHeight: 20 },
  sectionLabel: {
    color: '#A78BFA',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  itemCard: {
    backgroundColor: '#0F0F20',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E1C40',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  itemIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#1A1835',
    borderWidth: 1,
    borderColor: '#2D2B5E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIconText: { color: '#A78BFA', fontSize: 16, fontWeight: '800' },
  itemCopy: { flex: 1 },
  itemTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginBottom: 4 },
  itemSubtitle: { color: '#6B6A8D', fontSize: 12, lineHeight: 18 },
  itemArrow: { color: '#4A4870', fontSize: 20, fontWeight: '700' },
  footerCard: {
    marginTop: 10,
    backgroundColor: '#161629',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2D2B5E',
    padding: 16,
  },
  footerTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginBottom: 6 },
  footerText: { color: '#6B6A8D', fontSize: 12, lineHeight: 18 },
});
