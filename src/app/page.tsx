"use client";

import React, { useState } from 'react';
import { 
  Skull, AlertTriangle, Brain, Heart, 
  User, Activity
} from 'lucide-react';

// Smoke Background Component
const SmokeBackground = () => {
  // Predefined positions for smoke elements
  const smokePositions = [
    { left: '20%', top: '30%' },
    { left: '45%', top: '60%' },
    { left: '70%', top: '25%' },
    { left: '85%', top: '70%' },
    { left: '10%', top: '80%' },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-800/30 to-transparent">
        <div className="absolute inset-0 animate-pulse opacity-20 bg-gradient-to-t from-red-900/20 via-orange-900/20 to-transparent"></div>
      </div>
      {smokePositions.map((pos, i) => (
        <div
          key={i}
          className={`
            absolute w-64 h-64 
            bg-gradient-to-b from-gray-500/20 to-transparent 
            rounded-full blur-xl animate-float
          `}
          style={{
            left: pos.left,
            top: pos.top,
            animationDelay: `${i * 2}s`,
            animationDuration: `${10 + i * 2}s`
          }}
        />
      ))}
    </div>
  );
};

// Glowing Text Component
interface GlowingTextProps {
  children: React.ReactNode;
  color?: string;
}

const GlowingText: React.FC<GlowingTextProps> = ({ children, color = "red" }) => (
  <span className={`relative inline-block animate-glow text-${color}-500`}>
    <span className="relative z-10">{children}</span>
    <span className={`absolute inset-0 blur-lg bg-${color}-500/30 animate-pulse`}></span>
  </span>
);

// Danger Level Indicator
interface DangerLevelProps {
  aqi: number;
}

const DangerLevel: React.FC<DangerLevelProps> = ({ aqi }) => {
  const getColor = () => {
    if (aqi > 300) return 'red';
    if (aqi > 200) return 'orange';
    return 'yellow';
  };

  return (
    <div className="relative flex items-center justify-center h-32 mb-6">
      <div className={`absolute w-32 h-32 bg-${getColor()}-500/20 rounded-full blur-xl animate-pulse`} />
      <div className="relative text-center">
        <Skull className={`w-12 h-12 text-${getColor()}-500 mx-auto mb-2 animate-pulse`} />
        <div className="text-2xl font-bold text-white">
          Toxicity Level
        </div>
        <div className={`text-4xl font-bold text-${getColor()}-500`}>
          {aqi}
        </div>
      </div>
    </div>
  );
};

// Component for real-time damage stats
const DamageStats: React.FC = () => (
  <div className="bg-gray-800/70 backdrop-blur-xl rounded-lg p-4 border border-red-500/30">
    <h2 className="text-lg font-semibold mb-4 text-red-400">
      Damage Accumulating Now:
    </h2>
    <div className="space-y-3">
      <DamageStat icon={<Brain className="w-5 h-5 text-red-500" />} label="Brain Aging" value="+2.3 hours" />
      <DamageStat icon={<Heart className="w-5 h-5 text-red-500" />} label="Heart Strain" value="Critical" />
      <DamageStat icon={<Activity className="w-5 h-5 text-red-500" />} label="Lung Capacity" value="-40%" />
    </div>
  </div>
);

// Individual damage stat row
interface DamageStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const DamageStat: React.FC<DamageStatProps> = ({ icon, label, value }) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-2">
      {icon}
      <span>{label}</span>
    </div>
    <GlowingText>{value}</GlowingText>
  </div>
);

// Family impact card component
interface FamilyImpactCardProps {
  icon: React.ElementType;
  title: string;
  impacts: string[];
  borderColor: string;
}

const FamilyImpactCard: React.FC<FamilyImpactCardProps> = ({ icon: Icon, title, impacts, borderColor }) => (
  <div className={`bg-gray-800/70 backdrop-blur-xl rounded-lg p-4 border ${borderColor}`}>
    <div className="flex items-center gap-2 mb-3">
      <Icon className={`w-6 h-6 ${borderColor.replace('border-', 'text-').replace('/30', '')}`} />
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
    <div className="space-y-2">
      {impacts.map((impact, index) => (
        <p key={index} className={`${borderColor.replace('border-', 'text-').replace('/30', '-200')}`}>
          • {impact}
        </p>
      ))}
    </div>
  </div>
);

// Family impact section
interface FamilyImpactSectionProps {
  aqi: number;
}

const FamilyImpactSection: React.FC<FamilyImpactSectionProps> = ({ aqi }) => (
  <section className="pt-8">
    <h2 className="text-2xl font-bold mb-6 text-center">
      <GlowingText>Your Family is at Risk</GlowingText>
    </h2>
    
    <div className="space-y-4">
      <FamilyImpactCard
        icon={User}
        title="Children's Impact"
        borderColor="border-orange-500/30"
        impacts={[
          `Brain development slowed by ${(aqi/100).toFixed(1)} months`,
          `Growth reduced by ${(aqi/200).toFixed(1)} cm`,
          `Learning ability down ${(aqi/10).toFixed(0)}%`
        ]}
      />
      <FamilyImpactCard
        icon={Heart}
        title="Elderly Impact"
        borderColor="border-purple-500/30"
        impacts={[
          `Heart strain increased ${(aqi/5).toFixed(0)}%`,
          'Recovery time doubled',
          'High risk of complications'
        ]}
      />
    </div>
  </section>
);

// Share button component
interface ShareButtonProps {
  text?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ text }) => {
  const buttonText = text || "Warn your loved ones now";
  const handleShare = () => {
    const shareText = encodeURIComponent(
      "⚠️ The air we're breathing is toxic... Learn more about the health impacts: https://air.nmn.gl\n\n🫁 Protect your family - See how it's affecting our children and elderly RIGHT NOW! 😷\n\nStay informed, stay safe! 🏥"
    );
    const whatsappUrl = `https://api.whatsapp.com/send/?text=${shareText}&type=custom_url&app_absent=0`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button 
      onClick={handleShare}
      className="w-full bg-red-500 hover:bg-red-600 text-white py-4 px-6 rounded-lg font-bold text-lg flex items-center justify-center gap-2 shadow-lg relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 animate-pulse"></div>
      <span className="relative flex items-center gap-2">
        <AlertTriangle className="w-6 h-6" />
        {buttonText}
      </span>
    </button>
  );
};

// Main Dashboard Component
const ToxicAirDashboard: React.FC = () => {
  const [aqi] = useState(285);
  
  return (
    <div className="min-h-screen relative bg-gray-900 text-white">
      <SmokeBackground />
      
      <div className="relative max-w-md mx-auto p-4 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            <GlowingText>Toxic Air Alert</GlowingText>
          </h1>
          <DangerLevel aqi={aqi} />
        </div>

        <div className="space-y-4">
          <DamageStats />
          <ShareButton text="Save lives & Share now" />
          <FamilyImpactSection aqi={aqi} />
        </div>

        <ShareButton text="Warn your loved ones now" />
      </div>
    </div>
  );
};

export default ToxicAirDashboard;
