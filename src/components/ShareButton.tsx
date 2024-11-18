// Share button component
import { AlertTriangle, LucideIcon } from 'lucide-react';

interface ShareButtonProps {
  text?: string;
  color?: string;
  icon?: LucideIcon;
}

export default function ShareButton({ text, color = 'red', icon: Icon = AlertTriangle }: ShareButtonProps) {
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
      className={`w-full bg-${color}-500 hover:bg-${color}-600 text-white my-4 py-4 px-6 rounded-lg font-bold text-lg flex items-center justify-center gap-2 shadow-lg relative overflow-hidden group`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r from-${color}-600 to-${color}-500 animate-pulse`}></div>
      <span className="relative flex items-center gap-2">
        <Icon className="w-6 h-6" />
        {buttonText}
      </span>
    </button>
  );
};
