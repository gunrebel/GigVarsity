import { Stack, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemePalette } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { logoutUser } from '@/services/authService';

const jobData = [
  { id: '1', title: 'UI Designer', company: 'NairaTech', pay: '₦70,000', daysLeft: 5, skills: ['Figma', 'UI', 'UX'] },
  { id: '2', title: 'Frontend Internship', company: 'Lagos Labs', pay: '₦40,000', daysLeft: 12, skills: ['React', 'JavaScript'] },
  { id: '3', title: 'Content Writer', company: 'EduContent', pay: '₦25,000', daysLeft: 3, skills: ['Writing', 'SEO'] },
];

export default function StudentHome() {
  const palette = useThemePalette();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const searchSuggestions = [
    'UI Designer',
    'Frontend Internship',
    'Content Writer',
    'React',
    'Figma',
    'JavaScript',
    'Writing',
    'Marketing',
    'Product Manager',
    'Backend Developer',
    'Editing jobs',
    'Design gigs',
    'Remote jobs',
    'Part-time jobs',
    'Tech internships',
    'Virtual assistants',
    'social media manager',
    'graphic design',
    'copywriting',
  ].filter((suggestion) => suggestion.toLowerCase().includes(searchQuery.toLowerCase()));

  // Get the user's first name (from displayName or email)
  const userName = useMemo(() => {
    if (user?.displayName) {
      return user.displayName.split(' ')[0]; // Get first name
    }
    // Fallback to email prefix if no display name
    return user?.email?.split('@')[0] || 'User';
  }, [user?.displayName, user?.email]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getDeadlineColor = (daysLeft: number) => {
    if (daysLeft <= 3) return '#EF4444';
    if (daysLeft <= 7) return '#F59E0B';
    return '#34D399';
  };

  const renderJob = ({ item }: { item: typeof jobData[number] }) => {
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
        <View style={styles.deadlineRow}>
          <View style={[styles.deadlineDot, { backgroundColor: deadlineColor }]} />
          <Text style={[styles.status, { color: deadlineColor }]}>
            {item.daysLeft} days left
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <View style={styles.header}>
        <Text style={styles.eyebrow}>Good morning 👋</Text>
        <View style={styles.headerRow}>
          <Text style={styles.greeting}>Hello, {userName}</Text>
          <TouchableOpacity style={styles.avatarButton} onPress={() => setMenuVisible(!menuVisible)}>
            <Text style={styles.avatarInitial}>{userName.charAt(0).toUpperCase()}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {menuVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/(student)/profile'); }}>
            <Text style={styles.menuText}>View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/(student)/applications'); }}>
            <Text style={styles.menuText}>Application Tracker</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); router.push('/(settings)'); }}>
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => { setMenuVisible(false); handleLogout(); }}>
            <Text style={[styles.menuText, { color: '#EF4444' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="Search gigs, skills, companies..."
          placeholderTextColor="#4A4870"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {searchSuggestions.map((suggestion) => (
              <TouchableOpacity
                key={suggestion}
                style={styles.suggestionItem}
                onPress={() => setSearchQuery(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Applied</Text>
          <Text style={styles.statValue}>8</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Active</Text>
          <Text style={styles.statValue}>2</Text>
        </View>
        <View style={styles.statCardHighlight}>
          <Text style={styles.statLabel}>Earned</Text>
          <Text style={styles.statValueAccent}>₦165k</Text>
        </View>
      </View>

      <View style={styles.categoryRow}>
        {['All', 'Design', 'Dev', 'Writing', 'Marketing'].map((c, i) => (
          <TouchableOpacity key={c} style={i === 0 ? styles.categoryChipActive : styles.categoryChip}>
            <Text style={i === 0 ? styles.categoryTextActive : styles.categoryText}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={jobData}
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
  blob1: { position: 'absolute', top: -50, right: -40, width: 200, height: 200, borderRadius: 100, backgroundColor: '#3D2FA8', opacity: 0.35 },
  blob2: { position: 'absolute', top: 60, right: 10, width: 90, height: 90, borderRadius: 45, backgroundColor: '#6C5CE7', opacity: 0.18 },
  header: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 16 },
  eyebrow: { fontSize: 11, fontWeight: '700', color: '#A78BFA', letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 4 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5 },
  avatarButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#161629', borderWidth: 1.5, borderColor: '#2D2B5E', justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { fontSize: 16, fontWeight: '800', color: '#A78BFA' },
  dropdownMenu: { position: 'absolute', top: 90, right: 24, backgroundColor: '#161629', borderRadius: 14, paddingVertical: 6, borderWidth: 1, borderColor: '#2D2B5E', zIndex: 1000, minWidth: 180 },
  menuItem: { paddingVertical: 12, paddingHorizontal: 18 },
  menuText: { fontSize: 14, color: '#E0DEFF', fontWeight: '500' },
  searchWrapper: { paddingHorizontal: 24, marginBottom: 16 },
  searchInput: { backgroundColor: '#161629', borderRadius: 14, paddingHorizontal: 14, height: 46, borderWidth: 1, borderColor: '#2D2B5E', color: '#E0DEFF', fontSize: 14 },
  suggestionsContainer: { backgroundColor: '#161629', borderRadius: 12, marginTop: 6, borderWidth: 1, borderColor: '#2D2B5E', overflow: 'hidden' },
  suggestionItem: { paddingVertical: 11, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#1E1C40' },
  suggestionText: { color: '#E0DEFF', fontSize: 14 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 8, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#161629', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#2D2B5E', alignItems: 'center' },
  statCardHighlight: { flex: 1.4, backgroundColor: '#161629', borderRadius: 12, padding: 12, borderWidth: 1.5, borderColor: '#6C5CE7', alignItems: 'center' },
  statLabel: { color: '#6B6A8D', fontSize: 10, marginBottom: 4 },
  statValue: { color: '#E0DEFF', fontSize: 17, fontWeight: '900' },
  statValueAccent: { color: '#A78BFA', fontSize: 14, fontWeight: '900' },
  categoryRow: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 16, gap: 8 },
  categoryChip: { backgroundColor: '#161629', borderColor: '#2D2B5E', borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  categoryChipActive: { backgroundColor: '#6C5CE7', borderColor: '#6C5CE7', borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  categoryText: { color: '#6B6A8D', fontSize: 12, fontWeight: '600' },
  categoryTextActive: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  list: { paddingHorizontal: 24, paddingBottom: 30 },
  jobCard: { backgroundColor: '#161629', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#2D2B5E', overflow: 'hidden' },
  jobCardBlob: { position: 'absolute', top: -20, right: -20, width: 70, height: 70, borderRadius: 35, backgroundColor: '#6C5CE7', opacity: 0.1 },
  jobCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4, alignItems: 'flex-start' },
  jobTitle: { color: '#E0DEFF', fontSize: 15, fontWeight: '800', flex: 1 },
  pay: { color: '#34D399', fontWeight: '800', fontSize: 15 },
  company: { color: '#6B6A8D', marginBottom: 10, fontSize: 12 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10, gap: 6 },
  tag: { backgroundColor: '#1E1A42', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  tagText: { color: '#A78BFA', fontSize: 11, fontWeight: '700' },
  deadlineRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deadlineDot: { width: 6, height: 6, borderRadius: 3 },
  status: { fontSize: 11, fontWeight: '600' },
});
