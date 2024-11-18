import { useEffect, useState } from "react";
import GlowingText from "./GlowingText";
import { Activity, Skull } from "lucide-react";

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

export default function StatsCounter({ startTime }: StatsCounterProps) {
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