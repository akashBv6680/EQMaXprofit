/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { DEFAULT_PROPERTIES, solveMaxProfit } from './utils/solver.ts';
import { PropertyDefinition } from './types/mars.ts';
import { Header } from './components/Header.tsx';
import { ControlDeck } from './components/ControlDeck.tsx';
import { SolutionKPIs } from './components/SolutionKPIs.tsx';
import { TimelineVisualizer } from './components/TimelineVisualizer.tsx';
import { ColonyCanvas } from './components/ColonyCanvas.tsx';
import { AlgorithmExplainer } from './components/AlgorithmExplainer.tsx';
import { BenchmarkSuiteModal } from './components/BenchmarkSuiteModal.tsx';
import { CustomBuilderModal } from './components/CustomBuilderModal.tsx';
import { Rocket, Sparkles, Layers, Sliders, ExternalLink } from 'lucide-react';

export default function App() {
  const [timeUnit, setTimeUnit] = useState<number>(13);
  const [properties, setProperties] = useState<PropertyDefinition[]>(DEFAULT_PROPERTIES);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'simulator' | 'timeline' | 'colony' | 'proof'>('simulator');
  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState<number>(0);
  const [isBenchmarksOpen, setIsBenchmarksOpen] = useState<boolean>(false);
  const [isCustomBuilderOpen, setIsCustomBuilderOpen] = useState<boolean>(false);

  // Compute Max Profit with memoization
  const solverResult = useMemo(() => {
    return solveMaxProfit(timeUnit, properties);
  }, [timeUnit, properties]);

  // Ensure selected solution index is valid
  const currentSolution = solverResult.solutions[selectedSolutionIndex] || solverResult.solutions[0] || null;

  const handleSelectTimeUnit = (val: number) => {
    setTimeUnit(val);
    setSelectedSolutionIndex(0);
  };

  const handleSaveProperties = (updated: PropertyDefinition[]) => {
    setProperties(updated);
    setIsCustom(true);
    setSelectedSolutionIndex(0);
  };

  const handleResetToDefaults = () => {
    setProperties(DEFAULT_PROPERTIES);
    setIsCustom(false);
    setSelectedSolutionIndex(0);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenBenchmarks={() => setIsBenchmarksOpen(true)}
        onOpenCustomBuilder={() => setIsCustomBuilderOpen(true)}
        isCustomActive={isCustom}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Intro Sub-Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#0d121c] border border-slate-800/90 rounded-xl px-5 py-3.5 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shrink-0">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-semibold text-white tracking-wide">
                  Mr. X Mars Land Development · Ever Quint Algorithm
                </h1>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Sequential Scheduling
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Infinite parcel capacity. Maximize revenue accrued across <span className="text-amber-400 font-mono font-medium">{timeUnit}</span> time units with optimal property mix.
              </p>
            </div>
          </div>

          {/* Quick tab switcher pill */}
          <div className="flex items-center gap-1 bg-[#07090e] p-1 rounded-lg border border-slate-800 text-xs self-start md:self-auto">
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setActiveTab('colony')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                activeTab === 'colony'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Colony Grid
            </button>
            <button
              onClick={() => setActiveTab('proof')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                activeTab === 'proof'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Proof & Math
            </button>
          </div>
        </div>

        {/* Input Control Deck */}
        <ControlDeck
          timeUnit={timeUnit}
          onChangeTimeUnit={handleSelectTimeUnit}
          properties={properties}
          onOpenCustomBuilder={() => setIsCustomBuilderOpen(true)}
          isCustom={isCustom}
          onResetToDefaults={handleResetToDefaults}
        />

        {/* Primary Solution & KPI Deck */}
        <SolutionKPIs
          solverResult={solverResult}
          selectedSolutionIndex={selectedSolutionIndex}
          onSelectSolutionIndex={setSelectedSolutionIndex}
        />

        {/* Tab Views */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <TimelineVisualizer solution={currentSolution} totalTime={timeUnit} />
            <ColonyCanvas solution={currentSolution} totalTime={timeUnit} />
          </div>
        )}

        {activeTab === 'timeline' && (
          <TimelineVisualizer solution={currentSolution} totalTime={timeUnit} />
        )}

        {activeTab === 'colony' && (
          <ColonyCanvas solution={currentSolution} totalTime={timeUnit} />
        )}

        {activeTab === 'proof' && (
          <AlgorithmExplainer properties={properties} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0a0d14] mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Ever Quint Interview Assignment</span>
            <span aria-hidden="true">·</span>
            <span>Mars Land Max Profit Problem</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-amber-500">O(P · (n/t_min)) Dynamic Scheduling</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsBenchmarksOpen(true)}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Official Test Cases (n=7, 8, 13)
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsCustomBuilderOpen(true)}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Custom Properties
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BenchmarkSuiteModal
        isOpen={isBenchmarksOpen}
        onClose={() => setIsBenchmarksOpen(false)}
        onSelectTestCase={handleSelectTimeUnit}
      />

      <CustomBuilderModal
        isOpen={isCustomBuilderOpen}
        onClose={() => setIsCustomBuilderOpen(false)}
        properties={properties}
        onSaveProperties={handleSaveProperties}
      />
    </div>
  );
}
