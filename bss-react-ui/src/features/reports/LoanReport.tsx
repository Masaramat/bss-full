import $ from 'jquery';
import 'datatables.net';
import { useEffect, useRef, useState } from 'react';
import { ReportRequest } from './types';

import { endOfDay, format, startOfDay, subMonths } from 'date-fns';
import { capitalizeFirstLetter, formatCurrency, formatDate } from '../types';
import { CircularProgress } from '@mui/material';
import { getLoanReport } from './reportApi';
import { LoanApplication } from '../loan/types';
import ReactDatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../../Models/User';
import { getUsers } from '../admin/user/usersApi';

const LoanReport = () => {
    const tableRef = useRef(null);
    const [loanRequestReport, setLoanRequestReport] = useState<ReportRequest>();
    const [isLoading, setIsLoading] = useState(false);
    const [loans, setLoans] = useState<LoanApplication[]>([]);
    const [fromDate, setFromDate] = useState<Date>();
    const [toDate, setToDate] = useState<Date>();
    const [action, setAction] = useState('');
    const [actionBy, setActionBy] = useState('');
    const [status, setStatus] = useState('');
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

    const handleStatusSelect = (e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value);
    const handleActionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => setAction(e.target.value);
    const handleActionBySelect = (e: React.ChangeEvent<HTMLSelectElement>) => setActionBy(e.target.value);

    const formatLocalDateTime = (date: Date, setTimeTo: 'start' | 'end' = 'start') => {
        let adjustedDate;

        if (setTimeTo === 'start') {
            adjustedDate = startOfDay(date);
        } else {
            adjustedDate = endOfDay(date);
        }

        return format(adjustedDate, "yyyy-MM-dd'T'HH:mm:ss");
    };

    const getLoans = async (requestReport: ReportRequest) => {
        setIsLoading(true);
        const response = await getLoanReport(requestReport, navigate);
        setIsLoading(false);
        setLoans(response?.data || []);
    };

    useEffect(() => {
        setAction('');
        setActionBy('');
        setStatus('');
        let curDate = new Date();
        const oneMonthBack = subMonths(curDate, 1);
        setFromDate(oneMonthBack);
        setToDate(curDate);
        let fromDate = formatLocalDateTime(oneMonthBack, 'start');
        let toDate = formatLocalDateTime(curDate, 'end');

        const newRequestReport = {
            fromDate: fromDate,
            toDate: toDate,
        } as unknown as ReportRequest;

        setLoanRequestReport(newRequestReport);
        const getLoanUsers = async () => {
            const response = await getUsers(navigate);
            setUsers(response?.data);
        }
        getLoanUsers();
    }, []);

    useEffect(() => {
        if (loanRequestReport) {
            getLoans(loanRequestReport);
        }
    }, [loanRequestReport]);

    useEffect(() => {
        if (!$.fn.dataTable.isDataTable('#report')) {
            $('#report').DataTable({
                dom: 'Bfritp',
                buttons: [
                    {
                        extend: 'csv',
                        text: 'Export CSV',
                        filename: `expenses_report`,
                        title: `Expenses report from ${fromDate && formatDate(formatDateString(fromDate))} to ${toDate && formatDate(formatDateString(toDate))}`,
                    },
                    {
                        extend: 'print',
                        text: 'Print',
                        title: `Expenses report from ${fromDate && formatDate(formatDateString(fromDate))} to ${toDate && formatDate(formatDateString(toDate))}`,
                    }
                ],
                language: {
                    paginate: {
                        first: 'First',
                        previous: 'Previous',
                        next: 'Next',
                        last: 'Last'
                    },
                    aria: {
                        paginate: {
                            first: 'First',
                            previous: 'Previous',
                            next: 'Next',
                            last: 'Last'
                        }
                    },
                    info: 'Showing _START_ to _END_ of _TOTAL_ entries',
                    lengthMenu: 'Show _MENU_ Entries per page'
                },
            });
        }
    }, [loans, fromDate, toDate]);
    console.log(loans)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        // Construct new request report based on form values
        const newRequestReport = {
            status: status || null,
            action: action || null,
            actionBy: actionBy || null,
            fromDate: fromDate ? formatLocalDateTime(fromDate, 'start') : '',
            toDate: toDate ? formatLocalDateTime(toDate, 'end') : '',
            // Add other properties based on status and dateType
        } as unknown as ReportRequest;
    
        setLoanRequestReport(newRequestReport);
        await getLoanReport(newRequestReport, navigate); // Await the async function
    
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
                    <div className='col-span-1 text-lg mt-1'><h3>Loans Report</h3></div>
                </div>
                <div className='p-3'>
                    <form className="my-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm font-montserrat" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Status: </label>
                            <select value={status} className="form-control" onChange={handleStatusSelect}>
                                <option value="">All Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="ACTIVE">Active</option>
                                <option value="PAID_OFF">Paid off</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Action: </label>
                            <select value={action} className="form-control" onChange={handleActionSelect}>
                                <option value="">None</option>
                                <option value="applied">Applied By</option>
                                <option value="approved">Approved By</option>
                                <option value="disbursed">Disbursed By</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Action By: </label>
                            <select value={actionBy} className="form-control" onChange={handleActionBySelect}>
                                <option value="">None</option>
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
                    <table id="report" ref={tableRef}>
                        <thead className="table-header-group">
                            <tr>
                                <th className="w-2">SNo</th>
                                <th>Amount</th>
                                <th>Customer</th>
                                <th>Applied By</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.map((loan: LoanApplication, index: number) =>  (
                                
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{formatCurrency(loan.amount)}</td>
                                    <td>{loan.customer.name}</td>
                                    <td>{loan.appliedBy?.username}</td> {/* Corrected the case to match response */}
                                    <td>{capitalizeFirstLetter(loan.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return content;
};

export default LoanReport;