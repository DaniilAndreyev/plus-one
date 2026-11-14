import { hiLoValue } from './hiLo'
import type { Card, Rank, Shoe, Suit } from './types'

export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

export const SUITS: { symbol: Suit; red: boolean }[] = [
  { symbol: '♠', red: false },
  { symbol: '♥', red: true },
  { symbol: '♦', red: true },
  { symbol: '♣', red: false },
]

/** Builds `decks` decks and shuffles with Fisher-Yates. runningCount starts at 0. */
export function buildShoe(decks: number, rng: () => number = Math.random): Shoe {
  const cards: Card[] = []
  for (let d = 0; d < decks; d++) {
    for (const s of SUITS) {
      for (const rank of RANKS) cards.push({ rank, suit: s.symbol, red: s.red })
    }
  }
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return { cards, runningCount: 0 }
}

/** True when fewer than max(30, decks × 13) cards remain (about 75% dealt). */
export function needsReshuffle(shoe: Shoe, decks: number): boolean {
  return shoe.cards.length < Math.max(30, decks * 13)
}

/** Pops the top card. If `count` is false (hole card), the running count is NOT updated. */
export function drawCard(shoe: Shoe, count = true): Card {
  const card = shoe.cards.pop()
  if (!card) throw new Error('Shoe is empty')
  if (count) shoe.runningCount += hiLoValue(card.rank)
  return card
}
