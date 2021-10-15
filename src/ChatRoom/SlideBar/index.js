import { Avatar, Button, Collapse, IconButton, Modal, TextField } from '@material-ui/core';
import { Add, Close, ExpandMore, KeyboardArrowRight } from '@material-ui/icons';
import React, { useContext, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import db, { auth } from '../../Firebase';
import useData from '../../Hooks/useData';
import './slidebar.scss';
import firebase from 'firebase';
import { RoomContext } from '../../Context/RoomContext';

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}
function SlideBar({ user }) {
    const [ModalStyle] = useState(getModalStyle);
    const history = useHistory();
    const [open, setOpen] = useState(true);
    const [openModal, setOpenModal] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState('');
    const { setSelectRoomId } = useContext(RoomContext);

    const handleLogout = () => {
        const check = window.confirm("Bạn muốn đăng xuất?", "Thông báo");
        if (check) {
            auth.signOut();
            history.push("/login")
        }
    }
    const RoomsCondition = useMemo(() => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            compareValue: user.uid,
        }
    }, [user.uid])


    const rooms = useData('rooms', RoomsCondition);


    const handleCloseModal = () => {
        setOpenModal(false);
        setName('');
        setDescription('');
    }
    const handleAddRoom = () => {
        if (name) {
            db.collection('rooms').add({
                name: name,
                description: description,
                members: [user.uid],
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
            setName('');
            setDescription('');
            setOpenModal(false);
        }

    }
    const handleChangeRoomId = (id) => {
        console.log(id)
        setSelectRoomId(id)

    }
    return (
        <div className="slidebar">
            <div className="slidebar__top">
                <div className="info">
                    <Avatar src={user.photoURL}>{user.photoURL ? '' : user.displayName?.chartAt(0)?.toUpperCase()} </Avatar>
                    <p className="text">{user.displayName}</p>

                </div>
                <Button className="button" variant="contained" onClick={handleLogout}>Đăng xuất</Button>

            </div>
            <div className="slide__group">
                <Button onClick={() => setOpen(!open)} className="toggle" >  {open ? <ExpandMore /> : <KeyboardArrowRight />}Danh sách phòng</Button>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <div className="collap">
                        {rooms.map(({ id, data }) => (
                            <Button onClick={() => handleChangeRoomId(id)} key={id} className="item">
                                <p>{data.name}</p>
                            </Button>

                        ))}
                        <Button onClick={() => setOpenModal(true)} className="item__add">
                            <Add />
                            <p>Thêm phòng</p>
                        </Button>
                    </div>
                </Collapse>
            </div>

            <Modal
                open={openModal}
                onClose={handleCloseModal}
            >
                <div className="formAdd" style={ModalStyle}>
                    <div className="title">
                        <h3>Tạo phòng</h3>
                        <IconButton onClick={handleCloseModal}><Close /></IconButton>
                    </div>
                    <form className="formAdd__room"  >
                        <TextField value={name} onChange={(e) => setName(e.target.value)} label="Tên phòng" variant="outlined" />

                        <TextField value={description} onChange={(e) => setDescription(e.target.value)} label="Mô tả" variant="outlined" multiline rows={5} type="textare" />
                        <div className="formAdd__button">
                            <Button onClick={handleAddRoom} variant="contained" color="primary">OK</Button>
                            <Button onClick={handleCloseModal} variant="contained" >Cancel</Button>
                        </div>
                    </form>
                </div>
            </Modal>

        </div>
    )
}

export default SlideBar
