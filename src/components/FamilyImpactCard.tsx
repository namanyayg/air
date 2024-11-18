// Family impact card component
interface FamilyImpactCardProps {
  icon: React.ElementType;
  title: string;
  impacts: string[];
  borderColor?: string;
}

export default function FamilyImpactCard({ icon: Icon, title, impacts, borderColor = "border-red-500/30" }: FamilyImpactCardProps) {
  return (
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
}