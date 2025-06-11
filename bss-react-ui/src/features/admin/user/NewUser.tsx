import CircularProgress from '@mui/material/CircularProgress'
import { useState } from 'react'
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import { addUser } from './usersApi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

type NewUserFormInput = {
    name: string,
    email: string,
    password: string,
    username: string,
    role: string
    
}

const validation = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().required("email is required"),
    password: Yup.string().required("Password is required"),
    username: Yup.string().required("Username is required"),
    role: Yup.string().required("Role is required"),
  });


const NewUser = () => { 
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<NewUserFormInput>({ resolver: yupResolver(validation) });
  const navigate = useNavigate();

  const handleUserCreation = async (form: NewUserFormInput) => {
    setIsLoading(true)
    await addUser(form.name, form.email, form.username, form.role, form.password, navigate)?.then(res => {
        if(res?.data){
            setIsLoading(false)
            toast.success("User added successfully!")
            navigate("/user")
        }
    })

  }
 

  return (
    <div className="border border-primary rounded-lg m-5 dark:bg-transparent">
      <h3 className="bg-secondary rounded-lg p-5 text-white font-sans text-lg">New User</h3>
      <form  className="p-6" onSubmit={handleSubmit(handleUserCreation)}> 
        <div className="grid grid-cols-2">
          <div className='form-group'>
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control"  {...register("name")}/>
            {errors.name ? (<p className='text-sm text-red-600'>{errors.name?.message}</p>) : ""}

          </div> 
          <div className='form-group'>
            <label htmlFor="username" className="form-label">Username</label>
            <input type="text" className="form-control"  {...register("username")}/>
            {errors.username ? (<p className='text-sm text-red-600'>{errors.username?.message}</p>) : ""}

          </div> 
          <div className='form-group'>
            <label htmlFor="email" className="form-label">email</label>
            <input type="text" className="form-control" {...register("email")} />
            {errors.email ? (<p className='text-sm text-red-600'>{errors.email?.message}</p>) : ""}

          </div> 
          <div className='form-group'>
            <label htmlFor="password" className="form-label">password</label>
            <input type="password" className="form-control" {...register("password")} />
            {errors.password ? (<p className='text-sm text-red-600'>{errors.password?.message}</p>) : ""}

          </div> 
          <div className='form-group'>
            <label htmlFor="role" className="form-label">Role</label>
            <select className='form-control' id="" {...register("role")}>
                <option value="">Select Role</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
            </select>
            {errors.role ? (<p className='text-sm text-red-600'>{errors.role?.message}</p>) : ""}

          </div>

        </div>
        <button className='bg-secondary text-white-400 w-60 rounded-full text-lg p-2 mt-4 font-bold' >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create User'}
        </button>
      </form>
    </div>
  )
}

export default NewUser