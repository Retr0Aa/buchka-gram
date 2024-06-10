import { doc, getDoc, where } from 'firebase/firestore';
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { signOut } from 'firebase/auth'
import { auth, db } from '../config/firebase';
import { usersRef } from '../config/firebase';
import Post from '../components/Post';
import { Button } from 'react-bootstrap';
import FriendsList from '../components/FriendsList';

function Profile() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [uDisplayName, setDisplayName] = useState("");
    const [uAvatar, setAvatar] = useState();
    const [uDescription, setDescription] = useState("");
    const [uFriends, setFriends] = useState([]);

    const userID = searchParams.get('id');

    const [postsList, setPostsList] = useState([])

    const postsCollectionRef = collection(db, "posts")

  const [modalShow, setModalShow] = React.useState(false);

    const getPostsList = async () => {
        try {
            const data = await getDocs(query(postsCollectionRef, where('authorID', '==', userID)))
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }))
            setPostsList(filteredData)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getPostsList()
    }, [])

    const fetchUserData = async () => {
        if (userID !== "none") {
            try {
                const userDoc = await getDoc(doc(usersRef, userID));
                setDisplayName(userDoc.data().displayName);
                setAvatar(userDoc.data().avatarUrl);
                setDescription(userDoc.data().bio)
                setFriends(userDoc.data().friends)
            } catch (err) {
                console.error(err)
            }
        }
    };

    fetchUserData()

    return (
        <div className='profile-page'>
            <div className='main'>
                <img src={uAvatar} className='pfp'></img>
                <div className='acc-data'>
                    <div className='top-acc-controls'>
                        <h1>{uDisplayName}</h1>

                        <Button variant='primary'>Request Friend</Button>
                    </div>

                    <p>{uDescription}</p>

                    <Button style={{"margin-right": "10px"}} variant='primary' onClick={() => setModalShow(true)}>Friends: {uFriends.length}</Button>
                    <Button variant='danger' onClick={() => signOut(auth)}>Log Out</Button>
                </div>
            </div>

            <br />

            <div className='posts'>
                <h1>Posts</h1>

                {postsList.map((post) => (
                    <div key={post.id}>
                        <Post postDoc={post} />
                    </div>
                ))}
            </div>

            <FriendsList
                show={modalShow}
                onHide={() => setModalShow(false)}
                userID={userID}/>
        </div>
    )
}

export default Profile
