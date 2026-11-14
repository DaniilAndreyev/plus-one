export type Suit = '♠' | '♥' | '♦' | '♣'
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export interface Card {
  rank: Rank
  suit: Suit
  red: boolean
}

/** A shoe is mutable on purpose: drawing pops a card and updates runningCount. */
export interface Shoe {
  cards: Card[]
  runningCount: number
}
