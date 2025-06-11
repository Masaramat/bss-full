import { useState } from "react";
import { LoanApplication } from "../../features/loan/types";
import { getRecentLoanApplications } from "../../features/homeApi";
import { capitalizeFirstLetter, formatCurrency, formatDate } from "../../features/types";
import { useNavigate } from "react-router-dom";



export default function CardPageVisits() {
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const navigate = useNavigate();
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'text-green-500';
      case 'REJECTED': return 'text-red-500';
      case 'PENDING': return 'text-yellow-500';
      case 'ACTIVE': return 'text-green-800';
      case 'PAID_OFF': return 'text-blue-800';
      default: return 'text-gray-500';
    }
  };

  useState(()  =>  {
    const getLoans = async () => {
      const result = await getRecentLoanApplications(6, navigate);
      setLoans(result?.data);
    }

    getLoans();

  })
  

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-base text-blueGray-700">
                Recent Loans
              </h3>
            </div>
            {/* <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
              {<Link className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:bg-primary" to='/request/my-request' > See all</Link>}
            </div> */}
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Amount
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Status
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan: LoanApplication) => (
                <tr key={loan.id}>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {formatCurrency(loan.amount)}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <span className={getStatusClass(loan.status)}>{capitalizeFirstLetter(loan.status === 'PAID_OFF' ? 'paid off' : loan.status)}</span>
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {formatDate(loan.appliedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
