import { CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Account, Customer, capitalizeFirstLetter } from '../customer/types';
import { LoanProduct } from '../admin/loan_product/types';
import {APP_URL, numberToNairaWords} from '../types';
import { useAuth } from '../../Context/useAuth';
import { Group } from '../group/types';
import { getGroups } from '../group/groupApi';
import { handleError } from '../../Helpers/ErrorHandler';
import * as Yup from 'yup';
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {LoanApplication} from "./types.tsx";
import {toast} from "react-toastify";

const validation = Yup.object({
  amount: Yup.number().typeError("Amount must be number format").required("Amount is required"),
  formsFee: Yup.number().typeError("Amount must be number format").required("Amount is required"),
  searchFee: Yup.number().typeError("Amount must be number format").required("Amount is required"),
  collateralDeposit: Yup.number().typeError("Amount must be number format").required("Amount is required"),
  amountInWords: Yup.string().required("Required"),
  groupId: Yup.mixed(),
  tenor: Yup.number().typeError("Must be Number").required("Required"),
});

const NewLoanApplication = () => {
  const navigate = useNavigate();
  const [selectedLoanProduct, setSelectedLoanProduct] = useState<LoanProduct>();
  const [customer, setCustomer] = useState<Customer>();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);  
  const { customerId } = useParams<{ customerId: string }>();
  const [loanProducts, setLoanProducts] = useState<LoanProduct[]>();
  const { user } = useAuth();

  const {register, handleSubmit, formState: {errors}, setError, watch, setValue} = useForm({
    resolver: yupResolver(validation),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customerResponse = await axios.get(`${APP_URL}/customer/${customerId}`);
        setCustomer(customerResponse.data);
        setValue("formsFee", 500);
        setValue("searchFee", 500);

        await getGroups(navigate)?.then(res=>{
          if(res.data){
            setGroups(res.data);
          }
        })

        const productsResponse = await axios.get(`${APP_URL}/admin/loan-product`);
        setLoanProducts(productsResponse.data);
      } catch (error) {
        handleError(error, navigate);
      }
    };

    fetchData();
  }, [customerId]);

  useEffect(() => {
    const amount = watch("amount");
    if (amount) {
      const words = numberToNairaWords(parseFloat(String(amount)));
      setValue("amountInWords", words);
      setValue("collateralDeposit", Number(amount * 0.1));
    } else {
      setValue("amountInWords", "");
    }
  }, [watch("amount"), setValue]);

  const checkCollateral = () => {
    const amount = watch("amount")
    if (amount) {
      const expectedCd = 0.10 * Number(amount);
      let actualCd
      if (customer?.accounts) {
        actualCd = customer?.accounts.find((account: Account) => account.accountType === 'COLLATERAL_DEPOSIT');
        if (actualCd) {
          const balance = expectedCd - actualCd?.balance;
          if (balance > 0) {
            setError("collateralDeposit", {
              type: "manual",
              message: `Please deposit ₦${balance.toFixed(2)} more as collateral`
            });

          } else {
            setError("collateralDeposit", {
              type: "manual",
              message: `Please deposit ₦${expectedCd.toFixed(2)} as collateral`
            });

          }
        }


      }
    }
  }


  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const selectedProduct = loanProducts?.find(product => product.id === selectedId);
    

    if (selectedProduct) {
      setSelectedLoanProduct(selectedProduct);
      setValue("tenor", selectedProduct.tenor);
      checkCollateral();
    }
  };

  const handleCreateLoan = async (formData: LoanApplication) => {
    setIsLoading(true);
    checkCollateral()
    try {
      const response = await axios.post(
        `${APP_URL}/loan-application`,
        {
          amount: formData.amount,
          amountInWords: formData.amountInWords,
          status: "PENDING",
          tenor: formData.tenor,
          collateralDeposit: formData.collateralDeposit,
          searchFee: formData.searchFee,
          formsFee: formData.formsFee,
          appliedById: user?.id,
          customerId: customerId,
          loanProductId: selectedLoanProduct?.id,
          groupId: formData.groupId ? formData.groupId : "",
        }
      );

      if (response.data) {
        toast.success("Loan application successful");
        navigate(`/customer/${customer?.id}`);
      }
    } catch (error) {
      toast.error("Error submitting application: " + error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="border border-primary rounded-lg m-5 dark:bg-transparent">
      <h3 className="bg-secondary rounded-lg p-5 text-white font-sans text-lg">Loan Application</h3>
      <form onSubmit={handleSubmit(handleCreateLoan)} className="p-6">
        <div className="grid grid-cols-2">
          <div className="col-span-1">
            <p className='text-primary font-bold'>Customer Details</p>
            <p className='text-gray-700'>Customer: {customer?.name}</p>
          </div>
          <div className="col-span-1">
            <p className='text-primary font-bold'>Account Details: </p>
            <ul className='text-gray-700'>
              {customer?.accounts && customer?.accounts.map((account: Account) => (
                <li key={account.id}>{account.accountType.toLocaleLowerCase()} - {account.balance.toFixed(2)}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className='form-group'>
            <label htmlFor="amount" className="form-label">Amount</label>
            <input type="text" className="form-control" {...register("amount")} />
            {errors?.amount && <p className={`text-red-600`}>{errors?.amount?.message}</p>}
          </div>
          <div className='form-group'>
            <label htmlFor="amount-in-words" className='form-label'>Amount in Words</label>
            <textarea {...register("amountInWords")} rows={1} className="form-control" placeholder='Amount in Words' />
            {errors?.amountInWords && <p className={`text-red-600`}>{errors?.amountInWords?.message}</p>}
          </div>
          <div className='form-group'>
            <label htmlFor="name" className="form-label">Loan Product</label>
            <select onChange={handleProductSelect} className="form-control">
              <option value="0">Select Loan Product</option>
              {loanProducts && loanProducts.map((prod: LoanProduct) => (
                <option key={prod.id} value={prod.id}>{prod.name ? capitalizeFirstLetter(prod.name) : ''}</option>
              ))}
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor="cd" className="form-label">Collateral Deposit</label>
            <input {...register("collateralDeposit")} type="text" className="form-control" />
            {errors?.collateralDeposit && <p className={`text-red-600`}>{errors?.collateralDeposit?.message}</p>}
          </div>
          <div className='form-group'>
            <label htmlFor="tenor" className="form-label">Tenor (In Months)</label>
            <input {...register("tenor")} type="text" className="form-control" />
            {errors?.tenor && <p className={`text-red-600`}>{errors?.tenor?.message}</p>}
          </div>
          <div className='form-group'>
            <label htmlFor="form-fee" className="form-label">Form Fee</label>
            <input {...register("formsFee")} type="text" className="form-control" />
            {errors?.formsFee && <p className={`text-red-600`}>{errors?.formsFee?.message}</p>}
          </div>
          <div className='form-group'>
            <label htmlFor="search-fee" className="form-label">Search Fee</label>
            <input {...register("searchFee")} type="text" className="form-control" />
            {errors?.searchFee && <p className={`text-red-600`}>{errors?.searchFee?.message}</p>}
          </div>
          <div className='form-group'>
            <label htmlFor="search-fee" className="form-label">Group</label>
            <select {...register("groupId")} name="" id="" className='form-control'>
              <option value="">Select Group</option>
              {groups.map(group => (
                <option value={group.id}>{group.name}</option>
              ))}
            </select>
            {errors?.groupId && <p className={`text-red-600`}>{String(errors?.groupId?.message)}</p>}
          </div>
        </div>

        <button className='bg-primary-blue text-white-400 w-60 rounded-full text-lg p-2 mt-4 font-bold' >
            {isLoading ? <CircularProgress color="inherit" size={18}/> : 'Create Loan Application'}
        </button>
      </form>
    </div>
  );
}

export default NewLoanApplication;
