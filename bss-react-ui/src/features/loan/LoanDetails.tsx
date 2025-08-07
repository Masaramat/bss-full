import {useState, useEffect} from 'react';
import DataTable from 'react-data-table-component';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { LoanApplication, Repayment } from './types';
import { APP_URL, formatCurrency, formatDate } from '../types';
import { handleError } from '../../Helpers/ErrorHandler';
import { useAuth } from '../../Context/useAuth';
import { CircularProgress } from '@mui/material';
import LoanLiquidationModal from "../../components/loan/LoanLiquidationModal";
import LoanDisbursementButton from "../../components/loan/LoanDisbursementButton.tsx";
import LoanApprovalModal from "../../components/loan/LoanApprovalModal.tsx";
import LoanRejectionModal from "../../components/loan/LoanRejectionModal.tsx";

const LoanDetails = () => {
    const [loan, setLoan] = useState<LoanApplication>();
    const [repayments, setRepayments] = useState<Repayment[]>();
    const { id: loanId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const location = useLocation();
    const { message } = location.state || {};
    const { user } = useAuth();



    const handleApprovalSuccess = () => {
        navigate(`/loan/pending`, { state: { message: "Loan application approval successful" } });
    };

    const handleRejectionSuccess = () => {
        navigate(`/loan/pending`, { state: { message: "Loan application rejected successfully" } });
    };

    const handleDisbursementSuccess = () => {
        navigate(`/loan/pending`, { state: { message: "Loan disbursed successfully" } });
    };

    //calculate total amount due
    const calculateTotalDue = (repayments: Repayment[]) => {
        return repayments.reduce((total, repayment) => total + repayment.totalDue, 0);
    };

    //calculate total interest paid
    const calculateTotalInterestPaid = (repayments: Repayment[]) => {
        return repayments.reduce((total, repayment) => total + repayment.totalInterestPaid, 0);

    }

    //calculate total amount paid
    const calculateTotalPaid = (repayments: Repayment[]) => {
        return repayments.reduce((total, repayment) => total + repayment.totalPaid, 0);
    }

    // Define columns for the data table
    const columns = [
        {
            name: 'S/No',
            selector: (row: Repayment) => row.id,
            sortable: true,
            width: '80px'
        },
        {
            name: 'Total Amount',
            selector: (row: Repayment) => formatCurrency(row.total),
            sortable: true,
        },
        {
            name: 'Total Due',
            selector: (row: Repayment) => formatCurrency(row.totalDue),
            sortable: true,
        },

        {
            name: 'Interest Paid',
            selector: (row: Repayment) => formatCurrency(row.totalInterestPaid),
            sortable: true,
        },

        {
            name: 'Total Paid',
            selector: (row: Repayment) => formatCurrency(row.totalPaid),
            sortable: true,
        },
        {
            name: 'Status',
            cell: (row: Repayment) => (
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(row.status)}`}>
                    {row.status}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Due Date',
            selector: (row: Repayment) => formatDate(String(row.maturityDate)),
            sortable: true,
        },
    ];

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

    const getStatusColor = (status?: string) => {
        switch(status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'APPROVED': return 'bg-blue-100 text-blue-800';
            case 'DISBURSED': return 'bg-purple-100 text-purple-800';
            case 'ACTIVE': return 'bg-green-100 text-green-800';
            case 'PAID_OFF': return 'bg-gray-100 text-gray-800';
            case 'DEFAULT': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {message && (
                <div className="mb-4 p-3 bg-green-50 text-green-700 rounded border border-green-200">
                    {message}
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-gray-800 p-4 text-white">
                    <h2 className="text-xl font-semibold">Loan Details</h2>
                </div>

                <div className="p-4">
                    {loan && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Loan Information Card */}
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                <div className="flex items-center mb-4">
                                    <div className="p-2 rounded-full bg-blue-50 mr-3">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">Loan Information</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Customer:</span>
                                        <span className="font-medium text-gray-800">{loan.customer?.name}</span>
                                    </div>

                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Amount:</span>
                                        <span className="font-medium text-gray-800">{formatCurrency(loan.amount)}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Tenor:</span>
                                        <span className="font-medium text-gray-800">{loan.tenor} months</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600">Status:</span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(loan.status)}`}>
            {loan.status}
          </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information Card */}
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                <div className="flex items-center mb-4">
                                    <div className="p-2 rounded-full bg-green-50 mr-3">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">Payment Information</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Loan Balance:</span>
                                        <span className="font-medium text-red-600">
            {repayments && formatCurrency(calculateTotalDue(repayments))}
          </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-100">
                                        <span className="text-gray-600">Total Paid:</span>
                                        <span className="font-medium text-green-600">
            {repayments && formatCurrency(calculateTotalPaid(repayments))}
          </span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600">Interest Paid:</span>
                                        <span className="font-medium text-purple-600">
            {repayments && formatCurrency(calculateTotalInterestPaid(repayments))}
          </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Card */}
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                <div className="flex items-center mb-4">
                                    <div className="p-2 rounded-full bg-indigo-50 mr-3">
                                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">Actions</h3>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {loan.status === "PENDING" && user?.role === 'ADMIN' && (
                                        <LoanApprovalModal
                                            loanId={loan?.id}
                                            initialAmount={String(loan.amount)}
                                            initialAmountInWords={loan.amountInWords}
                                            initialTenor={String(loan.tenor)}
                                            onApprovalSuccess={handleApprovalSuccess}
                                        />
                                    )}

                                    {(loan?.status === "APPROVED" || loan?.status === "PENDING") && user?.role === 'ADMIN' && (
                                        <LoanRejectionModal loanId={Number(loan?.id)} onRejectionSuccess={handleRejectionSuccess} />
                                    )}

                                    {(loan?.status === "APPROVED") && user?.role === 'ADMIN' && (
                                        <LoanDisbursementButton
                                            loanId={loan?.id}
                                            onDisbursementSuccess={handleDisbursementSuccess}
                                        />
                                    )}

                                    {(loan.status === "ACTIVE" || loan.status === "DUE") && user?.role === 'ADMIN' && (
                                        <LoanLiquidationModal loan={loan} repayments={repayments || []} />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {(loan?.status === "ACTIVE" || loan?.status === "PAID_OFF" || loan?.status === "DUE") && (
                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Repayments</h3>
                            <div className="border rounded-lg overflow-hidden">
                                <DataTable
                                    columns={columns}
                                    data={repayments || []}
                                    pagination
                                    highlightOnHover
                                    responsive
                                    noDataComponent={
                                        <div className="p-4 text-center text-gray-500">
                                            No repayment records available
                                        </div>
                                    }
                                    customStyles={{
                                        headCells: {
                                            style: {
                                                backgroundColor: '#f9fafb',
                                                fontWeight: '600',
                                            },
                                        },
                                        cells: {
                                            style: {
                                                padding: '0.75rem',
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoanDetails;