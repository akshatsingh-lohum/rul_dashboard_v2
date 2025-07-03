import React, { useEffect, useRef } from "react";

// ===== CHANGE THIS VALUE TO ADJUST ALL METRIC SIZES =====
// This is the single location to control font size
const METRIC_SIZE_MULTIPLIER = 1.0; // 1.0 = default, 2.0 = twice as large, 0.5 = half size
// =====================================================

interface LargeMetricProps {
  label: string;
  value: string | number;
  subValue?: string; // New optional prop for sub-value
  color: string;
  size?: "medium" | "large" | "xlarge" | "xxlarge";
  inline?: boolean;
}

const LargeMetric: React.FC<LargeMetricProps> = ({
  label,
  value,
  subValue, // New prop
  color,
  size = "xlarge",
  inline = false,
}) => {
  const valueRef = useRef<HTMLDivElement>(null);
  const subValueRef = useRef<HTMLSpanElement>(null);

  // Base font sizes - these will be multiplied by METRIC_SIZE_MULTIPLIER
  const baseFontSizes = {
    medium: { label: "24px", value: "32px", subValue: "16px" },
    large: { label: "28px", value: "40px", subValue: "20px" },
    xlarge: { label: "32px", value: "48px", subValue: "24px" },
    xxlarge: { label: "36px", value: "56px", subValue: "28px" },
  };

  // Calculate actual font sizes based on multiplier
  const getFontSize = (size: string) => {
    const numericSize = parseInt(size);
    return `${Math.round(numericSize * METRIC_SIZE_MULTIPLIER)}px`;
  };

  // For the specific labels we want to make bigger (SoH, RUL, OCV)
  const isSpecialLabel = label === "SoH:" || label === "RUL:" || label === "OCV:";
  
  // Apply a larger size specifically for these labels
  const labelSize = isSpecialLabel 
    ? "48px" 
    : getFontSize(baseFontSizes[size].label);
  const valueSize = getFontSize(baseFontSizes[size].value);
  const subValueSize = getFontSize(baseFontSizes[size].subValue);

  // Create refs for both label and value elements
  const labelRef = useRef<HTMLDivElement>(null);

  // Use effect to inject custom CSS that overrides global styles
  useEffect(() => {
    // Create unique IDs for this instance
    const valueUniqueId = `metric-value-${Math.random().toString(36).substring(2, 9)}`;
    const labelUniqueId = `metric-label-${Math.random().toString(36).substring(2, 9)}`;
    const subValueUniqueId = `metric-subvalue-${Math.random().toString(36).substring(2, 9)}`;

    // Add unique classes to the elements
    if (valueRef.current) {
      valueRef.current.classList.add(valueUniqueId);
    }
    
    if (labelRef.current) {
      labelRef.current.classList.add(labelUniqueId);
    }

    if (subValueRef.current) {
      subValueRef.current.classList.add(subValueUniqueId);
    }

    // Create a style element with !important rules for label, value, and subValue
    const style = document.createElement("style");
    style.innerHTML = `
      .${valueUniqueId} {
        font-size: ${valueSize} !important;
        font-weight: 900 !important;
        line-height: 0.9 !important;
        color: ${color} !important;
        display: flex !important;
        align-items: baseline !important;
        justify-content: center !important;
        width: 100% !important;
        overflow: visible !important;
        text-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
        letter-spacing: -0.02em !important;
        white-space: nowrap !important;
      }
      
      .${labelUniqueId} {
        font-size: ${labelSize} !important;
        font-weight: ${isSpecialLabel ? 700 : 500} !important;
        color: #4B5563 !important;
        margin-bottom: 4px !important;
        text-align: center !important;
      }

      .${subValueUniqueId} {
        font-size: ${subValueSize} !important;
        font-weight: 400 !important;
        color: #6B7280 !important;
        margin-left: 8px !important;
        opacity: 0.8 !important;
        vertical-align: baseline !important;
      }
    `;
    document.head.appendChild(style);

    // Log the actual size after rendering
    setTimeout(() => {
      if (valueRef.current) {
        console.log(
          `${label} element width: ${valueRef.current.offsetWidth}px, height: ${valueRef.current.offsetHeight}px`
        );
        console.log(
          `Applied styles with class: ${valueUniqueId}, font size: ${valueSize}`
        );
      }
    }, 100);

    // Clean up
    return () => {
      document.head.removeChild(style);
    };
  }, [label, value, subValue, valueSize, subValueSize, color]);

  if (inline) {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          style={{
            fontSize: labelSize,
            fontWeight: 500,
            color: "#4B5563",
            marginRight: "8px",
          }}
        >
          {label}
        </span>
        <div
          ref={valueRef}
          // Styles will be applied via dynamic CSS
        >
          <span>{value}</span>
          {subValue && (
            <span
              ref={subValueRef}
              // Styles will be applied via dynamic CSS
            >
              {subValue}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "0 20px",
      }}
    >
      <div
        ref={labelRef}
        // Styles will be applied via dynamic CSS
      >
        {label}
      </div>
      <div
        ref={valueRef}
        // Styles will be applied via dynamic CSS
      >
        <span>{value}</span>
        {subValue && (
          <span
            ref={subValueRef}
            // Styles will be applied via dynamic CSS
          >
            {subValue}
          </span>
        )}
      </div>
    </div>
  );
};

export default LargeMetric;
