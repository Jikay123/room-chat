import { CircularProgress } from "@material-ui/core";
import { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { auth } from "../Firebase";

export const AuthContext = createContext();

const AuthProvider = (props) => {
    const [user, setUser] = useState('');
    const [isLoading, setLoading] = useState(true);
    const history = useHistory();


    useEffect(() => {
        const checkUser = auth.onAuthStateChanged((user) => {
            if (user) {
                const { displayName, photoURL, email, uid } = user;
                setUser({
                    displayName, photoURL, email, uid
                })
                setLoading(false)
                history?.push("/");
            } else {
                setLoading(false)
                history?.push("/login");
            }

        })
        return () => {
            checkUser();
        }
    }, [history])


    return (
        <AuthContext.Provider value={{ user }}>
            {isLoading ? <CircularProgress /> : props.children}
        </AuthContext.Provider>
    );
}
export default AuthProvider;