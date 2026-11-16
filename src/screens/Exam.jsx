import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Check, ChevronLeft, RotateCcw } from 'lucide-react'
import { Btn } from '../components/ui'
import { useStore } from '../store'
import { buildExam, grade, norm } from '../lib/exam'
import { NAMES, ar, dayKey } from '../lib/quran'
import { pushBack } from '../lib/back'
import { haptic } from '../lib/native'

const pct = (x) => ar(Math.round(x * 100)) + '٪'
const verdict = (x) => (x >= 0.9 ? 'ثبّتَّ ما حفظتَ، ما شاء الله. واصل بثبات.' : x >= 0.7 ? 'حفظك جيد. راجع المواضع الحمراء ثم واصل.' : 'يحتاج ورداك إلى مراجعة. كرّر قراءتهما بتمهّل ثم أعد الاختبار.')
const color = (x) => (x >= 0.9 ? '#37d69b' : x >= 0.7 ? '#e7c27a' : '#ff7a7a')

export default function Exam({ pending, onClose }) {
  const finish = useStore((s) => s.finishExam)
  const [seed, setSeed] = useState(0)
  const qs = useMemo(() => buildExam(pending), [pending, seed]) // eslint-disable-line
  const [i, setI] = useState(0), [txt, setTxt] = useState(''), [g, setG] = useState(null), [res, setRes] = useState([]), [done, setDone] = useState(false)
  useEffect(() => pushBack(onClose), [onClose])
  const q = qs[i]
  const avg = res.length ? res.reduce((t, r) => t + r.acc, 0) / res.length : 0
  const check = () => { const ns = norm(q.shown), nt = norm(txt); const typed = ns && nt.startsWith(ns) ? nt.slice(ns.length) : txt; const r = grade(q.rest, typed); setG(r); haptic(r.acc >= 0.9 ? 'heavy' : 'light') }
  const next = () => { setRes((r) => [...r, { s: q.s, a: q.a, acc: g.acc }]); if (i + 1 < qs.length) { setI(i + 1); setTxt(''); setG(null) } else setDone(true) }
  const again = () => { setSeed((x) => x + 1); setI(0); setTxt(''); setG(null); setRes([]); setDone(false) }
  const save = () => { finish({ d: dayKey(), avg, qs: res }); onClose() }
  return (
    <motion.div className="app" style={{ position: 'fixed', inset: 0, zIndex: 32 }} initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 34, stiffness: 320 }}>
      <div style={{ padding: 'calc(var(--sat) + .7rem) 1rem .4rem' }} className="row">
        <button className="iconbtn" onClick={onClose} aria-label="رجوع"><ArrowRight size={20} /></button>
        <div className="grow"><div className="eyebrow">اختبار التسميع</div><div style={{ fontWeight: 600 }}>{done ? 'النتيجة' : `السؤال ${ar(i + 1)} من ${ar(qs.length)}`}</div></div>
      </div>
      <div className="screen" style={{ paddingTop: '.6rem' }}>
        {!qs.length && <p className="muted c">لا توجد أسئلة.</p>}
        {!done && q && <>
          <div className="card c">
            <div className="eyebrow">سورة {NAMES[q.s - 1]} · الآية {ar(q.a)}</div>
            <div className="q-shown">{q.shown || <span className="muted" style={{ fontSize: '1rem' }}>اكتب الآية كاملة</span>}{q.shown && <span className="muted"> …</span>}</div>
          </div>
          {!g ? <>
            <label className="field"><span>{q.shown ? 'اكتب باقي الآية' : 'اكتب الآية'} (دون تشكيل ولا همزات)</span>
              <textarea className="ta" rows={3} dir="rtl" value={txt} onChange={(e) => setTxt(e.target.value)} placeholder="اكتب هنا…" autoFocus /></label>
            <Btn icon={Check} onClick={check} disabled={!txt.trim()}>تحقق</Btn>
            <Btn v="ghost" onClick={() => { setTxt(''); check() }}>لا أذكر</Btn>
          </> : <div className="card">
            <div className="row sp"><span className="eyebrow">تقديرك</span><b className="display" style={{ fontSize: '1.9rem', color: color(g.acc) }}>{pct(g.acc)}</b></div>
            <div className="eyebrow" style={{ marginTop: '.6rem' }}>الصواب</div>
            <div className="q-shown" style={{ fontSize: '1.45rem' }}>{g.parts.map((p, k) => <span key={k} className={'L-' + p.st}>{p.c}</span>)}</div>
            {txt.trim() && <><div className="eyebrow">كتبتَ</div><div style={{ direction: 'rtl', lineHeight: 1.9 }} className="muted">{txt}</div></>}
            <div className="muted" style={{ fontSize: '.78rem', margin: '.6rem 0' }}>الأخضر حرف صحيح، والأحمر ناقص أو خطأ. ولا يُحتسب التشكيل ولا الهمزات.</div>
            <Btn icon={ChevronLeft} onClick={next}>{i + 1 < qs.length ? 'السؤال التالي' : 'عرض النتيجة'}</Btn>
          </div>}
        </>}
        {done && <>
          <div className="card c">
            <div className="eyebrow">متوسط تقديرك</div>
            <div className="display pop" style={{ fontSize: '3.8rem', color: color(avg), lineHeight: 1.3 }}>{pct(avg)}</div>
            <p style={{ margin: 0 }}>{verdict(avg)}</p>
          </div>
          <div className="list">{res.map((r, k) => <div key={k} className="item"><span className="grow">سورة {NAMES[r.s - 1]} · الآية {ar(r.a)}</span><b style={{ color: color(r.acc) }}>{pct(r.acc)}</b></div>)}</div>
          <div className="stack"><Btn icon={Check} onClick={save}>تم</Btn><Btn v="plain" icon={RotateCcw} onClick={again}>اختبار آخر بأسئلة جديدة</Btn></div>
        </>}
      </div>
    </motion.div>
  )
}
