"use client";

import React, { useState, useEffect } from 'react';
import { 
  Skull, AlertTriangle, Brain, Heart, 
  User, Activity, Clock 
} from 'lucide-react';

// Smoke Background Component
const SmokeBackground: React.FC = () => {
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
        <div className="absolute inset-0 opacity-20 bg-gradient-to-t from-red-900/20 via-orange-900/20 to-transparent"></div>
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
  color?: 'red' | 'orange' | 'yellow' | 'purple';
}

const GlowingText: React.FC<GlowingTextProps> = ({ children, color = "red" }) => {
  const colorClasses = {
    red: "text-red-500 bg-red-500/30",
    orange: "text-orange-500 bg-orange-500/30",
    yellow: "text-yellow-500 bg-yellow-500/30",
    purple: "text-purple-500 bg-purple-500/30"
  };

  return (
    <span className="relative inline-block animate-glow">
      <span className="relative z-10">{children}</span>
      <span className={`absolute inset-0 blur-lg animate-pulse ${colorClasses[color]}`}></span>
    </span>
  );
};

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
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
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
  borderColor?: string;
}

const FamilyImpactCard: React.FC<FamilyImpactCardProps> = ({ icon: Icon, title, impacts, borderColor = "border-red-500/30" }) => (
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

// New Age Impact Component
interface AgeImpactProps {
  aqi: number;
}

const AgeImpact: React.FC<AgeImpactProps> = ({ aqi }) => {
  const [selectedAge, setSelectedAge] = useState<string>('');

  const ageGroups = {
    young: {
      title: "Young Adults (18-24)",
      color: "border-orange-500/30",
      icon: User,
      impacts: [
        `Your brain is still developing - each breath of toxic air damages your future potential`,
        `${(aqi/8).toFixed(0)}% higher risk of depression and anxiety`,
        "Every day in this air reduces your life expectancy by 5 hours",
      ],
      emotional: "Your whole life is ahead of you. Don't let toxic air steal your dreams and potential."
    },
    adult: {
      title: "Adults (25-44)",
      color: "border-red-500/30",
      icon: Brain,
      impacts: [
        "Your productivity at work drops by 30% on high pollution days",
        `${(aqi/6).toFixed(0)}% increased risk of burnout and chronic fatigue`,
        "Each year in this air ages your body by an extra 2.5 years",
      ],
      emotional: "Your family needs you healthy and strong. This air is silently stealing your best years."
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
      emotional: "You've worked hard all your life. Don't let toxic air rob you of your golden years."
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
        How is toxic air affecting you?
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
              {ageGroups[selectedAge as keyof typeof ageGroups].emotional}
            </p>
          </div>
          
          <FamilyImpactCard
            icon={ageGroups[selectedAge as keyof typeof ageGroups].icon}
            title={ageGroups[selectedAge as keyof typeof ageGroups].title}
            impacts={ageGroups[selectedAge as keyof typeof ageGroups].impacts}
            borderColor={ageGroups[selectedAge as keyof typeof ageGroups].color}
          />
          <ShareButton text="Protect Your Loved Ones - Share Now" />
        </div>
      )}
    </section>
  );
};

// Share button component
interface ShareButtonProps {
  text?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ text }) => {
  const buttonText = text || "Warn your loved ones now";
  const handleShare = () => {
    const shareText = encodeURIComponent(
      "⚠️ The air we&apos;re breathing is toxic... Learn more about the health impacts: https://air.nmn.gl\n\n🫁 Protect your family - See how it&apos;s affecting our children and elderly RIGHT NOW! 😷\n\nStay informed, stay safe! 🏥"
    );
    const whatsappUrl = `https://api.whatsapp.com/send/?text=${shareText}&type=custom_url&app_absent=0`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button 
      onClick={handleShare}
      className="w-full bg-red-500 hover:bg-red-600 text-white my-4 py-4 px-6 rounded-lg font-bold text-lg flex items-center justify-center gap-2 shadow-lg relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 animate-pulse"></div>
      <span className="relative flex items-center gap-2">
        <AlertTriangle className="w-6 h-6" />
        {buttonText}
      </span>
    </button>
  );
};

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
        Damage Accumulating Now:
      </h2>
      <div className="space-y-3">
        <DamageStat 
          icon={<Clock className="w-5 h-5 text-red-500" />} 
          label="Seconds on Site" 
          value={<span className="font-mono">{stats.seconds.toLocaleString()}</span>} 
        />
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
      </div>
    </div>
  );
};

