import axios from "axios";
import { handleError } from "../../Helpers/ErrorHandler";
import { RepaymentReportRequest, ReportRequest, TransactionReportRequest } from "./types";
import { APP_URL } from "../types";
import { NavigateFunction } from "react-router-dom";
export const getLoanReport = (request: ReportRequest, navigate: NavigateFunction) => {
    try{
        const data = axios.post(
            `${APP_URL}/report/loans`, request
        )
        return data;

    }catch(error){
        handleError(error, navigate)
    }

}

export const getRepaymentsReport = (request: RepaymentReportRequest, navigate: NavigateFunction) => {
    try{

        const data = axios.post(
            `${APP_URL}/report/repayment`, request
        )
        return data;

    }catch(error){
        handleError(error, navigate)
    }
}

export const getTransactionReport = (transactionReportRequest: TransactionReportRequest, navigate: NavigateFunction) => {
    try{
        const data = axios.post(
            `${APP_URL}/report/transaction`, transactionReportRequest
        )
        return data;

    }catch(error){
        handleError(error, navigate)
    }
}