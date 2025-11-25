import React from "react";

export default function Gauge({ value = 0, label = "", color = "#00aaff" }) {
  const percent = Math.min(Math.max(value, 0), 100);
  const angle = (percent / 100) * 180;

  // Auto unit detection
  const unit =
    label.toLowerCase().includes("temp") ? "°C" :
    label.toLowerCase().includes("humid") ? "%" :
    "";

  return (
    <div className="relative w-56 h-32 flex flex-col items-center">
      
      {/* Label on top */}
      <p className="text-lg font-semibold mb-1">{label}</p>

      {/* Gauge curve */}
      <div className="relative w-full h-24">
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <path
            d="M10 50 A40 40 0 0 1 90 50"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
          />
          <path
            d="M10 50 A40 40 0 0 1 90 50"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeDasharray="180"
            strokeDashoffset={180 - angle}
          />
        </svg>

        {/* Value centered inside arc */}
        <div className="absolute inset-0 flex items-center justify-center translate-y-3">
          <p className="text-3xl font-bold">
            {value}{unit}
          </p>
        </div>
      </div>
    </div>
  );
}
