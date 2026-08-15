import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  PenTool,
  Eraser,
  RotateCcw,
  RotateCw,
  Trash2,
  Maximize2,
  Minimize2,
  Highlighter,
  Sparkles,
} from 'lucide-react';
import { ConfirmModal } from '../components/modals/ConfirmModal';
import { SunflowerIcon } from '../components/ui/SunflowerIcon';
import { useToast } from '../context/ToastContext';

type ToolType = 'pen' | 'highlighter' | 'eraser';

const PALETTE = [
  { name: 'Charcoal', color: '#1e293b' },
  { name: 'Sunflower Gold', color: '#f59e0b' },
  { name: 'Warm Amber', color: '#d97706' },
  { name: 'Sunset Rose', color: '#f43f5e' },
  { name: 'Sage Emerald', color: '#10b981' },
  { name: 'Sky Blue', color: '#0ea5e9' },
  { name: 'Royal Violet', color: '#8b5cf6' },
  { name: 'White', color: '#ffffff' },
];

const BRUSH_SIZES = [
  { label: 'Fine', size: 2 },
  { label: 'Medium', size: 5 },
  { label: 'Bold', size: 12 },
  { label: 'Extra Bold', size: 24 },
];

interface Point {
  x: number;
  y: number;
  pressure?: number;
}

