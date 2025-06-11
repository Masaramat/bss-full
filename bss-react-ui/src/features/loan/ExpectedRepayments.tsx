import axios from 'axios'
import { useEffect, useState } from 'react'
import $ from 'jquery';
import 'datatables.net';
import { Repayment } from './types';
import { APP_URL, formatCurrency, formatDate } from '../types';
import { Payment } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { handleError } from '../../Helpers/ErrorHandler';
import { useNavigate } from 'react-router-dom';

const ExpectedRepayments = () => {
    const [repayments, setRepayments] = useState<Repayment[]>();
    const [message, setMessage] = useState("");
    const [isPaying, setIsPaying] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
      setIsLoading(true);
        const fetchData = async () => {
          try {
            let response = await axios.get(`${APP_URL}/loan-application/expected`);
            setRepayments(response?.data)
            setIsLoading(false);
          } catch (error) {
            setMessage("Error fetching data: ");
          }
        };
    
        fetchData();
      }, []);

      useEffect(() => {
        if (repayments) {
          $(function ($){
            if (!$.fn.dataTable.isDataTable('#repayments-table')) {
              $('#repayments-table').DataTable({      
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
      }, [repayments]);

      const repayLoans = async () => {
        setIsPaying(true);
        axios.put(
            `${APP_URL}/loan-application/repay`
        ).then(response => {
            if(response?.status === 200){
                setIsPaying(false);                
                toast.success("Repayment successfull");  
                window.location.reload();
                
            }
        }).catch(error => {
            handleError(error, navigate);
        })
      }

      let content = <div></div>

      isLoading ? content = 
      
      <>
      <div className='flex items-center justify-center'>
      <CircularProgress />
      </div>
      
      
      </>
    :

      content = (
        <div className='m-5 rounded-lg border h-fit border-primary'>
          <div className='grid grid-cols-2 bg-secondary p-3 text-white'>
            <div className='col-span-1 text-lg mt-1'><h3>Loans</h3></div>
            <div className='flex justify-end items-end col-span-1'>
              <button onClick={repayLoans}  className='bg-blue-500 hover:bg-primary p-2 rounded-lg font-sans'>
                <Payment className='pr-1'/>{isPaying ? (<CircularProgress />) : "Repay Loans"}
              </button>
            </div>
          </div>
          <div className='p-3'>
            {message && <p className='text-success text-center font-bold'>{message}</p>}
            <table className='table-auto' id="repayments-table">
                <thead className='table-header-group'>
                    <tr>
                        <th className='w-2'>ID</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Days Overdue</th>
                        <th>Maturity</th>
                    </tr>
                </thead>
                <tbody>
                    {repayments && repayments.map((repayment: Repayment, index) => (
                        <tr key={repayment.id} className="table-row">
                            <td className='w-2'>{index + 1}</td>
                            <td>{formatCurrency(repayment.total)}</td>
                            <td>{repayment?.status === "DEFAULT" ? "due" : "pending"}</td>
                            <td>{repayment?.daysOverdue ? repayment?.daysOverdue : 0}</td>
                            <td>{formatDate(String(repayment.maturityDate))}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
        </div>
      )

  return content
}

export default ExpectedRepayments