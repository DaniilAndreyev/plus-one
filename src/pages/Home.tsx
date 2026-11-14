import { useState } from 'react'
import { formatCount } from '../engine/hiLo'
import { SYSTEMS } from '../engine/systems'
import type { CountingSystem, Rank } from '../engine/types'
import { go } from '../hooks/useHashRoute'

const CELLS: { key: Rank; label: string }[] = [
  { key: '2', label: '2' },
  { key: '3', label: '3' },
  { key: '4', label: '4' },
  { key: '5', label: '5' },
  { key: '6', label: '6' },
  { key: '7', label: '7' },
  { key: '8', label: '8' },
  { key: '9', label: '9' },
  { key: '10', label: '10 J Q K' },
  { key: 'A', label: 'A' },
]

const BLURB: Record<string, string> = {
  'hi-lo': 'The classic starting point: simple +1 / 0 / −1 and balanced, so it is easy to run fast and convert to a true count.',
  'hi-opt-1': 'Hi-Lo without the aces or 2s — a cleaner balanced count, usually paired with a separate ace count.',
  'hi-opt-2': 'A balanced level-2 count that splits the low cards for extra accuracy.',
  ko: 'Knock-Out: like Hi-Lo but it also counts 7s, which makes it unbalanced — play straight off the running count, no conversion.',
  'omega-2': 'A precise balanced level-2 count that even gives the 9 a value.',
  'red-7': 'Hi-Lo plus the red 7s — a beginner-friendly unbalanced count.',
  halves: 'A level-3 count using half-points for the strongest accuracy.',
  zen: 'A balanced level-2 count weighting aces −1 and the richest low cards +2.',
  'ten-count': 'One of the oldest counts: everything is +1 except the tens, which are −2.',
}

/** Groups a system's ranks by their value, highest value first. */
function valueGroups(sys: CountingSystem): { value: number; ranks: string }[] {
  const map = new Map<number, string[]>()
  for (const { key, label } of CELLS) {
    const v = sys.values[key]
    map.set(v, [...(map.get(v) ?? []), label])
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0]).map(([value, ranks]) => ({ value, ranks: ranks.join('   ') }))
}

export default function Home({ active }: { active: boolean }) {
  const [sel, setSel] = useState(SYSTEMS[0].id)
  const sys = SYSTEMS.find((s) => s.id === sel) ?? SYSTEMS[0]

  return (
    <section id="home" className={'view' + (active ? ' on' : '')}>
      <div className="home-hero">
        <img className="home-hero__logo" src="/res/plusonelogo.png" alt="+1 Hi-Lo card counting trainer" />
        <div className="home-hero__intro">
          <p>
            <b>+1</b> trains you to count cards like a real table — several hands, cards flying, one running number in
            your head. Practice the count, then play blackjack while you keep it.
          </p>
          <button className="btn" onClick={() => go('practice')}>
            Start practice
          </button>
        </div>
      </div>

      <h2>Counting systems</h2>
      <p className="muted">
        Pick a system to see its card values — higher levels are more accurate but harder to keep up with. Choose the one
        you play with from the gear menu.
      </p>
      <div className="strat">
        <div className="strat-tabs" role="tablist" aria-label="Counting systems">
          {SYSTEMS.map((s) => (
            <button
              key={s.id}
              role="tab"
              aria-selected={s.id === sel}
              className={'strat-tab' + (s.id === sel ? ' on' : '')}
              onClick={() => setSel(s.id)}
            >
              {s.name}
            </button>
          ))}
        </div>
        <div className="strat-box">
          <h3>
            {sys.name} <span className="muted">· level {sys.level}</span>
          </h3>
          <p className="lead">{BLURB[sys.id]}</p>
          <div className="strat-vals">
            {valueGroups(sys).map((g) => (
              <div key={g.value}>
                <b className={g.value > 0 ? 'c-pos' : g.value < 0 ? 'c-neg' : ''}>{formatCount(g.value)}</b>
                <span>{g.ranks}</span>
              </div>
            ))}
          </div>
          {sys.redSeven && <p className="strat-note">The 7 is split by colour: a red 7 counts +1, a black 7 counts 0.</p>}
        </div>
      </div>

      <h2>What is card counting?</h2>
      <p>
        It tracks how many high cards — tens and aces — are left. They favour the player: more blackjacks, more dealer
        busts. So when plenty remain, you bet more. You keep one running number, not every card.
      </p>

      <h2>Running count vs true count</h2>
      <p>
        Start at 0; each card adds its value — that is the <b>running count</b>. Divide it by the decks still unplayed for
        the <b>true count</b>, the number you actually bet on.
      </p>

      <p className="muted">
        Counting is legal, but casinos can ask you to leave — and online games reshuffle every hand, so it only works on a
        real shoe.
      </p>
    </section>
  )
}
