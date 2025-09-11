// This file is now mostly unused due to the mock data implementation.
// It is kept for potential future re-integration with a live Firebase backend.

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

// Check if all necessary Firebase config values are present
const isFirebaseConfigValid = Object.values(firebaseConfig).every(value => !!value);

if (!isFirebaseConfigValid && process.env.NODE_ENV !== 'test') {
  console.warn("Firebase config is missing or incomplete. The app is running on mock data, so this is expected. If you intend to connect to Firebase, please check your .env file.");
}

// Initialize Firebase
// This guard prevents re-initialization on hot reloads
const app = !getApps().length && isFirebaseConfigValid ? initializeApp(firebaseConfig) : (getApps().length > 0 ? getApp() : null);

const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;


// In a real app, you might connect to emulators in development.
// if (process.env.NODE_ENV === 'development') {
//   try {
//     connectAuthEmulator(auth, "http://localhost:9099");
//     connectFirestoreEmulator(db, 'localhost', 8080);
//     console.log("Firebase emulators connected.");
//   } catch (e) {
//     console.error("Error connecting to Firebase emulators:", e);
//   }
// }

export { app, db, auth };
