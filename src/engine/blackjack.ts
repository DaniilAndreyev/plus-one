import { drawCard } from './shoe'
import type { Card, Shoe } from './types'

export function handValue(hand: Card[]): number {
  let total = 0
  let aces = 0
  for (const c of hand) {
    if (c.rank === 'A') {
      aces++
      total += 11
    } else if (c.rank === '10' || c.rank === 'J' || c.rank === 'Q' || c.rank === 'K') {
      total += 10
    } else {
      total += Number(c.rank)
    }
  }
  while (total > 21 && aces > 0) {
    total -= 10
    aces--
  }
  return total
}

export function isBlackjack(hand: Card[]): boolean {
  return hand.length === 2 && handValue(hand) === 21
}

/** The dealer only draws if the player did not bust and neither side has a natural. */
export function shouldDealerPlay(player: Card[], dealer: Card[]): boolean {
  return handValue(player) <= 21 && !isBlackjack(player) && !isBlackjack(dealer)
}

/** Mutates `dealer`: draws (counted) until the hand is 17 or more. */
export function dealerPlay(shoe: Shoe, dealer: Card[]): void {
  while (handValue(dealer) < 17) dealer.push(drawCard(shoe))
}

export interface Outcome {
  /** Multiplied by the bet: 1.5, 1, 0, or −1. */
  multiplier: number
  message: string
}

export function settle(player: Card[], dealer: Card[]): Outcome {
  const p = handValue(player)
  const d = handValue(dealer)
  if (p > 21) return { multiplier: -1, message: 'Bust.' }
  if (isBlackjack(player) && !isBlackjack(dealer)) return { multiplier: 1.5, message: 'Blackjack pays 3:2.' }
  if (isBlackjack(dealer) && !isBlackjack(player)) return { multiplier: -1, message: 'Dealer blackjack.' }
  if (d > 21 || p > d) return { multiplier: 1, message: 'You win.' }
  if (p < d) return { multiplier: -1, message: 'Dealer wins.' }
  return { multiplier: 0, message: 'Push.' }
}
