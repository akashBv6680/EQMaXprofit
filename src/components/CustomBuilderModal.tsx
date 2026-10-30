/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PropertyDefinition } from '../types/mars.ts';
import { DEFAULT_PROPERTIES } from '../utils/solver.ts';
import { X, Plus, Trash2, RotateCcw, Save, Sliders, AlertCircle } from 'lucide-react';

interface CustomBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: PropertyDefinition[];
  onSaveProperties: (updated: PropertyDefinition[]) => void;
}

export const CustomBuilderModal: React.FC<CustomBuilderModalProps> = ({
  isOpen,
  onClose,
  properties,
  onSaveProperties,
}) => {
  const [localProps, setLocalProps] = useState<PropertyDefinition[]>(properties);

  if (!isOpen) return null;

  const handleUpdate = (id: string, field: keyof PropertyDefinition, value: any) => {
    setLocalProps((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updated = { ...p, [field]: value };
        if (field === 'buildTime' || field === 'earningsPerUnit') {
          const bt = field === 'buildTime' ? Number(value) : p.buildTime;
          const er = field === 'earningsPerUnit' ? Number(value) : p.earningsPerUnit;
          updated.efficiencyRatio = bt > 0 ? er / bt : 0;
        }
        return updated;
      })
    );
  };

  const handleAddNew = () => {
    const newId = `custom_${Date.now()}`;
    const newProp: PropertyDefinition = {
      id: newId,
      name: 'Hydroponics Lab',
      shortCode: 'H',
      buildTime: 3,
      earningsPerUnit: 900,
      parcelWidth: 1,
      parcelHeight: 1,
      featureLabel: 'Bio-Reactor',
      efficiencyRatio: 900 / 3, // 300
      color: {
        bg: '#064e3b',
        border: '#10b981',
        glow: 'rgba(16, 185, 129, 0.4)',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        light: '#34d399',
        text: '#d1fae5',
      },
      description: 'Takes 3 units to build, covers 1x1 parcel. Yields $900/unit.',
    };
    setLocalProps([...localProps, newProp]);
  };

  const handleRemove = (id: string) => {
    if (localProps.length <= 1) return;
    setLocalProps(localProps.filter((p) => p.id !== id));
  };

  const handleReset = () => {
    setLocalProps(DEFAULT_PROPERTIES);
  };

  const handleSave = () => {
    onSaveProperties(localProps);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0f1420] border border-slate-700 rounded-xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#0a0d14]">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-semibold text-white text-base">
                Mars Property Parameters Sandbox
              </h3>
              <p className="text-xs text-slate-400">
                Adjust build times, operational yields, and parcel sizes to test custom economic dynamics.
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Configured Mars Establishments ({localProps.length})
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1 text-xs text-slate-400 hover:text-white bg-slate-800/80 rounded border border-slate-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-amber-400" />
                <span>Restore Ever Quint Defaults</span>
              </button>
              <button
                onClick={handleAddNew}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Property</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {localProps.map((prop) => {
              const ratio = prop.buildTime > 0 ? (prop.earningsPerUnit / prop.buildTime).toFixed(1) : '0';
              return (
                <div
                  key={prop.id}
                  className="bg-[#090d16] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg border flex items-center justify-center font-mono font-bold text-sm shrink-0"
                      style={{
                        backgroundColor: prop.color.bg,
                        borderColor: prop.color.border,
                        color: prop.color.light,
                      }}
                    >
                      {prop.shortCode}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={prop.name}
                          onChange={(e) => handleUpdate(prop.id, 'name', e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs font-bold text-white w-36"
                        />
                        <input
                          type="text"
                          maxLength={2}
                          value={prop.shortCode}
                          onChange={(e) => handleUpdate(prop.id, 'shortCode', e.target.value.toUpperCase())}
                          className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-xs font-mono font-bold text-amber-400 w-12 text-center"
                          title="Short code"
                        />
                      </div>
                      <input
                        type="text"
                        value={prop.featureLabel}
                        onChange={(e) => handleUpdate(prop.id, 'featureLabel', e.target.value)}
                        className="bg-transparent text-[11px] text-slate-400 border-b border-transparent hover:border-slate-700 focus:border-slate-600 focus:outline-none w-48"
                        placeholder="e.g. 8 Auditoriums"
                      />
                    </div>
                  </div>

                  {/* Param Steppers */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-500 uppercase block">Build Time (t)</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={prop.buildTime}
                        onChange={(e) => handleUpdate(prop.id, 'buildTime', Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono-numbers"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 uppercase block">Yield ($/unit)</label>
                      <input
                        type="number"
                        min="100"
                        step="100"
                        value={prop.earningsPerUnit}
                        onChange={(e) => handleUpdate(prop.id, 'earningsPerUnit', Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-emerald-400 font-mono-numbers font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 uppercase block">Parcel Footprint</label>
                      <div className="flex items-center gap-1 text-slate-400">
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={prop.parcelWidth}
                          onChange={(e) => handleUpdate(prop.id, 'parcelWidth', Math.max(1, parseInt(e.target.value, 10) || 1))}
                          className="w-12 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono"
                        />
                        <span>x 1</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-500 uppercase block">Ratio (r / t)</label>
                      <span className="font-mono-numbers font-bold text-amber-400 text-sm block mt-1">
                        ${ratio}/t
                      </span>
                    </div>
                  </div>

                  {/* Delete button */}
                  <div>
                    <button
                      onClick={() => handleRemove(prop.id)}
                      disabled={localProps.length <= 1}
                      className="p-2 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 disabled:opacity-20 cursor-pointer"
                      title="Remove property"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-[#0a0d14] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span>Properties will be automatically scheduled in optimal ratio order (Smith's rule).</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Apply Property Set</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
