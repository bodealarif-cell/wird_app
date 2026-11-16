import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Eye, RotateCcw, BookOpen, Brain } from 'lucide-react'
import MushafPage from '../components/MushafPage'
import { useMetrics } from '../components/useMetrics'
import { Btn, Segmented, Sheet } from '../components/ui'
import { useStore } from '../store'
import { useUI } from '../ui-store'
import { label, wirdPages, ar } from '../lib/quran'
import { pushBack } from '../lib/back'
import { haptic } from '../lib/native'

export default function Wird({ items, next, onClose }) {
  const complete = useStore((s) => s.complete)
  const toast = useUI((s) => s.toastMsg)
  const [tab, setTab] = useState(0)
  const [R, setR] = useState(() => items.map(() => false))
  const [ask, setAsk] = useState(false)
  const [ref, m] = useMetrics(14)
  useEffect(() => pushBack(onClose), [onClose])
  const map = useMemo(() => { const o = {}; items.forEach(([s, a], i) => { o[s * 1000 + a] = i }); return o }, [items])
  const [p1, p2] = wirdPages(items)
  const cur = tab === 1 ? R.findIndex((z) => !z) : -1
  const view = { idx: (s, a) => map[s * 1000 + a] ?? -1, masked: tab === 1, R, cur, tap: (i) => { haptic(); setR((r) => r.map((v, k) => (k === i ? !v : v))) } }
  useEffect(() => { if (m) document.querySelector(tab === 1 && cur >= 0 ? '.w.cur' : '.w:not(.x)')?.scrollIntoView({ block: 'center', behavior: 'smooth' }) }, [R, tab, !!m]) // eslint-disable-line
  const all = R.every(Boolean)
  const done = () => { const b = useStore.getState(); const ready = b.examEvery > 0 && b.pending.length + 1 >= b.examEvery; complete(items, next); haptic('heavy'); toast(ready ? 'تقبّل الله منك. اختبار التسميع جاهز الآن.' : 'تقبّل الله منك'); onClose() }
  const pages = []
  if (m) for (let p = p1; p <= p2; p++) pages.push(<MushafPage key={p} p={p} {...m} view={view} />)
  return (
    <motion.div className="app" style={{ position: 'fixed', inset: 0, zIndex: 30 }} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 34, stiffness: 320 }}>
      <div style={{ padding: 'calc(var(--sat) + .7rem) 1rem .6rem' }}>
        <div className="row" style={{ marginBottom: '.7rem' }}>
          <button className="iconbtn" onClick={onClose} aria-label="رجوع"><ArrowRight size={20} /></button>
          <div className="grow"><div className="eyebrow">ورد اليوم · {ar(items.length)} آية</div><div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label(items)}</div></div>
        </div>
        <Segmented value={tab} onChange={setTab} options={[{ v: 0, l: 'القراءة' }, { v: 1, l: 'الحفظ والتسميع' }]} />
        <div className="muted c" style={{ fontSize: '.8rem', marginTop: '.5rem' }}>{tab === 0 ? 'اقرأ الورد بتمهّل، فلا يظهر من المصحف سواه' : 'سمّع الآية لنفسك ثم اضغط «أظهر» لتتحقق. ولمس أي آية يكشفها أو يخفيها'}</div>
      </div>
      <div ref={ref} style={{ flex: 1, overflowY: 'auto', padding: '.4rem .5rem 9rem' }}><div className="wirdpages">{pages}</div></div>
      <div className="bar"><div className="in">
        {tab === 0 ? <Btn icon={Brain} onClick={() => setTab(1)}>انتقل إلى الحفظ</Btn> : <>
          <Btn icon={all ? RotateCcw : Eye} onClick={() => { haptic(); if (all) setR(items.map(() => false)); else setR((r) => { const i = r.findIndex((z) => !z); return r.map((v, k) => (k === i ? true : v)) }) }}>
            {all ? 'أعد التسميع' : `أظهر الآية ${ar(cur + 1)} من ${ar(items.length)}`}</Btn>
          <button className="btn primary" style={{ width: '3.6rem', flex: 'none', padding: 0 }} onClick={() => { haptic(); setAsk(true) }} aria-label="أتممت الورد"><Check size={24} strokeWidth={3} /></button></>}
      </div></div>
      <Sheet open={ask} onClose={() => setAsk(false)} title="هل أتممتَ حفظ وردك؟">
        <p className="muted" style={{ marginTop: 0 }}>إذا سمّعته غيبًا فاثبت علامة الإتمام، وسينتقل مسارك إلى الورد التالي.</p>
        <div className="stack"><Btn icon={Check} onClick={done}>نعم، أتممته</Btn><Btn v="plain" onClick={() => setAsk(false)}>ليس بعد</Btn></div>
      </Sheet>
    </motion.div>
  )
}
