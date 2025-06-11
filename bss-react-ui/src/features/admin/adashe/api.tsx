import axios from "axios";
import { NavigateFunction } from "react-router-dom";
import { APP_URL } from "../../types";
import { handleError } from "../../../Helpers/ErrorHandler";
import { AdasheSetupData } from "./types";

export const getAdasheSetup = (navigate: NavigateFunction) => {
    try{
        const data = axios.get(`${APP_URL}/admin/setup/adashe/setup`);
        return data;

    }catch(error){
        handleError(error, navigate);
    }
}

export const updateAdasheSetup = (setup: AdasheSetupData, navigate: NavigateFunction) => {
    try{
        const data = axios.put(`${APP_URL}/admin/setup/adashe/setup`, setup);
        return data;

    }catch(error){
        handleError(error, navigate);
    }
}
