import $ from 'jquery';
import 'datatables.net';
import { useEffect, useRef, useState } from 'react';
import { TransactionReportRequest } from './types';

import { endOfDay, format, startOfDay, subMonths } from 'date-fns';
import { formatCurrency, formatDate } from '../types';
import { CircularProgress } from '@mui/material';
import { getTransactionReport } from './reportApi';
import ReactDatePicker from 'react-datepicker';
import { Transaction } from '../customer/types';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../../Models/User';
import { getUsers } from '../admin/user/usersApi';

const TransactionReport = () => {
    const tableRef = useRef(null);
    const [transactionRequest, setTransactionRequest] = useState<TransactionReportRequest>();
    const [isLoading, setIsLoading] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [fromDate, setFromDate] = useState<Date>();
    const [toDate, setToDate] = useState<Date>(); 
    const [trxType, setTrxType] = useState('');
    const [trxBy, setTrxBy] = useState('');
    const [users, setUsers] = useState<UserProfile[]>([]);

    const navigate = useNavigate();

    const formatDateString = (date: Date) => {
        if (!date) return "";
        return date.toISOString().split('T')[0]; // 'yyyy-mm-dd'
    };

    const handleFromDateChange = (date: Date | null) => {
        if (date) {
            setFromDate(date);
        }
    };

    const handleToDateChange = (date: Date | null) => {
        if (date) {
            setToDate(date);
        }
    };

    const handleTransactionTypeInput = (e: React.ChangeEvent<HTMLSelectElement>) => setTrxType(e.target.value);
    const handleTransactionByInput = (e: React.ChangeEvent<HTMLSelectElement>) => setTrxBy(e.target.value);
    

    const formatLocalDateTime = (date: Date, setTimeTo: 'start' | 'end' = 'start') => {
        let adjustedDate;

        if (setTimeTo === 'start') {
            adjustedDate = startOfDay(date);
        } else {
            adjustedDate = endOfDay(date);
        }

        return format(adjustedDate, "yyyy-MM-dd'T'HH:mm:ss");
    };

    const getTransactions = async (requestReport: TransactionReportRequest) => {
        try {
            setIsLoading(true);
            const response = await getTransactionReport(requestReport, navigate);
            setTransactions(response?.data || []);
        } catch (error) {
            console.error('Error fetching loans:', error);
            // Handle error state or retry logic if needed
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setTrxType('');
        let curDate = new Date();
        const oneMonthBack = subMonths(curDate, 1);
        setFromDate(oneMonthBack);
        setToDate(curDate);
        let fromDate = formatLocalDateTime(oneMonthBack, 'start');
        let toDate = formatLocalDateTime(curDate, 'end');

        const getTransactionUsers = async () => {
            const response = await getUsers(navigate);
            setUsers(response?.data);

        }
        getTransactionUsers();

        

        const newRequestReport = {
            fromDate: fromDate,
            toDate: toDate,
        } as unknown as TransactionReportRequest;

        setTransactionRequest(newRequestReport);
    }, []);

    useEffect(() => {
        if (transactionRequest) {
            getTransactions(transactionRequest);
            console.log(transactions)
        }
    }, [transactionRequest]);

    useEffect(() => {
        if (transactions && tableRef.current && !$.fn.dataTable.isDataTable('#report')) {
            $(tableRef.current).DataTable({
                dom: 'Bfritp',
                buttons: [
                    {
                        extend: 'csv',
                        text: 'Export CSV',
                        filename: `expenses_report_${formatDateString(fromDate!)}_${formatDateString(toDate!)}`,
                        title: `Expenses report from ${formatDate(formatDateString(fromDate!))} to ${formatDate(formatDateString(toDate!))}`,
                    },
                    {
                        extend: 'print',
                        text: 'Print',
                        title: `Expenses report from ${formatDate(formatDateString(fromDate!))} to ${formatDate(formatDateString(toDate!))}`,
                    },
                ],
                language: {
                    paginate: {
                        first: 'First',
                        previous: 'Previous',
                        next: 'Next',
                        last: 'Last',
                    },
                    aria: {
                        paginate: {
                            first: 'First',
                            previous: 'Previous',
                            next: 'Next',
                            last: 'Last',
                        },
                    },
                    info: 'Showing _START_ to _END_ of _TOTAL_ entries',
                    lengthMenu: 'Show _MENU_ Entries per page',
                },
            });
        }
    }, [transactions, fromDate, toDate]);

    console.log(transactions)
    

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        // Construct new request report based on form values
        const newRequestReport = {
            trxType: trxType ? trxType : null,
            trxBy: trxBy || null,
            fromDate: fromDate ? formatLocalDateTime(fromDate, 'start') : '',
            toDate: toDate ? formatLocalDateTime(toDate, 'end') : '',
            // Add other properties based on status and dateType
        } as unknown as TransactionReportRequest;
    
        setTransactionRequest(newRequestReport);
        await getTransactions(newRequestReport); // Await the async function
    
        // Ensure setIsLoading(false) is also called in getLoans after finishing
    };

    let content = <div></div>;

    if (isLoading) {
        content = (
            <div className="w-full h-full flex justify-center items-center">
                <CircularProgress />
            </div>
        );
    } else {
        content = (
            <div className='m-5 rounded-lg border h-fit border-primary'>
                <div className='grid grid-cols-2 bg-secondary p-3 text-white'>
                    <div className='col-span-1 text-lg mt-1'><h3>Transaction Report</h3></div>
                </div>
                <div className='p-3'>
                    <form className="my-2 grid gap-3 sm:grid-cols-1 lg:grid-cols-4 text-sm" onSubmit={handleSubmit}>
                        <div className='col-span-1 '>
                            <label htmlFor="">Transaction Type: </label>
                            <select value={trxType} className="form-control" onChange={handleTransactionTypeInput}>
                                <option value="">All</option>
                                <option value="debit">Debit</option>
                                <option value="credit">Credit</option>
                            </select>
                        </div> 

                        <div>
                            <label htmlFor="">Transaction User: </label>
                            <select value={trxBy} className="form-control" onChange={handleTransactionByInput}>
                                <option value="">All</option>
                                {users && users.map((user: UserProfile) => (
                                    <>
                                        <option value={user.id}>{user.username}</option>
                                    </>
                                ))}
                                
                            </select>
                        </div>                     
                        
                        <div>
                            <label htmlFor="datepicker">Start Date: </label>
                            <ReactDatePicker
                                selected={fromDate}
                                onChange={handleFromDateChange}
                                dateFormat="yyyy-MM-dd"
                                className="form-control"
                            />
                        </div>
                        <div>
                            <label htmlFor="datepicker">End Date: </label>
                            <ReactDatePicker
                                selected={toDate}
                                onChange={handleToDateChange}
                                dateFormat="yyyy-MM-dd"
                                className="form-control"
                            />
                        </div>
                        <div className="self-end col-span-2 sm:col-span-1">
                            <button className="form-control bg-blue-600 hover:bg-secondary text-white">Search</button>
                        </div>
                    </form>
                    <table className='text-sm font-palanquin' id="report" ref={tableRef}>
                        <thead className="table-header-group">
                            <tr>
                                <th className="w-2">Trx No.</th>
                                <th>Amount</th>
                                <th>Transaction Type</th>
                                <th>Account No.</th>
                                <th>Transaction Date</th>
                                <th>Description</th>
                                <th>Trx By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction: Transaction, index: number) => (
                                <tr key={index}>
                                    <td>{transaction.trxNo}</td>
                                    <td>{formatCurrency(transaction.amount)}</td>
                                    <td>{transaction.amount < 0 ? "Debit" : "Credit"}</td>
                                    <td>{transaction.account.accountNumber && transaction.account.accountNumber}</td>
                                    <td>{formatDate(String(transaction.trxDate))}</td>
                                    <td>{transaction.description}</td>
                                    <td>{transaction.user && transaction.user.username || "System"}</td>
                                </tr>
                            ))}
                        </tbody>
                        {/* <tfoot className='text-pretty font-bold'>
                            <tr>
                            <td>Total</td>
                            <td>{formatCurrency(totalPrincipal)}</td>
                            <td></td>
                            <td>{formatCurrency(totalInterestFees)}</td>
                            <td>{formatCurrency(totalAmount)}</td>
                            <td></td>
                            <td></td>
                            </tr>
                        </tfoot> */}
                    </table>
                </div>
            </div>
        );
    }

    return content;
};

export default TransactionReport;
