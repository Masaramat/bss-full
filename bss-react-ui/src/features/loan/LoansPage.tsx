import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import $ from 'jquery';
import 'datatables.net';
import { LoanApplication } from './types';
import { APP_URL } from '../types';
import { handleError } from '../../Helpers/ErrorHandler';
import { CircularProgress } from '@mui/material';

import { capitalizeFirstLetter, formatDate } from "../../features/types";

const LoansPage = () => {
    const [loans, setLoans] = useState<LoanApplication[]>();
    const [message] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          try {
            let response = await axios.get(`${APP_URL}/loan-application`);
            setLoans(response?.data)
            setIsLoading(false);
          } catch (error) {
            handleError(error, navigate);
          }
        };
    
        fetchData();
      }, []);

      useEffect(() => {
        if (loans) {
          $(function ($){
            if (!$.fn.dataTable.isDataTable('#users-table')) {
              $('#users-table').DataTable({      
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
                  info: 'Showing _START_ to _END_ of _TOTAL_ entries', // Customize info text
                  lengthMenu: 'Show _MENU_ Entries per page' // Customize "entries per page" text
                },
              });
            }
          });
    
        }
      }, [loans]);

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
              <div className='col-span-1 text-lg mt-1'><h3>Loans</h3></div>
              <div className='flex justify-end items-end col-span-1'>
                {/* <Link to='/group/new' className='bg-blue-500 hover:bg-primary p-2 rounded-lg font-sans'>
                  <GroupAdd className='pr-1'/>Add New Group
                </Link> */}
              </div>
            </div>
            <div className='p-3'>
              {message && <p className='text-success text-center font-bold'>{message}</p>}
              <table className='table-auto' id="users-table">
                <thead className='table-header-group'>
                  <tr>
                    <th className='w-2'>ID</th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Application Dates</th>
                    <th>Disbursement Date</th>
                    <th>Option</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {loans && loans?.map((loan: LoanApplication, index: number) => (
                    <tr key={loan.id} className="table-row">
                      <td className='w-2'>{index + 1}</td>
                      <td>{loan.customer.name}</td>
                      <td>{loan.amount}</td>
                      <td>{capitalizeFirstLetter(loan.status)}</td>
                      <td>{formatDate(loan.appliedAt)}</td>
                      <td>{formatDate(loan.disbursedAt)}</td>                    
                      <td>
                        <Link to={`/loan/${loan.id}`} className="text-[12px] bg-primary-blue hover:bg-primary text-white font-bold p-1 px-3 rounded-lg">open</Link>
                        {/* {user.isEnabled ? (
                          <button 
                            className="text-xs bg-red-600 p-1 px-2 rounded-r-lg hover:bg-primary text-white" 
                            onClick={() => handleDisableUser(Number(user.id))}
                          >
                            disable
                          </button>
                        ) : (
                          <button 
                            className="text-xs bg-green-600 p-1 px-2 rounded-r-lg hover:bg-primary text-white" 
                            onClick={() => handleEnableUser(Number(user.id))}
                          >
                            enable
                          </button>
                        )} */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )

      }

      

  return content
}

export default LoansPage