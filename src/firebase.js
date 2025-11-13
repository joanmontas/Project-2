import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB6OrvZS_9sXqaNc7CBCxWkKVEh1yjgtdw",
    authDomain: "project-2-1ffdc.firebaseapp.com",
    databaseURL: "https://project-2-1ffdc-default-rtdb.firebaseio.com",
    projectId: "project-2-1ffdc",
    storageBucket: "project-2-1ffdc.firebasestorage.app",
    messagingSenderId: "175352414713",
    appId: "1:175352414713:web:617157956ebfcdd7817d28",
    measurementId: "G-YXWTQFVQPX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };