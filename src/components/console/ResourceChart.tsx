import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { cn } from '@/lib/utils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Configure default chart options
ChartJS.defaults.color = 'hsl(0 0% 70%)';
ChartJS.defaults.borderColor = 'hsl(190 10% 15%)';

interface ResourceChartProps {
  title: string;
  type: 'cpu' | 'memory' | 'disk' | 'network';
  className?: string;
  height?: number;
}

export function ResourceChart({ 
  title, 
  type, 
  className, 
  height = 200 
}: ResourceChartProps) {
  const [data, setData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  
  // Generate random resource data for demo
  useEffect(() => {
    const generateInitialData = () => {
      const newData: number[] = [];
      const newLabels: string[] = [];
      
      for (let i = 0; i < 20; i++) {
        let value: number;
        
        switch (type) {
          case 'cpu':
            // CPU typically has more fluctuation
            value = Math.floor(Math.random() * 60) + 10;
            break;
          case 'memory':
            // Memory tends to be more stable but high
            value = Math.floor(Math.random() * 30) + 40;
            break;
          case 'disk':
            // Disk usage grows slowly
            value = Math.floor(Math.random() * 10) + 20;
            break;
          case 'network':
            // Network has spikes
            value = Math.floor(Math.random() * 80);
            break;
          default:
            value = Math.floor(Math.random() * 100);
        }
        
        newData.push(value);
        
        // Create time labels going back in time (most recent is rightmost)
        const now = new Date();
        now.setMinutes(now.getMinutes() - (19 - i));
        newLabels.push(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
      }
      
      setData(newData);
      setLabels(newLabels);
    };
    
    generateInitialData();
    
    // Update with new data point every few seconds
    const interval = setInterval(() => {
      setData(prevData => {
        let newValue: number;
        const lastValue = prevData[prevData.length - 1];
        
        // Generate a value that's somewhat related to the previous value
        // for more realistic looking charts
        switch (type) {
          case 'cpu':
            // CPU can change rapidly but within a range
            newValue = Math.max(5, Math.min(95, lastValue + (Math.random() * 20 - 10)));
            break;
          case 'memory':
            // Memory changes more slowly
            newValue = Math.max(30, Math.min(95, lastValue + (Math.random() * 6 - 3)));
            break;
          case 'disk':
            // Disk usage typically only goes up
            newValue = Math.min(95, lastValue + (Math.random() * 1));
            break;
          case 'network':
            // Network has more random spikes
            newValue = Math.max(0, Math.min(100, lastValue + (Math.random() * 30 - 15)));
            break;
          default:
            newValue = Math.floor(Math.random() * 100);
        }
        
        return [...prevData.slice(1), newValue];
      });
      
      setLabels(prevLabels => {
        const now = new Date();
        const newTimeLabel = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        return [...prevLabels.slice(1), newTimeLabel];
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [type]);
  
  // Define chart colors based on resource type
  const getChartColors = () => {
    switch (type) {
      case 'cpu':
        return {
          borderColor: 'hsl(25, 100%, 50%)',
          backgroundColor: 'hsla(25, 100%, 50%, 0.2)'
        };
      case 'memory':
        return {
          borderColor: 'hsl(220, 70%, 60%)',
          backgroundColor: 'hsla(220, 70%, 60%, 0.2)'
        };
      case 'disk':
        return {
          borderColor: 'hsl(150, 60%, 50%)',
          backgroundColor: 'hsla(150, 60%, 50%, 0.2)'
        };
      case 'network':
        return {
          borderColor: 'hsl(280, 70%, 60%)',
          backgroundColor: 'hsla(280, 70%, 60%, 0.2)'
        };
      default:
        return {
          borderColor: 'hsl(210, 70%, 60%)',
          backgroundColor: 'hsla(210, 70%, 60%, 0.2)'
        };
    }
  };
  
  const colors = getChartColors();
  
  // Resource-specific unit and tooltip label
  const getResourceUnit = () => {
    switch (type) {
      case 'cpu': return '%';
      case 'memory': return '%';
      case 'disk': return '%';
      case 'network': return 'MB/s';
      default: return '';
    }
  };
  
  const chartData = {
    labels,
    datasets: [
      {
        label: `${title} (${getResourceUnit()})`,
        data,
        borderColor: colors.borderColor,
        backgroundColor: colors.backgroundColor,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        tension: 0.3,
        fill: true,
      },
    ],
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
        },
        grid: {
          display: false,
        }
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
        },
        grid: {
          color: 'hsla(190, 10%, 20%, 0.5)',
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'hsl(190, 10%, 15%)',
        titleColor: 'hsl(0, 0%, 100%)',
        bodyColor: 'hsl(0, 0%, 90%)',
        borderColor: 'hsl(25, 100%, 50%)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `${context.raw}${getResourceUnit()}`;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear',
      }
    },
  };
  
  // Current value is the last item in the data array
  const currentValue = data[data.length - 1] || 0;
  
  return (
    <div className={cn(
      "flex flex-col rounded-lg border border-muted bg-card p-4 shadow-md",
      className
    )}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <div className="text-xl font-bold text-primary">
          {currentValue}{getResourceUnit()}
        </div>
      </div>
      
      <div style={{ height: `${height}px` }}>
        <Line data={chartData} options={options as any} />
      </div>
    </div>
  );
}