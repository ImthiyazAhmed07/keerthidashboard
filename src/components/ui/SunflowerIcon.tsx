import React from 'react';

interface SunflowerIconProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export const SunflowerIcon: React.FC<SunflowerIconProps> = ({
  className = '',
  size = 24,
  animated = false,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${animated ? 'hover:rotate-45 transition-transform duration-500 cursor-pointer' : ''} ${className}`}
    >
      <g>
        {/* Petals arranged circularly */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <ellipse
            key={deg}
            cx="50"
            cy="24"
            rx="7.5"
            ry="20"
            fill="url(#sunflower_petal_gradient)"
            transform={`rotate(${deg} 50 50)`}
          />
        ))}
        {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((deg) => (
          <ellipse
            key={`inner-${deg}`}
            cx="50"
            cy="28"
            rx="6"
            ry="16"
            fill="url(#sunflower_petal_inner_gradient)"
            transform={`rotate(${deg} 50 50)`}
          />
        ))}

        {/* Center disk */}
        <circle cx="50" cy="50" r="21" fill="#451a03" />
        <circle cx="50" cy="50" r="18" fill="#78350f" />
        <circle cx="50" cy="50" r="14" fill="#92400e" />

        {/* Texture dots */}
        <circle cx="47" cy="46" r="2.2" fill="#b45309" opacity="0.8" />
        <circle cx="53" cy="47" r="2" fill="#d97706" opacity="0.8" />
        <circle cx="49" cy="53" r="2.5" fill="#d97706" opacity="0.8" />
        <circle cx="44" cy="52" r="1.8" fill="#b45309" opacity="0.8" />
        <circle cx="55" cy="52" r="1.8" fill="#b45309" opacity="0.8" />
      </g>

      <defs>
        <linearGradient id="sunflower_petal_gradient" x1="50" y1="4" x2="50" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBBF24" />
          <stop offset="0.7" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="sunflower_petal_inner_gradient" x1="50" y1="12" x2="50" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FCD34D" />
          <stop offset="0.8" stopColor="#F59E0B" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
      </defs>
    </svg>
  );
};
