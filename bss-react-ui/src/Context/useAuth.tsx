import React, { createContext, useEffect, useState } from "react";
import { UserProfile } from "../Models/User";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../Services/AuthService";
import { toast } from "react-toastify";
import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";

type UserContextType = {
    user: UserProfile | null;
    token: string | null;
    loginUser: (username: string, password: string) => void;
    logout: () => void;
    isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            axios.defaults.headers.common["Authorization"] = "Bearer " + storedToken;
        }
        setIsReady(true);
    }, []);

    const loginUser = async (username: string, password: string) => {
        try {
            const res = await loginApi(username, password, navigate);
            if (res) {
                const newToken = res.data.token;
                localStorage.setItem("token", newToken);
                axios.defaults.headers.common["Authorization"] = "Bearer " + newToken;

                const userObj: UserProfile = {
                    username: res.data.userDto.username,
                    email: res.data.userDto.email,
                    role: res.data.userDto.role,
                    name: res.data.userDto.name,
                    id: res.data.userDto.id
                };
                localStorage.setItem("user", JSON.stringify(userObj));

                setToken(newToken);
                setUser(userObj);
                navigate("/dashboard");
                toast.success("User Logged in successfully");
            }
        } catch (e) {
            handleError(e, navigate);
        }
    };

    const isLoggedIn = () => {
        return !!user;
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
        delete axios.defaults.headers.common["Authorization"];
        toast.success("Logout successful!");
        navigate("/login");
    };

    return (
        <UserContext.Provider value={{ loginUser, logout, isLoggedIn, user, token }}>
            {isReady ? children : null}
        </UserContext.Provider>
    );
};

export const useAuth = () => React.useContext(UserContext);
