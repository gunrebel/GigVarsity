import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { Platform } from 'react-native';
import { getFirebaseAuth, getFirestoreInstance, initializeFirebase } from './firebase';
import { useAuthStore } from '../store/authStore';
import { getFirebaseErrorMessage } from '../utils/errorHandler';

const firebaseAuth: any = require('firebase/auth');

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'company';
  university?: string;
  course?: string;
  yearOfStudy?: string;
  skills?: string[];
  companyName?: string;
  industry?: string;
}

const authStore = useAuthStore;

function ensureAuth() {
  initializeFirebase();
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('Firebase auth is not initialized');
  }
  return auth;
}

function ensureDb() {
  initializeFirebase();
  const db = getFirestoreInstance();
  if (!db) {
    throw new Error('Firebase Firestore is not initialized');
  }
  return db;
}

async function syncGoogleUser(user: any, dbInstance: any): Promise<void> {
  const userDocRef = doc(dbInstance, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    await setDoc(userDocRef, {
      uid: user.uid,
      name: user.displayName || '',
      email: user.email || '',
      role: null,
      createdAt: serverTimestamp(),
      profileComplete: false,
      isVerified: false,
    });
    authStore.getState().setUser(user);
    authStore.getState().setRole(null);
    return;
  }

  const userData = userDoc.data() as any;
  authStore.getState().setUser(user);
  authStore.getState().setRole(userData.role || null);
}

export async function registerUser(data: RegisterData): Promise<void> {
  const authInstance = ensureAuth();
  const dbInstance = ensureDb();

  try {
    const credential = await firebaseAuth.createUserWithEmailAndPassword(authInstance, data.email, data.password);
    const user = credential.user;

    if (!user) {
      throw new Error('Unable to create user account');
    }

    const userDoc = doc(dbInstance, 'users', user.uid);
    const baseData = {
      uid: user.uid,
      name: data.name,
      email: data.email,
      role: data.role,
      createdAt: serverTimestamp(),
      profileComplete: false,
    } as any;

    if (data.role === 'student') {
      Object.assign(baseData, {
        university: data.university || '',
        course: data.course || '',
        yearOfStudy: data.yearOfStudy || '',
        skills: data.skills || [],
        bio: '',
        availability: '',
        portfolioItems: [],
        followers: [],
        following: [],
        rating: 0,
        totalRatings: 0,
        totalEarned: 0,
        isVerified: false,
        profileImageUrl: '',
      });
    } else {
      Object.assign(baseData, {
        companyName: data.companyName || '',
        industry: data.industry || '',
        description: '',
        website: '',
        logoUrl: '',
        followers: [],
        following: [],
        isVerified: false,
      });
    }

    await setDoc(userDoc, baseData);

    if (data.name && authInstance.currentUser) {
      await firebaseAuth.updateProfile(authInstance.currentUser, { displayName: data.name });
    }

    authStore.getState().setUser(user);
    authStore.getState().setRole(data.role);
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}

export async function loginUser(email: string, password: string): Promise<void> {
  const authInstance = ensureAuth();
  const dbInstance = ensureDb();

  try {
    const credential = await firebaseAuth.signInWithEmailAndPassword(authInstance, email, password);
    const user = credential.user;
    const userDoc = await getDoc(doc(dbInstance, 'users', user.uid));

    if (!userDoc.exists()) {
      throw new Error('No account found with this email');
    }

    const userData = userDoc.data() as any;
    authStore.getState().setUser(user);
    authStore.getState().setRole(userData.role || null);
  } catch (error: any) {
    const code = error?.code;
    if (code === 'auth/user-not-found') {
      throw new Error('No account found with this email');
    }
    if (code === 'auth/wrong-password') {
      throw new Error('Incorrect password');
    }
    if (code === 'auth/too-many-requests') {
      throw new Error('Too many attempts. Try again later');
    }
    throw new Error(getFirebaseErrorMessage(error));
  }
}

export async function loginWithGoogle(): Promise<void> {
  if (Platform.OS !== 'web') {
    throw new Error('Google sign-in is not configured for mobile yet. Use email and password for now.');
  }

  const authInstance = ensureAuth();
  const dbInstance = ensureDb();
  const provider = new firebaseAuth.GoogleAuthProvider();

  try {
    const result = await firebaseAuth.signInWithPopup(authInstance, provider);
    const user = result.user;

    if (!user) {
      throw new Error('Google sign in failed');
    }

    await syncGoogleUser(user, dbInstance);
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}

export async function loginWithGoogleDemo(): Promise<void> {
  const demoUser = {
    uid: 'demo-google-user',
    displayName: 'Libby',
    email: 'libby@gigvarsity.app',
    emailVerified: true,
    isAnonymous: false,
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString(),
    },
    phoneNumber: null,
    photoURL: null,
    providerData: [],
    providerId: 'google.com',
    refreshToken: 'demo-refresh-token',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'demo-id-token',
    getIdTokenResult: async () => ({
      authTime: new Date().toISOString(),
      claims: {},
      expirationTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      issuedAtTime: new Date().toISOString(),
      signInProvider: 'google.com',
      signInSecondFactor: null,
      token: 'demo-id-token',
    }),
    reload: async () => {},
    toJSON: () => ({
      uid: 'demo-google-user',
      displayName: 'Libby',
      email: 'libby@gigvarsity.app',
    }),
  } as any;

  authStore.getState().setUser(demoUser);
  authStore.getState().setRole(null);
}

export async function loginWithGoogleIdToken(idToken: string): Promise<void> {
  const authInstance = ensureAuth();
  const dbInstance = ensureDb();

  try {
    const credential = firebaseAuth.GoogleAuthProvider.credential(idToken);
    const result = await firebaseAuth.signInWithCredential(authInstance, credential);
    const user = result.user;

    if (!user) {
      throw new Error('Google sign in failed');
    }

    await syncGoogleUser(user, dbInstance);
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}

export async function logoutUser(): Promise<void> {
  try {
    const authInstance = ensureAuth();
    await firebaseAuth.signOut(authInstance);
    authStore.getState().clearAuth();
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error(getFirebaseErrorMessage(error));
  }
}

export async function resetPassword(email: string): Promise<void> {
  const authInstance = ensureAuth();

  try {
    await firebaseAuth.sendPasswordResetEmail(authInstance, email);
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}
