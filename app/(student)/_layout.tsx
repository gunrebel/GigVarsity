import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function StudentTabLayout() {
  const commonOptions = {
    headerShown: false,
    tabBarButton: HapticTab,
    tabBarActiveTintColor: '#6C5CE7',
    tabBarInactiveTintColor: '#4A4870',
    tabBarStyle: {
      backgroundColor: '#0F0F20',
      borderTopColor: '#1E1C40',
      borderTopWidth: 1,
      height: 64,
      paddingBottom: 8,
    },
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: '600' as const,
    },
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
