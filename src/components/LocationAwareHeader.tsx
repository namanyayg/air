"use client";
import { useAirQuality } from "@/contexts/AirQualityContext";
import { useEffect, useState } from "react";
import { Skull, MapPin, Clock, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

// ============= Interfaces =============
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

interface AQIStatsProps {
  aqi: number;
}

// ============= Utility Functions =============
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const getColorClasses = (aqi: number) => {
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

const fetchAQIByCoordinates = async (lat: number, lng: number): Promise<AirQualityData> => {
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
};

// ============= Sub Components =============
const AQIStats: React.FC<AQIStatsProps> = ({ aqi }) => {
  const cigarettes = Math.floor(aqi/22); // 22 μg/m3 PM2.5 ≈ 1 cigarette
  const hoursLost = Math.floor(aqi/180);

  return (
    <div className="text-gray-400">
      <div className="my-2">
        <div className="text-lg animate-pulse">{Array(cigarettes).fill('🚬').join('')}</div>
        <div className="italic">You are smoking {cigarettes} cigarettes today</div>
      </div>
      {hoursLost > 0 && (
        <div className="my-2">
          <div className="text-xl font-bold text-red-500 animate-pulse"><Clock className="w-5 h-5 inline -mt-1" /> {hoursLost} {hoursLost === 1 ? 'hour' : 'hours'}</div>
          <div className="italic">Your lifespan is reduced by {hoursLost} {hoursLost === 1 ? 'hour' : 'hours'} today</div>
        </div>
      )}
    </div>
  );
};

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 mt-8">
      <div className="relative flex flex-col p-6 rounded-xl border border-gray-700 bg-black/40">
        {/* Location accuracy banner skeleton */}
        <div className="absolute inset-x-0 -top-3 flex justify-center">
          <div className="w-64 h-6 rounded-full bg-gray-800"></div>
        </div>

        {/* AQI Display skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-3">
            <div className="w-16 h-7 bg-gray-800 rounded"></div>
            <div className="w-24 h-10 bg-gray-800 rounded"></div>
            <div className="w-48 h-5 bg-gray-800 rounded"></div>
          </div>
          <div className="w-16 h-16 bg-gray-800 rounded"></div>
        </div>

        {/* Stats skeleton */}
        <div className="space-y-4">
          <div className="w-full h-12 bg-gray-800 rounded"></div>
          <div className="w-full h-12 bg-gray-800 rounded"></div>
        </div>

        {/* Footer skeleton */}
        <div className="border-t border-gray-800 mt-4 pt-4 space-y-3">
          <div className="w-48 h-5 bg-gray-800 rounded"></div>
          <div className="w-36 h-5 bg-gray-800 rounded"></div>
        </div>
      </div>
    </div>
  );
};

