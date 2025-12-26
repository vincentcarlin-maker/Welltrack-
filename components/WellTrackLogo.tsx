
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
    <div className={`flex items-center gap-3 ${className}`}>
      <div style={{ width: size, height: size }} className="relative flex-shrink-0">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id={`${iconId}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          
          {/* Anneau de tracking extérieur */}
          <path 
            d="M85 50C85 69.33 69.33 85 50 85C30.67 85 15 69.33 15 50C15 30.67 30.67 15 50 15" 
            stroke={`url(#${iconId}-grad)`} 
            strokeWidth="8" 
            strokeLinecap="round"
            className="opacity-20"
          />
          
          {/* Cœur Pulsé */}
          <path 
            d="M50 75C50 75 20 55 20 35C20 25 28 20 35 20C42 20 47 25 50 30C53 25 58 20 65 20C72 20 80 25 80 35C80 55 50 75 50 75Z" 
            fill={`url(#${iconId}-grad)`}
          />
          
          {/* Ligne de vie (Pulse) blanche par-dessus */}
          <path 
            d="M25 40H35L42 25L52 55L60 35H75" 
            stroke="white" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="drop-shadow-sm"
          />
        </svg>
      </div>
      
      {showText && (
        <span className={`text-2xl font-black tracking-tighter ${textColor} select-none`}>
          Well<span className="text-brand-blue">Track</span>
        </span>
      )}
    </div>
  );
};

export const WellTrackIcon = ({ size = 24, className = "" }) => (
  <WellTrackLogo size={size} showText={false} className={className} />
);
