import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import LineChart from "@/components/LineChart";
import VoltageTimeChart from "@/components/VoltageTimeChart";
import CombinedBodeChart from "@/components/CombinedBodeChart";
import LargeMetric from "@/components/LargeMetric";

import { cellsData, CellNumber } from "@/data/chartData";

type Screen = "start" | "analysis" | "results";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("start");
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedCell, setSelectedCell] = useState<CellNumber>(1);

  const handleStart = () => {
    // Reset the analysis state when starting a new analysis
    setAnalysisComplete(false);
    setCurrentScreen("analysis");
  };

  const handleChartComplete = () => {
    console.log(
      "[DEBUG] Chart animation complete, setting analysisComplete to true"
    );
    setAnalysisComplete(true);
  };

  const handleSelectCell = (cellNumber: CellNumber) => {
    setSelectedCell(cellNumber);
    setCurrentScreen("results");
  };

  const handleBackToStart = () => {
    setCurrentScreen("start");
    setAnalysisComplete(false);
  };

  // This effect handles the keyboard listener
  useEffect(() => {
    // Create the handler function
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(
        `[DEBUG] Key pressed: ${event.key}, analysisComplete: ${analysisComplete}, currentScreen: ${currentScreen}`
      );

      // CRITICAL: Only process key presses if analysis is complete
      // This ensures keys 1-5 do nothing while the chart is still animating
      if (analysisComplete && currentScreen === "analysis") {
        console.log(
          `[DEBUG] Conditions met, processing key press: ${event.key}`
        );
        const key = parseInt(event.key, 10);
        if (key >= 1 && key <= 5) {
          console.log(`[DEBUG] Valid cell key (${key}), navigating to results`);
          handleSelectCell(key as CellNumber);
        }
      } else {
        console.log(
          `[DEBUG] Ignoring key press: analysisComplete=${analysisComplete}, currentScreen=${currentScreen}`
        );
      }
    };

    // Add the listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove the listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [analysisComplete, currentScreen]); // Re-run when these states change

  const renderStartScreen = () => (
    <div className="min-h-screen bg-gray-50 p-5 flex flex-col">
      <div className="flex items-center justify-center mb-8">
        <img
          src="/assets/lohum.png"
          alt="LOHUM Logo"
          className="h-32 w-auto object-contain"
          style={{ transform: "scale(0.71)" }}
        />
      </div>

      <div className="flex flex-col items-center mt-12">
        <h1 className="text-5xl font-bold mb-8 text-center">
          Real Time Cell Capacity Estimation
        </h1>
        <Button
          asChild
          variant={null}
          size={null}
          onClick={handleStart}
          className="!bg-green-400 hover:!bg-green-500 !text-black !rounded-full !w-80 !h-80 !text-5xl !font-bold !flex !items-center !justify-center"
          style={{ padding: "1.0rem" }}
        >
          <div>ANALYSE</div>
        </Button>
      </div>
    </div>
  );

  const renderAnalysisScreen = () => (
    <div className="min-h-screen bg-gray-50 p-5 flex flex-col">
      <div className="flex items-center justify-center mb-4">
        <img
          src="/assets/lohum.png"
          alt="LOHUM Logo"
          className="h-28 w-auto object-contain"
          style={{ transform: "scale(0.71)" }}
        />
      </div>

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <div
          className="bg-white border border-gray-400 rounded-lg p-6 flex-0 mb-4"
          style={{ minHeight: "600px" }}
        >
          <VoltageTimeChart onComplete={handleChartComplete} />
        </div>
      </div>
    </div>
  );

  const renderResultsScreen = () => (
    <div className="min-h-screen bg-gray-50 p-5 flex flex-col">
      <div className="flex items-center justify-center mb-4">
        <img
          src="/assets/lohum.png"
          alt="LOHUM Logo"
          className="h-28 w-auto object-contain"
          style={{ transform: "scale(0.71)" }}
        />
      </div>

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-6 mb-5">
          <Button
            onClick={handleBackToStart}
            variant="outline"
            className="flex items-center gap-2 text-xl px-6 py-3"
          >
            <ArrowLeft size={28} />
            Back to Start
          </Button>
          <h2 className="text-4xl font-semibold text-gray-800">Cell {selectedCell} Results</h2>
        </div>

        <div className="bg-white border border-gray-400 rounded-lg p-8 mb-4 flex-1 flex flex-col justify-center">
          <h3 className="text-3xl font-bold mb-12 text-center text-gray-700">
            Battery Health Analysis
          </h3>
          
          <div className="flex flex-col items-center justify-center gap-10 py-8">
            <LargeMetric
              label="State of Health"
              value={`${cellsData[selectedCell].SoH.toFixed(1)}%`}
              subValue={`(±2%)`}
              color="#22c55e"
              size="xlarge"
            />
            <LargeMetric
              label="Remaining Life"
              value={`${cellsData[selectedCell].RUL} cycles`}
              color="#3b82f6"
              size="xlarge"
            />
            <LargeMetric
              label="Open Circuit Voltage"
              value={`${cellsData[selectedCell].OCV}V`}
              color="#a855f7"
              size="xlarge"
            />
          </div>
        </div>
      </div>
    </div>
  );

  switch (currentScreen) {
    case "start":
      return renderStartScreen();
    case "analysis":
      return renderAnalysisScreen();
    case "results":
      return renderResultsScreen();
    default:
      return renderStartScreen();
  }
};

export default Index;
