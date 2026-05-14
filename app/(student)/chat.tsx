import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemePalette } from '@/constants/colors';

const conversations = [
  { id: '1', name: 'NairaTech', lastMessage: 'Your application has been received', time: '2h ago' },
  { id: '2', name: 'Lagos Labs', lastMessage: 'Interview scheduled for tomorrow', time: '1d ago' },
];

export default function StudentChat() {
  const palette = useThemePalette();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  const router = useRouter();

  const renderConversation = ({ item, index }: { item: typeof conversations[0]; index: number }) => {
    const isUnread = index === 0;
    return (
      <TouchableOpacity
        style={isUnread ? styles.conversationItem : styles.conversationItemRead}
        activeOpacity={0.8}
        onPress={() => router.push({ pathname: '/(shared)/chat/[id]', params: { id: item.id } })}
      >
        <View style={styles.avatarWrapper}>
          <View style={isUnread ? styles.avatar : styles.avatarRead}>
            <Text style={isUnread ? styles.avatarText : styles.avatarTextRead}>{item.name[0]}</Text>
          </View>
          {isUnread && <View style={styles.unreadDot} />}
        </View>
        <View style={styles.conversationContent}>
          <View style={styles.nameRow}>
            <Text style={isUnread ? styles.conversationName : styles.conversationNameRead}>{item.name}</Text>
            <Text style={isUnread ? styles.time : styles.timeRead}>{item.time}</Text>
          </View>
          <Text style={isUnread ? styles.lastMessage : styles.lastMessageRead} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Inbox</Text>
        <Text style={styles.headerText}>Messages</Text>
      </View>
      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyText}>Your conversations appear here</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const getStyles = (_palette: any) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B0B18' },
  header: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20 },
  eyebrow: { fontSize: 11, fontWeight: '700', color: '#A78BFA', letterSpacing: 1.8, textTransform: 'uppercase', marginBottom: 4 },
  headerText: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', letterSpacing: -0.5 },
  list: { paddingHorizontal: 24, paddingTop: 4, paddingBottom: 30 },
  conversationItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161629', borderRadius: 16, borderWidth: 1, borderColor: '#2D2B5E', padding: 14, marginBottom: 8, gap: 12 },
  conversationItemRead: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F0F20', borderRadius: 16, borderWidth: 1, borderColor: '#1A1835', padding: 14, marginBottom: 8, gap: 12 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#3D2FA8', borderWidth: 2, borderColor: '#6C5CE7', justifyContent: 'center', alignItems: 'center' },
  avatarRead: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#1A1835', borderWidth: 1.5, borderColor: '#2D2B5E', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#E0DEFF', fontSize: 16, fontWeight: '800' },
  avatarTextRead: { color: '#6B6A8D', fontSize: 16, fontWeight: '800' },
  unreadDot: { position: 'absolute', top: 0, right: 0, width: 11, height: 11, borderRadius: 5.5, backgroundColor: '#6C5CE7', borderWidth: 2, borderColor: '#0B0B18' },
  conversationContent: { flex: 1 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  conversationName: { fontSize: 14, fontWeight: '800', color: '#E0DEFF' },
  conversationNameRead: { fontSize: 14, fontWeight: '800', color: '#8A899C' },
  lastMessage: { fontSize: 12, color: '#A78BFA', fontWeight: '500' },
  lastMessageRead: { fontSize: 12, color: '#4A4870' },
  time: { fontSize: 11, color: '#6B6A8D' },
  timeRead: { fontSize: 11, color: '#4A4870' },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 10, opacity: 0.4 },
  emptyIcon: { fontSize: 40 },
  emptyText: { fontSize: 13, color: '#6B6A8D', textAlign: 'center' },
});
