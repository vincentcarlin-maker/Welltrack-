
import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  variant?: 'light' | 'dark' | 'white';
  className?: string;
}

export const WellTrackLogo: React.FC<LogoProps> = ({ 
  size = 40, 
  showText = true, 
  variant = 'dark',
  className = "" 
}) => {
  const textColor = variant === 'white' ? 'text-white' : 'text-slate-900';
  const iconId = React.useId();

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div style={{ width: size, height: size }} className="relative flex-shrink-0">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-glow">
          <defs>
            <linearGradient id={`${iconId}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#00D4FF" />
            </linearGradient>
          </defs>
          
          {/* Fond Cercle Dynamique */}
          <circle cx="50" cy="50" r="48" fill={`url(#${iconId}-grad)`} />
          
          {/* Le "F" de Fitrack sculpté */}
          <path 
            d="M32 28H68V40H46V50H64V62H46V80H32V28Z" 
            fill="white"
            className="drop-shadow-sm"
          />

          {/* Ligne d'impulsion sur le côté */}
          <path 
            d="M72 28V80" 
            stroke="white" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeDasharray="4 8"
            opacity="0.4"
          />
        </svg>
      </div>
      
      {showText && (
        <span className={`text-2xl font-[900] tracking-tighter ${textColor} select-none uppercase`}>
          Fit<span className="text-brand-blue">rack</span>
        </span>
      )}
    </div>
  );
};
