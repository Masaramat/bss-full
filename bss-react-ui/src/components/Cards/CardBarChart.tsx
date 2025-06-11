import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import { getAllMonthlyRepayments, getPaidMonthlyRepayments } from '../../features/homeApi';
import { MonthyReport } from '../../features/types';
import { useNavigate } from 'react-router-dom';

Chart.register(...registerables);

const CardBarChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const [paidMonthlyRepayments, setPaidMonthlyRepayments] = useState<MonthyReport[]>([]);
  const [allMonthlyRepayments, setAllMonthlyRepayments] = useState<MonthyReport[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const paidResponse = await getPaidMonthlyRepayments(navigate);        
        setPaidMonthlyRepayments(paidResponse?.data);

        const allResponse = await getAllMonthlyRepayments(navigate);
        setAllMonthlyRepayments(allResponse?.data);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };

    getData();
  }, []);

  // Process the response data to fill in missing months with zero
  const months = Array.from({ length: 12 }, (_, i) => i + 1); // [1, 2, ..., 12]
  const paidAmounts = months.map(month => {
    const found = paidMonthlyRepayments.find(item => item.month === month);
    return found ? found.amount : 0;
  });
  const allAmounts = months.map(month => {
    const found = allMonthlyRepayments.find(item => item.month === month);
    return found ? found.amount : 0;
  });
  console.log(allAmounts)

  useEffect(() => {
    const ctx = chartRef.current?.getContext('2d');
    if (ctx) {
      // Destroy previous chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Create new chart instance
      chartInstanceRef.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Expected',
              backgroundColor: '#4c51bf',
              borderColor: '#4c51bf',
              data: allAmounts,
              barThickness: 8,
            },
            {
              label: 'Paid',
              backgroundColor: '#ed64a6',
              borderColor: '#ed64a6',
              data: paidAmounts,
              barThickness: 8,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              labels: {
                color: 'rgba(0,0,0,.4)',
              },
              align: 'end',
              position: 'bottom',
            },
          },
          scales: {
            x: {
              display: true,
            },
            y: {
              display: true,
              grid: {
                color: 'rgba(33, 37, 41, 0.2)',
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
  }, [paidMonthlyRepayments, allMonthlyRepayments]); // Re-run effect when data changes

  return (
    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
      <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">Repayment Chart</h6>
          </div>
        </div>
      </div>
      <div className="p-4 flex-auto">
        <div className="relative h-350-px">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default CardBarChart;
