import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import AuthenticatedLayout from '../components/AuthenticatedLayout';
import CustomerDetail from '../features/customer/CustomerDetail';
import CustomerPage from '../features/customer/CustomerPage';
import Dashboard from '../features/Dashboard';
import GroupDetails from '../features/group/GroupDetails';
import GroupPage from '../features/group/GroupPage';
import NewGroup from '../features/group/NewGroup';
import ExpectedRepayments from '../features/loan/ExpectedRepayments';
import LoanDetails from '../features/loan/LoanDetails';
import LoansPage from '../features/loan/LoansPage';
import NewLoanApplication from '../features/loan/NewLoanApplication';
import PendingLoans from '../features/loan/PendingLoans';
import LoginPage from '../features/LoginPage';
import UserDetails from '../features/admin/user/UserDetails';
import NewCustomer from '../features/customer/NewCustomer';
import UserPage from '../features/admin/user/userPage';
import NewUser from '../features/admin/user/NewUser';
import EditUser from '../features/admin/user/EditUser';
import LoanProductsPage from '../features/admin/loan_product/LoanProductsPage';
import NewLoanProduct from '../features/admin/loan_product/NewLoanProduct';
import LoanProductDetails from '../features/admin/loan_product/LoanProductDetails';
import EditLoanProduct from '../features/admin/loan_product/EditLoanProduct';
import LoanReport from '../features/reports/LoanReport';
import RepaymentReport from '../features/reports/RepaymentReport';
import TransactionReport from '../features/reports/TransactionReport';
import EditCustomer from '../features/customer/EditCustomer';
import EditPassword from '../features/EditPassword';
import AdasheSetup from '../features/admin/adashe/AdasheSetup';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <LoginPage /> },
      { path: 'login', element: <LoginPage /> },
      {
        path: '',
        element: <AuthenticatedLayout />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'password/edit/:id', element: <EditPassword /> },
          { path: 'user', element: <UserPage /> },
          { path: 'user/new', element: <NewUser /> },
          { path: 'user/:id', element: <UserDetails /> },
          { path: 'user/edit/:id', element: <EditUser /> },
          
          
          { path: 'adashe/setup', element: <AdasheSetup /> },


          { path: 'loan', element: <LoansPage /> },
          { path: 'loan/new/:customerId', element: <NewLoanApplication /> },
          { path: 'loan/pending', element: <PendingLoans /> },
          { path: 'loan/:id', element: <LoanDetails /> },
          { path: 'loan/expected', element: <ExpectedRepayments /> },


          { path: 'group', element: <GroupPage /> },
          { path: 'group/new', element: <NewGroup /> },
          { path: 'group/:id', element: <GroupDetails /> },
          
          { path: 'customer', element: <CustomerPage /> },
          { path: 'customer/:id', element: <CustomerDetail /> },
          { path: 'customer/new/:groupId', element: <NewCustomer /> },
          { path: 'customer/new', element: <NewCustomer /> },
          { path: 'customer/edit/:id', element: <EditCustomer /> },
          
          
          { path: 'loan-product', element: <LoanProductsPage /> },
          { path: 'loan-product/:id', element: <LoanProductDetails /> },
          { path: 'loan-product/new', element: <NewLoanProduct /> },
          { path: 'loan-product/edit/:id', element: <EditLoanProduct /> },

          { path: 'report/loan', element: <LoanReport /> },
          { path: 'report/repayment', element: <RepaymentReport /> },
          { path: 'report/transaction', element: <TransactionReport /> },


        ],
      },
    ],
  },
]);

