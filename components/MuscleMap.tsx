import React from 'react';

interface MuscleMapProps {
  highlight: 'pecs' | 'back' | 'legs' | 'shoulders' | 'arms' | 'abs' | string;
}

export const MuscleMap: React.FC<MuscleMapProps> = ({ highlight }) => {
  const getColor = (target: string) => highlight === target ? '#ef4444' : '#cbd5e1';

  return (
    <div className="flex gap-4 justify-center h-48 w-full bg-slate-50 rounded-xl p-2 border border-slate-100">
      {/* Front View */}
      <svg viewBox="0 0 100 220" className="h-full w-auto">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
           {/* Head */}
           <circle fill="#94a3b8" cx="50" cy="15" r="10" />
           {/* Shoulders */}
           <path d="M25,30 Q50,25 75,30 L85,45 L15,45 Z" fill={getColor('shoulders')} />
           {/* Arms */}
           <path d="M15,45 L10,90 L20,90 L25,45 Z" fill={getColor('arms')} />
           <path d="M85,45 L90,90 L80,90 L75,45 Z" fill={getColor('arms')} />
           {/* Chest (Pecs) */}
           <path d="M30,35 L70,35 L65,60 L35,60 Z" fill={getColor('pecs')} />
           {/* Abs */}
           <rect x="38" y="62" width="24" height="35" rx="5" fill={getColor('abs')} />
           {/* Legs */}
           <path d="M35,100 L30,170 L45,170 L48,100 Z" fill={getColor('legs')} />
           <path d="M65,100 L70,170 L55,170 L52,100 Z" fill={getColor('legs')} />
        </g>
      </svg>

      {/* Back View */}
      <svg viewBox="0 0 100 220" className="h-full w-auto">
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
           {/* Head */}
           <circle fill="#94a3b8" cx="50" cy="15" r="10" />
           {/* Shoulders Back */}
           <path d="M25,30 Q50,25 75,30 L85,40 L15,40 Z" fill={getColor('shoulders')} />
           {/* Back (Lats/Traps) */}
           <path d="M30,40 L70,40 L60,90 L40,90 Z" fill={getColor('back')} />
           {/* Arms Back */}
           <path d="M15,40 L10,90 L20,90 L25,40 Z" fill={getColor('arms')} />
           <path d="M85,40 L90,90 L80,90 L75,40 Z" fill={getColor('arms')} />
           {/* Glutes/Legs Back */}
           <path d="M35,95 L30,170 L45,170 L48,95 Z" fill={getColor('legs')} />
           <path d="M65,95 L70,170 L55,170 L52,95 Z" fill={getColor('legs')} />
        </g>
      </svg>
    </div>
  );
};