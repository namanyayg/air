import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  TooltipItem,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

interface ForecastChartProps {
  forecast?: {
    daily?: {
      pm25?: {
        avg: number;
        day: string;
      }[];
    };
  };
}

export default function ForecastChart({ forecast }: ForecastChartProps) {
  const forecastData = {
    labels: forecast?.daily?.pm25?.map(d => new Date(d.day).toLocaleDateString('en-US', { weekday: 'short' })) || [],
    datasets: [{
      data: forecast?.daily?.pm25?.map(d => d.avg) || [],
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0,
      pointRadius: 4,
      pointBackgroundColor: 'rgb(239, 68, 68)',
      pointBorderColor: 'rgb(0, 0, 0)',
      pointBorderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(255, 255, 255)',
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: TooltipItem<'line'>) => `PM2.5: ${(context.raw as number).toFixed(1)} μg/m³`
        }
      }
    },
    scales: {
      x: { 
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
        }
      },
      y: { 
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
        }
      }
    }
  };

  if (!forecast?.daily?.pm25) return null;

  return (
    <div className="p-6 rounded-xl border border-gray-800 bg-black/40 backdrop-blur-sm">
      <div className="text-sm text-gray-400 mb-2">PM2.5 Forecast</div>
      <div className="h-48 w-full">
        <Line data={forecastData} options={chartOptions} />
      </div>
    </div>
  );
} 