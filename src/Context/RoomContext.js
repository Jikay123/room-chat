import { createContext, useState } from "react";

export const RoomContext = createContext();

const RoomProvider = (props) => {
    const [selectRoomId, setSelectRoomId] = useState('');

    return (
        <RoomContext.Provider value={{ selectRoomId, setSelectRoomId }}>
            {props.children}
        </RoomContext.Provider>
    );
}
export default RoomProvider;