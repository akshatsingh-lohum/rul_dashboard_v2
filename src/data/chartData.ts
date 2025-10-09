export interface ChartDataPoint {
  x: number;
  y: number;
  label?: string;
}

export interface BubbleDataPoint {
  name: string;
  value: number;
  size: number;
}

// Voltage vs Time data for real-time plotting
// Based on provided data for channel 39, 40, 38, 37

// Generate time points with 0.5 second increments (0 to 49.5 seconds for 100 points)
const generateTimePoints = (count: number): number[] => {
  const result: number[] = [];
  const increment = 0.5; // 0.5 second increments
  for (let i = 0; i < count; i++) {
    result.push(i * increment); // Each step is 0.5 seconds
  }
  return result;
};

const timePoints = generateTimePoints(100); // 100 points = 0 to 49.5 seconds

// Voltage data for Cell 1
const cell1VoltageData = [
  3.5741, 3.5752, 3.5751, 3.5762, 3.5759, 3.576, 3.5767, 3.5767, 3.5774, 3.5774,
  3.578, 3.578, 3.5787, 3.5787, 3.5792, 3.5792, 3.5798, 3.5797, 3.5803, 3.5802,
  3.5808, 3.5808, 3.5813, 3.5813, 3.5818, 3.5817, 3.5822, 3.5822, 3.5827,
  3.5827, 3.5831, 3.5831, 3.5836, 3.5835, 3.584, 3.5839, 3.5844, 3.5843, 3.5848,
  3.5847, 3.5851, 3.5851, 3.5856, 3.5855, 3.586, 3.5858, 3.5863, 3.5862, 3.5867,
  3.5866, 3.587, 3.587, 3.5874, 3.5873, 3.5877, 3.5876, 3.5881, 3.588, 3.5884,
  3.5883, 3.5887, 3.5886, 3.5891, 3.589, 3.5894, 3.5893, 3.5896, 3.5896, 3.59,
  3.5899, 3.5903, 3.5901, 3.5906, 3.5905, 3.5909, 3.5908, 3.5912, 3.591, 3.5914,
  3.5913, 3.5918, 3.5916, 3.592, 3.5919, 3.5923, 3.5922, 3.5926, 3.5925, 3.5929,
  3.5927, 3.5932, 3.593, 3.5934, 3.5933, 3.5936, 3.5935, 3.5939, 3.5938, 3.5942,
  3.594,
];

// Voltage data for Cell 2
const cell2VoltageData = [
  3.5741, 3.5751, 3.5751, 3.5762, 3.5759, 3.576, 3.5767, 3.5767, 3.5774, 3.5774,
  3.578, 3.578, 3.5787, 3.5787, 3.5792, 3.5792, 3.5798, 3.5797, 3.5803, 3.5802,
  3.5808, 3.5808, 3.5813, 3.5813, 3.5818, 3.5817, 3.5822, 3.5822, 3.5827,
  3.5827, 3.5831, 3.5831, 3.5836, 3.5835, 3.584, 3.5839, 3.5844, 3.5843, 3.5848,
  3.5847, 3.5851, 3.5851, 3.5856, 3.5855, 3.586, 3.5858, 3.5863, 3.5862, 3.5867,
  3.5866, 3.587, 3.587, 3.5874, 3.5873, 3.5877, 3.5876, 3.5881, 3.588, 3.5884,
  3.5883, 3.5887, 3.5886, 3.5891, 3.589, 3.5894, 3.5893, 3.5896, 3.5896, 3.59,
  3.5899, 3.5903, 3.5901, 3.5906, 3.5905, 3.5909, 3.5908, 3.5912, 3.591, 3.5914,
  3.5913, 3.5918, 3.5916, 3.592, 3.5919, 3.5923, 3.5922, 3.5926, 3.5925, 3.5929,
  3.5927, 3.5932, 3.593, 3.5934, 3.5933, 3.5936, 3.5935, 3.5939, 3.5938, 3.5942,
  3.594,
];

