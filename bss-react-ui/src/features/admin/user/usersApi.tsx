import axios from "axios"
import { APP_URL } from "../../types"

import { handleError } from "../../../Helpers/ErrorHandler";
import { NavigateFunction } from "react-router-dom";
import { ChangePasswordRequest } from "./types";

export const addUser = (name: string, email: string, username: string, role: string, password: string, navigate: NavigateFunction) => {
    try{
        const data = axios.post(`${APP_URL}/admin/user`, 
            {
                name: name,
                email: email,
                username: username,
                role: role,
                password: password
    
            });
        return data;

    }catch(error){
        handleError(error, navigate);
    }

}

export const getUser = (id: string, navigate: NavigateFunction) => {
    try{
        const data = axios.get(`${APP_URL}/user/${id}`);
        return data;

    }catch(error){
        handleError(error, navigate);
    }
}

export const getUsers = (navigate: NavigateFunction) => {
    try{
        const data = axios.get(`${APP_URL}/user`);
        return data;

    }catch(error){
        handleError(error, navigate);
    }
}

export const adminChangePassword = (request: ChangePasswordRequest, navigate: NavigateFunction) => {
    try{
        const data = axios.put(`${APP_URL}/admin/user/change`, request);
        return data;

    }catch(error){
        handleError(error, navigate);
    }
}

export const editUser = (id: number, name: string, email: string, username: string, role: string, navigate: NavigateFunction) => {
    try{
        const data = axios.patch(`${APP_URL}/admin/user/${id}`, {
            id: id,
            name: name,
            username: username,
            email: email,
            role: role
        })
        return data;

    }catch(error){
        handleError(error, navigate);
    }
}