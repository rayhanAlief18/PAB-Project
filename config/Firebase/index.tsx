import { initializeApp } from "firebase/app";
import { initializeAuth, } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyB__PX2kyoVNPy8FTzpF1uXGBNGDT2hpFo",
    authDomain: "pab-moneytrack-todo.firebaseapp.com",
    projectId: "pab-moneytrack-todo",
    storageBucket: "pab-moneytrack-todo.firebasestorage.app",
    messagingSenderId: "998077025656",
    appId: "1:998077025656:web:ff6325cba3d06ae4844c8d",
    measurementId: "G-9Q0D6P8FW5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app);
const db = getFirestore(app);

export { app, auth, db };

