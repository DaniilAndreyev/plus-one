import { useEffect, useRef, useState } from 'react'
import CountChip from '../components/CountChip'
import Hand from '../components/Hand'
import { dealerPlay, handValue, settle, shouldDealerPlay } from '../engine/blackjack'
import { hiLoValue } from '../engine/hiLo'
import { buildShoe, drawCard, needsReshuffle } from '../engine/shoe'
import type { Card, Shoe } from '../engine/types'
import { useSettings } from '../settings/context'

type Tone = '' | 'good' | 'bad'
interface Round {
  on: boolean
  player: Card[]
  dealer: Card[]
}

const BETS = [1, 5, 10]

export default function Playing({ active }: { active: boolean }) {
  const { decks, showCount, shoeEpoch, balance, setBalance, openSettings } = useSettings()
  const shoe = useRef<Shoe>({ cards: [], runningCount: 0 })
  const [, setTick] = useState(0)
  const [round, setRound] = useState<Round>({ on: false, player: [], dealer: [] })
  const [bet, setBet] = useState(1)
  const [played, setPlayed] = useState(false)
  const [msg, setMsg] = useState<{ text: string; tone: Tone }>({ text: 'Pick a bet and deal.', tone: '' })

  const refresh = () => setTick((t) => t + 1)

  useEffect(() => {
    shoe.current = buildShoe(decks)
    refresh()
  }, [decks, shoeEpoch])

  function deal() {
    if (balance < bet) {
      setMsg({
        text: balance < 1 ? 'Out of chips. Reset the balance in settings.' : 'Not enough for that bet. Pick a smaller one.',
        tone: 'bad',
      })
      return
    }
    let note = ''
    if (needsReshuffle(shoe.current, decks)) {
      shoe.current = buildShoe(decks)
      note = 'Shoe reshuffled. Count reset to 0.'
    }
    setMsg({ text: note, tone: '' })
    const s = shoe.current
    const player = [drawCard(s)]
    const dealer = [drawCard(s)]
    player.push(drawCard(s))
    dealer.push(drawCard(s, false)) // hole card: not counted until revealed
    if (handValue(player) === 21 || handValue(dealer) === 21) {
      finish(player, dealer)
    } else {
      setRound({ on: true, player, dealer })
      refresh()
    }
  }

  function hit() {
    const player = [...round.player, drawCard(shoe.current)]
    if (handValue(player) >= 21) finish(player, [...round.dealer])
    else {
      setRound({ ...round, player })
      refresh()
    }
  }

  function finish(player: Card[], dealer: Card[]) {
    const s = shoe.current
    s.runningCount += hiLoValue(dealer[1].rank) // reveal the hole card
    if (shouldDealerPlay(player, dealer)) dealerPlay(s, dealer)
    const { multiplier, message } = settle(player, dealer)
    setBalance(Math.round((balance + bet * multiplier) * 100) / 100)
    const sign = multiplier > 0 ? '+' : multiplier < 0 ? '−' : ''
    const amount = multiplier ? '$' + Math.abs(bet * multiplier) : ''
    setMsg({
      text: `${message} ${sign}${amount}`.trim(),
      tone: multiplier > 0 ? 'good' : multiplier < 0 ? 'bad' : '',
    })
    setRound({ on: false, player, dealer })
    setPlayed(true)
    refresh()
  }

  const { on, player, dealer } = round
  const dealerLabel = dealer.length ? 'Dealer: ' + (on ? handValue([dealer[0]]) : handValue(dealer)) : 'Dealer'
  const playerLabel = player.length ? 'You: ' + handValue(player) : 'You'

  return (
    <section id="playing" className={'view' + (active ? ' on' : '')}>
      <div className="stage">
        {showCount && <CountChip shoe={shoe.current} />}
        <button className="gear" onClick={openSettings} aria-label="Settings">
          S
        </button>

        <div className="pos" style={{ top: '3%', left: '50%' }}>
          <Hand cards={dealer} hideIndex={on ? 1 : -1} />
          <div className="tag">{dealerLabel}</div>
        </div>
        <div className="pos" style={{ top: '38%', left: '50%' }}>
          <Hand cards={player} />
          <div className="tag">{playerLabel}</div>
        </div>

        <div className="bal">Balance: ${balance}</div>

        <div className="acts">
          <div className={'msg ' + msg.tone} style={{ width: '100%', textAlign: 'center' }} aria-live="polite">
            {msg.text}
          </div>
          {!on &&
            BETS.map((b) => (
              <button key={b} className={'ghost bet' + (bet === b ? ' on' : '')} onClick={() => setBet(b)}>
                ${b}
              </button>
            ))}
          {!on && (
            <button className="btn" onClick={deal}>
              {played ? 'Next hand' : 'Deal'}
            </button>
          )}
          {on && (
            <>
              <button className="btn" onClick={hit}>
                Hit
              </button>
              <button className="btn" onClick={() => finish(player, [...dealer])}>
                Stand
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
