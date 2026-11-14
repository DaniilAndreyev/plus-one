import { useEffect, useRef, useState } from 'react'
import CountChip from '../components/CountChip'
import Hand from '../components/Hand'
import { formatCount, hiLoValue } from '../engine/hiLo'
import { buildShoe, drawCard, needsReshuffle } from '../engine/shoe'
import type { Card, Shoe } from '../engine/types'
import { useSettings } from '../settings/context'

type Phase = 'idle' | 'dealing' | 'asking'
type Tone = '' | 'good' | 'bad'
interface Hands {
  p1: Card[]
  p2: Card[]
  p3: Card[]
  dealer: Card[]
}

const EMPTY: Hands = { p1: [], p2: [], p3: [], dealer: [] }
const SPOTS = ['p1', 'p2', 'p3', 'dealer'] as const
const START_MSG = 'Deal a round, count every face-up card.'
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export default function Practice({ active }: { active: boolean }) {
  const { decks, speed, showCount, shoeEpoch } = useSettings()
  const shoe = useRef<Shoe>({ cards: [], runningCount: 0 })
  const hole = useRef<Card | null>(null)
  const runId = useRef(0)
  const speedRef = useRef(speed)
  const phaseRef = useRef<Phase>('idle')
  const [, setTick] = useState(0)
  const [hands, setHands] = useState<Hands>(EMPTY)
  const [holeHidden, setHoleHidden] = useState(true)
  const [phase, setPhaseState] = useState<Phase>('idle')
  const [msg, setMsg] = useState<{ text: string; tone: Tone }>({ text: START_MSG, tone: '' })
  const [guess, setGuess] = useState('')
  const [stats, setStats] = useState({ ok: 0, n: 0 })
  const inputRef = useRef<HTMLInputElement>(null)

  const refresh = () => setTick((t) => t + 1)
  const setPhase = (p: Phase) => {
    phaseRef.current = p
    setPhaseState(p)
  }

  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  // Build a fresh shoe on mount, when the deck count changes, and on "Reshuffle shoes".
  useEffect(() => {
    shoe.current = buildShoe(decks)
    refresh()
  }, [decks, shoeEpoch])

  // Leaving the tab mid-round cancels the round and returns to idle.
  useEffect(() => {
    if (active) return
    runId.current++
    if (phaseRef.current !== 'idle') {
      setHands(EMPTY)
      setHoleHidden(true)
      hole.current = null
      setPhase('idle')
      setMsg({ text: 'Round cancelled. Deal a new round.', tone: '' })
    }
  }, [active])

  useEffect(() => {
    if (phase === 'asking') inputRef.current?.focus()
  }, [phase])

  async function deal() {
    const id = ++runId.current
    setHands(EMPTY)
    setHoleHidden(true)
    setGuess('')
    setPhase('dealing')
    setMsg({ text: '', tone: '' })
    if (needsReshuffle(shoe.current, decks)) {
      shoe.current = buildShoe(decks)
      setMsg({ text: 'Shoe reshuffled. Count reset to 0.', tone: '' })
    }
    const s = shoe.current
    const next: Hands = { p1: [], p2: [], p3: [], dealer: [] }

    for (let r = 0; r < 2; r++) {
      for (let i = 0; i < 4; i++) {
        if (id !== runId.current) return
        const isHole = i === 3 && r === 1
        const card = drawCard(s, !isHole)
        if (isHole) hole.current = card
        next[SPOTS[i]] = [...next[SPOTS[i]], card]
        setHands({ ...next })
        refresh()
        await sleep(speedRef.current)
      }
    }
    for (let i = 0; i < 3; i++) {
      if (Math.random() < 0.4) {
        if (id !== runId.current) return
        next[SPOTS[i]] = [...next[SPOTS[i]], drawCard(s)]
        setHands({ ...next })
        refresh()
        await sleep(speedRef.current)
      }
    }
    if (id !== runId.current) return
    setPhase('asking')
  }

  function check() {
    const g = parseInt(guess, 10)
    const h = hole.current
    if (Number.isNaN(g) || !h) return
    const s = shoe.current
    const before = s.runningCount
    const correct = g === before
    s.runningCount += hiLoValue(h.rank)
    setHoleHidden(false)
    setStats((st) => ({ ok: st.ok + (correct ? 1 : 0), n: st.n + 1 }))
    setPhase('idle')
    const verdict = correct
      ? `Correct: ${formatCount(before)}`
      : `You said ${formatCount(g)}. It was ${formatCount(before)}.`
    setMsg({
      text: `${verdict} Flipped ${h.rank}${h.suit}, count is now ${formatCount(s.runningCount)}.`,
      tone: correct ? 'good' : 'bad',
    })
    refresh()
  }

  return (
    <section id="practice" className={'view' + (active ? ' on' : '')}>
      <div className="felt">
        <div className="stage">
        {showCount && <CountChip shoe={shoe.current} />}

        <div className="pos" style={{ top: '3%', left: '50%' }}>
          <Hand cards={hands.dealer} hideIndex={holeHidden ? 1 : -1} />
          <div className="tag">Dealer</div>
        </div>
        <div className="pos" style={{ top: '38%', left: '17%', transform: 'translateX(-50%) rotate(60deg)' }}>
          <Hand cards={hands.p1} />
        </div>
        <div className="pos" style={{ top: '50%', left: '50%' }}>
          <Hand cards={hands.p2} />
        </div>
        <div className="pos" style={{ top: '38%', left: '83%', transform: 'translateX(-50%) rotate(-60deg)' }}>
          <Hand cards={hands.p3} />
        </div>
        {phase === 'asking' && (
          <div className="ask">
            <b>What is the current count?</b>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                aria-label="Running count"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && check()}
              />
              <button className="btn" onClick={check}>
                Check
              </button>
            </div>
          </div>
        )}

        {phase === 'idle' && (
          <div className="ask" style={{ background: 'transparent', color: '#fff' }}>
            <div className={'msg ' + msg.tone} aria-live="polite">
              {msg.text}
            </div>
            <button className="btn" onClick={deal}>
              {stats.n > 0 ? 'Next round' : 'Deal round'}
            </button>
          </div>
        )}
        </div>
        <div className="head" style={{ top: '60%', left: '3%' }} aria-hidden="true" />
        <div className="head" style={{ top: '60%', left: '97%' }} aria-hidden="true" />
      </div>
      <div className="bar">
        <span>
          Correct{' '}
          <b>
            {stats.ok}/{stats.n}
          </b>
        </span>
        <span>Dealer’s face-down card counts when it’s flipped.</span>
      </div>
    </section>
  )
}
