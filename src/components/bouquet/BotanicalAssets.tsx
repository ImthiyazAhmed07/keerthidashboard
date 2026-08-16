import React from 'react';

export interface FlowerDefinition {
  id: string;
  name: string;
  category: 'sunflower' | 'flower' | 'greenery' | 'decoration';
  defaultColor: string;
  availableColors: { name: string; hex: string }[];
  defaultScale: number;
}

export const FLOWER_DEFINITIONS: FlowerDefinition[] = [
  // 🌻 Sunflowers
  {
    id: 'sunflower-classic',
    name: 'Golden Sunflower',
    category: 'sunflower',
    defaultColor: '#f59e0b',
    availableColors: [
      { name: 'Sunflower Gold', hex: '#f59e0b' },
      { name: 'Honey Amber', hex: '#d97706' },
      { name: 'Bright Yellow', hex: '#fbbf24' },
      { name: 'Sunburst Orange', hex: '#ea580c' },
    ],
    defaultScale: 1.0,
  },
  {
    id: 'sunflower-teddy',
    name: 'Teddy Bear Sunflower',
    category: 'sunflower',
    defaultColor: '#f59e0b',
    availableColors: [
      { name: 'Warm Fluff', hex: '#f59e0b' },
      { name: 'Golden Marigold', hex: '#eab308' },
      { name: 'Autumn Ochre', hex: '#ca8a04' },
    ],
    defaultScale: 0.95,
  },
  {
    id: 'sunflower-sunburst',
    name: 'Sunburst Sunflower',
    category: 'sunflower',
    defaultColor: '#dc2626',
    availableColors: [
      { name: 'Crimson Sunburst', hex: '#dc2626' },
      { name: 'Sunset Bronze', hex: '#b45309' },
      { name: 'Copper Glow', hex: '#c2410c' },
    ],
    defaultScale: 0.9,
  },
  {
    id: 'sunflower-velvet',
    name: 'Velvet Sunflower',
    category: 'sunflower',
    defaultColor: '#881337',
    availableColors: [
      { name: 'Velvet Burgundy', hex: '#881337' },
      { name: 'Deep Plum', hex: '#701a75' },
      { name: 'Chocolate Bloom', hex: '#451a03' },
    ],
    defaultScale: 0.9,
  },
  {
    id: 'sunflower-mini',
    name: 'Mini Sunflower Bud',
    category: 'sunflower',
    defaultColor: '#f59e0b',
    availableColors: [
      { name: 'Petite Gold', hex: '#f59e0b' },
      { name: 'Soft Lemon', hex: '#fde047' },
      { name: 'Warm Apricot', hex: '#fb923c' },
    ],
    defaultScale: 0.65,
  },

  // 🌹 Classic & Garden Flowers
  {
    id: 'rose',
    name: 'Classic Rose',
    category: 'flower',
    defaultColor: '#e11d48',
    availableColors: [
      { name: 'Velvet Red', hex: '#e11d48' },
      { name: 'Blush Pink', hex: '#f472b6' },
      { name: 'Pure White', hex: '#f8fafc' },
      { name: 'Sunset Peach', hex: '#fb923c' },
      { name: 'Buttercream', hex: '#fef08a' },
      { name: 'Lilac Rose', hex: '#c084fc' },
    ],
    defaultScale: 0.85,
  },
  {
    id: 'tulip',
    name: 'Dutch Tulip',
    category: 'flower',
    defaultColor: '#f43f5e',
    availableColors: [
      { name: 'Crimson Tulip', hex: '#f43f5e' },
      { name: 'Pastel Pink', hex: '#fbcfe8' },
      { name: 'Golden Tulip', hex: '#facc15' },
      { name: 'Royal Purple', hex: '#9333ea' },
      { name: 'Ivory White', hex: '#ffffff' },
    ],
    defaultScale: 0.85,
  },
  {
    id: 'lily',
    name: 'Stargazer Lily',
    category: 'flower',
    defaultColor: '#ec4899',
    availableColors: [
      { name: 'Stargazer Pink', hex: '#ec4899' },
      { name: 'Madonna White', hex: '#ffffff' },
      { name: 'Golden Tiger', hex: '#f59e0b' },
      { name: 'Soft Peach', hex: '#fed7aa' },
    ],
    defaultScale: 0.95,
  },
  {
    id: 'daisy',
    name: 'Field Daisy',
    category: 'flower',
    defaultColor: '#ffffff',
    availableColors: [
      { name: 'Classic White', hex: '#ffffff' },
      { name: 'Gerber Pink', hex: '#f472b6' },
      { name: 'Lavender Daisy', hex: '#c084fc' },
      { name: 'Sunny Orange', hex: '#fb923c' },
    ],
    defaultScale: 0.75,
  },
  {
    id: 'daffodil',
    name: 'Spring Daffodil',
    category: 'flower',
    defaultColor: '#facc15',
    availableColors: [
      { name: 'Golden Trumpet', hex: '#facc15' },
      { name: 'White & Orange', hex: '#ffffff' },
      { name: 'Pale Cream', hex: '#fef9c3' },
    ],
    defaultScale: 0.8,
  },
  {
    id: 'orchid',
    name: 'Moth Orchid',
    category: 'flower',
    defaultColor: '#a855f7',
    availableColors: [
      { name: 'Royal Orchid', hex: '#a855f7' },
      { name: 'Pearl White', hex: '#ffffff' },
      { name: 'Sunset Magenta', hex: '#db2777' },
      { name: 'Soft Mint Pink', hex: '#fbcfe8' },
    ],
    defaultScale: 0.85,
  },
  {
    id: 'lavender',
    name: 'Fragrant Lavender',
    category: 'flower',
    defaultColor: '#8b5cf6',
    availableColors: [
      { name: 'Classic Violet', hex: '#8b5cf6' },
      { name: 'Deep Indigo', hex: '#6366f1' },
      { name: 'Soft Lilac', hex: '#a78bfa' },
    ],
    defaultScale: 0.9,
  },
  {
    id: 'carnation',
    name: 'Ruffled Carnation',
    category: 'flower',
    defaultColor: '#fb7185',
    availableColors: [
      { name: 'Soft Coral', hex: '#fb7185' },
      { name: 'Raspberry', hex: '#be123c' },
      { name: 'Cream White', hex: '#fffbeb' },
      { name: 'Lavender Frost', hex: '#ddd6fe' },
    ],
    defaultScale: 0.8,
  },
  {
    id: 'chrysanthemum',
    name: 'Chrysanthemum',
    category: 'flower',
    defaultColor: '#ea580c',
    availableColors: [
      { name: 'Autumn Ochre', hex: '#ea580c' },
      { name: 'Burgundy Pom-Pom', hex: '#9f1239' },
      { name: 'Golden Glow', hex: '#f59e0b' },
      { name: 'Soft Lavender', hex: '#c084fc' },
    ],
    defaultScale: 0.85,
  },
  {
    id: 'babys-breath',
    name: "Baby's Breath",
    category: 'flower',
    defaultColor: '#ffffff',
    availableColors: [
      { name: 'Cloud White', hex: '#ffffff' },
      { name: 'Blush Tint', hex: '#fce7f3' },
      { name: 'Lilac Mist', hex: '#f3e8ff' },
      { name: 'Golden Shimmer', hex: '#fef08a' },
    ],
    defaultScale: 0.85,
  },

  // 🌿 Greenery & Foliage
  {
    id: 'eucalyptus',
    name: 'Eucalyptus Sprig',
    category: 'greenery',
    defaultColor: '#64748b',
    availableColors: [
      { name: 'Silver Dollar', hex: '#64748b' },
      { name: 'Sage Green', hex: '#4ade80' },
      { name: 'Deep Forest', hex: '#166534' },
    ],
    defaultScale: 1.0,
  },
  {
    id: 'fern',
    name: 'Delicate Fern',
    category: 'greenery',
    defaultColor: '#16a34a',
    availableColors: [
      { name: 'Emerald Green', hex: '#16a34a' },
      { name: 'Olive Green', hex: '#65a30d' },
      { name: 'Mint Leaf', hex: '#86efac' },
    ],
    defaultScale: 1.0,
  },
  {
    id: 'monstera',
    name: 'Monstera Leaf',
    category: 'greenery',
    defaultColor: '#15803d',
    availableColors: [
      { name: 'Jungle Emerald', hex: '#15803d' },
      { name: 'Forest Shadow', hex: '#14532d' },
    ],
    defaultScale: 0.9,
  },
  {
    id: 'olive-branch',
    name: 'Olive Branch',
    category: 'greenery',
    defaultColor: '#4d7c0f',
    availableColors: [
      { name: 'Olive Grove', hex: '#4d7c0f' },
      { name: 'Soft Sage', hex: '#84cc16' },
    ],
    defaultScale: 0.95,
  },
  {
    id: 'ruscus',
    name: 'Ruscus Foliage',
    category: 'greenery',
    defaultColor: '#22c55e',
    availableColors: [
      { name: 'Vibrant Green', hex: '#22c55e' },
      { name: 'Dark Leaf', hex: '#1e3a24' },
    ],
    defaultScale: 0.9,
  },

  // ✨ Accents & Sparkles
  {
    id: 'butterfly-gold',
    name: 'Golden Butterfly',
    category: 'decoration',
    defaultColor: '#f59e0b',
    availableColors: [
      { name: 'Monarch Gold', hex: '#f59e0b' },
      { name: 'Blue Morpho', hex: '#38bdf8' },
      { name: 'Pink Swallowtail', hex: '#f472b6' },
      { name: 'Pearl White', hex: '#ffffff' },
    ],
    defaultScale: 0.65,
  },
  {
    id: 'sparkles',
    name: 'Stardust Sparkles',
    category: 'decoration',
    defaultColor: '#fbbf24',
    availableColors: [
      { name: 'Sunflower Gold', hex: '#fbbf24' },
      { name: 'Rose Gold', hex: '#f472b6' },
      { name: 'Diamond White', hex: '#ffffff' },
    ],
    defaultScale: 0.6,
  },
];

