/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PropertyDefinition {
  id: string;
  name: string;
  shortCode: string; // 'T' | 'P' | 'C'
  buildTime: number; // units of time
  earningsPerUnit: number; // $ per unit of time operational
  parcelWidth: number; // width in parcels (e.g. 2 for Theatre, 1 for Pub, 3 for Commercial Park)
  parcelHeight: number; // height in parcels (e.g. 1)
  featureLabel: string; // e.g. "8 Auditoriums", "1 Dance Floor", "6 Commercial Spaces"
  efficiencyRatio: number; // earnings / buildTime ($/time unit spent building)
  color: {
    bg: string;
    border: string;
    glow: string;
    badge: string;
    light: string;
    text: string;
  };
  description: string;
}

export interface ScheduledBuilding {
  id: string;
  property: PropertyDefinition;
  instanceIndex: number;
  startBuildTime: number;
  endBuildTime: number;
  operationalDuration: number;
  earnings: number;
}

export interface SolutionOption {
  id: string;
  counts: Record<string, number>; // { [propId]: count }
  formattedString: string; // e.g. "T: 1 P: 0 C: 0"
  totalBuildTime: number;
  idleTime: number;
  schedule: ScheduledBuilding[];
  totalEarnings: number;
}

export interface SolverResult {
  n: number;
  maxEarnings: number;
  solutions: SolutionOption[];
  allFeasibleCombinationsTested: number;
  executionTimeMs: number;
  propertiesUsed: PropertyDefinition[];
}

export interface AssignmentTestCase {
  id: string;
  name: string;
  timeUnit: number;
  expectedEarnings: number;
  expectedSolutions: string[];
  notes: string;
}
