import CardBarChart from "../components/Cards/CardBarChart";
import CardLineChart from "../components/Cards/CardLineChart";
import CardPageVisits from "../components/Cards/CardPageVisits";
import CardSocialTraffic from "../components/Cards/CardSocialTraffic";
import {useAuth} from "../Context/useAuth.tsx";

const Dashboard: React.FC = () => {
    const { user } = useAuth();
  return (

    <>
     <div className="flex flex-wrap py-2">
         {
             user?.role === "ADMIN" && (
                 <div className="w-full xl:w-7/12 mb-12 xl:mb-0 px-4 shadow-lg">
                     <CardLineChart/>
                 </div>
             )
         }

         <div className={`w-full ${user?.role === "ADMIN" && "xl:w-5/12"} px-4 shadow-lg`}>
             <CardBarChart/>
         </div>
      </div>
      <div className="flex flex-wrap mt-4">
        <div className="w-full xl:w-7/12 mb-12 xl:mb-0 px-4 shadow-lg">
          
          <CardSocialTraffic />
        </div>
        <div className="w-full xl:w-5/12 px-4 shadow-lg">
        <CardPageVisits />
          
        </div>
      </div>
    </>
  )
}

export default Dashboard;
