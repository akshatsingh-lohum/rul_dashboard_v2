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
import { ChartDataPoint, voltageTimeData } from "@/data/chartData";

interface VoltageTimeChartProps {
  onComplete: () => void;
}

const VoltageTimeChart: React.FC<VoltageTimeChartProps> = ({ onComplete }) => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);
  const [chartData, setChartData] = useState<{
    time: number[];
    voltage: number[];
  }>({ time: [], voltage: [] });
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const completionCalledRef = useRef(false); // Track if we've called onComplete
  const totalDuration = 50 * 1000; // 50 seconds total duration
  const pointsPerSecond =
    chartData.time.length > 0
      ? chartData.time.length / (totalDuration / 1000)
      : 0;

  // Prepare and sort the data on mount
  useEffect(() => {
    console.log("[DEBUG CHART] Initializing chart data");
    // Reset completion state
    completionCalledRef.current = false;
    // Set a fixed height for the chart container
    setChartHeight(400);

    // Use the time-voltage data directly (already in correct order)
    const timePoints = [...voltageTimeData.time];
    const voltagePoints = [...voltageTimeData.voltage];

    // Set the chart data
    const chartData = {
      time: timePoints,
      voltage: voltagePoints,
    };

    setChartData(chartData);

    // Start with just a few points
    const initialPoints = 5;
    const initialData: ChartDataPoint[] = [];

    for (let i = 0; i < initialPoints && i < chartData.time.length; i++) {
      initialData.push({
        x: chartData.time[i],
        y: chartData.voltage[i],
      });
    }

    setData(initialData);
    setCurrentIndex(initialPoints);
  }, []);

  // Animation frame-based rendering for smoother animation
  useEffect(() => {
    // NEVER call onComplete here - we'll call it at the end of the animation
    // This prevents the early completion bug

    if (chartData.time.length > 0) {
      console.log(
        `[DEBUG CHART] Animation progress: ${currentIndex}/${
          chartData.time.length
        } points (${Math.round((currentIndex / chartData.time.length) * 100)}%)`
      );
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
          chartData.time.length - currentIndex
        );

        for (let i = 0; i < actualPointsToAdd; i++) {
          if (currentIndex + i < chartData.time.length) {
            newPoints.push({
              x: chartData.time[currentIndex + i],
              y: chartData.voltage[currentIndex + i],
            });
          }
        }

        if (newPoints.length > 0) {
          setData((prevData) => [...prevData, ...newPoints]);
          setCurrentIndex((prev) => prev + actualPointsToAdd);
        }
      }

      // Continue animation until we've processed all points
      if (currentIndex < chartData.time.length) {
        animationRef.current = requestAnimationFrame(animate);
      }
      // When we reach 100% completion, call onComplete immediately
      else if (!completionCalledRef.current && chartData.time.length > 0) {
        console.log(
          `[DEBUG CHART] Animation TRULY complete after ${currentIndex}/${chartData.time.length} points (100%)`
        );
        completionCalledRef.current = true;

        // Call onComplete immediately when we reach 100%
        console.log("[DEBUG CHART] Reached 100%, calling onComplete()");
        onComplete();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentIndex, onComplete, chartData]);

  // Calculate fixed axis ranges from the complete dataset
  const allTimes = voltageTimeData.time;
  const allVoltages = voltageTimeData.voltage;
  const selectedCell = voltageTimeData.selectedCell as number;

  const timeMin = Math.min(...allTimes);
  const timeMax = Math.max(...allTimes);
  const voltageMin = Math.min(...allVoltages);
  const voltageMax = Math.max(...allVoltages);

  // Add some padding to the ranges
  const timePadding = (timeMax - timeMin) * 0.05;
  const voltagePadding = (voltageMax - voltageMin) * 0.1;

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
      <h2 className="text-3xl font-bold mb-4 text-center">Voltage vs Time</h2>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 20, right: 30, left: 60, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="x"
            type="number"
            domain={[timeMin - timePadding, timeMax + timePadding]}
            axisLine={true}
            tickLine={true}
            tick={false}
            tickFormatter={(value) => Number(value).toFixed(1)}
            label={{
              value: "Time (s)",
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
            domain={[voltageMin - voltagePadding, voltageMax + voltagePadding]}
            axisLine={true}
            tickLine={true}
            tick={false}
            label={{
              value: "Voltage (V)",
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
            formatter={(value) => [Number(value).toFixed(3), "Voltage (V)"]}
            labelFormatter={(label) => `Time: ${Number(label).toFixed(1)} s`}
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
            name="Voltage vs Time"
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

export default VoltageTimeChart;
