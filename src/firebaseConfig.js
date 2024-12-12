// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQnfd1p4CviwxRnwRJG37s_K5uIhffrlg",
  authDomain: "project-72bc4.firebaseapp.com",
  projectId: "project-72bc4",
  storageBucket: "project-72bc4.firebasestorage.app",
  messagingSenderId: "67737736133",
  appId: "1:67737736133:web:f5b07b3024f4d159a431ac",
  measurementId: "G-LVJHS88GE5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth(app);
export default app;

