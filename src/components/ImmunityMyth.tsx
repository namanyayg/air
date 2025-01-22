import React from 'react';
import { Shield, Skull } from 'lucide-react';

const ImmunityMythSection = () => {
  return (
    <div>
      <div className="text-center my-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          &quot;Immunity&quot; is a Myth 🤦‍♂️
        </h2>
        <p className="text-gray-400">
          Our bodies don&apos;t develop immunity to air pollution - but we can protect ourselves
        </p>
      </div>

      {/* Visual Comparison */}
      <div className="relative flex items-center justify-center mb-12">
        {/* First circle representing false immunity belief */}
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-700/20 border-2 border-blue-500/50">
            <Shield className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-blue-500/50" />
          </div>
          <div className="absolute inset-0 rounded-full">
            {/* Animated particles still getting through */}
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-red-500"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${i * 18}deg) translateY(${Math.random() * 40}px)`,
                  animation: `penetrate ${Math.random() * 2 + 1}s infinite`
                }}
              />
            ))}
          </div>
          <div className="absolute -bottom-8 w-full text-center text-sm text-blue-400">
            Myth: Protected
          </div>
        </div>

        <div className="mx-4 text-red-500 text-2xl font-bold">=</div>

        {/* Second circle showing actual damage */}
        <div className="relative w-36 h-36">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-900/30 to-black/30 border-2 border-red-500/30 overflow-hidden backdrop-blur-sm">
            {/* Accumulating damage effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-t from-red-900/50 via-red-800/30 to-transparent"
              style={{
                animation: 'accumulate 4s ease-out infinite'
              }}
            />
            
            {/* Toxic particles */}
            {[...Array(40)].map((_, i) => (
              <div
                key={`toxic-${i}`}
                className="absolute rounded-full bg-red-500/60"
                style={{
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `toxicFloat ${3 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${-Math.random() * 5}s`
                }}
              />
            ))}
            
            <Skull className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 text-red-500/50" />
          </div>
          <div className="absolute -bottom-6 w-full text-center text-sm text-red-400">
            Reality: Damaged
          </div>
        </div>
      </div>

      {/* Educational Message */}
      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 text-gray-300 space-y-4">
        <p>
          Our bodies don&apos;t develop immunity to air pollution. Continuous exposure leads to health risks.
        </p>
        <p className="text-emerald-400 font-medium">
          Protect yourself:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-200">
          <li>Use air purifiers</li>
          <li>Wear masks outdoors</li>
          <li>Monitor air quality</li>
          <li>Support clean air initiatives</li>
        </ul>
      </div>

      <style jsx>{`
        @keyframes penetrate {
          0% { opacity: 0; transform: rotate(inherit) translateY(0); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: rotate(inherit) translateY(60px); }
        }
        @keyframes toxicFloat {
          0%, 100% { transform: translate(0, 0); opacity: 0.6; }
          50% { transform: translate(10px, -10px); opacity: 0.9; }
        }
        @keyframes accumulate {
          0% { opacity: 0.3; transform: scale(0.95); }
          50% { opacity: 0.6; transform: scale(1); }
          100% { opacity: 0.3; transform: scale(0.95); }
        }
      `}</style>
    </div>
  );
};

export default ImmunityMythSection;