// Voltage data for Cell 3
const cell3VoltageData = [
  3.6663, 3.6673, 3.668, 3.6687, 3.6694, 3.6699, 3.6704, 3.671, 3.6715, 3.6718,
  3.6723, 3.6727, 3.6731, 3.6734, 3.6739, 3.6742, 3.6746, 3.6749, 3.6753,
  3.6756, 3.6759, 3.6762, 3.6766, 3.6769, 3.6772, 3.6775, 3.6777, 3.678, 3.6783,
  3.6786, 3.6788, 3.6791, 3.6793, 3.6796, 3.6798, 3.6801, 3.6803, 3.6805,
  3.6807, 3.6809, 3.6812, 3.6814, 3.6817, 3.6819, 3.6821, 3.6823, 3.6825,
  3.6827, 3.6829, 3.6831, 3.6832, 3.6834, 3.6836, 3.6839, 3.684, 3.6842, 3.6844,
  3.6845, 3.6847, 3.6849, 3.6849, 3.6849, 3.6849, 3.6849, 3.6849, 3.6849,
  3.6849, 3.6849, 3.6849, 3.6849, 3.6849, 3.6849, 3.6849, 3.6849, 3.6849,
  3.6849, 3.6849, 3.6849, 3.6849, 3.6849, 3.6849, 3.6849, 3.6849, 3.6849,
  3.6849, 3.6849, 3.6849, 3.6849, 3.6849, 3.6849, 3.6849, 3.6849, 3.6849,
  3.6849, 3.6849, 3.6849, 3.6849, 3.6849, 3.6849, 3.6849,
];

// Voltage data for Cell 4
const cell4VoltageData = [
  3.5751, 3.5762, 3.5771, 3.5778, 3.5784, 3.5791, 3.5797, 3.5803, 3.5808,
  3.5813, 3.5818, 3.5823, 3.5828, 3.5832, 3.5837, 3.5842, 3.5845, 3.585, 3.5854,
  3.5858, 3.5862, 3.5866, 3.5869, 3.5873, 3.5877, 3.588, 3.5883, 3.5887, 3.589,
  3.5894, 3.5897, 3.59, 3.5904, 3.5907, 3.591, 3.5913, 3.5916, 3.5919, 3.5922,
  3.5925, 3.5927, 3.593, 3.5933, 3.5936, 3.5939, 3.5941, 3.5944, 3.5946, 3.5949,
  3.5952, 3.5954, 3.5957, 3.5959, 3.5962, 3.5964, 3.5967, 3.5969, 3.5971,
  3.5974, 3.5976, 3.5976, 3.5976, 3.5976, 3.5976, 3.5976, 3.5976, 3.5976,
  3.5976, 3.5976, 3.5976, 3.5976, 3.5976, 3.5976, 3.5976, 3.5976, 3.5976,
  3.5976, 3.5976, 3.5976, 3.5976, 3.5976, 3.5976, 3.5976, 3.5976, 3.5976,
  3.5976, 3.5976, 3.5976, 3.5976, 3.5976, 3.5976, 3.5976, 3.5976, 3.5976,
  3.5976, 3.5976, 3.5976, 3.5976, 3.5976, 3.5976,
];

// Voltage vs Time data for real-time plotting
export const voltageTimeData = (() => {
  // Create pairs of time and voltage values
  const pairs = timePoints.map((time, index) => ({
    time,
    voltage:
      cell1VoltageData[index] ||
      cell1VoltageData[cell1VoltageData.length - 1],
  }));

  // Return time and voltage arrays
  return {
    time: pairs.map((pair) => pair.time),
    voltage: pairs.map((pair) => pair.voltage),
  };
})();

// Nyquist Plot Data (Z_real vs -Z_img)
export const nyquistData: ChartDataPoint[] = [
  { x: 0.016301, y: -0.002109 },
  { x: 0.016312, y: -0.000763 },
  { x: 0.016478, y: 0.0000716 },
  { x: 0.016833, y: 0.00061 },
  { x: 0.017301, y: 0.00099 },
  { x: 0.017776, y: 0.00137 },
  { x: 0.018583, y: 0.002 },
  { x: 0.019889, y: 0.00256 },
  { x: 0.021565, y: 0.00244 },
  { x: 0.022777, y: 0.00179 },
  { x: 0.023276, y: 0.00137 },
  { x: 0.023624, y: 0.00127 },
  { x: 0.024236, y: 0.00159 },
];

