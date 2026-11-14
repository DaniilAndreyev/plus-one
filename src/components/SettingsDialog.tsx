import { useEffect, useRef } from 'react'
import { SYSTEMS } from '../engine/systems'
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
    <dialog className="settings-dialog" ref={ref} onClose={s.closeSettings} aria-labelledby="settings-title">
      <div className="settings-heading">
        <h2 id="settings-title">Settings</h2>
        <p>Make the table your own.</p>
      </div>
      <label className="settings-row">
        <span className="settings-label">
          Counting system
          <small>Switching resets the shoe</small>
        </span>
        <select className="settings-select" value={s.systemId} onChange={(e) => s.setSystem(e.target.value)}>
          {SYSTEMS.map((sys) => (
            <option key={sys.id} value={sys.id}>
              {sys.name} · level {sys.level}
            </option>
          ))}
        </select>
      </label>
      <label className="settings-row">
        <span className="settings-label">
          Decks
          <small>Cards in each shoe</small>
        </span>
        <select className="settings-select" value={s.decks} onChange={(e) => s.setDecks(Number(e.target.value))}>
          {[1, 2, 4, 6, 8].map((n) => (
            <option key={n} value={n}>
              {n} {n === 1 ? 'deck' : 'decks'}
            </option>
          ))}
        </select>
      </label>
      <label className="settings-row" htmlFor="settings-speed">
        <span className="settings-label">
          Deal speed
          <small>Higher means slower</small>
        </span>
        <span className="settings-range">
          <output htmlFor="settings-speed">{s.speed} ms</output>
          <input
            id="settings-speed"
            type="range"
            min={150}
            max={1200}
            step={50}
            value={s.speed}
            onChange={(e) => s.setSpeed(Number(e.target.value))}
          />
        </span>
      </label>
      <label className="settings-row">
        <span className="settings-label">
          Show running count
          <small>Keep the count visible at the table</small>
        </span>
        <input
          className="settings-checkbox"
          type="checkbox"
          checked={s.showCount}
          onChange={(e) => s.setShowCount(e.target.checked)}
        />
      </label>
      <div className="settings-actions">
        <button
          className="settings-action"
          onClick={() => {
            s.reshuffle()
            s.closeSettings()
          }}
        >
          Reshuffle shoes
        </button>
        <button
          className="settings-action"
          onClick={() => {
            s.resetBalance()
            s.closeSettings()
          }}
        >
          Reset balance
        </button>
        <button className="btn settings-close" onClick={s.closeSettings}>
          Close
        </button>
      </div>
    </dialog>
  )
}
