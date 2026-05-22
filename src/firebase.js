// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration (only once)
const firebaseConfig = {
  apiKey: "AIzaSyCpDj9y4a2w7DDfSUvum7v7Yi-IX14X9oA",
  authDomain: "donifi-72206.firebaseapp.com",
  projectId: "donifi-72206",
  storageBucket: "donifi-72206.firebasestorage.app",
  messagingSenderId: "526832824878",
  appId: "1:526832824878:web:8e85036e156d5cb61ae5bf"
};

// Initialize Firebase (only once)
const app = initializeApp(firebaseConfig);

// Export services (only once)
export const db = getFirestore(app);
export const storage = getStorage(app);
