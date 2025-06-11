import React from 'react';
import { UserProvider } from './Context/useAuth';
import { ToastContainer } from 'react-toastify';
import 'datatables.net-dt/css/dataTables.dataTables.css'
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';

import { Outlet } from 'react-router-dom';

const App: React.FC = () => {
  return (   

    <>
      <UserProvider>
        <Outlet />
        <ToastContainer />
      </UserProvider>
    </>   
       
  );
};

export default App;