// ============= Main Components =============
const DangerLevel: React.FC<AirQualityData> = ({ 
  aqi, 
  measurements, 
  stationName,
  dominentpol, 
  time,
  attribution,
  forecast,
  coordinates
}) => {
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  // const [yesterdayAQI, setYesterdayAQI] = useState<number | null>(null);
  const [userCoordinates, setUserCoordinates] = useState<{latitude: number, longitude: number} | null>(null);

  useEffect(() => {
    // Check location permission on mount
    if ("geolocation" in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        console.log('Location permission query result:', result);
        // setShowLocationPrompt(result.state === 'prompt' || result.state === 'denied');
      });
    }
  }, []);

  useEffect(() => {
    // Calculate yesterday's AQI from forecast
    if (forecast?.daily) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const pollutants = ['pm25', 'pm10', 'o3'] as const;
      let maxAvg = 0;

      pollutants.forEach(pollutant => {
        const yesterdayData = forecast.daily?.[pollutant]?.find(d => d.day === yesterdayStr);
        if (yesterdayData?.avg && yesterdayData.avg > maxAvg) {
          maxAvg = yesterdayData.avg;
        }
      });

      // setYesterdayAQI(maxAvg || null);
    }
  }, [forecast]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      });
    }
  }, []);

  const colors = getColorClasses(aqi);
  const timeAgo = time ? formatDistanceToNow(new Date(time), { addSuffix: true }) : null;

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => setShowLocationPrompt(false),
        (error) => {
          console.error('Location error:', error);
          console.log('SHOWING LOCATION PROMPT????')
          setShowLocationPrompt(true);
        }
      );
    }
  };

  if (showLocationPrompt) {
    return (
      <div className="w-full p-6 rounded-xl border border-gray-700 bg-gray-800/50 flex justify-center">
        <button
          onClick={requestLocation}
          className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 
            text-sm text-white transition-colors duration-200 
            flex items-center justify-center gap-2"
        >
          <MapPin className="w-4 h-4" />
          Use Current Location for data
        </button>
      </div>
    );
  }

  if (!aqi || !measurements) {
    return <LoadingSkeleton />;
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

        {/* AQI Display */}
        <div className="flex items-center justify-between -mb-4">
          <div>
            <div className="text-lg text-gray-300 mb-1">AQI</div>
            <div className={`text-4xl font-bold ${colors.text}`}>{aqi}</div>
            {dominentpol && (
              <div className="text-sm text-gray-400 mb-4">
                Main Pollutant: {dominentpol?.toUpperCase().replace('PM25', 'PM2.5')}
              </div>
            )}
          </div>
          <Skull className={`w-16 h-16 ${colors.text} opacity-80`} />
        </div>

        {/* Daily Impact Stats */}
        <AQIStats aqi={aqi} />

        {(stationName || timeAgo || attribution) && (
          <div className="space-y-3 border-t border-gray-800 pt-4">
            {stationName && (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>
                  Station{userCoordinates && coordinates && (
                    <span> is&nbsp;
                      {calculateDistance(
                        userCoordinates.latitude,
                        userCoordinates.longitude,
                        coordinates.latitude,
                        coordinates.longitude
                      ).toFixed(1)} km away
                    </span>
                  )}: {stationName}
                  
                </span>
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

export const LocationAwareHeader: React.FC = () => {
  const { airQuality, setAirQuality } = useAirQuality();
  const [localAQIData, setLocalAQIData] = useState<AirQualityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('LocationAwareHeader useEffect triggered');
    
    const fetchInitialData = async () => {
      console.log('Starting fetchInitialData');
      setIsLoading(true);
      
      try {
        const aqiData = await fetchAQIByCoordinates(0, 0);
        
        setLocalAQIData(aqiData);
        console.log('localAQIData updated');
        
        setAirQuality(aqiData);
        console.log('airQuality context updated');
      } catch (err) {
        console.error('Initial AQI data fetch failed:', err);
      } finally {
        setIsLoading(false);
        console.log('Loading state set to false');
      }
    };

    fetchInitialData();

    if ("geolocation" in navigator) {
      console.log('Geolocation available, requesting position');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log('Got user position:', position.coords);
          try {
            const { latitude, longitude } = position.coords;
            const aqiData = await fetchAQIByCoordinates(latitude, longitude);
            
            setLocalAQIData(aqiData);
            console.log('localAQIData updated with location data');
            
            setAirQuality(aqiData);
            console.log('airQuality context updated with location data');
          } catch (err) {
            console.error('Location-based AQI data fetch failed:', err);
          } finally {
            setIsLoading(false);
            console.log('Loading state set to false after location fetch');
          }
        },
        (err) => {
          console.error('Location permission denied:', err);
          setIsLoading(false);
        }
      );
    } else {
      console.log('Geolocation not available');
      setIsLoading(false);
    }
  }, [setAirQuality]);

  if (isLoading) {
    console.log('Rendering LoadingSkeleton');
    return <LoadingSkeleton />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-300 text-center">Air Quality Health Report</h1>
      <DangerLevel {...(localAQIData || airQuality)} />
    </div>
  );
};