// Hope Card Component
interface HopeCardProps {
  icon: React.ElementType;
  title: string;
  description: React.ReactNode;
}

const HopeCard: React.FC<HopeCardProps> = ({ icon: Icon, title, description }) => (
  <div className="bg-emerald-900/3 backdrop-blur-xl rounded-lg p-4 border border-emerald-500/30">
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-6 h-6 text-emerald-500" />
      <h3 className="text-lg font-bold text-emerald-400">{title}</h3>
    </div>
    <p className="text-gray-200">{description}</p>
  </div>
);

// Add new component after AgeImpact and before HopeSection
const DailyImpactSection: React.FC<{ aqi: number }> = ({ aqi }) => {
  const impacts = {
    cigarettes: {
      icon: Activity,
      title: "Cigarette Equivalent",
      value: `${Math.floor(aqi/10)} cigarettes`,
      description: "Your lungs are suffering damage equal to chain smoking"
    },
    brain: {
      icon: Brain,
      title: "Brain Right Now",
      value: `${Math.floor(aqi/25)} hours older`,
      description: "Your cognitive function is rapidly declining"
    },
    life: {
      icon: Clock,
      title: "Life Impact",
      value: `${Math.floor(aqi/20)} hours lost`,
      description: "Each day in this air permanently shortens your life"
    },
    lungs: {
      icon: Heart,
      title: "Your Lungs",
      value: `${Math.max(0, 100 - (aqi/4))}% capacity`,
      description: "Your respiratory system is fighting to survive"
    }
  };

  return (
    <section className="pt-8">
      <h2 className="text-2xl font-bold mb-2 text-center">
        Today's Toxic Damage
      </h2>
      <p className="text-center text-red-500 mb-6">
        Every hour in this air is destroying your body
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

// Hope Section Component
const HopeSection: React.FC = () => {
  const shareText = encodeURIComponent(
    "⚠️ The air we&apos;re breathing is toxic... Learn more about the health impacts: https://air.nmn.gl\n\n🫁 Protect your family - See how it&apos;s affecting our children and elderly RIGHT NOW! 😷\n\nStay informed, stay safe! 🏥"
  );

  return (
    <section className="pt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">
        There is still hope&hellip;
      </h2>
      
      <div className="space-y-4">
        <p className="text-gray-200 text-center">
          The problem isn&apos;t natural - it&apos;s caused by humans.<br />
          That means we can fix it through action.
        </p>
        
        <div className="space-y-4">
          <HopeCard
            icon={User}
            title="What You Can Do Today"
            description={<>
              • <a href={`https://api.whatsapp.com/send/?text=${shareText}&type=custom_url&app_absent=0`} className="text-emerald-500 underline hover:text-emerald-400" target="_blank" rel="noopener noreferrer">Share this site</a> with family & friends<br />
              • Install air purifiers at home & office<br />
              • Wear N95 masks when outdoors<br />
              • Connect with local NGOs to drive change<br />
              • Support clean air initiatives in your area
            </>}
          />
          
          <HopeCard
            icon={Brain}
            title="Join the Movement"
            description={<>
              • <a href="https://a-pag.org" className="text-emerald-500 hover:text-emerald-400" target="_blank" rel="noopener noreferrer">A-PAG</a>: Works with government to implement air pollution solutions<br />
              • <a href="https://www.cleanairfund.org/where-we-work/india/" className="text-emerald-500 hover:text-emerald-400" target="_blank" rel="noopener noreferrer">Clean Air Fund</a>: Partners with government and business at every level<br />
              • <a href="https://cleanairasia.org/india/" className="text-emerald-500 hover:text-emerald-400" target="_blank" rel="noopener noreferrer">Clean Air Asia</a>: Provides scientific input for better air quality
            </>}
          />

          <HopeCard
            icon={AlertTriangle}
            title="What Causes Air Pollution?"
            description={<>
              • Burning of coal, petrol, diesel & gas in industries<br />
              • Vehicle emissions & increasing traffic<br />
              • Large-scale construction activity<br />
              • Crop burning in neighboring states<br />
            </>}
          />
          
          <ShareButton text="Share With Your Family" />
        </div>
      </div>
    </section>
  );
};

// Sources Section Component
const SourcesSection: React.FC = () => (
  <section className="mt-8 bg-black/30 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
    <details className="text-sm text-gray-400">
      <summary className="cursor-pointer hover:text-gray-300">Sources</summary>
      
      <div className="space-y-4 pl-2">
        <div>
          <h4 className="text-gray-300 mb-2">News Articles</h4>
          <ul className="space-y-1">
            <li>
              <a href="https://economictimes.indiatimes.com/news/india/air-pollution-every-day-464-children-in-india-die-report/articleshow/111133693.cms" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="hover:text-gray-300">
                Air pollution: Every day, 464 children in India die: Report - Economic Times, 2024
              </a>
            </li>
            <li>
              <a href="https://www.bc.edu/bc-web/bcnews/nation-world-society/international/air-pollution-in-inda.html" 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="hover:text-gray-300">
                The human toll of air pollution in India - Boston College News, 2021
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-300 mb-2">Research Studies</h4>
          <ul className="space-y-1">
            <li>
              <a href="https://www.pnas.org/doi/10.1073/pnas.1809474115"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="hover:text-gray-300">
                Zhang et al. (2018). &quot;The impact of exposure to air pollution on cognitive performance.&quot; <i>PNAS</i>
              </a>
            </li>
            <li>Chen et al. (2013). &quot;Evidence on the impact of sustained exposure to air pollution on life expectancy.&quot; <i>PNAS</i></li>
            <li>WHO Global Air Quality Guidelines (2021)</li>
            <li>
              <a href="https://sph.emory.edu/news/news-release/2023/10/air-pollution-exposure-puberty.html"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="hover:text-gray-300">
                Emory University (2023). &quot;Air Pollution Exposure During Childhood and Adolescence.&quot;
              </a>
            </li>
            <li>
              <a href="https://www.lung.org/clean-air/outdoors/who-is-at-risk"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="hover:text-gray-300">
                American Lung Association (2023). &quot;Who is at Risk from Air Pollution?&quot;
              </a>
            </li>
            <li>
              <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6904854/"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="hover:text-gray-300">
                Sahu et al. (2020). &quot;Air Pollution and Cardiovascular Disease: A Focus on Vulnerable Populations.&quot;
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-gray-300 mb-2">Age-Specific Impact Studies</h4>
          <ul className="space-y-1">
            <li>
              <a href="https://www.thelancet.com/journals/lanplh/article/PIIS2542-5196(19)30090-1/"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="hover:text-gray-300">
                The Lancet (2019). &quot;Age-specific effects of air pollution on cognitive performance.&quot;
              </a>
            </li>
            <li>
              <a href="https://www.nature.com/articles/s41598-019-44561-0"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="hover:text-gray-300">
                Nature (2019). &quot;Differential susceptibility to air pollution by age group.&quot;
              </a>
            </li>
          </ul>
        </div>
      </div>
    </details>
  </section>
);

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
            &quot;Air&quot; is Non-Profit and is fully open source. Contributions & ideas are welcome!
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
        </div>

        <div className="space-y-4">
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
