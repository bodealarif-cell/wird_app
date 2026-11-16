import { useEffect, useRef, useState } from 'react'
import { Library } from 'lucide-react'
import { useStore } from '../store'
import { useUI } from '../ui-store'
import { TAFSIRS, tafsirSurah } from '../lib/tafsir'
import { NAMES, ayahCount, ar } from '../lib/quran'
import { ayahText } from '../components/TafsirPanel'

export default function Tafsir() {
  const { tafsir, set } = useStore()
  const target = useUI((u) => u.tafsirTarget)
  const id = TAFSIRS.find((t) => t.id === tafsir)?.id || TAFSIRS[0]?.id
  const [s, setS] = useState(target?.s || 1)
  const [list, setList] = useState([]), [shown, setShown] = useState(25)
  const end = useRef(null)
  useEffect(() => {
    if (!id) return
    let ok = true
    tafsirSurah(id, s).then((l) => { if (ok) { setList(l); setShown(target && target.s === s ? Math.max(25, target.a + 8) : 25) } })
    return () => { ok = false }
  }, [id, s]) // eslint-disable-line
  useEffect(() => { if (target && target.s === s && list.length) setTimeout(() => document.getElementById('ay-' + target.a)?.scrollIntoView({ block: 'start' }), 80) }, [list]) // eslint-disable-line
  useEffect(() => {
    const el = end.current; if (!el) return
    const io = new IntersectionObserver((e) => e[0].isIntersecting && setShown((n) => n + 25), { rootMargin: '400px' })
    io.observe(el); return () => io.disconnect()
  }, [list, shown])
  if (!TAFSIRS.length) return (
    <div className="screen"><h1 className="display" style={{ fontSize: '2rem', margin: '.2rem 0 .6rem' }}>التفسير</h1>
      <div className="card c"><Library size={34} className="accent" style={{ margin: '0 auto' }} /><div className="display" style={{ fontSize: '1.2rem', margin: '.6rem 0 .3rem' }}>لا توجد تفاسير بعد</div><p className="muted" style={{ margin: 0 }}>ستظهر هنا كتب التفسير المضافة، وتقرأها منفردة أو تفتحها من المصحف بلمس الآية.</p></div></div>
  )
  const n = ayahCount(s)
  return (
    <div className="screen">
      <h1 className="display" style={{ fontSize: '2rem', margin: '.2rem 0 .6rem' }}>التفسير</h1>
      <div className="chips" style={{ flexWrap: 'nowrap', overflowX: 'auto', marginBottom: '.6rem' }}>{TAFSIRS.map((t) => <button key={t.id} className={'chip' + (t.id === id ? ' on' : '')} style={{ flex: 'none' }} onClick={() => set({ tafsir: t.id })}>{t.name}</button>)}</div>
      <label className="field" style={{ marginTop: 0 }}><select value={s} onChange={(e) => { setS(+e.target.value); useUI.setState({ tafsirTarget: null }) }}>{NAMES.map((nm, k) => <option key={k} value={k + 1}>{ar(k + 1)}. سورة {nm}</option>)}</select></label>
      {Array.from({ length: Math.min(n, shown) }, (_, k) => (
        <div key={k} id={'ay-' + (k + 1)} className="card" style={{ margin: '.6rem 0' }}>
          <div className="tayah" style={{ fontSize: '1.4rem' }}>{ayahText(s, k + 1)} <span style={{ fontSize: '.85em' }}>{ar(k + 1)}</span></div>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: 2, userSelect: 'text' }}>{list[k] || <span className="muted">لا يوجد تفسير لهذه الآية في هذا الكتاب.</span>}</div>
        </div>))}
      {shown < n && <div ref={end} className="c muted" style={{ padding: '1rem' }}>…</div>}
    </div>
  )
}
