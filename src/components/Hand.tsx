import type { Card as CardType } from '../engine/types'
import Card from './Card'

/** Cards overlap in a fan. `hideIndex` renders that card face-down (the dealer's hole card). */
export default function Hand({ cards, hideIndex = -1 }: { cards: CardType[]; hideIndex?: number }) {
  return (
    <div className="hand">
      {cards.map((c, i) => (
        <Card key={`${c.rank}${c.suit}-${i}`} card={i === hideIndex ? null : c} />
      ))}
    </div>
  )
}
