import { useState, useEffect } from 'react'
import './Page.scss'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import Post from '../components/Post';

function Home() {
    const [postsList, setPostsList] = useState([])

    const postsCollectionRef = collection(db, "posts")

    const getPostsList = async () => {
        try {
            const data = await getDocs(postsCollectionRef)
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

    return (
        <div>
            {postsList.map((post) => (
                <div key={post.id}>

                    <Post postDoc={post} />
                </div>
            ))}
        </div>
    )
}

export default Home
