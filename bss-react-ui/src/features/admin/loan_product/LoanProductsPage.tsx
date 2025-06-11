import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import $ from 'jquery';
import 'datatables.net';
import { Category } from '@mui/icons-material';
import { LoanProduct } from '../../../Models/LoanProduct';
import { getLoanProducts } from './loanProductApi';

const LoanProductsPage = () => {
    const [message, setMessage] = useState("");
    const [loanProducts, setLoanProducts] = useState<LoanProduct[]>([])
    const navigate = useNavigate();
      useEffect(() => {
        const fetchData = async () => {
            try {
              await getLoanProducts(navigate)?.then(res => {
                  if(res){
                      setLoanProducts(res.data);
                      if (loanProducts) {
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
                  }
              })
             
            } catch (error) {
              setMessage("Error fetching data: "+ error);
            }
          };
      
          fetchData();

        
      }, []);

      let content = <div></div>

      content = (
        <div className='m-5 rounded-lg border h-fit border-primary'>
          <div className='grid grid-cols-2 bg-secondary p-3 text-white'>
            <div className='col-span-1 text-lg mt-1'><h3>Loan Products</h3></div>
            <div className='flex justify-end items-end col-span-1'>
              <Link to='/loan-product/new' className='bg-blue-500 hover:bg-primary p-2 rounded-lg font-sans'>
                <Category className='pr-1'/>New Loan Product
              </Link>
            </div>
          </div>
          <div className='p-3'>
            {message && <p className='text-success text-center font-bold'>{message}</p>}
            <table className='table-auto' id="users-table">
              <thead className='table-header-group'>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Int Rate</th>
                  <th>Monitoring Fee Rate</th>
                  <th>Processing Fee Rate</th>
                  <th>Tenor</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {loanProducts && loanProducts?.map((loanProduct: LoanProduct, index: number) => (
                  <tr key={loanProduct.id} className="table-row">
                    <td>{index + 1}</td>
                    <td>{loanProduct.name}</td>
                    <td>{loanProduct.interestRate + '%'}</td>
                    <td>{loanProduct.monitoringFeeRate + '%'}</td>
                    <td>{loanProduct.processingFeeRate + '%'}</td>
                    <td>{loanProduct.tenor + ' Months'}</td>
                    <td>
                      <Link to={`/loan-product/${loanProduct.id}`} className="text-[12px] bg-primary-blue hover:bg-primary text-white font-bold p-1 px-3 rounded-l-lg">open</Link>
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

export default LoanProductsPage