
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import type { ActionCodeSettings } from "firebase/auth";

// Your web app's Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Diagnostic log: Check if the API key is being loaded.
if (typeof window !== 'undefined') {
  console.log("Firebase.ts (Client-side): NEXT_PUBLIC_FIREBASE_API_KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Loaded" : "MISSING or UNDEFINED");
} else {
  console.log("Firebase.ts (Server-side/Build): NEXT_PUBLIC_FIREBASE_API_KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Loaded" : "MISSING or UNDEFINED");
}


// Initialize Firebase
let app;
if (!getApps().length) {
  if (!firebaseConfig.apiKey) {
      console.error("Firebase config is missing API Key. Firebase will not be initialized.");
  } else {
     app = initializeApp(firebaseConfig);
  }
} else {
  app = getApp();
}

const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;

// Action code settings for email link sign-in
export const actionCodeSettings: ActionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: typeof window !== 'undefined' ? `${window.location.origin}/finish-login` : 'http://localhost:9002/finish-login',
  // This must be true.
  handleCodeInApp: true,
};


export { app, db, auth };

    