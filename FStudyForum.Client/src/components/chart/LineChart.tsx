import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { StatisticsPost } from '@/types/post';


ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

interface LineChartProps {
  data: StatisticsPost[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const labels = data.map((item) => item.date);
  const totalPosts = data.map((item) => item.totalPosts);
  const totalComments = data.map((item) => item.totalComments);
  const totalVotes = data.map((item) => item.totalVotes);
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Total Posts',
        data: totalPosts,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Total Comments',
        data: totalComments,
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
        tension: 0.1,
      },
      {
        label: 'Total Votes',
        data: totalVotes,
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Statistics Post',
      },
    },
  };

  return (
    <div>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
