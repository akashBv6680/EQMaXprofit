/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PropertyDefinition } from '../types/mars.ts';
import { Minus, Plus, RotateCcw, Sparkles } from 'lucide-react';

interface ControlDeckProps {
  timeUnit: number;
  onChangeTimeUnit: (val: number) => void;
  properties: PropertyDefinition[];
  onOpenCustomBuilder: () => void;
  isCustom: boolean;
  onResetToDefaults: () => void;
}

export const ControlDeck: React.FC<ControlDeckProps> = ({
  timeUnit,
  onChangeTimeUnit,
  properties,
  onOpenCustomBuilder,
  isCustom,
  onResetToDefaults,
}) => {
  const presets = [
    { label: 'n = 7 (TC 1)', val: 7, desc: '$3,000' },
    { label: 'n = 8 (TC 2)', val: 8, desc: '$4,500' },
    { label: 'n = 13 (TC 3)', val: 13, desc: '$16,500' },
    { label: 'n = 18', val: 18, desc: 'Mixed' },
    { label: 'n = 25', val: 25, desc: 'Growth' },
    { label: 'n = 40', val: 40, desc: 'Colony' },
  ];

  return (
    <div className="bg-[#0f1420] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl">
      {/* Top row: Section title & quick stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
            Mission Timeline Input
            <span className="text-xs font-mono text-slate-400 font-normal">
              (n units of time)
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Mr. X can build sequential properties on Mars Land. Maximize total earnings accumulated across n units.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isCustom && (
            <button
              onClick={onResetToDefaults}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-md transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 text-amber-400" />
              <span>Reset PDF Rules</span>
            </button>
          )}
          <button
            onClick={onOpenCustomBuilder}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-md transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Edit Property Specs</span>
          </button>
        </div>
      </div>

      {/* Main input controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Direct Numeric Stepper & Presets */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Time Value (n):
            </span>
            <div className="flex items-center bg-[#07090e] border border-slate-700 rounded-lg p-1">
              <button
                onClick={() => onChangeTimeUnit(Math.max(0, timeUnit - 5))}
                disabled={timeUnit <= 0}
                className="px-2 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded disabled:opacity-30 cursor-pointer"
                title="-5 units"
              >
                -5
              </button>
              <button
                onClick={() => onChangeTimeUnit(Math.max(0, timeUnit - 1))}
                disabled={timeUnit <= 0}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded disabled:opacity-30 cursor-pointer"
                title="-1 unit"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <input
                type="number"
                min="0"
                max="500"
                value={timeUnit}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  onChangeTimeUnit(isNaN(val) ? 0 : Math.max(0, Math.min(500, val)));
                }}
                className="w-16 text-center font-mono-numbers font-bold text-xl text-amber-400 bg-transparent focus:outline-none"
              />

              <button
                onClick={() => onChangeTimeUnit(Math.min(500, timeUnit + 1))}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
                title="+1 unit"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onChangeTimeUnit(Math.min(500, timeUnit + 5))}
                className="px-2 py-1 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded cursor-pointer"
                title="+5 units"
              >
                +5
              </button>
            </div>
            <span className="text-xs text-slate-500">time units</span>
          </div>

          {/* Slider */}
          <div className="space-y-1.5">
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={Math.min(50, timeUnit)}
              onChange={(e) => onChangeTimeUnit(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono-numbers">
              <span>0 (Zero Time)</span>
              <span>10 units</span>
              <span>25 units</span>
              <span>50 units</span>
            </div>
          </div>

          {/* Presets */}
          <div className="pt-1">
            <span className="text-xs font-medium text-slate-400 block mb-2">
              Assignment & Scenario Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => {
                const isActive = timeUnit === p.val;
                return (
                  <button
                    key={p.val}
                    onClick={() => onChangeTimeUnit(p.val)}
                    className={`px-3 py-1 text-xs rounded-md border font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20 font-bold'
                        : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <span>{p.label}</span>
                    <span className={`ml-1.5 text-[10px] ${isActive ? 'text-slate-900 font-semibold' : 'text-amber-400'}`}>
                      {p.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Property Spec Summary Cards */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {properties.map((prop) => {
            const ratio = (prop.earningsPerUnit / prop.buildTime).toFixed(0);
            return (
              <div
                key={prop.id}
                className="bg-[#0b0e17] border border-slate-800 rounded-lg p-3 relative overflow-hidden flex flex-col justify-between"
              >
                <div
                  className="absolute top-0 right-0 w-16 h-16 rounded-bl-full pointer-events-none opacity-20"
                  style={{ background: prop.color.glow }}
                />
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-white text-sm">
                      {prop.name}
                    </span>
                    <span
                      className="font-mono text-xs font-bold px-1.5 py-0.5 rounded border"
                      style={{
                        backgroundColor: `${prop.color.border}20`,
                        borderColor: `${prop.color.border}60`,
                        color: prop.color.light,
                      }}
                    >
                      {prop.shortCode}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Build Time:</span>
                      <span className="font-mono-numbers font-medium text-slate-200">
                        {prop.buildTime} units
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Earnings:</span>
                      <span className="font-mono-numbers font-medium text-emerald-400">
                        ${prop.earningsPerUnit.toLocaleString()}/unit
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Parcel:</span>
                      <span className="font-mono text-slate-300">
                        {prop.parcelWidth}x{prop.parcelHeight}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 truncate">{prop.featureLabel}</span>
                  <span className="font-mono-numbers text-amber-400 font-semibold shrink-0 ml-1">
                    ${ratio}/t
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
