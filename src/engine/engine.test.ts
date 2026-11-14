import { describe, expect, it } from 'vitest'
import { handValue, isBlackjack, settle } from './blackjack'
import { formatCount, hiLoValue, trueCount } from './hiLo'
import { buildShoe, drawCard, needsReshuffle } from './shoe'
import { countValue, getSystem } from './systems'
import type { Card, Rank } from './types'

const c = (rank: Rank): Card => ({ rank, suit: '♠', red: false })

describe('hiLoValue', () => {
  it('maps ranks to Hi-Lo values', () => {
    for (const r of ['2', '3', '4', '5', '6'] as Rank[]) expect(hiLoValue(r)).toBe(1)
    for (const r of ['7', '8', '9'] as Rank[]) expect(hiLoValue(r)).toBe(0)
    for (const r of ['10', 'J', 'Q', 'K', 'A'] as Rank[]) expect(hiLoValue(r)).toBe(-1)
  })
  it('formats counts', () => {
    expect(formatCount(3)).toBe('+3')
    expect(formatCount(0)).toBe('0')
    expect(formatCount(-2)).toBe('−2')
  })
})

describe('shoe', () => {
  it('has 52 cards per deck and starts at count 0', () => {
    const s = buildShoe(6)
    expect(s.cards).toHaveLength(312)
    expect(s.runningCount).toBe(0)
  })
  it('is balanced: drawing a whole deck returns the count to 0', () => {
    const s = buildShoe(1)
    for (let i = 0; i < 52; i++) drawCard(s)
    expect(s.runningCount).toBe(0)
  })
  it('does not count a card drawn with count = false', () => {
    const s = buildShoe(1)
    const before = s.runningCount
    drawCard(s, false)
    expect(s.runningCount).toBe(before)
  })
  it('asks for a reshuffle when the shoe runs low', () => {
    const s = buildShoe(6)
    expect(needsReshuffle(s, 6)).toBe(false)
    s.cards.length = 50
    expect(needsReshuffle(s, 6)).toBe(true)
  })
})

describe('trueCount', () => {
  it('divides the running count by decks remaining', () => {
    expect(trueCount({ cards: new Array<Card>(156).fill(c('5')), runningCount: 6 })).toBe(2)
  })
})

describe('blackjack', () => {
  it('values hands with aces', () => {
    expect(handValue([c('A'), c('K')])).toBe(21)
    expect(handValue([c('A'), c('A'), c('9')])).toBe(21)
    expect(handValue([c('10'), c('9'), c('5')])).toBe(24)
    expect(handValue([c('A'), c('A')])).toBe(12)
  })
  it('detects naturals only on two cards', () => {
    expect(isBlackjack([c('A'), c('10')])).toBe(true)
    expect(isBlackjack([c('5'), c('6'), c('10')])).toBe(false)
  })
  it('settles hands', () => {
    expect(settle([c('10'), c('9'), c('5')], [c('10'), c('7')])).toEqual({ multiplier: -1, message: 'Bust.' })
    expect(settle([c('A'), c('K')], [c('10'), c('9')]).multiplier).toBe(1.5)
    expect(settle([c('10'), c('9')], [c('10'), c('8')]).multiplier).toBe(1)
    expect(settle([c('10'), c('8')], [c('10'), c('8')]).multiplier).toBe(0)
    expect(settle([c('10'), c('7')], [c('10'), c('8')]).multiplier).toBe(-1)
    expect(settle([c('A'), c('K')], [c('A'), c('Q')]).multiplier).toBe(0)
  })
})

describe('counting systems', () => {
  it('scores KO with +1 for sevens', () => {
    const ko = getSystem('ko')
    expect(countValue(ko, c('7'))).toBe(1)
    expect(countValue(ko, c('9'))).toBe(0)
  })
  it('applies the Red 7 colour rule', () => {
    const red7 = getSystem('red-7')
    expect(countValue(red7, { rank: '7', suit: '♥', red: true })).toBe(1)
    expect(countValue(red7, c('7'))).toBe(0)
  })
  it('supports fractional values (Halves)', () => {
    const halves = getSystem('halves')
    expect(countValue(halves, c('5'))).toBe(1.5)
    expect(countValue(halves, c('9'))).toBe(-0.5)
  })
  it('scores 10 Count with +1 for eights and −2 for tens', () => {
    const ten = getSystem('ten-count')
    expect(countValue(ten, c('8'))).toBe(1)
    expect(countValue(ten, c('K'))).toBe(-2)
  })
  it('falls back to Hi-Lo for an unknown id', () => {
    expect(getSystem('nope').id).toBe('hi-lo')
  })
  it('a shoe built with a system counts using it (KO is unbalanced: +4 per deck)', () => {
    const s = buildShoe(1, getSystem('ko'))
    for (let i = 0; i < 52; i++) drawCard(s)
    expect(s.runningCount).toBe(4)
  })
})
