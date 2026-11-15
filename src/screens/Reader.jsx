import { useLayoutEffect, useRef, useState, useMemo } from 'react'
import { Bookmark, Search, X } from 'lucide-react'
import MushafPage from '../components/MushafPage'
import { useMetrics } from '../components/useMetrics'
import { Sheet, Segmented, Item, Btn } from '../components/ui'
import { useStore } from '../store'
import { useUI } from '../ui-store'
import { PAGES, NAMES, TYPES, ayahCount, ar, surahPage, surahOfPage, juzOf, juzPage, JUZ_NAMES } from '../lib/quran'
import { haptic } from '../lib/native'

const norm = (t) => t.replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim()

function Fit({ on, h, dep, children }) {
  const r = useRef(null)
  const [st, setSt] = useState({ k: 1, ph: 0 })
  useLayoutEffect(() => { const e = r.current; if (!e) return; const ph = e.offsetHeight; setSt({ k: on ? Math.min(1, h / ph) : 1, ph }) }, [on, h, dep])
  return <div style={{ height: on ? st.ph * st.k : undefined }}><div ref={r} style={{ transform: on ? `scale(${st.k})` : undefined, transformOrigin: 'top center' }}>{children}</div></div>
}

function NavSheet({ open, onClose, onJump }) {
  const bookmarks = useStore((s) => s.bookmarks)
  const [tab, setTab] = useState('s')
  const [q, setQ] = useState('')
  const [pg, setPg] = useState('')
  const list = useMemo(() => NAMES.map((n, i) => i).filter((i) => !q || norm(NAMES[i]).includes(norm(q)) || String(i + 1) === q), [q])
  return (
    <Sheet open={open} onClose={onClose} title="تنقّل في المصحف">
      <Segmented value={tab} onChange={setTab} options={[{ v: 's', l: 'السور' }, { v: 'j', l: 'الأجزاء' }, { v: 'p', l: 'صفحة' }, { v: 'b', l: 'العلامات' }]} />
      <div style={{ height: '.8rem' }} />
      {tab === 's' && <>
        <label className="field" style={{ marginTop: 0 }}><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن سورة…" /></label>
        <div className="list" style={{ margin: 0 }}>{list.map((i) => (
          <Item key={i} onClick={() => onJump(surahPage(i + 1))} title={<span className="display">{NAMES[i]}</span>} sub={`${TYPES[i]} · ${ar(ayahCount(i + 1))} آية`}
            icon={undefined} right={<span className="muted" style={{ fontSize: '.8rem' }}>ص {ar(surahPage(i + 1) + 1)}</span>} />))}
        </div></>}
      {tab === 'j' && <div className="list" style={{ margin: 0 }}>{JUZ_NAMES.map((n, i) => <Item key={i} onClick={() => onJump(juzPage(i + 1))} title={`الجزء ${n}`} right={<span className="muted" style={{ fontSize: '.8rem' }}>ص {ar(juzPage(i + 1) + 1)}</span>} />)}</div>}
      {tab === 'p' && <div>
        <label className="field" style={{ marginTop: 0 }}><span>رقم الصفحة (١–{ar(PAGES)})</span><input type="number" inputMode="numeric" min="1" max={PAGES} value={pg} onChange={(e) => setPg(e.target.value)} placeholder="مثال: ٨٣" /></label>
        <Btn disabled={!(+pg >= 1 && +pg <= PAGES)} onClick={() => onJump(+pg - 1)}>اذهب</Btn></div>}
      {tab === 'b' && (bookmarks.length ? <div className="list" style={{ margin: 0 }}>{bookmarks.map((p) => <Item key={p} onClick={() => onJump(p - 1)} title={`صفحة ${ar(p)}`} sub={`سورة ${NAMES[surahOfPage(p - 1) - 1]} · الجزء ${ar(juzOf(p - 1))}`} />)}</div>
        : <p className="muted c" style={{ padding: '1.5rem 0' }}>لا علامات بعد. اضغط على أيقونة العلامة أعلى الصفحة لتحفظ موضعك.</p>)}
    </Sheet>
  )
}

export default function Reader() {
  const { lastPage, bookmarks, fitScreen, toggleBookmark } = useStore()
  const { chrome, setChrome } = useUI()
  const [page, setPage] = useState(Math.min(PAGES, Math.max(1, lastPage)) - 1)
  const [nav, setNav] = useState(false)
  const [ref, m] = useMetrics(16)
  const timer = useRef(null)
  useLayoutEffect(() => { if (m && ref.current) ref.current.scrollLeft = -page * m.w }, [m?.w]) // eslint-disable-line
  const onScroll = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => { const i = Math.round(-ref.current.scrollLeft / m.w); if (i >= 0 && i < PAGES && i !== page) { setPage(i); useStore.setState({ lastPage: i + 1 }) } }, 80)
  }
  const jump = (p) => { ref.current.scrollTo({ left: -p * m.w, behavior: 'auto' }); setPage(p); useStore.setState({ lastPage: p + 1 }); setNav(false) }
  const marked = bookmarks.includes(page + 1)
  return (
    <div className="app" style={{ position: 'absolute', inset: 0 }}>
      <div className={'topbar' + (chrome ? '' : ' hide')}>
        <button className="item" style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 18, padding: '.5rem .95rem', minHeight: 0, flex: 1 }} onClick={() => setNav(true)}>
          <Search size={18} className="accent" /><span className="grow"><div className="t">سورة {NAMES[surahOfPage(page) - 1]}</div><div className="s">الجزء {ar(juzOf(page))} · صفحة {ar(page + 1)}</div></span>
        </button>
        <button className={'iconbtn' + (marked ? ' on' : '')} onClick={() => { haptic(); toggleBookmark(page + 1) }} aria-label="علامة"><Bookmark size={20} fill={marked ? 'currentColor' : 'none'} /></button>
      </div>
      <div className="pager" ref={ref} onScroll={m ? onScroll : undefined}>
        {m && Array.from({ length: PAGES }, (_, i) => (
          <div key={i} className="cell" style={{ width: m.w }} onClick={() => setChrome(!chrome)}>
            {Math.abs(i - page) <= 1 && <Fit on={fitScreen} h={m.h - 190} dep={m.fs}><MushafPage p={i} {...m} view={null} /></Fit>}
          </div>))}
      </div>
      <NavSheet open={nav} onClose={() => setNav(false)} onJump={jump} />
    </div>
  )
}
