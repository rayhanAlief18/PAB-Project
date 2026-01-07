// Firebase Configuration

import { getApps, initializeApp } from 'firebase/app';
import { CACHE_SIZE_UNLIMITED, Firestore, getFirestore, initializeFirestore } from 'firebase/firestore';

// Disable Firebase warnings/errors in console
if (__DEV__) {
    const originalWarn = console.warn;
    const originalError = console.error;

    console.warn = (...args) => {
        if (
            typeof args[0] === 'string' &&
            (args[0].includes('@firebase') ||
                args[0].includes('Firestore') ||
                args[0].includes('Could not reach'))
        ) {
            return; // Suppress Firebase warnings
        }
        originalWarn(...args);
    };

    console.error = (...args) => {
        if (
            typeof args[0] === 'string' &&
            (args[0].includes('@firebase') ||
                args[0].includes('Firestore') ||
                args[0].includes('Could not reach'))
        ) {
            return; // Suppress Firebase errors
        }
        originalError(...args);
    };
}

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyB__PX2kyoVNPy8FTzpF1uXGBNGDT2hpFo",
    authDomain: "pab-moneytrack-todo.firebaseapp.com",
    projectId: "pab-moneytrack-todo",
    storageBucket: "pab-moneytrack-todo.firebasestorage.app",
    messagingSenderId: "998077025656",
    appId: "1:998077025656:web:ff6325cba3d06ae4844c8d",
    measurementId: "G-9Q0D6P8FW5"
};

// Initialize Firebase (only if not already initialized)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore with optimized settings
let db: Firestore;
try {
    db = initializeFirestore(app, {
        cacheSizeBytes: CACHE_SIZE_UNLIMITED,
    });
} catch (error: any) {
    if (error.code === 'failed-precondition') {
        db = getFirestore(app);
    } else {
        throw error;
    }
}

export { db };
export default app;
