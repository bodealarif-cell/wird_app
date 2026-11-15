import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Mark } from '../components/Logo'
import { Btn, Stepper } from '../components/ui'
import { useStore } from '../store'
import { NAMES, ayahCount, ar } from '../lib/quran'

const GOALS = ['ختم القرآن', 'حفظ جزء عمّ', 'حفظ سورة البقرة', 'تثبيت ما حفظت']
const PATHS = [
  { v: 'asc', t: 'من أول المصحف', s: 'تبدأ بالفاتحة وتتتابع السور بترتيب المصحف' },
  { v: 'desc', t: 'من آخر المصحف', s: 'تبدأ بسورة الناس وتنزل نحو الفاتحة، والآيات داخل كل سورة بترتيبها' },
  { v: 'own', t: 'أختار موضعي بنفسي', s: 'أي سورة وأي آية تبدأ منها' },
]
export default function Onboarding() {
  const fin = useStore((s) => s.finishOnboarding)
  const [i, setI] = useState(0)
  const [d, setD] = useState({ name: '', age: '', goal: '', cap: 5, mode: 'asc', s: 1, a: 1 })
  const up = (p) => setD((x) => ({ ...x, ...p }))
  const finish = () => fin({
    name: d.name.trim(), age: d.age, goal: d.goal.trim(), cap: d.cap, dir: d.mode === 'desc' ? 'desc' : 'asc',
    ptr: d.mode === 'own' ? { s: d.s, a: Math.min(ayahCount(d.s), Math.max(1, d.a || 1)) } : d.mode === 'desc' ? { s: 114, a: 1 } : { s: 1, a: 1 },
  })
  const steps = [
    <div key="0" className="c" style={{ paddingTop: '12vh' }}>
      <motion.div initial={{ scale: .7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 14 }}><div className="cx"><Mark size={112} /></div></motion.div>
      <h1 className="display" style={{ fontSize: '3.2rem', margin: '1rem 0 0' }}>وِرد</h1>
      <div className="display accent" style={{ fontSize: '1.45rem' }}>ورد اليوم… وكفى.</div>
      <p className="muted" style={{ marginTop: '1.4rem', lineHeight: 2 }}>مصحفٌ لا يُظهر لك إلا ما ستحفظه اليوم، ليبقى قلبك حاضرًا في آيات قليلة بدل أن يتشتت في كثير. تقرأ، ثم تسمّع لنفسك آية آية، ثم يفتح لك الغد وردًا جديدًا.</p>
    </div>,
    <div key="1">
      <h2 className="display" style={{ fontSize: '1.8rem' }}>تشرفنا بمعرفتك</h2>
      <p className="muted">نخصّص رحلتك باسمك وهدفك.</p>
      <label className="field"><span>الاسم</span><input value={d.name} onChange={(e) => up({ name: e.target.value })} placeholder="كيف نناديك؟" autoComplete="off" /></label>
      <label className="field"><span>العمر</span><input type="number" inputMode="numeric" min="3" max="120" value={d.age} onChange={(e) => up({ age: e.target.value })} /></label>
      <div className="field"><span>هدفك</span>
        <div className="chips" style={{ marginBottom: '.6rem' }}>{GOALS.map((g) => <button key={g} className={'chip' + (d.goal === g ? ' on' : '')} onClick={() => up({ goal: g })}>{g}</button>)}</div>
        <input value={d.goal} onChange={(e) => up({ goal: e.target.value })} placeholder="أو اكتب هدفك بنفسك" />
      </div>
    </div>,
    <div key="2" className="c">
      <h2 className="display" style={{ fontSize: '1.8rem' }}>كم آية تحمل في يومك؟</h2>
      <p className="muted">اختر قدرًا تلتزم به بسهولة. القليل الدائم خير من كثير منقطع، وتغييره متاح دائمًا.</p>
      <div style={{ margin: '1.6rem 0' }}><Stepper value={d.cap} onChange={(cap) => up({ cap })} fmt={ar} /></div>
      <div className="chips" style={{ justifyContent: 'center' }}>{[3, 5, 7, 10, 15, 20].map((n) => <button key={n} className={'chip' + (d.cap === n ? ' on' : '')} onClick={() => up({ cap: n })}>{ar(n)}</button>)}</div>
      <p className="muted" style={{ marginTop: '1.4rem' }}>هدفك الأسبوعي ≈ <b className="accent">{ar(d.cap * 7)}</b> آية</p>
    </div>,
    <div key="3">
      <h2 className="display" style={{ fontSize: '1.8rem' }}>من أين تبدأ؟</h2>
      <div className="stack" style={{ marginTop: '1rem' }}>
        {PATHS.map((p) => (
          <button key={p.v} onClick={() => up({ mode: p.v })} className="card" style={{ width: '100%', textAlign: 'start', margin: 0, borderColor: d.mode === p.v ? 'var(--accent)' : undefined, boxShadow: d.mode === p.v ? '0 0 0 1px var(--accent) inset' : undefined }}>
            <div style={{ fontWeight: 600 }}>{p.t}</div><div className="muted" style={{ fontSize: '.85rem' }}>{p.s}</div>
          </button>
        ))}
      </div>
      {d.mode === 'own' && (
        <div className="card">
          <label className="field" style={{ marginTop: 0 }}><span>السورة</span>
            <select value={d.s} onChange={(e) => up({ s: +e.target.value, a: 1 })}>{NAMES.map((n, k) => <option key={k} value={k + 1}>{ar(k + 1)}. {n}</option>)}</select></label>
          <label className="field"><span>من الآية (١–{ar(ayahCount(d.s))})</span><input type="number" inputMode="numeric" min="1" max={ayahCount(d.s)} value={d.a} onChange={(e) => up({ a: +e.target.value })} /></label>
        </div>
      )}
    </div>,
  ]
  return (
    <div className="app">
      <div className="screen" style={{ paddingBottom: '9rem' }}>
        <div className="dots" style={{ margin: '.3rem 0 1.4rem' }}>{steps.map((_, k) => <i key={k} className={k === i ? 'on' : ''} />)}</div>
        <AnimatePresence mode="wait"><motion.div key={i} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }} transition={{ duration: .22 }}>{steps[i]}</motion.div></AnimatePresence>
      </div>
      <div className="bar"><div className="in">
        {i > 0 && <button className="iconbtn" style={{ width: '3.3rem', height: '3.3rem' }} onClick={() => setI(i - 1)} aria-label="رجوع"><ArrowRight size={20} /></button>}
        <Btn icon={i === 3 ? Sparkles : undefined} onClick={() => (i < 3 ? setI(i + 1) : finish())}>{i === 0 ? 'ابدأ رحلتك' : i < 3 ? 'التالي' : 'ابدأ وِردي'}</Btn>
      </div></div>
    </div>
  )
}
