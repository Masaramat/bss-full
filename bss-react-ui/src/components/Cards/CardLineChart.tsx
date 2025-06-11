import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js/auto';
import { MonthyReport } from '../../features/types';
import { getMonthlyYearCommission, getMonthlyYearFees, getMonthlyYearInterest } from '../../features/homeApi';
import { useNavigate } from 'react-router-dom';

Chart.register(...registerables);

const CardLineChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [commissions, setCommissions] = useState<MonthyReport[]>([]);
  const [interests, setInterests] = useState<MonthyReport[]>([]);
  const [fees, setFees] = useState<MonthyReport[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const commissionResponse = await getMonthlyYearCommission(navigate);
        console.log('Commissions:', commissionResponse?.data);
        setCommissions(commissionResponse?.data || []);

        const feesResponse = await getMonthlyYearFees(navigate);
        console.log('Fees:', feesResponse?.data);
        setFees(feesResponse?.data || []);

        const interestResponse = await getMonthlyYearInterest(navigate);
        console.log('Interests:', interestResponse?.data);
        setInterests(interestResponse?.data || []);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    getData();
  }, [navigate]);

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d');
    if (ctx) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Prepare data for chart
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

      const commissionData = commissions.length ? mapMonthsToAmounts(commissions) : Array(12).fill(0);
      const feesData = fees.length ? mapMonthsToAmounts(fees) : Array(12).fill(0);
      const interestData = interests.length ? mapMonthsToAmounts(interests) : Array(12).fill(0);

      function mapMonthsToAmounts(data: MonthyReport[]) {
        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        const amounts = months.map(month => {
          const found = data.find(item => item.month === month);
          return found ? found.amount : 0;
        });
        console.log('Mapped Amounts:', amounts);
        return amounts;
      }

      // Create new chart instance
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: monthNames,
          datasets: [
            {
              label: 'Commissions',
              backgroundColor: '#4c51bf',
              borderColor: '#4c51bf',
              data: commissionData,
              fill: false,
            },
            {
              label: 'Fees',
              backgroundColor: '#00bfa6',
              borderColor: '#00bfa6',
              data: feesData,
              fill: false,
            },
            {
              label: 'Interests',
              backgroundColor: '#f3c500',
              borderColor: '#f3c500',
              data: interestData,
              fill: false,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              labels: {
                color: 'purple',
              },
              align: 'end',
              position: 'bottom',
            },
          },
          scales: {
            x: {
              ticks: {
                color: 'purple',
              },
              grid: {
                display: false,
              },
            },
            y: {
              ticks: {
                color: 'purple',
              },
              grid: {
                color: 'rgba(255, 255, 255, 0.15)',
              },
            },
          },
        },
      });
    }

    // Cleanup function to destroy chart on component unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [commissions, fees, interests]);

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white-400">
      <div className="rounded-t mb-0 px-4 py-4 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h6 className="uppercase text-blue-950 mb-1 text-xs font-semibold">Income Charts</h6>
          </div>
        </div>
      </div>
      <div className="p-3 flex-auto">
        <div className="relative h-350-px">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default CardLineChart;
