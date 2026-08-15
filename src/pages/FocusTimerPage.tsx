import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  CheckCircle2,
  Coffee,
  Brain,
  Sliders,
  Flame,
  ListTodo,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { fireSunflowerConfetti } from '../components/ui/Confetti';
import { useToast } from '../context/ToastContext';
import { useData } from '../context/DataContext';
import { SunflowerIcon } from '../components/ui/SunflowerIcon';

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';
type AmbientSound = 'none' | 'rain' | 'whitenoise' | 'waves';

const PRESET_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const FOCUS_QUOTES = [
  "One task at a time. Breathe, settle in, and create your flow. 🌻",
  "Deep focus is a superpower. Honor this time for yourself.",
  "Quiet the noise around you. Progress happens in calm consistency.",
  "Turn off notifications, relax your shoulders, and begin with clarity.",
  "Like sunflowers turning toward the sunlight, focus on what matters most.",
  "Every 25 minutes of deep focus is a solid block in your future.",
];

export const FocusTimerPage: React.FC = () => {
  const { data } = useData();
  const { showToast } = useToast();

  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(PRESET_DURATIONS.focus);
  const [isActive, setIsActive] = useState(false);
  const [selectedTaskTitle, setSelectedTaskTitle] = useState('');
  const [customGoal, setCustomGoal] = useState('');
  const [ambientSound, setAmbientSound] = useState<AmbientSound>('none');
  const [ambientVolume, setAmbientVolume] = useState(0.15);
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customInputMins, setCustomInputMins] = useState(25);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const totalDurationRef = useRef(PRESET_DURATIONS.focus);

  const pendingTasks = data?.tasks?.filter((t) => t.status === 'pending') || [];

  // Timer Tick
  useEffect(() => {
    let timer: any = null;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      sound.stopAmbient();
      setAmbientSound('none');
      sound.playTimerDone();
      fireSunflowerConfetti();

      if (mode === 'focus') {
        const addedMins = Math.round(totalDurationRef.current / 60);
        setCompletedSessionsCount((c) => c + 1);
        setTotalFocusMinutes((m) => m + addedMins);
        showToast('🌻 Outstanding focus session! Time for a refreshing break.', 'success');
        setMode('shortBreak');
        setTimeLeft(PRESET_DURATIONS.shortBreak);
        totalDurationRef.current = PRESET_DURATIONS.shortBreak;
      } else {
        showToast('Break time is complete! Ready to flow again? 🌻', 'info');
        setMode('focus');
        setTimeLeft(PRESET_DURATIONS.focus);
        totalDurationRef.current = PRESET_DURATIONS.focus;
      }
      setQuoteIndex((q) => (q + 1) % FOCUS_QUOTES.length);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, mode, showToast]);

  // Ambient Sound Sync
  useEffect(() => {
    if (ambientSound !== 'none') {
      sound.startAmbient(ambientSound, ambientVolume);
    } else {
      sound.stopAmbient();
    }
    return () => sound.stopAmbient();
  }, [ambientSound, ambientVolume]);

  const switchMode = (newMode: TimerMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(PRESET_DURATIONS[newMode]);
    totalDurationRef.current = PRESET_DURATIONS[newMode];
  };

  const toggleTimer = () => {
    sound.playSoftClick();
    if (!isActive && ambientSound === 'none' && mode === 'focus') {
      // Prompt subtle optional sound
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    sound.playSoftClick();
    setIsActive(false);
    setTimeLeft(totalDurationRef.current);
  };

  const applyCustomMinutes = () => {
    const mins = Math.max(1, Math.min(180, customInputMins));
    setIsActive(false);
    setTimeLeft(mins * 60);
    totalDurationRef.current = mins * 60;
    setShowCustomModal(false);
    showToast(`Timer set to ${mins} minutes ⏱️`, 'info');
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  const formatMinSec = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent =
    totalDurationRef.current > 0
      ? ((totalDurationRef.current - timeLeft) / totalDurationRef.current) * 100
      : 0;

  return (
    <div
      ref={containerRef}
      className={`flex flex-col gap-6 max-w-4xl mx-auto transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-50 bg-warm-50 dark:bg-darkbg-surface p-6 sm:p-12 overflow-y-auto max-w-none'
          : ''
      }`}
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/80 dark:bg-darkbg-card/80 p-5 sm:p-6 rounded-3xl border border-warm-200 dark:border-darkbg-border shadow-warm-sm">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-warm-900 dark:text-warm-100 flex items-center gap-2">
              <span>Focus Sanctuary</span>
              <SunflowerIcon size={20} animated />
            </h1>
            <p className="text-xs text-warm-500 dark:text-warm-400 font-medium">
              Calm Pomodoro timer & ambient soundspace for deep study 🌻
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Zen Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="py-2 px-3.5 rounded-2xl bg-warm-100 dark:bg-darkbg-surface hover:bg-warm-200 dark:hover:bg-darkbg-cardHover text-warm-700 dark:text-warm-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            title={isFullscreen ? 'Exit Zen Mode' : 'Enter Zen Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Zen' : 'Zen Mode'}</span>
          </button>
        </div>
      </div>

      {/* Main Focus Center Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-amber-50/40 to-sunflower-50/50 dark:from-darkbg-card dark:via-darkbg-card dark:to-sunflower-950/20 border border-warm-200/90 dark:border-darkbg-border rounded-[36px] p-6 sm:p-10 shadow-warm-lg flex flex-col items-center justify-center text-center">
        {/* Soft Sunflower Ambient Ring Glow */}
        <div
          className={`absolute w-80 h-80 rounded-full blur-3xl transition-opacity duration-1000 pointer-events-none ${
            isActive
              ? 'bg-amber-400/20 dark:bg-amber-500/10 opacity-100 animate-pulse-gentle'
              : 'bg-warm-300/10 opacity-30'
          }`}
        />

        {/* Phase Selector Tabs */}
        <div className="inline-flex bg-warm-100/90 dark:bg-darkbg-surface/90 backdrop-blur-md p-1.5 rounded-3xl border border-warm-200/80 dark:border-darkbg-border shadow-sm mb-6 z-10">
          <button
            onClick={() => switchMode('focus')}
            className={`px-4 sm:px-6 py-2 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all ${
              mode === 'focus'
                ? 'bg-sunflower-500 text-white shadow-warm-sm scale-[1.02]'
                : 'text-warm-700 dark:text-warm-300 hover:text-warm-900'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>25m Focus</span>
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`px-4 sm:px-6 py-2 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all ${
              mode === 'shortBreak'
                ? 'bg-sunflower-500 text-white shadow-warm-sm scale-[1.02]'
                : 'text-warm-700 dark:text-warm-300 hover:text-warm-900'
            }`}
          >
            <Coffee className="w-4 h-4" />
            <span>5m Break</span>
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`px-4 sm:px-6 py-2 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition-all ${
              mode === 'longBreak'
                ? 'bg-sunflower-500 text-white shadow-warm-sm scale-[1.02]'
                : 'text-warm-700 dark:text-warm-300 hover:text-warm-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>15m Rest</span>
          </button>
        </div>

        {/* Circular Progress Gauge & Large Time Readout */}
        <div className="relative flex items-center justify-center my-4 z-10">
          <svg className="w-64 h-64 sm:w-80 sm:h-80 transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="text-warm-100 dark:text-darkbg-border stroke-current"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Progress Stroke */}
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="text-sunflower-500 stroke-current transition-all duration-700 ease-out"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 135}
              strokeDashoffset={2 * Math.PI * 135 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-5xl sm:text-7xl font-extrabold tracking-tight text-warm-900 dark:text-warm-100 font-mono select-none drop-shadow-sm">
              {formatMinSec(timeLeft)}
            </span>

            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-darkbg-card/80 border border-warm-200 dark:border-darkbg-border shadow-sm">
              <span
                className={`w-2 h-2 rounded-full ${
                  isActive ? 'bg-emerald-500 animate-ping' : 'bg-warm-400'
                }`}
              />
              <span className="text-xs font-bold text-warm-700 dark:text-warm-300 uppercase tracking-wider">
                {isActive ? (mode === 'focus' ? 'Deep Work In Progress' : 'Resting') : 'Ready To Begin'}
              </span>
            </div>
          </div>
        </div>

        {/* Current Focus Target Task Banner */}
        <div className="w-full max-w-md my-4 p-3.5 rounded-2xl bg-white/80 dark:bg-darkbg-surface/80 border border-warm-200/80 dark:border-darkbg-border flex flex-col items-center gap-2 z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-warm-700 dark:text-warm-300">
            <ListTodo className="w-4 h-4 text-sunflower-600 dark:text-sunflower-400" />
            <span>Target Focus Goal:</span>
          </div>

          {pendingTasks.length > 0 ? (
            <select
              value={selectedTaskTitle}
              onChange={(e) => setSelectedTaskTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-warm-50 dark:bg-darkbg-card border border-warm-200 dark:border-darkbg-border text-xs font-semibold text-warm-800 dark:text-warm-200 focus:outline-none focus:ring-2 focus:ring-sunflower-400"
            >
              <option value="">-- Choose a task from your Task List --</option>
              {pendingTasks.map((t) => (
                <option key={t.id} value={t.title}>
                  {t.title} ({t.priority} priority)
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              placeholder="e.g. Study Chemistry Chapter 3..."
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-warm-50 dark:bg-darkbg-card border border-warm-200 dark:border-darkbg-border text-xs font-medium text-center focus:outline-none focus:ring-2 focus:ring-sunflower-400"
            />
          )}

          {selectedTaskTitle && (
            <p className="text-xs font-extrabold text-sunflower-800 dark:text-sunflower-300 truncate max-w-xs">
              🎯 {selectedTaskTitle}
            </p>
          )}
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-4 mt-2 z-10">
          <button
            onClick={resetTimer}
            className="p-3 rounded-2xl bg-white dark:bg-darkbg-surface hover:bg-warm-100 dark:hover:bg-darkbg-cardHover border border-warm-200 dark:border-darkbg-border text-warm-700 dark:text-warm-300 shadow-sm transition-all active:scale-95"
            title="Reset timer"
            aria-label="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className={`px-8 sm:px-10 py-4 rounded-3xl font-extrabold text-base sm:text-lg flex items-center gap-3 shadow-warm-md hover:shadow-warm-lg transition-all active:scale-95 ${
              isActive
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-gradient-to-r from-sunflower-500 to-sunflower-600 hover:from-sunflower-600 hover:to-sunflower-700 text-white'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Start Flow 🌻</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              sound.playSoftClick();
              if (mode === 'focus') switchMode('shortBreak');
              else switchMode('focus');
            }}
            className="p-3 rounded-2xl bg-white dark:bg-darkbg-surface hover:bg-warm-100 dark:hover:bg-darkbg-cardHover border border-warm-200 dark:border-darkbg-border text-warm-700 dark:text-warm-300 shadow-sm transition-all active:scale-95"
            title="Skip phase"
            aria-label="Skip to Next Phase"
          >
            <FastForward className="w-5 h-5" />
          </button>
        </div>

        {/* Motivational quote display */}
        <p className="mt-8 text-xs sm:text-sm font-medium text-warm-600 dark:text-warm-300 italic max-w-lg leading-relaxed z-10">
          “{FOCUS_QUOTES[quoteIndex]}”
        </p>
      </div>

      {/* Bottom Grid: Ambient Sounds & Stats Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Ambient Background Audio Generator */}
        <div className="bg-white/80 dark:bg-darkbg-card/80 p-6 rounded-3xl border border-warm-200 dark:border-darkbg-border shadow-warm-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sunflower-100 dark:bg-sunflower-950/70 border border-sunflower-300 dark:border-sunflower-800 text-sunflower-600 dark:text-sunflower-400">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-warm-900 dark:text-warm-100">
                    Ambient Soundscape
                  </h3>
                  <p className="text-[11px] text-warm-500 dark:text-warm-400">
                    Gentle soothing sounds for deep concentration
                  </p>
                </div>
              </div>

              {ambientSound !== 'none' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 animate-pulse">
                  Playing
                </span>
              )}
            </div>

            {/* Sound Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3">
              {[
                { id: 'none', label: 'Off 🔇' },
                { id: 'rain', label: 'Rain 🌧️' },
                { id: 'whitenoise', label: 'Noise 🍃' },
                { id: 'waves', label: 'Waves 🌊' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setAmbientSound(s.id as AmbientSound)}
                  className={`py-2 px-3 rounded-2xl text-xs font-bold border transition-all ${
                    ambientSound === s.id
                      ? 'bg-sunflower-500 text-white border-sunflower-600 shadow-sm'
                      : 'bg-warm-50 dark:bg-darkbg-surface border-warm-200 dark:border-darkbg-border text-warm-700 dark:text-warm-300 hover:bg-warm-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Volume Slider */}
            {ambientSound !== 'none' && (
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-warm-100 dark:border-darkbg-border">
                <Volume2 className="w-4 h-4 text-warm-400 shrink-0" />
                <input
                  type="range"
                  min="0.01"
                  max="0.5"
                  step="0.01"
                  value={ambientVolume}
                  onChange={(e) => setAmbientVolume(parseFloat(e.target.value))}
                  className="w-full accent-sunflower-500"
                />
                <span className="text-xs font-mono font-bold text-warm-600 dark:text-warm-400 shrink-0">
                  {Math.round(ambientVolume * 200)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Today's Focus Session Metrics */}
        <div className="bg-white/80 dark:bg-darkbg-card/80 p-6 rounded-3xl border border-warm-200 dark:border-darkbg-border shadow-warm-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-warm-900 dark:text-warm-100">
                  Session Milestones
                </h3>
                <p className="text-[11px] text-warm-500 dark:text-warm-400">
                  Track your dedicated focus blocks today
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCustomModal(true)}
              className="p-1.5 text-warm-400 hover:text-sunflower-600 dark:hover:text-sunflower-400 hover:bg-warm-100 dark:hover:bg-darkbg-cardHover rounded-xl transition-colors"
              title="Custom Duration"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>

          {/* Counters Grid */}
          <div className="grid grid-cols-2 gap-3 my-2">
            <div className="p-3.5 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200/80 dark:border-darkbg-border text-center">
              <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider">
                Sessions Done
              </p>
              <p className="text-2xl font-extrabold text-warm-900 dark:text-warm-100 mt-1">
                {completedSessionsCount} 🌻
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200/80 dark:border-darkbg-border text-center">
              <p className="text-[10px] font-bold text-warm-400 uppercase tracking-wider">
                Total Focus Time
              </p>
              <p className="text-2xl font-extrabold text-sunflower-600 dark:text-sunflower-400 mt-1 font-mono">
                {totalFocusMinutes} <span className="text-xs font-bold text-warm-500">mins</span>
              </p>
            </div>
          </div>

          <p className="text-[11px] text-warm-500 dark:text-warm-400 font-medium text-center mt-2">
            Great work! Consistency builds mastery step by step 🌻
          </p>
        </div>
      </div>

      {/* Custom Duration Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-white dark:bg-darkbg-card p-6 rounded-3xl border border-warm-200 dark:border-darkbg-border shadow-warm-lg">
            <h4 className="text-sm font-extrabold text-warm-900 dark:text-warm-100 mb-3">
              Set Custom Duration ⏱️
            </h4>
            <div className="flex items-center gap-3 my-4">
              <input
                type="number"
                min="1"
                max="180"
                value={customInputMins}
                onChange={(e) => setCustomInputMins(parseInt(e.target.value) || 1)}
                className="w-24 px-3 py-2 rounded-xl bg-warm-50 dark:bg-darkbg-surface border border-warm-300 dark:border-darkbg-border text-center text-sm font-bold"
                autoFocus
              />
              <span className="text-xs font-bold text-warm-600 dark:text-warm-400">minutes</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-warm-600 hover:bg-warm-100"
              >
                Cancel
              </button>
              <button
                onClick={applyCustomMinutes}
                className="px-4 py-1.5 rounded-xl bg-sunflower-500 hover:bg-sunflower-600 text-white text-xs font-bold shadow-sm"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
