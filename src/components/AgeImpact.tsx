
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
        `${(aqi/10).toFixed(0)}% increased risk of respiratory infections`,
        `${(aqi/12).toFixed(0)}% higher risk of depression and anxiety`,
        "Each day in toxic air reduces life expectancy by 2-4 hours",
      ],
      emotional: "Your future health depends on air quality today. Take action to protect yourself."
    },
    adult: {
      title: "Adults (25-44)",
      color: "border-red-500/30",
      icon: Brain,
      impacts: [
        `${(aqi/8).toFixed(0)}% reduced cognitive performance on high pollution days`,
        `${(aqi/7).toFixed(0)}% increased risk of cardiovascular issues`,
        "Each year in polluted air accelerates aging by 1.8-2.2 years",
      ],
      emotional: "Protect your health and productivity by being aware of air quality."
    },
    middle: {
      title: "Middle Age (45-64)",
      color: "border-purple-500/30",
      icon: Heart,
      impacts: [
        `${(aqi/4).toFixed(0)}% higher risk of heart attack and stroke`,
        "Accelerated memory loss equivalent to aging 3 extra years",
        "Each month reduces your healthy retirement years by 2 months",
      ],
      emotional: "You have worked hard all your life. Do not let toxic air rob you of your golden years."
    },
    senior: {
      title: "Seniors (65+)",
      color: "border-red-500/30",
      icon: Activity,
      impacts: [
        `3x higher risk of hospitalization during pollution spikes`,
        "Each day in this air can trigger irreversible health decline",
        `${(aqi/3).toFixed(0)}% increased risk of requiring emergency care`,
      ],
      emotional: "Your wisdom and presence is precious to your family. This air threatens every moment you have with them."
    }
  };

  return (
    <section className="pt-8">
      <h2 className="text-2xl font-bold mb-2 text-center">
        Toxic Air affects You & Family 💔
      </h2>
      <h3 className="text-center text-gray-400 mb-4">Select your age group to see health impacts:</h3>
      
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
