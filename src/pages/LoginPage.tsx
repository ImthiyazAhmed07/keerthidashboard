import React, { useState } from 'react';
import { SunflowerIcon } from '../components/ui/SunflowerIcon';
import { Eye, EyeOff, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('Keerthika');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await login(username.trim(), password);
    } catch (err: any) {
      setErrorMessage(
        err.message || "That doesn't look right. Please try again. 🌻"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-amber-50/50 via-warm-50 to-warm-100 dark:from-darkbg-surface dark:via-zinc-950 dark:to-darkbg-surface flex items-center justify-center p-4 sm:p-6 md:p-8 relative selection:bg-sunflower-200 selection:text-sunflower-900">
      {/* Background Soft Glow Accents - non-intrusive and completely contained */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-amber-300/20 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-[420px] bg-white/95 dark:bg-darkbg-card/95 backdrop-blur-md border border-warm-200/90 dark:border-darkbg-border rounded-3xl p-6 sm:p-8 shadow-warm-lg z-10 my-auto transition-all">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-sunflower-100 to-amber-200 dark:from-sunflower-950 dark:to-amber-900 border border-sunflower-300 dark:border-sunflower-800 shadow-sm mb-3">
            <SunflowerIcon size={38} animated />
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-warm-900 dark:text-warm-100 tracking-tight flex items-center justify-center gap-1.5">
            Keerthika <span className="text-sunflower-600 dark:text-sunflower-400">Dashboard</span>
          </h1>

          <p className="text-xs sm:text-sm text-warm-500 dark:text-warm-400 font-medium mt-1">
            Welcome back, Keerthika 🌻
          </p>
        </div>

        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs font-semibold text-center flex items-center justify-center gap-2">
            <span>🌻</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username Input Group */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-warm-700 dark:text-warm-300">
              Username
            </label>
            <div className="relative flex items-center w-full">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400 dark:text-warm-500 pointer-events-none flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-sm text-warm-900 dark:text-warm-100 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-sunflower-400 font-medium transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* Password Input Group */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-warm-700 dark:text-warm-300">
              Password
            </label>
            <div className="relative flex items-center w-full">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-400 dark:text-warm-500 pointer-events-none flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full pl-10 pr-11 py-2.5 sm:py-3 rounded-2xl bg-warm-50 dark:bg-darkbg-surface border border-warm-200 dark:border-darkbg-border text-sm text-warm-900 dark:text-warm-100 placeholder-warm-400 focus:outline-none focus:ring-2 focus:ring-sunflower-400 font-medium transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-warm-400 hover:text-warm-700 dark:hover:text-warm-200 rounded-xl transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !password.trim()}
            className="mt-2 w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-sunflower-500 to-sunflower-600 hover:from-sunflower-600 hover:to-sunflower-700 text-white font-bold text-sm shadow-warm-md hover:shadow-warm-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Enter Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div className="mt-6 pt-5 border-t border-warm-100 dark:border-darkbg-border text-center">
          <p className="text-[11px] text-warm-400 dark:text-warm-500 font-medium flex items-center justify-center gap-1.5">
            <span>A private personal digital workspace</span>
            <span>🌻</span>
          </p>
        </div>
      </div>
    </div>
  );
};
