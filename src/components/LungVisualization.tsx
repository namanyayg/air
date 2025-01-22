import React from 'react';
import { Clock, Heart, LucideIcon } from 'lucide-react';
import ShareButton from '@/components/ShareButton';

const customStyles = `
  @keyframes float-particle-1 {
    0% {
      transform: translate(0, 0);
      opacity: 0.7;
    }
    25% {
      transform: translate(40px, -20px);
      opacity: 0.9;
    }
    50% {
      transform: translate(20px, 40px);
      opacity: 0.7;
    }
    75% {
      transform: translate(-30px, 10px);
      opacity: 0.9;
    }
    100% {
      transform: translate(0, 0);
      opacity: 0.7;
    }
  }

  @keyframes float-particle-2 {
    0% {
      transform: translate(0, 0);
      opacity: 0.8;
    }
    33% {
      transform: translate(-25px, -35px);
      opacity: 0.6;
    }
    66% {
      transform: translate(35px, 15px);
      opacity: 0.9;
    }
    100% {
      transform: translate(0, 0);
      opacity: 0.8;
    }
  }

  @keyframes float-particle-3 {
    0% {
      transform: translate(0, 0);
      opacity: 0.6;
    }
    50% {
      transform: translate(45px, 25px);
      opacity: 0.9;
    }
    100% {
      transform: translate(0, 0);
      opacity: 0.6;
    }
  }
`;

interface LungProps {
  aqi: number;
  label: string;
  description: string;
}

const Lung: React.FC<LungProps> = ({ aqi, label, description }) => {
  const particleCount = Math.floor(aqi * 1.5);
  const baseOpacity = aqi === 10 ? 0.3 : 0.7;
  
  return (
    <div className="flex-1 text-center">
      <style>{customStyles}</style>
      <div className={`text-sm mb-2 ${aqi > 200 ? 'text-red-400 font-bold' : 'text-gray-400'}`}>
        {label}
      </div>
      <div className="relative mx-auto w-40 h-40">
        <div 
          className="absolute inset-0 rounded-full shadow-lg"
          style={{
            background: aqi <= 10 
              ? 'linear-gradient(135deg, #ffd1dc 0%, #f8b4bc 100%)'
              : 'linear-gradient(135deg, #e4a5a5 0%, #8b6666 100%)'
          }}
        >
          <div 
            className="absolute inset-0 rounded-full opacity-50"
            style={{
              background: aqi <= 10
                ? 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,209,220,0.2) 100%)'
                : 'radial-gradient(circle, rgba(139,102,102,0.5) 0%, rgba(76,56,56,0.2) 100%)'
            }}
          />
          
          <div className="absolute inset-0 overflow-hidden rounded-full">
            {[...Array(particleCount)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${Math.random() * 3 + 0.5}px`,
                  height: `${Math.random() * 3 + 0.5}px`,
                  backgroundColor: aqi <= 10 ? '#666666' : '#222222',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: baseOpacity * (Math.random() * 0.7 + 0.3),
                  animation: `float-particle-${(i % 3) + 1} ${Math.random() * 15 + 8}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * -15}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-300">
        {description}
      </div>
    </div>
  );
};

interface ImpactCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ImpactCard: React.FC<ImpactCardProps> = ({ icon: Icon, title, description }) => (
  <div className="bg-gray-800/50 backdrop-blur-xl rounded-lg p-4 border border-red-500/20">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-5 h-5 text-red-500" />
      <h3 className="font-bold text-white">{title}</h3>
    </div>
    <p className="text-gray-300">{description}</p>
  </div>
);

const LungComparison: React.FC = () => {
  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold text-white text-center mb-2 flex items-center justify-center gap-2">
        Take Action Today 🛡️
      </h2>
      
      <div className="text-center mb-6">
        <div className="text-gray-200">
          Air quality affects every breath.<br/>
          See how your lungs look.
        </div>
      </div>

      <div className="flex gap-6 mb-6">
        <Lung 
          aqi={10} 
          label="Protected"
          description="With protection"
        />
        <Lung 
          aqi={400} 
          label="Exposed"
          description="Without protection"
        />
      </div>

      {/* Impact Section with Hope */}
      <div className="space-y-4 mt-8">
        <ImpactCard 
          icon={Clock}
          title="Protect Yourself"
          description="Use air purifiers and masks to reduce exposure"
        />
        
        <ImpactCard 
          icon={Heart}
          title="Stay Safe"
          description="Monitor air quality and stay informed"
        />
      </div>

      <ShareButton text="Share & Help Others Stay Safe" />
    </div>
  );
};

export default LungComparison;