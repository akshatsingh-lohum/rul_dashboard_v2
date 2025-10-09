import React, { useState, useEffect, useRef } from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ChartDataPoint, currentVoltageData } from "@/data/chartData";

interface CurrentVoltageChartProps {
  onComplete: () => void;
}

const CurrentVoltageChart: React.FC<CurrentVoltageChartProps> = ({
  onComplete,
}) => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);
  const [sortedData, setSortedData] = useState<{voltage: number[], current: number[]}>({ voltage: [], current: [] });
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const completionCalledRef = useRef(false); // Track if we've called onComplete
  const totalDuration = 25 * 1000; // 25 seconds
  const pointsPerSecond = sortedData.voltage.length > 0 ? sortedData.voltage.length / (totalDuration / 1000) : 0;

  // Prepare and sort the data on mount
  useEffect(() => {
    console.log("[DEBUG CHART] Initializing chart data");
    // Reset completion state
    completionCalledRef.current = false;
    // Set a fixed height for the chart container
    setChartHeight(400);

    // Sort the data by voltage (x-axis) for left-to-right plotting
    const sortedVoltages = [...currentVoltageData.voltage];
    const sortedCurrents = [...currentVoltageData.current];
    
    // Create pairs and sort by voltage
    const pairs = sortedVoltages.map((voltage, index) => ({
      voltage,
      current: sortedCurrents[index],
    }));
    
    pairs.sort((a, b) => a.voltage - b.voltage);
    
    // Extract sorted arrays
    const sortedData = {
      voltage: pairs.map(pair => pair.voltage),
      current: pairs.map(pair => pair.current),
    };
    
    setSortedData(sortedData);
    
    // Start with just a few points
    const initialPoints = 5;
    const initialData: ChartDataPoint[] = [];
    
    for (let i = 0; i < initialPoints && i < sortedData.voltage.length; i++) {
      initialData.push({
        x: sortedData.voltage[i],
        y: sortedData.current[i],
      });
    }
    
    setData(initialData);
    setCurrentIndex(initialPoints);
  }, []);

  // Animation frame-based rendering for smoother animation
  useEffect(() => {
    // NEVER call onComplete here - we'll call it at the end of the animation
    // This prevents the early completion bug
    
    if (sortedData.voltage.length > 0) {
      console.log(`[DEBUG CHART] Animation progress: ${currentIndex}/${sortedData.voltage.length} points (${Math.round(currentIndex/sortedData.voltage.length*100)}%)`);
    }

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      
      const elapsed = timestamp - lastTimeRef.current;
      const pointsToAdd = Math.floor((elapsed / 1000) * pointsPerSecond);
      
      if (pointsToAdd > 0) {
        lastTimeRef.current = timestamp;
        
        const newPoints: ChartDataPoint[] = [];
        const actualPointsToAdd = Math.min(
          pointsToAdd,
          sortedData.voltage.length - currentIndex
        );
        
        for (let i = 0; i < actualPointsToAdd; i++) {
          if (currentIndex + i < sortedData.voltage.length) {
            newPoints.push({
              x: sortedData.voltage[currentIndex + i],
              y: sortedData.current[currentIndex + i],
            });
          }
        }
        
        if (newPoints.length > 0) {
          setData(prevData => [...prevData, ...newPoints]);
          setCurrentIndex(prev => prev + actualPointsToAdd);
        }
      }
      
      // Continue animation until we've processed all points
      if (currentIndex < sortedData.voltage.length) {
        animationRef.current = requestAnimationFrame(animate);
      } 
      // When we reach 100% completion, call onComplete immediately
      else if (!completionCalledRef.current && sortedData.voltage.length > 0) {
        console.log(`[DEBUG CHART] Animation TRULY complete after ${currentIndex}/${sortedData.voltage.length} points (100%)`);
        completionCalledRef.current = true;
        
        // Call onComplete immediately when we reach 100%
        console.log('[DEBUG CHART] Reached 100%, calling onComplete()');
        onComplete();
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentIndex, onComplete, sortedData]);

  // Calculate fixed axis ranges from the complete dataset
  const allVoltages = currentVoltageData.voltage;
  const allCurrents = currentVoltageData.current;

  const voltageMin = Math.min(...allVoltages);
  const voltageMax = Math.max(...allVoltages);
  const currentMin = Math.min(...allCurrents);
  const currentMax = Math.max(...allCurrents);

  // Add some padding to the ranges
  const voltagePadding = (voltageMax - voltageMin) * 0.1;
  const currentPadding = (currentMax - currentMin) * 0.1;

  // If no data, show a loading message
  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-xl font-semibold text-gray-600">
          Loading chart data...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height: `${chartHeight}px` }}>
      <h2 className="text-3xl font-bold mb-4 text-center">
        Current vs Voltage Analysis
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 20, right: 30, left: 60, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="x"
            type="number"
            domain={[voltageMin - voltagePadding, voltageMax + voltagePadding]}
            axisLine={true}
            tickLine={true}
            tick={{ fontSize: 20, fontWeight: 500 }}
            tickFormatter={(value) => Number(value).toFixed(2)}
            label={{
              value: "Voltage (V)",
              position: "insideBottom",
              offset: -25,
              style: {
                fontSize: "22px",
                fontWeight: "bold",
                textAnchor: "middle",
              },
            }}
          />
          <YAxis
            type="number"
            domain={[currentMin - currentPadding, currentMax + currentPadding]}
            axisLine={true}
            tickLine={true}
            tick={{ fontSize: 20, fontWeight: 500 }}
            tickFormatter={(value) => Number(value).toFixed(2)}
            label={{
              value: "Current (A)",
              angle: -90,
              position: "insideLeft",
              offset: -45,
              style: {
                fontSize: "22px",
                fontWeight: "bold",
                textAnchor: "middle",
              },
            }}
          />
          <Tooltip
            formatter={(value) => [Number(value).toFixed(3), "Current (A)"]}
            labelFormatter={(label) => `Voltage: ${Number(label).toFixed(3)} V`}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              fontSize: "18px",
              padding: "10px",
            }}
          />
          <Legend
            verticalAlign="top"
            height={40}
            wrapperStyle={{
              fontSize: "20px",
              fontWeight: 500,
              paddingTop: "10px",
            }}
          />
          <Line
            name="Current vs Voltage"
            type="monotone"
            dataKey="y"
            stroke="#2563eb"
            strokeWidth={4}
            dot={{ r: 2 }}
            activeDot={{ r: 8 }}
            isAnimationActive={false} // Disable built-in animation for smoother custom animation
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CurrentVoltageChart;
