import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemePalette } from '@/constants/colors';

const conversations = [
  { id: '1', name: 'John Doe', lastMessage: 'I have submitted my work', time: '1h ago' },
  { id: '2', name: 'Jane Smith', lastMessage: 'When will payment be released?', time: '3h ago' },
];

export default function CompanyChat() {
  const palette = useThemePalette();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  const router = useRouter();

  const renderConversation = ({ item }: { item: typeof conversations[0] }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => router.push({ pathname: '/(shared)/chat/[id]', params: { id: item.id } })}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name[0]}</Text>
      </View>
      <View style={styles.conversationContent}>
        <Text style={styles.conversationName}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
      <Text style={styles.time}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Text style={styles.headerText}>Messages</Text>
      </View>
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

const getStyles = (palette: any) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  header: { backgroundColor: palette.secondary, padding: 16 },
  headerText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  conversationContent: { flex: 1 },
  conversationName: { fontSize: 16, fontWeight: '600', color: palette.textPrimary },
  lastMessage: { fontSize: 14, color: palette.textSecondary, marginTop: 2 },
  time: { fontSize: 12, color: palette.textSecondary },
});
