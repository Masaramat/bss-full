import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import CircularProgress from '@mui/material/CircularProgress';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { editCustomer, getCustomer } from './api';
import { handleError } from '../../Helpers/ErrorHandler';
import { Customer, CustomerType } from './types';

type NewCustomerFormInputs = {
    name: string,
    phoneNumber: string,
    bvn?: string,
    address: string,
    customerType: string,
    dateOfBirth: string, 
  }
  
  const validation = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .length(10, "Phone number must be exactly 10 digits"),
    bvn: Yup.mixed(),
    address: Yup.string().required("Address is required"),
    customerType: Yup.string().required("Customer Type is required"),
    dateOfBirth: Yup.string().required("Date of birth is required")
  });

const EditCustomer = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date>();
  const userRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setIsFetching] = useState(false);
  const { id: customerId } = useParams<{ id: string }>();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<NewCustomerFormInputs>({ resolver: yupResolver(validation) });

  useEffect(() => {
    const fetchData = async () => {
        setIsFetching(true);
      try {
        if (customerId) {
          const res = await getCustomer(customerId, navigate);
          const userData = res?.data;
          setValue('name', userData.name);
          setValue('phoneNumber', userData.phoneNumber.slice(3));
          setValue('bvn', userData.bvn);
          setValue('address', userData.address);
          setValue('customerType', userData.customerType);
          setValue('dateOfBirth', userData.dateOfBirth);
           
           if (userData.dateOfBirth) {
            const [day, month, year] = userData.dateOfBirth.split('/');
            const date = new Date(`${year}-${month}-${day}`);
            if (!isNaN(date.getTime())) {
              setStartDate(date);
            } else {
              setStartDate(undefined); // Handle invalid date if necessary
            }
          } else {
            setStartDate(undefined); // or set a default date if needed
          }
          setIsFetching(false);
        }
      } catch (error) {
        handleError(error, navigate);
      }
    }
    fetchData();
  }, [customerId, setValue]);

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  

  function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const handleEditUser = async (form: NewCustomerFormInputs) => {
    setIsLoading(true);
    try {
        let customer = {
            id: customerId,
            name: form.name,
            phoneNumber: "234"+form.phoneNumber,
            bvn: form.bvn,
            address: form.address,
            dateOfBirth: form.dateOfBirth,
            customerType: form.customerType

        } as unknown as Customer
      await editCustomer(customer,  navigate)?.then(res => {
        if (res.data) {
            setIsLoading(false);
            toast.success("User edited successfully!");
            navigate("/customer");
          }
      })
      
    } catch (error) {
      setIsLoading(false);
      handleError(error, navigate);
    }
  }

  const handleDateChange = (e: any) => {
    const date = new Date(e.target.value);
    setStartDate(date);
    setValue("dateOfBirth", date.toISOString().split('T')[0]);
  };

  return fetching ? <>
    <div className='flex items-center justify-center'>
      <CircularProgress />
    </div>
  
  </> : (
    <div className="border border-primary rounded-lg m-5">
      <h3 className="bg-secondary rounded-lg p-5 text-white font-sans text-lg">Edit Application User</h3>
      <form onSubmit={handleSubmit(handleEditUser)} className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className='form-group'>
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" {...register("name")} />
            {errors.name && (<p className='text-sm text-red-600'>{errors.name.message}</p>)}
          </div> 
          <div className='form-group'>
            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
            <div className='grid grid-cols-8'>
              <input type="text" className='form-control col-span-1' value="+234" name="" id="" />
            <input type="text" className="form-control col-span-7" {...register("phoneNumber")} />

            </div>
            
            {errors.phoneNumber && (<p className='text-sm text-red-600'>{errors.phoneNumber.message}</p>)}
          </div> 
          <div className='form-group'>
            <label htmlFor="bvn" className="form-label">BVN</label>
            <input type="text" className="form-control" {...register("bvn")} />
            {errors.bvn && (<p className='text-sm text-red-600'>{errors.bvn.message}</p>)}
          </div> 
          <div className='form-group'>
            <label htmlFor="address" className="form-label">Address</label>
            <input type="text" className="form-control" {...register("address")} />
            {errors.address && (<p className='text-sm text-red-600'>{errors.address.message}</p>)}
          </div>
          <div className='form-group'>
            <label htmlFor="datepicker">Date of Birth</label>
            <input
                {...register("dateOfBirth")}
              value={startDate ? startDate.toISOString().split('T')[0] : ''}
              onChange={handleDateChange}
              type='date'
              className="form-control"
            />
            {errors.dateOfBirth && (<p className='text-sm text-red-600'>{errors.dateOfBirth.message}</p>)}
          </div>
          <div className='form-group'>
            <label htmlFor="customerType" className="form-label">Customer Type</label>
            <select {...register("customerType")} className='form-control'>
              <option value="">Select Customer type</option>
              {Object.keys(CustomerType).map(customerType => (
                <option key={customerType} value={customerType}>{capitalizeFirstLetter(String(customerType))}</option>
              ))}
            </select>
            {errors.customerType && (<p className='text-sm text-red-600'>{errors.customerType.message}</p>)}
          </div>
        </div>
        <button className='bg-secondary text-white-400 w-60 rounded-full text-lg p-2 mt-4 font-bold'>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Update Customer'}
        </button>
      </form>
    </div>
  );
}

export default EditCustomer;
