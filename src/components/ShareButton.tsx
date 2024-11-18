// Share button component
import { AlertTriangle } from 'lucide-react';

interface ShareButtonProps {
  text?: string;
}

export default function ShareButton({ text }: ShareButtonProps) {
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