export interface WrapperStyle {
  id: string;
  name: string;
  type: 'cone' | 'vase' | 'basket';
  frontBg: string;
  backBg: string;
  borderColor: string;
  ribbonColor: string;
  texturePattern: string;
  isTranslucent?: boolean;
}

export const WRAPPER_STYLES: WrapperStyle[] = [
  {
    id: 'kraft',
    name: 'Rustic Kraft Paper',
    type: 'cone',
    frontBg: '#e2be88',
    backBg: '#b38f5c',
    borderColor: '#9a7543',
    ribbonColor: '#78350f',
    texturePattern: 'kraft',
  },
  {
    id: 'linen-white',
    name: 'Crisp White Linen',
    type: 'cone',
    frontBg: '#f8fafc',
    backBg: '#e2e8f0',
    borderColor: '#cbd5e1',
    ribbonColor: '#f59e0b',
    texturePattern: 'linen',
  },
  {
    id: 'pastel-lavender',
    name: 'Pastel Lilac & Blush',
    type: 'cone',
    frontBg: '#f5d0fe',
    backBg: '#e879f9',
    borderColor: '#c084fc',
    ribbonColor: '#a855f7',
    texturePattern: 'pastel',
  },
  {
    id: 'vintage-newspaper',
    name: 'Vintage French Gazette',
    type: 'cone',
    frontBg: '#f5f0e6',
    backBg: '#d7cbb5',
    borderColor: '#78716c',
    ribbonColor: '#292524',
    texturePattern: 'newspaper',
  },
  {
    id: 'golden-sunburst',
    name: 'Sunflower Gold Foil',
    type: 'cone',
    frontBg: '#fde047',
    backBg: '#ca8a04',
    borderColor: '#f59e0b',
    ribbonColor: '#92400e',
    texturePattern: 'gold',
  },
  {
    id: 'sage-velvet',
    name: 'Sage Forest Velvet',
    type: 'cone',
    frontBg: '#86efac',
    backBg: '#22c55e',
    borderColor: '#15803d',
    ribbonColor: '#14532d',
    texturePattern: 'velvet',
  },
  {
    id: 'midnight-celestial',
    name: 'Midnight Starlight',
    type: 'cone',
    frontBg: '#1e293b',
    backBg: '#0f172a',
    borderColor: '#f59e0b',
    ribbonColor: '#fbbf24',
    texturePattern: 'stars',
  },
  {
    id: 'sakura-blossom',
    name: 'Sakura Blossom Pink',
    type: 'cone',
    frontBg: '#fbcfe8',
    backBg: '#f472b6',
    borderColor: '#db2777',
    ribbonColor: '#e11d48',
    texturePattern: 'sakura',
  },
  {
    id: 'glass-vase',
    name: 'Crystal Glass Vase 🏺',
    type: 'vase',
    frontBg: 'rgba(255, 255, 255, 0.45)',
    backBg: 'rgba(241, 245, 249, 0.65)',
    borderColor: '#94a3b8',
    ribbonColor: '#0ea5e9',
    texturePattern: 'glass',
    isTranslucent: true,
  },
  {
    id: 'wicker-basket',
    name: 'Woven Wicker Basket 🧺',
    type: 'basket',
    frontBg: '#d97706',
    backBg: '#92400e',
    borderColor: '#78350f',
    ribbonColor: '#dc2626',
    texturePattern: 'wicker',
  },
  {
    id: 'frosted-organza',
    name: 'Frosted Organza Tulle',
    type: 'cone',
    frontBg: 'rgba(254, 243, 199, 0.65)',
    backBg: 'rgba(253, 230, 138, 0.85)',
    borderColor: '#fcd34d',
    ribbonColor: '#f59e0b',
    texturePattern: 'frosted',
    isTranslucent: true,
  },
  {
    id: 'coffee-roaster',
    name: 'Artisan Mocha Craft',
    type: 'cone',
    frontBg: '#78350f',
    backBg: '#451a03',
    borderColor: '#291102',
    ribbonColor: '#d97706',
    texturePattern: 'kraft',
  },
];

