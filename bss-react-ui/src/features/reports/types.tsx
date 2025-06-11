export type ReportRequest = {
    status?: string;
    action?: string;
    userId?: number;
    fromDate: Date;
    toDate: Date;
}

export type RepaymentReportRequest = {
    status: string;
    dateType: string;
    fromDate: Date;
    toDate: Date;
}

export type TransactionReportRequest = {
    trxType: string;
    trxBy: number;
    fromDate: Date;
    toDate: Date;    
}