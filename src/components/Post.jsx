import { useState } from 'react'
import './Post.scss'
import { Alert } from 'react-bootstrap'
import { doc, getDoc } from 'firebase/firestore';
import { usersRef } from '../config/firebase';

function Post({ postDoc }) {
    const [uDisplayName, setDisplayName] = useState("");
    const [uAvatar, setAvatar] = useState();

    const userID = postDoc.authorID;

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

    const borderColor = [...postDoc.postColor]
    borderColor[0] -= 30
    borderColor[1] -= 30
    borderColor[2] -= 30

    const alertStyle = {
        "--bs-alert-bg": "rgb(" + postDoc.postColor + ")",
        "--bs-alert-border-color": "rgb(" + borderColor + ")"
    }

    return (
        <div style={alertStyle} className='post fade alert alert-secondary show'>
            <div className='author-info'>
                <img className='pfp' width="30px" src={uAvatar}></img>
                <p>{uDisplayName}</p>
            </div>
            <p>{postDoc.text}</p>
        </div>
    )
}

export default Post