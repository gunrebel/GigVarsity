import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  orderBy,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';

export interface Job {
  jobId: string;
  title: string;
  description: string;
  skills: string[];
  budget: number;
  deadline: string;
  jobType: 'gig' | 'internship';
  workMode: 'remote' | 'onsite' | 'hybrid';
  companyId: string;
  companyName: string;
  companyLogoUrl: string;
  status: 'open' | 'closed' | 'in-progress';
  applicantCount: number;
  createdAt: any;
  location?: string;
}

export interface JobFilters {
  jobType?: string;
  workMode?: string;
  skills?: string[];
  maxBudget?: number;
}

export interface JobData {
  title: string;
  description: string;
  skills: string[];
  budget: number;
  deadline: string;
  jobType: 'gig' | 'internship';
  workMode: 'remote' | 'onsite' | 'hybrid';
  companyId: string;
  companyName: string;
  location?: string;
}

function ensureDb() {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized');
  }
  return db;
}

export async function createJob(jobData: JobData): Promise<string> {
  const dbInstance = ensureDb();
  const jobRef = await addDoc(collection(dbInstance, 'jobs'), {
    ...jobData,
    jobId: '',
    companyLogoUrl: '',
    applicantCount: 0,
    status: 'open',
    createdAt: serverTimestamp(),
  });
  await updateDoc(jobRef, { jobId: jobRef.id });
  return jobRef.id;
}

export async function getJobs(filters: JobFilters = {}): Promise<Job[]> {
  const dbInstance = ensureDb();
  const constraints: QueryConstraint[] = [where('status', '==', 'open')];

  if (filters.jobType) {
    constraints.push(where('jobType', '==', filters.jobType));
  }
  if (filters.workMode) {
    constraints.push(where('workMode', '==', filters.workMode));
  }
  if (filters.skills?.length) {
    constraints.push(where('skills', 'array-contains-any', filters.skills));
  }
  if (typeof filters.maxBudget === 'number') {
    constraints.push(where('budget', '<=', filters.maxBudget));
  }

  constraints.push(orderBy('createdAt', 'desc'), limit(20));

  const jobsQuery = query(collection(dbInstance, 'jobs'), ...constraints);
  const snapshot = await getDocs(jobsQuery);

  return snapshot.docs.map((docSnap) => ({
    ...(docSnap.data() as Job),
    jobId: docSnap.id,
  }));
}

export async function getJobById(jobId: string): Promise<Job | null> {
  const dbInstance = ensureDb();
  const docSnap = await getDoc(doc(dbInstance, 'jobs', jobId));
  if (!docSnap.exists()) {
    return null;
  }
  return {
    ...(docSnap.data() as Job),
    jobId: docSnap.id,
  };
}

export async function getCompanyJobs(companyId: string): Promise<Job[]> {
  const dbInstance = ensureDb();
  const jobsQuery = query(
    collection(dbInstance, 'jobs'),
    where('companyId', '==', companyId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(jobsQuery);
  return snapshot.docs.map((docSnap) => ({
    ...(docSnap.data() as Job),
    jobId: docSnap.id,
  }));
}

export async function updateJobStatus(jobId: string, status: string): Promise<void> {
  const dbInstance = ensureDb();
  await updateDoc(doc(dbInstance, 'jobs', jobId), { status });
}

export async function deleteJob(jobId: string): Promise<void> {
  const dbInstance = ensureDb();
  await deleteDoc(doc(dbInstance, 'jobs', jobId));
}
