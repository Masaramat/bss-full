import { FileCopyOutlined, Group, KeyboardArrowDown, KeyboardArrowRight, Person, Settings, SpeedSharp } from "@mui/icons-material"

import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Context/useAuth";
import headerLogo from '../assets/images/header-logo.png'

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(-1);
  const {user} = useAuth();
  

  const toggleDropdown = (index: number) => {
    if (openDropdown === index) {
      setOpenDropdown(-1);
    } else {
      setOpenDropdown(index);
    }
  };

  return (
    <div className="col-span-2 bg-primary flex-col space-x-1 max-sm:p-1 p-3 min-h-screen h-full">
        
        <div className=" flex justify-center items-center pt-2">
            <img src={headerLogo} alt=""  width={100} height={100} />
        </div>

        
        <hr className="mb-6 border border-t-0 text-sm border-gray-600"/>
        <ul >
            <li className="linkItem">
              <div className="sidebarLinkItem" >
                <SpeedSharp  className="w-8 h-8 pr-1 justify-center items-center"/>
                <Link to="/dashboard">Dashboard</Link> 
              </div>
              
                
            </li>
            <hr className="mt-6 border border-t-0 text-sm border-gray-600"/>
            <li className="text-white-400 font-montserrat text-xs md:text-sm pt-4 text-center md:text-left pb-1">Pages</li>

            <li className="linkLinkitem" onClick={()=>toggleDropdown(1)}>
              <div className="linkItem">
                <div className="sidebarLinkItem">
                  <Person  className="h-6 w-6 pr-1"/>
                  Customer
                </div>
                <div className="hidden lg:block">
                  {openDropdown === 1 ? (
                    <KeyboardArrowDown className="" />
                  ) : (
                    <KeyboardArrowRight className="" />
                  )}

                </div>
               
               
              </div>


              {openDropdown === 1 && (
                  <div className="dropdown-content bg-white-400 p-2 rounded-xl">
                    <ul>
                      <li className="listItem">
                        <Link to='/customer'>All Customers</Link>
                      </li>
                      <li className="listItem">
                      <Link to='/customer/new'>Create Customer</Link>
                      </li>
                    </ul>
                  </div>
                )}
                
            </li>
            <li className="linkLinkitem" onClick={()=>toggleDropdown(2)}>
              <div className="linkItem">
                <div className="sidebarLinkItem">
                  <Group  className="h-6 w-6 pr-1"/>
                  Group
                </div>
                <div className="hidden lg:block">
                  {openDropdown === 2 ? (
                    <KeyboardArrowDown className="hidden md:flex justify-end w-5 h-5" />
                  ) : (
                    <KeyboardArrowRight className="hidden md:flex justify-end w-5 h-5 max-md:hidden" />
                  )}              

                </div>
               
              </div>


              {openDropdown === 2 && (
                  <div className="dropdown-content bg-white-400 p-2 rounded-xl">
                    <ul>
                      <li className="listItem"><Link to='/group'>All groups</Link></li>
                    </ul>
                  </div>
                )}
                
            </li>

            

            <li className="linkLinkitem" onClick={()=>toggleDropdown(3)}>
              <div className="linkItem">
                <div className="sidebarLinkItem">
                  <FileCopyOutlined  className="h-6 w-6 pr-1"/>
                  Loan
                </div>
                <div className="hidden lg:block">
                  {openDropdown === 3 ? (
                    <KeyboardArrowDown className="flex justify-end w-5 h-5 sm:hidden" />
                  ) : (
                    <KeyboardArrowRight className="flex justify-end w-5 h-5 sm:hidden" />
                  )}

                </div>
                
               
              </div>


              {openDropdown === 3 && (
                  <div className="dropdown-content bg-white-400 p-2 rounded-xl">
                    <ul>
                      <li className="listItem"><Link to='/loan'>All Loans</Link></li>
                      <li className="listItem"><Link to='/loan/pending'>Pending Loans</Link></li>
                      <li className="listItem"><Link to='/loan/expected' >Expected Repayments</Link></li>
                    
                    </ul>
                  </div>
                )}
                
            </li>
            
            
            {user?.role === "ADMIN" && (
              <>
                <li className="linkLinkitem" onClick={()=>toggleDropdown(4)}>
                <div className="linkItem">
                  <div className="sidebarLinkItem">
                    <FileCopyOutlined  className="h-6 w-6 pr-1"/>
                    Reports
                  </div>
                  <div className="hidden lg:block">
                    {openDropdown === 4 ? (
                      <KeyboardArrowDown className="flex justify-end w-5 h-5 max-sm:hidden" />
                    ) : (
                      <KeyboardArrowRight className="flex justify-end w-5 h-5 max-sm:hidden" />
                    )}
                  </div>
                  
                
                </div>


                {openDropdown === 4 && (
                    <div className="dropdown-content bg-white-400 p-2 rounded-xl">
                      <ul>
                        <li className="listItem"><Link to='/report/loan'>Loans Report</Link></li>
                        <li className="listItem"><Link to='/report/repayment'>Loan Repayment Report</Link></li>
                        <li className="listItem"><Link to='/report/transaction'>Transaction Report</Link></li>
                        <li className="listItem"><Link to='/report/adashe/commission'>Adashe Commission Report</Link></li>

                      </ul>
                    </div>
                  )}
                  
              </li>
                <hr className="mt-6 border border-t-0 text-sm border-gray-600 "/>
           
                <li className="text-white-400 font-montserrat text-xs md:text-sm text-center md:text-left pt-4">Admin</li>
                <li className="linkLinkitem" onClick={()=>toggleDropdown(5)}>
                  <div className="linkItem">
                    <div className="sidebarLinkItem">
                      <Settings  className="h-6 w-6 pr-1"/>
                      Manage
                    </div>
                    <div className="hidden lg:block">
                      {openDropdown === 5 ? (
                        <KeyboardArrowDown className="hidden md:block justify-end w-5 h-5 " />
                      ) : (
                        <KeyboardArrowRight className="hidden md:block justify-end w-5 h-5" />
                      )}

                    </div>
                    
                    
                  </div>


                  {openDropdown === 5 && (
                      <div className="dropdown-content bg-white-400 p-2 mt-1 rounded-xl">
                        <ul>
                          <Link to='/user' className="listItem">Users</Link>
                          <Link to="/loan-product" className="listItem">Loan Products</Link>
                          <Link to='/adashe/setup' className="listItem">Adashe Setup</Link>
                          
                        </ul>
                      </div>
                    )}
                    
                </li> 
              </>
            )}
  
                  
            
            
        </ul>
        

        


    </div>
  )
}

export default Sidebar