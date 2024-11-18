import { User, Brain, AlertTriangle } from 'lucide-react';
import ShareButton from './ShareButton';

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

// Hope Section Component
export default function HopeSection() {
  const shareText = encodeURIComponent(
    "⚠️ The air we&apos;re breathing is toxic... Learn more about the health impacts: https://air.nmn.gl\n\n🫁 Protect your family - See how it&apos;s affecting our children and elderly RIGHT NOW! 😷\n\nStay informed, stay safe! 🏥"
  );

  return (
    <section className="pt-8">
      <h2 className="text-2xl font-bold mb-2 text-center">
        There is still hope&hellip; 🤞
      </h2>
      
      <div className="space-y-4">
        <p className="text-gray-200 text-center mb-6">
          The problem isn&apos;t natural - it&apos;s caused by humans.<br />
          That means we can fix it through action.
        </p>
        
        <div className="space-y-4">
          <HopeCard
            icon={User}
            title="What You Can Do Today"
            description={<>
              • <a href={`https://api.whatsapp.com/send/?text=${shareText}&type=custom_url&app_absent=0`} className="text-emerald-500 underline hover:text-emerald-400" target="_blank" rel="noopener noreferrer">Share this site</a> with family &amp; friends<br />
              • Install air purifiers at home &amp; office<br />
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
              • Burning of coal, petrol, diesel &amp; gas in industries<br />
              • Vehicle emissions &amp; increasing traffic<br />
              • Large-scale construction activity<br />
              • Crop burning in neighboring states<br />
            </>}
          />
          
          <ShareButton text="Share With Your Family" color="emerald" icon={User} />
        </div>
      </div>
    </section>
  );
};
