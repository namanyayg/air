// Smoke Background Component
export default function SmokeBackground() {
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