import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseAuth, getFirestoreInstance } from '../services/firebase';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const { setUser, setRole, setLoading } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const db = getFirestoreInstance();

    if (!auth) {
      console.warn('Firebase auth is not initialized. Authentication features are disabled.');
      setLoading(false);
      setIsReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        if (db) {
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              setRole((data as any).role ?? null);
            } else {
              setRole(null);
            }
          } catch (error) {
            console.error('Error fetching user role:', error);
            setRole(null);
          }
        } else {
          console.warn('Firestore db is not initialized; cannot load user role.');
          setRole(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
      setIsReady(true);
    });

    return () => unsubscribe();
  }, [setLoading, setUser, setRole]);

  return { isReady };
}