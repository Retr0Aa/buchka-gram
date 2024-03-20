import React, { useState, useEffect } from 'react';
import './Post.scss';
import { Alert, Button } from 'react-bootstrap';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { usersRef, db } from '../config/firebase';
import { FaHeart } from 'react-icons/fa';

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : {
              r: 0,
              g: 0,
              b: 0,
          };
}

function Post({ postDoc }) {
    const [uDisplayName, setDisplayName] = useState('');
    const [uAvatar, setAvatar] = useState('');
    const [liked, setLiked] = useState(false); // New state to track whether post is liked
    const [likesCount, setLikesCount] = useState(postDoc.likes.length); // State to track the like count

    const userID = postDoc.authorID;

    useEffect(() => {
        fetchUserData();
        checkLikedStatus();
    }, []); // Run only once after component mounts

    const fetchUserData = async () => {
        if (userID !== 'none') {
            try {
                const userDoc = await getDoc(doc(usersRef, userID));
                setDisplayName(userDoc.data().displayName);
                setAvatar(userDoc.data().avatarUrl);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const checkLikedStatus = async () => {
        // Check if the current user's ID is in the array of likes for this post
        const currentUserID = userID; // Replace with your actual current user's ID
        const isLiked = postDoc.likes.includes(currentUserID);
        setLiked(isLiked);
    };

    const alertStyle = {
        '--bs-alert-bg': '' + postDoc.postColor + '',
        '--bs-alert-border-color': 'rgb(' + (hexToRgb(postDoc.postColor).r + 30) + ', ' + (hexToRgb(postDoc.postColor).g + 30) + ', ' + hexToRgb(postDoc.postColor).b + ')',
    };

    const handleLike = async () => {
        const postRef = doc(db, 'posts', postDoc.id); // Assuming 'postsRef' is your reference to the 'posts' collection
        const currentUserID = userID; // Replace with your actual current user's ID

        let updatedLikes = [...postDoc.likes]; // Create a copy of the current likes array
        let updatedLikesCount = likesCount;

        if (liked) {
            // Unlike the post
            updatedLikes = updatedLikes.filter(userId => userId !== currentUserID);
            updatedLikesCount--;
        } else {
            // Like the post
            updatedLikes.push(currentUserID);
            updatedLikesCount++;
        }

        try {
            await updateDoc(postRef, { likes: updatedLikes }); // Update likes array in Firestore
            setLikesCount(updatedLikesCount); // Update like count in local state
            setLiked(!liked); // Toggle liked state
        } catch (error) {
            console.error('Error updating document: ', error);
        }
    };

    return (
        <div style={alertStyle} className="post fade alert alert-secondary show">
            <div className="author-info">
                <img className="pfp" width="30px" src={uAvatar}></img>
                <p>
                    <a href={'/profile?id=' + userID}>{uDisplayName}</a> - {postDoc.uploadDate.toDate().getDate()}{' '}
                    {postDoc.uploadDate.toDate().toLocaleString('default', { month: 'long' })}, {postDoc.uploadDate.toDate().getFullYear()}
                </p>
            </div>
            <div className="post-content" dangerouslySetInnerHTML={{ __html: postDoc.text }}></div>

            <hr />

            <div className="bottom-controls">
                <Button variant="secondary" onClick={handleLike}>
                    <FaHeart color={liked ? 'red' : 'black'} /> {/* Change heart color based on liked state */}
                    <p>{likesCount}</p> {/* Display updated like count */}
                </Button>
            </div>
        </div>
    );
}

export default Post;
