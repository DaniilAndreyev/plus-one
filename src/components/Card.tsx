import type { Card as CardType } from '../engine/types'

/** `card = null` renders a face-down card. */
export default function Card({ card }: { card: CardType | null }) {
  if (!card) return <div className="card back" />
  return (
    <div className={'card' + (card.red ? ' r' : '')}>
      <i>
        {card.rank}
        <br />
        {card.suit}
      </i>
      <em>{card.suit}</em>
    </div>
  )
}
