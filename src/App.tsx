import SettingsButton from './components/SettingsButton'
import StrategyBadge from './components/StrategyBadge'
import { useHashRoute } from './hooks/useHashRoute'
import Home from './pages/Home'
import Playing from './pages/Playing'
import Practice from './pages/Practice'
import SettingsProvider from './settings/SettingsProvider'

export default function App() {
  const route = useHashRoute()
  const current = (r: string) => (route === r ? 'page' : undefined)

  return (
    <SettingsProvider>
      <header>
        <a className="logo" href="#home">
          <img src="/res/plusonelogo.png" alt="Plus One home" />
        </a>
        <nav aria-label="Sections">
          <a href="#home" aria-current={current('home')}>
            Home
          </a>
          <a href="#practice" aria-current={current('practice')}>
            Practice
          </a>
          <a href="#playing" aria-current={current('playing')}>
            Playing
          </a>
        </nav>
        <span />
      </header>
      <div className="gearbar">
        <StrategyBadge />
        <SettingsButton />
      </div>
      <main>
        <Home active={route === 'home'} />
        <Practice active={route === 'practice'} />
        <Playing active={route === 'playing'} />
      </main>
    </SettingsProvider>
  )
}
