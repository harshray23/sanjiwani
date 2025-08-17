
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleSignIn = async () => {
      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn');
        if (!email) {
          // User opened the link on a different device. To prevent session fixation
          // attacks, ask the user to provide the email again. For simplicity,
          // we'll show an error, but a real app would prompt for it.
          setError("Your sign-in email was not found. Please try signing in again from the original device.");
          setStatus('error');
          return;
        }

        try {
          const result = await signInWithEmailLink(auth, email, window.location.href);
          // Clear email from storage.
          window.localStorage.removeItem('emailForSignIn');

          const user = result.user;
          if (user && db) {
            // Check if user document already exists
            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
              // New user, create their document in Firestore
              await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.email?.split('@')[0] || 'New User',
                createdAt: serverTimestamp(),
                photoURL: user.photoURL || null,
              });
            }
          }
          setStatus('success');
          // Redirect to home page after a short delay
          setTimeout(() => router.push('/'), 2000);

        } catch (err: any) {
          console.error("Sign-in error:", err);
          setError(err.message || "An unknown error occurred during sign-in.");
          setStatus('error');
        }
      } else {
        setError("This is not a valid sign-in link.");
        setStatus('error');
      }
    };

    if (auth) {
      handleSignIn();
    }
  }, [router]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <CardTitle>Verifying Your Link</CardTitle>
            <CardDescription>Please wait while we securely sign you in...</CardDescription>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
             <div className="mx-auto bg-green-100 dark:bg-green-900/50 p-3 rounded-full w-fit mb-4">
                 <Loader2 className="h-12 w-12 text-green-600 dark:text-green-400 animate-spin" />
            </div>
            <CardTitle className="text-2xl text-green-600 dark:text-green-400">Sign-in Successful!</CardTitle>
            <CardDescription>Welcome! We're redirecting you to the homepage now.</CardDescription>
          </div>
        );
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center p-8 text-center">
             <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-4">
                <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-2xl text-destructive">Authentication Failed</CardTitle>
            <CardDescription className="max-w-sm mb-6">
              {error || "We couldn't sign you in. The link may have expired or been used already."}
            </CardDescription>
            <Button asChild>
                <Link href="/login">Return to Login</Link>
            </Button>
          </div>
        );
    }
  };

  return (
    <div className="py-12 w-full">
      <Card className="w-full max-w-lg mx-auto shadow-xl">
        <CardContent className="pt-6">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
