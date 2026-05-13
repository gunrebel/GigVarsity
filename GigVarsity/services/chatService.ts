import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from './firebase';

export interface Conversation {
  conversationId: string;
  participants: string[];
  participantNames: Record<string, string>;
  participantRoles: Record<string, string>;
  jobId?: string;
  lastMessage: string;
  lastMessageTime: any;
  createdAt: any;
}

export interface Message {
  messageId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: any;
  read: boolean;
}

function ensureDb() {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized');
  }
  return db;
}

export async function createOrGetConversation(
  currentUserId: string,
  otherUserId: string,
  currentUserName: string,
  otherUserName: string,
  currentUserRole: string,
  otherUserRole: string,
  jobId?: string
): Promise<string> {
  const dbInstance = ensureDb();
  const conversationsRef = collection(dbInstance, 'conversations');
  const conversationsQuery = query(conversationsRef, where('participants', 'array-contains', currentUserId));
  const snapshot = await getDocs(conversationsQuery);

  const existing = snapshot.docs.find((docSnap) => {
    const data = docSnap.data() as Conversation;
    return data.participants.includes(otherUserId);
  });

  if (existing) {
    return existing.id;
  }

  const conversationData = {
    participants: [currentUserId, otherUserId],
    participantNames: {
      [currentUserId]: currentUserName,
      [otherUserId]: otherUserName,
    },
    participantRoles: {
      [currentUserId]: currentUserRole,
      [otherUserId]: otherUserRole,
    },
    jobId: jobId || '',
    lastMessage: '',
    lastMessageTime: serverTimestamp(),
    createdAt: serverTimestamp(),
  };

  const conversationRef = await addDoc(conversationsRef, conversationData);
  await updateDoc(conversationRef, { conversationId: conversationRef.id });
  return conversationRef.id;
}

export function getConversations(userId: string, callback: (conversations: Conversation[]) => void): () => void {
  const dbInstance = ensureDb();
  const conversationsRef = collection(dbInstance, 'conversations');
  const conversationsQuery = query(conversationsRef, where('participants', 'array-contains', userId), orderBy('lastMessageTime', 'desc'));

  const unsubscribe = onSnapshot(conversationsQuery, (snapshot) => {
    const conversations = snapshot.docs.map((docSnap) => ({
      ...(docSnap.data() as Conversation),
      conversationId: docSnap.id,
    }));
    callback(conversations);
  });

  return unsubscribe;
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  senderName: string,
  text: string
): Promise<void> {
  const dbInstance = ensureDb();
  const messagesRef = collection(dbInstance, 'conversations', conversationId, 'messages');
  const messageRef = await addDoc(messagesRef, {
    senderId,
    senderName,
    text,
    createdAt: serverTimestamp(),
    read: false,
  });
  await updateDoc(doc(dbInstance, 'conversations', conversationId), {
    lastMessage: text,
    lastMessageTime: serverTimestamp(),
  });
}

export function getMessages(conversationId: string, callback: (messages: Message[]) => void): () => void {
  const dbInstance = ensureDb();
  const messagesRef = collection(dbInstance, 'conversations', conversationId, 'messages');
  const messagesQuery = query(messagesRef, orderBy('createdAt', 'asc'));

  const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
    const messages = snapshot.docs.map((docSnap) => ({
      ...(docSnap.data() as Message),
      messageId: docSnap.id,
    }));
    callback(messages);
  });

  return unsubscribe;
}
