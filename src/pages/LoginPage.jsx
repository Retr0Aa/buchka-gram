import { useState } from "react"
import './Page.scss'
import { auth, googleProvider, usersRef } from "../config/firebase"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth"
import { Button } from "react-bootstrap";
import GoogleIcon from "../svg/google.svg"
import { doc, setDoc } from "firebase/firestore";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const signIn = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password).then(cred => {
                return setDoc(doc(usersRef, cred.user.uid), {
                    displayName: cred.user.displayName,
                    avatarUrl: cred.user.photoURL,
                    bio: "No bio provided."
                });
            });

        } catch (err) {
            console.error(err)
        }
    }
    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider).then(cred => {
                return setDoc(doc(usersRef, cred.user.uid), {
                    displayName: cred.user.displayName,
                    avatarUrl: cred.user.photoURL
                });
            });

            window.location.href = "/";
        } catch (err) {
            console.error(err)
        }
    }
    return (
        <div className="auth-form">
            <h1>Log In</h1>
            <br />
            <div className="auth-buttons">
                <input
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
                <br />
                <Button variant="light" onClick={signInWithGoogle}><img width="50px" src={GoogleIcon}></img>Continue With Google</Button>
            </div>
        </div>
    )
}

export default LoginPage
