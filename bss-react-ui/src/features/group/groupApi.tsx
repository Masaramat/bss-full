import axios from "axios"
import { APP_URL } from "../types"
import { handleError } from "../../Helpers/ErrorHandler"
import { NavigateFunction } from "react-router-dom"

export const getGroups = (navigate: NavigateFunction) => {
    try{
        const data = axios.get(`${APP_URL}/group`)
        return data;
    }catch(error){
        handleError(error, navigate)

    }
    
}