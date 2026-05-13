import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemePalette } from '@/constants/colors';

export default function PostJobScreen() {
  const palette = useThemePalette();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
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
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Post a Job</Text>
        <TextInput style={styles.input} value={title} placeholder="Job Title" onChangeText={setTitle} />
        <TextInput style={[styles.input, styles.description]} multiline value={description} placeholder="Description" onChangeText={setDescription} />
        <TextInput style={styles.input} value={skills} placeholder="Required Skills (comma separated)" onChangeText={setSkills} />
        <TextInput style={styles.input} value={budget} placeholder="Budget (₦)" onChangeText={setBudget} keyboardType="numeric" />
        <TextInput style={styles.input} value={deadline} placeholder="Deadline" onChangeText={setDeadline} />

        <View style={styles.selectRow}>
          <TouchableOpacity style={[styles.select, jobType === 'Gig' && styles.selected]} onPress={() => setJobType('Gig')}><Text>Gig</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.select, jobType === 'Internship' && styles.selected]} onPress={() => setJobType('Internship')}><Text>Internship</Text></TouchableOpacity>
        </View>
        <View style={styles.selectRow}>
          <TouchableOpacity style={[styles.select, workMode === 'Remote' && styles.selected]} onPress={() => setWorkMode('Remote')}><Text>Remote</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.select, workMode === 'Onsite' && styles.selected]} onPress={() => setWorkMode('Onsite')}><Text>Onsite</Text></TouchableOpacity>
        </View>

        <Text style={styles.aiNote}>AI will match top students for your job post.</Text>

        <TouchableOpacity style={styles.postBtn} onPress={submit}><Text style={styles.postText}>Post Job</Text></TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (palette: any) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  container: { padding: 16 },
  heading: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  input: { backgroundColor: palette.card, borderRadius: 10, borderWidth: 1, borderColor: palette.border, marginBottom: 10, padding: 12, minHeight: 45 },
  description: { minHeight: 100 },
  selectRow: { flexDirection: 'row', marginBottom: 10 },
  select: { flex: 1, padding: 10, borderWidth: 1, borderColor: palette.border, borderRadius: 10, alignItems: 'center' },
  selected: { borderColor: palette.primary, backgroundColor: '#EFF6FF' },
  aiNote: { fontSize: 12, color: palette.textSecondary, marginVertical: 12 },
  postBtn: { backgroundColor: palette.secondary, padding: 14, borderRadius: 10, alignItems: 'center' },
  postText: { color: '#fff', fontWeight: '700' },
});
