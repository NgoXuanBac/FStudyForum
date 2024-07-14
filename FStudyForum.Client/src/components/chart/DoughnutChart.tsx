import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend);

const data = {
    labels: [
        'Red',
        'Blue',
        'Yellow'
    ],
    datasets: [{
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
    }]
};

const options = {
    responsive: true,
    plugins: {
        title: {
            display: true,
            text: 'Basic Doughnut Chart'
        }
    }
};

class DoughnutChart extends React.Component {
    render() {
        return (
            <div>
                <Doughnut data={data} options={options} />
            </div>
        );
    }
}
export default DoughnutChart;
