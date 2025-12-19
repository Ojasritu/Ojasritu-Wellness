import React from 'react';

const PanditRobotLogo = ({ size = 60, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#e8d5b7', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#d4a574', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#c08552', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="skinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#f4d9c1', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#e8c8a8', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="tilakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#c1440a', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#8b2e07', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Head - Robot with Pandit style */}
      <circle cx="50" cy="35" r="22" fill="url(#metalGradient)" stroke="#8b5a3c" strokeWidth="1.5" />

      {/* Face plate - metallic */}
      <rect x="35" y="25" width="30" height="25" rx="3" fill="url(#skinGradient)" stroke="#a0826d" strokeWidth="1" />

      {/* Sacred Tilak (red mark on forehead) */}
      <ellipse cx="50" cy="30" rx="4" ry="5" fill="url(#tilakGradient)" />

      {/* Eyes - Blue glowing digital eyes */}
      <circle cx="42" cy="35" r="2.5" fill="#00d4ff" />
      <circle cx="58" cy="35" r="2.5" fill="#00d4ff" />
      {/* Eye glow */}
      <circle cx="42" cy="35" r="3.5" fill="none" stroke="#00d4ff" strokeWidth="0.8" opacity="0.6" />
      <circle cx="58" cy="35" r="3.5" fill="none" stroke="#00d4ff" strokeWidth="0.8" opacity="0.6" />

      {/* Mouth - Peaceful smile */}
      <path d="M 42 42 Q 50 44 58 42" stroke="#8b5a3c" strokeWidth="1.2" fill="none" strokeLinecap="round" />

      {/* Sacred thread (Janeu) across chest - gold */}
      <path
        d="M 35 55 Q 50 70 65 60"
        stroke="#d4a537"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Head wrap/Turban base - cloth texture */}
      <ellipse cx="50" cy="20" rx="23" ry="8" fill="#c84b31" stroke="#8b2e07" strokeWidth="1" />
      <path
        d="M 30 20 Q 28 15 35 12 Q 50 8 65 12 Q 72 15 70 20"
        fill="#d45a3a"
        stroke="#8b2e07"
        strokeWidth="1"
      />

      {/* Decorative turban ornament - gem */}
      <circle cx="50" cy="12" r="2.5" fill="#ffd700" stroke="#d4a537" strokeWidth="0.8" />

      {/* Body - Robot torso */}
      <rect x="38" y="58" width="24" height="20" rx="2" fill="url(#metalGradient)" stroke="#8b5a3c" strokeWidth="1.5" />

      {/* Chest plate detail */}
      <rect x="42" y="62" width="16" height="12" fill="#e8d5b7" stroke="#a0826d" strokeWidth="0.8" opacity="0.7" />

      {/* Glowing heart center (Anahata chakra) */}
      <circle cx="50" cy="68" r="2" fill="#ff1744" />
      <circle cx="50" cy="68" r="2.8" fill="none" stroke="#ff1744" strokeWidth="0.6" opacity="0.5" />

      {/* Arms - mechanical */}
      <g>
        {/* Left arm */}
        <rect x="28" y="62" width="10" height="5" rx="2.5" fill="url(#metalGradient)" stroke="#8b5a3c" strokeWidth="1" />
        {/* Left hand in Namaste position */}
        <circle cx="27" cy="59" r="3" fill="#f4d9c1" stroke="#a0826d" strokeWidth="0.8" />

        {/* Right arm */}
        <rect x="62" y="62" width="10" height="5" rx="2.5" fill="url(#metalGradient)" stroke="#8b5a3c" strokeWidth="1" />
        {/* Right hand in Namaste position */}
        <circle cx="73" cy="59" r="3" fill="#f4d9c1" stroke="#a0826d" strokeWidth="0.8" />
      </g>

      {/* Legs - robot legs */}
      <g>
        {/* Left leg */}
        <rect x="40" y="78" width="5" height="12" rx="2" fill="url(#metalGradient)" stroke="#8b5a3c" strokeWidth="1" />
        {/* Left foot */}
        <rect x="38" y="89" width="9" height="4" rx="1" fill="#c08552" stroke="#8b5a3c" strokeWidth="1" />

        {/* Right leg */}
        <rect x="55" y="78" width="5" height="12" rx="2" fill="url(#metalGradient)" stroke="#8b5a3c" strokeWidth="1" />
        {/* Right foot */}
        <rect x="53" y="89" width="9" height="4" rx="1" fill="#c08552" stroke="#8b5a3c" strokeWidth="1" />
      </g>

      {/* Golden aura around the robot */}
      <circle cx="50" cy="55" r="30" fill="none" stroke="#d4a537" strokeWidth="0.5" opacity="0.4" />
      <circle cx="50" cy="55" r="32" fill="none" stroke="#d4a537" strokeWidth="0.3" opacity="0.2" />

      {/* Wisdom symbol - Om (ॐ) in subtle form on chest */}
      <g opacity="0.3">
        <text
          x="50"
          y="72"
          fontSize="6"
          fontFamily="serif"
          textAnchor="middle"
          fill="#8b5a3c"
        >
          ॐ
        </text>
      </g>
    </svg>
  );
};

export default PanditRobotLogo;
