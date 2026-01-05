import { initializeApp } from 'firebase/app';
import { initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB__PX2kyoVNPy8FTzpF1uXGBNGDT2hpFo",
  authDomain: "pab-moneytrack-todo.firebaseapp.com",
  projectId: "pab-moneytrack-todo",
  storageBucket: "pab-moneytrack-todo.firebasestorage.app",
  messagingSenderId: "998077025656",
  appId: "1:998077025656:web:ff6325cba3d06ae4844c8d",
};

const app = initializeApp(firebaseConfig);

// ✅ TANPA AsyncStorage
const auth = initializeAuth(app);

const db = getFirestore(app);

export { app, auth, db };
