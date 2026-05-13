import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc } from 'firebase/firestore';

import { askAI } from '@/services/aiService';
import { submitApplication } from '@/services/applicationsService';
import { db } from '@/services/firebase';
import { useAuthStore } from '@/store/authStore';
import { useThemePalette } from '@/constants/colors';

export default function Apply() {
  const palette = useThemePalette();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  const router = useRouter();
  const { job } = useLocalSearchParams<{ job: string }>();
  const jobData = useMemo(() => job ? JSON.parse(job) : null, [job]);
  const [coverLetter, setCoverLetter] = useState('');
  const [date, setDate] = useState('2026-04-01');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const load = async () => {
      setIsGenerating(true);
      const text = await askAI(`Write a short cover letter for a ${jobData?.title || 'UI Designer'} role in Nigeria`);
      setCoverLetter(text);
      setIsGenerating(false);
    };
    load();
  }, [jobData]);

  const regenerate = async () => {
    setIsGenerating(true);
    const text = await askAI('Regenerate a cover letter for the same role, with confidence and Nigerian tone');
    setCoverLetter(text);
    setIsGenerating(false);
  };

  const submit = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to apply.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Fetch student profile to include in the application
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const profileData = userDoc.exists() ? userDoc.data() : {};

      const applicationData = {
        jobId: jobData?.id || jobData?.jobId || 'unknown-job',
        jobTitle: jobData?.title || 'Unknown Job',
        companyId: jobData?.companyId || 'unknown-company',
        companyName: jobData?.company || 'Unknown Company',
        studentId: user.uid,
        studentName: profileData.name || user.displayName || 'Student',
        studentUniversity: profileData.university || 'Not specified',
        studentSkills: profileData.skills || [],
        coverLetter: coverLetter,
      };

      await submitApplication(applicationData);

      Alert.alert('Success', 'Application submitted successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error submitting application:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Text style={styles.jobTitle}>Applying for {jobData?.title || 'UI Designer'}</Text>
        <TextInput multiline value={coverLetter} onChangeText={setCoverLetter} style={styles.textArea} placeholder="Cover letter" />
        <TouchableOpacity style={styles.regenBtn} onPress={regenerate} disabled={isGenerating}>
          <Text style={styles.regenText}>{isGenerating ? 'Generating...' : 'Regenerate with AI'}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Availability Date</Text>
        <TextInput value={date} onChangeText={setDate} style={styles.input} />

        <TouchableOpacity style={styles.submitBtn} onPress={submit} disabled={isSubmitting}>
          {isSubmitting ? (
            <ActivityIndicator color={palette.card} />
          ) : (
            <Text style={styles.submitText}>Submit Application</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (palette: any) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  container: { flex: 1, padding: 16 },
  jobTitle: { fontSize: 20, fontWeight: '800', color: palette.textPrimary, marginBottom: 12 },
  textArea: { height: 170, borderWidth: 1, borderColor: palette.border, borderRadius: 10, padding: 12, textAlignVertical: 'top', backgroundColor: palette.card, marginBottom: 12 },
  regenBtn: { alignItems: 'center', paddingVertical: 10, backgroundColor: '#EDE9FE', borderRadius: 10, marginBottom: 14 },
  regenText: { color: palette.secondary, fontWeight: '700' },
  label: { marginBottom: 6, color: palette.textSecondary },
  input: { borderWidth: 1, borderColor: palette.border, borderRadius: 8, padding: 10, backgroundColor: palette.card, marginBottom: 18 },
  submitBtn: { backgroundColor: palette.accent, borderRadius: 10, padding: 14, alignItems: 'center' },
  submitText: { color: '#fff', fontWeight: '800' },
});
