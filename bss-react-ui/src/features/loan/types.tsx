import { UserProfile } from "../../Models/User";
import { LoanProduct } from "../admin/loan_product/types";
import { Customer } from "../customer/types";
import { Group } from "../group/types";

export interface LoanApplication{
    daysOverdue?: number;
    id?: number;
    amount: number;
    amountInWords: string;
    status?: string;
    appliedAt?: string;
    approvedAt?: string;
    disbursedAt?: string;
    maturity?: Date;
    tenor?: number;
    collateralDeposit: number;
    searchFee: number;
    formsFee: number;
    amountApproved?: number;
    amountInWordsApproved?: number;
    tenorApproved?: number;
    approvedBy?: UserProfile;
    appliedBy?: UserProfile;
    disbursedBy?: UserProfile;
    customer?: Customer;
    loanProduct?: LoanProduct;
    group?: Group;
    groupId?: number;
}

export interface Repayment{
    id: number;
    interest: number;
    monitoringFee: number;
    processingFee: number;
    total: number;
    principal: number;
    maturityDate: Date;
    paymentDate: Date;
    daysOverdue: number;
    status: string;
    totalDue: number;
    totalPaid: number;
    totalInterestPaid: number;
    application: LoanApplication;
}

export enum LoanStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    DISBURSED = "DISBURSED",
    ACTIVE = "ACTIVE",
    DEFAULT = "DEFAULT"

}

