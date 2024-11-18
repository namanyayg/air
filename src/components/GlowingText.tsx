
// Glowing Text Component
interface GlowingTextProps {
  children: React.ReactNode;
  color?: 'red' | 'orange' | 'yellow' | 'purple';
  className?: string;
}

export default function GlowingText({ children, color = "red", className }: GlowingTextProps) {
  const colorClasses = {
    red: "text-red-500 bg-red-500/30",
    orange: "text-orange-500 bg-orange-500/30",
    yellow: "text-yellow-500 bg-yellow-500/30",
    purple: "text-purple-500 bg-purple-500/30"
  };

  return (
    <span className={`relative inline-block animate-glow ${className}`}>
      <span className="relative z-10">{children}</span>
      <span className={`absolute inset-0 blur-lg animate-pulse ${colorClasses[color]}`}></span>
    </span>
  );
};
