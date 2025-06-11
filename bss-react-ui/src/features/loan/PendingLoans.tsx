import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import $ from 'jquery';
import 'datatables.net';
import { LoanApplication } from './types';
import { APP_URL } from '../types';
import { handleError } from '../../Helpers/ErrorHandler';
import { CircularProgress } from '@mui/material';

const PendingLoans = () => {
    const [loans, setLoans] = useState<LoanApplication[]>();
    const [] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
      setIsLoading(true);
        const fetchData = async () => {
          try {
            let response = await axios.get(`${APP_URL}/loan-application/pending`);
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

      isLoading ? content = 
      <>
     
      <>
      <div className='flex items-center justify-center'>
      <CircularProgress />
      </div>
      
      
      </>
    
      
      </> : 

      content = (
        <div className='m-5 rounded-lg border h-fit border-primary'>
          <div className='grid grid-cols-2 bg-secondary p-3 text-white'>
            <div className='col-span-1 text-lg mt-1'><h3>Pending Loan Applications</h3></div>
            <div className='flex justify-end items-end col-span-1'>
              {/* <Link to='/user/new' className='bg-blue-500 hover:bg-primary p-2 rounded-lg font-sans'>
                <PersonAdd className='pr-1'/>Add New User
              </Link> */}
            </div>
          </div>
          <div className='p-3'>
            <table className='table-auto' id="users-table">
              <thead className='table-header-group'>
                <tr>
                  <th className='w-2'>ID</th>
                  <th>Amount</th>
                  <th>Customer</th>
                  <th>Loan Product</th>
                  <th>Status</th>
                  <th>Tenor</th>
                  
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {loans && loans?.map((loan: LoanApplication, index: number) => (
                  <tr key={loan.id} className="table-row">
                    <td className='w-2'>{index + 1}</td>
                    <td>{loan.amount}</td>
                    <td>{loan.customer.name}</td>
                    <td>{loan.loanProduct.name}</td>
                    <td>{loan.status}</td>
                    <td>{loan.tenor}</td>
                    <td>
                      <Link to={`/loan/${loan.id}`} className="text-[12px] bg-primary-blue hover:bg-primary text-white font-bold p-1 px-3 rounded-l-lg">open</Link>
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

  return content
}

export default PendingLoans