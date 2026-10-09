import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { APP_URL, formatCurrency, formatDate } from "../features/types.tsx";
import Modal from "./Modal.tsx";
import { Transaction } from "../features/customer/types.tsx";

const AccountStatementModal = ({ account }: { account: any }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Prefill last 1 month on load
    useEffect(() => {
        const today = new Date();
        const lastMonth = new Date();
        lastMonth.setMonth(today.getMonth() - 1);

        setStartDate(lastMonth.toISOString().slice(0, 10));
        setEndDate(today.toISOString().slice(0, 10));

        fetchStatement(lastMonth.toISOString().slice(0, 10), today.toISOString().slice(0, 10));
    }, []);

    const fetchStatement = async (from?: string, to?: string) => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${APP_URL}/transaction/statement`, {
                params: {
                    accountNumber: account.id,
                    startDate: from || startDate,
                    endDate: to || endDate,
                },
            });
            setTransactions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // Memoized totals
    const totals = useMemo(() => {
        let totalDr = 0;
        let totalCr = 0;
        let endingBalance = 0;

        transactions.forEach((trx) => {
            if (trx.amount < 0) totalDr += Math.abs(trx.amount);
            else totalCr += trx.amount;

            endingBalance = trx.balance;
        });

        return { totalDr, totalCr, endingBalance };
    }, [transactions]);

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(transactions);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Statement");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "account-statement.xlsx");
    };

    const exportToPDF = async () => {
        const element = document.getElementById("statement-table");
        if (!element) return;

        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = 190;
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
        pdf.save("statement.pdf");
    };

    const handlePrint = () => {
        const printContent = document.getElementById("statement-table");
        if (!printContent) return;
        const newWin = window.open("");
        newWin?.document.write(printContent.outerHTML);
        newWin?.print();
        newWin?.close();
    };

    return (
        <>
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors"
                onClick={() => setIsModalOpen(true)}
            >
                View Statement
            </button>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Account Statement"
                width="w-[80%]"
                showConfirm={false}
                closeText="Close"
                loading={isLoading}
            >
                <div className="space-y-4">
                    {/* Filters */}
                    <div className="flex gap-3 mb-4">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border rounded px-2 py-1"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border rounded px-2 py-1"
                        />
                        <button
                            onClick={() => fetchStatement()}
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                        >
                            Fetch
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mb-4">
                        <button
                            onClick={exportToExcel}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                        >
                            Export Excel
                        </button>
                        <button
                            onClick={exportToPDF}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                        >
                            Export PDF
                        </button>
                        <button
                            onClick={handlePrint}
                            className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
                        >
                            Print
                        </button>
                    </div>

                    {/* Statement Table */}
                    <div
                        id="statement-table"
                        className="overflow-auto max-h-[400px] border rounded shadow"
                    >
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100 sticky top-0">
                            <tr className="text-center">
                                <th className="px-2 py-2">Trx No</th>
                                <th className="px-2 py-2">Date</th>
                                <th className="px-2 py-2">Dr</th>
                                <th className="px-2 py-2">Cr</th>
                                <th className="px-2 py-2">Balance</th>
                                <th className="px-2 py-2">User</th>
                            </tr>
                            </thead>
                            {transactions.length <= 0 ? (<p className={"text-center"}>No Transactions for the selected period</p>): (
                                <>
                                    {transactions.map((trx, i) => (
                                        <>
                                            <tbody>
                                            <tr key={i} className="text-center border-t hover:bg-gray-50">
                                                <td className="px-2 py-1">{trx.trxNo}</td>
                                                <td className="px-2 py-1">{formatDate(String(trx.trxDate))}</td>
                                                <td className={`px-2 py-1 ${trx.amount < 0 ? "text-red-600 font-semibold" : ""}`}>
                                                    {trx.amount < 0 ? Math.abs(trx.amount) : "0.00"}
                                                </td>
                                                <td className={`px-2 py-1 ${trx.amount > 0 ? "text-green-600 font-semibold" : ""}`}>
                                                    {trx.amount > 0 ? trx.amount : "0.00"}
                                                </td>
                                                <td className="px-2 py-1">{formatCurrency(trx.balance)}</td>
                                                <td className="px-2 py-1">{trx.user?.username || "SYSTEM"}</td>
                                            </tr>
                                            </tbody>

                                        </>

                                    ))}

                                </>
                            )}

                            <tfoot className="bg-gray-200 sticky bottom-0">
                            <tr className="text-center font-bold">
                                <td className="px-2 py-2">Totals</td>
                                <td></td>
                                <td className="px-2 py-2">{formatCurrency(totals.totalDr)}</td>
                                <td className="px-2 py-2">{formatCurrency(totals.totalCr)}</td>
                                <td className="px-2 py-2">{formatCurrency(totals.endingBalance)}</td>
                                <td></td>
                            </tr>
                            </tfoot>

                        </table>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default AccountStatementModal;