// SVG Botanical Renderer with Long Stems and Botanical Detail
export const BotanicalRenderer: React.FC<{
  typeId: string;
  color: string;
  size?: number;
}> = ({ typeId, color, size = 120 }) => {
  switch (typeId) {
    // 🌻 Sunflowers
    case 'sunflower-classic':
      return (
        <svg width={size} height={size * 1.3} viewBox="0 0 100 130" className="drop-shadow-sm pointer-events-none">
          {/* Long Stem */}
          <path d="M50 50 Q48 90 50 130" stroke="#15803d" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M50 80 Q72 74 74 90 Q56 94 50 84" fill="#16a34a" />
          <path d="M50 95 Q28 88 26 104 Q44 110 50 98" fill="#15803d" />

          {/* Radiating Petals */}
          {[...Array(16)].map((_, i) => {
            const angle = (i * 360) / 16;
            return (
              <path
                key={i}
                d="M50 50 C44 26 46 10 50 4 C54 10 56 26 50 50"
                fill={color}
                stroke="#d97706"
                strokeWidth="0.8"
                transform={`rotate(${angle} 50 50)`}
              />
            );
          })}

          {/* Inner Golden Layer */}
          {[...Array(16)].map((_, i) => {
            const angle = (i * 360) / 16 + 11.25;
            return (
              <path
                key={`in-${i}`}
                d="M50 50 C46 32 47 20 50 14 C53 20 54 32 50 50"
                fill="#fbbf24"
                transform={`rotate(${angle} 50 50)`}
              />
            );
          })}

          {/* Center Disk */}
          <circle cx="50" cy="50" r="18" fill="#451a03" />
          <circle cx="50" cy="50" r="15" fill="#78350f" stroke="#92400e" strokeWidth="1.5" strokeDasharray="3,2" />
          <circle cx="50" cy="50" r="10" fill="#451a03" stroke="#d97706" strokeWidth="1" strokeDasharray="2,2" />
          <circle cx="50" cy="50" r="5" fill="#291102" />
        </svg>
      );

    case 'sunflower-teddy':
      return (
        <svg width={size} height={size * 1.3} viewBox="0 0 100 130" className="drop-shadow-sm pointer-events-none">
          <path d="M50 50 Q52 90 50 130" stroke="#15803d" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M50 82 Q70 76 70 90 Q54 94 50 85" fill="#16a34a" />
          {[...Array(24)].map((_, i) => (
            <path
              key={i}
              d="M50 50 C42 30 45 10 50 6 C55 10 58 30 50 50"
              fill={color}
              transform={`rotate(${(i * 360) / 24} 50 50)`}
              opacity="0.9"
            />
          ))}
          {[...Array(18)].map((_, i) => (
            <path
              key={`m-${i}`}
              d="M50 50 C44 35 46 18 50 14 C54 18 56 35 50 50"
              fill="#fbbf24"
              transform={`rotate(${(i * 360) / 18 + 10} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="11" fill="#78350f" stroke="#ca8a04" strokeWidth="1.5" />
        </svg>
      );

    case 'sunflower-sunburst':
      return (
        <svg width={size} height={size * 1.3} viewBox="0 0 100 130" className="drop-shadow-sm pointer-events-none">
          <path d="M50 50 Q49 90 50 130" stroke="#15803d" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          {[...Array(16)].map((_, i) => (
            <path
              key={i}
              d="M50 50 C43 28 46 12 50 4 C54 12 57 28 50 50"
              fill="#f59e0b"
              transform={`rotate(${(i * 360) / 16} 50 50)`}
            />
          ))}
          {[...Array(16)].map((_, i) => (
            <path
              key={`s-${i}`}
              d="M50 50 C45 35 46 22 50 14 C54 22 55 35 50 50"
              fill={color}
              transform={`rotate(${(i * 360) / 16} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="17" fill="#451a03" />
          <circle cx="50" cy="50" r="11" fill="#180a02" stroke="#ea580c" strokeWidth="1.5" strokeDasharray="3,2" />
        </svg>
      );

    case 'sunflower-velvet':
      return (
        <svg width={size} height={size * 1.3} viewBox="0 0 100 130" className="drop-shadow-sm pointer-events-none">
          <path d="M50 50 Q51 90 50 130" stroke="#15803d" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          {[...Array(16)].map((_, i) => (
            <path
              key={i}
              d="M50 50 C44 26 46 12 50 4 C54 12 56 26 50 50"
              fill={color}
              stroke="#4c0519"
              strokeWidth="0.8"
              transform={`rotate(${(i * 360) / 16} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="18" fill="#1e1b4b" />
          <circle cx="50" cy="50" r="14" fill="#3b0764" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
          <circle cx="50" cy="50" r="8" fill="#09050e" />
        </svg>
      );

    case 'sunflower-mini':
      return (
        <svg width={size} height={size * 1.3} viewBox="0 0 100 130" className="drop-shadow-sm pointer-events-none">
          <path d="M50 50 Q48 90 50 130" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {[...Array(12)].map((_, i) => (
            <path
              key={i}
              d="M50 50 C45 30 46 16 50 8 C54 16 55 30 50 50"
              fill={color}
              stroke="#d97706"
              strokeWidth="0.8"
              transform={`rotate(${(i * 360) / 12} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="14" fill="#78350f" />
          <circle cx="50" cy="50" r="9" fill="#451a03" stroke="#f59e0b" strokeWidth="1" />
        </svg>
      );

    // 🌹 Roses
    case 'rose':
      return (
        <svg width={size} height={size * 1.3} viewBox="0 0 100 130" className="drop-shadow-sm pointer-events-none">
          <path d="M50 55 Q51 90 50 130" stroke="#15803d" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M50 80 Q70 74 68 86 Q52 90 50 82" fill="#16a34a" />
          <path d="M50 94 Q30 88 32 100 Q48 104 50 96" fill="#15803d" />
          <circle cx="50" cy="45" r="32" fill={color} opacity="0.9" />
          <path d="M22 45 C22 25 45 18 50 25 C55 18 78 25 78 45 C78 65 55 72 50 68 C45 72 22 65 22 45 Z" fill={color} />
          <path d="M28 42 C30 28 48 24 50 30 C52 24 70 28 72 42 C72 58 52 64 50 60 C48 64 28 58 28 42 Z" fill="#ffffff" opacity="0.25" />
          <path d="M34 40 C36 30 48 28 50 32 C52 28 64 30 66 40 C66 52 52 56 50 54 C48 56 34 52 34 40 Z" fill={color} filter="brightness(0.9)" />
          <circle cx="50" cy="42" r="10" fill={color} filter="brightness(0.8)" />
          <path d="M46 40 Q50 36 54 40 Q54 46 48 45" stroke="#ffffff" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </svg>
      );

    // 🌷 Tulips
    case 'tulip':
      return (
        <svg width={size} height={size * 1.3} viewBox="0 0 100 130" className="drop-shadow-sm pointer-events-none">
          <path d="M50 50 Q52 90 50 130" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M50 75 Q75 65 78 85 Q62 98 50 80" fill="#22c55e" />
          <path d="M50 16 C30 20 24 45 35 60 C42 66 50 66 50 66 C50 66 58 66 65 60 C76 45 70 20 50 16 Z" fill={color} />
          <path d="M36 56 C30 44 32 28 50 18 C38 30 36 46 44 58 Z" fill="#ffffff" opacity="0.3" />
          <path d="M64 56 C70 44 68 28 50 18 C62 30 64 46 56 58 Z" fill="#000000" opacity="0.15" />
          <path d="M42 22 C48 18 52 18 58 22 C56 38 44 38 42 22 Z" fill={color} filter="brightness(0.85)" />
        </svg>
      );

    // 🌸 Lilies
    case 'lily':
      return (
        <svg width={size} height={size * 1.3} viewBox="0 0 100 130" className="drop-shadow-sm pointer-events-none">
          <path d="M50 50 Q50 90 50 130" stroke="#15803d" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          {[...Array(6)].map((_, i) => (
            <path
              key={i}
              d="M50 50 C40 28 42 8 50 2 C58 8 60 28 50 50"
              fill={color}
              stroke="#ffffff"
              strokeWidth="0.8"
              transform={`rotate(${i * 60} 50 50)`}
            />
          ))}
          {[...Array(5)].map((_, i) => (
            <line
              key={`stamen-${i}`}
              x1="50"
              y1="50"
              x2="50"
              y2="30"
              stroke="#ca8a04"
              strokeWidth="1.5"
              strokeLinecap="round"
              transform={`rotate(${i * 72 + 15} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="4" fill="#15803d" />
        </svg>
      );

    // 🌼 Daisies
    case 'daisy':
      return (
        <svg width={size} height={size * 1.3} viewBox="0 0 100 130" className="drop-shadow-sm pointer-events-none">
          <path d="M50 50 Q50 90 50 130" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" fill="none" />
          {[...Array(14)].map((_, i) => (
            <ellipse
              key={i}
              cx="50"
              cy="24"
              rx="4.5"
              ry="16"
              fill={color}
              stroke="#e2e8f0"
              strokeWidth="0.6"
              transform={`rotate(${(i * 360) / 14} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="10" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
          <circle cx="50" cy="50" r="6" fill="#fbbf24" />
        </svg>
      );

    // 🌿 Daffodils
    case 'daffodil':
      return (
        <svg width={size} height={size * 1.3} viewBox="0 0 100 130" className="drop-shadow-sm pointer-events-none">
          <path d="M50 50 Q52 90 50 130" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" fill="none" />
          {[...Array(6)].map((_, i) => (
            <path
              key={i}
              d="M50 50 C38 32 40 16 50 10 C60 16 62 32 50 50"
              fill={color}
              transform={`rotate(${i * 60} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="14" fill="#f59e0b" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3,2" />
          <circle cx="50" cy="50" r="8" fill="#ea580c" />
        </svg>
      );

    // 🌺 Orchids
    case 'orchid':
      return (
        <svg width={size} height={size * 1.3} viewBox="0 0 100 130" className="drop-shadow-sm pointer-events-none">
          <path d="M50 50 Q48 90 50 130" stroke="#15803d" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M50 50 C44 28 46 14 50 6 C54 14 56 28 50 50" fill={color} opacity="0.9" />
          <path d="M50 50 C30 42 16 44 8 50 C16 56 30 58 50 50" fill={color} opacity="0.9" />
          <path d="M50 50 C70 42 84 44 92 50 C84 56 70 58 50 50" fill={color} opacity="0.9" />
          <path d="M50 50 C32 30 20 24 16 32 C12 40 28 54 50 50" fill={color} />
          <path d="M50 50 C68 30 80 24 84 32 C88 40 72 54 50 50" fill={color} />
          <path d="M50 48 C42 56 44 68 50 72 C56 68 58 56 50 48" fill="#ec4899" />
          <circle cx="50" cy="50" r="4" fill="#facc15" />
        </svg>
      );

    // 🌾 Lavender
    case 'lavender':
      return (
        <svg width={size} height={size * 1.3} viewBox="0 0 100 130" className="drop-shadow-sm pointer-events-none">
          <path d="M50 10 L50 130" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" />
          {[...Array(12)].map((_, i) => {
            const y = 15 + i * 6;
            return (
              <g key={i}>
                <ellipse cx="44" cy={y} rx="5" ry="3.5" fill={color} transform={`rotate(-20 44 ${y})`} />
                <ellipse cx="56" cy={y} rx="5" ry="3.5" fill={color} transform={`rotate(20 56 ${y})`} />
                <ellipse cx="50" cy={y - 2} rx="4" ry="3" fill="#c084fc" />
              </g>
            );
          })}
        </svg>
      );

    // 💮 Carnations
    case 'carnation':
      return (
        <svg width={size} height={size * 1.3} viewBox="0 0 100 130" className="drop-shadow-sm pointer-events-none">
          <path d="M50 55 Q51 90 50 130" stroke="#15803d" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          {[...Array(16)].map((_, i) => (
            <path
              key={i}
              d="M50 50 C40 35 42 20 50 14 C58 20 60 35 50 50"
              fill={color}
              stroke="#ffffff"
              strokeWidth="0.8"
              strokeDasharray="2,1"
              transform={`rotate(${(i * 360) / 16} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="14" fill={color} filter="brightness(0.9)" />
          <circle cx="50" cy="50" r="8" fill={color} filter="brightness(0.8)" />
        </svg>
      );

    // 🌼 Chrysanthemums
    case 'chrysanthemum':
      return (
        <svg width={size} height={size * 1.3} viewBox="0 0 100 130" className="drop-shadow-sm pointer-events-none">
          <path d="M50 50 Q50 90 50 130" stroke="#15803d" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          {[...Array(20)].map((_, i) => (
            <path
              key={i}
              d="M50 50 C45 32 46 14 50 8 C54 14 55 32 50 50"
              fill={color}
              transform={`rotate(${(i * 360) / 20} 50 50)`}
            />
          ))}
          <circle cx="50" cy="50" r="8" fill="#ca8a04" />
        </svg>
      );

    // ☁️ Baby's Breath
    case 'babys-breath':
      return (
        <svg width={size} height={size * 1.3} viewBox="0 0 100 130" className="drop-shadow-sm pointer-events-none">
          <path d="M50 130 L50 60 Q35 45 25 30" stroke="#16a34a" strokeWidth="2.5" fill="none" />
          <path d="M50 60 Q65 45 75 30" stroke="#16a34a" strokeWidth="2.5" fill="none" />
          <path d="M50 60 L50 25" stroke="#16a34a" strokeWidth="2.5" fill="none" />
          {[
            { cx: 25, cy: 30 },
            { cx: 75, cy: 30 },
            { cx: 50, cy: 22 },
            { cx: 42, cy: 28 },
            { cx: 58, cy: 28 },
            { cx: 20, cy: 22 },
            { cx: 80, cy: 22 },
            { cx: 34, cy: 18 },
            { cx: 66, cy: 18 },
            { cx: 50, cy: 12 },
          ].map((pt, i) => (
            <circle key={i} cx={pt.cx} cy={pt.cy} r="5" fill={color} stroke="#cbd5e1" strokeWidth="0.8" />
          ))}
        </svg>
      );

    // 🌿 Eucalyptus
    case 'eucalyptus':
      return (
        <svg width={size} height={size * 1.3} viewBox="0 0 100 130" className="drop-shadow-sm pointer-events-none">
          <path d="M50 10 Q48 70 50 130" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {[...Array(6)].map((_, i) => {
            const y = 20 + i * 14;
            return (
              <g key={i}>
                <ellipse cx="36" cy={y} rx="13" ry="10" fill={color} opacity="0.9" transform={`rotate(-25 36 ${y})`} />
                <ellipse cx="64" cy={y + 4} rx="13" ry="10" fill={color} opacity="0.9" transform={`rotate(25 64 ${y + 4})`} />
              </g>
            );
          })}
          <ellipse cx="50" cy="14" rx="9" ry="7" fill={color} />
        </svg>
      );

    // 🌿 Fern
    case 'fern':
      return (
        <svg width={size} height={size * 1.3} viewBox="0 0 100 130" className="drop-shadow-sm pointer-events-none">
          <path d="M50 10 Q53 70 50 130" stroke="#14532d" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {[...Array(9)].map((_, i) => {
            const y = 20 + i * 10;
            const w = 20 - i * 0.8;
            return (
              <g key={i}>
                <path d={`M50 ${y} Q30 ${y - 8} ${50 - w} ${y - 4}`} stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <path d={`M50 ${y + 2} Q70 ${y - 6} ${50 + w} ${y - 2}`} stroke={color} strokeWidth="3.5" strokeLinecap="round" fill="none" />
              </g>
            );
          })}
        </svg>
      );

    // 🌿 Monstera
    case 'monstera':
      return (
        <svg width={size} height={size * 1.3} viewBox="0 0 100 130" className="drop-shadow-sm pointer-events-none">
          <path d="M50 65 L50 130" stroke="#14532d" strokeWidth="4.5" strokeLinecap="round" />
          <path
            d="M50 15 C30 15 20 35 22 55 C24 70 40 75 50 75 C60 75 76 70 78 55 C80 35 70 15 50 15 Z"
            fill={color}
          />
          <line x1="50" y1="18" x2="50" y2="75" stroke="#14532d" strokeWidth="2.5" />
          <line x1="50" y1="35" x2="30" y2="28" stroke="#14532d" strokeWidth="1.8" />
          <line x1="50" y1="35" x2="70" y2="28" stroke="#14532d" strokeWidth="1.8" />
        </svg>
      );

    // 🌿 Olive Branch
    case 'olive-branch':
      return (
        <svg width={size} height={size * 1.3} viewBox="0 0 100 130" className="drop-shadow-sm pointer-events-none">
          <path d="M50 15 Q46 70 50 130" stroke="#365314" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          {[...Array(6)].map((_, i) => {
            const y = 24 + i * 12;
            return (
              <g key={i}>
                <ellipse cx="36" cy={y} rx="12" ry="5" fill={color} transform={`rotate(-30 36 ${y})`} />
                <ellipse cx="64" cy={y + 3} rx="12" ry="5" fill={color} transform={`rotate(30 64 ${y + 3})`} />
                {i % 2 === 0 && <circle cx="48" cy={y + 5} r="3.5" fill="#1c1917" />}
              </g>
            );
          })}
        </svg>
      );

    // 🌿 Ruscus
    case 'ruscus':
      return (
        <svg width={size} height={size * 1.3} viewBox="0 0 100 130" className="drop-shadow-sm pointer-events-none">
          <path d="M50 12 L50 130" stroke="#14532d" strokeWidth="3.5" strokeLinecap="round" />
          {[...Array(8)].map((_, i) => {
            const y = 18 + i * 11;
            return (
              <g key={i}>
                <ellipse cx="38" cy={y} rx="10" ry="5" fill={color} transform={`rotate(-35 38 ${y})`} />
                <ellipse cx="62" cy={y + 2} rx="10" ry="5" fill={color} transform={`rotate(35 62 ${y + 2})`} />
              </g>
            );
          })}
        </svg>
      );

    // 🦋 Butterfly
    case 'butterfly-gold':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-md pointer-events-none">
          <path d="M48 48 C30 20 10 25 15 45 C18 55 35 55 48 50 Z" fill={color} stroke="#1e293b" strokeWidth="1" />
          <path d="M48 52 C32 55 18 65 24 78 C30 85 45 70 48 54 Z" fill={color} filter="brightness(0.9)" stroke="#1e293b" strokeWidth="1" />
          <path d="M52 48 C70 20 90 25 85 45 C82 55 65 55 52 50 Z" fill={color} stroke="#1e293b" strokeWidth="1" />
          <path d="M52 52 C68 55 82 65 76 78 C70 85 55 70 52 54 Z" fill={color} filter="brightness(0.9)" stroke="#1e293b" strokeWidth="1" />
          <ellipse cx="50" cy="50" rx="3" ry="16" fill="#0f172a" />
          <path d="M50 36 Q42 22 38 20" stroke="#0f172a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M50 36 Q58 22 62 20" stroke="#0f172a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      );

    // ✨ Sparkles
    case 'sparkles':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-sm pointer-events-none animate-pulse-gentle">
          <path d="M50 15 Q50 50 15 50 Q50 50 50 85 Q50 50 85 50 Q50 50 50 15 Z" fill={color} />
          <path d="M25 25 Q25 38 12 38 Q25 38 25 51 Q25 38 38 38 Q25 38 25 25 Z" fill={color} opacity="0.8" />
          <path d="M75 65 Q75 75 65 75 Q75 75 75 85 Q75 75 85 75 Q75 75 75 65 Z" fill={color} opacity="0.8" />
        </svg>
      );

    default:
      return (
        <svg width={size} height={size * 1.3} viewBox="0 0 100 130">
          <path d="M50 50 L50 130" stroke="#15803d" strokeWidth="4" />
          <circle cx="50" cy="50" r="25" fill={color} />
        </svg>
      );
  }
};
