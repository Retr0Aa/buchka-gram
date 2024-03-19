// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection } from "firebase/firestore";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVff5G8AKqs4TadPjyhEzkdWxPpG_f6Rw",
  authDomain: "buchkagram-b8f57.firebaseapp.com",
  projectId: "buchkagram-b8f57",
  storageBucket: "buchkagram-b8f57.appspot.com",
  messagingSenderId: "660066770313",
  appId: "1:660066770313:web:acdbd5f2963d5744dd5558",
  measurementId: "G-06Y8PTK19M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export const usersRef = collection(db, "users");
