import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { capitalizeFirstLetter, Customer, CustomerType } from './types';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import { createCustomer } from './api';
import { toast } from 'react-toastify';
import { subYears } from 'date-fns';

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

const NewCustomer = () => {
  const navigate = useNavigate();  
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date>();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<NewCustomerFormInputs>({ resolver: yupResolver(validation) });

  useEffect(() => {
    const date = new Date();
    const initialDate = subYears(date, 20);
    setStartDate(initialDate);
    setValue("dateOfBirth", initialDate.toISOString().split('T')[0]);
  }, [setValue]);

  const handleCreateUser = async (form: NewCustomerFormInputs) => {
    setIsLoading(true); 
    const customerDto = {
      name: form.name,
      phoneNumber: "234"+form.phoneNumber,
      address: form.address,
      customerType: form.customerType,
      bvn: form.bvn,
      dateOfBirth: form.dateOfBirth
    } as unknown as Customer;

    await createCustomer(customerDto, navigate)?.then(res => {
      if (res?.data) {
        toast.success("New customer created successfully");       
        navigate("/customer");      
      }
    });
  };

  const handleDateChange = (e: any) => {
    const date = new Date(e.target.value);
    setStartDate(date);
    setValue("dateOfBirth", date.toISOString().split('T')[0]);
  };

  return (
    <div className="border border-primary rounded-lg m-5 dark:bg-transparent">
      <h3 className="bg-secondary rounded-lg p-5 text-white font-sans text-lg">New Customer</h3>
      <form onSubmit={handleSubmit(handleCreateUser)} className="p-6">
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
                <option key={customerType} value={customerType}>
                  {capitalizeFirstLetter(String(customerType === CustomerType.SAVINGS ? "Loan" : "Adashe"))}
                </option>
              ))}
            </select>
            {errors.customerType && (<p className='text-sm text-red-600'>{errors.customerType.message}</p>)}
          </div>
        </div>
        <button className='bg-secondary text-white-400 w-60 rounded-full text-lg p-2 mt-4 font-bold'>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create Customer'}
        </button>
      </form>
    </div>
  );
}

export default NewCustomer;
