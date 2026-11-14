import { createContext, useContext } from 'react'

export interface Settings {
  decks: number
  speed: number
  showCount: boolean
  balance: number
  /** Increments whenever shoes must be rebuilt (reshuffle button). Pages also rebuild when `decks` changes. */
  shoeEpoch: number
  settingsOpen: boolean
  setDecks: (n: number) => void
  setSpeed: (n: number) => void
  setShowCount: (b: boolean) => void
  setBalance: (n: number) => void
  resetBalance: () => void
  reshuffle: () => void
  openSettings: () => void
  closeSettings: () => void
}

export const SettingsContext = createContext<Settings | null>(null)

export function useSettings(): Settings {
  const value = useContext(SettingsContext)
  if (!value) throw new Error('useSettings must be used inside SettingsProvider')
  return value
}
