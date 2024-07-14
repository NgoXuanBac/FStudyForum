import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { StatisticsDonate } from '@/types/donate';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ColumnChartProps {
  data: StatisticsDonate[];
}

const ColumnChart: React.FC<ColumnChartProps> = ({ data }) => {
  const labels = data.map((item) => item.date);
  const totalAmount = data.map((item) => item.totalAmount);
  const totalDonate = data.map((item) => item.totalDonation);
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Total Amount',
        data: totalAmount,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
      },
      {
        label: 'Total Donate',
        data: totalDonate,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Statistics Donate',
      },
    },
  };

  return (
    <div>
      <Bar data={chartData} options={options} height={400} />
    </div>
  );
};

export default ColumnChart;
