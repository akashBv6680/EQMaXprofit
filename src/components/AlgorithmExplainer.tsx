/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PropertyDefinition } from '../types/mars.ts';
import { BookOpen, Check, ArrowRight, Lightbulb, Calculator, HelpCircle } from 'lucide-react';

interface AlgorithmExplainerProps {
  properties: PropertyDefinition[];
}

export const AlgorithmExplainer: React.FC<AlgorithmExplainerProps> = ({ properties }) => {
  const [expTime, setExpTime] = useState<number>(13);

  // Experiment calculation: 1 Theatre + 1 Pub
  // Order 1: Theatre then Pub
  const t_theatre = 5;
  const r_theatre = 1500;
  const t_pub = 4;
  const r_pub = 1000;

  // Order A: Theatre first (t=0..5), Pub second (t=5..9)
  const earnings_A_theatre = Math.max(0, expTime - 5) * r_theatre;
  const earnings_A_pub = Math.max(0, expTime - 9) * r_pub;
  const total_A = earnings_A_theatre + earnings_A_pub;

  // Order B: Pub first (t=0..4), Theatre second (t=4..9)
  const earnings_B_pub = Math.max(0, expTime - 4) * r_pub;
  const earnings_B_theatre = Math.max(0, expTime - 9) * r_theatre;
  const total_B = earnings_B_pub + earnings_B_theatre;

  const advantage = total_A - total_B;

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-[#0f1420] border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800/80">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-semibold text-white">
            Algorithmic Formulation & Mathematical Proof
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
          <div className="space-y-3">
            <h4 className="text-white font-semibold flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-400">
              <Calculator className="w-4 h-4" />
              1. The Optimization Objective
            </h4>
            <p className="text-xs leading-relaxed text-slate-300">
              Given a total time horizon <code className="text-amber-400 font-mono">n</code>, Mr. X selects non-negative integer counts of each property type $(c_1, c_2, \dots, c_m)$ to construct sequentially such that:
            </p>
            <div className="p-3 bg-[#07090e] border border-slate-800 rounded-lg font-mono text-xs text-amber-300">
              Total Build Time = ∑ (cᵢ × tᵢ) ≤ n
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Each building k completed at time T_finish(k) operates for the remaining window (n - T_finish(k)) units, generating r_k × (n - T_finish(k)) dollars.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-semibold flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-400">
              <Lightbulb className="w-4 h-4" />
              2. Smith's Rule (Optimal Sequencing)
            </h4>
            <p className="text-xs leading-relaxed text-slate-300">
              For any chosen set of buildings, what order should they be built in? Consider two adjacent jobs $A$ and $B$:
            </p>
            <div className="p-3 bg-[#07090e] border border-slate-800 rounded-lg text-xs space-y-1.5 font-mono text-slate-300">
              <div>A then B: Earnings = (n - S - tₐ)rₐ + (n - S - tₐ - t_b)r_b</div>
              <div>B then A: Earnings = (n - S - t_b)r_b + (n - S - t_b - tₐ)rₐ</div>
              <div className="text-amber-400 pt-1 border-t border-slate-800">
                Difference = t_b · rₐ - tₐ · r_b = tₐ · t_b · (rₐ/tₐ - r_b/t_b)
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Thus, scheduling jobs in <strong>strictly decreasing order of efficiency ratio (r / t)</strong> is always optimal.
            </p>
          </div>
        </div>
      </div>

      {/* Ratios Table */}
      <div className="bg-[#0f1420] border border-slate-800 rounded-xl p-6 shadow-xl">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center justify-between">
          <span>Mars Land Efficiency Ratios (r / t)</span>
          <span className="text-xs font-mono text-emerald-400">Sort Priority: Theatre → Pub → Commercial Park</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[11px]">
                <th className="py-2.5 px-3">Property</th>
                <th className="py-2.5 px-3">Build Time (t)</th>
                <th className="py-2.5 px-3">Earning Rate (r)</th>
                <th className="py-2.5 px-3">Ratio (r / t)</th>
                <th className="py-2.5 px-3">Construction Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {properties.map((prop, idx) => {
                const ratio = prop.earningsPerUnit / prop.buildTime;
                return (
                  <tr key={prop.id} className="hover:bg-slate-900/50">
                    <td className="py-3 px-3 font-medium flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: prop.color.border }}
                      />
                      {prop.name} ({prop.shortCode})
                    </td>
                    <td className="py-3 px-3 font-mono-numbers">{prop.buildTime} units</td>
                    <td className="py-3 px-3 font-mono-numbers text-emerald-400 font-semibold">
                      ${prop.earningsPerUnit.toLocaleString()} / unit
                    </td>
                    <td className="py-3 px-3 font-mono-numbers text-amber-400 font-bold text-sm">
                      ${ratio.toFixed(1)} / time unit
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        Priority #{idx + 1}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Order Experimenter */}
      <div className="bg-[#0f1420] border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <span>Interactive Scheduling Order Experiment</span>
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                Live Verification
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Compare building <strong>1 Theatre (T)</strong> and <strong>1 Pub (P)</strong> in different orders.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">At n =</span>
            <input
              type="number"
              min="9"
              max="50"
              value={expTime}
              onChange={(e) => setExpTime(Math.max(9, parseInt(e.target.value, 10) || 9))}
              className="w-16 px-2 py-1 bg-[#07090e] border border-slate-700 rounded text-center font-mono-numbers font-bold text-amber-400 text-sm"
            />
            <span className="text-xs text-slate-500">units</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Order A: Optimal (Theatre then Pub) */}
          <div className="p-4 rounded-lg bg-[#07090e] border-2 border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Optimal Order: Theatre then Pub
              </span>
              <span className="font-mono text-xs text-slate-400">Ratio: 300 &gt; 250</span>
            </div>

            <div className="text-xs text-slate-300 space-y-1 pt-1 font-mono">
              <div className="flex justify-between">
                <span>Theatre (done t=5, active {expTime - 5}t):</span>
                <span className="text-emerald-400 font-semibold">${earnings_A_theatre.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Pub (done t=9, active {expTime - 9}t):</span>
                <span className="text-emerald-400 font-semibold">${earnings_A_pub.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm">
              <span className="font-semibold text-white">Total Profit:</span>
              <span className="font-mono-numbers font-bold text-lg text-emerald-400">
                ${total_A.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Order B: Suboptimal (Pub then Theatre) */}
          <div className="p-4 rounded-lg bg-[#07090e] border border-rose-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                Inverted Order: Pub then Theatre
              </span>
              <span className="font-mono text-xs text-rose-400">Penalty: -${advantage.toLocaleString()}</span>
            </div>

            <div className="text-xs text-slate-300 space-y-1 pt-1 font-mono">
              <div className="flex justify-between">
                <span>Pub (done t=4, active {expTime - 4}t):</span>
                <span className="text-slate-300">${earnings_B_pub.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Theatre (done t=9, active {expTime - 9}t):</span>
                <span className="text-slate-300">${earnings_B_theatre.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm">
              <span className="font-semibold text-white">Total Profit:</span>
              <span className="font-mono-numbers font-bold text-lg text-rose-400">
                ${total_B.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
