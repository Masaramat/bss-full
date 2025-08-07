import { FormEvent, useState } from 'react';
import Modal from '../../components/Modal';
import axios from 'axios';
import { useAuth } from '../../Context/useAuth';
import { toast } from 'react-toastify';
import {APP_URL} from "../../features/types.tsx";
import {useNavigate} from "react-router-dom";
import {handleError} from "../../Helpers/ErrorHandler.tsx";

interface LoanRejectionModalProps {
    loanId?: number;
    onRejectionSuccess: () => void;
}

const LoanRejectionModal = ({
                                loanId,
                                onRejectionSuccess
                            }: LoanRejectionModalProps) => {
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectionType, setRejectionType] = useState(''); // Optional: if you want to categorize rejections
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const navigator = useNavigate();

    const handleRejectLoan = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Replace with your actual API call
            await axios.post(`${APP_URL}/rejection`, {
                loanId,
                userId: user?.id,
                reason: rejectionReason,
                type: rejectionType
            });

            toast.success("Loan application rejected successfully");
            onRejectionSuccess();
            setIsModalOpen(false);
        } catch (error) {
            handleError(error, navigator);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                className="bg-red-600 px-4 py-1 rounded-lg text-white hover:bg-red-700 transition-colors"
                onClick={() => setIsModalOpen(true)}
            >
                Reject Loan
            </button>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleRejectLoan}
                title="Reject Loan"
                confirmText={isLoading ? "Processing..." : "Confirm Rejection"}
                confirmColor="bg-red-600 hover:bg-red-700"
                loading={isLoading}
            >
                <div className="space-y-4">
                    <p className="text-gray-700">Are you sure you want to reject this loan?</p>
                    <div>
                        <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700">
                            Reason for Rejection (Optional)
                        </label>
                        <select
                        onChange={e => setRejectionType(e.target.value)}
                        >
                            <option value="">Select Rejection Type</option>
                            <option value="TEMPORARY">Temporary</option>
                            <option value="PERMANENT">Permanent</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700">
                            Reason for Rejection (Optional)
                        </label>
                        <textarea
                            id="rejectionReason"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            rows={3}
                            placeholder="Provide reason for rejection..."
                        />
                    </div>
                </div>
            </Modal>
        </>

    );
};

export default LoanRejectionModal;