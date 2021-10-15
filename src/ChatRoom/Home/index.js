import { Grid } from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { auth } from '../../Firebase';
import ChatMain from '../ChatMain';
import SlideBar from '../SlideBar';
import './home.scss';


function Home() {
    const history = useHistory();
    const { user } = useContext(AuthContext)
    console.log(user, "user1")

    useEffect(() => {
        const check = auth.onAuthStateChanged((user) => {
            if (user) {
                history.push('');
            } else {
                history.push('/login')
            }
        });

        return () => {
            check();
        }
    }, [history])
    return (
        <div>
            {/* <Button onClick={handleLogout}>Logout</Button>
            <h1>{user?.displayName}</h1>
            <img src={user?.photoURL} alt="img" />
            <h3>{user.uid}</h3>
            <h3>{user.email}</h3> */}
            <Grid container >
                <Grid xs={3} item >
                    <SlideBar user={user} />
                </Grid>
                <Grid xs={9} item >
                    <ChatMain />
                </Grid>
            </Grid>
        </div>
    )
}

export default Home
