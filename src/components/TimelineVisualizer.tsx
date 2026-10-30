/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { SolutionOption, ScheduledBuilding } from '../types/mars.ts';
import { getEarningsAtTime } from '../utils/solver.ts';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Activity, Hammer, CheckCircle } from 'lucide-react';

interface TimelineVisualizerProps {
  solution: SolutionOption | null;
  totalTime: number;
}

export const TimelineVisualizer: React.FC<TimelineVisualizerProps> = ({ solution, totalTime }) => {
  const [scrubberTime, setScrubberTime] = useState<number>(totalTime);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  // Sync scrubber when totalTime changes
  useEffect(() => {
    setScrubberTime(totalTime);
    setIsPlaying(false);
  }, [totalTime, solution]);

  // Playback timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setScrubberTime((prev) => {
          if (prev >= totalTime) {
            setIsPlaying(false);
            return totalTime;
          }
          return prev + 1;
        });
      }, 450);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, totalTime]);

  const schedule = solution?.schedule || [];
  const currentSnapshot = getEarningsAtTime(schedule, scrubberTime);

  if (totalTime <= 0 || !solution) {
    return (
      <div className="bg-[#0f1420] border border-slate-800 rounded-xl p-8 text-center text-slate-400">
        <p>Set a time unit $n &gt; 0$ to visualize the construction timeline.</p>
      </div>
    );
  }

  // Calculate percent for a time tick
  const getPercent = (timeVal: number) => {
    if (totalTime <= 0) return 0;
    return Math.min(100, Math.max(0, (timeVal / totalTime) * 100));
  };

  return (
    <div className="bg-[#0f1420] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header & Playback Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            Sequential Construction Gantt & Accrual Timeline
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Rule: Only one property can be developed at a time. Buildings earn money every unit once operational.
          </p>
        </div>

        {/* Player controls */}
        <div className="flex items-center gap-2 bg-[#07090e] border border-slate-700/80 rounded-lg p-1.5 self-start sm:self-auto">
          <button
            onClick={() => {
              setScrubberTime(0);
              setIsPlaying(false);
            }}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
            title="Reset to t=0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setScrubberTime((t) => Math.max(0, t - 1));
            }}
            disabled={scrubberTime <= 0}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded disabled:opacity-30 cursor-pointer"
            title="Step Back 1 tick"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (scrubberTime >= totalTime) {
                setScrubberTime(0);
              }
              setIsPlaying(!isPlaying);
            }}
            className="px-3 py-1 flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded transition-all cursor-pointer shadow-sm"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{scrubberTime >= totalTime ? 'Replay' : 'Play'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setScrubberTime((t) => Math.min(totalTime, t + 1));
            }}
            disabled={scrubberTime >= totalTime}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded disabled:opacity-30 cursor-pointer"
            title="Step Forward 1 tick"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="px-2 text-xs font-mono font-bold text-amber-400 border-l border-slate-800 ml-1">
            t = {scrubberTime} / {totalTime}
          </div>
        </div>
      </div>

      {/* Real-time Status HUD at Scrubber Time */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#0a0d14] border border-slate-800/90 rounded-lg p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Accumulated at t={scrubberTime}</span>
            <span className="text-lg font-mono-numbers font-bold text-emerald-400">
              ${currentSnapshot.accumulatedEarnings.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Hammer className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Active Construction</span>
            <span className="text-xs font-medium text-slate-200">
              {currentSnapshot.activeBuildingUnderConstruction ? (
                <span className="text-amber-300">
                  {currentSnapshot.activeBuildingUnderConstruction.property.name} #{currentSnapshot.activeBuildingUnderConstruction.instanceIndex} (ends t={currentSnapshot.activeBuildingUnderConstruction.endBuildTime})
                </span>
              ) : scrubberTime >= (solution.totalBuildTime || 0) ? (
                <span className="text-emerald-400">All planned builds complete</span>
              ) : (
                <span className="text-slate-500">Idle</span>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
            <CheckCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Operational Facilities</span>
            <span className="text-xs font-medium text-slate-200">
              {currentSnapshot.operationalCount} active generating cash flow
            </span>
          </div>
        </div>
      </div>

      {/* Visual Gantt Tracks */}
      <div className="space-y-4 pt-2">
        {/* Timeline Axis Ticks */}
        <div className="relative h-6 border-b border-slate-700/80">
          {Array.from({ length: totalTime + 1 }).map((_, tick) => {
            // Show every tick if <= 15, every 2 if <= 30, else every 5
            const showLabel =
              totalTime <= 15 ||
              (totalTime <= 30 && tick % 2 === 0) ||
              tick % 5 === 0 ||
              tick === totalTime;

            const leftPct = getPercent(tick);
            return (
              <div
                key={tick}
                className="absolute top-0 flex flex-col items-center -translate-x-1/2 pointer-events-none"
                style={{ left: `${leftPct}%` }}
              >
                <div
                  className={`w-px ${
                    tick % 5 === 0 || tick === totalTime ? 'h-3 bg-slate-500' : 'h-1.5 bg-slate-700'
                  }`}
                />
                {showLabel && (
                  <span className="text-[10px] font-mono-numbers text-slate-400 mt-0.5">
                    {tick}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Building Construction Rows */}
        <div className="space-y-3 relative">
          {/* Vertical Scrubber Cursor Line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-20 pointer-events-none shadow-[0_0_8px_rgba(245,158,11,0.8)]"
            style={{ left: `${getPercent(scrubberTime)}%` }}
          >
            <div className="w-3 h-3 rounded-full bg-amber-400 -translate-x-1/2 -top-1.5 absolute border border-slate-900" />
          </div>

          {schedule.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500">
              No buildings scheduled. Total time {totalTime} is less than minimum build time.
            </div>
          ) : (
            schedule.map((item, idx) => {
              const startPct = getPercent(item.startBuildTime);
              const buildEndPct = getPercent(item.endBuildTime);
              const buildWidthPct = buildEndPct - startPct;
              const operationalWidthPct = 100 - buildEndPct;

              // Is this item building or operational at scrubberTime?
              const isBuildingNow =
                scrubberTime >= item.startBuildTime && scrubberTime < item.endBuildTime;
              const isOperationalNow = scrubberTime >= item.endBuildTime;

              return (
                <div key={item.id} className="relative group">
                  {/* Label on left / metadata */}
                  <div className="flex items-center justify-between text-xs mb-1 px-1">
                    <span className="font-medium text-slate-300 flex items-center gap-1.5">
                      <span
                        className="w-2.5 h-2.5 rounded-sm"
                        style={{ backgroundColor: item.property.color.border }}
                      />
                      {item.property.name} #{item.instanceIndex}
                      <span className="text-slate-500 text-[11px]">
                        (Build: {item.property.buildTime}t · Yield: ${item.property.earningsPerUnit}/t)
                      </span>
                    </span>

                    <span className="font-mono-numbers text-[11px] text-slate-400">
                      Constructed t=[{item.startBuildTime} → {item.endBuildTime}] · Operates {item.operationalDuration}t
                    </span>
                  </div>

                  {/* Dual Bar: [Construction Phase] + [Operational Phase] */}
                  <div className="h-8 bg-[#07090e] rounded-md border border-slate-800 relative overflow-hidden flex">
                    {/* Construction Bar */}
                    <div
                      className="absolute top-0 bottom-0 rounded-l-md flex items-center px-2 text-[11px] font-mono font-bold text-white transition-all overflow-hidden"
                      style={{
                        left: `${startPct}%`,
                        width: `${buildWidthPct}%`,
                        backgroundColor: item.property.color.border,
                        boxShadow: isBuildingNow ? `0 0 12px ${item.property.color.glow}` : 'none',
                        filter: isBuildingNow ? 'brightness(1.2)' : 'none',
                      }}
                    >
                      <span className="truncate whitespace-nowrap drop-shadow">
                        BUILD ({item.property.buildTime}t)
                      </span>
                    </div>

                    {/* Operational Earning Phase */}
                    {operationalWidthPct > 0 && (
                      <div
                        className="absolute top-0 bottom-0 flex items-center px-2 text-[10px] font-mono transition-all overflow-hidden"
                        style={{
                          left: `${buildEndPct}%`,
                          width: `${operationalWidthPct}%`,
                          background: `repeating-linear-gradient(45deg, ${item.property.color.bg}, ${item.property.color.bg} 8px, #0b0f19 8px, #0b0f19 16px)`,
                          borderLeft: `2px solid ${item.property.color.light}`,
                        }}
                      >
                        <span className="text-emerald-400 font-semibold truncate whitespace-nowrap pl-1">
                          ⚡ EARNING (${item.property.earningsPerUnit}/t × {item.operationalDuration}t = ${item.earnings.toLocaleString()})
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Interactive Scrub Track */}
        <div className="pt-3">
          <label className="text-[11px] font-medium text-slate-400 block mb-1">
            Manual Time Scrubber: Drag to inspect any moment in the Mars colony's development
          </label>
          <input
            type="range"
            min="0"
            max={totalTime}
            value={scrubberTime}
            onChange={(e) => {
              setIsPlaying(false);
              setScrubberTime(parseInt(e.target.value, 10));
            }}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>
      </div>
    </div>
  );
};
