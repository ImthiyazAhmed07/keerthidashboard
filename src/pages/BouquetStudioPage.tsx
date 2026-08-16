import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Flower,
  Sparkles,
  RotateCcw,
  RotateCw,
  Trash2,
  Dices,
  Copy,
  ArrowUp,
  ArrowDown,
  Tag,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Check,
  Eye,
  EyeOff,
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
  inFront?: boolean; // whether pinned to front ribbon or tucked inside wrapper
}

const PRESET_BOUQUETS: { name: string; wrapper: string; tag: string; stems: PlacedStem[] }[] = [
  {
    name: '🌻 Sunflower Sunshine',
    wrapper: 'kraft',
    tag: 'Brighten your day! 🌻',
    stems: [
      { id: '1', typeId: 'eucalyptus', color: '#64748b', x: 26, y: 26, rotation: -28, scale: 1.1 },
      { id: '2', typeId: 'eucalyptus', color: '#64748b', x: 74, y: 26, rotation: 28, scale: 1.1 },
      { id: '3', typeId: 'fern', color: '#16a34a', x: 50, y: 18, rotation: 0, scale: 1.15 },
      { id: '4', typeId: 'babys-breath', color: '#ffffff', x: 34, y: 32, rotation: -15, scale: 0.95 },
      { id: '5', typeId: 'babys-breath', color: '#ffffff', x: 66, y: 32, rotation: 15, scale: 0.95 },
      { id: '6', typeId: 'sunflower-classic', color: '#f59e0b', x: 50, y: 36, rotation: 0, scale: 1.3 },
      { id: '7', typeId: 'sunflower-teddy', color: '#f59e0b', x: 33, y: 44, rotation: -18, scale: 1.1 },
      { id: '8', typeId: 'sunflower-sunburst', color: '#dc2626', x: 67, y: 44, rotation: 18, scale: 1.1 },
      { id: '9', typeId: 'daisy', color: '#ffffff', x: 50, y: 52, rotation: 5, scale: 0.9 },
      { id: '10', typeId: 'butterfly-gold', color: '#f59e0b', x: 78, y: 16, rotation: 15, scale: 0.8, inFront: true },
    ],
  },
  {
    name: '🌹 Garden Romance',
    wrapper: 'linen-white',
    tag: 'Sending warm smiles ✨',
    stems: [
      { id: '1', typeId: 'ruscus', color: '#22c55e', x: 28, y: 24, rotation: -30, scale: 1.05 },
      { id: '2', typeId: 'ruscus', color: '#22c55e', x: 72, y: 24, rotation: 30, scale: 1.05 },
      { id: '3', typeId: 'rose', color: '#f472b6', x: 50, y: 30, rotation: 0, scale: 1.25 },
      { id: '4', typeId: 'rose', color: '#e11d48', x: 34, y: 38, rotation: -15, scale: 1.1 },
      { id: '5', typeId: 'rose', color: '#fef08a', x: 66, y: 38, rotation: 15, scale: 1.1 },
      { id: '6', typeId: 'babys-breath', color: '#ffffff', x: 50, y: 48, rotation: 0, scale: 0.95 },
      { id: '7', typeId: 'sparkles', color: '#fbbf24', x: 80, y: 18, rotation: 0, scale: 0.85, inFront: true },
    ],
  },
  {
    name: '🏺 Crystal Spring Vase',
    wrapper: 'glass-vase',
    tag: 'Fresh Morning Blooms 🌿',
    stems: [
      { id: '1', typeId: 'fern', color: '#65a30d', x: 28, y: 26, rotation: -25, scale: 1.05 },
      { id: '2', typeId: 'fern', color: '#65a30d', x: 72, y: 26, rotation: 25, scale: 1.05 },
      { id: '3', typeId: 'tulip', color: '#facc15', x: 42, y: 32, rotation: -10, scale: 1.1 },
      { id: '4', typeId: 'tulip', color: '#f43f5e', x: 58, y: 32, rotation: 10, scale: 1.1 },
      { id: '5', typeId: 'daffodil', color: '#facc15', x: 50, y: 42, rotation: 0, scale: 1.05 },
      { id: '6', typeId: 'eucalyptus', color: '#64748b', x: 50, y: 20, rotation: 0, scale: 1.1 },
      { id: '7', typeId: 'butterfly-gold', color: '#38bdf8', x: 22, y: 18, rotation: -20, scale: 0.75, inFront: true },
    ],
  },
  {
    name: '🧺 Wicker Garden Harvest',
    wrapper: 'wicker-basket',
    tag: 'Gathered with Love 🧺',
    stems: [
      { id: '1', typeId: 'olive-branch', color: '#4d7c0f', x: 26, y: 26, rotation: -32, scale: 1.05 },
      { id: '2', typeId: 'olive-branch', color: '#4d7c0f', x: 74, y: 26, rotation: 32, scale: 1.05 },
      { id: '3', typeId: 'sunflower-classic', color: '#f59e0b', x: 50, y: 32, rotation: 0, scale: 1.25 },
      { id: '4', typeId: 'sunflower-mini', color: '#f59e0b', x: 35, y: 40, rotation: -15, scale: 1.1 },
      { id: '5', typeId: 'chrysanthemum', color: '#ea580c', x: 65, y: 40, rotation: 15, scale: 1.1 },
      { id: '6', typeId: 'daisy', color: '#ffffff', x: 50, y: 48, rotation: 0, scale: 0.95 },
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

  const currentWrapper: WrapperStyle = WRAPPER_STYLES.find((w) => w.id === wrapperStyleId) || WRAPPER_STYLES[0];
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
      y: 35 + (Math.random() * 10 - 5),
      rotation: Math.round(Math.random() * 24 - 12),
      scale: flowerDef.defaultScale || 1.0,
      inFront: flowerDef.category === 'decoration',
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
        rotation: s.rotation + (Math.random() * 8 - 4),
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

  // Stems placed inside the wrapper vs pinned in front
  const insideStems = stems.filter((s) => !s.inFront);
  const frontStems = stems.filter((s) => s.inFront);

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
              <span>Bouquet Studio 3D</span>
              <Sparkles className="w-5 h-5 text-sunflower-500 animate-pulse" />
            </h1>
            <p className="text-xs text-warm-500 dark:text-warm-400 font-medium">
              3D interactive bouquet design • Tucked stems inside wraps, vases & baskets 💐🌻
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
        {/* LEFT / CENTER: Interactive 3D Bouquet Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div
            ref={canvasRef}
            onPointerMove={handlePointerMoveCanvas}
            onPointerUp={handlePointerUpCanvas}
            onClick={() => setSelectedStemId(null)}
            className="relative w-full h-[540px] sm:h-[620px] rounded-[36px] bg-gradient-to-b from-amber-50/60 via-warm-50 to-warm-100 dark:from-darkbg-surface dark:via-darkbg-card dark:to-zinc-950 border border-warm-200/90 dark:border-darkbg-border shadow-warm-lg overflow-hidden select-none touch-none"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-300/20 dark:bg-amber-500/10 blur-3xl pointer-events-none" />

            {/* ======================================================== */}
            {/* LAYER 1: BACK 3D WRAPPER PANEL / CONE INTERIOR (z-index: 10) */}
            {/* ======================================================== */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-72 sm:w-80 h-[340px] pointer-events-none z-10 flex flex-col items-center justify-end">
              {currentWrapper.type === 'cone' && (
                <svg viewBox="0 0 240 280" className="w-full h-full drop-shadow-sm">
                  {/* Back fan / interior fold */}
                  <polygon points="120,270 20,50 220,50" fill={currentWrapper.backBg} />
                  {/* Inner depth shadow */}
                  <polygon points="120,270 50,60 190,60" fill="#000000" opacity="0.12" />
                </svg>
              )}

              {currentWrapper.type === 'vase' && (
                <svg viewBox="0 0 240 280" className="w-full h-full">
                  {/* Back of glass vase with water depth */}
                  <rect x="50" y="80" width="140" height="180" rx="20" fill={currentWrapper.backBg} stroke={currentWrapper.borderColor} strokeWidth="2" opacity="0.6" />
                  <rect x="52" y="130" width="136" height="126" rx="10" fill="#38bdf8" opacity="0.15" />
                </svg>
              )}

              {currentWrapper.type === 'basket' && (
                <svg viewBox="0 0 240 280" className="w-full h-full">
                  {/* Basket interior rim and back wall */}
                  <ellipse cx="120" cy="110" rx="90" ry="25" fill={currentWrapper.backBg} stroke={currentWrapper.borderColor} strokeWidth="3" />
                </svg>
              )}
            </div>

            {/* ======================================================== */}
            {/* LAYER 2: FLOWERS & GREENERY (INSIDE WRAPPER) (z-index: 20) */}
            {/* ======================================================== */}
            {insideStems.map((stem) => {
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
                  className={`absolute transition-shadow duration-150 z-20 ${
                    isSelected
                      ? 'ring-2 ring-sunflower-500 rounded-full p-1 shadow-warm-glow !z-25'
                      : 'hover:scale-105'
                  }`}
                >
                  <BotanicalRenderer typeId={stem.typeId} color={stem.color} size={115} />
                </div>
              );
            })}

            {/* ======================================================== */}
            {/* LAYER 3: FRONT 3D WRAPPER FLAPS & RIBBON (z-index: 30) */}
            {/* ======================================================== */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-72 sm:w-80 h-[340px] pointer-events-none z-30 flex flex-col items-center justify-end">
              {currentWrapper.type === 'cone' && (
                <svg viewBox="0 0 240 280" className="w-full h-full drop-shadow-lg">
                  {/* Left Folding Flap */}
                  <polygon
                    points="120,270 15,80 120,150"
                    fill={currentWrapper.frontBg}
                    stroke={currentWrapper.borderColor}
                    strokeWidth="2"
                    opacity={currentWrapper.isTranslucent ? 0.75 : 0.98}
                  />
                  {/* Right Folding Flap (Crossing Over Left) */}
                  <polygon
                    points="120,270 225,80 120,150"
                    fill={currentWrapper.frontBg}
                    stroke={currentWrapper.borderColor}
                    strokeWidth="2"
                    opacity={currentWrapper.isTranslucent ? 0.75 : 0.98}
                  />
                  {/* Center Fold Highlights */}
                  <line x1="120" y1="150" x2="120" y2="270" stroke={currentWrapper.borderColor} strokeWidth="1.5" opacity="0.6" />

                  {/* Tied Ribbon Waist */}
                  <ellipse cx="120" cy="185" rx="42" ry="14" fill={currentWrapper.ribbonColor} />
                  {/* Ribbon Bow Tails */}
                  <path d="M120 185 L90 230 L115 210 L140 230 Z" fill={currentWrapper.ribbonColor} />
                  <circle cx="120" cy="185" r="8" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
                </svg>
              )}

              {currentWrapper.type === 'vase' && (
                <svg viewBox="0 0 240 280" className="w-full h-full drop-shadow-md">
                  {/* Glass front with water level & highlight reflections */}
                  <rect
                    x="50"
                    y="80"
                    width="140"
                    height="180"
                    rx="20"
                    fill={currentWrapper.frontBg}
                    stroke={currentWrapper.borderColor}
                    strokeWidth="3"
                    className="backdrop-blur-[1px]"
                  />
                  {/* Glass shine reflection streak */}
                  <path d="M65 100 L65 240" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.6" />
                  <path d="M75 110 L75 220" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
                  {/* Water line */}
                  <line x1="52" y1="130" x2="188" y2="130" stroke="#38bdf8" strokeWidth="3" strokeDasharray="6,4" opacity="0.7" />
                  {/* Ribbon bow around vase neck */}
                  <rect x="48" y="90" width="144" height="12" rx="4" fill={currentWrapper.ribbonColor} />
                  <circle cx="120" cy="96" r="7" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
                </svg>
              )}

              {currentWrapper.type === 'basket' && (
                <svg viewBox="0 0 240 280" className="w-full h-full drop-shadow-lg">
                  {/* Woven Basket Body */}
                  <path
                    d="M35 110 L50 250 Q120 270 190 250 L205 110 Q120 125 35 110 Z"
                    fill={currentWrapper.frontBg}
                    stroke={currentWrapper.borderColor}
                    strokeWidth="3"
                  />
                  {/* Woven texture lines */}
                  {[...Array(6)].map((_, i) => (
                    <path
                      key={i}
                      d={`M${40 + i * 2} ${130 + i * 20} Q120 ${145 + i * 20} ${200 - i * 2} ${130 + i * 20}`}
                      stroke={currentWrapper.borderColor}
                      strokeWidth="2"
                      fill="none"
                      opacity="0.6"
                    />
                  ))}
                  {/* Basket Rim */}
                  <ellipse cx="120" cy="110" rx="88" ry="16" fill="none" stroke={currentWrapper.borderColor} strokeWidth="5" />
                  {/* Front Ribbon Bow */}
                  <circle cx="120" cy="125" r="8" fill={currentWrapper.ribbonColor} />
                  <path d="M120 125 L95 160 L120 145 L145 160 Z" fill={currentWrapper.ribbonColor} />
                </svg>
              )}

              {/* Greeting Card Tag on the Ribbon */}
              {greetingTag && (
                <div className="absolute bottom-12 px-4 py-1.5 rounded-xl bg-white/95 dark:bg-darkbg-card/95 border border-warm-300 dark:border-darkbg-border shadow-warm-md transform -rotate-6 text-center pointer-events-auto z-40">
                  <p className="text-xs font-bold font-handwriting text-warm-900 dark:text-warm-100 truncate max-w-[180px]">
                    {greetingTag}
                  </p>
                </div>
              )}
            </div>

            {/* ======================================================== */}
            {/* LAYER 4: PINNED FRONT ACCENTS & BUTTERFLIES (z-index: 40) */}
            {/* ======================================================== */}
            {frontStems.map((stem) => {
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
                  className={`absolute transition-shadow duration-150 z-40 ${
                    isSelected
                      ? 'ring-2 ring-sunflower-500 rounded-full p-1 shadow-warm-glow'
                      : 'hover:scale-105'
                  }`}
                >
                  <BotanicalRenderer typeId={stem.typeId} color={stem.color} size={115} />
                </div>
              );
            })}

            {/* Canvas Bottom Information */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-warm-500 dark:text-warm-400 font-medium pointer-events-none z-40">
              <span>🌻 Stems tuck realistically into the 3D wrapper</span>
              <span>{stems.length} botanical items placed</span>
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
                  <p className="text-[10px] text-warm-500">
                    {selectedStem.inFront ? 'Pinned in front of wrapper' : 'Tucked inside 3D wrapper cone'}
                  </p>
                </div>
              </div>

              {/* Controls: Rotate, Scale, Layer, Placement, Duplicate, Delete */}
              <div className="flex items-center flex-wrap gap-2">
                {/* 3D Placement Toggle: Inside vs In Front */}
                <button
                  onClick={() => updateSelectedStem({ inFront: !selectedStem.inFront })}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    selectedStem.inFront
                      ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300'
                      : 'bg-warm-100 dark:bg-darkbg-surface text-warm-700 dark:text-warm-300 hover:bg-warm-200'
                  }`}
                  title={selectedStem.inFront ? 'Switch to inside wrapper' : 'Pin in front of wrapper'}
                >
                  {selectedStem.inFront ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{selectedStem.inFront ? 'In Front' : 'Inside Wrap'}</span>
                </button>

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

                {/* Layering */}
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

        {/* RIGHT: Botanical Library, 12+ Wrappers & Tag Editor (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Studio Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 bg-white/80 dark:bg-darkbg-card/80 border border-warm-200 dark:border-darkbg-border rounded-3xl overflow-x-auto shadow-warm-sm">
            {[
              { id: 'sunflower', label: '🌻 Sunflowers' },
              { id: 'flower', label: '🌹 Flowers' },
              { id: 'greenery', label: '🌿 Greenery' },
              { id: 'decoration', label: '✨ Accents' },
              { id: 'wrapper', label: '🎁 Wrappers & Vases' },
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
                <span className="text-[10px] text-warm-400">Tucks into 3D wrapper</span>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {FLOWER_DEFINITIONS.filter((f) => f.category === activeTab).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleAddFlower(item)}
                    className="p-3 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200/80 dark:border-darkbg-border hover:border-sunflower-400 hover:shadow-warm-sm flex flex-col items-center text-center gap-2 group transition-all active:scale-95"
                  >
                    <div className="w-16 h-20 flex items-center justify-center group-hover:scale-110 transition-transform">
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
            /* Tab Content 5: 12+ Wrappers, Vases & Greeting Card Tag */
            <div className="bg-white/80 dark:bg-darkbg-card/80 p-5 rounded-3xl border border-warm-200 dark:border-darkbg-border shadow-warm-sm flex flex-col gap-4">
              <h3 className="text-xs font-extrabold text-warm-900 dark:text-warm-100 uppercase tracking-wider">
                12 3D Covers, Vases & Baskets
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[280px] overflow-y-auto pr-1">
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
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-4 h-4 rounded-full border border-warm-300 shrink-0"
                        style={{ backgroundColor: w.frontBg }}
                      />
                      <span className="text-xs font-bold truncate">{w.name}</span>
                    </div>
                    {wrapperStyleId === w.id && <Check className="w-4 h-4 text-sunflower-600 shrink-0" />}
                  </button>
                ))}
              </div>

              {/* Greeting Note Tag */}
              <div className="mt-2 pt-3 border-t border-warm-100 dark:border-darkbg-border flex flex-col gap-2">
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
                  className="w-full px-3.5 py-2 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sunflower-400"
                />
              </div>
            </div>
          )}

          {/* Quick Inspiration Presets */}
          <div className="bg-white/80 dark:bg-darkbg-card/80 p-5 rounded-3xl border border-warm-200 dark:border-darkbg-border shadow-warm-sm">
            <h3 className="text-xs font-extrabold text-warm-900 dark:text-warm-100 uppercase tracking-wider mb-3">
              Inspiration Presets
            </h3>
            <div className="grid grid-cols-2 gap-2">
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
                  className="p-2.5 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200/80 dark:border-darkbg-border hover:border-sunflower-400 text-xs font-bold text-warm-800 dark:text-warm-200 text-center transition-all active:scale-95 truncate"
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
