import type { Card, CountingSystem, Rank } from './types'

/** Builds a per-rank value record from the point values in rank order (10 = J = Q = K). */
function values(
  two: number,
  three: number,
  four: number,
  five: number,
  six: number,
  seven: number,
  eight: number,
  nine: number,
  ten: number,
  ace: number,
): Record<Rank, number> {
  return { '2': two, '3': three, '4': four, '5': five, '6': six, '7': seven, '8': eight, '9': nine, '10': ten, J: ten, Q: ten, K: ten, A: ace }
}

/** The counting systems offered in settings, Hi-Lo first (the default). */
export const SYSTEMS: CountingSystem[] = [
  { id: 'hi-lo', name: 'Hi-Lo', level: 1, values: values(1, 1, 1, 1, 1, 0, 0, 0, -1, -1) },
  { id: 'hi-opt-1', name: 'Hi-Opt I', level: 1, values: values(0, 1, 1, 1, 1, 0, 0, 0, -1, 0) },
  { id: 'hi-opt-2', name: 'Hi-Opt II', level: 2, values: values(1, 1, 2, 2, 1, 1, 0, 0, -2, 0) },
  { id: 'ko', name: 'KO', level: 1, values: values(1, 1, 1, 1, 1, 1, 0, 0, -1, -1) },
  { id: 'omega-2', name: 'Omega II', level: 2, values: values(1, 1, 2, 2, 2, 1, 0, -1, -2, 0) },
  { id: 'red-7', name: 'Red 7', level: 1, values: values(1, 1, 1, 1, 1, 0, 0, 0, -1, -1), redSeven: true },
  { id: 'halves', name: 'Halves', level: 3, fractional: true, values: values(0.5, 1, 1, 1.5, 1, 0.5, 0, -0.5, -1, -1) },
  { id: 'zen', name: 'Zen Count', level: 2, values: values(1, 1, 2, 2, 2, 1, 0, 0, -2, -1) },
  { id: 'ten-count', name: '10 Count', level: 2, values: values(1, 1, 1, 1, 1, 1, 1, 1, -2, 1) },
]

const BY_ID: Record<string, CountingSystem> = Object.fromEntries(SYSTEMS.map((s) => [s.id, s]))

/** Looks up a system by id, falling back to Hi-Lo for an unknown id. */
export function getSystem(id: string): CountingSystem {
  return BY_ID[id] ?? SYSTEMS[0]
}

/** The running-count value of a card under a system (handles the Red 7 color rule). */
export function countValue(system: CountingSystem, card: Card): number {
  let value = system.values[card.rank]
  if (system.redSeven && card.rank === '7' && card.red) value += 1
  return value
}