export const ScribblePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<Point[]>([]);

  // In-session undo / redo history (purely in memory during this page session!)
  const undoStackRef = useRef<ImageData[]>([]);
  const redoStackRef = useRef<ImageData[]>([]);

  const [tool, setTool] = useState<ToolType>('pen');
  const [color, setColor] = useState('#1e293b');
  const [brushSize, setBrushSize] = useState(5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const { showToast } = useToast();

  // Resize canvas according to high DPI devicePixelRatio
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save existing drawing image data before resizing if exists
    let existingImage: ImageData | null = null;
    if (canvas.width > 0 && canvas.height > 0) {
      try {
        existingImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
      } catch {}
    }

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = (rect.height || 600) * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height || 600}px`;

    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (existingImage) {
      try {
        ctx.putImageData(existingImage, 0, 0);
      } catch {}
    }
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStackRef.current.push(imageData);
    if (undoStackRef.current.length > 25) {
      undoStackRef.current.shift();
    }
    redoStackRef.current = [];
    setCanUndo(true);
    setCanRedo(false);
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    if (!canvas || undoStackRef.current.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    redoStackRef.current.push(currentState);

    const previousState = undoStackRef.current.pop()!;
    ctx.putImageData(previousState, 0, 0);

    setCanUndo(undoStackRef.current.length > 0);
    setCanRedo(true);
  };

  const handleRedo = () => {
    const canvas = canvasRef.current;
    if (!canvas || redoStackRef.current.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    undoStackRef.current.push(currentState);

    const nextState = redoStackRef.current.pop()!;
    ctx.putImageData(nextState, 0, 0);

    setCanUndo(true);
    setCanRedo(redoStackRef.current.length > 0);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    saveState();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    showToast('Board cleared 🌻', 'info');
  };

  // Fullscreen handling
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
        setTimeout(resizeCanvas, 100);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        setTimeout(resizeCanvas, 100);
      });
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setTimeout(resizeCanvas, 100);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, [resizeCanvas]);

  // Pointer event coordinate extractor
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pressure: e.pressure || 0.5,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    saveState();
    isDrawingRef.current = true;

    const point = getCoordinates(e);
    currentStrokeRef.current = [point];

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(point.x, point.y);

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 3;
      ctx.strokeStyle = 'rgba(0,0,0,1)';
    } else if (tool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = brushSize * 2.5;
      ctx.strokeStyle = color + '55'; // 33% alpha for highlighter
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = brushSize;
      ctx.strokeStyle = color;
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();

    const point = getCoordinates(e);
    const stroke = currentStrokeRef.current;
    stroke.push(point);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (stroke.length > 2) {
      const lastTwo = stroke.slice(-3);
      const xc = (lastTwo[1].x + lastTwo[2].x) / 2;
      const yc = (lastTwo[1].y + lastTwo[2].y) / 2;

      ctx.quadraticCurveTo(lastTwo[1].x, lastTwo[1].y, xc, yc);
      ctx.stroke();
    } else {
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}

    isDrawingRef.current = false;
    currentStrokeRef.current = [];
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Banner Notice: STRICTLY NO SAVE */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-amber-100/70 via-sunflower-100/60 to-warm-100/70 dark:from-sunflower-950/40 dark:via-darkbg-card dark:to-darkbg-card px-5 py-3.5 rounded-3xl border border-sunflower-200/80 dark:border-sunflower-900/40 shadow-warm-sm">
        <div className="flex items-center gap-3">
          <SunflowerIcon size={24} animated />
          <div>
            <h2 className="text-sm font-extrabold text-warm-900 dark:text-warm-100">
              Scribble Board ✍️
            </h2>
            <p className="text-xs text-sunflower-800 dark:text-sunflower-300 font-semibold italic">
              “Just scribble. Nothing needs to be saved. 🌻”
            </p>
          </div>
        </div>

        <div className="text-[11px] text-warm-500 dark:text-warm-400 font-medium text-center sm:text-right">
          Clean Whiteboard • Touch • Stylus • Mouse
        </div>
      </div>

      {/* Main Drawing Studio Container */}
      <div
        ref={containerRef}
        className={`flex flex-col rounded-3xl border border-warm-200 dark:border-darkbg-border bg-white dark:bg-darkbg-card shadow-warm-lg overflow-hidden transition-all relative ${
          isFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : 'h-[75vh]'
        }`}
      >
        {/* Floating Toolbar */}
        <div className="p-3 bg-white/95 dark:bg-darkbg-card/95 backdrop-blur-md border-b border-warm-200 dark:border-darkbg-border flex flex-wrap items-center justify-between gap-2.5 z-10 select-none">
          {/* Tools: Pen, Highlighter, Eraser */}
          <div className="flex items-center gap-1 bg-warm-100 dark:bg-darkbg-surface p-1 rounded-2xl border border-warm-200 dark:border-darkbg-border">
            <button
              onClick={() => setTool('pen')}
              className={`p-2 rounded-xl transition-all ${
                tool === 'pen'
                  ? 'bg-sunflower-500 text-white shadow-sm font-bold'
                  : 'text-warm-600 dark:text-warm-400 hover:text-warm-900'
              }`}
              title="Smooth Pen"
              aria-label="Smooth Pen"
            >
              <PenTool className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTool('highlighter')}
              className={`p-2 rounded-xl transition-all ${
                tool === 'highlighter'
                  ? 'bg-sunflower-500 text-white shadow-sm font-bold'
                  : 'text-warm-600 dark:text-warm-400 hover:text-warm-900'
              }`}
              title="Highlighter"
              aria-label="Highlighter"
            >
              <Highlighter className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-2 rounded-xl transition-all ${
                tool === 'eraser'
                  ? 'bg-sunflower-500 text-white shadow-sm font-bold'
                  : 'text-warm-600 dark:text-warm-400 hover:text-warm-900'
              }`}
              title="Eraser"
              aria-label="Eraser"
            >
              <Eraser className="w-4 h-4" />
            </button>
          </div>

          {/* Color Palette */}
          {tool !== 'eraser' && (
            <div className="flex items-center gap-1.5 bg-warm-100 dark:bg-darkbg-surface p-1 rounded-2xl border border-warm-200 dark:border-darkbg-border overflow-x-auto">
              {PALETTE.map((p) => (
                <button
                  key={p.color}
                  onClick={() => setColor(p.color)}
                  className={`w-6 h-6 rounded-full transition-all shrink-0 border ${
                    color === p.color
                      ? 'scale-125 ring-2 ring-sunflower-500 shadow-sm'
                      : 'hover:scale-110 opacity-80'
                  }`}
                  style={{ backgroundColor: p.color, borderColor: '#cbd5e1' }}
                  title={p.name}
                  aria-label={p.name}
                />
              ))}

              {/* Custom Color Input */}
              <label className="w-6 h-6 rounded-full overflow-hidden cursor-pointer shrink-0 border border-warm-300 relative flex items-center justify-center">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="opacity-0 absolute inset-0 cursor-pointer"
                  title="Custom Color"
                />
                <span className="text-[10px]">🎨</span>
              </label>
            </div>
          )}

          {/* Brush Sizes */}
          <div className="flex items-center gap-1 bg-warm-100 dark:bg-darkbg-surface p-1 rounded-2xl border border-warm-200 dark:border-darkbg-border">
            {BRUSH_SIZES.map((b) => (
              <button
                key={b.size}
                onClick={() => setBrushSize(b.size)}
                className={`px-2 py-1 rounded-xl text-[11px] font-bold transition-all ${
                  brushSize === b.size
                    ? 'bg-white dark:bg-darkbg-card text-sunflower-700 dark:text-sunflower-400 shadow-sm'
                    : 'text-warm-600 dark:text-warm-400'
                }`}
                title={`${b.label} brush size`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Action Buttons: Undo, Redo, Clear, Fullscreen */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className="p-2 text-warm-600 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-darkbg-surface rounded-xl transition-colors disabled:opacity-30"
              title="Undo stroke"
              aria-label="Undo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleRedo}
              disabled={!canRedo}
              className="p-2 text-warm-600 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-darkbg-surface rounded-xl transition-colors disabled:opacity-30"
              title="Redo stroke"
              aria-label="Redo"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowClearConfirm(true)}
              className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
              title="Clear entire canvas"
              aria-label="Clear canvas"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 text-warm-600 dark:text-warm-300 hover:bg-warm-100 dark:hover:bg-darkbg-surface rounded-xl transition-colors"
              title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Canvas Area: Clean white blank surface with zero dots */}
        <div className="flex-1 relative overflow-hidden cursor-crosshair bg-white dark:bg-darkbg-surface">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{ touchAction: 'none' }}
            className="w-full h-full block"
          />
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClear}
        title="Clear Scribble Board"
        message="Are you sure you want to clear your current drawing? (Remember, scribbles are temporary and not saved anywhere 🌻)"
        confirmLabel="Clear Board"
      />
    </div>
  );
};
