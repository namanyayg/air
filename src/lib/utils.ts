import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export interface AirQualityData {
  aqi: number;
  city: string;
  measurements?: {
    pm25?: { v: number };
    pm10?: { v: number };
    co?: { v: number };
    no2?: { v: number };
    so2?: { v: number };
  };
  forecast?: {
    daily?: {
      pm25?: { avg: number; day: string; }[];
      pm10?: { avg: number; day: string; }[];
      o3?: { avg: number; day: string; }[];
      aqi?: number[];
    };
  };
  stationName?: string;
  dominentpol?: string;
  time?: string;
  attribution?: {
    name: string;
    url: string;
  }[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetchAQIByCoordinates = async (lat: number, lng: number): Promise<AirQualityData> => {
  const API_TOKEN = process.env.NEXT_PUBLIC_WAQI_API_TOKEN;
  
  try {
    // Use IP-based endpoint if coordinates are 0,0
    const endpoint = lat === 0 && lng === 0
      ? `https://api.waqi.info/feed/here/?token=${API_TOKEN}`
      : `https://api.waqi.info/feed/geo:${lat};${lng}/?token=${API_TOKEN}`;

    console.log('Fetching AQI data from:', endpoint);
    const response = await fetch(endpoint);
    const data = await response.json();
    console.log('AQI data:', data);
    if (data.status === 'ok') {
      return {
        city: data.data.city.name,
        stationName: data.data.city.name,
        aqi: data.data.aqi,
        measurements: {
          pm25: data.data.iaqi.pm25,
          pm10: data.data.iaqi.pm10,
          co: data.data.iaqi.co,
          no2: data.data.iaqi.no2,
          so2: data.data.iaqi.so2,
        },
        dominentpol: data.data.dominentpol,
        time: data.data.time.s,
        forecast: data.data.forecast,
        attribution: data.data.attribution,
        coordinates: {
          latitude: data.data.city.geo[0],
          longitude: data.data.city.geo[1]
        },
      };
    }
    throw new Error('Failed to fetch AQI data');
  } catch (error) {
    console.error('Error fetching AQI data:', error);
    throw error;
  }
};
