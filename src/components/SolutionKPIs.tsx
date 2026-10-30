/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SolverResult } from '../types/mars.ts';
import { DollarSign, Clock, Layers, CheckCircle2, AlertCircle } from 'lucide-react';

interface SolutionKPIsProps {
  solverResult: SolverResult;
  selectedSolutionIndex: number;
  onSelectSolutionIndex: (idx: number) => void;
}

export const SolutionKPIs: React.FC<SolutionKPIsProps> = ({
  solverResult,
  selectedSolutionIndex,
  onSelectSolutionIndex,
}) => {
  const { n, maxEarnings, solutions, executionTimeMs, allFeasibleCombinationsTested, propertiesUsed } = solverResult;
  const currentSol = solutions[selectedSolutionIndex] || solutions[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Primary KPI Card: Max Earnings */}
      <div className="md:col-span-5 bg-gradient-to-br from-[#121927] to-[#0c101a] border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="uppercase tracking-wider font-medium flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              Maximum Operational Profit
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              at n = {n} units
            </span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-mono-numbers text-white tracking-tight">
              ${maxEarnings.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              Martian Dollars
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-2">
            {maxEarnings === 0
              ? 'No property can complete construction and produce operational earnings within this timeframe.'
              : `Optimally schedules ${currentSol?.schedule.length || 0} sequential development project(s).`}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Build Time: <strong className="font-mono-numbers text-slate-200">{currentSol?.totalBuildTime || 0}</strong> / {n} t</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Idle Buffer:</span>
            <span className="font-mono-numbers text-slate-300 font-medium">{currentSol?.idleTime || 0} t</span>
          </div>
        </div>
      </div>

      {/* Solutions List & Selector */}
      <div className="md:col-span-7 bg-[#0f1420] border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Optimal Mix Solutions ({solutions.length})
              </span>
              {solutions.length > 1 && (
                <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                  Tie: {solutions.length} Alternate Plans
                </span>
              )}
            </div>

            <div className="text-[11px] font-mono text-slate-500">
              Evaluated in {executionTimeMs}ms · {allFeasibleCombinationsTested} paths
            </div>
          </div>

          {/* Solution Tabs/Cards */}
          <div className="space-y-2">
            {solutions.map((sol, index) => {
              const isSelected = selectedSolutionIndex === index;
              return (
                <button
                  key={sol.id}
                  onClick={() => onSelectSolutionIndex(index)}
                  className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-sm'
                      : 'bg-[#080b12] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <div className="font-mono font-bold text-sm text-white tracking-wide">
                        {sol.formattedString}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {propertiesUsed.map((p) => {
                          const count = sol.counts[p.id] || 0;
                          return (
                            <span key={p.id} className="mr-3">
                              {count} {p.name}{count !== 1 ? 's' : ''}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:text-right text-xs">
                    <div>
                      <span className="text-slate-500 text-[10px] block uppercase">Earnings</span>
                      <span className="font-mono-numbers font-semibold text-emerald-400">
                        ${sol.totalEarnings.toLocaleString()}
                      </span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 hidden sm:block" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Solution Property Contribution Breakdown */}
        {currentSol && currentSol.schedule.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-800/80">
            <div className="text-[11px] text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-slate-500" />
              <span>Earnings breakdown for Solution {selectedSolutionIndex + 1}:</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {currentSol.schedule.map((item, i) => (
                <div
                  key={item.id}
                  className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 flex items-center gap-1.5 text-[11px]"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.property.color.border }}
                  />
                  <span className="text-slate-300 font-medium">
                    {item.property.name} #{item.instanceIndex}
                  </span>
                  <span className="text-slate-500 font-mono">
                    (active {item.operationalDuration}t):
                  </span>
                  <span className="font-mono-numbers font-semibold text-emerald-400">
                    +${item.earnings.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
