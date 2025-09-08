// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

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

if (!isFirebaseConfigValid) {
  console.error("Firebase config is missing or incomplete. Check your environment variables.");
}

// Initialize Firebase
// This guard prevents re-initialization on hot reloads
const app = !getApps().length && isFirebaseConfigValid ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const auth = getAuth(app);


// Connect to emulators in development.
// Note: You must start the emulators locally for this to work.
if (process.env.NODE_ENV === 'development' && !auth.emulatorConfig) {
  try {
    // connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
    // console.log("Firebase Auth emulator connected.");
  } catch (e) {
    // console.error("Error connecting to Firebase Auth emulator:", e);
  }
}

export { app, db, auth };
