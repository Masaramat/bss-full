import axios from "axios";
import { handleError } from "../../../Helpers/ErrorHandler"
import { APP_URL } from "../../types";
import { NavigateFunction } from "react-router-dom";


export const getLoanProducts = (navigate: NavigateFunction) => {
    try{
        const data = axios.get(`${APP_URL}/admin/loan-product`)

        return data;

    }catch(error){
        handleError(error, navigate);
    }
}

export const newLoanProduct = (
    name: string, interestRate: number,
    monitoringFeeRate: number,
    processingFeeRate: number,
    tenor: number,
    navigate: NavigateFunction) =>{
        try{
            const data = axios.post(`${APP_URL}/admin/loan-product`, {
                name: name,
                monitoringFeeRate: monitoringFeeRate,
                processingFeeRate: processingFeeRate,
                interestRate: interestRate,
                tenor: tenor
            })
            return data;

        }catch(error){
            handleError(error, navigate);
        }

}


export const getLoanProduct = (id: number, navigate: NavigateFunction) => {
    try{
        const data = axios.get(`${APP_URL}/admin/loan-product/${id}`)
        return data;

    }catch(error){
        handleError(error, navigate);
    }
}

export const editLoanProduct = (
    id: number, 
    name: string, interestRate: number,
    monitoringFeeRate: number,
    processingFeeRate: number,
    tenor: number, navigate: NavigateFunction) =>{
        try{
            const data = axios.put(`${APP_URL}/admin/loan-product/update`, {
                id: id,
                name: name,
                monitoringFeeRate: monitoringFeeRate,
                processingFeeRate: processingFeeRate,
                interestRate: interestRate,
                tenor: tenor
            })
            return data;

        }catch(error){
            handleError(error, navigate);
        }
    }