// Share button component
import { AlertTriangle, LucideIcon } from 'lucide-react';

interface ShareButtonProps {
  text?: string;
  color?: string;
  icon?: LucideIcon;
}

export default function ShareButton({ text, color = 'green', icon: Icon = AlertTriangle }: ShareButtonProps) {
  const buttonText = text || "Warn your loved ones now";
  const handleShare = async () => {
    const shareData = {
      title: "Air Pollution Alert",
      text: "Protect your family - See how our air is affecting our children and elderly RIGHT NOW! \n\nStay informed, stay safe!",
      url: "https://air.nmn.gl"
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        const shareText = encodeURIComponent(
          "Protect your family - See how our air is affecting our children and elderly RIGHT NOW! \n\nhttps://air.nmn.gl\n\nStay informed, stay safe!"
        );
        const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;
        window.open(whatsappUrl, '_blank');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <button 
      onClick={handleShare}
      className={`w-full bg-emerald bg-${color}-500 hover:bg-emerald hover:bg-${color}-600 text-white my-4 py-4 px-6 rounded-lg font-bold text-lg flex items-center justify-center gap-2 shadow-lg relative overflow-hidden group`}
    >
      <div className={`absolute inset-0 bg-gradient-to-r from-emerald-600 from-${color}-600 to-emerald-500 to-${color}-500`}></div>
      <span className="relative flex items-center gap-2">
        <Icon className="w-6 h-6" />
        {buttonText}
      </span>
    </button>
  );
};
