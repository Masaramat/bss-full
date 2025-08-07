import $ from 'jquery';
import 'datatables.net';
import {useCallback, useEffect, useRef, useState} from 'react';
import { endOfDay, format, startOfDay, subMonths } from 'date-fns';
import { formatCurrency, formatDate } from '../types';
import { CircularProgress } from '@mui/material';
import {getAdasheCommissionReport} from './reportApi';
import ReactDatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import {Account} from "../customer/types.tsx";

export interface AdasheCommission {
    id: number;
    amount: number;
    trxId: string;
    account: Account;
    trxDate: Date;
}

const AdasheCommissionReport = () => {
    const tableRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [commissions, setCommissions] = useState<AdasheCommission[]>([]);
    const [fromDate, setFromDate] = useState<string>();
    const [toDate, setToDate] = useState<string>();

    const navigate = useNavigate();
    const handleFromDateChange = (date: Date | null) => {
        if (date) {
            setFromDate(formatLocalDateTime(date, 'start')); // 👈 Use full datetime
        }
    };

    const handleToDateChange = (date: Date | null) => {
        if (date) {
            setToDate(formatLocalDateTime(date, 'end')); // 👈 Use full datetime
        }
    };

    const formatLocalDateTime = (date: Date, setTimeTo: 'start' | 'end' = 'start') => {
        let adjustedDate;

        if (setTimeTo === 'start') {
            adjustedDate = startOfDay(date);
        } else {
            adjustedDate = endOfDay(date);
        }

        return format(adjustedDate, "yyyy-MM-dd'T'HH:mm:ssXXX"); // ✅ include timezone
    };

    const getCommissions = useCallback(async (startDate: string, endDate: string) => {
        try {
            setIsLoading(true);
            const response = await getAdasheCommissionReport(startDate, endDate, navigate);
            setCommissions(response?.data || []);
        } catch (error) {
            console.error('Error fetching commissions:', error);
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        const curDate = new Date();
        const oneMonthBack = subMonths(curDate, 1);

        const fromDate = formatLocalDateTime(oneMonthBack, 'start');
        const toDate = formatLocalDateTime(curDate, 'end');
        setFromDate(fromDate);
        setToDate(toDate);
        getCommissions(fromDate, toDate);

    }, [getCommissions]);


    useEffect(() => {
        const table = tableRef.current;

        if (!table || !commissions.length) return;

        const $table = $(table);

        // If a DataTable already exists on this table, destroy it before re-initializing
        if ($.fn.dataTable.isDataTable(table)) {
            $table.DataTable().clear().destroy();
        }

        // Initialize DataTable
        $table.DataTable({
            dom: 'Bfritp',
            buttons: [
                {
                    extend: 'csv',
                    text: 'Export CSV',
                    filename: `expenses_report_${fromDate!}_${toDate!}`,
                    title: `Expenses report from ${formatDate(fromDate!)} to ${formatDate(toDate!)}`,
                },
                {
                    extend: 'print',
                    text: 'Print',
                    title: `Expenses report from ${formatDate(fromDate!)} to ${formatDate(toDate!)}`,
                },
            ],
            language: {
                paginate: {
                    first: 'First',
                    previous: 'Previous',
                    next: 'Next',
                    last: 'Last',
                },
                info: 'Showing _START_ to _END_ of _TOTAL_ entries',
                lengthMenu: 'Show _MENU_ Entries per page',
            },
        });

        // 💡 Cleanup function: destroy DataTable when component unmounts or before next re-init
        return () => {
            if ($.fn.dataTable.isDataTable(table)) {
                $table.DataTable().destroy();
            }
        };
    }, [commissions, fromDate, toDate]);


    console.log(commissions)


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!fromDate || !toDate) {
            alert("Please select both start and end dates.");
            return;
        }
        getCommissions(fromDate, toDate);
    };

    const totalAmount = commissions.reduce((sum, commission) => sum + commission.amount, 0);

    let content: JSX.Element;

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

                        <div>
                            <label htmlFor="datepicker">Start Date: </label>
                            <ReactDatePicker
                                selected={fromDate ? new Date(fromDate) : null}
                                onChange={handleFromDateChange}
                                dateFormat="yyyy-MM-dd"
                                className="form-control"
                            />
                        </div>
                        <div>
                            <label htmlFor="datepicker">End Date: </label>
                            <ReactDatePicker
                                selected={toDate ? new Date(toDate) : null}
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
                            <th>Account Number</th>
                            <th>Transaction Date</th>

                        </tr>
                        </thead>
                        <tbody>
                        {commissions && commissions.map((commission: AdasheCommission, index: number) => (
                            <tr key={index}>
                                <td>{commission.trxId}</td>
                                <td>{formatCurrency(commission.amount)}</td>
                                <td>{commission.account.accountNumber}</td>
                                <td>{formatDate(String(commission.trxDate))}</td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot className='text-pretty font-bold'>
                        <tr>
                            <td colSpan={1}>Total</td>
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

export default AdasheCommissionReport;
