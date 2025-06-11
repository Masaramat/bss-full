import { UserProfile } from "../../Models/User";

export interface Customer{
    name: string;
    id?: number;
    phoneNumber: string;
    bvn: number;
    dateOfBirth: string;
    address: string;
    accounts?: Account[];
    customerType: CustomerType;

}



export interface Account{
    id: number;
    name: string;
    balance: number;
    accountStatus: string;
    loanCycle: number;
    accountType: string;
    accountNumber: number;
    loanId: number;
    customer: Customer;
}

export interface Transaction{
    id: string;
    amount: number;
    account: Account;
    trxNo: string;
    description: string;
    trxDate: Date;
    user: UserProfile;

}

export enum CustomerType {
    SAVINGS = "SAVINGS",
    ADASHE = "ADASHE"
}

export function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

