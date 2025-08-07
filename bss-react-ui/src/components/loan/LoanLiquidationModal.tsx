import {LoanApplication, Repayment} from "../../features/loan/types.tsx";
import Modal from "../Modal.tsx";
import {useState, useEffect, useMemo} from "react";
import * as Yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {formatDate, formatCurrency, APP_URL} from "../../features/types.tsx";
import axios from "axios";
import {toast} from "react-toastify";

const validation = Yup.object({
    monthsCharged: Yup.number()
        .min(0, "Must be at least 0")
        .required("Months charged is required"),
    interestCharged: Yup.number().default(0),
    liquidationReason: Yup.string().required("Liquidation reason is required"),
});

const LoanLiquidationModal = (
    {loan, repayments} : {loan: LoanApplication, repayments: Repayment[]}
) => {
    const {register, handleSubmit, formState: {errors}, watch, setValue, reset} = useForm({
        resolver: yupResolver(validation),
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Calculate values once
    const { totalAmountToLiquidate, totalInterestPaid, interestAmount} = useMemo(() => {
        const totalAmountToLiquidate = repayments.reduce((total, repayment) => {
            return total + (repayment.totalDue || 0);
        }, 0);

        const totalInterestPaid = repayments.reduce((total, repayment) => {
            return total + (repayment.totalInterestPaid || 0);
        }, 0);

        const firstRepayment = repayments[0] || {};
        const interestAmount = (firstRepayment.interest || 0) +
            (firstRepayment.monitoringFee || 0) +
            (firstRepayment.processingFee || 0);

        return { totalAmountToLiquidate, totalInterestPaid, interestAmount };
    }, [repayments]);
    
    const monthsCharged = watch("monthsCharged");
    useEffect(() => {
        if (monthsCharged > 0) {
            const calculatedInterest = interestAmount * monthsCharged;
            setValue("interestCharged", calculatedInterest);
        } else {
            setValue("interestCharged", 0);
        }
    }, [monthsCharged, interestAmount, setValue]);
    console.log(errors)
    const handleLiquidateLoan = async (data: any) => {

        setIsLoading(true);
        try {
            const response = await axios.post(
                `${APP_URL}/admin/loan-liquidation`,
                {
                    loanApplicationId: loan.id,
                    liquidationReason: data.liquidationReason,
                    interestCharged: data.interestCharged,
                    amount: 0.00
                },
            );

            if (response.data) {
                toast.success("Loan liquidation successful");
                setIsModalOpen(false);
                reset();

            }
        } catch (error) {
            console.error("Liquidation failed:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <button
                className="bg-primary text-white shadow-lg rounded-lg px-3 py-1 hover:bg-primary-dark transition-colors"
                onClick={() => setIsModalOpen(true)}
            >
                Liquidate Loan
            </button>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleSubmit(handleLiquidateLoan)}
                title="Loan Liquidation"
                confirmText={isLoading ? "Processing..." : "Confirm Liquidation"}
                confirmColor="bg-green-600 hover:bg-green-700"
                loading={isLoading}
            >
                <div className="space-y-4">
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                        <p className="flex justify-between">
                            <span className="font-medium">Total Amount Due:</span>
                            <span>{formatCurrency(totalAmountToLiquidate)}</span>
                        </p>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                        <p className="flex justify-between">
                            <span className="font-medium">Total Interest Paid:</span>
                            <span>{formatCurrency(totalInterestPaid)}</span>
                        </p>
                    </div>

                    <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
                        <p className="flex justify-between">
                            <span className="font-medium">Monthly Interest:</span>
                            <span>{formatCurrency(interestAmount)}</span>
                        </p>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                        <p className="flex justify-between">
                            <span className="font-medium">Loan Maturity:</span>
                            <span>{loan?.maturity ? formatDate(String(loan.maturity)) : "N/A"}</span>
                        </p>
                    </div>

                    <form className="space-y-4">
                        <div className="form-group">
                            <label htmlFor="monthsCharged" className="block text-sm font-medium text-gray-700 mb-1">
                                Number of Months Interest Charged
                            </label>
                            <select
                                id="monthsCharged"
                                className={`form-control ${errors.monthsCharged ? 'border-red-500' : ''}`}
                                {...register("monthsCharged")}
                            >
                                <option value={0}>Select months</option>
                                {Array.from({length: Math.min(12, 12)}, (_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>
                            {errors.monthsCharged && (
                                <p className="mt-1 text-sm text-red-600">{errors.monthsCharged.message}</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="interestCharged" className="block text-sm font-medium text-gray-700 mb-1">
                                Interest to Charge
                            </label>
                            <input
                                id="interestCharged"
                                type="number"
                                className="form-control"
                                readOnly
                                {...register("interestCharged")}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="liquidationReason" className="block text-sm font-medium text-gray-700 mb-1">
                                Reason for Liquidation
                            </label>
                            <textarea
                                id="liquidationReason"
                                className="form-control"
                                {...register("liquidationReason")}
                            ></textarea>
                            {errors.liquidationReason && (
                                <p className="mt-1 text-sm text-red-600">{errors.liquidationReason.message}</p>
                            )}
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    )
}

export default LoanLiquidationModal;