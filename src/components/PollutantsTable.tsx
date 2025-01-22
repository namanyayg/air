import { Cloud, AlertCircle, Heart, Brain } from "lucide-react";
import React from "react";

interface PollutantsTableProps {
  measurements?: {
    pm25?: { v: number };
    pm10?: { v: number };
    co?: { v: number };
    no2?: { v: number };
    so2?: { v: number };
  };
  colors: {
    text: string;
    border: string;
    bg: string;
  };
}

export default function PollutantsTable({ measurements, colors }: PollutantsTableProps) {
  const pollutantInfo = [
    { 
      name: "PM2.5", 
      value: measurements?.pm25?.v, 
      unit: "μg/m³",
      icon: <Cloud className="w-4 h-4" />,
      explanation: "Fine particles - use air purifiers indoors"
    },
    { 
      name: "PM10", 
      value: measurements?.pm10?.v, 
      unit: "μg/m³",
      icon: <AlertCircle className="w-4 h-4" />,
      explanation: "Larger particles - wear masks outdoors"
    },
    { 
      name: "CO", 
      value: measurements?.co?.v, 
      unit: "mg/m³",
      icon: <Heart className="w-4 h-4" />,
      explanation: "Carbon monoxide - ensure good ventilation"
    },
    { 
      name: "NO₂", 
      value: measurements?.no2?.v, 
      unit: "ppb",
      icon: <Brain className="w-4 h-4" />,
      explanation: "Vehicle emissions - avoid high-traffic areas"
    },
    { 
      name: "SO₂", 
      value: measurements?.so2?.v, 
      unit: "ppb",
      icon: <Cloud className="w-4 h-4" />,
      explanation: "Industrial emissions - check daily forecasts"
    }
  ];

  if (!measurements) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <tbody>
          {pollutantInfo
            .filter((pollutant) => pollutant.value !== undefined)
            .map((pollutant) => (
              <React.Fragment key={pollutant.name}>
                <tr 
                  className="border-b border-gray-800 hover:bg-black/20"
                >
                  <td className="py-2 px-4 font-medium text-gray-300 flex items-center gap-2">
                    <span className="text-gray-400 w-4 h-4">{pollutant.icon}</span>
                    <span>{pollutant.name}</span>
                  </td>
                  <td className={`py-2 px-4 text-right ${colors.text} font-bold`}>
                    {pollutant.value ? `${pollutant.value} ${pollutant.unit}` : '-'}
                  </td>
                </tr>
                <tr className="bg-black/10">
                  <td colSpan={2} className="py-2 px-4 text-gray-400 text-sm text-center">
                    {pollutant.explanation}
                  </td>
                </tr>
              </React.Fragment>
            ))}
        </tbody>
      </table>
    </div>
  );
} 