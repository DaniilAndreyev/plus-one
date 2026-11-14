import SettingsButton from './components/SettingsButton'
import { useHashRoute } from './hooks/useHashRoute'
import About from './pages/About'
import Playing from './pages/Playing'
import Practice from './pages/Practice'
import SettingsProvider from './settings/SettingsProvider'

export default function App() {
  const route = useHashRoute()
  const current = (r: string) => (route === r ? 'page' : undefined)

  return (
    <SettingsProvider>
      <header>
        <a className="logo" href="#about">
          <img src="/res/plusonelogo.png" alt="Plus One home" />
        </a>
        <nav aria-label="Sections">
          <a href="#about" aria-current={current('about')}>
            About
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
        <SettingsButton />
      </div>
      <main>
        <About active={route === 'about'} />
        <Practice active={route === 'practice'} />
        <Playing active={route === 'playing'} />
      </main>
    </SettingsProvider>
  )
}
