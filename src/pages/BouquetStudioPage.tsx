import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Flower,
  Sparkles,
  RotateCcw,
  RotateCw,
  Trash2,
  Download,
  Dices,
  Copy,
  Layers,
  ArrowUp,
  ArrowDown,
  Tag,
  Palette,
  Sliders,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Check,
} from 'lucide-react';
import {
  FLOWER_DEFINITIONS,
  WRAPPER_STYLES,
  BotanicalRenderer,
  FlowerDefinition,
  WrapperStyle,
} from '../components/bouquet/BotanicalAssets';
import { SunflowerIcon } from '../components/ui/SunflowerIcon';
import { fireSunflowerConfetti } from '../components/ui/Confetti';
import { useToast } from '../context/ToastContext';
import { ConfirmModal } from '../components/modals/ConfirmModal';

export interface PlacedStem {
  id: string;
  typeId: string;
  color: string;
  x: number; // percentage coordinates (0 to 100)
  y: number;
  rotation: number; // degrees
  scale: number; // multiplier (e.g. 0.8 - 1.5)
}

const PRESET_BOUQUETS: { name: string; wrapper: string; tag: string; stems: PlacedStem[] }[] = [
  {
    name: '🌻 Sunflower Sunshine',
    wrapper: 'kraft',
    tag: 'Brighten your day! 🌻',
    stems: [
      { id: '1', typeId: 'eucalyptus', color: '#64748b', x: 28, y: 32, rotation: -28, scale: 1.1 },
      { id: '2', typeId: 'eucalyptus', color: '#64748b', x: 72, y: 32, rotation: 28, scale: 1.1 },
      { id: '3', typeId: 'fern', color: '#16a34a', x: 50, y: 25, rotation: 0, scale: 1.1 },
      { id: '4', typeId: 'babys-breath', color: '#ffffff', x: 35, y: 40, rotation: -15, scale: 0.9 },
      { id: '5', typeId: 'babys-breath', color: '#ffffff', x: 65, y: 40, rotation: 15, scale: 0.9 },
      { id: '6', typeId: 'sunflower-classic', color: '#f59e0b', x: 50, y: 44, rotation: 0, scale: 1.25 },
      { id: '7', typeId: 'sunflower-teddy', color: '#f59e0b', x: 34, y: 50, rotation: -18, scale: 1.05 },
      { id: '8', typeId: 'sunflower-sunburst', color: '#dc2626', x: 66, y: 50, rotation: 18, scale: 1.05 },
      { id: '9', typeId: 'daisy', color: '#ffffff', x: 50, y: 62, rotation: 5, scale: 0.85 },
      { id: '10', typeId: 'butterfly-gold', color: '#f59e0b', x: 75, y: 25, rotation: 15, scale: 0.75 },
    ],
  },
  {
    name: '🌹 Garden Romance',
    wrapper: 'linen-white',
    tag: 'Sending warm smiles ✨',
    stems: [
      { id: '1', typeId: 'ruscus', color: '#22c55e', x: 30, y: 30, rotation: -30, scale: 1.0 },
      { id: '2', typeId: 'ruscus', color: '#22c55e', x: 70, y: 30, rotation: 30, scale: 1.0 },
      { id: '3', typeId: 'rose', color: '#f472b6', x: 50, y: 40, rotation: 0, scale: 1.2 },
      { id: '4', typeId: 'rose', color: '#e11d48', x: 35, y: 48, rotation: -15, scale: 1.05 },
      { id: '5', typeId: 'rose', color: '#fef08a', x: 65, y: 48, rotation: 15, scale: 1.05 },
      { id: '6', typeId: 'babys-breath', color: '#ffffff', x: 50, y: 58, rotation: 0, scale: 0.9 },
      { id: '7', typeId: 'sparkles', color: '#fbbf24', x: 78, y: 22, rotation: 0, scale: 0.8 },
    ],
  },
  {
    name: '🌾 Lavender Meadow',
    wrapper: 'pastel-lavender',
    tag: 'Peace & Mindfulness 🌿',
    stems: [
      { id: '1', typeId: 'fern', color: '#65a30d', x: 30, y: 30, rotation: -25, scale: 1.0 },
      { id: '2', typeId: 'fern', color: '#65a30d', x: 70, y: 30, rotation: 25, scale: 1.0 },
      { id: '3', typeId: 'lavender', color: '#8b5cf6', x: 42, y: 35, rotation: -10, scale: 1.1 },
      { id: '4', typeId: 'lavender', color: '#8b5cf6', x: 58, y: 35, rotation: 10, scale: 1.1 },
      { id: '5', typeId: 'daisy', color: '#ffffff', x: 50, y: 48, rotation: 0, scale: 1.0 },
      { id: '6', typeId: 'tulip', color: '#fbcfe8', x: 32, y: 52, rotation: -20, scale: 0.95 },
      { id: '7', typeId: 'tulip', color: '#fbcfe8', x: 68, y: 52, rotation: 20, scale: 0.95 },
      { id: '8', typeId: 'butterfly-gold', color: '#38bdf8', x: 25, y: 22, rotation: -20, scale: 0.7 },
    ],
  },
];

