import React, { useState } from 'react';
import { SunflowerIcon } from '../ui/SunflowerIcon';
import { RefreshCw, Sparkles } from 'lucide-react';

const THOUGHTS = [
  "Like a sunflower, turn your face toward what brings you warmth and clarity. 🌻",
  "Small daily habits create remarkable long-term transformations.",
  "Deep focus on one task beats multitasking ten things at once.",
  "Rest and recharge is a vital part of doing great work.",
  "Every expert was once a beginner who refused to quit.",
  "Keep your digital space clean, organized, and peaceful. 🌻",
  "One step at a time, you are building something extraordinary.",
  "Trust the process and celebrate every small win today.",
  "Kindness toward yourself fuels your highest productivity.",
  "Clear your mind, take a deep breath, and begin with purpose.",
];

export const DailyThoughtWidget: React.FC = () => {
  // Use day of year to get a consistent daily thought
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );

  const [currentIndex, setCurrentIndex] = useState(dayOfYear % THOUGHTS.length);
  const [isRotating, setIsRotating] = useState(false);

  const nextThought = () => {
    setIsRotating(true);
    setCurrentIndex((prev) => (prev + 1) % THOUGHTS.length);
    setTimeout(() => setIsRotating(false), 400);
  };

  return (
    <div className="bg-white/80 dark:bg-darkbg-card/80 border border-warm-200 dark:border-darkbg-border rounded-3xl p-5 shadow-warm-sm hover:shadow-warm-md transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-sunflower-100 dark:bg-sunflower-950/70 border border-sunflower-300 dark:border-sunflower-800 text-sunflower-600 dark:text-sunflower-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-warm-900 dark:text-warm-100">Daily Thought</h3>
        </div>
        <button
          onClick={nextThought}
          className="p-1.5 text-warm-400 hover:text-sunflower-600 dark:hover:text-sunflower-400 hover:bg-warm-100 dark:hover:bg-darkbg-cardHover rounded-xl transition-all active:rotate-180"
          title="New thought"
          aria-label="Refresh thought"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <p className="text-sm font-medium text-warm-700 dark:text-warm-300 italic leading-relaxed">
        “{THOUGHTS[currentIndex]}”
      </p>

      <div className="mt-3 flex items-center justify-between text-[11px] text-warm-400 dark:text-warm-500 font-medium">
        <span>Daily Inspiration 🌻</span>
        <span>#{currentIndex + 1} of {THOUGHTS.length}</span>
      </div>
    </div>
  );
};
