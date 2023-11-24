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
  apiKey: "AIzaSyB7WBoT6iQxDn5xFoUPve7wxPOPnUUmwIo",
  authDomain: "buchkagram.firebaseapp.com",
  projectId: "buchkagram",
  storageBucket: "buchkagram.appspot.com",
  messagingSenderId: "809853145217",
  appId: "1:809853145217:web:76c685f9c21889b2c1fd80",
  measurementId: "G-M2ZMDXGT5M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export const usersRef = collection(db, "users");
