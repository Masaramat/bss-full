import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../../Context/useAuth';
import {APP_URL} from "../../features/types.tsx";
import {useNavigate} from "react-router-dom";
import { handleError } from '../../Helpers/ErrorHandler.tsx';

interface LoanDisbursementButtonProps {
    loanId?: number;
    onDisbursementSuccess: () => void;
}

const LoanDisbursementButton = ({
                                    loanId,
                                    onDisbursementSuccess
                                }: LoanDisbursementButtonProps) => {
    const [processing, setProcessing] = useState(false);
    const { user } = useAuth();
    const navigator = useNavigate();

    const handleDisburseLoan = async () => {
        setProcessing(true);
        try {
            const response = await axios.put(
                `${APP_URL}/loan-application/disburse`,
                {
                    loanId,
                    userId: user?.id
                }
            );

            if(response?.status === 200){
                toast.success("Loan disbursed successfully!");
                onDisbursementSuccess();
            }
        } catch (error) {
            handleError(error, navigator);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <button
            className="bg-blue-600 px-6 py-2 rounded-lg text-white hover:bg-blue-700 transition-colors"
            onClick={handleDisburseLoan}
            disabled={processing}
        >
            {processing ? (
                <span className="flex items-center gap-2">
                    <CircularProgress size={18} color="inherit" />
                    Processing...
                </span>
            ) : "Disburse Loan"}
        </button>
    );
};

export default LoanDisbursementButton;