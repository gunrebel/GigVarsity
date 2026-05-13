import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useThemePalette } from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';

export default function StudentSettings() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const { isDarkMode, setDarkMode } = useThemeStore();
  const palette = useThemePalette();
  const styles = React.useMemo(() => getStyles(palette), [palette]);

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={palette.card} />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.settingItem} onPress={() => router.push('/(student)/profile')}>
            <View style={styles.settingContent}>
              <Ionicons name="person" size={24} color={palette.primary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Edit Profile</Text>
                <Text style={styles.settingDescription}>Update your profile information</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={palette.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons name="lock-closed" size={24} color={palette.primary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Change Password</Text>
                <Text style={styles.settingDescription}>Update your password</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={palette.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons name="notifications" size={24} color={palette.primary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive job and message alerts</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: palette.border, true: palette.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons name="mail" size={24} color={palette.primary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Email Alerts</Text>
                <Text style={styles.settingDescription}>Receive email updates</Text>
              </View>
            </View>
            <Switch
              value={emailAlerts}
              onValueChange={setEmailAlerts}
              trackColor={{ false: palette.border, true: palette.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons name="moon" size={24} color={palette.primary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDescription}>Enable dark theme</Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: palette.border, true: palette.primary }}
              thumbColor="#fff"
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons name="language" size={24} color={palette.primary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Language</Text>
                <Text style={styles.settingDescription}>English</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={palette.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons name="information-circle" size={24} color={palette.primary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>About the App</Text>
                <Text style={styles.settingDescription}>Version 1.0.0</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={palette.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Ionicons name="document-text" size={24} color={palette.primary} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingLabel}>Privacy Policy</Text>
                <Text style={styles.settingDescription}>Read our privacy policy</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={palette.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (palette: any) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  header: {
    backgroundColor: palette.primary,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.textPrimary,
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: palette.border,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.textPrimary,
  },
  settingDescription: {
    fontSize: 12,
    color: palette.textSecondary,
    marginTop: 2,
  },
});
