import React, { createContext, useContext, useState } from 'react';
import { fetchAQIByCoordinates } from '@/lib/utils';
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
  refetchAQI: (lat: number, lon: number) => Promise<void>;
}

const AirQualityContext = createContext<AirQualityContextType>({
  airQuality: {
    city: 'Delhi',
    aqi: 449
  },
  setAirQuality: () => {},
  refetchAQI: async () => {},
});

export const AirQualityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [airQuality, setAirQuality] = useState<AirQualityData>({
    city: 'Delhi',
    aqi: 449
  });

  const refetchAQI = async (lat: number, lon: number) => {
    try {
      const data = await fetchAQIByCoordinates(lat, lon);
      setAirQuality(data);
    } catch (error) {
      console.error('Failed to refetch AQI:', error);
    }
  };

  return (
    <AirQualityContext.Provider value={{ airQuality, setAirQuality, refetchAQI }}>
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