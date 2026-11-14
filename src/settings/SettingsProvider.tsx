import { useState, type ReactNode } from 'react'
import SettingsDialog from '../components/SettingsDialog'
import { SettingsContext, type Settings } from './context'

export default function SettingsProvider({ children }: { children: ReactNode }) {
  const [decks, setDecks] = useState(6)
  const [speed, setSpeed] = useState(600)
  const [showCount, setShowCount] = useState(false)
  const [balance, setBalance] = useState(25)
  const [systemId, setSystem] = useState('hi-lo')
  const [shoeEpoch, setShoeEpoch] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const value: Settings = {
    decks,
    speed,
    showCount,
    balance,
    systemId,
    shoeEpoch,
    settingsOpen,
    setDecks,
    setSpeed,
    setShowCount,
    setSystem,
    setBalance,
    resetBalance: () => setBalance(25),
    reshuffle: () => setShoeEpoch((n) => n + 1),
    openSettings: () => setSettingsOpen(true),
    closeSettings: () => setSettingsOpen(false),
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
      <SettingsDialog />
    </SettingsContext.Provider>
  )
}
