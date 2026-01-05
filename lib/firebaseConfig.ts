// lib/firebaseConfig.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB__PX2kyoVNPy8FTzpF1uXGBNGDT2hpFo",
    authDomain: "pab-moneytrack-todo.firebaseapp.com",
    projectId: "pab-moneytrack-todo",
    storageBucket: "pab-moneytrack-todo.appspot.com",
    messagingSenderId: "1024325678901",
    appId: "1:1024325678901:web:a1b2c3d4e5f67890"
};

// Cek apakah app sudah diinisialisasi
let app;
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp(); // jika sudah ada, gunakan yang sudah ada
}

const db = getFirestore(app);

export { db };