import { useState, useEffect } from 'react';
import './Page.scss';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, usersRef, db } from '../config/firebase';
import { Editor } from '@tinymce/tinymce-react';
import { Button } from 'react-bootstrap';

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

function Create() {
    const [uDisplayName, setDisplayName] = useState('');
    const [uAvatar, setAvatar] = useState('');
    const [userID, setUserID] = useState('error');
    const [newPostText, setNewPostText] = useState('');
    const [newPostColor, setNewPostColor] = useState('#a8a8a8');
    const [isDarkBackground, setIsDarkBackground] = useState(false); // State to track if background is dark

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                const uID = user.uid;
                setUserID(uID);
                fetchUserData(uID);
            } else {
                setUserID('none');
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchUserData = async (uid) => {
        try {
            const userDoc = await getDoc(doc(usersRef, uid));
            setDisplayName(userDoc.data().displayName);
            setAvatar(userDoc.data().avatarUrl);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        // Calculate the luminance of the background color
        const luminanceThreshold = 128;
        const luminance = (0.2126 * hexToRgb(newPostColor).r) + (0.7152 * hexToRgb(newPostColor).g) + (0.0722 * hexToRgb(newPostColor).b);
        setIsDarkBackground(luminance < luminanceThreshold);
    }, [newPostColor]);

    const handleNewPostTextChange = (content, editor) => {
        setNewPostText(content);
    };

    const handlePostColorChange = (event) => {
        setNewPostColor(event.target.value);
    };

    const alertStyle = {
        "--bs-alert-bg": "" + newPostColor + "",
        "--bs-alert-border-color": "rgb(" + (isDarkBackground ? hexToRgb(newPostColor).r + 30 : hexToRgb(newPostColor).r - 30) + ", " + (isDarkBackground ? hexToRgb(newPostColor).g + 30 : hexToRgb(newPostColor).g - 30) + ", " + (isDarkBackground ? hexToRgb(newPostColor).b + 30 : hexToRgb(newPostColor).b - 30) + ")"
    }

    async function publishPost() {
        const docRef = await addDoc(collection(db, "posts"), {
            authorID: userID,
            likes: 0,
            postColor: newPostColor,
            text: newPostText,
            type: "text"
        });

        window.location.href = "/";
    }

    return (
        <div>
            <div className='create-infos'>
                <label>Text</label>

                <div>
                    <Editor
                        apiKey='xbzriukvyq44ft11embdp8e17biwtn7bgv6dc09ehlr1fde1'
                        initialValue="<p>Hello World!</p>"
                        init={{
                            height: 500,
                            menubar: false,
                            plugins: [
                                'advlist autolink lists link image charmap print preview anchor',
                                'searchreplace visualblocks code fullscreen',
                                'insertdatetime media table paste code help wordcount',
                                'textcolor',
                                'colorpicker'
                            ],
                            toolbar:
                                'undo redo | formatselect | bold italic backcolor | \
                              alignleft aligncenter alignright alignjustify | \
                              bullist numlist outdent indent | removeformat | \
                              forecolor | blocks fontfamily fontsize' // Correctly include fontsizeselect
                        }}
                        onEditorChange={handleNewPostTextChange}
                    />
                </div>
                <label>Post Color</label>
                <input type='color' onChange={handlePostColorChange}></input>
            </div>

            <br />

            <h2>Preview Post</h2>
            <div className='post fade alert alert-secondary show' style={alertStyle}>
                <div className='author-info'>
                    <img className='pfp' width='30px' src={uAvatar} alt='User Avatar' />
                    <p>{uDisplayName}</p>
                </div>

                <div className='post-content' dangerouslySetInnerHTML={{ __html: newPostText }}></div>
            </div>

            <Button variant='success' size='lg' onClick={publishPost}>Publish</Button>
        </div>
    );
}

export default Create;
