/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SolutionOption, ScheduledBuilding } from '../types/mars.ts';
import { Compass, Sparkles, Building2, Music, ShoppingBag, Eye, ZoomIn, ZoomOut } from 'lucide-react';

interface ColonyCanvasProps {
  solution: SolutionOption | null;
  totalTime: number;
}

export const ColonyCanvas: React.FC<ColonyCanvasProps> = ({ solution, totalTime }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);

  const schedule = solution?.schedule || [];

  // Calculate totals
  const totalParcelsUsed = schedule.reduce((sum, item) => sum + item.property.parcelWidth, 0);
  const totalTheatres = schedule.filter((s) => s.property.id === 'theatre').length;
  const totalPubs = schedule.filter((s) => s.property.id === 'pub').length;
  const totalCommercial = schedule.filter((s) => s.property.id === 'commercial_park').length;

  const totalAuditoriums = totalTheatres * 8;
  const totalDanceFloors = totalPubs * 1;
  const totalCommercialSpaces = totalCommercial * 6;

  const selectedBuilding = schedule.find((s) => s.id === selectedBuildingId);

  return (
    <div className="bg-[#0f1420] border border-slate-800 rounded-xl p-5 sm:p-6 shadow-xl space-y-5">
      {/* Top Header & Colony Telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white">
              Mars Land Parcel Development Strip
            </h3>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
              Sector: Elysium Planitia
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Infinite parcel strip. Visualizing property footprints: Theatre (2x1), Pub (1x1), Commercial Park (3x1).
          </p>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-2 bg-[#07090e] border border-slate-700/80 rounded-lg p-1">
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.7, Number((z - 0.15).toFixed(2))))}
            disabled={zoomLevel <= 0.7}
            className="p-1.5 text-slate-400 hover:text-white rounded disabled:opacity-30 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono text-slate-300 px-2">
            {(zoomLevel * 100).toFixed(0)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.4, Number((z + 0.15).toFixed(2))))}
            disabled={zoomLevel >= 1.4}
            className="p-1.5 text-slate-400 hover:text-white rounded disabled:opacity-30 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metric Counters Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#070a10] border border-slate-800 rounded-lg p-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">
            P
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Parcels Occupied</span>
            <span className="font-mono-numbers text-sm font-bold text-white">
              {totalParcelsUsed} <span className="text-slate-500 text-xs">/ ∞ available</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Auditoriums (Theatre)</span>
            <span className="font-mono-numbers text-sm font-bold text-indigo-300">
              {totalAuditoriums} <span className="text-slate-500 text-xs">({totalTheatres} Theatres)</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Music className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Dance Floors (Pub)</span>
            <span className="font-mono-numbers text-sm font-bold text-purple-300">
              {totalDanceFloors} <span className="text-slate-500 text-xs">({totalPubs} Pubs)</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <ShoppingBag className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block">Commercial Spaces</span>
            <span className="font-mono-numbers text-sm font-bold text-teal-300">
              {totalCommercialSpaces} <span className="text-slate-500 text-xs">({totalCommercial} Parks)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Martian Surface Grid Canvas */}
      <div className="relative overflow-x-auto bg-[#180e0c] border border-orange-950/60 rounded-xl p-6 min-h-[300px] flex items-center justify-start shadow-inner">
        {/* Martian Terrain Background Texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: `radial-gradient(#c2410c 1px, transparent 1px), radial-gradient(#9a3412 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px',
          }}
        />

        {/* Mars Coordinates HUD Marker */}
        <div className="absolute top-3 left-4 text-[10px] font-mono text-orange-400/70 flex items-center gap-2 pointer-events-none">
          <Compass className="w-3 h-3 text-orange-500" />
          <span>LAT 4.5895° N, LON 137.4417° E · MARTIAN STRIP CAPACITY: UNBOUNDED</span>
        </div>

        {/* Parcel Strip Container */}
        <div
          className="relative z-10 flex items-end gap-3 pt-8 pb-4 transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'left bottom' }}
        >
          {schedule.length === 0 ? (
            <div className="text-center py-12 px-8 bg-black/40 border border-orange-900/40 rounded-xl backdrop-blur-sm max-w-md mx-auto text-orange-300/80">
              <span className="text-sm font-medium block">Unallocated Mars Land</span>
              <span className="text-xs text-orange-400/60 mt-1 block">
                At t = {totalTime}, no buildings can be finished within the deadline.
              </span>
            </div>
          ) : (
            schedule.map((item, index) => {
              const isSelected = selectedBuildingId === item.id;
              // Parcel width: 1x = 110px, 2x = 220px, 3x = 330px
              const widthPx = item.property.parcelWidth * 120;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedBuildingId(isSelected ? null : item.id)}
                  className={`group relative rounded-xl border transition-all cursor-pointer flex flex-col justify-between p-3 shrink-0 backdrop-blur-md shadow-2xl ${
                    isSelected
                      ? 'ring-2 ring-amber-400 border-amber-300 shadow-[0_0_24px_rgba(245,158,11,0.5)]'
                      : 'hover:border-slate-500 hover:shadow-xl'
                  }`}
                  style={{
                    width: `${widthPx}px`,
                    minHeight: '210px',
                    backgroundColor: `${item.property.color.bg}f0`,
                    borderColor: item.property.color.border,
                  }}
                >
                  {/* Building Header / Badges */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-xs font-bold text-white tracking-wide truncate">
                      {item.property.name} #{item.instanceIndex}
                    </span>
                    <span
                      className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0"
                      style={{
                        backgroundColor: `${item.property.color.border}30`,
                        borderColor: item.property.color.border,
                        color: item.property.color.light,
                      }}
                    >
                      {item.property.parcelWidth}x1 Parcel
                    </span>
                  </div>

                  {/* SVG Illustration Representation */}
                  <div className="my-auto py-2 flex items-center justify-center">
                    {item.property.id === 'theatre' ? (
                      // Theatre Architecture (8 Auditoriums)
                      <div className="w-full flex flex-col items-center">
                        <div className="w-20 h-10 rounded-t-full bg-indigo-600/60 border-2 border-indigo-400 flex items-center justify-center relative shadow-[0_0_12px_rgba(99,102,241,0.5)]">
                          <span className="text-[10px] font-bold text-indigo-100 font-mono">DOME</span>
                          <div className="absolute -top-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                        </div>
                        {/* 8 Auditorium Pods */}
                        <div className="grid grid-cols-4 gap-1 mt-1.5 w-full px-2">
                          {Array.from({ length: 8 }).map((_, podIdx) => (
                            <div
                              key={podIdx}
                              className="h-3 rounded bg-indigo-500/40 border border-indigo-400/70 flex items-center justify-center"
                              title={`Auditorium #${podIdx + 1}`}
                            >
                              <div className="w-1 h-1 rounded-full bg-indigo-300" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : item.property.id === 'pub' ? (
                      // Pub Architecture (1 Dance Floor)
                      <div className="w-full flex flex-col items-center">
                        <div className="w-14 h-14 rounded-full bg-purple-600/60 border-2 border-purple-400 flex flex-col items-center justify-center relative shadow-[0_0_15px_rgba(168,85,247,0.6)]">
                          <Music className="w-4 h-4 text-purple-200 mb-0.5" />
                          <span className="text-[9px] font-mono text-purple-100 font-bold">FLOOR</span>
                          {/* Pulsing ring */}
                          <div className="absolute inset-0 rounded-full border border-purple-300/60 animate-ping pointer-events-none" />
                        </div>
                      </div>
                    ) : (
                      // Commercial Park Architecture (6 Commercial Spaces)
                      <div className="w-full flex flex-col items-center">
                        <div className="grid grid-cols-3 gap-1.5 w-full px-2">
                          {Array.from({ length: 6 }).map((_, spaceIdx) => (
                            <div
                              key={spaceIdx}
                              className="h-8 rounded bg-teal-600/40 border border-teal-400/80 flex flex-col items-center justify-center"
                              title={`Commercial Space #${spaceIdx + 1}`}
                            >
                              <ShoppingBag className="w-3 h-3 text-teal-300 mb-0.5" />
                              <span className="text-[8px] font-mono text-teal-200">S#{spaceIdx + 1}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Operational Telemetry Bottom */}
                  <div className="mt-2 pt-2 border-t border-white/10 text-[11px] space-y-0.5">
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Completed:</span>
                      <span className="font-mono-numbers">t = {item.endBuildTime}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span className="text-slate-400">Yield:</span>
                      <span className="font-mono-numbers font-semibold text-emerald-400">
                        +${item.earnings.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Endless Strip Marker */}
          <div className="h-44 w-28 border-2 border-dashed border-orange-500/30 rounded-xl flex flex-col items-center justify-center text-center p-3 text-orange-400/60 text-xs shrink-0 select-none">
            <span className="font-mono text-lg font-bold">+∞</span>
            <span className="text-[10px] uppercase tracking-wider mt-1">Mars Strip Extends</span>
          </div>
        </div>
      </div>

      {/* Selected Property Inspector Drawer */}
      {selectedBuilding && (
        <div className="bg-[#0b0e17] border border-amber-500/40 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold font-mono text-sm shrink-0 border"
              style={{
                backgroundColor: selectedBuilding.property.color.bg,
                borderColor: selectedBuilding.property.color.border,
              }}
            >
              {selectedBuilding.property.shortCode}
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">
                {selectedBuilding.property.name} #{selectedBuilding.instanceIndex} Inspector
              </h4>
              <p className="text-xs text-slate-400">
                {selectedBuilding.property.featureLabel} · Occupies {selectedBuilding.property.parcelWidth}x1 parcels on Mars
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono-numbers">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Build Window</span>
              <span className="text-slate-200">
                t={selectedBuilding.startBuildTime} → t={selectedBuilding.endBuildTime} ({selectedBuilding.property.buildTime}t)
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Operational Units</span>
              <span className="text-slate-200">
                {selectedBuilding.operationalDuration} units
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Cash Generated</span>
              <span className="text-emerald-400 font-bold text-sm">
                ${selectedBuilding.earnings.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
