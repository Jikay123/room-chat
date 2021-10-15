import { Button, makeStyles, Modal, TextField } from '@material-ui/core';
import firebase from 'firebase';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import db, { auth, storage } from '../Firebase';
import { generateKeywords } from '../Firebase/Service';
import './login.scss';

const providerGmail = new firebase.auth.GoogleAuthProvider();
function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}
const useStyles = makeStyles((theme) => ({
    paper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: 'absolute',

        justifyContent: "center",
        width: 680,
        backgroundColor: theme.palette.background.paper,
        boxShadow: "0px 6px 20px rgba(0,52,255,0.2)",
        borderRadius: 5,
        padding: theme.spacing(2, 4, 3),

    },
    Register: {
        width: "80%",
        background: "rgb(39, 211, 54)",

        '&:hover': {
            background: "rgb(16, 223, 16)",
        }
    },
    inputValue: {
        margin: "10px",
    },
    logo: {
        width: "100px",
    }
}));


function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [image, setImage] = useState('');
    const [progress, setProgress] = useState(0);

    const [open, setOpen] = useState(false);
    const history = useHistory();
    const [modalStyle] = useState(getModalStyle);
    const classes = useStyles();

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

    const handleLoginWithGmail = async () => {
        const data = await auth.signInWithPopup(providerGmail);
        console.log({ data })
        const { additionalUserInfo, user } = data;
        if (additionalUserInfo.isNewUser) {
            db.collection('users').add({
                displayName: user.displayName,
                providerId: additionalUserInfo.providerId,
                photoURL: user.photoURL,
                email: user.email,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                uid: user.uid,
                keywords: generateKeywords(user.displayName)
            })
        }
        if (data) {
            history.push('/');
        }
    }

    const handleLoginWithFB = () => {
        const providerFB = new firebase.auth.FacebookAuthProvider();
        firebase.auth().signInWithPopup(providerFB)
            .then(() => ((
                alert("login success!"),
                history.push('/')
            )))
            .catch(() => alert("Login fail"))
    }
    const handleLogin = (e) => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
            .then((
                // alert("login success!"),
                history.push("/")
            ))
            .catch((e) => (alert(e.message)))
    }


    const handleRegister = () => {
        if (userName && image) {
            const uploadTask = storage.ref(`images/${image.name}`).put(image);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const tmp = Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 1000;
                    setProgress(tmp);
                },
                (error) => {
                    console.log(error.message);
                },
                () => {
                    storage.ref("images")
                        .child(image.name)
                        .getDownloadURL()
                        .then((url) => {
                            auth.createUserWithEmailAndPassword(email, password)
                                .then((authUser) => {
                                    return (

                                        db.collection('users').add({
                                            displayName: userName,
                                            photoURL: url,
                                            email: email,
                                            providerId: "email/password",
                                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                                            uid: authUser.user.uid,
                                            keywords: generateKeywords(userName)
                                        }),
                                        authUser.user.updateProfile({
                                            photoURL: url,
                                            displayName: userName,
                                        }),
                                        setPassword(''),
                                        setEmail(''),
                                        setImage(''),
                                        setUserName(''),
                                        setProgress(0),
                                        setOpen(false),
                                        alert("Đăng ký tài khoản thành công!")

                                    );
                                }
                                )
                                .catch((e) => alert(e.message))
                        },

                        )
                },
            );
        }
    }
    const handleChangeImg = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }
    const handleClose = () => {
        setPassword('')
        setEmail('')
        setImage('')
        setUserName('')
        setProgress(0)
        setOpen(false)
    }

    return (
        <div className="login">
            <div className="top">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Google_Chat_logo_%282017-2020%29.svg/1200px-Google_Chat_logo_%282017-2020%29.svg.png"
                    alt="logo" className="logo" />
                <h1>Login</h1>
            </div>

            <form className="form" onSubmit={handleLogin} >
                <TextField value={email} onChange={(e) => setEmail(e.target.value)} variant="outlined" placeholder="VD: Jikay123@gmail.com" />
                <TextField type="password" value={password} onChange={(e) => setPassword(e.target.value)} variant="outlined" placeholder="number123" />
                <Button className="login" type="submit" variant="contained">Login</Button>
            </form>
            <div className="button__control">
                <Button className="register" onClick={() => setOpen(true)} variant="contained">Register</Button>
                <Button className="loginGM" onClick={handleLoginWithGmail} variant="contained">Login with Gmail</Button>
                <Button className="loginFB" onClick={handleLoginWithFB} variant="contained">Login with FaceBook</Button>
            </div>
            <Modal open={open} onClose={handleClose}>
                <div style={modalStyle} className={classes.paper}>
                    <img className={classes.logo} src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Google_Chat_logo_%282017-2020%29.svg/1200px-Google_Chat_logo_%282017-2020%29.svg.png" alt="logo" />
                    <TextField fullWidth className={classes.inputValue} type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="user name" variant="outlined" />
                    <TextField fullWidth className={classes.inputValue} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" variant="outlined" />
                    <TextField fullWidth className={classes.inputValue} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" variant="outlined" />
                    <label style={{ width: "100%", margin: "0px", }}>Ảnh đại diện :</label>
                    <input onChange={handleChangeImg} type="file" style={{ width: "100%", margin: "10px" }} />
                    <progress style={{ width: "100%", margin: "5px auto" }} value={progress} max={100} />
                    <Button onClick={handleRegister} className={classes.Register} variant="contained" >Đăng ký</Button>

                </div>
            </Modal>

            <ul className="box-area">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>

        </div>
    )
}

export default Login
