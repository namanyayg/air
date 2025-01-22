// New Age Impact Component
import { useState, useEffect } from 'react';
import { User, Brain, Heart, Activity } from 'lucide-react';
import FamilyImpactCard from './FamilyImpactCard';
import ShareButton from './ShareButton';

interface AgeImpactProps {
  aqi: number;
}

type AgeGroups = {
  [key: string]: {
    title: string;
    color: string;
    icon: React.ElementType;
    impacts: string[];
    emotional: string;
  }
}

export default function AgeImpact({ aqi }: AgeImpactProps) {
  const [selectedAge, setSelectedAge] = useState<string>('');
  useEffect(() => {
    setSelectedAge('adult');
  }, []);

  const ageGroups: AgeGroups = {
    young: {
      title: "Young Adults (18-24)",
      color: "border-orange-500/30",
      icon: User,
      impacts: [
        "Regular exercise in filtered air spaces can boost immunity",
        "Using air quality apps helps make informed outdoor activity choices",
        "Air purifiers at home/work reduce exposure by up to 90%"
      ],
      emotional: "Your actions today shape your health tomorrow. Small changes make a big difference."
    },
    adult: {
      title: "Adults (25-44)",
      color: "border-red-500/30",
      icon: Brain,
      impacts: [
        "Air purifiers improve work productivity and focus",
        "Regular indoor exercise maintains cardiovascular health",
        "Using masks outdoors significantly reduces exposure"
      ],
      emotional: "Protect your health and inspire others to take action."
    },
    middle: {
      title: "Middle Age (45-64)",
      color: "border-purple-500/30",
      icon: Heart,
      impacts: [
        "Regular health check-ups help monitor and protect heart health",
        "Indoor air filtration supports respiratory wellness",
        "Community action creates cleaner air for everyone"
      ],
      emotional: "Your experience and voice can help create positive change in your community."
    },
    senior: {
      title: "Seniors (65+)",
      color: "border-red-500/30",
      icon: Activity,
      impacts: [
        "Indoor air purification creates a safe space for daily activities",
        "Regular gentle exercise in filtered air maintains health",
        "Monitoring air quality helps plan safer outdoor activities"
      ],
      emotional: "Simple protective measures help you stay active and healthy with your loved ones."
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-2 text-center">
        Protect Yourself & Family 🛡️
      </h2>
      <h3 className="text-center text-gray-400 mb-4">Select your age group to see protective measures:</h3>
      
      <div className="grid grid-cols-2 gap-2 mb-6">
        {Object.entries(ageGroups).map(([key, group]) => (
          <button
            key={key}
            onClick={() => setSelectedAge(key)}
            className={`p-3 rounded-lg text-sm font-medium transition-all
              ${selectedAge === key 
                ? 'bg-red-500/20 border-red-500 text-white' 
                : 'bg-gray-800/50 border-gray-700 text-gray-300'
              } border hover:border-red-500`}
          >
            {group.title}
          </button>
        ))}
      </div>
      
      {selectedAge && (
        <div className="space-y-4 animate-fadeIn">
          
          <div>
            <p className="text-red-500 text-center text-lg">
              {ageGroups[selectedAge].emotional}
            </p>
          </div>
          
          <FamilyImpactCard
            icon={ageGroups[selectedAge].icon}
            title={ageGroups[selectedAge].title}
            impacts={ageGroups[selectedAge].impacts}
            borderColor={ageGroups[selectedAge].color}
          />
          <ShareButton text="Protect Your Loved Ones - Share Now" />
        </div>
      )}
    </section>
  );
};
