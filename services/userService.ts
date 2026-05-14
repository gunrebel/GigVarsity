import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

export interface PortfolioItem {
  title: string;
  description: string;
  fileUrl: string;
  type: string;
}

export interface StudentProfile {
  uid: string;
  name: string;
  email: string;
  role: 'student';
  createdAt: any;
  profileComplete: boolean;
  university: string;
  course: string;
  yearOfStudy: string;
  skills: string[];
  bio: string;
  availability: string;
  portfolioItems: PortfolioItem[];
  rating: number;
  totalRatings: number;
  totalEarned: number;
  isVerified: boolean;
  profileImageUrl: string;
  followers?: string[];
  following?: string[];
}

export interface CompanyProfile {
  uid: string;
  name: string;
  email: string;
  role: 'company';
  createdAt: any;
  profileComplete: boolean;
  companyName: string;
  industry: string;
  description: string;
  website: string;
  logoUrl: string;
  followers?: string[];
  following?: string[];
  isVerified: boolean;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'student' | 'company' | null;
  createdAt: any;
  profileComplete: boolean;
  [key: string]: any;
}

export interface ReviewData {
  jobId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
}

function ensureDb() {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized');
  }
  return db;
}

function ensureStorage() {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized');
  }
  return storage;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const dbInstance = ensureDb();
  const userDoc = await getDoc(doc(dbInstance, 'users', uid));
  if (!userDoc.exists()) {
    return null;
  }
  return { ...(userDoc.data() as UserProfile), uid: userDoc.id };
}

export async function updateStudentProfile(uid: string, data: Partial<StudentProfile>): Promise<void> {
  const dbInstance = ensureDb();
  await updateDoc(doc(dbInstance, 'users', uid), data as any);
}

export async function updateCompanyProfile(uid: string, data: Partial<CompanyProfile>): Promise<void> {
  const dbInstance = ensureDb();
  await updateDoc(doc(dbInstance, 'users', uid), data as any);
}

export async function uploadProfileImage(uid: string, imageUri: string): Promise<string> {
  const storageInstance = ensureStorage();
  const response = await fetch(imageUri);
  const blob = await response.blob();
  const storageRef = ref(storageInstance, `profiles/${uid}/avatar`);
  await uploadBytes(storageRef, blob);
  const downloadUrl = await getDownloadURL(storageRef);
  const dbInstance = ensureDb();
  await updateDoc(doc(dbInstance, 'users', uid), {
    profileImageUrl: downloadUrl,
  });
  return downloadUrl;
}

export async function addPortfolioItem(uid: string, item: PortfolioItem): Promise<void> {
  const dbInstance = ensureDb();
  await updateDoc(doc(dbInstance, 'users', uid), {
    portfolioItems: arrayUnion(item),
  });
}

export async function getAllStudents(): Promise<StudentProfile[]> {
  const dbInstance = ensureDb();
  const studentsQuery = query(collection(dbInstance, 'users'), where('role', '==', 'student'));
  const snapshot = await getDocs(studentsQuery);
  return snapshot.docs.map((docSnap) => ({ ...(docSnap.data() as StudentProfile), uid: docSnap.id }));
}

export async function submitReview(reviewData: ReviewData): Promise<void> {
  const dbInstance = ensureDb();
  const reviewsRef = collection(dbInstance, 'reviews');
  await addDoc(reviewsRef, {
    ...reviewData,
    reviewId: '',
    createdAt: serverTimestamp(),
  });

  const studentRef = doc(dbInstance, 'users', reviewData.revieweeId);

  await runTransaction(dbInstance, async (transaction) => {
    const studentDoc = await transaction.get(studentRef);
    if (!studentDoc.exists()) {
      throw new Error('Student profile not found');
    }
    const studentData = studentDoc.data() as any;
    const currentRating = studentData.rating || 0;
    const totalRatings = studentData.totalRatings || 0;
    const newRating = (currentRating * totalRatings + reviewData.rating) / (totalRatings + 1);

    transaction.update(studentRef, {
      rating: newRating,
      totalRatings: totalRatings + 1,
    });
  });
}
