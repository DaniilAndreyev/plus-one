export type Suit = '♠' | '♥' | '♦' | '♣'
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export interface Card {
  rank: Rank
  suit: Suit
  red: boolean
}

/** A card-counting system: per-rank running-count values and metadata. */
export interface CountingSystem {
  id: string
  name: string
  /** Number of distinct point values used (betting-correlation granularity). */
  level: number
  /** True when the system uses half-point values (e.g. Halves). */
  fractional?: boolean
  /** Base running-count value for each rank (10, J, Q, K share a value). */
  values: Record<Rank, number>
  /** Red 7 variant: a red 7 counts +1 on top of its base value, a black 7 stays 0. */
  redSeven?: boolean
}

/** A shoe is mutable on purpose: drawing pops a card and updates runningCount. */
export interface Shoe {
  cards: Card[]
  runningCount: number
  /** The counting system used to score drawn cards (set when the shoe is built). */
  system?: CountingSystem
}
