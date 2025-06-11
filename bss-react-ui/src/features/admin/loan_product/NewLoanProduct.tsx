import CircularProgress from '@mui/material/CircularProgress'
import { useState } from 'react'
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { newLoanProduct } from './loanProductApi';

type NewLoanProductFormInputs = {
    name: string,
    interestRate: number,
    monitoringFeeRate: number,
    processingFeeRate: number,
    tenor: number
    
}

const validation = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    interestRate: Yup.number().required("*required"),
    monitoringFeeRate: Yup.number().required("required"),
    processingFeeRate: Yup.number().required("required"),
    tenor: Yup.number().required("Role is required"),
  });


const NewLoanProduct = () => { 
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<NewLoanProductFormInputs>({ resolver: yupResolver(validation) });
  const navigate = useNavigate();

  const handleProductCreation = async (form: NewLoanProductFormInputs) => {
    setIsLoading(true)
    await newLoanProduct(form.name, form.interestRate, form.monitoringFeeRate, form.processingFeeRate, form.tenor, navigate)?.then(res => {
        if(res?.data){
            setIsLoading(false)
            toast.success("Loan product added successfully!")
            navigate("/loan-product")
        }
    })

  }
 

  return (
    <div className="border border-primary rounded-lg m-5 dark:bg-transparent">
      <h3 className="bg-secondary rounded-lg p-5 text-white font-sans text-lg">New User</h3>
      <form  className="p-6" onSubmit={handleSubmit(handleProductCreation)}> 
        <div className="grid grid-cols-2">
          <div className='form-group'>
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control"  {...register("name")}/>
            {errors.name ? (<p className='text-sm text-red-600'>{errors.name?.message}</p>) : ""}

          </div> 
          <div className='form-group'>
            <label htmlFor="interestRate" className="form-label">Interest Rate</label>
            <input type="text" className="form-control"  {...register("interestRate")}/>
            {errors.interestRate ? (<p className='text-sm text-red-600'>{errors.interestRate?.message}</p>) : ""}

          </div> 
          <div className='form-group'>
            <label htmlFor="monitoringFeeRate" className="form-label">Monitoring Fee Rate</label>
            <input type="number" className="form-control" {...register("monitoringFeeRate")} />
            {errors.monitoringFeeRate ? (<p className='text-sm text-red-600'>{errors.monitoringFeeRate?.message}</p>) : ""}

          </div> 
          <div className='form-group'>
            <label htmlFor="processingFeeRate" className="form-label">Processing Fee Rate </label>
            <input type="number" className="form-control" {...register("processingFeeRate")} />
            {errors.processingFeeRate ? (<p className='text-sm text-red-600'>{errors.processingFeeRate?.message}</p>) : ""}

          </div> 
          <div className='form-group'>
            <label htmlFor="role" className="form-label">Role</label>
            <select className='form-control' id="" {...register("tenor")}>
                <option value="">Select Tenor</option>
                {Array.from({ length: 9 }, (_, i) => i + 1).map(i => (
                    <option key={i} value={i}>{i}</option>
                ))}
            </select>
            {errors.tenor ? (<p className='text-sm text-red-600'>{errors.tenor?.message}</p>) : ""}

          </div>

        </div>
        <button className='bg-secondary text-white-400 w-60 rounded-full text-lg p-2 mt-4 font-bold' >
            {isLoading ? <CircularProgress color="inherit" /> : 'Create Loan Product'}
        </button>
      </form>
    </div>
  )
}

export default NewLoanProduct