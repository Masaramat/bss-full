import { LoanApplication } from "../loan/types";

export interface Group{
    id: number;
    name: string;
    numberOfMembers: number;
    members: LoanApplication[];
}