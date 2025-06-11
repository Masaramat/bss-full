import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import $ from 'jquery';
import 'datatables.net';
import { GroupAdd } from '@mui/icons-material';
import { Group } from './types';
import { handleError } from '../../Helpers/ErrorHandler';
import { CircularProgress } from '@mui/material';
import { APP_URL } from '../types';

const GroupPage = () => {
    const [groups, setGroups] = useState<Group[]>();
    const [errorMsg] = useState("");
    const location = useLocation();
    const { message } = location.state || {};
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          try {
            let response = await axios.get(`${APP_URL}/group`);
            setGroups(response?.data)
            setIsLoading(false);
          } catch (error) {
            handleError(error, navigate);
          }
        };
    
        fetchData();
      }, []);

      useEffect(() => {
        if (groups) {
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
      }, [groups]);

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
              <div className='col-span-1 text-lg mt-1'><h3>Groups</h3></div>
              <div className='flex justify-end items-end col-span-1'>
                <Link to='/group/new' className='bg-blue-500 hover:bg-primary p-2 rounded-lg font-sans'>
                  <GroupAdd className='pr-1'/>Add New Group
                </Link>
              </div>
            </div>
            <div className='p-3'>
              {message && <p className='text-success text-center font-bold'>{message}</p>}
              {errorMsg && <p className='text-red-600 text-center font-bold'>{errorMsg}</p>}
              <table className='' id="users-table">
                <thead className='table-header-group'>
                  <tr>
                    <th className='w-2'>ID</th>
                    <th>Name</th>
                    <th>No. of Members</th>
                    <th>Option</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {groups && groups?.map((group: Group, index: number) => (
                    <tr key={group.id} className="table-row">
                      <td className='w-2'>{index + 1}</td>
                      <td>{group.name}</td>
                      <td>{group.numberOfMembers}</td>                    
                      <td>
                        <Link to={`/group/${group.id}`} className="text-[12px] bg-primary-blue hover:bg-primary text-white font-bold p-1 px-3 rounded-lg">open</Link>
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

export default GroupPage