import { Stack, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

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

  const renderJob = ({ item }: { item: typeof jobData[number] }) => (
    <TouchableOpacity style={styles.jobCard} onPress={() => router.push({ pathname: '/(student)/job-detail', params: { job: JSON.stringify(item) } })}>
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
        <View style={styles.leftSection}>
          <Image source={require('@/assets/images/react-logo.png')} style={styles.logo} />
          <Text style={styles.greeting}>Hello, {userName}</Text>
        </View>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color="#666" />
          </View>
        </TouchableOpacity>
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
            <Text style={styles.menuText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="Search gigs"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          onSubmitEditing={() => console.log('Searching for', searchQuery)}
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
        {[
          { key: 'Applied', value: 8 },
          { key: 'Active', value: 2 },
          { key: 'Earned', value: '₦165,000' },
        ].map((card) => (
          <View key={card.key} style={styles.statCard}>
            <Text style={styles.statLabel}>{card.key}</Text>
            <Text style={styles.statValue}>{card.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.categoryRow}>
        {['All', 'Design', 'Dev', 'Writing', 'Marketing'].map((c) => (
          <TouchableOpacity key={c} style={styles.categoryChip} onPress={() => console.log(`Category ${c} selected`)}>
            <Text style={styles.categoryText}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList data={jobData} renderItem={renderJob} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} />
    </SafeAreaView>
  );
}

const getStyles = (palette: any) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  header: { backgroundColor: palette.primary, padding: 18, borderBottomLeftRadius: 18, borderBottomRightRadius: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  leftSection: { flexDirection: 'row', alignItems: 'center' },
  logo: { width: 40, height: 40, marginRight: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  greeting: { color: '#fff', fontSize: 22, fontWeight: '700' },
  dropdownMenu: { position: 'absolute', top: 80, right: 20, backgroundColor: palette.card, borderRadius: 8, padding: 10, elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, zIndex: 1000 },
  menuItem: { paddingVertical: 10, paddingHorizontal: 15 },
  menuText: { fontSize: 16, color: palette.textPrimary },
  searchWrapper: { paddingHorizontal: 30, marginTop: -20 },
  searchInput: { backgroundColor: palette.card, borderRadius: 10, paddingHorizontal: 12, height: 44, borderWidth: 1, borderColor: palette.border, width: '90%', alignSelf: 'center' },
  suggestionsContainer: { backgroundColor: palette.card, borderRadius: 12, marginTop: 8, width: '90%', alignSelf: 'center', borderWidth: 1, borderColor: palette.border, overflow: 'hidden' },
  suggestionItem: { paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: palette.border },
  suggestionText: { color: palette.textPrimary, fontSize: 14 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  statCard: { backgroundColor: palette.card, width: '32%', borderRadius: 12, padding: 12, elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4 },
  statLabel: { color: palette.textSecondary, fontSize: 12 },
  statValue: { color: palette.textPrimary, fontSize: 16, fontWeight: '700' },
  categoryRow: { flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8 },
  categoryChip: { backgroundColor: palette.card, borderColor: palette.border, borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 },
  categoryText: { color: palette.textPrimary, fontSize: 12, fontWeight: '600' },
  list: { paddingHorizontal: 16, paddingBottom: 30 },
  jobCard: { backgroundColor: palette.card, borderRadius: 12, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, elevation: 3 },
  jobCardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  jobTitle: { color: palette.textPrimary, fontSize: 16, fontWeight: '700' },
  pay: { color: palette.success, fontWeight: '700' },
  company: { color: palette.textSecondary, marginBottom: 8 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  tag: { backgroundColor: '#EEF2FF', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  tagText: { color: palette.primary, fontSize: 11, fontWeight: '700' },
  status: { color: palette.textSecondary, fontSize: 12 },
});