// Bode Plot - Magnitude (Frequency vs Z_mod)
export const bodeMagnitudeData: ChartDataPoint[] = [
  { x: 1004.463989, y: 0.016437 },
  { x: 468.75, y: 0.01633 },
  { x: 216.3462, y: 0.016478 },
  { x: 99.73400116, y: 0.016844 },
  { x: 45.07212067, y: 0.017329 },
  { x: 21.80233002, y: 0.017829 },
  { x: 9.910149574, y: 0.01869 },
  { x: 4.6875, y: 0.020053 },
  { x: 2.170139074, y: 0.021702 },
  { x: 1.001603007, y: 0.022847 },
  { x: 0.465029806, y: 0.023317 },
  { x: 0.215814903, y: 0.023658 },
  { x: 0.100074701, y: 0.024288 },
];

// Bode Plot - Phase (Frequency vs Z_phz)
export const bodePhaseData: ChartDataPoint[] = [
  { x: 1004.463989, y: 7.372922 },
  { x: 468.75, y: 2.679094 },
  { x: 216.3462, y: -0.24902 },
  { x: 99.73400116, y: -2.09231 },
  { x: 45.07212067, y: -3.29053 },
  { x: 21.80233002, y: -4.40975 },
  { x: 9.910149574, y: -6.14428 },
  { x: 4.6875, y: -7.33484 },
  { x: 2.170139074, y: -6.44555 },
  { x: 1.001603007, y: -4.49754 },
  { x: 0.465029806, y: -3.36579 },
  { x: 0.215814903, y: -3.06923 },
  { x: 0.100074701, y: -3.74949 },
];

// --- Data for Multiple Cells ---

export type CellNumber = 1 | 2 | 3 | 4 | 5;

export interface CellData {
  SoH: number;
  RUL: number;
  OCV: number;
  nyquistData: ChartDataPoint[];
  bodeMagnitudeData: ChartDataPoint[];
  bodePhaseData: ChartDataPoint[];
}

// Helper to generate slightly different data for each cell
const generateVariedData = (
  baseData: ChartDataPoint[],
  factor: number
): ChartDataPoint[] => {
  return baseData.map((point) => ({
    ...point,
    x: point.x * (1 + (Math.random() - 0.5) * 0.1 * factor),
    y: point.y * (1 + (Math.random() - 0.5) * 0.15 * factor),
  }));
};

// Create voltage-time data for each cell
const createCellVoltageTimeData = (voltageData: number[]) => {
  return timePoints.map((time, index) => ({
    x: time, // Time on x-axis
    y: voltageData[index] || voltageData[voltageData.length - 1], // Voltage on y-axis
  }));
};

export const cellsData: Record<CellNumber, CellData> = {
  1: {
    SoH: 98.23,
    RUL: 912, 
    OCV: 3.5254,
    nyquistData: createCellVoltageTimeData(cell1VoltageData),
    bodeMagnitudeData: bodeMagnitudeData,
    bodePhaseData: bodePhaseData,
  },
  2: {
    SoH: 93.27,
    RUL: 664,
    OCV: 3.5245,
    nyquistData: createCellVoltageTimeData(cell2VoltageData),
    bodeMagnitudeData: generateVariedData(bodeMagnitudeData, 1.2),
    bodePhaseData: generateVariedData(bodePhaseData, 1.2),
  },
  3: {
    SoH: 89.34,
    RUL: 467,
    OCV: 3.6216,
    nyquistData: createCellVoltageTimeData(cell3VoltageData),
    bodeMagnitudeData: generateVariedData(bodeMagnitudeData, 0.8),
    bodePhaseData: generateVariedData(bodePhaseData, 0.8),
  },
  4: {
    SoH: 96.89,
    RUL: 845,
    OCV: 3.5263,
    nyquistData: createCellVoltageTimeData(cell4VoltageData),
    bodeMagnitudeData: generateVariedData(bodeMagnitudeData, 1.5),
    bodePhaseData: generateVariedData(bodePhaseData, 1.5),
  },
  5: {
    SoH: 96.89,
    RUL: 845,
    OCV: 3.5263,
    nyquistData: createCellVoltageTimeData(cell4VoltageData),
    bodeMagnitudeData: generateVariedData(bodeMagnitudeData, 1.5),
    bodePhaseData: generateVariedData(bodePhaseData, 1.5),
  },
};

// Legacy resultsData for compatibility, can be removed later
export const resultsData = cellsData[1];

// Legacy data (keeping for compatibility)
export const lineChartData1: ChartDataPoint[] = nyquistData;
export const lineChartData2: ChartDataPoint[] = bodeMagnitudeData;
export const bubbleData1: ChartDataPoint[] = bodePhaseData;
export const bubbleData2: ChartDataPoint[] = [];
