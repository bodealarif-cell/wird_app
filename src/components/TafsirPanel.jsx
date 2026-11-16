import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X, ChevronRight, ChevronLeft, BookText } from 'lucide-react'
import { useStore } from '../store'
import { TAFSIRS, tafsirOf } from '../lib/tafsir'
import { NAMES, ayahCount, words, ar } from '../lib/quran'
import { pushBack } from '../lib/back'
import { haptic } from '../lib/native'

export const ayahText = (s, a) => words(s, a).join(' ')
const step = (s, a, d) => { a += d; if (a < 1) { s -= 1; if (s < 1) return null; a = ayahCount(s) } else if (a > ayahCount(s)) { s += 1; if (s > 114) return null; a = 1 } return [s, a] }

// لوح زجاجي ضبابي يظهر فوق الصفحة المقروءة، ولمس أي مكان خارجه يعيدك إلى القراءة في الموضع نفسه
export default function TafsirPanel({ s, a, onClose, onNav, onFull }) {
  const { tafsir, set } = useStore()
  const id = TAFSIRS.find((t) => t.id === tafsir)?.id || TAFSIRS[0]?.id
  const [txt, setTxt] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => pushBack(onClose), [onClose])
  useEffect(() => {
    let ok = true
    if (!id) { setTxt(''); return }
    setBusy(true)
    tafsirOf(id, s, a).then((t) => { if (ok) { setTxt(t); setBusy(false) } })
    return () => { ok = false }
  }, [id, s, a])
  const nx = step(s, a, 1), pv = step(s, a, -1)
  return (
    <>
      <motion.div className="tscrim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} />
      <motion.div className="tpanel glass" initial={{ y: 70, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 50, opacity: 0, scale: 0.96 }} transition={{ type: 'spring', damping: 27, stiffness: 270 }}>
        <div className="row sp" style={{ marginBottom: '.6rem' }}>
          <button className="iconbtn" onClick={onClose} aria-label="إغلاق"><X size={19} /></button>
          <div className="c grow"><div style={{ fontWeight: 600 }}>سورة {NAMES[s - 1]}</div><div className="muted" style={{ fontSize: '.8rem' }}>الآية {ar(a)}</div></div>
          <div className="row" style={{ gap: '.4rem' }}>
            <button className="iconbtn" disabled={!pv} onClick={() => { haptic(); onNav(...pv) }} aria-label="الآية السابقة"><ChevronRight size={19} /></button>
            <button className="iconbtn" disabled={!nx} onClick={() => { haptic(); onNav(...nx) }} aria-label="الآية التالية"><ChevronLeft size={19} /></button>
          </div>
        </div>
        <div className="tayah">{ayahText(s, a)} <span style={{ fontSize: '.85em' }}>{ar(a)}</span></div>
        {TAFSIRS.length > 1 && <div className="chips" style={{ margin: '.2rem 0 .6rem', flexWrap: 'nowrap', overflowX: 'auto' }}>{TAFSIRS.map((t) => <button key={t.id} className={'chip' + (t.id === id ? ' on' : '')} style={{ flex: 'none' }} onClick={() => { haptic(); set({ tafsir: t.id }) }}>{t.name}</button>)}</div>}
        <div className="tbody">
          {!id ? <p className="muted c">لا توجد تفاسير مضافة في هذه النسخة بعد.</p> : busy && !txt ? <p className="muted c">جارٍ التحميل…</p> : <div style={{ whiteSpace: 'pre-wrap' }}>{txt || 'لا يوجد تفسير لهذه الآية في هذا الكتاب.'}</div>}
        </div>
        {id && <button className="btn soft" style={{ minHeight: '2.8rem', marginTop: '.7rem' }} onClick={onFull}><BookText size={18} />تفسير السورة كاملة</button>}
      </motion.div>
    </>
  )
}
