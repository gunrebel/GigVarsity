import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseAuth, getFirestoreInstance, initializeFirebase } from './firebase';
import { useAuthStore } from '../store/authStore';
import { getFirebaseErrorMessage } from '../utils/errorHandler';

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

export async function registerUser(data: RegisterData): Promise<void> {
  const authInstance = ensureAuth();
  const dbInstance = ensureDb();

  try {
    const credential = await createUserWithEmailAndPassword(authInstance, data.email, data.password);
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
      await updateProfile(authInstance.currentUser, { displayName: data.name });
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
    const credential = await signInWithEmailAndPassword(authInstance, email, password);
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
  const authInstance = ensureAuth();
  const dbInstance = ensureDb();
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(authInstance, provider);
    const user = result.user;

    if (!user) {
      throw new Error('Google sign in failed');
    }

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
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}

export async function logoutUser(): Promise<void> {
  try {
    const authInstance = ensureAuth();
    await signOut(authInstance);
    authStore.getState().clearAuth();
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error(getFirebaseErrorMessage(error));
  }
}

export async function resetPassword(email: string): Promise<void> {
  const authInstance = ensureAuth();

  try {
    await sendPasswordResetEmail(authInstance, email);
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error));
  }
}
