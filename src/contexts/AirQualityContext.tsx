import React, { createContext, useContext, useState } from 'react';

interface AirQualityData {
  aqi: number;
  city: string;
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