import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PostJobScreen() {
  const styles = React.useMemo(() => getStyles(), []);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('2026-05-10');
  const [jobType, setJobType] = useState('Gig');
  const [workMode, setWorkMode] = useState('Remote');

  const submit = () => {
    alert('Post job: ' + title);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Company Studio</Text>
          <Text style={styles.heading}>Post a Job</Text>
          <Text style={styles.subheading}>Create a role that feels polished, clear, and easy for the right students to say yes to.</Text>
        </View>

        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <View>
              <Text style={styles.previewLabel}>Role preview</Text>
              <Text style={styles.previewTitle}>{title || 'Your next role title'}</Text>
            </View>
            <View style={styles.previewBadge}>
              <Text style={styles.previewBadgeText}>AI-assisted</Text>
            </View>
          </View>
          <Text style={styles.previewCopy}>
            {description.trim() || 'Describe what you need, the impact of the role, and what success looks like for the student you hire.'}
          </Text>
          <View style={styles.previewMetaRow}>
            <Text style={styles.metaPill}>{jobType}</Text>
            <Text style={styles.metaPill}>{workMode}</Text>
            <Text style={styles.metaPill}>{budget ? `N${budget}` : 'Budget pending'}</Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Job Basics</Text>
          <TextInput
            style={styles.input}
            value={title}
            placeholder="Job Title"
            placeholderTextColor="#4A4870"
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, styles.description]}
            multiline
            textAlignVertical="top"
            value={description}
            placeholder="Description"
            placeholderTextColor="#4A4870"
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            value={skills}
            placeholder="Required Skills (comma separated)"
            placeholderTextColor="#4A4870"
            onChangeText={setSkills}
          />
          <TextInput
            style={styles.input}
            value={budget}
            placeholder="Budget (N)"
            placeholderTextColor="#4A4870"
            onChangeText={setBudget}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={deadline}
            placeholder="Deadline"
            placeholderTextColor="#4A4870"
            onChangeText={setDeadline}
          />
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Setup</Text>
          <Text style={styles.selectorLabel}>Job Type</Text>
          <View style={styles.selectRow}>
            <TouchableOpacity
              style={[styles.select, jobType === 'Gig' && styles.selected]}
              onPress={() => setJobType('Gig')}
              activeOpacity={0.85}
            >
              <Text style={[styles.selectText, jobType === 'Gig' && styles.selectedText]}>Gig</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.select, jobType === 'Internship' && styles.selected]}
              onPress={() => setJobType('Internship')}
              activeOpacity={0.85}
            >
              <Text style={[styles.selectText, jobType === 'Internship' && styles.selectedText]}>Internship</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.selectorLabel}>Work Mode</Text>
          <View style={styles.selectRow}>
            <TouchableOpacity
              style={[styles.select, workMode === 'Remote' && styles.selected]}
              onPress={() => setWorkMode('Remote')}
              activeOpacity={0.85}
            >
              <Text style={[styles.selectText, workMode === 'Remote' && styles.selectedText]}>Remote</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.select, workMode === 'Onsite' && styles.selected]}
              onPress={() => setWorkMode('Onsite')}
              activeOpacity={0.85}
            >
              <Text style={[styles.selectText, workMode === 'Onsite' && styles.selectedText]}>Onsite</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.aiCard}>
            <View style={styles.aiIcon}>
              <Text style={styles.aiIconText}>AI</Text>
            </View>
            <View style={styles.aiContent}>
              <Text style={styles.aiTitle}>Smart matching enabled</Text>
              <Text style={styles.aiNote}>AI will rank top-fit students based on skills, availability, and portfolio strength.</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.postBtn} onPress={submit} activeOpacity={0.88}>
          <Text style={styles.postText}>Post Job</Text>
          <Text style={styles.postArrow}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = () => StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B0B18' },
  blob1: {
    position: 'absolute',
    top: -30,
    right: -35,
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#3D2FA8',
    opacity: 0.24,
  },
  blob2: {
    position: 'absolute',
    top: 70,
    right: 12,
    width: 86,
    height: 86,
    borderRadius: 43,
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
  heading: { color: '#FFFFFF', fontSize: 28, fontWeight: '900', letterSpacing: -0.6, marginBottom: 8 },
  subheading: { color: '#8A899C', fontSize: 14, lineHeight: 22 },
  previewCard: {
    backgroundColor: '#161629',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2D2B5E',
    padding: 18,
    marginBottom: 16,
  },
  previewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, gap: 12 },
  previewLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A78BFA',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  previewTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', lineHeight: 26 },
  previewBadge: {
    backgroundColor: '#0F2A1E',
    borderWidth: 1,
    borderColor: '#065F46',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  previewBadgeText: { color: '#34D399', fontSize: 11, fontWeight: '700' },
  previewCopy: { color: '#8A899C', fontSize: 13, lineHeight: 20, marginBottom: 14 },
  previewMetaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metaPill: {
    color: '#A78BFA',
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: '#1E1A42',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  formCard: {
    backgroundColor: '#0F0F20',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#1E1C40',
    padding: 18,
    marginBottom: 14,
  },
  sectionTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '800', marginBottom: 14 },
  input: {
    backgroundColor: '#161629',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D2B5E',
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    minHeight: 50,
    color: '#E0DEFF',
    fontSize: 14,
  },
  description: { minHeight: 120 },
  selectorLabel: {
    color: '#8A899C',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginTop: 2,
  },
  selectRow: { flexDirection: 'row', marginBottom: 14, gap: 10 },
  select: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#2D2B5E',
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#161629',
  },
  selected: {
    borderColor: '#6C5CE7',
    backgroundColor: '#1E1A42',
    shadowColor: '#6C5CE7',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  selectText: { color: '#8A899C', fontSize: 14, fontWeight: '700' },
  selectedText: { color: '#E0DEFF' },
  aiCard: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: '#161629',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#2D2B5E',
    padding: 14,
    marginTop: 4,
  },
  aiIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E1A42',
    borderWidth: 1,
    borderColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiIconText: { color: '#A78BFA', fontSize: 12, fontWeight: '900' },
  aiContent: { flex: 1 },
  aiTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '800', marginBottom: 4 },
  aiNote: { fontSize: 12, color: '#6B6A8D', lineHeight: 18 },
  postBtn: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 17,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  postText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16, letterSpacing: 0.2 },
  postArrow: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
});
