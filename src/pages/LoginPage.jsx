import { useState, useEffect } from "react";
import "./Page.scss";
import { auth, googleProvider, usersRef } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  getUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, exists } from "firebase/firestore";
import { Button } from "react-bootstrap";
import GoogleIcon from "../svg/google.svg";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in.
        checkIfUserExists(user);
      } else {
        // No user is signed in.
      }
    });

    return () => unsubscribe();
  }, []);

  const checkIfUserExists = async (user) => {
    const userDoc = await getDoc(doc(usersRef, user.uid));
    if (userDoc.exists()) {
      console.log("User already exists in the database");
      // Redirect or perform any action here if user already exists
    } else {
      console.log("Creating a new user document");
      // Create a new user document
      try {
        await setDoc(doc(usersRef, user.uid), {
          displayName: user.displayName,
          avatarUrl: user.photoURL,
          bio: "No bio provided.",
          friends: []
        });
      } catch (err) {
        console.error("Error creating new user document:", err);
      }
    }
  };

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      checkIfUserExists(user);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="auth-form">
      <h1>Log In</h1>
      <br />
      <div className="auth-buttons">
        {/* <input
          placeholder="Email"
          type='email'
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          placeholder="Password"
          type='password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <Button onClick={signIn}>Sign In</Button>
        <br /> */}
        <Button variant="light" onClick={signInWithGoogle}>
          <img width="50px" src={GoogleIcon} alt="Google Icon" />
          Continue With Google
        </Button>
      </div>
    </div>
  );
}

export default LoginPage;
