import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Sliders, Clock } from 'lucide-react';
import { sound } from '../../utils/audio';
import { useToast } from '../../context/ToastContext';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const PRESET_TIMES: Record<TimerMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export const FocusTimerWidget: React.FC = () => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(PRESET_TIMES.focus);
  const [isActive, setIsActive] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(25);

  const { showToast } = useToast();
  const totalDurationRef = useRef(PRESET_TIMES.focus);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      sound.playTimerDone();
      if (mode === 'focus') {
        showToast('Focus session complete! Take a well-deserved break 🌻', 'success');
      } else {
        showToast('Break finished! Ready to focus again? 🌻', 'info');
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, showToast]);

  const switchMode = (newMode: TimerMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(PRESET_TIMES[newMode]);
    totalDurationRef.current = PRESET_TIMES[newMode];
  };

  const toggleTimer = () => {
    sound.playSoftClick();
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    sound.playSoftClick();
    setIsActive(false);
    setTimeLeft(totalDurationRef.current);
  };

  const applyCustomMinutes = () => {
    const mins = Math.max(1, Math.min(180, customMinutes));
    setIsActive(false);
    setTimeLeft(mins * 60);
    totalDurationRef.current = mins * 60;
    setShowCustomModal(false);
    showToast(`Timer set to ${mins} minutes ⏱️`, 'info');
  };

  const formatMinSec = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = totalDurationRef.current > 0
    ? ((totalDurationRef.current - timeLeft) / totalDurationRef.current) * 100
    : 0;

  return (
    <div className="bg-white/80 dark:bg-darkbg-card/80 border border-warm-200 dark:border-darkbg-border rounded-3xl p-5 shadow-warm-sm hover:shadow-warm-md transition-all flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-warm-900 dark:text-warm-100">Focus Timer</h3>
        </div>

        <button
          onClick={() => setShowCustomModal(!showCustomModal)}
          className="p-1.5 text-warm-400 hover:text-warm-700 dark:hover:text-warm-200 hover:bg-warm-100 dark:hover:bg-darkbg-cardHover rounded-xl transition-colors"
          title="Custom time"
          aria-label="Set custom time"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-3 gap-1 bg-warm-100 dark:bg-darkbg-surface p-1 rounded-2xl my-3 text-xs font-semibold">
        <button
          onClick={() => switchMode('focus')}
          className={`py-1.5 rounded-xl transition-all ${
            mode === 'focus'
              ? 'bg-white dark:bg-darkbg-card text-sunflower-700 dark:text-sunflower-400 shadow-sm font-bold'
              : 'text-warm-600 dark:text-warm-400 hover:text-warm-900'
          }`}
        >
          25m Focus
        </button>
        <button
          onClick={() => switchMode('shortBreak')}
          className={`py-1.5 rounded-xl transition-all ${
            mode === 'shortBreak'
              ? 'bg-white dark:bg-darkbg-card text-sunflower-700 dark:text-sunflower-400 shadow-sm font-bold'
              : 'text-warm-600 dark:text-warm-400 hover:text-warm-900'
          }`}
        >
          5m Break
        </button>
        <button
          onClick={() => switchMode('longBreak')}
          className={`py-1.5 rounded-xl transition-all ${
            mode === 'longBreak'
              ? 'bg-white dark:bg-darkbg-card text-sunflower-700 dark:text-sunflower-400 shadow-sm font-bold'
              : 'text-warm-600 dark:text-warm-400 hover:text-warm-900'
          }`}
        >
          15m Rest
        </button>
      </div>

      {/* Timer Display with Circular Ring */}
      <div className="flex flex-col items-center justify-center my-2">
        <div className="relative flex items-center justify-center">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="62"
              className="text-warm-100 dark:text-darkbg-border"
              strokeWidth="7"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r="62"
              className="text-sunflower-500 transition-all duration-500 ease-out"
              strokeWidth="7"
              strokeDasharray={2 * Math.PI * 62}
              strokeDashoffset={2 * Math.PI * 62 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold tracking-tight text-warm-900 dark:text-warm-100 font-mono">
              {formatMinSec(timeLeft)}
            </span>
            <span className="text-[11px] font-semibold text-sunflower-600 dark:text-sunflower-400 uppercase tracking-wider mt-0.5">
              {isActive ? 'In Progress' : 'Ready'}
            </span>
          </div>
        </div>
      </div>

      {/* Custom Duration Input Drawer */}
      {showCustomModal && (
        <div className="bg-warm-100 dark:bg-darkbg-surface p-2.5 rounded-2xl mb-3 flex items-center gap-2 animate-slide-up">
          <input
            type="number"
            min="1"
            max="180"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 1)}
            className="w-16 px-2 py-1 rounded-xl bg-white dark:bg-darkbg-card border border-warm-300 dark:border-darkbg-border text-center text-xs font-bold"
          />
          <span className="text-xs text-warm-600 dark:text-warm-400 font-medium">mins</span>
          <button
            onClick={applyCustomMinutes}
            className="ml-auto px-3 py-1 bg-sunflower-500 hover:bg-sunflower-600 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            Set
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mt-2">
        <button
          onClick={resetTimer}
          className="p-2.5 rounded-2xl bg-warm-100 dark:bg-darkbg-surface hover:bg-warm-200 dark:hover:bg-darkbg-cardHover text-warm-600 dark:text-warm-400 transition-all active:scale-95"
          title="Reset"
          aria-label="Reset Timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={toggleTimer}
          className={`px-6 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-warm-sm transition-all active:scale-95 ${
            isActive
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-gradient-to-r from-sunflower-500 to-sunflower-600 hover:from-sunflower-600 hover:to-sunflower-700 text-white'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Start</span>
            </>
          )}
        </button>

        <button
          onClick={() => {
            sound.playSoftClick();
            if (mode === 'focus') switchMode('shortBreak');
            else switchMode('focus');
          }}
          className="p-2.5 rounded-2xl bg-warm-100 dark:bg-darkbg-surface hover:bg-warm-200 dark:hover:bg-darkbg-cardHover text-warm-600 dark:text-warm-400 transition-all active:scale-95"
          title="Skip to next phase"
          aria-label="Skip Phase"
        >
          <FastForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
