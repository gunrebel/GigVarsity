import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemePalette } from '@/constants/colors';

export default function ChatDetail() {
  const palette = useThemePalette();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  const [messages, setMessages] = useState([
    { from: 'other', text: 'Hello! How is the project going?' },
    { from: 'me', text: 'Going well, I\'ll submit by tomorrow.' },
  ]);
  const [text, setText] = useState('');

  const send = () => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { from: 'me', text: text.trim() }]);
    setText('');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <Text style={styles.backArrow}>←</Text>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>N</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerText}>NairaTech</Text>
          <Text style={styles.headerOnline}>● Online</Text>
        </View>
      </View>

      <ScrollView
        style={styles.messages}
        contentContainerStyle={styles.messagesContent}
      >
        <View style={styles.dateDivider}>
          <View style={styles.dateLine} />
          <Text style={styles.dateText}>Today</Text>
          <View style={styles.dateLine} />
        </View>

        {messages.map((msg, idx) => (
          <View
            key={idx}
            style={[styles.messageBubble, msg.from === 'me' ? styles.myBubble : styles.otherBubble]}
          >
            <View style={msg.from === 'me' ? styles.myBubbleInner : styles.otherBubbleInner}>
              <Text style={msg.from === 'me' ? styles.myText : styles.otherText}>
                {msg.text}
              </Text>
            </View>
            <Text style={[styles.timestamp, msg.from === 'me' ? styles.myTimestamp : styles.otherTimestamp]}>
              {msg.from === 'me' ? '✓✓ Just now' : 'Just now'}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#4A4870"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={send} activeOpacity={0.8}>
          <Text style={styles.sendText}>→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (_palette: any) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0B0B18' },
  header: {
    backgroundColor: '#0F0F20',
    borderBottomWidth: 1,
    borderBottomColor: '#1E1C40',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backArrow: { fontSize: 20, color: '#A78BFA', marginRight: 2 },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3D2FA8',
    borderWidth: 1.5,
    borderColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatarText: { fontSize: 14, fontWeight: '800', color: '#E0DEFF' },
  headerInfo: { flex: 1 },
  headerText: { fontSize: 14, fontWeight: '800', color: '#E0DEFF' },
  headerOnline: { fontSize: 11, color: '#34D399', fontWeight: '600', marginTop: 1 },
  messages: { flex: 1 },
  messagesContent: { padding: 16, gap: 8 },
  dateDivider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 8 },
  dateLine: { flex: 1, height: 1, backgroundColor: '#1E1C40' },
  dateText: { fontSize: 11, color: '#4A4870' },
  messageBubble: { marginBottom: 4, maxWidth: '80%' },
  myBubble: { alignSelf: 'flex-end' },
  otherBubble: { alignSelf: 'flex-start' },
  myBubbleInner: {
    backgroundColor: '#6C5CE7',
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  otherBubbleInner: {
    backgroundColor: '#161629',
    borderWidth: 1,
    borderColor: '#2D2B5E',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  myText: { color: '#FFFFFF', fontSize: 14, lineHeight: 20 },
  otherText: { color: '#E0DEFF', fontSize: 14, lineHeight: 20 },
  timestamp: { fontSize: 10, color: '#4A4870', marginTop: 3 },
  myTimestamp: { textAlign: 'right', marginRight: 4 },
  otherTimestamp: { marginLeft: 4 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0F0F20',
    borderTopWidth: 1,
    borderTopColor: '#1E1C40',
    gap: 10,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#161629',
    borderWidth: 1,
    borderColor: '#2D2B5E',
    borderRadius: 22,
    paddingHorizontal: 16,
    color: '#E0DEFF',
    fontSize: 14,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: { color: '#fff', fontSize: 20, fontWeight: '700', marginTop: -2 },
});
