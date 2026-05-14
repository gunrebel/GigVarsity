import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
// @ts-ignore
import { getAuth } from 'firebase/auth';
import Constants from 'expo-constants';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

let app: FirebaseApp | null = null;
export let auth: any = null;
export let db: Firestore | null = null;
export let storage: FirebaseStorage | null = null;
let initialized = false;

function getExpoExtra(): Record<string, string | undefined> {
  const manifestExtra = ((Constants as any).manifest?.extra || {}) as Record<string, string | undefined>;
  const manifest2Extra = (((Constants as any).manifest2?.extra?.expoClient?.extra) || {}) as Record<string, string | undefined>;
  const expoConfigExtra = (Constants.expoConfig?.extra || {}) as Record<string, string | undefined>;

  return {
    ...manifestExtra,
    ...manifest2Extra,
    ...expoConfigExtra,
  };
}

function getFirebaseConfig() {
  const expoExtra = getExpoExtra();

  return {
    apiKey: expoExtra.EXPO_PUBLIC_FIREBASE_API_KEY ?? process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: expoExtra.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: expoExtra.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: expoExtra.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: expoExtra.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: expoExtra.EXPO_PUBLIC_FIREBASE_APP_ID ?? process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  };
}

export function initializeFirebase() {
  if (initialized) return;

  const firebaseConfig = getFirebaseConfig();

  if (!firebaseConfig.apiKey) {
    console.warn('Firebase API key is missing. Please add EXPO_PUBLIC_FIREBASE_API_KEY to .env');
    return;
  }

  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } else {
      app = getApp();
      // @ts-ignore
      auth = getAuth(app);
    }

    db = getFirestore(app);
    storage = getStorage(app);
    initialized = true;
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
