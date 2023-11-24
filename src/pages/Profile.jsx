import { doc, getDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import { usersRef } from '../config/firebase';

function Profile() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [uDisplayName, setDisplayName] = useState("");
    const [uAvatar, setAvatar] = useState();

    const userID = searchParams.get('id');

    const fetchUserData = async () => {
        if (userID !== "none") {
            try {
                const userDoc = await getDoc(doc(usersRef, userID));
                setDisplayName(userDoc.data().displayName);
                setAvatar(userDoc.data().avatarUrl);
            } catch (err) {
                console.error(err)
            }
        }
    };

    fetchUserData()

    return (
        <div>
            <h1>{uDisplayName}</h1>
            <img src={uAvatar}></img>
        </div>
    )
}

export default Profile
