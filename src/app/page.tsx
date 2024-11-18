"use client";

import React, { useState, useEffect } from 'react';
import { 
  Skull, Activity, Clock, Shield
} from 'lucide-react';
import GlowingText from '@/components/GlowingText';
import AgeImpact from '@/components/AgeImpact';
import ShareButton from '@/components/ShareButton';
import SmokeBackground from '@/components/SmokeBackground';
import HopeSection from '@/components/HopeSection';
import SourcesSection from '@/components/SourcesSection';
import LungVisualization from '@/components/LungVisualization';
import ImmunityMythSection from '@/components/ImmunityMyth';

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

// Individual damage stat row
interface DamageStatProps {
  icon?: React.ReactNode;
  label?: string;
  value?: React.ReactNode;
  className?: string;
}

const DamageStat: React.FC<DamageStatProps> = ({ icon, label, value, className }) => (
  <div className={`flex justify-between items-center ${className}`}>
    {label && <div className="flex items-center gap-2">
      {icon}
        <span>{label}</span>
      </div>
    }
    <GlowingText className={label ? "" : "flex-1"}>{value}</GlowingText>
  </div>
);


// New Stats Counter Component
interface StatsCounterProps {
  startTime: number;
}

const StatsCounter: React.FC<StatsCounterProps> = ({ startTime }) => {
  const [stats, setStats] = useState({
    seconds: 0,
    breaths: 0,
    deaths: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const secondsElapsed = (Date.now() - startTime) / 1000;
      
      // Average person takes 12-16 breaths per minute
      const breathsTaken = Math.floor(secondsElapsed * (14/60));
      
      // 2.1 million deaths per year converted to deaths per second
      const deathsPerSecond = 2100000 / (365 * 24 * 60 * 60);
      const deaths = deathsPerSecond * secondsElapsed;

      setStats({ 
        seconds: Math.floor(secondsElapsed),
        breaths: breathsTaken, 
        deaths, 
      });
    }, 100);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="bg-black/50 backdrop-blur-xl rounded-lg p-4 border border-red-500/30 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-red-400">
        Damage Since You Arrived:
      </h2>
      <div className="space-y-3">
        {/* <DamageStat 
          icon={<Clock className="w-5 h-5 text-red-500" />} 
          label="Seconds on Site" 
          value={<span className="font-mono">{stats.seconds.toLocaleString()}</span>} 
        /> */}
        <DamageStat 
          icon={<Activity className="w-5 h-5 text-red-500" />} 
          label="Toxic Breaths Taken" 
          value={<span className="font-mono">{stats.breaths.toLocaleString()}</span>} 
        />
        <DamageStat 
          icon={<Skull className="w-5 h-5 text-red-500" />} 
          label="Indians Died" 
          value={<span className="font-mono">{stats.deaths.toFixed(1)}</span>} 
        />
        <DamageStat 
          className="text-center"
          value={<span className="font-mono">
            {Array(Math.floor(stats.deaths)).fill('💀').join('')}
          </span>} 
        />
      </div>
    </div>
  );
};

// Update DailyImpactSection with scientifically-validated impacts
const DailyImpactSection: React.FC<{ aqi: number }> = ({ aqi }) => {
  const impacts = {
    cigarettes: {
      icon: Activity,
      title: "Cigarette Equivalent",
      // Updated based on Berkeley Earth study correlating PM2.5 to cigarette smoking
      value: `${Math.floor(aqi * 2/22)} cigarettes`, // 22 μg/m3 PM2.5 ≈ 1 cigarette
      description: "Each day in this air equals smoking these many cigarettes"
    },
    life: {
      icon: Clock,
      title: "Life Impact",
      // Based on WHO guidelines on air quality and mortality
      value: `${Math.floor(aqi/100)} hours lost`,
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

// Footer Component
const Footer: React.FC = () => (
  <footer className="relative mt-16 border-t border-gray-800">
    <div className="w-full bg-black/30 backdrop-blur-sm">
      <div className="max-w-md mx-auto text-center py-8 px-4 text-gray-400 text-sm">
        <div className="space-y-3">
          <p>
            Made by <a href="https://x.com/NamanyayG" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Namanyay Goel</a> in New Delhi
          </p>
          <p>
            &quot;Air&quot; is Non-Profit and is fully open source. Contributions &amp; ideas are welcome!
          </p>
          <p className="text-gray-500">जनहित में जारी © 2024</p>
          <p className="text-gray-300 mt-4">Jai Hind 🇮🇳</p>
        </div>
      </div>
    </div>
  </footer>
);

// Main Dashboard Component
const ToxicAirDashboard: React.FC = () => {
  const [aqi] = useState<number>(285);
  const [startTime] = useState<number>(Date.now());
  
  return (
    <div className="min-h-screen relative bg-gray-900 text-white">
      <SmokeBackground />
      
      <div className="relative max-w-md mx-auto p-4 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Air Alert
          </h1>
          <p className="text-center my-4">
            <span className="text-gray-100">Our country is in danger.</span><br />
            <span className="text-gray-300">The first step is <b>awareness</b>.</span>
          </p>
          <DangerLevel aqi={aqi} />
          <StatsCounter startTime={startTime} />
          <ShareButton text="Share the truth" />
        </div>

        <div className="space-y-4">
          <LungVisualization />
          <ImmunityMythSection />
          <ShareButton text="Share and STOP this myth" color="emerald" icon={Shield} />
          <AgeImpact aqi={aqi} />
          <DailyImpactSection aqi={aqi} />
          <ShareButton text="Share the truth" />
          <HopeSection />
          <SourcesSection />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ToxicAirDashboard;
