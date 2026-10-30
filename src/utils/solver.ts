/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AssignmentTestCase, PropertyDefinition, ScheduledBuilding, SolutionOption, SolverResult } from '../types/mars.ts';

// Default Mars Land establishments as defined in the Ever Quint assignment
export const DEFAULT_PROPERTIES: PropertyDefinition[] = [
  {
    id: 'theatre',
    name: 'Theatre',
    shortCode: 'T',
    buildTime: 5,
    earningsPerUnit: 1500,
    parcelWidth: 2,
    parcelHeight: 1,
    featureLabel: '8 Auditoriums',
    efficiencyRatio: 1500 / 5, // 300
    color: {
      bg: '#1e1b4b',
      border: '#6366f1',
      glow: 'rgba(99, 102, 241, 0.4)',
      badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      light: '#818cf8',
      text: '#c7d2fe',
    },
    description: 'Takes 5 units of time, covers 2x1 parcel. Yields $1,500/unit once operational.',
  },
  {
    id: 'pub',
    name: 'Pub',
    shortCode: 'P',
    buildTime: 4,
    earningsPerUnit: 1000,
    parcelWidth: 1,
    parcelHeight: 1,
    featureLabel: '1 Dance Floor',
    efficiencyRatio: 1000 / 4, // 250
    color: {
      bg: '#2e1065',
      border: '#a855f7',
      glow: 'rgba(168, 85, 247, 0.4)',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      light: '#c084fc',
      text: '#e9d5ff',
    },
    description: 'Takes 4 units of time, covers 1x1 parcel. Yields $1,000/unit once operational.',
  },
  {
    id: 'commercial_park',
    name: 'Commercial Park',
    shortCode: 'C',
    buildTime: 10,
    earningsPerUnit: 2000,
    parcelWidth: 3,
    parcelHeight: 1,
    featureLabel: '6 Commercial Spaces',
    efficiencyRatio: 2000 / 10, // 200
    color: {
      bg: '#042f2e',
      border: '#14b8a6',
      glow: 'rgba(20, 184, 166, 0.4)',
      badge: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
      light: '#2dd4bf',
      text: '#ccfbf1',
    },
    description: 'Takes 10 units of time, covers 3x1 parcel. Yields $2,000/unit once operational.',
  },
];

// Official PDF Test Cases
export const OFFICIAL_TEST_CASES: AssignmentTestCase[] = [
  {
    id: 'tc1',
    name: 'Test Case 1',
    timeUnit: 7,
    expectedEarnings: 3000,
    expectedSolutions: ['T: 1 P: 0 C: 0', 'T: 0 P: 1 C: 0'],
    notes: 'Both 1 Theatre (finished at t=5, earns 2x$1500) and 1 Pub (finished at t=4, earns 3x$1000) tie at $3,000.',
  },
  {
    id: 'tc2',
    name: 'Test Case 2',
    timeUnit: 8,
    expectedEarnings: 4500,
    expectedSolutions: ['T: 1 P: 0 C: 0'],
    notes: '1 Theatre finishes at t=5, earns 3x$1500 = $4,500. 2 Pubs would earn 4x$1000 + 0x$1000 = $4,000.',
  },
  {
    id: 'tc3',
    name: 'Test Case 3',
    timeUnit: 13,
    expectedEarnings: 16500,
    expectedSolutions: ['T: 2 P: 0 C: 0'],
    notes: '2 Theatres: 1st finishes at t=5 (earns 8x$1500=$12,000), 2nd finishes at t=10 (earns 3x$1500=$4,500). Total: $16,500.',
  },
];

/**
 * Generates the full sequential construction schedule for a given counts map
 * Ordered by descending efficiency ratio (Smith's rule for scheduling with weights).
 */
export function buildSchedule(
  counts: Record<string, number>,
  properties: PropertyDefinition[],
  n: number
): { schedule: ScheduledBuilding[]; totalEarnings: number; totalBuildTime: number } {
  // Sort properties by efficiency ratio descending
  const sortedProps = [...properties].sort((a, b) => {
    const ratioA = a.earningsPerUnit / a.buildTime;
    const ratioB = b.earningsPerUnit / b.buildTime;
    return ratioB - ratioA;
  });

  const schedule: ScheduledBuilding[] = [];
  let currentTime = 0;
  let totalEarnings = 0;

  for (const prop of sortedProps) {
    const count = counts[prop.id] || 0;
    for (let i = 1; i <= count; i++) {
      const startBuildTime = currentTime;
      const endBuildTime = currentTime + prop.buildTime;
      const operationalDuration = Math.max(0, n - endBuildTime);
      const earnings = operationalDuration * prop.earningsPerUnit;

      schedule.push({
        id: `${prop.id}_${i}`,
        property: prop,
        instanceIndex: i,
        startBuildTime,
        endBuildTime,
        operationalDuration,
        earnings,
      });

      totalEarnings += earnings;
      currentTime = endBuildTime;
    }
  }

  return {
    schedule,
    totalEarnings,
    totalBuildTime: currentTime,
  };
}

/**
 * Formats a solution into the standard Ever Quint notation:
 * "T: 1 P: 0 C: 0"
 */
export function formatSolutionString(
  counts: Record<string, number>,
  properties: PropertyDefinition[]
): string {
  return properties
    .map((p) => `${p.shortCode}: ${counts[p.id] || 0}`)
    .join(' ');
}

