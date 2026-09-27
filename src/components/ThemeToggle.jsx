import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme, isHomePage } = useTheme();

  // If on HomePage, don't show the toggle per user request:
  // "iska ilawh ye hmara main home page k ilawh sab pa apply ho"
  if (isHomePage) return null;

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      onClick={toggleTheme}
      className={`relative inline-flex items-center w-[74px] h-[36px] rounded-full p-1 cursor-pointer transition-all duration-300 focus:outline-none select-none active:scale-95 ${
        isDark 
          ? 'bg-[#041209] border border-emerald-500/35 shadow-[inset_0_2px_6px_rgba(0,0,0,0.85)] hover:border-emerald-400/60' 
          : 'bg-[#dcfce7] border border-emerald-500/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.12)] hover:border-emerald-500/50'
      } ${className}`}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {/* Background Track Icons (Always present under or beside knob) */}
      <div className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none">
        {/* Left Side: Faint Sun for Track */}
        <span 
          className={`transition-opacity duration-300 ${
            isDark ? 'opacity-40 text-slate-500' : 'opacity-0'
          }`}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M4.93 4.93l1.41 1.41" />
            <path d="M17.66 17.66l1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="M4.93 19.07l1.41-1.41" />
            <path d="M17.66 6.34l1.41-1.41" />
          </svg>
        </span>

        {/* Right Side: Faint Moon for Track */}
        <span 
          className={`transition-opacity duration-300 ${
            isDark ? 'opacity-0' : 'opacity-40 text-emerald-800'
          }`}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            <circle cx="17" cy="6" r="0.75" fill="currentColor" />
          </svg>
        </span>
      </div>

      {/* Sliding Circular Knob */}
      <div
        className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-400 ease-[cubic-bezier(0.34,1.4,0.64,1)] transform ${
          isDark
            ? 'translate-x-[36px] bg-gradient-to-br from-[#0c2e1b] to-[#05170d] border border-emerald-400/60 shadow-[0_2px_8px_rgba(0,0,0,0.6),0_0_12px_rgba(16,185,129,0.4)]'
            : 'translate-x-0 bg-white border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.12),0_0_10px_rgba(245,158,11,0.45)]'
        }`}
      >
        {isDark ? (
          /* Active Glowing Emerald Moon with Stars (Night Mode) */
          <svg className="w-4 h-4 text-emerald-300 filter drop-shadow-[0_0_4px_rgba(52,211,153,0.8)] transition-transform duration-300 rotate-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#10b981" fillOpacity="0.25" />
            <circle cx="17.5" cy="5.5" r="0.8" fill="#34d399" />
            <circle cx="19.5" cy="9.5" r="0.6" fill="#34d399" />
          </svg>
        ) : (
          /* Active Glowing Amber Sun (Day Mode) */
          <svg className="w-4 h-4 text-amber-500 filter drop-shadow-[0_0_4px_rgba(245,158,11,0.8)] transition-transform duration-300 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" fill="#f59e0b" fillOpacity="0.3" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M4.93 4.93l1.41 1.41" />
            <path d="M17.66 17.66l1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="M4.93 19.07l1.41-1.41" />
            <path d="M17.66 6.34l1.41-1.41" />
          </svg>
        )}
      </div>
    </button>
  );
}
