import React, { useState } from 'react'
import { doc, setDoc, getDoc, exists } from "firebase/firestore";
import { auth, googleProvider, usersRef } from "../config/firebase";

function FriendCard({ id }) {
    const [uDisplayName, setDisplayName] = useState("");
    const [uAvatar, setAvatar] = useState();

    const fetchUserData = async () => {
        const userDoc = await getDoc(doc(usersRef, id));
        setDisplayName(userDoc.data().displayName);
        setAvatar(userDoc.data().avatarUrl);
    }

    fetchUserData();

    return (
        <div className='friend-card' key={id}>
            <img style={{"marginRight": "10px"}} className='pfp bordpfp' src={uAvatar}></img>
            <h3>{uDisplayName}</h3>
        </div>
    )
}

export default FriendCard
