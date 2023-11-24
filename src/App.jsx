import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import { usersRef, auth } from './config/firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from "firebase/auth";
import LoginPage from './pages/LoginPage';
import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Create from './pages/Create';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userID, setUserID] = useState("error");
    const [displayName, setDisplayName] = useState("");

    const fetchUserData = async () => {
        if (userID !== "none") {
            try {
                const userDoc = await getDoc(doc(usersRef, userID));
                setDisplayName(userDoc.data().displayName);
            } catch (err) {
                console.error(err)
            }
        }
    };

    onAuthStateChanged(auth, (user) => {
        if (user) {
            const uID = user.uid;

            setUserID(uID);
            setIsLoggedIn(true);

            fetchUserData();
        } else {
            setUserID("none");
            setIsLoggedIn(false);
        }
    });

    return (
        <div className="App">
            <Navbar className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="/">BuchkaGram</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Home</Nav.Link>

                            {isLoggedIn ? (
                                <Nav.Link href="/create">+</Nav.Link>
                            ) : null}
                        </Nav>
                        <Navbar.Text>
                            {isLoggedIn ? (
                                <p>Signed in as: <a href={"/profile?id=" + userID}>{displayName}</a></p>
                            ) : (
                                <>
                                    <a href="/auth"><Button variant='primary'>Sign In</Button></a>
                                </>
                            )}
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <BrowserRouter>
                <div className='page'>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/auth' element={<LoginPage />} />
                        <Route path='/profile' element={<Profile />} />
                        <Route path='/create' element={<Create />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
