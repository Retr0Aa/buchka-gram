import { useState } from 'react'
import './Post.scss'
import { Alert } from 'react-bootstrap'
import { doc, getDoc } from 'firebase/firestore';
import { usersRef } from '../config/firebase';

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {
        r: 0,
        g: 0,
        b: 0
    };
}

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

    const alertStyle = {
        "--bs-alert-bg": "" + postDoc.postColor + "",
        "--bs-alert-border-color": "rgb(" + (hexToRgb(postDoc.postColor).r + 30) + ", " + (hexToRgb(postDoc.postColor).g + 30) + ", " + (hexToRgb(postDoc.postColor).b) + ")"
    }

    return (
        <div style={alertStyle} className='post fade alert alert-secondary show'>
            <div className='author-info'>
                <img className='pfp' width="30px" src={uAvatar}></img>
                <p>{uDisplayName}</p>
            </div>
            <div className='post-content' dangerouslySetInnerHTML={{ __html: postDoc.text }}></div>
        </div>
    )
}

export default Post