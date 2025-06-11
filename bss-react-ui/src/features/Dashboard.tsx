import CardBarChart from "../components/Cards/CardBarChart";
import CardLineChart from "../components/Cards/CardLineChart";
import CardPageVisits from "../components/Cards/CardPageVisits";
import CardSocialTraffic from "../components/Cards/CardSocialTraffic";

const Dashboard: React.FC = () => {
  return (
    <>
     <div className="flex flex-wrap py-2">
        <div className="w-full xl:w-7/12 mb-12 xl:mb-0 px-4">
          <CardLineChart />
        </div>
        <div className="w-full xl:w-5/12 px-4">
          <CardBarChart />
        </div>
      </div>
      <div className="flex flex-wrap mt-4">
        <div className="w-full xl:w-7/12 mb-12 xl:mb-0 px-4">
          
          <CardSocialTraffic />
        </div>
        <div className="w-full xl:w-5/12 px-4">
        <CardPageVisits />
          
        </div>
      </div>
    </>
  )
}

export default Dashboard;
