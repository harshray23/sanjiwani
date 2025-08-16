
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
// This will appear in server logs during build or runtime, or browser console if this module is client-side.
if (typeof window !== 'undefined') {
  console.log("Firebase.ts (Client-side): NEXT_PUBLIC_FIREBASE_API_KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Loaded" : "MISSING or UNDEFINED");
} else {
  console.log("Firebase.ts (Server-side/Build): NEXT_PUBLIC_FIREBASE_API_KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Loaded" : "MISSING or UNDEFINED");
}


// Initialize Firebase
let app;
if (!getApps().length) {
  // Check that the config is not empty before initializing
  if (!firebaseConfig.apiKey) {
      console.error("Firebase config is missing API Key. Firebase will not be initialized.");
  } else {
     app = initializeApp(firebaseConfig);
  }
} else {
  app = getApp();
}

// Ensure app is initialized before getting auth and db
const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;

// Export nulls if not initialized so the app doesn't crash, though functionality will be broken.
export { app, db, auth };
