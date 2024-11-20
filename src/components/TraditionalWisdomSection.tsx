import { Leaf, Apple, Coffee, Wind } from 'lucide-react';

interface WisdomCardProps {
  icon: React.ElementType;
  title: string;
  description: React.ReactNode;
}

const WisdomCard: React.FC<WisdomCardProps> = ({ icon: Icon, title, description }) => (
  <div className="bg-emerald-900/5 backdrop-blur-xl rounded-lg p-4 border border-emerald-500/30">
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-6 h-6 text-emerald-500" />
      <h3 className="text-lg font-bold text-emerald-400">{title}</h3>
    </div>
    <div className="text-gray-200">{description}</div>
  </div>
);

export default function TraditionalWisdomSection() {
  return (
    <section className="pt-8">
      <h2 className="text-2xl font-bold mb-2 text-center">
        Practical Wisdom 🌿
      </h2>
      
      <p className="text-gray-200 text-center mb-6">
        Our ancestors had powerful ideas for good health.<br />
        These traditional methods are backed by modern science.
      </p>
      
      <div className="space-y-4">
        <WisdomCard
          icon={Coffee}
          title="Protective Kaadha Recipe"
          description={<>
            <p className="mb-2">Traditional immunity-boosting drink:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>2 cups water</li>
              <li>5-6 Tulsi leaves</li>
              <li>1 inch Ginger</li>
              <li>1 tsp Turmeric</li>
              <li>Honey to taste (optional)</li>
            </ul>
            <p className="mt-2 text-sm">Boil for 10 minutes, strain and drink warm twice daily.</p>
          </>}
        />
        
        <WisdomCard
          icon={Apple}
          title="Protective Foods"
          description={<>
            <p className="mb-2">Foods that help protect against pollution:</p>
            <p className="font-semibold text-emerald-400">Eat More:</p>
            <ul className="list-disc pl-4 mb-2">
              <li>Vitamin C rich fruits (Amla, Citrus)</li>
              <li>Green leafy vegetables</li>
              <li>Jaggery (Gud)</li>
              <li>Turmeric milk</li>
            </ul>
            <p className="font-semibold text-red-400">Reduce:</p>
            <ul className="list-disc pl-4">
              <li>Deep fried foods</li>
              <li>Processed foods</li>
              <li>Excessive dairy</li>
            </ul>
          </>}
        />

        <WisdomCard
          icon={Wind}
          title="Exercise Guidelines"
          description={<>
            <p className="mb-2">When AQI is high:</p>
            <ul className="list-disc pl-4">
              <li>Exercise indoors with air purifiers</li>
              <li>Best time: 11 AM - 4 PM (when pollution is lower)</li>
              <li>Wear N95 mask for outdoor activities</li>
              <li>Focus on gentle exercises like yoga</li>
              <li>Stay well hydrated</li>
            </ul>
          </>}
        />

        <WisdomCard
          icon={Leaf}
          title="Plant These at Home"
          description={<>
            <p className="mb-2">NASA-recommended air-purifying plants:</p>
            <ul className="list-disc pl-4">
              <li>Snake Plant (Mother-in-law&apos;s tongue)</li>
              <li>Areca Palm</li>
              <li>Money Plant</li>
              <li>Spider Plant</li>
            </ul>
            <p className="mt-2 text-sm">Place 3-4 plants per 100 sq ft for best results</p>
          </>}
        />
      </div>
    </section>
  );
} 