import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/store/authStore';
import { useThemePalette } from '@/constants/colors';

export default function ChooseRoleScreen() {
  const palette = useThemePalette();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  const router = useRouter();
  const setRole = useAuthStore((state) => state.setRole);
  const [selected, setSelected] = useState<'student' | 'company' | null>(null);

  const continuePress = () => {
    if (!selected) return;
    setRole(selected);
    const targetRoute = selected === 'company' ? '/(company)/dashboard' : '/(student)/home';
    router.replace(targetRoute);
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Decorative background blobs */}
      <View style={styles.blob1} />
      <View style={styles.blob2} />

      <View style={styles.inner}>

        {/* Header */}
        <Text style={styles.eyebrow}>Welcome</Text>
        <Text style={styles.heading}>Who are you?</Text>
        <Text style={styles.subheading}>Select your role to get started</Text>

        {/* Role cards */}
        <View style={styles.cardList}>
          {[
            {
              label: 'Student',
              description: 'Find gigs, build experience',
              emoji: '🎓',
              value: 'student' as const,
              accentColor: '#6C5CE7',
              accentBg: '#1E1A42',
            },
            {
              label: 'Company',
              description: 'Post gigs, hire students',
              emoji: '🏢',
              value: 'company' as const,
              accentColor: '#0EA5E9',
              accentBg: '#0C1E2E',
            },
          ].map((role) => {
            const active = selected === role.value;
            return (
              <TouchableOpacity
                key={role.value}
                activeOpacity={0.8}
                onPress={() => setSelected(role.value)}
                style={[
                  styles.card,
                  active && { borderColor: role.accentColor, borderWidth: 1.5 },
                ]}
              >
                {/* Decorative blob inside card */}
                <View style={[styles.cardBlob, { backgroundColor: role.accentColor }]} />

                <View style={styles.cardInner}>
                  {/* Emoji icon box */}
                  <View style={[styles.iconBox, { backgroundColor: role.accentBg }]}>
                    <Text style={styles.emoji}>{role.emoji}</Text>
                  </View>

                  {/* Text */}
                  <View style={styles.cardText}>
                    <Text style={[styles.roleLabel, !active && styles.roleLabelMuted]}>
                      {role.label}
                    </Text>
                    <Text style={[styles.roleDesc, !active && styles.roleDescMuted]}>
                      {role.description}
                    </Text>
                  </View>

                  {/* Radio */}
                  <View style={[styles.radio, active && { borderColor: role.accentColor }]}>
                    {active && <View style={[styles.radioDot, { backgroundColor: role.accentColor }]} />}
                  </View>
                </View>

                {/* Selected badge */}
                {active && (
                  <View style={[styles.badge, { backgroundColor: role.accentColor }]}>
                    <Text style={styles.badgeText}>Selected</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Info note */}
        <View style={styles.infoStrip}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            You can only belong to one role. This cannot be changed later.
          </Text>
        </View>

      </View>

      {/* Continue button pinned to bottom */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={continuePress}
          disabled={!selected}
          activeOpacity={0.85}
          style={[styles.submit, !selected && styles.submitDisabled]}
        >
          <Text style={styles.submitText}>
            {selected ? `Continue as ${selected.charAt(0).toUpperCase() + selected.slice(1)}` : 'Select a role'}
          </Text>
          {selected && <Text style={styles.submitArrow}>→</Text>}
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const getStyles = (_palette: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0B18',
  },
  blob1: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#3D2FA8',
    opacity: 0.35,
  },
  blob2: {
    position: 'absolute',
    top: 80,
    right: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6C5CE7',
    opacity: 0.18,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: '#A78BFA',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heading: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 13,
    color: '#6B6A8D',
    marginBottom: 32,
  },
  cardList: {
    gap: 12,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#161629',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D2B5E',
    overflow: 'hidden',
    padding: 16,
  },
  cardBlob: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 90,
    height: 90,
    borderRadius: 45,
    opacity: 0.12,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  cardText: {
    flex: 1,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#E0DEFF',
    marginBottom: 3,
  },
  roleLabelMuted: {
    color: '#6B6A8D',
  },
  roleDesc: {
    fontSize: 12,
    color: '#A78BFA',
  },
  roleDescMuted: {
    color: '#4A4870',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#2D2B5E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 44,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  infoStrip: {
    backgroundColor: '#0F0F20',
    borderWidth: 1,
    borderColor: '#1E1C40',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoIcon: {
    fontSize: 14,
    marginTop: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#6B6A8D',
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  submit: {
    backgroundColor: '#6C5CE7',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  submitDisabled: {
    backgroundColor: '#1E1C3A',
  },
  submitText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  submitArrow: {
    color: '#fff',
    fontSize: 16,
  },
});
