import $ from 'jquery';
import 'datatables.net';
import { useEffect, useRef, useState } from 'react';
import { RepaymentReportRequest } from './types';

import { endOfDay, format, startOfDay, subMonths } from 'date-fns';
import { capitalizeFirstLetter, formatCurrency, formatDate } from '../types';
import { CircularProgress } from '@mui/material';
import { getRepaymentsReport } from './reportApi';
import { Repayment } from '../loan/types';
import ReactDatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';

const RepaymentReport = () => {
    const tableRef = useRef(null);
    const [repaymentReportRequest, setRepaymentReportRequest] = useState<RepaymentReportRequest>();
    const [isLoading, setIsLoading] = useState(false);
    const [repayments, setRepayments] = useState<Repayment[]>([]);
    const [fromDate, setFromDate] = useState<Date>();
    const [toDate, setToDate] = useState<Date>();
    const [dateType, setDateType] = useState('');    
    const [status, setStatus] = useState('');
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
    const handleActionSelect = (e: React.ChangeEvent<HTMLSelectElement>) => setDateType(e.target.value);

    const formatLocalDateTime = (date: Date, setTimeTo: 'start' | 'end' = 'start') => {
        let adjustedDate;

        if (setTimeTo === 'start') {
            adjustedDate = startOfDay(date);
        } else {
            adjustedDate = endOfDay(date);
        }

        return format(adjustedDate, "yyyy-MM-dd'T'HH:mm:ss");
    };

    const getLoans = async (requestReport: RepaymentReportRequest) => {
        try {
            setIsLoading(true);
            const response = await getRepaymentsReport(requestReport, navigate);
            setRepayments(response?.data || []);
        } catch (error) {
            console.error('Error fetching loans:', error);
            // Handle error state or retry logic if needed
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setDateType('');
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
        } as unknown as RepaymentReportRequest;

        setRepaymentReportRequest(newRequestReport);
    }, []);

    useEffect(() => {
        if (repaymentReportRequest) {
            getLoans(repaymentReportRequest);
        }
    }, [repaymentReportRequest]);

    useEffect(() => {
        if (repayments && tableRef.current && !$.fn.dataTable.isDataTable('#report')) {
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
    }, [repayments, fromDate, toDate]);

    const totalPrincipal = repayments.reduce((sum, repayment) => sum + repayment.principal, 0);
    const totalInterestFees = repayments.reduce((sum, repayment) => sum + repayment.interest + repayment.monitoringFee + repayment.processingFee, 0);
    const totalAmount = repayments.reduce((sum, repayment) => sum + repayment.total, 0);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        // Construct new request report based on form values
        const newRequestReport = {
            dateType: dateType ? dateType : null,
            status: status || null,
            fromDate: fromDate ? formatLocalDateTime(fromDate, 'start') : '',
            toDate: toDate ? formatLocalDateTime(toDate, 'end') : '',
            // Add other properties based on status and dateType
        } as unknown as RepaymentReportRequest;
    
        setRepaymentReportRequest(newRequestReport);
        await getLoans(newRequestReport); // Await the async function
    
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
                    <div className='col-span-1 text-lg mt-1'><h3>Loan Repayment Report</h3></div>
                </div>
                <div className='p-3'>
                    <form className="my-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="">Status: </label>
                            <select value={status} className="form-control" onChange={handleStatusSelect}>
                                <option value="">All Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="PAID">Paid</option>
                                <option value="DEFAULT">Default</option>
                            </select>
                        </div>
                        <div className='col-span-2'>
                            <label htmlFor="">Date Category: </label>
                            <select value={dateType} className="form-control" onChange={handleActionSelect}>
                                <option value="">None</option>
                                <option value="maturity">Maturiy Date (All Loans)</option>
                                <option value="payment">Payment Date (Paid Loans)</option> 
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
                                <th className="w-2">SNo</th>
                                <th>Principal</th>
                                <th>Customer</th>
                                <th>Interest</th>
                                <th>Total</th>
                                <th>Days Overdue</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {repayments.map((repayment: Repayment, index: number) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{formatCurrency(repayment.total - (repayment.interest + repayment.monitoringFee + repayment.processingFee))}</td>
                                    <td>{repayment.application.customer.name}</td>
                                    <td>{formatCurrency(repayment.interest + repayment.monitoringFee + repayment.processingFee)}</td>
                                    <td>{formatCurrency(repayment.total)}</td>
                                    <td>{capitalizeFirstLetter(repayment.daysOverdue ? String(repayment.daysOverdue) + " days" : "Performing")}</td>
                                    <td>{capitalizeFirstLetter(repayment.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className='text-pretty font-bold'>
                            <tr>
                            <td>Total</td>
                            <td>{formatCurrency(totalPrincipal)}</td>
                            <td></td>
                            <td>{formatCurrency(totalInterestFees)}</td>
                            <td>{formatCurrency(totalAmount)}</td>
                            <td></td>
                            <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        );
    }

    return content;
};

export default RepaymentReport;
