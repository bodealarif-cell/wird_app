import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { House, BookOpen, Library, Settings as Cog } from 'lucide-react'
import Onboarding from './screens/Onboarding'
import Home from './screens/Home'
import Reader from './screens/Reader'
import Tafsir from './screens/Tafsir'
import Settings from './screens/Settings'
import Wird from './screens/Wird'
import Exam from './screens/Exam'
import { Mark } from './components/Logo'
import { useStore } from './store'
import { useUI } from './ui-store'
import { ACCENTS } from './lib/theme'
import { setBars, setHapticsOn, onBack, exitApp, hideSplash, haptic } from './lib/native'
import { handleBack } from './lib/back'
import { loadMetrics } from './lib/mushaf'

const TABS = [{ v: 'home', l: 'الرئيسية', I: House }, { v: 'read', l: 'المصحف', I: BookOpen }, { v: 'tafsir', l: 'التفسير', I: Library }, { v: 'settings', l: 'الإعدادات', I: Cog }]

export default function App() {
  const { onboarded, theme, accent, scale, paper, haptics } = useStore()
  const { tab, setTab, wird, closeWird, exam, closeExam, chrome, banner, dismissBanner } = useUI()
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
  useEffect(() => { const t = setTimeout(hideSplash, 150); const w = setTimeout(() => loadMetrics(), 400); return () => { clearTimeout(t); clearTimeout(w) } }, [])
  useEffect(() => onBack(() => { if (handleBack()) return; if (useUI.getState().tab !== 'home') useUI.getState().setTab('home'); else exitApp() }), [])
  if (!onboarded) return <Onboarding />
  const screen = tab === 'home' ? <Home /> : tab === 'read' ? <Reader /> : tab === 'tafsir' ? <Tafsir /> : <Settings />
  return (
    <div className="app">
      <AnimatePresence mode="wait">
        <motion.div key={tab} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>{screen}</motion.div>
      </AnimatePresence>
      <nav className={'tabbar glass' + (tab === 'read' && !chrome ? ' hide' : '')}>
        {TABS.map(({ v, l, I }) => (
          <button key={v} className={tab === v ? 'on' : ''} onClick={() => { if (tab !== v) { haptic(); setTab(v) } }}>
            {tab === v && <motion.span layoutId="glow" className="glow" transition={{ type: 'spring', stiffness: 500, damping: 38 }} />}
            <I size={21} strokeWidth={tab === v ? 2.4 : 1.9} /><span>{l}</span>
          </button>))}
      </nav>
      <AnimatePresence>{wird && <Wird key="wird" items={wird.items} next={wird.next} onClose={closeWird} />}</AnimatePresence>
      <AnimatePresence>{exam && <Exam key="exam" pending={exam} onClose={closeExam} />}</AnimatePresence>
      <AnimatePresence>
        {banner && (
          <motion.div key={banner.id} className="banner glass" drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0.6, bottom: 0.05 }}
            onDragEnd={(_, i) => { if (i.offset.y < -24 || i.velocity.y < -400) dismissBanner() }}
            initial={{ y: -130, opacity: 0, scale: 0.94 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -120, opacity: 0, transition: { duration: 0.22 } }} transition={{ type: 'spring', damping: 22, stiffness: 260 }}>
            <Mark size={44} />
            <div className="grow"><div className="bt"><b style={{ color: 'var(--text)' }}>{banner.title}</b><span>الآن</span></div><div className="bm">{banner.msg}</div></div>
          </motion.div>)}
      </AnimatePresence>
    </div>
  )
}
