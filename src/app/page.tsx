"use client";

import React, { useState } from 'react';
import { 
  Activity, Clock, Shield, User
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
// import AQITable from '@/components/AQITable';
// import airTableData from '../../public/air-table.json';

// Newborn Impact Section
const NewbornImpactSection: React.FC = () => {
  return (
    <section>
      <div className="bg-black/50 backdrop-blur-xl rounded-lg p-6 border border-red-500/30">
        <h2 className="text-2xl font-bold mb-4 text-center text-red-400">
          Our Newborns Are Dying
        </h2>
        
        <div className="flex flex-wrap justify-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="relative">
              {i === 0 ? (
                <div>
                  <span className="text-4xl">💔</span>
                </div>
              ) : (
                <div>
                  <span className="text-4xl">❤️</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-lg font-semibold text-red-400 mb-4">
          1 in 5 infant deaths in India
        </p>

        <p className="text-gray-300 text-center">
          Air pollution is killing our most vulnerable.<br/>Each breath they take in their first moments contains toxic particles.
        </p>
      </div>
    </section>
  );
};


// Update DailyImpactSection with scientifically-validated impacts
const DailyImpactSection: React.FC<{ aqi: number }> = ({ aqi }) => {
  const impacts = {
    cigarettes: {
      icon: Activity,
      title: "Cigarette Equivalent",
      // Updated based on Berkeley Earth study correlating PM2.5 to cigarette smoking
      value: `${Array(Math.floor(aqi * 2/22)).fill('🚬').join('')}`, // 22 μg/m3 PM2.5 ≈ 1 cigarette
      description: "Each day in this air equals smoking these many cigarettes"
    },
    life: {
      icon: Clock,
      title: "Life Impact",
      // Based on WHO guidelines  on air quality and mortality
      value: `${Math.floor(aqi/180)} hours lost`,
      description: "Each day in severe pollution reduces life expectancy"
    },
  };

  return (
    <section className="pt-8">
      <h2 className="text-2xl font-bold mb-2 text-center">
        Today&apos;s Health Impact 🧑‍⚕️
      </h2>
      <p className="text-center text-red-500 mb-6">
        Current air quality is affecting your body
      </p>
      
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(impacts).map(([key, impact]) => (
          <div 
            key={key}
            className="bg-black/50 backdrop-blur-xl rounded-lg p-4 border border-red-500/30"
          >
            <div className="flex items-center gap-3 mb-2">
              <impact.icon className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-bold">{impact.title}</h3>
            </div>
            <div className="text-2xl font-bold text-red-400 mb-2">
              {impact.value}
            </div>
            <p className="text-gray-300">
              {impact.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
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
        <DailyImpactSection aqi={airQuality.aqi} />
        <ShareButton text="Share the Truth" color="emerald" icon={User} />
        <AgeImpact aqi={airQuality.aqi} />
        {/* <AQITable airData={airTableData} /> */}
        <NewbornImpactSection />
        <ShareButton text="Share & Spread Awareness for Babies" color="emerald" icon={Shield} />
        <LungVisualization />
        <ImmunityMythSection />
        <ShareButton text="Share and STOP this myth" color="emerald" icon={Shield} />
        <StatsCounter startTime={startTime} />
        <ShareButton text="Share with Family" />
        <HopeSection />
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
