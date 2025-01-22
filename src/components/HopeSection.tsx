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
    <section>
      <h2 className="text-2xl font-bold mb-2 text-center">
        Take Action 🤞
      </h2>
      
      <div className="space-y-4">
        <p className="text-gray-200 text-center mb-6">
          Air pollution is human-made.<br />
          We can fix it together.
        </p>
        
        <div className="space-y-4">
          <HopeCard
            icon={User}
            title="Act Now"
            description={<>
              • <a href={`https://api.whatsapp.com/send/?text=${shareText}&type=custom_url&app_absent=0`} className="text-emerald-500 underline hover:text-emerald-400" target="_blank" rel="noopener noreferrer">Share this site</a><br />
              • Install air purifiers<br />
              • Wear N95 masks<br />
              • Join local NGOs<br />
              • Support clean air projects
            </>}
          />
          
          <HopeCard
            icon={Brain}
            title="Join Organizations"
            description={<>
              • <a href="https://a-pag.org" className="text-emerald-500 hover:text-emerald-400" target="_blank" rel="noopener noreferrer">A-PAG</a>: Government policy action<br />
              • <a href="https://www.cleanairfund.org/where-we-work/india/" className="text-emerald-500 hover:text-emerald-400" target="_blank" rel="noopener noreferrer">Clean Air Fund</a>: Business partnerships<br />
              • <a href="https://cleanairasia.org/india/" className="text-emerald-500 hover:text-emerald-400" target="_blank" rel="noopener noreferrer">Clean Air Asia</a>: Scientific solutions
            </>}
          />

          <HopeCard
            icon={AlertTriangle}
            title="Main Causes"
            description={<>
              • Coal & fuel burning<br />
              • Vehicle emissions<br />
              • Construction dust<br />
              • Crop burning<br />
            </>}
          />
          
          <ShareButton text="Share With Family" color="emerald" icon={User} />
        </div>
      </div>
    </section>
  );
};
