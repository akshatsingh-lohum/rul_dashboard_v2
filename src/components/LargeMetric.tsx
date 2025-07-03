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
    const numericSize = parseInt(size.replace('px', ''));
    return `${Math.round(numericSize * METRIC_SIZE_MULTIPLIER)}px`;
  };

  // Special handling for SoH to match RUL
  const isRUL = label.startsWith("RUL");
  const isSoH = label.startsWith("SoH");
  const isOCV = label.startsWith("OCV");
  
  // For SoH and RUL, use the same sizes
  const isSpecialLabel = isRUL || isOCV || isSoH;
  
  // Use the same size calculation for SoH and RUL
  const labelSize = isSpecialLabel 
    ? `${Math.round(48 * METRIC_SIZE_MULTIPLIER)}px`
    : getFontSize(baseFontSizes[size].label);
  
  // Standard value size for all metrics
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
    style.setAttribute('data-metric-styles', 'true');
    style.innerHTML = `
      .${valueUniqueId}, 
      .${valueUniqueId} *,
      .${valueUniqueId} > * {
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
      
      .${labelUniqueId},
      .${labelUniqueId} *,
      .${labelUniqueId} > * {
        font-size: ${labelSize} !important;
        font-weight: ${isSpecialLabel ? 700 : 500} !important;
        color: #4B5563 !important;
        margin: 0 !important;
        padding: 0 !important;
        text-align: center !important;
        line-height: 1.2 !important;
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

  // Common styles for value display
  const valueStyles = {
    fontSize: isSoH ? labelSize : valueSize, // Use labelSize for SoH to match RUL
    fontWeight: isSoH ? 700 : 900, // Match RUL's font weight for SoH
    lineHeight: 0.9,
    color: color,
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    width: '100%',
    overflow: 'visible',
    textShadow: '0 4px 8px rgba(0,0,0,0.15)',
    letterSpacing: isSoH ? 'normal' : '-0.02em',
    whiteSpace: 'nowrap',
    margin: 0,
    padding: 0,
    fontFamily: isSoH ? 'inherit' : 'Inter, sans-serif', // Match RUL's font
  };

  if (inline) {
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          style={{
            fontSize: labelSize,
            fontWeight: 500,
            color: "#4B5563",
            marginRight: "8px",
            ...(isSoH ? { fontSize: valueSize, fontWeight: 700 } : {})
          }}
        >
          {label}
        </span>
        <div
          style={valueStyles}
          ref={valueRef}
        >
          <span>{value}</span>
          {subValue && (
            <span
              style={{ 
                fontSize: subValueSize, 
                marginLeft: '8px',
                fontWeight: 400,
                color: "#6B7280",
                opacity: 0.8,
                verticalAlign: 'baseline',
              }}
              ref={subValueRef}
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
        style={{ 
          fontSize: labelSize,
          fontWeight: isSpecialLabel ? 700 : 500,
          color: "#4B5563",
          margin: 0,
          padding: 0,
          textAlign: 'center',
          lineHeight: '1.2',
        }}
        ref={labelRef}
      >
        {label}
      </div>
      <div
        style={valueStyles}
        ref={valueRef}
      >
        <span>{value}</span>
        {subValue && (
          <span
            style={{ 
              fontSize: subValueSize,
              fontWeight: 400,
              color: "#6B7280",
              marginLeft: '8px',
              opacity: 0.8,
              verticalAlign: 'baseline',
            }}
            ref={subValueRef}
          >
            {subValue}
          </span>
        )}
      </div>
    </div>
  );
};

export default LargeMetric;
