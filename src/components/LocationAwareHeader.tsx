"use client";
import { Skull } from "lucide-react";
import { useAirQuality } from "@/contexts/AirQualityContext";
import { useEffect } from "react";

// Danger Level Indicator
interface DangerLevelProps {
  aqi: number;
}

const DangerLevel: React.FC<DangerLevelProps> = ({ aqi }) => {
  const getColorClasses = () => {
    if (aqi > 300) return {
      bg: "bg-red-500/20",
      text: "text-red-500"
    };
    if (aqi > 200) return {
      bg: "bg-orange-500/20",
      text: "text-orange-500"
    };
    return {
      bg: "bg-yellow-500/20",
      text: "text-yellow-500"
    };
  };

  const colors = getColorClasses();

  return (
    <div className="relative flex items-center justify-center h-32 mb-6">
      <div className={`absolute w-32 h-32 ${colors.bg} rounded-full blur-xl animate-pulse`} />
      <div className="relative text-center">
        <Skull className={`w-12 h-12 ${colors.text} mx-auto mb-2 animate-pulse`} />
        <div className="text-2xl font-bold text-white">
          Toxicity Level
        </div>
        <div className={`text-4xl font-bold ${colors.text}`}>
          {aqi}
        </div>
      </div>
    </div>
  );
};
  
interface AirQualityData {
  aqi: number;
  city: string;
}

async function fetchCityAQI(city: string): Promise<AirQualityData> {
  try {
    const response = await fetch('/air-data.json');
    const data = await response.json();
    
    // Convert city name to lowercase and hyphenate for matching
    const normalizedCity = city.toLowerCase().replace(/\s+/g, '-');
    
    // Get city data from the cities object
    const cityData = data.cities[normalizedCity];

    if (cityData) {
      return {
        city: cityData.location.name,
        aqi: cityData.aqi
      };
    }
    
    // Return Delhi data as fallback
    return {
      city: "Delhi US Embassy, India (दिल्ली अमेरिकी दूतावास)",
      aqi: 483 
    };
  } catch (error) {
    console.error('Error fetching AQI data:', error);
    // Return default data if fetch fails
    return {
      city: "Delhi US Embassy, India (दिल्ली अमेरिकी दूतावास)",
      aqi: 483
    };
  }
}

// Add these new interfaces and helper function at the top
export const LocationAwareHeader: React.FC = () => {
  const { airQuality, setAirQuality } = useAirQuality();

  useEffect(() => {
    // Try to get user's location in the background
    if ("geolocation" in navigator) {
      console.log('Geolocation is available');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            console.log('Getting current position');
            // Get city name from coordinates
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`
            );
            const data = await response.json();
            console.log('Detected city:', data.city);
            // Update AQI data for the detected city
            const cityAQI = await fetchCityAQI(data.city);
            setAirQuality(cityAQI);
          } catch (err) {
            console.error('Location detection failed:', err);
            // Keep using default Delhi data
          }
        },
        (err) => {
          console.error('Location permission denied:', err);
          // Keep using default Delhi data
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
      {/* <DangerLevel aqi={airQuality.aqi} /> */}
    </div>
  );
};