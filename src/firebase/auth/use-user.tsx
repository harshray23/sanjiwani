'use client';

import { useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from 'firebase/auth';
import { useAuth, useFirestore } from '@/firebase/provider';
import { doc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import type { User } from '@/lib/types';

export function useUser() {
  const auth = useAuth();
  const db = useFirestore();
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check for legacy mock user first (for backwards compatibility during demo)
    const storedMockUser = localStorage.getItem('mockUser');
    if (storedMockUser) {
      setUser(JSON.parse(storedMockUser));
      // We don't return here because we want to listen for real Auth too
    }

    if (!auth || !db) {
      setLoading(false);
      return;
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
              createdAt: serverTimestamp() as any
            };
            // Note: Optimistic update
            setUser(newUser);
            setDoc(userDocRef, newUser).catch(err => console.error("Error creating profile:", err));
          }
          setLoading(false);
        });
        
        return () => unsubDoc();
      } else {
        // No firebase user
        if (!localStorage.getItem('mockUser')) {
          setUser(null);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const loginWithGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logout = async () => {
    localStorage.removeItem('mockUser');
    window.dispatchEvent(new Event('authChange'));
    if (auth) return signOut(auth);
  };

  return { user, firebaseUser, loading, loginWithGoogle, logout };
}
