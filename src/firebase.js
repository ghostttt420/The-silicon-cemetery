// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your specific High Council configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8H5GdXStzyFWGwzv1zs4ze3NXcKDeLNI",
  authDomain: "high-council-b9d1d.firebaseapp.com",
  projectId: "high-council-b9d1d",
  storageBucket: "high-council-b9d1d.firebasestorage.app",
  messagingSenderId: "838722988765",
  appId: "1:838722988765:web:d1678735992f333abd0934"
};

// Initialize the app
const app = initializeApp(firebaseConfig);

// Export the database connection so App.jsx can use it
export const db = getFirestore(app);
