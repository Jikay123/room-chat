import { Button, Tooltip } from '@material-ui/core';
import { PersonAddOutlined } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { Avatar, Form, Modal, Select, Spin } from 'antd';
import { formatRelative } from 'date-fns/esm';
import firebase from 'firebase';
import { debounce } from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { RoomContext } from '../../Context/RoomContext';
import db from '../../Firebase';
import useData from '../../Hooks/useData';
import './chatmain.scss';

const DebounceSelect = ({ fetchOptions, debounceTimeout = 300, curentMembers, ...props }) => {

    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

    const debounceFetcher = React.useMemo(() => {
        const loadOptions = (value) => {
            setOptions([]);
            setFetching(true);

            fetchOptions(value, curentMembers).then(newOptions => {
                setOptions(newOptions);
                setFetching(false);
            })
        }
        return debounce(loadOptions, debounceTimeout);

    }, [debounceTimeout, fetchOptions, curentMembers])

    return (
        <Select
            mode="multiple"
            labelInValue
            filterOption={false}
            placeholder="Please select"
            notFoundContent={fetching ? <Spin size="small" /> : null}
            onSearch={debounceFetcher}
            style={{ width: '100%', zIndex: '10' }}
            {...props}
        >
            {
                options.map(opt => (
                    <Select.Option key={opt.value} value={opt.value} title={opt.label} style={{ zIndex: "100" }}>
                        <Avatar size="small" src={opt.photoURL}>
                            {opt.photoURL ? '' : opt.lable?.charAt(0).toUpperCase()}
                        </Avatar>
                        {`${opt.label}`}
                        <p>123</p>
                    </Select.Option>
                ))
            }

        </Select>
    )
}

const fetchUserList = async (search, curentMembers) => {
    return db.collection("users").where('keywords', 'array-contains', search)
        .orderBy('displayName')
        .limit(20)
        .get()
        .then((snapshot) => {
            return snapshot.docs.map((doc) => ({
                label: doc.data().displayName,
                value: doc.data().uid,
                photoURL: doc.data().photoURL,
            })).filter(opt => !curentMembers.includes(opt.value))
        })
}

function ChatMain() {
    const { user } = useContext(AuthContext);
    const { selectRoomId } = useContext(RoomContext);
    const [infoRoom, setInfoRoom] = useState({});
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    const [value, setValue] = useState([])
    const [form] = Form.useForm();
    const [openInvite, setOpenInvite] = useState(false);

    useEffect(() => {
        if (!selectRoomId) {
            return;
        }
        db.collection("rooms").doc(selectRoomId).onSnapshot((snap) => {
            setInfoRoom({
                ...snap.data()
            })
        })
    }, [selectRoomId])
    const handleAddMessage = (e) => {
        e.preventDefault();
        db.collection('rooms').doc(selectRoomId).collection('messages').add({
            displayName: user.displayName,
            photoURL: user.photoURL,
            roomId: selectRoomId,
            text: message,
            uid: user.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setMessage('');
    }

    const handleCloseInvite = () => {
        setOpenInvite(false);
    }

    const UserCondition = React.useMemo(() => {
        return {
            fieldName: 'uid',
            operator: 'in',
            compareValue: infoRoom.members,
        };
    }, [infoRoom.members])

    const userRoom = useData("users", UserCondition);

    const handleAddMember = () => {
        const RoomRef = db.collection("rooms").doc(selectRoomId);

        RoomRef.update({

            members: [...infoRoom.members, ...value.map(item => item.value)]
        })
        console.log({ ...value }, "12")
        setOpenInvite(false)
    }

    const handleOnChangeValue = (newValue) => {
        console.log({ value }, "123")
        console.log({ newValue }, "new")
        setValue(newValue)
    }

    useEffect(() => {
        try {
            const uncribe = db.collection('rooms').doc(selectRoomId)?.collection('messages')?.orderBy('timestamp', 'desc')
                .onSnapshot((snap) => {
                    setMessageList([...snap.docs.map((item) => ({ id: item.id, data: item.data() }))])
                })
            return () => { uncribe() }
        } catch (error) {
            console.error(error.message)
        }
    }, [selectRoomId])


    const formatDate = (seconds) => {
        let formatedDate = "";

        if (seconds) {
            formatedDate = formatRelative(new Date(seconds * 1000), new Date());
            formatedDate = formatedDate.charAt(0).toUpperCase() + formatedDate.slice(1);
        }

        return formatedDate;
    }
    return (
        <>
            {selectRoomId ?
                <div className="room">
                    <div className="room__top" >
                        <div className="info">
                            <h3>{infoRoom.name}</h3>
                            <p>{infoRoom.description}</p>
                        </div>
                        <div className="button">
                            <Button onClick={() => setOpenInvite(true)}>
                                <PersonAddOutlined /> Mời
                            </Button>
                            <Avatar.Group maxCount={2}>
                                {userRoom.map(({ id, data }) => (
                                    <Tooltip key={id} title={data.displayName} >
                                        <Avatar src={data?.photoURL}>{data?.photoURL ? "" : data.displayName?.charAt(0).toUpperCase()}</Avatar>
                                    </Tooltip>
                                ))}
                            </Avatar.Group>
                        </div>

                    </div>
                    <Modal title="Mời thêm các thành viên"
                        visible={openInvite} onCancel={handleCloseInvite}
                        onOk={handleAddMember}
                        destroyOnClose={true}>

                        <Form form={form} layout='vertical'>
                            <DebounceSelect
                                mode="multiple"
                                lable="Tên các thành viên"
                                value={value}
                                onChange={handleOnChangeValue}
                                fetchOptions={fetchUserList}
                                placeholder="Nhập tên thành viên"
                                curentMembers={infoRoom.members}
                                style={{ width: "100%", zIndex: "100" }}
                            />
                        </Form>
                    </Modal>
                    <div className="content">
                        {messageList.map(({ id, data }) => (
                            <div className="item" key={id}>
                                <div className="info">
                                    <Avatar src={data?.photoURL}>{data?.photoURL ? "" : data.displayName?.charAt(0).toUpperCase()}</Avatar>
                                    <h4>{data.displayName}</h4>
                                    <p>{formatDate(data.timestamp?.seconds)}</p>
                                </div>
                                <div className="message">{data.text}</div>
                            </div>
                        ))}


                    </div>
                    <form onSubmit={handleAddMessage} className="input">
                        <input value={message} onChange={(e) => setMessage(e.target.value)} className="input__text" color="primary" fullWidth variant="outlined" placeholder="Nhập tin nhắn..." />
                        <Button type="submit" className="input__submit" variant="contained">Gửi</Button>
                    </form>
                    <ul className="box-area">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                </div>

                : <Alert >Hãy chọn phòng!</Alert>}

        </>
    )
}

export default ChatMain