export const BouquetStudioPage: React.FC = () => {
  const { showToast } = useToast();

  const [stems, setStems] = useState<PlacedStem[]>(PRESET_BOUQUETS[0].stems);
  const [selectedStemId, setSelectedStemId] = useState<string | null>(null);
  const [wrapperStyleId, setWrapperStyleId] = useState('kraft');
  const [greetingTag, setGreetingTag] = useState('For Keerthika 🌻');
  const [activeTab, setActiveTab] = useState<'sunflower' | 'flower' | 'greenery' | 'decoration' | 'wrapper'>('sunflower');
  const [activeCategoryColor, setActiveCategoryColor] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Undo / Redo history stack
  const historyRef = useRef<PlacedStem[][]>([PRESET_BOUQUETS[0].stems]);
  const historyIndexRef = useRef<number>(0);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; stemX: number; stemY: number }>({ x: 0, y: 0, stemX: 0, stemY: 0 });

  const currentWrapper = WRAPPER_STYLES.find((w) => w.id === wrapperStyleId) || WRAPPER_STYLES[0];
  const selectedStem = stems.find((s) => s.id === selectedStemId) || null;
  const selectedStemDef = selectedStem ? FLOWER_DEFINITIONS.find((f) => f.id === selectedStem.typeId) : null;

  // Save history state
  const pushHistory = useCallback((newStems: PlacedStem[]) => {
    const nextHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
    nextHistory.push(newStems);
    if (nextHistory.length > 30) nextHistory.shift();
    historyRef.current = nextHistory;
    historyIndexRef.current = nextHistory.length - 1;
    setCanUndo(historyIndexRef.current > 0);
    setCanRedo(false);
  }, []);

  const handleUndo = () => {
    if (historyIndexRef.current > 0) {
      historyIndexRef.current -= 1;
      const prevStems = historyRef.current[historyIndexRef.current];
      setStems(prevStems);
      setSelectedStemId(null);
      setCanUndo(historyIndexRef.current > 0);
      setCanRedo(true);
    }
  };

  const handleRedo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyIndexRef.current += 1;
      const nextStems = historyRef.current[historyIndexRef.current];
      setStems(nextStems);
      setSelectedStemId(null);
      setCanUndo(true);
      setCanRedo(historyIndexRef.current < historyRef.current.length - 1);
    }
  };

  // Add flower to canvas
  const handleAddFlower = (flowerDef: FlowerDefinition) => {
    const newStem: PlacedStem = {
      id: 'stem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      typeId: flowerDef.id,
      color: activeCategoryColor || flowerDef.defaultColor,
      x: 45 + (Math.random() * 10 - 5),
      y: 45 + (Math.random() * 10 - 5),
      rotation: Math.round(Math.random() * 30 - 15),
      scale: flowerDef.defaultScale || 1.0,
    };

    const nextStems = [...stems, newStem];
    setStems(nextStems);
    setSelectedStemId(newStem.id);
    pushHistory(nextStems);
    showToast(`Added ${flowerDef.name} 💐`, 'info');
  };

  // Update selected stem properties
  const updateSelectedStem = (updates: Partial<PlacedStem>) => {
    if (!selectedStemId) return;
    const nextStems = stems.map((s) => (s.id === selectedStemId ? { ...s, ...updates } : s));
    setStems(nextStems);
    pushHistory(nextStems);
  };

  // Layering
  const bringToFront = () => {
    if (!selectedStemId) return;
    const target = stems.find((s) => s.id === selectedStemId);
    if (!target) return;
    const rest = stems.filter((s) => s.id !== selectedStemId);
    const nextStems = [...rest, target];
    setStems(nextStems);
    pushHistory(nextStems);
  };

  const sendToBack = () => {
    if (!selectedStemId) return;
    const target = stems.find((s) => s.id === selectedStemId);
    if (!target) return;
    const rest = stems.filter((s) => s.id !== selectedStemId);
    const nextStems = [target, ...rest];
    setStems(nextStems);
    pushHistory(nextStems);
  };

  const duplicateSelected = () => {
    if (!selectedStem) return;
    const clone: PlacedStem = {
      ...selectedStem,
      id: 'stem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      x: Math.min(85, selectedStem.x + 5),
      y: Math.min(85, selectedStem.y + 5),
    };
    const nextStems = [...stems, clone];
    setStems(nextStems);
    setSelectedStemId(clone.id);
    pushHistory(nextStems);
    showToast('Duplicated flower 🌸', 'info');
  };

  const deleteSelected = () => {
    if (!selectedStemId) return;
    const nextStems = stems.filter((s) => s.id !== selectedStemId);
    setStems(nextStems);
    setSelectedStemId(null);
    pushHistory(nextStems);
    showToast('Removed item', 'info');
  };

  const clearAll = () => {
    setStems([]);
    setSelectedStemId(null);
    pushHistory([]);
    setShowClearConfirm(false);
    showToast('Bouquet cleared 🌻', 'info');
  };

  // Random Bouquet Generator
  const generateRandomBouquet = () => {
    const randomPreset = PRESET_BOUQUETS[Math.floor(Math.random() * PRESET_BOUQUETS.length)];
    const shuffledWrapper = WRAPPER_STYLES[Math.floor(Math.random() * WRAPPER_STYLES.length)];

    const randomizedStems: PlacedStem[] = randomPreset.stems.map((s) => {
      const def = FLOWER_DEFINITIONS.find((f) => f.id === s.typeId);
      const randomColor = def?.availableColors
        ? def.availableColors[Math.floor(Math.random() * def.availableColors.length)].hex
        : s.color;
      return {
        ...s,
        id: 'stem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        x: s.x + (Math.random() * 6 - 3),
        y: s.y + (Math.random() * 6 - 3),
        rotation: s.rotation + (Math.random() * 10 - 5),
        color: randomColor,
      };
    });

    setStems(randomizedStems);
    setWrapperStyleId(shuffledWrapper.id);
    setSelectedStemId(null);
    pushHistory(randomizedStems);
    fireSunflowerConfetti();
    showToast(`Generated: ${randomPreset.name} 💐`, 'success');
  };

  // Dragging Stems on Canvas (Pointer Events)
  const handlePointerDownStem = (e: React.PointerEvent, stemId: string) => {
    e.stopPropagation();
    setSelectedStemId(stemId);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const stem = stems.find((s) => s.id === stemId);
    if (!stem) return;

    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      stemX: stem.x,
      stemY: stem.y,
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMoveCanvas = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !selectedStemId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStartRef.current.x) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStartRef.current.y) / rect.height) * 100;

    const nextX = Math.max(5, Math.min(95, dragStartRef.current.stemX + deltaX));
    const nextY = Math.max(5, Math.min(95, dragStartRef.current.stemY + deltaY));

    setStems((prev) =>
      prev.map((s) => (s.id === selectedStemId ? { ...s, x: nextX, y: nextY } : s))
    );
  };

  const handlePointerUpCanvas = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      pushHistory(stems);
    }
  };

  return (
    <div
      className={`flex flex-col gap-6 max-w-6xl mx-auto transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-warm-50 dark:bg-darkbg-surface p-4 sm:p-8 overflow-y-auto max-w-none'
          : ''
      }`}
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-darkbg-card/80 p-5 sm:p-6 rounded-3xl border border-warm-200 dark:border-darkbg-border shadow-warm-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400 shadow-sm">
            <SunflowerIcon size={28} animated />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-warm-900 dark:text-warm-100 flex items-center gap-2">
              <span>Bouquet Studio</span>
              <Sparkles className="w-5 h-5 text-sunflower-500 animate-pulse" />
            </h1>
            <p className="text-xs text-warm-500 dark:text-warm-400 font-medium">
              Create and customize your own digital flower bouquet 💐🌻
            </p>
          </div>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className="p-2.5 rounded-2xl bg-warm-100 dark:bg-darkbg-surface hover:bg-warm-200 dark:hover:bg-darkbg-cardHover text-warm-700 dark:text-warm-300 transition-all disabled:opacity-30 active:scale-95"
            title="Undo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleRedo}
            disabled={!canRedo}
            className="p-2.5 rounded-2xl bg-warm-100 dark:bg-darkbg-surface hover:bg-warm-200 dark:hover:bg-darkbg-cardHover text-warm-700 dark:text-warm-300 transition-all disabled:opacity-30 active:scale-95"
            title="Redo"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={generateRandomBouquet}
            className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-sunflower-600 hover:from-amber-600 hover:to-sunflower-700 text-white font-bold text-xs flex items-center gap-2 shadow-warm-sm transition-all active:scale-95"
            title="Surprise Random Bouquet"
          >
            <Dices className="w-4 h-4" />
            <span>Surprise Me 🎲</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 rounded-2xl transition-all active:scale-95"
            title="Clear Bouquet"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 rounded-2xl bg-warm-100 dark:bg-darkbg-surface text-warm-700 dark:text-warm-300 hover:bg-warm-200 transition-all active:scale-95"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT / CENTER: Interactive Bouquet Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div
            ref={canvasRef}
            onPointerMove={handlePointerMoveCanvas}
            onPointerUp={handlePointerUpCanvas}
            onClick={() => setSelectedStemId(null)}
            className="relative w-full h-[520px] sm:h-[600px] rounded-[36px] bg-gradient-to-b from-amber-50/60 via-warm-50 to-warm-100 dark:from-darkbg-surface dark:via-darkbg-card dark:to-zinc-950 border border-warm-200/90 dark:border-darkbg-border shadow-warm-lg overflow-hidden select-none touch-none"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-300/20 dark:bg-amber-500/10 blur-3xl pointer-events-none" />

            {/* Bouquet Cone Wrapper Layer (Background) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-64 sm:w-72 h-80 pointer-events-none z-10 flex flex-col items-center justify-end">
              {/* Wrapping Paper Cone */}
              <svg viewBox="0 0 200 240" className="w-full h-full drop-shadow-md">
                {/* Back flap */}
                <polygon points="100,240 20,40 180,40" fill={currentWrapper.borderColor} opacity="0.4" />
                {/* Left Fold */}
                <polygon
                  points="100,240 10,40 100,100"
                  fill="url(#wrapper-gradient)"
                  stroke={currentWrapper.borderColor}
                  strokeWidth="1.5"
                />
                {/* Right Fold */}
                <polygon
                  points="100,240 190,40 100,100"
                  fill="url(#wrapper-gradient)"
                  stroke={currentWrapper.borderColor}
                  strokeWidth="1.5"
                />
                {/* Center Crease / Ribbon Waist */}
                <ellipse cx="100" cy="140" rx="36" ry="12" fill={currentWrapper.ribbonColor} />
                <path
                  d="M100 140 L70 180 L100 160 L130 180 Z"
                  fill={currentWrapper.ribbonColor}
                />
                {/* Bow knot */}
                <circle cx="100" cy="140" r="7" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />

                <defs>
                  <linearGradient id="wrapper-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fef3c7" />
                    <stop offset="100%" stopColor="#fde68a" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Greeting Card Tag on the Ribbon */}
              {greetingTag && (
                <div className="absolute bottom-16 px-4 py-1.5 rounded-xl bg-white dark:bg-darkbg-card border border-warm-300 dark:border-darkbg-border shadow-warm-md transform -rotate-6 text-center pointer-events-auto">
                  <p className="text-xs font-bold font-handwriting text-warm-900 dark:text-warm-100 truncate max-w-[180px]">
                    {greetingTag}
                  </p>
                </div>
              )}
            </div>

            {/* Placed Flowers / Greenery Stems on Canvas */}
            {stems.map((stem) => {
              const isSelected = stem.id === selectedStemId;
              return (
                <div
                  key={stem.id}
                  onPointerDown={(e) => handlePointerDownStem(e, stem.id)}
                  style={{
                    left: `${stem.x}%`,
                    top: `${stem.y}%`,
                    transform: `translate(-50%, -50%) rotate(${stem.rotation}deg) scale(${stem.scale})`,
                    cursor: 'grab',
                  }}
                  className={`absolute transition-shadow duration-150 ${
                    isSelected
                      ? 'ring-2 ring-sunflower-500 rounded-full p-1 shadow-warm-glow z-30'
                      : 'hover:scale-105 z-20'
                  }`}
                >
                  <BotanicalRenderer typeId={stem.typeId} color={stem.color} size={110} />
                </div>
              );
            })}

            {/* Canvas Bottom Hint */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-warm-500 dark:text-warm-400 font-medium pointer-events-none z-30">
              <span>🌻 Click & drag items to arrange</span>
              <span>{stems.length} items in bouquet</span>
            </div>
          </div>

          {/* Selected Item Floating Inspector Toolbar */}
          {selectedStem && (
            <div className="p-4 rounded-3xl bg-white/90 dark:bg-darkbg-card/90 backdrop-blur-md border border-sunflower-300 dark:border-sunflower-800 shadow-warm-md flex flex-wrap items-center justify-between gap-3 animate-slide-up">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-sunflower-100 dark:bg-sunflower-950 border border-sunflower-300 dark:border-sunflower-800">
                  <BotanicalRenderer typeId={selectedStem.typeId} color={selectedStem.color} size={28} />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-warm-900 dark:text-warm-100">
                    {selectedStemDef?.name || 'Selected Item'}
                  </h4>
                  <p className="text-[10px] text-warm-500">Edit rotation, scale, or color</p>
                </div>
              </div>

              {/* Controls: Rotate, Scale, Layer, Duplicate, Delete */}
              <div className="flex items-center flex-wrap gap-2">
                {/* Rotate Step */}
                <div className="flex items-center gap-1 bg-warm-100 dark:bg-darkbg-surface p-1 rounded-xl">
                  <button
                    onClick={() => updateSelectedStem({ rotation: (selectedStem.rotation - 15) % 360 })}
                    className="p-1 text-warm-700 dark:text-warm-300 hover:text-sunflower-600 rounded-lg"
                    title="Rotate left 15°"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono font-bold px-1">{selectedStem.rotation}°</span>
                  <button
                    onClick={() => updateSelectedStem({ rotation: (selectedStem.rotation + 15) % 360 })}
                    className="p-1 text-warm-700 dark:text-warm-300 hover:text-sunflower-600 rounded-lg"
                    title="Rotate right 15°"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Scale Step */}
                <div className="flex items-center gap-1 bg-warm-100 dark:bg-darkbg-surface p-1 rounded-xl">
                  <button
                    onClick={() => updateSelectedStem({ scale: Math.max(0.5, selectedStem.scale - 0.1) })}
                    className="p-1 text-warm-700 dark:text-warm-300 hover:text-sunflower-600 rounded-lg"
                    title="Shrink"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono font-bold px-1">{Math.round(selectedStem.scale * 100)}%</span>
                  <button
                    onClick={() => updateSelectedStem({ scale: Math.min(2.0, selectedStem.scale + 0.1) })}
                    className="p-1 text-warm-700 dark:text-warm-300 hover:text-sunflower-600 rounded-lg"
                    title="Enlarge"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Color Variations */}
                {selectedStemDef?.availableColors && (
                  <div className="flex items-center gap-1 bg-warm-100 dark:bg-darkbg-surface p-1 rounded-xl">
                    {selectedStemDef.availableColors.map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => updateSelectedStem({ color: c.hex })}
                        className={`w-4 h-4 rounded-full border ${
                          selectedStem.color === c.hex ? 'ring-2 ring-sunflower-500 scale-110' : ''
                        }`}
                        style={{ backgroundColor: c.hex, borderColor: '#cbd5e1' }}
                        title={c.name}
                      />
                    ))}
                  </div>
                )}

                {/* Layering: Bring to top / send to back */}
                <button
                  onClick={bringToFront}
                  className="p-1.5 rounded-xl bg-warm-100 dark:bg-darkbg-surface text-warm-700 dark:text-warm-300 hover:bg-warm-200"
                  title="Bring to Top"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={sendToBack}
                  className="p-1.5 rounded-xl bg-warm-100 dark:bg-darkbg-surface text-warm-700 dark:text-warm-300 hover:bg-warm-200"
                  title="Send to Bottom"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                {/* Duplicate */}
                <button
                  onClick={duplicateSelected}
                  className="p-1.5 rounded-xl bg-warm-100 dark:bg-darkbg-surface text-warm-700 dark:text-warm-300 hover:bg-warm-200"
                  title="Duplicate"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                {/* Delete */}
                <button
                  onClick={deleteSelected}
                  className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Botanical Library, Wrappers & Tag Editor (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Studio Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-white/80 dark:bg-darkbg-card/80 border border-warm-200 dark:border-darkbg-border rounded-3xl overflow-x-auto shadow-warm-sm">
            {[
              { id: 'sunflower', label: '🌻 Sunflowers' },
              { id: 'flower', label: '🌹 Flowers' },
              { id: 'greenery', label: '🌿 Greenery' },
              { id: 'decoration', label: '✨ Accents' },
              { id: 'wrapper', label: '🎁 Wrapper' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-3 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-sunflower-500 text-white shadow-warm-sm scale-[1.02]'
                    : 'text-warm-700 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-darkbg-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content 1-4: Botanical Items Picker */}
          {activeTab !== 'wrapper' ? (
            <div className="bg-white/80 dark:bg-darkbg-card/80 p-5 rounded-3xl border border-warm-200 dark:border-darkbg-border shadow-warm-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-warm-900 dark:text-warm-100 uppercase tracking-wider">
                  Tap to add to bouquet
                </h3>
                <span className="text-[10px] text-warm-400">Click multiple to layer</span>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {FLOWER_DEFINITIONS.filter((f) => f.category === activeTab).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleAddFlower(item)}
                    className="p-3 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200/80 dark:border-darkbg-border hover:border-sunflower-400 hover:shadow-warm-sm flex flex-col items-center text-center gap-2 group transition-all active:scale-95"
                  >
                    <div className="w-16 h-16 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BotanicalRenderer typeId={item.id} color={item.defaultColor} size={64} />
                    </div>
                    <span className="text-xs font-bold text-warm-800 dark:text-warm-200 truncate w-full">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Tab Content 5: Wrappers & Greeting Card Tag */
            <div className="bg-white/80 dark:bg-darkbg-card/80 p-5 rounded-3xl border border-warm-200 dark:border-darkbg-border shadow-warm-sm flex flex-col gap-4">
              <h3 className="text-xs font-extrabold text-warm-900 dark:text-warm-100 uppercase tracking-wider">
                Bouquet Covers & Wrappers
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {WRAPPER_STYLES.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setWrapperStyleId(w.id)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      wrapperStyleId === w.id
                        ? 'border-sunflower-500 bg-sunflower-50 dark:bg-sunflower-950/60 ring-2 ring-sunflower-400 font-bold'
                        : 'border-warm-200 dark:border-darkbg-border bg-warm-50 dark:bg-darkbg-surface text-warm-700 dark:text-warm-300 hover:bg-warm-100'
                    }`}
                  >
                    <span className="text-xs font-bold">{w.name}</span>
                    {wrapperStyleId === w.id && <Check className="w-4 h-4 text-sunflower-600" />}
                  </button>
                ))}
              </div>

              {/* Greeting Note Tag */}
              <div className="mt-3 pt-4 border-t border-warm-100 dark:border-darkbg-border flex flex-col gap-2">
                <label className="text-xs font-bold text-warm-700 dark:text-warm-300 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-sunflower-600" />
                  <span>Ribbon Greeting Message</span>
                </label>
                <input
                  type="text"
                  value={greetingTag}
                  maxLength={40}
                  placeholder="e.g. For Keerthika 🌻"
                  onChange={(e) => setGreetingTag(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sunflower-400"
                />
              </div>
            </div>
          )}

          {/* Quick Presets Carousel */}
          <div className="bg-white/80 dark:bg-darkbg-card/80 p-5 rounded-3xl border border-warm-200 dark:border-darkbg-border shadow-warm-sm">
            <h3 className="text-xs font-extrabold text-warm-900 dark:text-warm-100 uppercase tracking-wider mb-3">
              Inspiration Presets
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PRESET_BOUQUETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setStems(preset.stems);
                    setWrapperStyleId(preset.wrapper);
                    setGreetingTag(preset.tag);
                    setSelectedStemId(null);
                    pushHistory(preset.stems);
                    showToast(`Applied ${preset.name} 🌻`, 'info');
                  }}
                  className="p-2.5 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200/80 dark:border-darkbg-border hover:border-sunflower-400 text-xs font-bold text-warm-800 dark:text-warm-200 text-center transition-all active:scale-95"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={clearAll}
        title="Clear Bouquet"
        message="Are you sure you want to start a fresh empty bouquet? 🌻"
        confirmLabel="Clear Canvas"
      />
    </div>
  );
};
