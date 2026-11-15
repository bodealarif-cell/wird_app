import { useState } from 'react'
import { Check, BookOpen, Share2, Target, Compass, Play } from 'lucide-react'
import { Mark } from '../components/Logo'
import { Btn, Sheet } from '../components/ui'
import { useStore } from '../store'
import { useUI } from '../ui-store'
import { take, label, wirdPages, ar, NAMES, ayahCount, surahOfPage, greeting, hijri, dayKey, weekKey, weekDays, DAY_LABELS } from '../lib/quran'
import { shareApp } from '../lib/native'

export default function Home() {
  const s = useStore()
  const { setTab, openWird } = useUI()
  const [pick, setPick] = useState(false)
  const [pv, setPv] = useState({ s: 1, a: 1 })
  const r = s.ptr ? take(s.ptr.s, s.ptr.a, s.cap, s.dir) : { it: [], next: null }
  const page = r.it.length ? wirdPages(r.it)[0] + 1 : 0
  const doneToday = s.log.some((l) => l.d === dayKey())
  const weekN = s.log.filter((l) => l.w === weekKey()).reduce((t, l) => t + l.n, 0)
  const doneDays = new Set(s.log.map((l) => l.d)), today = dayKey()
  const parts = greeting(s.first).split('{n}')
  const openRead = (p) => { useStore.setState({ lastPage: p }); setTab('read') }
  const startCustom = () => { const x = take(pv.s, pv.a, s.cap, s.dir); setPick(false); openWird({ items: x.it, next: x.next }) }
  return (
    <div className="screen">
      <div className="row sp" style={{ marginBottom: '.4rem' }}>
        <div className="row"><Mark size={42} /><div className="display" style={{ fontSize: '1.7rem', lineHeight: 1 }}>وِرد</div></div>
        <div className="eyebrow">{hijri()}</div>
      </div>
      <div className="card hero">
        <div className="eyebrow" style={{ marginBottom: '.5rem' }}>رسالة اليوم</div>
        <div className="display" style={{ fontSize: '1.4rem', lineHeight: 1.85 }}>{parts[0]}<span className="accent">{s.name || 'صاحبي'}</span>{parts[1]}</div>
        {s.goal && <div className="chip" style={{ marginTop: '1rem', display: 'inline-block' }}>هدفك: {s.goal}</div>}
      </div>
      {s.ptr ? (
        <div className="card">
          <div className="row sp"><span className="eyebrow">{doneToday ? 'ورد إضافي' : 'ورد اليوم'}</span><span className="chip">{ar(r.it.length)} آية · صفحة {ar(page)}</span></div>
          <div className="display" style={{ fontSize: '1.65rem', margin: '.6rem 0 1.1rem', lineHeight: 1.6 }}>{label(r.it)}</div>
          <Btn icon={Play} onClick={() => openWird({ items: r.it, next: r.next })}>ابدأ الورد</Btn>
          <Btn v="ghost" icon={BookOpen} className="" onClick={() => openRead(page)} style={{ marginTop: '.3rem' }}>افتح موضعه في المصحف</Btn>
        </div>
      ) : (
        <div className="card c"><div className="display accent" style={{ fontSize: '1.4rem' }}>بلغتَ نهاية المصحف، ما شاء الله</div><p className="muted">اختر وردًا جديدًا من أي موضع.</p></div>
      )}
      <div className="card">
        <div className="row sp"><span className="eyebrow">هدف هذا الأسبوع</span><Target size={18} className="muted" /></div>
        <div style={{ margin: '.4rem 0 1rem' }}>{weekN ? <>حفظتَ <span className="display accent" style={{ fontSize: '1.9rem' }}>{ar(weekN)}</span> <span className="muted">من {ar(s.cap * s.days)} آية</span></> : <span className="muted">هدفك هذا الأسبوع <b className="accent">{ar(s.cap * s.days)}</b> آية، وأول خطوة هي ورد اليوم</span>}</div>
        <div className="row sp">{weekDays().map((d, i) => (
          <div key={d} className="c" style={{ flex: 1 }}>
            <div style={{ width: '2.1rem', height: '2.1rem', margin: '0 auto', borderRadius: '50%', display: 'grid', placeItems: 'center', background: doneDays.has(d) ? 'var(--accent)' : 'var(--surface2)', color: 'var(--on)', border: d === today ? '2px solid var(--accent)' : '1px solid var(--line)' }}>{doneDays.has(d) && <Check size={16} strokeWidth={3} />}</div>
            <div className="muted" style={{ fontSize: '.72rem', marginTop: '.25rem' }}>{DAY_LABELS[i]}</div>
          </div>))}</div>
      </div>
      <button className="card row" style={{ width: '100%', textAlign: 'start' }} onClick={() => openRead(s.lastPage)}>
        <span className="item" style={{ padding: 0, minHeight: 0 }}><span className="ic"><BookOpen size={19} /></span><span className="grow"><div className="t">تابع القراءة في المصحف</div><div className="s">سورة {NAMES[surahOfPage(s.lastPage - 1) - 1]} · صفحة {ar(s.lastPage)}</div></span></span>
      </button>
      <div className="row" style={{ marginTop: '.4rem' }}>
        <Btn v="plain" icon={Compass} onClick={() => setPick(true)}>ورد من اختياري</Btn>
        <Btn v="plain" icon={Share2} onClick={shareApp}>شارك وِرد</Btn>
      </div>
      <Sheet open={pick} onClose={() => setPick(false)} title="اختر موضع وردك">
        <label className="field" style={{ marginTop: 0 }}><span>السورة</span>
          <select value={pv.s} onChange={(e) => setPv({ s: +e.target.value, a: 1 })}>{NAMES.map((n, k) => <option key={k} value={k + 1}>{ar(k + 1)}. {n}</option>)}</select></label>
        <label className="field"><span>من الآية (١–{ar(ayahCount(pv.s))})</span><input type="number" inputMode="numeric" min="1" max={ayahCount(pv.s)} value={pv.a} onChange={(e) => setPv({ ...pv, a: Math.min(ayahCount(pv.s), Math.max(1, +e.target.value || 1)) })} /></label>
        <p className="muted" style={{ fontSize: '.85rem' }}>عند إتمامه يستمر مسارك من بعده.</p>
        <Btn onClick={startCustom}>ابدأ من هنا</Btn>
      </Sheet>
    </div>
  )
}
