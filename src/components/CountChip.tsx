import { formatCount, trueCount } from '../engine/hiLo'
import type { Shoe } from '../engine/types'

export default function CountChip({ shoe }: { shoe: Shoe }) {
  return (
    <div className="chip">
      Count {formatCount(shoe.runningCount)} · True {trueCount(shoe).toFixed(1)}
    </div>
  )
}