/**
 * Computes optimal Max Profit solutions for time unit n
 */
export function solveMaxProfit(n: number, properties: PropertyDefinition[] = DEFAULT_PROPERTIES): SolverResult {
  const startTime = performance.now();

  if (n <= 0) {
    const emptyCounts: Record<string, number> = {};
    for (const p of properties) emptyCounts[p.id] = 0;
    return {
      n,
      maxEarnings: 0,
      solutions: [
        {
          id: 'sol_0',
          counts: emptyCounts,
          formattedString: formatSolutionString(emptyCounts, properties),
          totalBuildTime: 0,
          idleTime: 0,
          schedule: [],
          totalEarnings: 0,
        },
      ],
      allFeasibleCombinationsTested: 1,
      executionTimeMs: performance.now() - startTime,
      propertiesUsed: properties,
    };
  }

  // Find min build time to set search bounds
  const minBuildTime = Math.min(...properties.map((p) => p.buildTime));
  if (minBuildTime > n) {
    const emptyCounts: Record<string, number> = {};
    for (const p of properties) emptyCounts[p.id] = 0;
    return {
      n,
      maxEarnings: 0,
      solutions: [
        {
          id: 'sol_0',
          counts: emptyCounts,
          formattedString: formatSolutionString(emptyCounts, properties),
          totalBuildTime: 0,
          idleTime: n,
          schedule: [],
          totalEarnings: 0,
        },
      ],
      allFeasibleCombinationsTested: 1,
      executionTimeMs: performance.now() - startTime,
      propertiesUsed: properties,
    };
  }

  // Recursive or bounded search for property combinations
  // Let's sort properties by efficiency ratio descending
  const sortedProps = [...properties].sort((a, b) => {
    return (b.earningsPerUnit / b.buildTime) - (a.earningsPerUnit / a.buildTime);
  });

  let maxEarnings = -1;
  const bestOptions: {
    counts: Record<string, number>;
    schedule: ScheduledBuilding[];
    totalBuildTime: number;
    totalEarnings: number;
  }[] = [];

  let combinationsTested = 0;

  // Search feasible multiset combinations where sum(count * buildTime) <= n
  function search(propIndex: number, currentCounts: Record<string, number>, usedTime: number) {
    if (propIndex === sortedProps.length) {
      combinationsTested++;
      const { schedule, totalEarnings, totalBuildTime } = buildSchedule(currentCounts, sortedProps, n);

      if (totalEarnings > maxEarnings) {
        maxEarnings = totalEarnings;
        bestOptions.length = 0;
        bestOptions.push({
          counts: { ...currentCounts },
          schedule,
          totalBuildTime,
          totalEarnings,
        });
      } else if (totalEarnings === maxEarnings && maxEarnings >= 0) {
        // Prevent duplicate count sets
        const duplicate = bestOptions.some((opt) =>
          sortedProps.every((p) => opt.counts[p.id] === currentCounts[p.id])
        );
        if (!duplicate) {
          bestOptions.push({
            counts: { ...currentCounts },
            schedule,
            totalBuildTime,
            totalEarnings,
          });
        }
      }
      return;
    }

    const prop = sortedProps[propIndex];
    const maxCount = Math.floor((n - usedTime) / prop.buildTime);

    // Explore from 0 up to maxCount
    for (let c = 0; c <= maxCount; c++) {
      currentCounts[prop.id] = c;
      search(propIndex + 1, currentCounts, usedTime + c * prop.buildTime);
    }
  }

  const initialCounts: Record<string, number> = {};
  search(0, initialCounts, 0);

  // Map to SolutionOption format with original property ordering (T, P, C)
  const solutions: SolutionOption[] = bestOptions.map((opt, idx) => ({
    id: `sol_${idx + 1}`,
    counts: opt.counts,
    formattedString: formatSolutionString(opt.counts, properties),
    totalBuildTime: opt.totalBuildTime,
    idleTime: Math.max(0, n - opt.totalBuildTime),
    schedule: opt.schedule,
    totalEarnings: opt.totalEarnings,
  }));

  return {
    n,
    maxEarnings: Math.max(0, maxEarnings),
    solutions,
    allFeasibleCombinationsTested: combinationsTested,
    executionTimeMs: Number((performance.now() - startTime).toFixed(2)),
    propertiesUsed: properties,
  };
}

/**
 * Helper to compute earnings at an intermediate time scrub point (for scrubber playback)
 */
export function getEarningsAtTime(schedule: ScheduledBuilding[], timePoint: number): {
  accumulatedEarnings: number;
  activeBuildingUnderConstruction: ScheduledBuilding | null;
  operationalCount: number;
  completedBuildings: ScheduledBuilding[];
} {
  let accumulatedEarnings = 0;
  let activeBuildingUnderConstruction: ScheduledBuilding | null = null;
  const completedBuildings: ScheduledBuilding[] = [];

  for (const b of schedule) {
    if (timePoint >= b.startBuildTime && timePoint < b.endBuildTime) {
      activeBuildingUnderConstruction = b;
    }
    if (timePoint >= b.endBuildTime) {
      completedBuildings.push(b);
      const operationalElapsed = timePoint - b.endBuildTime;
      accumulatedEarnings += operationalElapsed * b.property.earningsPerUnit;
    }
  }

  return {
    accumulatedEarnings,
    activeBuildingUnderConstruction,
    operationalCount: completedBuildings.length,
    completedBuildings,
  };
}
