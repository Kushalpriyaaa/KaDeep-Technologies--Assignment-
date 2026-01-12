import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

/**
 * Firebase Configuration
 * Using environment variables for security
 */
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCKkYourActualAPIKey",
    authDomain: "sahone-e0b82.firebaseapp.com",
    projectId: "sahone-e0b82",
    storageBucket: "sahone-e0b82.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;