
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAjC3ZGDsrRP_uG_nAN8tMEy1sT7OvPIt4",
  authDomain: "family-quiz-6e9d4.firebaseapp.com",
  projectId: "family-quiz-6e9d4",
  storageBucket: "family-quiz-6e9d4.firebasestorage.app",
  messagingSenderId: "840833886584",
  appId: "1:840833886584:web:7899365ab911e1aae7408d",
  measurementId: "G-58BD0ML250"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
