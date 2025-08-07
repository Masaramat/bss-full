import axios from "axios"
import { APP_URL } from "../types"
import { handleError } from "../../Helpers/ErrorHandler";
import { Customer } from "./types";
import { NavigateFunction } from "react-router-dom";

export const makeTransaction = (amount: number, accountId: number, trxType: string, description: string, userId: number, noOfDays: number, commissionAmount: number, navigate: NavigateFunction) => {
    try{
       const data =  axios.post(`${APP_URL}/transaction`, {
            amount: amount,
            accountId: accountId,
            trxType: trxType,
            description: description,
            userId: userId,
            noOfDays: noOfDays,
           commissionAmount: commissionAmount,
        })

        return data;
    }catch(error){
        handleError(error, navigate);

    }

}

export const createCustomer = (customer: Customer, navigate: NavigateFunction) => {
    try{
        const data = axios.post(`${APP_URL}/customer`, customer)
        return data;

    }catch(error){
        handleError(error, navigate);
    }

}

export const getCustomerAccounts = (customerId: number, navigate: NavigateFunction) => {
    try{
        const data = axios.get(`${APP_URL}/admin/account/customer/${customerId}`);
        return data;

    }catch(error){
        handleError(error, navigate);
    }
}

export const getCustomer = (id: string, navigate: NavigateFunction) => {
    try{
        const data = axios.get(`${APP_URL}/customer/${id}`);
        return data;

    }catch(error){
        handleError(error, navigate);
    }

}

export const editCustomer = (customer: Customer, navigate: NavigateFunction) => {
    try{
        const data = axios.put(`${APP_URL}/customer`, customer);
        return data;

    }catch(error){
        handleError(error, navigate);
    }
    
}