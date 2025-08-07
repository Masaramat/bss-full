import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserProfile } from '../../../Models/User';
import { adminChangePassword, getUser } from './usersApi';
import { CircularProgress } from '@mui/material';

import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import { capitalizeFirstLetter } from '../../customer/types';
import { ChangePasswordRequest } from './types';
import { toast } from 'react-toastify';
import {useAuth} from "../../../Context/useAuth.tsx";

type UpdatePasswordForm = { 
  newPassword: string   
  
}

const validation = Yup.object().shape({  
  newPassword: Yup.string().required("New password is required") 
});

const UserDetails = () => {
  const { id: userId } = useParams<{ id: string }>();
  const [userDetails, setUserDetails] = useState<UserProfile>();
  const navigate = useNavigate(); // Use navigate here directly
  const [isLoading, setIsLoading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const { user } = useAuth();


  const { register, setValue, handleSubmit, formState: { errors } } = useForm<UpdatePasswordForm>({ resolver: yupResolver(validation) });

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          const response = await getUser(userId, navigate); // Use navigate correctly
          setUserDetails(response?.data);
          setIsLoading(false)
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchData();
    }
  }, [userId, navigate]); // Add navigate to dependency array

  const handleChangePassword = async (form: UpdatePasswordForm) => {
    try{
      setChangingPassword(true);
      const request = {
        userId: userId,
        password: form.newPassword
      }as unknown as ChangePasswordRequest;

      await adminChangePassword(request, navigate);
      toast.success("password changed successfully");
      setValue("newPassword", "");
      setChangingPassword(false);
      

    }catch(error){
      toast.warning("Unkown error")

    }
  }

  let content = <div></div>;

  isLoading ? content = <>
  <div className='flex items-center justify-center'>
      <CircularProgress />
  </div>
  
  </> : content = (

      <div className={`flex items-center justify-center m-10`}>
        <div className='rounded-lg border h-fit border-primary w-[60%] '>

            <div className='grid grid-cols-2 bg-secondary p-4 text-white'>
              <div className='col-span-1 text-lg mt-1'><h3 className={`text-xl bold`}>{userDetails?.name}</h3></div>
              <div className='flex justify-end items-end col-span-1'>
              </div>
            </div>
            <div className='p-3 rounded-lg shadow-lg m-3'>
              <div className="grid grid-cols-2 max-md:grid-cols-1">
                <div className="p-5 font-bold col-span-1">

                  <p className="p-2"><span
                      className="text-lg font-bold text-primary">Username:</span> {userDetails?.username}
                  </p>
                  <p className="p-2"><span className="text-lg font-bold text-primary">Email:</span> {userDetails?.email}
                  </p>
                  <p className="p-2"><span
                      className="text-lg font-bold text-primary">Role:</span> {capitalizeFirstLetter(String(userDetails?.role.toLowerCase()))}
                  </p>

                  <p className="p-2"><span
                      className="text-lg font-bold text-primary">Account Status:</span> {userDetails?.isEnabled ? <span className={`text-green-500`}>Active</span> : <span className={`text-red-500`}>Inactive</span>}
                  </p>
                </div>
              </div>

            </div>


          <div className={`rounded-lg shadow-lg m-3 p-5`}>
            <form action="" onSubmit={handleSubmit(handleChangePassword)}>
              <div className='grid grid-cols-5 form-group'>
                <div className=' col-span-3'>

                  <input placeholder='New Password' type="password"
                         className="form-control "  {...register("newPassword")}/>
                  {errors.newPassword ? (<p className='text-sm text-red-600'>{errors.newPassword?.message}</p>) : ""}

                </div>
                <div className="col-span-2">
                  <button className='my-3 p-3 rounded-lg max-lg:w-full w-1/3 bg-secondary text-white'>
                    {changingPassword ? <CircularProgress size={20}/> : "Change Password"}
                  </button>


                </div>


              </div>
            </form>
          </div>

          {String(user?.role) === "ADMIN" && (
              <>
                <div className="flex p-2 space-x-2 max-sm:flex-col max-sm:space-x-0 max-sm:space-y-3">

                  <Link to={`/user/edit/${userDetails?.id}`}
                        className="bg-secondary px-6 p-3 m-3 text-center rounded-lg text-white max-lg:w-full w-1/3">
                    Edit User
                  </Link>


                </div>

              </>
          )}

        </div>
      </div>

  );

  return content;
};

export default UserDetails;
