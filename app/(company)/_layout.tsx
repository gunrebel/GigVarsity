import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemePalette } from '@/constants/colors';

export default function CompanyTabLayout() {
  const palette = useThemePalette();
  const commonOptions = {
    headerShown: false,
    tabBarButton: HapticTab,
    tabBarActiveTintColor: palette.secondary,
    tabBarStyle: { backgroundColor: palette.card, borderTopColor: palette.border, borderTopWidth: 1 },
  };

  return (
    <Tabs screenOptions={commonOptions}>
      <Tabs.Screen
        name="dashboard"
        options={{ title: 'Dashboard', tabBarIcon: ({ color }) => <IconSymbol size={22} name="chart.bar" color={color} /> }}
      />
      <Tabs.Screen
        name="post-job"
        options={{ title: 'Post Job', tabBarIcon: ({ color }) => <IconSymbol size={22} name="plus" color={color} /> }}
      />
      <Tabs.Screen
        name="talent"
        options={{ title: 'Talent', tabBarIcon: ({ color }) => <IconSymbol size={22} name="person.3" color={color} /> }}
      />
      <Tabs.Screen
        name="chat"
        options={{ title: 'Chat', tabBarIcon: ({ color }) => <IconSymbol size={22} name="bubble.left" color={color} /> }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: 'Settings', tabBarIcon: ({ color }) => <IconSymbol size={22} name="gear" color={color} /> }}
      />
    </Tabs>
  );
}