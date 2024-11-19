import React, { createContext, useContext, useState } from 'react';

interface AirQualityData {
  aqi: number;
  city: string;
  stationName?: string;
  dominentpol?: string;
  time?: string;
  attribution?: Array<{
    name: string;
    url: string;
  }>;
  measurements?: {
    pm25?: { v: number };
    pm10?: { v: number };
    co?: { v: number };
    no2?: { v: number };
    so2?: { v: number };
    o3?: { v: number };
    t?: { v: number };    // temperature
    h?: { v: number };    // humidity
    w?: { v: number };    // wind
    wg?: { v: number };   // wind gust
    dew?: { v: number };  // dew point
    p?: { v: number };    // pressure
  };
  forecast?: {
    daily?: {
      pm25?: {
        avg: number;
        day: string;
      }[];
      aqi?: number[];
    };
  };
  location?: {
    name: string;
    coordinates: [number, number];
  };
  timestamp?: string;
}

interface AirQualityContextType {
  airQuality: AirQualityData;
  setAirQuality: (data: AirQualityData) => void;
}

const AirQualityContext = createContext<AirQualityContextType | undefined>(undefined);

export const AirQualityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [airQuality, setAirQuality] = useState<AirQualityData>({
    city: 'Delhi',
    aqi: 449
  });

  return (
    <AirQualityContext.Provider value={{ airQuality, setAirQuality }}>
      {children}
    </AirQualityContext.Provider>
  );
};

export const useAirQuality = () => {
  const context = useContext(AirQualityContext);
  if (context === undefined) {
    throw new Error('useAirQuality must be used within an AirQualityProvider');
  }
  return context;
}; 