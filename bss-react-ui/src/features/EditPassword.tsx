import CircularProgress from '@mui/material/CircularProgress'
import { useState } from 'react'
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { changePassword } from './homeApi';
import { ChangePasswordRequest } from './admin/user/types';
import { useAuth } from '../Context/useAuth';

type UpdatePasswordForm = {
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,    
    
}

const validation = Yup.object().shape({
    currentPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string().required("New password is required"),
    confirmPassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref('newPassword')], "Passwords must match"),
});


const EditPassword = () => { 
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<UpdatePasswordForm>({ resolver: yupResolver(validation) });
  const navigate = useNavigate();
  const {user} = useAuth();

  const handleUserCreation = async (form: UpdatePasswordForm) => {
    let changePasswordRequest = {
        userId: user?.id,
        currentPassword: form.currentPassword,
        password: form.newPassword,
        confirmPassword: form.confirmPassword
    } as unknown as ChangePasswordRequest
    setIsLoading(true)
    await changePassword(changePasswordRequest, navigate)?.then(res => {
        if(res?.data){
            setIsLoading(false)
            toast.success("Password Changed successfully!")
            navigate("/dashboard")
        }
    })

  }
 

  return (
    <div className="border border-primary rounded-lg m-5 dark:bg-transparent">
      <h3 className="bg-secondary rounded-lg p-5 text-white font-sans text-lg">New User</h3>
      <form  className="p-6" onSubmit={handleSubmit(handleUserCreation)}> 
        <div className="w-[50%]">
          <div className='form-group'>
            <label htmlFor="name" className="form-label">Current Password</label>
            <input type="password" className="form-control"  {...register("currentPassword")}/>
            {errors.currentPassword ? (<p className='text-sm text-red-600'>{errors.currentPassword?.message}</p>) : ""}

          </div> 
          <div className='form-group'>
            <label htmlFor="username" className="form-label">NewPassword</label>
            <input type="password" className="form-control"  {...register("newPassword")}/>
            {errors.newPassword ? (<p className='text-sm text-red-600'>{errors.newPassword?.message}</p>) : ""}

          </div> 
          <div className='form-group'>
            <label htmlFor="email" className="form-label">Confirm Password</label>
            <input type="password" className="form-control" {...register("confirmPassword")} />
            {errors.confirmPassword ? (<p className='text-sm text-red-600'>{errors.confirmPassword?.message}</p>) : ""}

          </div> 
          

        </div>
        <button className='bg-secondary text-white-400 w-60 rounded-full text-lg p-2 mt-4 font-bold' >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create User'}
        </button>
      </form>
    </div>
  )
}

export default EditPassword