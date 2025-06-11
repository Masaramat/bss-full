import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Nav from './Nav';
import Sidebar from './Sidebar';
import { useAuth } from '../Context/useAuth';
import { isTokenExpired } from '../Utilities/AuthUtils';
import { toast } from 'react-toastify';
import Footer from './Footer';

const AuthenticatedLayout = () => {
  const { isLoggedIn } = useAuth();
  const isAuthenticated = isLoggedIn();
  const token = localStorage.getItem("token");

  const isTokenValid = token && !isTokenExpired(token);
  const [shouldRedirect, setShouldRedirect] = React.useState(false);

  useEffect(() => {
    if (!isTokenValid || !isAuthenticated) {
      toast.warning("Session expired! Please Login");
      setShouldRedirect(true);
    }
  }, [isTokenValid, isAuthenticated]);

  if (shouldRedirect) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="authenticated-layout grid grid-cols-6">
      <div className='col-span-1'>
        <Sidebar />
      </div>
      <div className='col-span-5 bg-slate-200 dark:bg-slate-300 dark:text-slate-900'>
        <Nav />
        <main className="content font-nunito pb-14">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
