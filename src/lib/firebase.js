// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "gossiproom-8fa8d.firebaseapp.com",
  projectId: "gossiproom-8fa8d",
  storageBucket: "gossiproom-8fa8d.appspot.com",
  messagingSenderId: "646970509421",
  appId: "1:646970509421:web:e90f5ab9fea93155e2d764"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();