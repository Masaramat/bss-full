import axios from 'axios';
import {useEffect, useState} from 'react';
import {Account, capitalizeFirstLetter, Customer, CustomerType} from './types';
import {Link, useNavigate, useParams} from 'react-router-dom';
import $ from 'jquery';
import 'datatables.net';
import {APP_URL, formatCurrency, maskAccountNumber} from '../types';
import Modal from '../../components/Modal';
import * as Yup from 'yup';
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from 'react-hook-form';
import {getCustomerAccounts, makeTransaction} from './api';
import {toast} from 'react-toastify';
import {useAuth} from '../../Context/useAuth';
import {Avatar, CircularProgress} from '@mui/material';
import {deepPurple} from '@mui/material/colors';

type TransactionFormInputs = {
  amount: number;
  accountId: number;
  noOfDays?: number;
  description: string;
  commissionAmount?: number;
};

const validation = Yup.object().shape({
  amount: Yup.number()
      .required("Amount is required")
      .min(1, "Amount must be greater than 0"),
  accountId: Yup.number().required("Account is required"),
  noOfDays: Yup.mixed(),
  commissionAmount: Yup.mixed(),
  description: Yup.string()
      .required("Description is required")
      .max(100, "Description too long"),
});

const CustomerDetail = () => {
  const [customer, setCustomer] = useState<Customer>();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [message, setMessage] = useState("");
  const { id: customerId } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionProcessing, setTransactionProcessing] = useState(false);
  const [trxType, setTrxType] = useState<string | null>(null);
  const navigate = useNavigate();
  const {user} = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showNumberOfDays, setShowNumberOfDays] = useState<boolean>(false);
  const [showCommissionField, setShowCommissionField] = useState<boolean>(false);
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<TransactionFormInputs>({
    resolver: yupResolver(validation)
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (customerId) {
          const accountsResponse = await getCustomerAccounts(Number(customerId), navigate);
          setAccounts(accountsResponse?.data || []);
          const customerResponse = await axios.get(`${APP_URL}/customer/${customerId}`);
          setCustomer(customerResponse?.data);
        }
      } catch (error) {
        setMessage("Error fetching data: " + error);
        toast.error("Failed to load customer data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [customerId, navigate]);

  const accountId = watch("accountId");

  useEffect(() => {

    const selectedAccount = accounts.find((account) => account.id === Number(accountId));

    console.log(accountId);
    console.log(selectedAccount);
    console.log(trxType);
    // Reset both flags first
    setShowCommissionField(false);
    setShowNumberOfDays(false);

    if (selectedAccount?.accountType === "ADASHE") {
      if (trxType === "debit") {
        setShowCommissionField(true);
      } else if (trxType === "credit") {
        setShowNumberOfDays(true);
      }
    }
  }, [accountId, accounts, trxType]);

  useEffect(() => {
    if (accounts.length > 0) {
      $(function ($) {
        if (!$.fn.dataTable.isDataTable('#accounts-table')) {
          $('#accounts-table').DataTable({
            language: {
              search: "_INPUT_",
              searchPlaceholder: "Search accounts...",
            },
            columnDefs: [
              { targets: [0, 6], width: "10%" },
              { targets: [1, 2, 3, 4, 5], width: "18%" }
            ]
          });
        }
      });
    }
  }, [accounts]);

  const handleTransaction = async (form: TransactionFormInputs) => {
    if (!trxType || !user) return;
    setTransactionProcessing(true)
    const account = accounts.find(account => account.id === form.accountId)

    if(account?.accountType === "LOAN"){
      setTransactionProcessing(false)
      toast.error("You cannot deposit to a loan account");
      reset();
      setIsModalOpen(false);
      return;
    }

    try {
      const res = await makeTransaction(
          form.amount,
          form.accountId,
          trxType,
          form.description,
          user.id,
          Number(form.noOfDays),
          Number(form.commissionAmount),
          navigate
      );

      if (res?.data) {
        const account = accounts.find(account => account.id === form.accountId);
        const maskedAccountNo = maskAccountNumber(String(account?.accountNumber));

        if (form && customer && account) {
          const currentDate = new Date();
          const formattedDate = currentDate.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          });

          const newBalance = account.balance + (trxType === 'credit' ? form.amount : -form.amount);
          const message = `${trxType === 'credit' ? 'Credit:' : 'Debit'} \nYour account: ${maskedAccountNo} has been ${trxType === 'credit' ? 'credited' : 'debited'} with ${formatCurrency(form.amount)} \nTrx Type: ${trxType === 'credit' ? 'CASH DEPOSIT' : 'WITHDRAWAL'} \nBalance: ${formatCurrency(newBalance)} \nDT: ${formattedDate}`;

          console.log(message);
          // await sendSms(message, customer.phoneNumber);
        }

        toast.success(trxType === 'credit' ? "Deposit successful" : "Withdrawal successful");
        reset()
        setTransactionProcessing(false)
        window.location.reload();
      }
    } catch (error) {
      setTransactionProcessing(false)
      toast.error("Transaction failed: " + error);
    }
  };

  const getRandomColor = () => {
    const colors = [
      deepPurple[500],
      '#1976d2', // blue
      '#388e3c', // green
      '#f57c00', // orange
      '#d32f2f', // red
      '#7b1fa2', // purple
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getInitials = (name: string) => {
    if (!name) return "";

    // Split name into parts and filter out empty strings
    const nameParts = name.split(' ').filter(part => part.length > 0);

    // Get first two initials if available
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
    }

    // Fallback to first initial only
    return nameParts[0].charAt(0).toUpperCase();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  }

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-[300px]">
          <CircularProgress size={24} />
        </div>
    );
  }

  if (!customer) {
    return (
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-700">Customer not found</h2>
          <p className="mt-4 text-gray-600">The requested customer could not be loaded</p>
        </div>
    );
  }

  return (
      <div className="container mx-auto px-4 py-6">
        {/* Customer Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">

            {/* Customer Details */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="bg-secondary px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        fontSize: '1.25rem',
                        bgcolor: getRandomColor(),
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        border: '2px solid white'
                      }}
                  >
                    {getInitials(customer.name)}
                  </Avatar>
                  <h1 className="text-2xl font-bold text-white">{customer.name}</h1>
                </div>
                <Link
                    to={`/customer/edit/${customer.id}`}
                    className="bg-white text-blue-700 px-4 py-2 rounded-md font-medium hover:bg-blue-50 transition-colors"
                >
                  Edit Customer
                </Link>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Customer Details */}
                <div className="space-y-4 col-span-2">

                    <div className="flex items-center">
                      <span className="w-32 font-medium text-gray-600">BVN:</span>
                      <span className="font-semibold">{customer.bvn}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32 font-medium text-gray-600">Customer Type:</span>
                      <span className="font-semibold text-blue-600">
                          {customer.customerType === CustomerType.SAVINGS ? "Loan" : capitalizeFirstLetter(String(customer?.customerType).toLowerCase())}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32 font-medium text-gray-600">Phone:</span>
                      <span className="font-semibold">+{customer.phoneNumber}</span>
                    </div>

                </div>

                {/* Action Buttons */}
                <div className="space-y-3 col-span-1">
                  <Link
                      to={`/loan/new/${customerId}`}
                      className="block w-full bg-green-700 hover:bg-green-800 text-white text-center py-2 px-4 rounded-md transition-colors"
                  >
                    Create Loan Application
                  </Link>
                  <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setTrxType('credit');
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Make Savings Deposit
                  </button>
                  <button
                      onClick={() => {
                        setIsModalOpen(true);
                        setTrxType('debit');
                      }}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
                  >
                    Savings Withdrawal
                  </button>
                </div>
              </div>
            </div>


            {/* Accounts Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-gray-100 px-6 py-3 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Accounts</h2>
              </div>

              <div className="p-4">
                {message && (
                    <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
                      {message}
                    </div>
                )}

                <div className="overflow-x-auto">
                  <table id="accounts-table" className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account
                        Number
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan
                        Cycle
                      </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {accounts.map((account, index) => (
                        <tr key={account.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{account.name}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{account.accountNumber}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{account.accountType}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {formatCurrency(account.balance)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                          account.accountStatus === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                      }`}>
                        {account.accountStatus}
                      </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {account.loanCycle || 0}
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Transaction Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => closeModal()}
                onConfirm={handleSubmit(handleTransaction)}
                title={trxType === 'credit' ? "Savings Deposit" : "Savings Withdrawal"}
                confirmText={trxType === 'credit' ? "Deposit" : "Withdraw"}
                confirmColor={trxType === 'credit' ? "bg-blue-600" : "bg-red-600"}
                loading={transactionProcessing}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="amount">
                    Amount
                  </label>
                  <input
                      className={`w-full px-3 py-2 border rounded-md ${
                          errors.amount ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      type="number"
                      step="0.01"
                      {...register("amount")}
                  />
                  {errors.amount && (
                      <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="accountId">
                    Account
                  </label>
                  <select
                      className={`w-full px-3 py-2 border rounded-md ${
                          errors.accountId ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      {...register("accountId")}
                  >
                    <option value="">Select an account</option>
                    {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name} - {maskAccountNumber(String(account.accountNumber))}
                        </option>
                    ))}
                  </select>
                  {errors.accountId && (
                      <p className="mt-1 text-sm text-red-600">{errors.accountId.message}</p>
                  )}
                </div>

                {showNumberOfDays && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="amount">
                        Number of Days
                      </label>
                      <input
                          className={`w-full px-3 py-2 border rounded-md ${
                              errors.noOfDays ? 'border-red-500' : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          type="number"
                          {...register("noOfDays")}
                      />
                      {errors.noOfDays && (
                          <p className="mt-1 text-sm text-red-600">{errors.noOfDays.message}</p>
                      )}
                    </div>
                )}

                {showCommissionField && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="amount">
                        Commission Amount
                      </label>
                      <input
                          className={`w-full px-3 py-2 border rounded-md ${
                              errors.commissionAmount ? 'border-red-500' : 'border-gray-300'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          type="number"
                          {...register("commissionAmount")}
                      />
                      {errors.commissionAmount && (
                          <p className="mt-1 text-sm text-red-600">{errors.commissionAmount.message}</p>
                      )}
                    </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                    Narration
                  </label>
                  <textarea
                      className={`w-full px-3 py-2 border rounded-md ${
                          errors.description ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      rows={3}
                      maxLength={100}
                      {...register("description")}
                  />
                  {errors.description && (
                      <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>
              </div>
            </Modal>
        </div>
      </div>
  );
};

export default CustomerDetail;