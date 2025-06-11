import axios from 'axios'
import { useEffect, useState } from 'react'
import { Customer } from './types';
import { Link, useNavigate } from 'react-router-dom';
import $ from 'jquery';
import 'datatables.net';
import { APP_URL } from '../types';
import { handleError } from '../../Helpers/ErrorHandler';
import { CircularProgress } from '@mui/material';


const UserPage = () => {
    const [customers, setCustomers] = useState<Customer[]>();
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          try {
            let response = await axios.get(`${APP_URL}/customer`);
            setCustomers(response?.data)
            setIsLoading(false);
          } catch (error) {
            handleError(error, navigate);
            setMessage("Error fetching data: "+ error);
          }
        };
    
        fetchData();
      }, []);

      useEffect(() => {
        if (customers) {
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
      }, [customers]);

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
              <div className='col-span-1 text-lg mt-1'><h3>Customers</h3></div>
              <div className='flex justify-end items-end col-span-1'>
                {/* <Link to='/customer/new' className='bg-blue-500 hover:bg-primary p-2 rounded-lg font-sans'>
                  <PersonAdd className='pr-1'/>Add New Customer
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
                    <th>BVN</th>
                    <th>Phone</th>
                    <th>Customer Type</th>
                    <th>Options</th>
                  </tr>
                </thead>
                <tbody>
                  {customers && customers?.map((customer: Customer, index: number) => (
                    <tr key={customer.id} className="table-row">
                      <td className='w-2'>{index + 1}</td>
                      <td>{customer.name}</td>
                      <td>{customer.bvn}</td>
                      <td>{customer.phoneNumber}</td>
                      <td>{customer.customerType}</td>
                      <td>
                        <Link to={`/customer/${customer.id}`} className="text-[12px] bg-primary-blue hover:bg-primary text-white font-bold p-1 px-3 rounded-lg">open</Link>
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

export default UserPage