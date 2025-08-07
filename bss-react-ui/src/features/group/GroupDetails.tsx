import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import $ from 'jquery';
import 'datatables.net';
import { Group } from './types';
import { APP_URL, capitalizeFirstLetter, formatCurrency, formatDate } from '../types';
import { LoanApplication } from '../loan/types';
import { handleError } from '../../Helpers/ErrorHandler';
import { CircularProgress } from '@mui/material';

const GroupDetails = () => {
    const [group, setGroup] = useState<Group>();
    const [errorMsg] = useState("");
    const { id: groupId } = useParams<{ id: string }>();
    const location = useLocation();
    const { message } = location.state || {};
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const fetchData = async () => {
            try {
                const response = await axios.get(`${APP_URL}/group/${groupId}`);
                setGroup(response?.data);
                setIsLoading(false);
            } catch (error:unknown) {
                handleError(error, navigate);
            }
        };

        fetchData();
    }, [groupId]);

    useEffect(() => {
        if (group) {
            $(() => {
                if (!$.fn.dataTable.isDataTable('#users-table')) {
                    $('#users-table').DataTable({
                        autoWidth: false,
                    });
                }
            });
        }
    }, [group]);

    let content = <div></div>

    if(isLoading){
        content = (
            <>
            <div className='flex items-center justify-center'>
            <CircularProgress />
            </div>
            
            
            </>
          )

    }else{
        content = (
            <div className='m-5 rounded-lg border h-fit border-primary'>
                <div className='grid grid-cols-2 bg-secondary p-3 text-white'>
                    <div className='col-span-1 text-lg mt-1'><h3>Group ({group?.name})</h3></div>
                    <div className='flex justify-end items-end col-span-1'>
                        {/* <Link to={`/customer/new/${group?.id}`} className='bg-blue-500 hover:bg-primary p-2 rounded-lg font-sans'>
                            <PersonAdd className='pr-1' />Add New Member
                        </Link> */}
                    </div>
                </div>
                <div className='p-3'>
                    {errorMsg && <p className='text-success text-center font-bold'>{errorMsg}</p>}
                    {message && <p className='text-success text-center font-bold'>{message}</p>}
                    {group && (
                        <div className="p-5 font-bold">
                            <p className="p-2"><span className="text-lg font-bold text-primary">Name:</span> {group.name}</p>
                        </div>
                    )}
                    <div className=''>
                        <h3>Members</h3>
                        <table className='table-auto w-full' id="users-table">
                            <thead className='table-header-group'>
                                <tr>
                                    <th className='w-2'>ID</th>
                                    <th>Member Name</th>
                                    <th>Amount</th>
                                    <th>Balance</th>
                                    <th>Disbursement Date</th>
                                    <th>Maturity</th>
                                    <th>Status</th>
                                    <th>Option</th>
                                </tr>
                            </thead>
                            <tbody>
                                {group?.members && group.members.map((loan: LoanApplication, index: number) => {
                                    const loanAccount = loan?.customer?.accounts?.find(account => account.loanId === loan.id);
                                    return (
                                        <tr key={loan.id} className="table-row">
                                            <td className='w-2'>{index + 1}</td>
                                            <td>{String(loan?.customer?.name)}</td>
                                            <td>{formatCurrency(loan.amount)}</td>
                                            <td>{loanAccount?.balance ? formatCurrency(loanAccount?.balance) : 0.00}</td>
                                            <td>{loan.disbursedAt ? formatDate(String(loan.disbursedAt)) : "N/A"}</td>
                                            <td>{loan.maturity ? formatDate(String(loan.maturity)) : "N/A"}</td>
                                            <td>{capitalizeFirstLetter(String(loan?.status))}</td>
                                            <td>
                                                <Link to={`/customer/${loan.id}`} className="text-[12px] bg-primary-blue hover:bg-primary text-white font-bold p-1 px-3 rounded-lg">open</Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );

    }

    

    return content;
}

export default GroupDetails;
