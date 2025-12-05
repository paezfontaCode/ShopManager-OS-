import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  textColor?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-10 w-auto", showText = true, textColor = "text-white" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center w-14 h-14">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
        >
          {/* Circular Arrows Design */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" /> {/* Sky 500 */}
              <stop offset="100%" stopColor="#06b6d4" /> {/* Cyan 500 */}
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Arrow 1 (Top Right) */}
          <path
            d="M50 20 C66.5685 20 80 33.4315 80 50"
            stroke="url(#logoGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            className="drop-shadow-lg"
          />
          <path
            d="M80 50 L70 45 L80 60 L90 45 L80 50"
            fill="url(#logoGradient)"
          />

          {/* Arrow 2 (Bottom Right) */}
          <path
            d="M80 50 C80 66.5685 66.5685 80 50 80"
            stroke="url(#logoGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M50 80 L55 70 L40 80 L55 90 L50 80"
            fill="url(#logoGradient)"
            opacity="0.9"
          />

          {/* Arrow 3 (Bottom Left) */}
          <path
            d="M50 80 C33.4315 80 20 66.5685 20 50"
            stroke="url(#logoGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M20 50 L30 55 L20 40 L10 55 L20 50"
            fill="url(#logoGradient)"
            opacity="0.8"
          />

          {/* Arrow 4 (Top Left) */}
          <path
            d="M20 50 C20 33.4315 33.4315 20 50 20"
            stroke="url(#logoGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M50 20 L45 30 L60 20 L45 10 L50 20"
            fill="url(#logoGradient)"
            opacity="0.7"
          />

        </svg>
      </div>

      {showText && (
        <div className="ml-3 flex flex-col justify-center">
          <h1 className={`text-xl font-bold tracking-tight ${textColor}`}>
            Service<span className="text-cyan-400">Flow</span>
          </h1>
        </div>
      )}
    </div>
  );
};

export default Logo;
