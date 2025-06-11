import { KeyboardArrowDown, KeyboardArrowRight, Logout, Mode, Notifications, Person } from '@mui/icons-material';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import userIcon from '../assets/icons/userIcon.gif';
import { useAuth } from '../Context/useAuth';

const Nav: React.FC = () => {
  const { logout, user } = useAuth();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setOpenDropdown(false);
    }
  };

  useEffect(() => {
    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleLogout = () => {
    console.log("logging out...");
    logout();
  };

  return (
    <div>
      <div className='h-16 bg-secondary dark:bg-dark-primary flex justify-end items-center px-5 text-white text-sm font-sans'>
        <p className='p-1 hover:bg-slate-400 rounded-full hover:cursor-pointer mx-1'>
          <Notifications /><sup className='ml-[-6px] text-red-200 font-bold'>50</sup>
        </p>
        <div className='rotate-90 w-12 p-2 text-white'>
          <hr className='border border-t-1 text-sm border-gray-600' />
        </div>
        <div className='flex hover:cursor-pointer' onClick={toggleDropdown}>
          <img className='rounded-full' src={userIcon} alt="User Icon" height='40px' width='40px' />
          <p className='pt-3 pl-2'>{user?.name || "User"}</p>
          <p className='pt-3'>
            {openDropdown ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
          </p>
        </div>
      </div>
      {openDropdown && (
        <div ref={dropdownRef} className='absolute z-10 right-3 bg-gray-100 border border-gray-300 mt-1 rounded-lg text-sm font-montserrat'>
          <ul>
            <li className='userNavLinkItem' onClick={toggleDropdown}>
              <Person className='px-1 text-slate-500' />
              <Link to={`/user/${user?.id}`} >Profile</Link>
            </li>
            <li className='userNavLinkItem' onClick={toggleDropdown}>
              <Mode className='px-1 text-slate-500' />
              <Link to={`/password/edit/${user?.id}`}>Password</Link>
            </li>
            <hr className='border border-t-[0.5px] text-sm border-gray-300' />
            <li className='userNavLinkItem rounded-lg' onClick={() => { toggleDropdown(); handleLogout(); }}>
              <Logout className='px-1 text-slate-500' />
              <button className='relative'>Logout</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Nav;
