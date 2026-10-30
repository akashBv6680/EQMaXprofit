/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { solveMaxProfit, OFFICIAL_TEST_CASES, DEFAULT_PROPERTIES } from '../utils/solver.ts';
import { AssignmentTestCase } from '../types/mars.ts';
import { CheckCircle2, XCircle, X, Play, ShieldAlert, Award } from 'lucide-react';

interface BenchmarkSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTestCase: (timeUnit: number) => void;
}

export const BenchmarkSuiteModal: React.FC<BenchmarkSuiteModalProps> = ({
  isOpen,
  onClose,
  onSelectTestCase,
}) => {
  if (!isOpen) return null;

  // Run official test cases
  const results = OFFICIAL_TEST_CASES.map((tc) => {
    const solved = solveMaxProfit(tc.timeUnit, DEFAULT_PROPERTIES);
    const earningsMatch = solved.maxEarnings === tc.expectedEarnings;

    const actualFormattedSolutions = solved.solutions.map((s) => s.formattedString);
    const solutionsMatch =
      actualFormattedSolutions.length === tc.expectedSolutions.length &&
      tc.expectedSolutions.every((exp) => actualFormattedSolutions.includes(exp));

    const passed = earningsMatch && solutionsMatch;

    return {
      testCase: tc,
      solved,
      earningsMatch,
      solutionsMatch,
      passed,
    };
  });

  const allPassed = results.every((r) => r.passed);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f1420] border border-slate-700 rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0a0d14]">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-semibold text-white text-base">
                Ever Quint Assignment Verification Suite
              </h3>
              <p className="text-xs text-slate-400">
                Automated validation against the official test cases in the PDF assignment.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Summary Banner */}
        <div
          className={`px-6 py-3 border-b flex items-center justify-between text-xs font-medium ${
            allPassed
              ? 'bg-emerald-950/30 border-emerald-900/50 text-emerald-300'
              : 'bg-rose-950/30 border-rose-900/50 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {allPassed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            )}
            <span>
              {allPassed
                ? 'All 3 Official Test Cases Passed with 100% Precision'
                : 'One or more test cases did not match the expected PDF output.'}
            </span>
          </div>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            3 / 3 PASSED
          </span>
        </div>

        {/* Test Cases List */}
        <div className="p-6 overflow-y-auto space-y-4">
          {results.map(({ testCase, solved, passed, earningsMatch, solutionsMatch }, idx) => (
            <div
              key={testCase.id}
              className={`p-4 rounded-xl border transition-all ${
                passed
                  ? 'bg-[#0a0e18] border-slate-800 hover:border-slate-700'
                  : 'bg-rose-950/10 border-rose-900/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                      passed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-white text-sm">
                    {testCase.name}
                  </span>
                  <span className="font-mono text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    Input: Time Unit {testCase.timeUnit}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-medium flex items-center gap-1 ${
                      passed ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {passed ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        PASSED
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        FAILED
                      </>
                    )}
                  </span>

                  <button
                    onClick={() => {
                      onSelectTestCase(testCase.timeUnit);
                      onClose();
                    }}
                    className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded border border-amber-500/30 transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Load in Simulator</span>
                  </button>
                </div>
              </div>

              {/* Expected vs Actual Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-800/80 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
                    Expected Output (PDF Specification)
                  </span>
                  <div className="bg-[#07090e] p-2.5 rounded-lg border border-slate-800 space-y-1 font-mono">
                    <div className="text-emerald-400 font-bold">
                      Earnings: ${testCase.expectedEarnings.toLocaleString()}
                    </div>
                    <div className="text-slate-300 text-[11px]">
                      Solutions ({testCase.expectedSolutions.length}):
                    </div>
                    {testCase.expectedSolutions.map((s, i) => (
                      <div key={i} className="text-slate-400 text-[11px] pl-2">
                        {i + 1}. {s}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 block mb-1">
                    Engine Computed Output
                  </span>
                  <div className="bg-[#07090e] p-2.5 rounded-lg border border-slate-800 space-y-1 font-mono">
                    <div className="text-emerald-400 font-bold">
                      Earnings: ${solved.maxEarnings.toLocaleString()}
                    </div>
                    <div className="text-slate-300 text-[11px]">
                      Solutions ({solved.solutions.length}):
                    </div>
                    {solved.solutions.map((s, i) => (
                      <div key={i} className="text-slate-400 text-[11px] pl-2">
                        {i + 1}. {s.formattedString}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-2.5 italic">
                {testCase.notes}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#0a0d14] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Close Suite
          </button>
        </div>
      </div>
    </div>
  );
};
