import { FormEvent, useState } from 'react';
import Modal from '../../components/Modal';
import axios from 'axios';
import { useAuth } from '../../Context/useAuth';
import { toast } from 'react-toastify';
import {APP_URL} from "../../features/types.tsx";
import { useNavigate } from 'react-router-dom';
import {handleError} from "../../Helpers/ErrorHandler.tsx";

interface LoanApprovalModalProps {
    loanId?: number;
    initialAmount: string;
    initialAmountInWords: string;
    initialTenor: string;
    onApprovalSuccess: () => void;
}

const LoanApprovalModal = ({
                               loanId,
                               initialAmount,
                               initialAmountInWords,
                               initialTenor,
                               onApprovalSuccess
                           }: LoanApprovalModalProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [approvedAmount, setApprovedAmount] = useState(initialAmount);
    const [approvedAmountInWords, setApprovedAmountInWords] = useState(initialAmountInWords);
    const [approvedTenor, setApprovedTenor] = useState(initialTenor);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const navigator = useNavigate();

    const handleApproveLoan = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.put(
                `${APP_URL}/loan-application/approve`,
                {
                    loanId: loanId,
                    userid: user?.id,
                    amountApproved: approvedAmount,
                    amountInWordsApproved: approvedAmountInWords,
                    tenorApproved: approvedTenor
                }
            );

            if(response?.status === 200){
                toast.success("Loan application approval successful");
                onApprovalSuccess();
                setIsModalOpen(false);
            }
        } catch (error) {
            handleError(error, navigator);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button
                className="bg-green-600 text-white shadow-lg rounded-lg px-3 py-1 hover:bg-green-700 transition-colors"
                onClick={() => setIsModalOpen(true)}
            >
                Approve Loan
            </button>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleApproveLoan}
                title="Approve Loan"
                confirmText={isLoading ? "Processing..." : "Approve"}
                confirmColor="bg-green-600 hover:bg-green-700"
                loading={isLoading}
            >
                <div className="space-y-4">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <p className="text-yellow-700 text-sm">
                            NOTE: It is recommended to reduce the amount if you must. If you want a higher amount, kindly reject and request that the amount be increased!
                        </p>
                    </div>

                    <form onSubmit={handleApproveLoan} className="space-y-4">
                        <div>
                            <label htmlFor="approvedAmount" className="block text-sm font-medium text-gray-700">
                                Amount Approved
                            </label>
                            <input
                                id="approvedAmount"
                                value={approvedAmount}
                                onChange={(e) => setApprovedAmount(e.target.value)}
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="approvedAmountInWords" className="block text-sm font-medium text-gray-700">
                                Amount Approved (in words)
                            </label>
                            <textarea
                                id="approvedAmountInWords"
                                value={approvedAmountInWords}
                                onChange={(e) => setApprovedAmountInWords(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                rows={3}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="approvedTenor" className="block text-sm font-medium text-gray-700">
                                Tenor Approved
                            </label>
                            <input
                                id="approvedTenor"
                                value={approvedTenor}
                                onChange={(e) => setApprovedTenor(e.target.value)}
                                type="text"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                required
                            />
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
};

export default LoanApprovalModal;