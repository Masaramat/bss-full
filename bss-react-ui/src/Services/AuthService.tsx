import axios from "axios"
import { handleError } from "../Helpers/ErrorHandler"
import { UserProfileToken } from "../Models/User"
import { NavigateFunction } from "react-router-dom"
import { APP_URL } from "../features/types";


export const loginApi = async (username: string, password: string, navigate: NavigateFunction) => {
    try {
        const data = await axios.post<UserProfileToken>(APP_URL + "/auth/login", {
            username: username,
            password: password
        })

        return data;
        
    } catch (error) {
        handleError(error, navigate)
        
    }
}