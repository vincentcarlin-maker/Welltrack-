
import React from 'react';
import { ActivityLog } from '../types';

interface Props {
  activities: ActivityLog[];
  size?: number;
}

type MuscleStatus = 'fatigued' | 'recovering' | 'ready';

export const RecoveryMuscleMap: React.FC<Props> = ({ activities, size = 240 }) => {
  const getStatus = (muscle: string): MuscleStatus => {
    const lastSession = activities
      .filter(a => a.blocks?.some(b => b.exercises.some(e => e.name.toLowerCase().includes(muscle.toLowerCase()) || e.name === muscle)))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    if (!lastSession) return 'ready';
    
    const hoursSince = (Date.now() - new Date(lastSession.date).getTime()) / (1000 * 60 * 60);
    if (hoursSince < 24) return 'fatigued';
    if (hoursSince < 48) return 'recovering';
    return 'ready';
  };

  const colors = {
    fatigued: '#FB7185',   // Rose-400 (Glow)
    recovering: '#FBBF24', // Amber-400
    ready: '#34D399',      // Emerald-400
    empty: 'rgba(255,255,255,0.05)'
  };

  const getMuscleColor = (target: string) => colors[getStatus(target)];

  return (
    <div className="relative flex flex-col items-center bg-[#0F172A] rounded-[3rem] p-8 border border-white/5 shadow-2xl overflow-hidden group">
      {/* Background Tech Grid */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      {/* Scanning Line Animation */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-[scan_4s_linear_infinite] z-20"></div>
      <style>{`
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
      `}</style>

      <div className="relative z-10">
        <svg viewBox="0 0 120 220" style={{ width: size, height: 'auto' }} className="drop-shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <defs>
            <filter id="glow-fatigue">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* Silhouette Frame */}
          <path d="M60 10 C65 10 68 14 68 20 C68 26 65 30 60 30 C55 30 52 26 52 20 C52 14 55 10 60 10 Z" fill="#1E293B" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
          
          {/* Shoulders / Traps */}
          <path d="M40 40 Q60 32 80 40 L85 55 L35 55 Z" fill={getMuscleColor('Epaules')} opacity="0.9" />

          {/* Chest */}
          <path d="M42 45 Q60 40 78 45 C80 60 70 65 60 65 C50 65 40 60 42 45 Z" fill={getMuscleColor('Poitrine')} className="transition-all duration-700" />

          {/* Arms (Stylized) */}
          <path d="M32 45 L20 90 Q25 95 30 90 L38 55 Z" fill={getMuscleColor('Bras')} />
          <path d="M88 45 L100 90 Q95 95 90 90 L82 55 Z" fill={getMuscleColor('Bras')} />

          {/* Abdominals */}
          <path d="M48 68 Q60 65 72 68 L70 100 Q60 105 50 100 Z" fill={getMuscleColor('Abdominaux')} />

          {/* Legs (Quads) */}
          <path d="M45 108 L35 180 Q45 185 55 180 L58 108 Z" fill={getMuscleColor('Jambes')} />
          <path d="M75 108 L85 180 Q75 185 65 180 L62 108 Z" fill={getMuscleColor('Jambes')} />

          {/* Internal tech details */}
          <g stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" fill="none">
             <path d="M60 40 L60 105" />
             <path d="M45 60 H75" />
             <path d="M40 130 H80" />
          </g>
        </svg>

        {/* Floating Data Tags */}
        <div className="absolute top-1/4 -left-12 flex flex-col items-end animate-pulse">
           <div className="h-px w-8 bg-blue-500/50 mb-1"></div>
           <span className="text-[7px] font-black text-blue-400 uppercase tracking-tighter">Upper.Body.Ready</span>
        </div>
        <div className="absolute bottom-1/4 -right-12 flex flex-col items-start animate-pulse" style={{ animationDelay: '1s' }}>
           <div className="h-px w-8 bg-emerald-500/50 mb-1"></div>
           <span className="text-[7px] font-black text-emerald-400 uppercase tracking-tighter">Lower.Power.100%</span>
        </div>
      </div>

      {/* Legend Area */}
      <div className="mt-8 flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#34D399] shadow-[0_0_8px_#34D399]"></div>
          <span className="text-[8px] font-bold uppercase text-slate-400 tracking-widest">Optimal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FBBF24] shadow-[0_0_8px_#FBBF24]"></div>
          <span className="text-[8px] font-bold uppercase text-slate-400 tracking-widest">Récup.</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FB7185] shadow-[0_0_8px_#FB7185] animate-pulse"></div>
          <span className="text-[8px] font-bold uppercase text-slate-400 tracking-widest">Fatigue</span>
        </div>
      </div>
    </div>
  );
};
