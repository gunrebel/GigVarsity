import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemePalette } from '@/constants/colors';

export default function StudentTabLayout() {
  const palette = useThemePalette();
  const commonOptions = {
    headerShown: false,
    tabBarButton: HapticTab,
    tabBarActiveTintColor: palette.primary,
    tabBarStyle: { backgroundColor: palette.card, borderTopColor: palette.border, borderTopWidth: 1 },
  };

  return (
    <Tabs screenOptions={commonOptions}>
      <Tabs.Screen
        name="home"
        options={{ title: 'Home', tabBarIcon: ({ color }) => <IconSymbol size={22} name="house" color={color} /> }}
      />
      <Tabs.Screen
        name="browse"
        options={{ title: 'Browse', tabBarIcon: ({ color }) => <IconSymbol size={22} name="magnifyingglass" color={color} /> }}
      />
      <Tabs.Screen
        name="chat"
        options={{ title: 'Chat', tabBarIcon: ({ color }) => <IconSymbol size={22} name="bubble.left" color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ color }) => <IconSymbol size={22} name="person" color={color} /> }}
      />
      <Tabs.Screen
        name="applications"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="job-detail"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="apply"
        options={{ href: null }}
      />
    </Tabs>
  );
}