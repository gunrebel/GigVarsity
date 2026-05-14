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
    if (!db) {
      Alert.alert('Error', 'Database is not available right now.');
      return;
    }
    const firestore = db;

    setIsSubmitting(true);
    try {
      // Fetch student profile to include in the application
      const userDoc = await getDoc(doc(firestore, 'users', user.uid));
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

        <Text style={styles.eyebrow}>Application</Text>
        <Text style={styles.jobTitle}>
          Applying for{'\n'}{jobData?.title || 'UI Designer'}
        </Text>

        {/* Cover letter */}
        <View style={styles.coverLabelRow}>
          <Text style={styles.fieldLabel}>Cover Letter</Text>
          <View style={styles.aiBadge}>
            <Text>🤖</Text>
            <Text style={styles.aiBadgeText}>AI-written</Text>
          </View>
        </View>
        <TextInput
          multiline
          value={coverLetter}
          onChangeText={setCoverLetter}
          style={styles.textArea}
          placeholder="Your cover letter will appear here..."
          placeholderTextColor="#4A4870"
        />

        <TouchableOpacity
          style={styles.regenBtn}
          onPress={regenerate}
          disabled={isGenerating}
          activeOpacity={0.8}
        >
          <Text style={styles.regenIcon}>✨</Text>
          <Text style={styles.regenText}>
            {isGenerating ? 'Generating...' : 'Regenerate with AI'}
          </Text>
        </TouchableOpacity>

        {/* Date */}
        <Text style={styles.fieldLabel}>Availability Date</Text>
        <TextInput
          value={date}
          onChangeText={setDate}
          style={styles.input}
          placeholderTextColor="#4A4870"
        />

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
          onPress={submit}
          disabled={isSubmitting}
          activeOpacity={0.85}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.submitText}>Submit Application</Text>
              <Text style={styles.submitArrow}>→</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (_palette: any) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B0B18' },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A78BFA',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A78BFA',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  coverLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1A42',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 4,
  },
  aiBadgeText: { color: '#A78BFA', fontSize: 11, fontWeight: '700' },
  textArea: {
    height: 180,
    borderWidth: 1,
    borderColor: '#2D2B5E',
    borderRadius: 14,
    padding: 14,
    textAlignVertical: 'top',
    backgroundColor: '#161629',
    marginBottom: 10,
    color: '#E0DEFF',
    fontSize: 14,
    lineHeight: 22,
  },
  regenBtn: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    backgroundColor: '#1E1A42',
    borderRadius: 14,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: '#6C5CE7',
  },
  regenIcon: { fontSize: 16 },
  regenText: { color: '#A78BFA', fontWeight: '700', fontSize: 14 },
  input: {
    borderWidth: 1,
    borderColor: '#2D2B5E',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#161629',
    marginBottom: 28,
    color: '#E0DEFF',
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: '#6C5CE7',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  submitBtnDisabled: {
    backgroundColor: '#1E1C3A',
  },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 15, letterSpacing: 0.3 },
  submitArrow: { color: '#fff', fontSize: 18 },
});
