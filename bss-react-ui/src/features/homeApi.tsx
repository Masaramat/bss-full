import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler"
import { APP_URL } from "./types";
import { NavigateFunction } from "react-router-dom";
import { ChangePasswordRequest } from "./admin/user/types";

export const getPaidMonthlyRepayments = (navigate: NavigateFunction) => {
    try{
        const data = axios.get(`${APP_URL}/repayment/paid`)
        return data;
    }catch(error){
        handleError(error, navigate);
    }
}

export const getAllMonthlyRepayments = (navigate: NavigateFunction) => {
    try{
        const data = axios.get(`${APP_URL}/repayment/all`)
        return data;
    }catch(error){
        handleError(error, navigate);
    }
}

export const getMonthlyYearFees = (navigate: NavigateFunction) => {
    try{
        const data = axios.get(`${APP_URL}/report/fees`)
        return data;
    }catch(error){
        handleError(error, navigate);
    }

}

export const getMonthlyYearInterest = (navigate: NavigateFunction) => {
    try{
        const data = axios.get(`${APP_URL}/report/interest`)
        return data;
    }catch(error){
        handleError(error, navigate);
    }

}

export const getMonthlyYearCommission = (navigate: NavigateFunction) => {
    try{
        const data = axios.get(`${APP_URL}/report/commission`)
        return data;
    }catch(error){
        handleError(error, navigate);
    }

}

export const getTopCircleCustomers = (count: number, navigate: NavigateFunction) => {
    try{
        const data = axios.get(`${APP_URL}/loan-application/top/${count}`)
        return data;
    }catch(error){
        handleError(error, navigate);
    }

}

export const getRecentLoanApplications = (count: number, navigate: NavigateFunction) => {
    try{
        const data = axios.get(`${APP_URL}/loan-application/recent/${count}`)
        return data;
    }catch(error){
        handleError(error, navigate);
    }

}

export const changePassword = (request: ChangePasswordRequest, navigate: NavigateFunction) => {
    try{
        const data = axios.put(`${APP_URL}/user/password/change`, request)
        return data;
    }catch(error){
        handleError(error, navigate);
    }

}


export const sendSms = async (message: string, recipient: string) => {
    try {
        const response = await axios.post(`${APP_URL}/transaction/send-sms`, null, {
            params: { message, recipient },
        });
        console.log('SMS sent successfully:', response.data);
    } catch (error: any) {
        console.error('Error sending SMS:', error.response ? error.response.data : error.message);
    }
};

