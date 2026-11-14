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
  'hi-lo': 'The classic starting point. It uses simple +1, 0 and −1 values and it is balanced, so it is easy to run fast and turn into a true count.',
  'hi-opt-1': 'Like Hi-Lo but the aces and 2s are worth 0. A cleaner balanced count that players often pair with a separate ace count.',
  'hi-opt-2': 'A balanced level 2 count that splits the low cards apart for more accuracy.',
  ko: 'Knock Out works like Hi-Lo but it also counts 7s. That makes it unbalanced, so you can play straight off the running count with no conversion.',
  'omega-2': 'A precise balanced level 2 count that even gives the 9 a value.',
  'red-7': 'Hi-Lo plus the red 7s. A friendly unbalanced count for beginners.',
  halves: 'A level 3 count that uses half points for the best accuracy.',
  zen: 'A balanced level 2 count that weights aces at −1 and the richest low cards at +2.',
  'ten-count': 'One of the oldest counts. Everything is worth +1 except the tens, which are −2.',
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
            <b>+1</b> helps you learn to count cards the way you would at a real table. Lots of hands, fast cards, and
            one number to keep in your head. Practice the count, then play blackjack while you keep track.
          </p>
          <button className="btn" onClick={() => go('practice')}>
            Start practice
          </button>
        </div>
      </div>

      <h2>What is card counting?</h2>
      <p>
        It is a way to track how many high cards, the tens and aces, are still in the shoe. Those cards are good for you,
        since they mean more blackjacks and more dealer busts. When a lot of them are left, you bet more. You only keep
        one running number, not every card.
      </p>

      <h2>Counting systems</h2>
      <p className="muted">
        Pick a system to see its card values. Higher levels are more accurate but harder to keep up with. You can choose
        the one you play with from the gear menu.
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
          <h3>{sys.name}</h3>
          <p className="lead">
            <span className="muted">Level {sys.level}.</span> {BLURB[sys.id]}
          </p>
          <div className="strat-vals">
            {valueGroups(sys).map((g) => (
              <div key={g.value}>
                <b className={g.value > 0 ? 'c-pos' : g.value < 0 ? 'c-neg' : ''}>{formatCount(g.value)}</b>
                <span>{g.ranks}</span>
              </div>
            ))}
          </div>
          {sys.redSeven && <p className="strat-note">The 7 depends on colour. A red 7 counts +1 and a black 7 counts 0.</p>}
        </div>
      </div>

      <h2>Running count vs true count</h2>
      <p>
        You start at 0 and every card adds its value. That total is the <b>running count</b>. Divide it by the number of
        decks still to be played and you get the <b>true count</b>, which is the number you actually bet on.
      </p>

      <p className="muted">
        Counting cards is legal, but a casino can still ask you to leave. Online games also reshuffle every hand, so it
        only works on a real shoe.
      </p>
    </section>
  )
}
