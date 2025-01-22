import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { useAirQuality } from '@/contexts/AirQualityContext';

interface City {
  name: string;
  lat: number;
  lon: number;
}

interface LocationSearchProps {
  onLocationUpdate: (isLoading: boolean) => void;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationUpdate }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { refetchAQI } = useAirQuality();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchLocations = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.waqi.info/search/?token=${process.env.NEXT_PUBLIC_WAQI_API_TOKEN}&keyword=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      
      if (data.status === 'ok') {
        const cities = data.data.map((item: any) => ({
          name: item.station.name,
          lat: item.station.geo[0],
          lon: item.station.geo[1]
        }));
        setSuggestions(cities);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    setShowSuggestions(true);
    if (searchQuery.length >= 3) {
      await searchLocations(searchQuery);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectCity = async (city: City) => {
    setQuery(city.name);
    setShowSuggestions(false);
    onLocationUpdate(true); // Start loading
    await refetchAQI(city.lat, city.lon);
    onLocationUpdate(false); // End loading
  };

  return (
    <div className="w-full space-y-2">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold text-gray-200">Change Location</h3>
        <p className="text-sm text-gray-400">Search for any city to see its air quality data</p>
      </div>
      
      <div className="relative w-full">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search for a city..."
            className="w-full px-4 py-2 bg-black/40 border border-gray-700 rounded-lg pl-10 focus:outline-none focus:border-blue-500 text-gray-200 placeholder-gray-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
        </div>

        {showSuggestions && (suggestions.length > 0 || isLoading) && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {isLoading ? (
              <div className="p-4 text-center text-gray-400">Loading...</div>
            ) : (
              suggestions.map((city, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectCity(city)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-800 text-gray-300 cursor-pointer transition-colors"
                >
                  {city.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 