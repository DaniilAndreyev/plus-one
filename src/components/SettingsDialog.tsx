import { useEffect, useRef } from 'react'
import { useSettings } from '../settings/context'

export default function SettingsDialog() {
  const s = useSettings()
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (s.settingsOpen && !d.open) d.showModal()
    if (!s.settingsOpen && d.open) d.close()
  }, [s.settingsOpen])

  return (
    <dialog ref={ref} onClose={s.closeSettings}>
      <h2 style={{ margin: '0 0 4px', fontSize: '1.3rem' }}>Settings</h2>
      <label>
        Decks
        <select value={s.decks} onChange={(e) => s.setDecks(Number(e.target.value))}>
          {[1, 2, 4, 6, 8].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </label>
      <label>
        Deal speed
        <input
          type="range"
          min={150}
          max={1200}
          step={50}
          value={s.speed}
          onChange={(e) => s.setSpeed(Number(e.target.value))}
        />
      </label>
      <label>
        Show running count
        <input type="checkbox" checked={s.showCount} onChange={(e) => s.setShowCount(e.target.checked)} />
      </label>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          className="btn"
          onClick={() => {
            s.reshuffle()
            s.closeSettings()
          }}
        >
          Reshuffle shoes
        </button>
        <button
          className="btn"
          onClick={() => {
            s.resetBalance()
            s.closeSettings()
          }}
        >
          Reset balance
        </button>
        <button className="ghost" style={{ color: 'var(--ink)', borderColor: 'var(--line)' }} onClick={s.closeSettings}>
          Close
        </button>
      </div>
    </dialog>
  )
}
