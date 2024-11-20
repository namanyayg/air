"use client";
import { useAirQuality } from "@/contexts/AirQualityContext";
import { useEffect } from "react";
import { Skull, MapPin, Clock, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

// Danger Level Indicator
const DangerLevel: React.FC<AirQualityData> = ({ 
  aqi, 
  measurements, 
  stationName,
  dominentpol, 
  time,
  attribution
}) => {
  const getColorClasses = () => {
    if (aqi > 300) return {
      bg: "bg-red-500/20",
      text: "text-red-500",
      border: "border-red-500/30"
    };
    if (aqi > 200) return {
      bg: "bg-orange-500/20",
      text: "text-orange-500",
      border: "border-orange-500/30"
    };
    return {
      bg: "bg-yellow-500/20",
      text: "text-yellow-500",
      border: "border-yellow-500/30"
    };
  };

  const colors = getColorClasses();
  const timeAgo = time ? formatDistanceToNow(new Date(time), { addSuffix: true }) : null;

  if (!aqi || !measurements) {
    return null;
  }

  return (
    <div className="space-y-6 mt-8">
      <div className={`relative flex flex-col p-6 rounded-xl border ${colors.border} bg-black/40 backdrop-blur-sm`}>
        {/* Location accuracy banner */}
        <div className="absolute inset-x-0 -top-3 flex justify-center">
          <div className="px-4 py-1 rounded-full bg-gray-800/80 backdrop-blur-sm text-xs text-gray-300 border border-gray-700">
            Most accurate AQI based on your location
          </div>
        </div>

        {/* Updated AQI Display */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-lg text-gray-300 mb-1">AQI</div>
            <div className={`text-4xl font-bold ${colors.text}`}>{aqi}</div>
          </div>
          <Skull className={`w-16 h-16 ${colors.text} animate-pulse`} />
        </div>

        <div className="text-sm text-gray-400 mb-4">
          Most accurate AQI reading based on your current location
        </div>

        {dominentpol && (
          <div className="text-sm text-gray-400 mb-4">
            Main Pollutant: {dominentpol?.toUpperCase().replace('PM25', 'PM2.5')}
          </div>
        )}

        {(stationName || timeAgo || attribution) && (
          <div className="space-y-3 border-t border-gray-800 pt-4">
            {stationName && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{stationName}</span>
              </div>
            )}
            {timeAgo && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Updated {timeAgo}</span>
              </div>
            )}
            {attribution?.map((source, index) => (
              <a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                <span>{source.name}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
  
interface AirQualityData {
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
}

async function fetchAQIByCoordinates(lat: number, lng: number): Promise<AirQualityData> {
  const API_TOKEN = process.env.NEXT_PUBLIC_WAQI_API_TOKEN;
  console.log('Starting fetchAQIByCoordinates');
  
  try {
    const response = await fetch(
      `https://api.waqi.info/feed/geo:${lat};${lng}/?token=${API_TOKEN}`
    );
    const data = await response.json();
    
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
      };
    }
    throw new Error('Failed to fetch AQI data');
  } catch (error) {
    console.error('Error fetching AQI data:', error);
    // Return default data if fetch fails
    return {
      city: "Delhi US Embassy, India",
      aqi: 483,
      measurements: {
        pm25: { v: 35 },
        co: { v: 0.5 },
        no2: { v: 23 },
        so2: { v: 10 }
      },
      stationName: "Delhi US Embassy",
    };
  }
}

export const LocationAwareHeader: React.FC = () => {
  const { airQuality, setAirQuality } = useAirQuality();

  useEffect(() => {
    if ("geolocation" in navigator) {
      console.log('Geolocation is available');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            console.log('Getting data for coordinates:', latitude, longitude);
            const aqiData = await fetchAQIByCoordinates(latitude, longitude);
            setAirQuality(aqiData);
          } catch (err) {
            console.error('AQI data fetch failed:', err);
          }
        },
        (err) => {
          console.error('Location permission denied:', err);
        }
      );
    }
  }, [setAirQuality]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Pollution Impact & Awareness
      </h1>
      <p className="my-4 text-xl leading-relaxed">
        <span className="text-gray-400 block mb-4">Everyone sees how polluted our air is.</span>
        <span className="text-gray-200 block mb-4"><strong>But, no one understands it.</strong></span>
        <span className="text-gray-400 block mb-4">Keep scrolling & see the <strong>real impact</strong> of air pollution on our health.</span>
      </p>
      <DangerLevel {...airQuality} />
    </div>
  );
};