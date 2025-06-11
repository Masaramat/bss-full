import { useState, useEffect, FormEvent } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import $ from 'jquery';
import 'datatables.net';
import { LoanApplication, Repayment } from './types';
import Modal from '../../components/Modal';
import { APP_URL, formatCurrency, formatDate, maskAccountNumber } from '../types';
import { handleError } from '../../Helpers/ErrorHandler';
import { useAuth } from '../../Context/useAuth';
import { sendSms } from '../homeApi';
import { CircularProgress } from '@mui/material';
import {toast} from "react-toastify";

const LoanDetails = () => {
    const [loan, setLoan] = useState<LoanApplication>();
    const [repayments, setRepayments] = useState<Repayment[]>();
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [approvedAmount, setApprovedAmount] = useState("");
    const [approvedAmountInWords, setApprovedAmountInWords] = useState("");
    const [approvedTenor, setApprovedTenor] = useState("");
    const { id: loanId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [processing, setProcessing] = useState(false);

    const location = useLocation();
    const { message } = location.state || {};
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${APP_URL}/loan-application/${loanId}`);
                setLoan(response?.data);
                
                const repaymentsResponse = await axios.get(`${APP_URL}/loan-application/repayments/${loanId}`);
                setRepayments(repaymentsResponse.data);

                setIsLoading(false);
            } catch (error) {
                handleError(error, navigate);
            }
        };

        fetchData();
    }, [loanId, navigate]);

    useEffect(() => {
        if (loan && repayments) {    
            $(function ($){
                if (!$.fn.dataTable.isDataTable('#repayments-table')) {
                  $('#repayments-table').DataTable({      
                    
                  });
                }
              });      

            // Initialize the state variables with the loan details
            setApprovedAmount(String(loan.amount));
            setApprovedAmountInWords(loan.amountInWords);
            setApprovedTenor(String(loan.tenor));
        }
    }, [loan, repayments]);

    const handleApproveLoan = async (e: FormEvent) => {
        e.preventDefault();

        await axios.put(
            `${APP_URL}/loan-application/approve`, 
            {
                loanId: loan?.id || undefined,
                userid: user?.id,
                amountApproved: approvedAmount,
                amountInWordsApproved: approvedAmountInWords,
                tenorApproved: approvedTenor

            }
        ).then(response => {
            if(response?.status === 200){
                setIsApproveModalOpen(false);
                setLoan(response?.data);
                const message = "Loan application approval successful";
                navigate(`/loan/pending`, { state: { message } });
            }
        })
       
        
    };

    const handleRejectLoan = (e: FormEvent) => {
        e.preventDefault();
        // Handle loan rejection logic
        console.log("Loan rejected");
        setIsRejectModalOpen(false);
    };

    const handleDisburseLoan = async () => {
        setProcessing(true);
        await axios.put(
            `${APP_URL}/loan-application/disburse`,
            {
                loanId: loan?.id,
                userId: user?.id
            }
        ).then(response => {
            if(response?.status === 200){
        
                if(loan?.customer.accounts){
                    // Get the current date and time and format it
                    const currentDate = new Date();
                    const formattedDate = currentDate.toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false // For 24-hour format
                    });
                    const account = loan?.customer.accounts.find(account => account.accountType === "SAVINGS");
                    let balance = 0;
                    if(account){
                        balance = account.balance;
                    }
                    const maskedAccountNo = maskAccountNumber(String(account?.accountNumber));
                    const message_text =  `Credit: \n Your account: ${maskedAccountNo} has been credited with ${formatCurrency(loan.amountApproved)} Trx Type:Loan Disbursement \n Balance: ${formatCurrency(balance + loan.amountApproved)} DT:${formattedDate}`;
                    sendSms(message_text, loan.customer?.phoneNumber)
                }
                setProcessing(false);
                toast.success("loan Disbursed Successfully!")
                navigate(`/loan/pending`, { state: { message } });

            }
        })

    }

    return isLoading ? 
    (
      <>
      <div className='flex items-center justify-center'>
      <CircularProgress />
      </div>
      
      
      </>
    )
     : 
    (<>
    <div className='m-5 rounded-lg border h-fit border-primary'>
            <div className='grid grid-cols-2 bg-secondary p-3 text-white'>
                <div className='col-span-1 text-lg mt-1'><h3>Loan Details</h3></div>
            </div>
            <div className='p-3'>
                {message && <p className='text-success text-center font-bold'>{message}</p>}
                {loan && (
                    <>
                        <div className="grid grid-cols-2 max-md:grid-cols-1">
                            <div className="p-5 font-bold col-span-1">
                                <p className="p-2"><span className="text-lg font-bold text-primary">Amount:</span> {formatCurrency(loan.amount)}</p>
                                <p className="p-2"><span className="text-lg font-bold text-primary">Tenor:</span> {loan.tenor} months</p>

                                {loan.status === "PENDING" && user?.role === 'ADMIN' && (
                                    <div className="flex p-2 space-x-2 max-sm:flex-col max-sm:space-x-0 max-sm:space-y-3">
                                        <button className="bg-secondary px-6 rounded-lg h-9 text-white"
                                            onClick={() => setIsApproveModalOpen(true)}>
                                            Approve Loan
                                        </button>
                                        <button className="bg-red-600 px-6 rounded-lg h-9 text-white"
                                            onClick={() => setIsRejectModalOpen(true)}>
                                            Reject Loan
                                        </button>
                                    </div>
                                )}

                                {loan.status === "APPROVED" && user?.role === 'ADMIN' && (
                                    <div className="flex p-2 space-x-2 max-sm:flex-col max-sm:space-x-0 max-sm:space-y-3">
                                        <button className="bg-secondary px-6 rounded-lg h-9 text-white w-80" onClick={handleDisburseLoan}>
                                            {processing ? <CircularProgress size={18}/> : "Disburse Loan"}
                                        </button>
                                        <button className="bg-red-600 px-6 rounded-lg h-9 text-white"
                                            onClick={() => setIsRejectModalOpen(true)}>
                                            Reject Loan
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
                {(loan?.status === "ACTIVE" || loan?.status === "PAID_OFF") && (
                    <div>
                        <h3>Repayments</h3>
                        <table className='table-auto' id="repayments-table">
                            <thead className='table-header-group'>
                                <tr>
                                    <th className='w-2'>ID</th>
                                    <th>Total Amount</th>
                                    <th>Status</th>
                                    <th>Maturity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {repayments && repayments.map((repayment: Repayment, index) => (
                                    <tr key={repayment.id} className="table-row">
                                        <td className='w-2'>{index + 1}</td>
                                        <td>{formatCurrency(repayment.total)}</td>
                                        <td>{repayment.status}</td>
                                        <td>{formatDate(String(repayment.maturityDate))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <Modal
                isOpen={isApproveModalOpen}
                onClose={() => setIsApproveModalOpen(false)}
                onConfirm={handleApproveLoan}
                title="Approve Loan"
            >
                <p className="text-red-400 text-sm">NOTE: It is recommended to reduce the amount if you must. if you want a higher amount kindly reject and request that the amount be increased!</p>
                <form onSubmit={handleApproveLoan}>
                    <div className="form-group">
                        <label htmlFor="approvedAmount">Amount Approved</label>
                        <input
                            id="approvedAmount"
                            value={approvedAmount}
                            onChange={(e) => setApprovedAmount(e.target.value)}
                            type="text"
                            className='form-control'
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="approvedAmountInWords">Amount Approved (in words)</label>
                        <textarea
                            id="approvedAmountInWords"
                            value={approvedAmountInWords}
                            onChange={(e) => setApprovedAmountInWords(e.target.value)}
                            className='form-control'
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label htmlFor="approvedTenor">Tenor Approved</label>
                        <input
                            id="approvedTenor"
                            value={approvedTenor}
                            onChange={(e) => setApprovedTenor(e.target.value)}
                            type="text"
                            className='form-control'
                        />
                    </div>
                </form>
            </Modal>
            <Modal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                onConfirm={handleRejectLoan}
                title="Reject Loan"
            >
                <p>Are you sure you want to reject this loan?</p>
            </Modal>
        </div>
    </>) 
    
};

export default LoanDetails;
