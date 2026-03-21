
'use client';

import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { useAuth, useFirestore } from '../provider';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import type { User } from '@/lib/types';

export function useUser() {
  const auth = useAuth();
  const db = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for legacy mock user first
    const storedMockUser = localStorage.getItem('mockUser');
    if (storedMockUser) {
      setUser(JSON.parse(storedMockUser));
      setLoading(false);
    }

    // 2. Listen for real Firebase Auth changes
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      
      if (fUser) {
        // Clear mock user if real user logs in
        localStorage.removeItem('mockUser');
        
        const userDocRef = doc(db, 'users', fUser.uid);
        
        // Listen for profile changes in real-time
        const unsubDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUser(docSnap.data() as User);
          } else {
            // Initial profile creation if it doesn't exist
            const newUser: User = {
              uid: fUser.uid,
              name: fUser.displayName || 'Anonymous',
              email: fUser.email || '',
              phone: fUser.phoneNumber || '',
              role: 'patient',
              verified: false,
              sanjeevaniPoints: 0,
              createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 }
            };
            setDoc(userDocRef, newUser);
            setUser(newUser);
          }
          setLoading(false);
        });
        
        return () => unsubDoc();
      } else if (!storedMockUser) {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = async () => {
    localStorage.removeItem('mockUser');
    window.dispatchEvent(new Event('authChange'));
    return signOut(auth);
  };

  return { user, firebaseUser, loading, loginWithGoogle, logout };
}
