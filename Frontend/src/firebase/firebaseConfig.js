import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAC_-vTsvbB41IrjZ8rt5J7sNAYr8bDigw",
    authDomain: "alumni-d9345.firebaseapp.com",
    projectId: "alumni-d9345",
    storageBucket: "alumni-d9345.firebasestorage.app",
    messagingSenderId: "877246727349",
    appId: "1:877246727349:web:dc0992c6c7d8b972f42afc",
    measurementId: "G-0DV4Q4B6HX",
};

// Initialize Firebase (ONLY ONCE)
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);