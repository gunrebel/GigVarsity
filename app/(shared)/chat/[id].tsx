import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useThemePalette } from '@/constants/colors';

export default function ChatDetail() {
  const palette = useThemePalette();
  const styles = React.useMemo(() => getStyles(palette), [palette]);
  const { id } = useLocalSearchParams<{ id: string }>();
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
        <Text style={styles.headerText}>Chat {id}</Text>
      </View>
      <ScrollView style={styles.messages} contentContainerStyle={{ padding: 10 }}>
        {messages.map((msg, idx) => (
          <View key={idx} style={[styles.messageBubble, msg.from === 'me' ? styles.myBubble : styles.otherBubble]}>
            <Text style={msg.from === 'me' ? styles.myText : styles.otherText}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={send}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (palette: any) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.background },
  header: { backgroundColor: palette.primary, padding: 16 },
  headerText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  messages: { flex: 1 },
  messageBubble: { marginBottom: 8, padding: 10, borderRadius: 10, maxWidth: '80%' },
  myBubble: { alignSelf: 'flex-end', backgroundColor: palette.primary },
  otherBubble: { alignSelf: 'flex-start', backgroundColor: palette.card, borderWidth: 1, borderColor: palette.border },
  myText: { color: '#fff' },
  otherText: { color: palette.textPrimary },
  inputRow: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderColor: palette.border, backgroundColor: palette.card },
  input: { flex: 1, height: 44, borderWidth: 1, borderColor: palette.border, borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#F9FAFB' },
  sendBtn: { marginLeft: 8, paddingHorizontal: 16, justifyContent: 'center', backgroundColor: palette.accent, borderRadius: 8 },
  sendText: { color: '#fff', fontWeight: '600' },
});