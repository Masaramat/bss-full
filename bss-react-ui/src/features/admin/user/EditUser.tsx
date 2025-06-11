import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import CircularProgress from '@mui/material/CircularProgress';
import { handleError } from '../../../Helpers/ErrorHandler';
import { editUser, getUser } from './usersApi';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type EditUserFormInputs = {
    name: string,
    email: string,
    role: string,
    username: string
}

const validation = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().required("Email is required"),
    username: Yup.string().required("Username is required"),
    role: Yup.string().required("Role is required"),
});

const EditUser = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const userRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id: userId } = useParams<{ id: string }>();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<EditUserFormInputs>({ resolver: yupResolver(validation) });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userId) {
          const res = await getUser(userId, navigate);
          const userData = res?.data;
          setValue('name', userData.name);
          setValue('email', userData.email);
          setValue('username', userData.username);
          setValue('role', userData.role);
        }
      } catch (error) {
        handleError(error, navigate);
      }
    }
    fetchData();
  }, [userId, setValue]);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrorMsg('');
  }, []);


  const handleEditUser = async (form: EditUserFormInputs) => {
    setIsLoading(true);
    try {
      await editUser(Number(userId), form.name, form.email, form.username, form.role, navigate)?.then(res => {
        if (res.data) {
            setIsLoading(false);
            toast.success("User edited successfully!");
            navigate("/user");
          }
      })
      
    } catch (error) {
      setIsLoading(false);
      handleError(error, navigate);
    }
  }

  return (
    <div className="border border-primary rounded-lg m-5">
      <h3 className="bg-secondary rounded-lg p-5 text-white font-sans text-lg">Edit Application User</h3>
      <form onSubmit={handleSubmit(handleEditUser)} className="p-6">
        {errorMsg && <p className="text-center text-red-600">{errorMsg}</p>}
        <div className="grid grid-cols-2 gap-4">
          <div className='form-group'>
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              {...register("name")}
            />
            {errors.name && <p className='text-sm text-red-600'>{errors.name.message}</p>}
          </div>
          <div className='form-group'>
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              {...register("username")}
            />
            {errors.username && <p className='text-sm text-red-600'>{errors.username.message}</p>}
          </div>
          <div className='form-group'>
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="text"
              className="form-control"
              {...register("email")}
            />
            {errors.email && <p className='text-sm text-red-600'>{errors.email.message}</p>}
          </div>
          <div className='form-group'>
            <label htmlFor="role" className="form-label">Role</label>
            <select
              className='form-control'
              {...register("role")}
            >
              <option value="">Select Role</option>
              <option value="ADMIN">Admin</option>
              <option value="USER">User</option>
            </select>
            {errors.role && <p className='text-sm text-red-600'>{errors.role.message}</p>}
          </div>
        </div>
        <button type="submit" className='bg-secondary text-white w-60 rounded-full text-lg p-2 mt-4 font-bold'>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Update User'}
        </button>
      </form>
    </div>
  );
}

export default EditUser;
