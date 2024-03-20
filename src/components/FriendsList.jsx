import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { auth, googleProvider, usersRef } from "../config/firebase";
import {
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    getUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, exists } from "firebase/firestore";
import { useSearchParams } from 'react-router-dom';
import FriendCard from './FriendCard';

function FriendsList(props) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [uFriends, setFriends] = useState([]);

    const userID = searchParams.get('id');

    const fetchUserData = async () => {
        if (userID !== "none") {
            try {
                const userDoc = await getDoc(doc(usersRef, userID));
                setFriends(userDoc.data().friends)
            } catch (err) {
                console.error(err)
            }
        }
    };

    fetchUserData()

    return (
        <div>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Friends</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        {uFriends.map((friend) => (
                            <div key={friend}>
                                <FriendCard id={friend} />
                            </div>
                        ))}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal></div>
    )
}

export default FriendsList