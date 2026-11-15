import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { House, BookOpen, Settings as Cog } from 'lucide-react'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import Reader from './screens/Reader'
import Settings from './screens/Settings'
import Wird from './screens/Wird'
import { useStore } from './store'
import { useUI } from './ui-store'
import { ACCENTS } from './lib/theme'
import { setBars, setHapticsOn, onBack, exitApp, hideSplash, haptic } from './lib/native'
import { handleBack } from './lib/back'

const TABS = [{ v: 'home', l: 'الرئيسية', I: House }, { v: 'read', l: 'المصحف', I: BookOpen }, { v: 'settings', l: 'الإعدادات', I: Cog }]

export default function App() {
  const { onboarded, theme, accent, scale, paper, haptics } = useStore()
  const { tab, setTab, wird, openWird, closeWird, chrome, toast } = useUI()

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'auto' && mq.matches)
      const root = document.documentElement
      root.dataset.theme = dark ? 'dark' : 'light'
      root.dataset.paper = paper === 'auto' ? (dark ? 'night' : 'classic') : paper
      const [d, l] = ACCENTS[accent] || ACCENTS.teal
      root.style.setProperty('--accent', dark ? d : l)
      root.style.setProperty('--ui', scale)
      setBars(dark, dark ? '#060B12' : '#EEF3F5')
    }
    apply(); mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme, accent, scale, paper])
  useEffect(() => setHapticsOn(haptics), [haptics])
  useEffect(() => { const t = setTimeout(hideSplash, 150); return () => clearTimeout(t) }, [])
  useEffect(() => onBack(() => { if (handleBack()) return; if (useUI.getState().tab !== 'home') useUI.getState().setTab('home'); else exitApp() }), [])

  if (!onboarded) return <Onboarding />
  const screen = tab === 'home' ? <Home /> : tab === 'read' ? <Reader /> : <Settings />
  return (
    <div className="app">
      <AnimatePresence mode="wait">
        <motion.div key={tab} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>{screen}</motion.div>
      </AnimatePresence>
      <nav className={'tabbar' + (tab === 'read' && !chrome ? ' hide' : '')}>
        {TABS.map(({ v, l, I }) => (
          <button key={v} className={tab === v ? 'on' : ''} onClick={() => { if (tab !== v) { haptic(); setTab(v) } }}>
            {tab === v && <motion.span layoutId="glow" className="glow" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
            <I size={22} strokeWidth={tab === v ? 2.4 : 1.9} /><span>{l}</span>
          </button>))}
      </nav>
      <AnimatePresence>{wird && <Wird key="wird" items={wird.items} next={wird.next} onClose={closeWird} />}</AnimatePresence>
      <AnimatePresence>{toast && <motion.div key={toast} initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 'calc(var(--sat) + .8rem)', left: 0, right: 0, margin: 'auto', width: 'fit-content', maxWidth: '88%', background: 'var(--text)', color: 'var(--bg)', padding: '.65rem 1.2rem', borderRadius: 22, zIndex: 60, fontSize: '.9rem', fontWeight: 500 }}>{toast}</motion.div>}</AnimatePresence>
    </div>
  )
}
