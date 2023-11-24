import { useState } from 'react'
import './Page.scss'
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, usersRef } from '../config/firebase';

function Create() {
    const [uDisplayName, setDisplayName] = useState("");
    const [uAvatar, setAvatar] = useState();
    const [userID, setUserID] = useState("error");
    
    const [newPostText, setNewPostText] = useState("");

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uID = user.uid;

            setUserID(uID);

            fetchUserData();
        } else {
            setUserID("none");
        }
    });

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
            <div className='create-infos'>
                <label>Text</label>
                <textarea onChange={(e) => newPostText = e.target.value} />
                <label>Post Color</label>
                <input type='color'></input>
            </div>

            <br />

            <h2>Preview Post</h2>
            <div className='post fade alert alert-secondary show'>
                <div className='author-info'>
                    <img className='pfp' width="30px" src={uAvatar}></img>
                    <p>{uDisplayName}</p>
                </div>
                <p>{newPostText}</p>
            </div>
        </div>
    )
}

export default Create