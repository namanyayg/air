"use client";

import React, { useState } from 'react';
import { 
  Shield
} from 'lucide-react';
// import GlowingText from '@/components/GlowingText';
import StatsCounter from '@/components/StatsCounter';
import AgeImpact from '@/components/AgeImpact';
import ShareButton from '@/components/ShareButton';
import SmokeBackground from '@/components/SmokeBackground';
import HopeSection from '@/components/HopeSection';
import SourcesSection from '@/components/SourcesSection';
import LungVisualization from '@/components/LungVisualization';
import ImmunityMythSection from '@/components/ImmunityMyth';
import Footer from '@/components/Footer';
import { LocationAwareHeader } from '@/components/LocationAwareHeader';
import { AirQualityProvider, useAirQuality } from '@/contexts/AirQualityContext';
import PollutantsTable from '@/components/PollutantsTable';
import TraditionalWisdomSection from '@/components/TraditionalWisdomSection';

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

// Newborn Impact Section
const NewbornImpactSection: React.FC = () => {
  return (
    <section>
      <div className="bg-black/50 backdrop-blur-xl rounded-lg p-6 border border-emerald-500/30">
        <h2 className="text-2xl font-bold mb-4 text-center text-emerald-400">
          Protect Our Children
        </h2>
        
        <div className="flex flex-wrap justify-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="relative">
              {i === 0 ? (
                <div>
                  <span className="text-4xl">👶</span>
                </div>
              ) : (
                <div>
                  <span className="text-4xl">🛡️</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-lg font-semibold text-emerald-400 mb-4">
          Act for their future
        </p>

        <p className="text-gray-300 text-center">
          Clean air is their right.<br/>
          Join our community action.
        </p>
      </div>
    </section>
  );
};

// Utility function to check if location is in India
const isIndianLocation = (airQuality: any) => {
  // If city name contains "India", it's definitely in India
  if (airQuality.city?.toLowerCase().includes('india')) {
    return true;
  }

  // Check coordinates if available
  // India's approximate bounding box:
  // Lat: 6.5546° N to 35.6745° N
  // Long: 68.1113° E to 97.3953° E
  if (airQuality.coordinates) {
    const lat = airQuality.coordinates.latitude;
    const lon = airQuality.coordinates.longitude;
    return (
      lat >= 6.5546 && lat <= 35.6745 &&
      lon >= 68.1113 && lon <= 97.3953
    );
  }

  return false;
};

// Main Dashboard Component
const ToxicAirDashboard: React.FC = () => {
  const [startTime] = useState<number>(Date.now());
  const { airQuality } = useAirQuality();

  return (
    <div className="min-h-screen relative bg-gray-900 text-white">
      <SmokeBackground />
      
      <div className="relative max-w-md mx-auto p-4 space-y-6">
        <LocationAwareHeader />
        <LungVisualization />
        <AgeImpact aqi={airQuality.aqi} />
        <HopeSection />
        {isIndianLocation(airQuality) && <NewbornImpactSection />}
        {isIndianLocation(airQuality) && (
          <ShareButton text="Share & Spread Awareness for Babies" color="emerald" icon={Shield} />
        )}
        <ImmunityMythSection />
        <ShareButton text="Share and STOP this myth" color="emerald" icon={Shield} />
        <StatsCounter startTime={startTime} />
        <PollutantsTable 
          measurements={airQuality.measurements} 
          colors={getColorClasses(airQuality.aqi)} 
        />
        <TraditionalWisdomSection />
        <SourcesSection />
        <Footer />
      </div>
    </div>
  );
};

// Wrap the export with the provider
export default function Page() {
  return (
    <AirQualityProvider>
      <ToxicAirDashboard />
    </AirQualityProvider>
  );
}
