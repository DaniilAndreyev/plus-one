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
          +1
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
      <main>
        <About active={route === 'about'} />
        <Practice active={route === 'practice'} />
        <Playing active={route === 'playing'} />
      </main>
    </SettingsProvider>
  )
}
