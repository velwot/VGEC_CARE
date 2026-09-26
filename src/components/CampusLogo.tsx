import React from 'react';

interface CampusLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  subtitleText?: string;
  className?: string;
}

export const CampusLogo: React.FC<CampusLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  subtitleText = 'VGEC Chandkheda',
  className = '',
}) => {
  const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const titleSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : 'text-lg';
  const subSize = size === 'sm' ? 'text-[9px]' : 'text-[10px]';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Brand Icon SVG matching CampusCare mark */}
      <div
        className={`${iconSize} rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#00236f] flex items-center justify-center shadow-sm shrink-0 border border-blue-400/20`}
      >
        <svg
          viewBox="0 0 40 40"
          className="w-6 h-6 text-white"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hexagonal shield outline */}
          <path
            d="M20 6L31 12.5V25.5L20 32L9 25.5V12.5L20 6Z"
            stroke="#93c5fd"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          {/* Inner core circle */}
          <circle cx="20" cy="19" r="4.5" fill="#60a5fa" />
          {/* Accent glint */}
          <circle cx="23" cy="16" r="1.2" fill="#ffffff" />
        </svg>
      </div>

      <div className="flex flex-col leading-tight select-none">
        <div className={`font-bold tracking-tight font-display ${titleSize} flex items-center`}>
          <span className="text-[#0b1c30]">Campus</span>
          <span className="text-[#2563eb]">Care</span>
        </div>
        {showSubtitle && (
          <span
            className={`font-semibold tracking-wider text-slate-500 uppercase ${subSize}`}
          >
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
};
