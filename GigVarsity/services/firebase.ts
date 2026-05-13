import Constants from 'expo-constants';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const expoExtra = (Constants.expoConfig?.extra || {}) as Record<string, string | undefined>;

const firebaseConfig = {
  apiKey: expoExtra.EXPO_PUBLIC_FIREBASE_API_KEY ?? process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: expoExtra.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: expoExtra.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: expoExtra.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: expoExtra.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: expoExtra.EXPO_PUBLIC_FIREBASE_APP_ID ?? process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
export let auth: any = null;
export let db: Firestore | null = null;
export let storage: FirebaseStorage | null = null;
let initialized = false;

export function initializeFirebase() {
  if (initialized) return;
  initialized = true;

  if (!firebaseConfig.apiKey) {
    console.warn('Firebase API key is missing. Please add EXPO_PUBLIC_FIREBASE_API_KEY to .env');
    return;
  }

  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = (firebaseAuth as any).getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

// Initialize immediately on module load for Expo Go
initializeFirebase();

export function getFirebaseAuth(): any {
  return auth;
}

export function getFirestoreInstance(): Firestore | null {
  return db;
}

export function getStorageInstance(): FirebaseStorage | null {
  return storage;
}

export function getFirebaseApp(): FirebaseApp | null {
  return app;
}

export default app;