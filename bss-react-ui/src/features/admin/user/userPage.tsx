import axios from 'axios'
import { useEffect, useState } from 'react'
import { UserDto } from './types';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import 'datatables.net';
import { APP_URL } from '../../types';
import { PersonAdd } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

const UserPage = () => {
    const [users, setUsers] = useState<UserDto[]>();
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
          setIsLoading(true);
          try {
            let response = await axios.get(`${APP_URL}/user`);
            setUsers(response?.data)
            setIsLoading(false);
          } catch (error) {
            setMessage("Error fetching data: "+ error);
          }
        };
    
        fetchData();
      }, []);

      useEffect(() => {
        if (users) {
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
      }, [users]);

      let content = <div></div>

     isLoading? content = 
     <>
     <div className='flex items-center justify-center'>
        <CircularProgress />
      </div>
     </> : 
     content = (
        <div className='m-5 rounded-lg border h-fit border-primary'>
          <div className='grid grid-cols-2 bg-secondary p-3 text-white'>
            <div className='col-span-1 text-lg mt-1'><h3>Application Users</h3></div>
            <div className='flex justify-end items-end col-span-1'>
              <Link to='/user/new' className='bg-blue-500 hover:bg-primary p-2 rounded-lg font-sans'>
                <PersonAdd className='pr-1'/>Add New User
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
                  <th>Role</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {users && users?.map((user: UserDto, index: number) => (
                  <tr key={user.id} className="table-row">
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.role}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <Link to={`/user/${user.id}`} className="text-[12px] bg-primary-blue hover:bg-primary text-white font-bold p-1 px-3 rounded-l-lg">open</Link>
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

export default UserPage