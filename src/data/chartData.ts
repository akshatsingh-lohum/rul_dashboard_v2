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

// Current vs Voltage data for real-time plotting
const rawCurrentVoltageData = {
  current: [
    0, 2.59797513, 3.89786171, 3.57737438, -0.1604528, 4.11719391, 3.2678036,
    2.86225662, 1.47028498, 3.40504349, 1.76054471, 1.47924956, 3.02425805,
    0.6635377, 2.78498489, 1.63993607, 0.05995904, -4.452387, -0.10559705,
    1.31155121, 1.70405736, 2.43205735, 1.46103118, 2.23056617, 3.04215603,
    5.91544957, 1.18504144, 2.69664491, 2.57737355, 2.05978976, 0.57883715,
    2.49567456, 3.50527742, 1.62394344, 2.63231405, -2.4943027, -2.66375994,
    -1.68875713, 1.27417867, -2.47589708, -2.0359088, -0.26266166, -0.05046748,
    2.92017948, 2.64822204, 2.69175895, 0.54177887, 4.09238957, 0.97766854,
    1.45393157, 4.02578151, 5.54113145, 4.13718002, 2.212793, 2.66621493,
    -0.05068464, 3.60454922, 1.17731989, -1.36829285, -3.36083889, 0.25625577,
    0.43701786, 0.20186143, 2.52047757, 0.28261303, 1.22656762, 0.13952203,
    0.98272317, -1.42046555, 3.1480395, 3.18381386, 0.55363575, 0.61910102,
    1.58758492, 2.96884534, 1.05414829, 1.43808667, -4.538545, -3.32866,
    -2.04758205, -1.52321849, -3.0988626, -1.43352419, -0.27767043, -3.00706415,
    -0.69076156, -2.20845445, -0.41020308, -0.19948105, 1.59427325, -2.06749007,
    -0.07970076, 4.46317482, 4.23948035, 4.01886882, 1.62057286, 1.64542394,
    -0.6763551, 3.05725986, 0.4408622,
  ],
  voltage: [
    0, 0.06363922, 0.44905059, 0.40879255, 0.0640137, 0.43262651, 0.51594443,
    0.29215032, 0.36632757, 0.44435116, -0.02927913, -0.09525489, 0.13575622,
    -0.17998478, -0.22970785, -0.10490692, -0.38638129, -0.69049423,
    -0.23920675, -0.15368032, -0.28087051, 0.00639855, 0.05090164, -0.13295939,
    0.16060671, 0.55312413, 0.25641369, 0.36430648, 0.5208292, 0.2306528,
    0.12992227, 0.45805218, 0.29300214, -0.03591107, 0.10462737, -0.22128038,
    -0.49960974, -0.25306913, -0.1121222, -0.52159566, -0.41696208, -0.24445764,
    -0.4474174, -0.17012936, 0.19166148, 0.0608338, -0.03148253, 0.36560583,
    0.2035853, 0.18484251, 0.59709847, 0.5711465, 0.21472818, 0.27671161,
    0.27827585, -0.09688276, 0.13001301, 0.12710021, -0.3394274, -0.48468664,
    -0.23074394, -0.43596062, -0.43320323, -0.05985201, -0.28315028,
    -0.40382743, -0.10225034, 0.02569818, -0.10536752, 0.35662644, 0.43347843,
    0.0855493, 0.25044265, 0.47337727, 0.29764445, 0.28512942, 0.43779281,
    -0.10214367, -0.24460406, -0.0135665, -0.16858578, -0.40532165, -0.19233994,
    -0.33034633, -0.69412971, -0.3527905, -0.23391423, -0.34103005, -0.13938784,
    0.08770947, -0.23372931, -0.01783058, 0.47257311, 0.3494618, 0.32963786,
    0.48698414, 0.28424551, 0.03889055, 0.42510454, 0.2815663,
  ],
};

// Current vs Voltage data sorted by voltage values
export const currentVoltageData = (() => {
  // Create pairs of voltage and current values
  const pairs = rawCurrentVoltageData.voltage.map((voltage, index) => ({
    voltage,
    current: rawCurrentVoltageData.current[index],
  }));

  // Sort the pairs by voltage (ascending order)
  pairs.sort((a, b) => a.voltage - b.voltage);

  // Extract sorted voltage and current arrays
  return {
    voltage: pairs.map((pair) => pair.voltage),
    current: pairs.map((pair) => pair.current),
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
const generateVariedData = (baseData: ChartDataPoint[], factor: number): ChartDataPoint[] => {
  return baseData.map(point => ({
    ...point,
    x: point.x * (1 + (Math.random() - 0.5) * 0.1 * factor),
    y: point.y * (1 + (Math.random() - 0.5) * 0.15 * factor),
  }));
};

export const cellsData: Record<CellNumber, CellData> = {
  1: { 
    SoH: 83.79, RUL: 552, OCV: 4.09,
    nyquistData: nyquistData,
    bodeMagnitudeData: bodeMagnitudeData,
    bodePhaseData: bodePhaseData
  },
  2: { 
    SoH: 78.45, RUL: 487, OCV: 3.98,
    nyquistData: generateVariedData(nyquistData, 1.2),
    bodeMagnitudeData: generateVariedData(bodeMagnitudeData, 1.2),
    bodePhaseData: generateVariedData(bodePhaseData, 1.2)
  },
  3: { 
    SoH: 92.12, RUL: 634, OCV: 4.15,
    nyquistData: generateVariedData(nyquistData, 0.8),
    bodeMagnitudeData: generateVariedData(bodeMagnitudeData, 0.8),
    bodePhaseData: generateVariedData(bodePhaseData, 0.8)
  },
  4: { 
    SoH: 65.33, RUL: 321, OCV: 3.87,
    nyquistData: generateVariedData(nyquistData, 1.5),
    bodeMagnitudeData: generateVariedData(bodeMagnitudeData, 1.5),
    bodePhaseData: generateVariedData(bodePhaseData, 1.5)
  },
  5: { 
    SoH: 88.67, RUL: 598, OCV: 4.11,
    nyquistData: generateVariedData(nyquistData, 0.9),
    bodeMagnitudeData: generateVariedData(bodeMagnitudeData, 0.9),
    bodePhaseData: generateVariedData(bodePhaseData, 0.9)
  },
};

// Legacy resultsData for compatibility, can be removed later
export const resultsData = cellsData[1];

// Legacy data (keeping for compatibility)
export const lineChartData1: ChartDataPoint[] = nyquistData;
export const lineChartData2: ChartDataPoint[] = bodeMagnitudeData;
export const bubbleData1: ChartDataPoint[] = bodePhaseData;
export const bubbleData2: ChartDataPoint[] = [];
