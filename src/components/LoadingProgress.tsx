import React, { useState, useEffect } from "react";

interface LoadingProgressProps {
  onComplete: () => void;
}

const LoadingProgress: React.FC<LoadingProgressProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 200);
          return 100;
        }
        return prev + 10; // 10 steps to complete in 5 seconds (500ms each)
      });
    }, 500);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-500 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-base font-medium min-w-[100px]">Starting...</span>
    </div>
  );
};

export default LoadingProgress;
