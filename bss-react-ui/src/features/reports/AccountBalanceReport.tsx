import $ from 'jquery';
import 'datatables.net';
import {useCallback, useEffect, useRef, useState} from 'react';
import { formatCurrency } from '../types';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {Account} from "../customer/types.tsx";
import {getAccountBalanceReport} from "./reportApi.tsx";


const AccountBalanceReport = () => {
    const tableRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [accountType, setAccountType] = useState<string>();

    const navigate = useNavigate();


    const getCommissions = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await getAccountBalanceReport({accountType: accountType || null}, navigate);
            setAccounts(response?.data || []);
        } catch (error) {
            console.error('Error fetching commissions:', error);
        } finally {
            setIsLoading(false);
        }
    }, [navigate, accountType]);



    useEffect(() => {
        const table = tableRef.current;

        if (!table || !accounts.length) return;

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
                    filename: `Account Balance Report`,
                    title: `Account Balance Report`,
                },
                {
                    extend: 'print',
                    text: 'Print',
                    title: `Account Balance Report`,
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
    }, [accounts]);

    // ✅ NEW: Run query on page load
    useEffect(() => {
        getCommissions();
    }, []); // Empty dependency array means it runs once when component mounts

    console.log(accounts)


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // No validation needed - accountType can be undefined (meaning "all")
        await getCommissions();
    };

    const totalAmount = accounts.reduce((sum, account) => sum + account.balance, 0);

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
                    <div className='col-span-1 text-lg mt-1'><h3>Account Balance Report</h3></div>
                </div>
                <div className='p-3'>
                    <form className="my-2 grid gap-3 sm:grid-cols-1 lg:grid-cols-4 text-sm" onSubmit={handleSubmit}>

                        <div>
                            <label htmlFor="accountType">Account Type: </label>
                            <select className={"form-control"} onChange={(e) => setAccountType(e.target.value || undefined)}>
                                <option value="">All Account Types</option>
                                <option value="SAVINGS">Savings</option>
                                <option value="COLLATERAL_DEPOSIT">Collateral Deposit</option>
                                <option value="LOAN">Loan</option>
                                <option value="ADASHE">Adashe</option>
                            </select>
                        </div>

                        <div className="self-end col-span-2 sm:col-span-1">
                            <button className="form-control bg-blue-600 hover:bg-secondary text-white">Search</button>
                        </div>
                    </form>
                    <table className='text-sm font-palanquin' id="report" ref={tableRef}>
                        <thead className="table-header-group">
                        <tr>
                            <th className="w-5">No.</th>
                            <th>Account Name</th>
                            <th>Account Type</th>
                            <th>Account Number</th>
                            <th>Balance</th>
                            <th>Account Status</th>

                        </tr>
                        </thead>
                        <tbody>
                        {accounts && accounts.map((account: Account, index: number) => (
                            <tr key={index}>
                                <td>{account.id}</td>
                                <td>{account.customer.name}</td>
                                <td>{account.accountType}</td>
                                <td>{account.accountNumber}</td>
                                <td>{formatCurrency(account.balance)}</td>
                                <td>{String(account.accountStatus)}</td>
                            </tr>
                        ))}
                        </tbody>
                        <tfoot className='text-pretty font-bold'>
                        <tr>
                            <td colSpan={4}>Total</td>
                            <td>{formatCurrency(totalAmount)}</td>
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

export default AccountBalanceReport;