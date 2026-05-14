import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  writeBatch,
  orderBy,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from './firebase';

export interface MilestoneData {
  title: string;
  description: string;
  amount: number;
  status: 'pending' | 'in-progress' | 'submitted' | 'approved' | 'paid';
  dueDate: string;
}

export interface ApplicationData {
  jobId: string;
  jobTitle: string;
  companyId: string;
  companyName: string;
  studentId: string;
  studentName: string;
  studentUniversity: string;
  studentSkills: string[];
  coverLetter: string;
}

export interface Application {
  applicationId: string;
  jobId: string;
  jobTitle: string;
  companyId: string;
  companyName: string;
  studentId: string;
  studentName: string;
  studentUniversity: string;
  studentSkills: string[];
  coverLetter: string;
  status: 'applied' | 'reviewing' | 'hired' | 'completed' | 'rejected';
  createdAt: any;
  updatedAt: any;
  milestones: MilestoneData[];
}

function ensureDb() {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized');
  }
  return db;
}

export async function submitApplication(data: ApplicationData): Promise<string> {
  const dbInstance = ensureDb();
  const appRef = await addDoc(collection(dbInstance, 'applications'), {
    ...data,
    applicationId: '',
    status: 'applied',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    milestones: [],
  });
  await updateDoc(appRef, { applicationId: appRef.id });

  const jobRef = doc(dbInstance, 'jobs', data.jobId);
  await updateDoc(jobRef, { applicantCount: increment(1) });

  return appRef.id;
}

export async function getStudentApplications(studentId: string): Promise<Application[]> {
  const dbInstance = ensureDb();
  const applicationsQuery = query(
    collection(dbInstance, 'applications'),
    where('studentId', '==', studentId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(applicationsQuery);
  return snapshot.docs.map((docSnap) => ({
    ...(docSnap.data() as Application),
    applicationId: docSnap.id,
  }));
}

export async function getJobApplications(jobId: string): Promise<Application[]> {
  const dbInstance = ensureDb();
  const applicationsQuery = query(
    collection(dbInstance, 'applications'),
    where('jobId', '==', jobId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(applicationsQuery);
  return snapshot.docs.map((docSnap) => ({
    ...(docSnap.data() as Application),
    applicationId: docSnap.id,
  }));
}

export async function updateApplicationStatus(applicationId: string, status: string): Promise<void> {
  const dbInstance = ensureDb();
  await updateDoc(doc(dbInstance, 'applications', applicationId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function hireStudent(applicationId: string, milestones: MilestoneData[]): Promise<void> {
  const dbInstance = ensureDb();
  const applicationRef = doc(dbInstance, 'applications', applicationId);
  const applicationDoc = await getDoc(applicationRef);

  if (!applicationDoc.exists()) {
    throw new Error('Application not found');
  }

  const applicationData = applicationDoc.data() as Application;
  await updateDoc(applicationRef, {
    status: 'hired',
    updatedAt: serverTimestamp(),
    milestones,
  });

  const milestonesCollection = collection(applicationRef, 'milestones');
  const batch = writeBatch(dbInstance);

  milestones.forEach((milestone) => {
    const milestoneRef = doc(milestonesCollection);
    batch.set(milestoneRef, {
      ...milestone,
      milestoneId: milestoneRef.id,
      createdAt: serverTimestamp(),
    });
  });

  await batch.commit();

  await updateDoc(doc(dbInstance, 'jobs', applicationData.jobId), {
    status: 'in-progress',
  });
}
