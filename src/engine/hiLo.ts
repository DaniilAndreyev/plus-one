import type { Rank, Shoe } from './types'

const LOW = new Set<Rank>(['2', '3', '4', '5', '6'])
const MID = new Set<Rank>(['7', '8', '9'])

export function hiLoValue(rank: Rank): 1 | 0 | -1 {
  if (LOW.has(rank)) return 1
  if (MID.has(rank)) return 0
  return -1
}

/** +3, 0, −2 (uses the real minus sign U+2212). */
export function formatCount(n: number): string {
  if (n > 0) return `+${n}`
  if (n < 0) return `−${Math.abs(n)}`
  return '0'
}

/** Decks left in the shoe, never less than half a deck. */
export function decksRemaining(shoe: Shoe): number {
  return Math.max(0.5, shoe.cards.length / 52)
}

export function trueCount(shoe: Shoe): number {
  return shoe.runningCount / decksRemaining(shoe)
}
