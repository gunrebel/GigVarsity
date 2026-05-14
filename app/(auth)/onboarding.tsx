import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemePalette } from '@/constants/colors';

const slides = [
  { emoji: '🎓', title: 'Find Gigs as a Student', description: 'Search and apply to gigs and internships from Nigerian companies.' },
  { emoji: '🏢', title: 'Hire Student Talent', description: 'Hire vetted university students for flexible gig-based work.' },
  { emoji: '🛠️', title: 'Build Your Portfolio', description: 'Track work, ratings and get paid through secure milestones.' },
];

export default function OnboardingScreen() {
  const palette = useThemePalette();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  const router = useRouter();
  const [index, setIndex] = useState(0);

  const slide = useMemo(() => slides[index], [index]);

  const next = () => {
    if (index < slides.length - 1) setIndex(index + 1);
    else router.replace('/(auth)/choose-role');
  };

  const skip = () => {
    router.replace('/(auth)/choose-role');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>{slide.emoji}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={skip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={next} style={styles.nextButton}>
            <Text style={styles.nextText}>{index === slides.length - 1 ? 'Get Started' : 'Next'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (palette: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.primary, justifyContent: 'space-between', padding: 20 },
  card: { backgroundColor: palette.card, borderRadius: 16, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  emoji: { fontSize: 64, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: palette.textPrimary, textAlign: 'center', marginBottom: 12 },
  description: { fontSize: 16, color: palette.textSecondary, textAlign: 'center' },
  footer: { paddingTop: 20 },
  dots: { flexDirection: 'row', justifyContent: 'center' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: palette.border, marginHorizontal: 4 },
  dotActive: { backgroundColor: palette.accent },
  actions: { flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' },
  skipButton: { paddingVertical: 10, paddingHorizontal: 18 },
  skipText: { color: palette.textSecondary },
  nextButton: { backgroundColor: palette.accent, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
  nextText: { color: '#fff', fontWeight: '700' },
});
