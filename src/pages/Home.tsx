import { formatCount } from '../engine/hiLo'
import { SYSTEMS } from '../engine/systems'
import type { CountingSystem, Rank } from '../engine/types'
import { go } from '../hooks/useHashRoute'

const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A']

/** Display string for a system's value at a rank (Red 7 shows the colour split). */
function cell(sys: CountingSystem, rank: Rank): string {
  if (sys.redSeven && rank === '7') return '0/+1'
  return formatCount(sys.values[rank])
}

function cellClass(sys: CountingSystem, rank: Rank): string {
  if (sys.redSeven && rank === '7') return 'c-pos'
  const v = sys.values[rank]
  return v > 0 ? 'c-pos' : v < 0 ? 'c-neg' : ''
}

export default function Home({ active }: { active: boolean }) {
  return (
    <section id="home" className={'view' + (active ? ' on' : '')}>
      <div className="hero">
        <img className="hero-logo" src="/res/plusonelogo.png" alt="+1 Hi-Lo card counting trainer" />
        <p>
          Learn to count cards the way it happens at a real table: several hands, cards falling fast, one running
          number in your head.
        </p>
        <button className="btn" onClick={() => go('practice')}>
          Start practice
        </button>
      </div>

      <h2>What is card counting?</h2>
      <p>
        Card counting tracks roughly how many high cards — tens and aces — are still in the shoe. Those cards favour the
        player: they pay the 3:2 bonus on blackjacks and make the dealer bust more often. So when plenty of them remain,
        the odds tilt your way and you raise your bet. You never memorise individual cards; you keep one running number
        updated as each card is exposed.
      </p>
      <p style={{ color: 'var(--mute)' }}>
        Counting is legal, but casinos can ask you to leave. Online games reshuffle after every hand, so counting only
        works against a real shoe dealt down toward the end.
      </p>

      <h2>Running count and true count</h2>
      <p>
        You start at <b>0</b> on a fresh shoe. Every card adds its system’s value to the <b>running count</b>: low cards
        push it up (the cards that helped the dealer are now gone), high cards push it down. The higher the running
        count, the richer the remaining shoe is in high cards.
      </p>
      <p>
        To compare across shoe sizes you convert to the <b>true count</b> — divide the running count by the number of
        decks still unplayed. A running count of +6 with three decks left is only a true count of +2, and the true count
        is what you’d actually base bets on. Turn on “Show running count” in settings to see both while you learn.
      </p>

      <h2>Counting systems</h2>
      <p>
        Every system gives each rank a value; you simply add them up. They trade simplicity for accuracy. This grid shows
        each card’s value in every system you can pick from the gear menu — the <b>10</b> column also covers J, Q and K.
      </p>
      <div className="table-scroll">
        <table className="systems">
          <thead>
            <tr>
              <th scope="col">Strategy</th>
              {RANKS.map((r) => (
                <th key={r} scope="col">
                  {r}
                </th>
              ))}
              <th scope="col">Level</th>
            </tr>
          </thead>
          <tbody>
            {SYSTEMS.map((sys) => (
              <tr key={sys.id}>
                <th scope="row">{sys.name}</th>
                {RANKS.map((r) => (
                  <td key={r} className={cellClass(sys, r)}>
                    {cell(sys, r)}
                  </td>
                ))}
                <td>{sys.level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>What each part means</h2>
      <ul className="legend">
        <li>
          <b>Card values</b> — the number added to the running count when you see that card: positive for low cards,
          negative for high cards, 0 for neutral ones.
        </li>
        <li>
          <b>Level</b> — how many different values the system uses. Level 1 (just +1 / 0 / −1) is easiest to run at speed;
          higher levels (±2, or half-points) track the odds more precisely but are harder to keep up with.
        </li>
        <li>
          <b>Balanced vs unbalanced</b> — in balanced systems (Hi-Lo, Hi-Opt, Omega II, Halves, Zen) a full deck counts
          back to 0, so you convert to a true count. Unbalanced systems (<b>KO</b>, <b>10 Count</b>) don’t return to 0
          and are built to be used on the running count alone.
        </li>
        <li>
          <b>Red 7</b> — a middle ground shown as <b>0/+1</b>: a red 7 counts +1, a black 7 counts 0.
        </li>
        <li>
          <b>Halves</b> — uses half-points (±0.5, ±1.5) for extra accuracy; in Practice you can type decimals like 2.5.
        </li>
      </ul>

      <p style={{ color: 'var(--mute)' }}>
        Pick a system any time from the <b>gear menu</b> — switching reshuffles the shoe so your count starts clean.
        Practice quizzes you on the count after each round; Playing lets you play real blackjack with $25 while you keep
        count.
      </p>
    </section>
  )
}
