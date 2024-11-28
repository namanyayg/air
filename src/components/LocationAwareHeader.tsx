"use client";
import { useAirQuality } from "@/contexts/AirQualityContext";
import { useEffect, useState } from "react";
import { Skull, MapPin, Clock, ExternalLink } from "lucide-react";
import { formatDistanceToNow, format } from 'date-fns';
import { AirQualityData, fetchAQIByCoordinates } from "@/lib/utils";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  TooltipItem,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

// ============= Interfaces =============
interface AQIStatsProps {
  aqi: number;
}

interface DangerLevelProps extends AirQualityData {
  setLocalAQIData: (data: AirQualityData) => void;
  setAirQuality: (data: AirQualityData) => void;
  currentLocation: {latitude: number; longitude: number} | null;
}

interface ForecastDay {
  avg: number;
  day: string;
  max?: number;
  min?: number;
}

interface Forecast {
  daily?: {
    o3?: ForecastDay[];
    pm10?: ForecastDay[];
    pm25?: ForecastDay[];
    uvi?: ForecastDay[];
  };
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

const LoadingSkeleton = () => {
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

const HistoricalStats: React.FC<{ forecast: Forecast }> = ({ forecast }) => {
  const getHistoricalAQI = (date: string) => {
    const dayData = forecast.daily;
    const pm25AQI = dayData?.pm25?.find(d => d.day === date)?.avg || 0;
    const pm10AQI = dayData?.pm10?.find(d => d.day === date)?.avg || 0;
    return Math.max(pm25AQI, pm10AQI);
  };

  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');
  const twoDaysAgo = format(new Date(Date.now() - 172800000), 'yyyy-MM-dd');
  
  const todayAQI = getHistoricalAQI(today);
  const yesterdayAQI = getHistoricalAQI(yesterday);
  const twoDaysAgoAQI = getHistoricalAQI(twoDaysAgo);

  const yesterdayCigarettes = Math.floor(yesterdayAQI/22);
  const yesterdayColors = getColorClasses(yesterdayAQI);

  const chartData = {
    labels: ['2 Days Ago', 'Yesterday', 'Today'],
    datasets: [{
      data: [twoDaysAgoAQI, yesterdayAQI, todayAQI],
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0,
      pointRadius: 4,
      pointBackgroundColor: 'rgb(239, 68, 68)',
      pointBorderColor: 'rgb(0, 0, 0)',
      pointBorderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgb(255, 255, 255)',
        bodyColor: 'rgb(255, 255, 255)',
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: TooltipItem<'line'>) => `AQI: ${context.raw}`
        }
      }
    },
    scales: {
      x: { 
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
        }
      },
      y: { 
        display: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.5)',
        }
      }
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-gray-800">
      <div className="flex items-start justify-between gap-4">
        <div className="text-left">
          <div className="text-sm text-gray-300">Yesterday</div>
          <div className={`text-3xl font-semibold ${yesterdayColors.text}`}>{yesterdayAQI}</div>
        </div>
        <div className="flex-1 text-right">
          <div className="text-gray-400">
            <div className="my-1">
              <div className="text-lg">{Array(yesterdayCigarettes).fill('🚬').join('')}</div>
              <div className="italic text-sm">You smoked {yesterdayCigarettes} cigarettes yesterday</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 h-32">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

// ============= Main Components =============
const DangerLevel: React.FC<DangerLevelProps> = ({ 
  aqi, 
  measurements, 
  stationName,
  dominentpol, 
  time,
  attribution,
  coordinates,
  currentLocation,
  forecast,
}) => {
  const colors = getColorClasses(aqi);
  const timeAgo = time ? formatDistanceToNow(new Date(time), { addSuffix: true }) : null;

  if (!aqi || !measurements) {
    return <LoadingSkeleton />;
  }

  return (
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

      {/* Station info and time/attribution */}
      {stationName && (
        <div className="flex items-center gap-2 text-sm text-gray-400 border-t border-gray-800 pt-4 mt-2">
          <MapPin className="w-4 h-4" />
          <span>
            Station{currentLocation && coordinates && (
              <span> is&nbsp;
                {calculateDistance(
                  currentLocation.latitude,
                  currentLocation.longitude,
                  coordinates.latitude,
                  coordinates.longitude
                ).toFixed(1)} km away
              </span>
            )}: {stationName}
          </span>
        </div>
      )}

      
      {(timeAgo || attribution) && (
        <div className="space-y-3 pt-4">
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

      {/* Add Share Button */}
      <div className="flex flex-col items-center gap-2 py-2 mt-4">
        <p className="text-sm text-gray-300 text-center italic">Help your loved ones protect their health</p>
        <button 
          onClick={async () => {
            const shareData = {
              title: "Air Pollution Alert",
              text: "Protect your family - See how our air is affecting our children and elderly RIGHT NOW! \n\nStay informed, stay safe!",
              url: "https://air.nmn.gl"
            };

            try {
              if (navigator.share) {
                await navigator.share(shareData);
              } else {
                const shareText = encodeURIComponent(
                  "Protect your family - See how our air is affecting our children and elderly RIGHT NOW! \n\nhttps://air.nmn.gl\n\nStay informed, stay safe!"
                );
                const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;
                window.open(whatsappUrl, '_blank');
              }
            } catch (err) {
              console.error('Error sharing:', err);
            }
          }}
          className="px-6 py-2 bg-blue-500/50 hover:bg-blue-500/30 text-blue-100 rounded-full border border-blue-500/90 transition-all duration-200 flex items-center gap-2"
        >
          <span>Share Air Quality Alert</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
            <polyline points="16 6 12 2 8 6"/>
            <line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
        </button>
      </div>

      {/* Historical Stats */}
      {forecast && <HistoricalStats forecast={forecast} />}

    </div>
  );
};

export const LocationAwareHeader = () => {
  const { airQuality, setAirQuality } = useAirQuality();
  const [localAQIData, setLocalAQIData] = useState<AirQualityData | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{latitude: number, longitude: number} | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      console.log('Starting fetchInitialData');
      
      // First fetch default location data immediately
      const defaultData = await fetchAQIByCoordinates(0, 0);
      setLocalAQIData(defaultData);
      setAirQuality(defaultData);
      
      // Try to get user location
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log('Successfully got location');
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setCurrentLocation(coords);
          
          const aqiData = await fetchAQIByCoordinates(coords.latitude, coords.longitude);
          setLocalAQIData(aqiData);
          setAirQuality(aqiData);
        },
        (error) => {
          console.error('Location fetch failed:', error);
          // We already have default data, so no need for fallback
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    };

    fetchInitialData();
  }, [setAirQuality]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-300 text-center mb-6">Air Quality Health Report</h1>
      <DangerLevel 
        {...(localAQIData || airQuality)} 
        setLocalAQIData={setLocalAQIData}
        setAirQuality={setAirQuality}
        currentLocation={currentLocation}
      />
    </div>
  );
};