import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import CircularProgress from '@mui/material/CircularProgress';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { handleError } from '../../../Helpers/ErrorHandler';
import {getAdasheSetup, updateAdasheSetup} from './api';
import { AdasheSetupData } from './types';
import axios from "axios";
import {APP_URL} from "../../types.tsx";

type EditAdasheSetupForm = {
  commissionRate: number,
  minimumDeposit: number,   
}

const validation = Yup.object().shape({
    commissionRate: Yup.number().required("Name is required"),
    minimumDeposit: Yup.number().required("Email is required")   
});

const AdasheSetup = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState('');
  const userRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [setupId, setSetupId] = useState(0);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<EditAdasheSetupForm>({ resolver: yupResolver(validation) });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAdasheSetup(navigate);
        const setupData = res?.data;
        setValue('commissionRate', setupData.commissionRate);
        setValue('minimumDeposit', setupData.minimumDeposit);
        setSetupId(setupData.id);
      } catch (error: unknown) {

        if (axios.isAxiosError(error) && error.response?.status === 404) {
          try {
            const response = await axios.post(`${APP_URL}/admin/setup/adashe`, {
              commissionRate: 0,
              minimumDeposit: 0
            });
            setValue("commissionRate", response?.data?.commissionRate)
            setValue("minimumDeposit", response?.data?.minimumDeposit)
            setSetupId(response?.data?.id);
            toast.success("Adashe setup created successfully");
          } catch (createErr) {
            handleError(createErr, navigate);
          }
        } else {
          // Handle other errors
          handleError(error, navigate);
        }
      }
    };

    fetchData();
  }, [setValue]);


  useEffect(() => {
    userRef.current?.focus();
  }, []);

  useEffect(() => {
    setErrorMsg('');
  }, []);


  const handleEditUser = async (form: EditAdasheSetupForm) => {
    setIsLoading(true);
    try {
      const adasheSetupData = {
        id: setupId,
        commissionRate: form.commissionRate,
        minimumDeposit: form.minimumDeposit

      }as unknown as AdasheSetupData;
      await updateAdasheSetup(adasheSetupData, navigate)?.then(res => {
        if (res.data) {
            setIsLoading(false);
            toast.success("Setup edited successfully!");
            navigate("/dashboard");
          }
      })
      
    } catch (error) {
      setIsLoading(false);
      handleError(error, navigate);
    }
  }

  return (
    <div className="border border-primary rounded-lg m-5">
      <h3 className="bg-secondary rounded-lg p-5 text-white font-sans text-lg">Adashe Configuration</h3>
      <form onSubmit={handleSubmit(handleEditUser)} className="p-6">
        {errorMsg && <p className="text-center text-red-600">{errorMsg}</p>}
        <div className="grid grid-cols-2 gap-4">
          <div className='form-group'>
            <label htmlFor="commissionRate" className="form-label">Commission Rate</label>
            <input
              type="text"
              className="form-control"
              {...register("commissionRate")}
            />
            {errors.commissionRate && <p className='text-sm text-red-600'>{errors.commissionRate.message}</p>}
          </div>
          <div className='form-group'>
            <label htmlFor="minimumDeposit" className="form-label">Minimum Deposit</label>
            <input
              type="text"
              className="form-control"
              {...register("minimumDeposit")}
            />
            {errors.minimumDeposit && <p className='text-sm text-red-600'>{errors.minimumDeposit.message}</p>}
          </div>
          
            
        </div>
        <button type="submit" className='bg-secondary text-white w-60 rounded-full text-lg p-2 mt-4 font-bold'>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Update Setup'}
        </button>
      </form>
    </div>
  );
}

export default AdasheSetup;
