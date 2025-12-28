
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
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id={`${iconId}-grad`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" rx="30" fill={`url(#${iconId}-grad)`} />
          <path 
            d="M30 50C30 38.9543 38.9543 30 50 30C61.0457 30 70 38.9543 70 50C70 61.0457 61.0457 70 50 70C38.9543 70 30 61.0457 30 50Z" 
            stroke="white" 
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path d="M50 40V60" stroke="white" strokeWidth="6" strokeLinecap="round" />
          <path d="M40 50H60" stroke="white" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>
      
      {showText && (
        <span className={`text-2xl font-[900] tracking-tighter ${textColor} select-none uppercase`}>
          Well<span className="text-brand-accent">Track</span>
        </span>
      )}
    </div>
  );
};
