import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getLoanProduct } from './loanProductApi';
import { LoanProduct } from '../../../Models/LoanProduct';




const LoanProductDetails = () => {
  const { id: loanProductId } = useParams<{ id: string }>();; 
  const [loanProduct, setLoanProduct] = useState<LoanProduct>()
  const navigate = useNavigate();

  useEffect(() => {
    if(loanProductId){
      const fetchData = async () => {
     
        await getLoanProduct(Number(loanProductId), navigate)?.then(res => {
          if(res.data){
            setLoanProduct(res.data);
          }
        })
         
       
      };
      fetchData();

    }
    

   
  }, [loanProductId]);

  let content = <div></div>;

  content = (
    <div className='m-5 rounded-lg border h-fit border-primary'>
      <div className='grid grid-cols-2 bg-secondary p-3 text-white'>
        <div className='col-span-1 text-lg mt-1'><h3>{loanProduct?.name + " Details"}</h3></div>
        <div className='flex justify-end items-end col-span-1'>
        </div>
      </div>
      <div className='p-3'>
       
        {loanProduct && (<>
          <div className="grid grid-cols-2 max-md:grid-cols-1">
            <div className="p-5 font-bold col-span-1">
              <p className="p-2"><span className="text-lg font-bold text-primary">Name:</span> {loanProduct.name}</p>
              <p className="p-2"><span className="text-lg font-bold text-primary">Interest Rate:</span> {loanProduct?.interestRate+"%"}</p>
              <p className="p-2"><span className="text-lg font-bold text-primary">Monitoring Fee Rate:</span> {loanProduct?.monitoringFeeRate+"%"}</p>
              <p className="p-2"><span className="text-lg font-bold text-primary">Processing Fee Rate:</span> {loanProduct?.processingFeeRate+"%"}</p>
              <p className="p-2"><span className="text-lg font-bold text-primary">Tenor:</span> {loanProduct?.tenor+" months"}</p>
            </div>            
          </div>
        </>)}

        <div className="flex p-2 space-x-2 max-sm:flex-col max-sm:space-x-0 max-sm:space-y-3">
        <Link to={`/loan-product/edit/${loanProduct?.id}`} className="bg-secondary px-6 pt-2 ml-4 text-center rounded-lg h-9 text-white" >
            Edit Loan Product
        </Link> 
        
      </div>
        
      </div>

      

      
    </div>
  );

  return content;
};

export default LoanProductDetails;
