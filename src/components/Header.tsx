/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlayCircle, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  activeTab: 'simulator' | 'timeline' | 'colony' | 'proof';
  onSelectTab: (tab: 'simulator' | 'timeline' | 'colony' | 'proof') => void;
  onOpenBenchmarks: () => void;
  onOpenCustomBuilder: () => void;
  isCustomActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenBenchmarks,
  onOpenCustomBuilder,
  isCustomActive,
}) => {
  return (
    <header className="border-b border-slate-800 bg-[#0a0d14]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center font-bold text-slate-950 font-display text-sm shadow-lg shadow-amber-500/20">
            M
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-base sm:text-lg text-white tracking-wide whitespace-nowrap">
              Mars Land <span className="text-amber-500 font-mono text-xs sm:text-sm">· Max Profit</span>
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <button
            onClick={() => onSelectTab('simulator')}
            className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
              activeTab === 'simulator'
                ? 'text-amber-400 border-b-2 border-amber-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Simulator
          </button>
          <button
            onClick={() => onSelectTab('timeline')}
            className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
              activeTab === 'timeline'
                ? 'text-amber-400 border-b-2 border-amber-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Timeline & Gantt
          </button>
          <button
            onClick={() => onSelectTab('colony')}
            className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
              activeTab === 'colony'
                ? 'text-amber-400 border-b-2 border-amber-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Colony Parcel Grid
          </button>
          <button
            onClick={() => onSelectTab('proof')}
            className={`transition-colors whitespace-nowrap py-1 cursor-pointer ${
              activeTab === 'proof'
                ? 'text-amber-400 border-b-2 border-amber-500 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Algorithm Proof
          </button>
        </nav>

        {/* Zone 3: Primary Action & Custom Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCustomBuilder}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
              isCustomActive
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            {isCustomActive ? 'Custom Rules (Active)' : 'Customize Rules'}
          </button>
          <button
            onClick={onOpenBenchmarks}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verify Test Suite</span>
          </button>
        </div>
      </div>
    </header>
  );
};
