
import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  shadow?: boolean;
}

export const FitrackIcon: React.FC<IconProps> = ({ 
  size = 120, 
  className = "",
  shadow = true 
}) => {
  return (
    <div 
      className={`relative flex-shrink-0 ${className}`}
      style={{ 
        width: size, 
        height: size,
        filter: shadow ? 'drop-shadow(0 20px 30px rgba(37, 99, 235, 0.3))' : 'none'
      }}
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="icon-bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <linearGradient id="icon-gloss" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.2" />
            <stop offset="50%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Squircle Background */}
        <rect width="100" height="100" rx="22" fill="url(#icon-bg-grad)" />
        
        {/* Subtle Inner Glow */}
        <rect x="2" y="2" width="96" height="96" rx="20" stroke="white" strokeOpacity="0.1" strokeWidth="1" />

        {/* The Scupted F */}
        <path 
          d="M32 28H68V40H46V50H64V62H46V80H32V28Z" 
          fill="white"
          className="drop-shadow-lg"
        />

        {/* Dynamic Pulse Line */}
        <path 
          d="M72 28V80" 
          stroke="white" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeDasharray="4 8"
          opacity="0.3"
        />

        {/* Gloss Effect */}
        <path 
          d="M22 0H78C90.1503 0 100 9.84974 100 22V40C100 40 70 50 0 40V22C0 9.84974 9.84974 0 22 0Z" 
          fill="url(#icon-gloss)" 
        />
      </svg>
    </div>
  );
};
