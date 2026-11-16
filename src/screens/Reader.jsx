import { useRef, useState, useLayoutEffect, useMemo } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Bookmark, Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import MushafPage from '../components/MushafPage'
import FlipPager from '../components/FlipPager'
import ScrollPager from '../components/ScrollPager'
import TafsirPanel from '../components/TafsirPanel'
import { useMetrics } from '../components/useMetrics'
import { Sheet, Segmented, Item, Btn, Toggle } from '../components/ui'
import { useStore } from '../store'
import { useUI } from '../ui-store'
import { TAFSIRS } from '../lib/tafsir'
import { PAGES, NAMES, TYPES, ayahCount, ar, surahPage, surahOfPage, juzOf, juzPage, JUZ_NAMES, pageRange } from '../lib/quran'
import { haptic } from '../lib/native'

const norm = (t) => t.replace(/[\u064B-\u065F\u0670\u0640]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').trim()

function Fit({ on, h, dep, children }) {
  const r = useRef(null)
  const [st, setSt] = useState({ k: 1, ph: 0 })
  useLayoutEffect(() => { const e = r.current; if (!e) return; const ph = e.offsetHeight; setSt({ k: on ? Math.min(1, h / ph) : 1, ph }) }, [on, h, dep, children])
  return <div style={{ height: on ? st.ph * st.k : undefined }}><div ref={r} style={{ transform: on ? `scale(${st.k})` : undefined, transformOrigin: 'top center' }}>{children}</div></div>
}

function NavSheet({ open, onClose, onJump }) {
  const bookmarks = useStore((s) => s.bookmarks)
  const [tab, setTab] = useState('s'), [q, setQ] = useState(''), [pg, setPg] = useState('')
  const list = useMemo(() => NAMES.map((n, i) => i).filter((i) => !q || norm(NAMES[i]).includes(norm(q)) || String(i + 1) === q), [q])
  return (
    <Sheet open={open} onClose={onClose} title="تنقّل في المصحف">
      <Segmented value={tab} onChange={setTab} options={[{ v: 's', l: 'السور' }, { v: 'j', l: 'الأجزاء' }, { v: 'p', l: 'صفحة' }, { v: 'b', l: 'العلامات' }]} />
      <div style={{ height: '.8rem' }} />
      {tab === 's' && <>
        <label className="field" style={{ marginTop: 0 }}><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحث عن سورة…" /></label>
        <div className="list" style={{ margin: 0 }}>{list.map((i) => <Item key={i} onClick={() => onJump(surahPage(i + 1))} title={<span className="display">{NAMES[i]}</span>} sub={`${TYPES[i]} · ${ar(ayahCount(i + 1))} آية`} right={<span className="muted" style={{ fontSize: '.8rem' }}>ص {ar(surahPage(i + 1) + 1)}</span>} />)}</div></>}
      {tab === 'j' && <div className="list" style={{ margin: 0 }}>{JUZ_NAMES.map((n, i) => <Item key={i} onClick={() => onJump(juzPage(i + 1))} title={`الجزء ${n}`} right={<span className="muted" style={{ fontSize: '.8rem' }}>ص {ar(juzPage(i + 1) + 1)}</span>} />)}</div>}
      {tab === 'p' && <div><label className="field" style={{ marginTop: 0 }}><span>رقم الصفحة (١–{ar(PAGES)})</span><input type="number" inputMode="numeric" min="1" max={PAGES} value={pg} onChange={(e) => setPg(e.target.value)} placeholder="مثال: ٨٣" /></label><Btn disabled={!(+pg >= 1 && +pg <= PAGES)} onClick={() => onJump(+pg - 1)}>اذهب</Btn></div>}
      {tab === 'b' && (bookmarks.length ? <div className="list" style={{ margin: 0 }}>{bookmarks.map((p) => <Item key={p} onClick={() => onJump(p - 1)} title={`صفحة ${ar(p)}`} sub={`سورة ${NAMES[surahOfPage(p - 1) - 1]} · الجزء ${ar(juzOf(p - 1))}`} />)}</div> : <p className="muted c" style={{ padding: '1.5rem 0' }}>لا علامات بعد. اضغط أيقونة العلامة أعلى الصفحة لتحفظ موضعك.</p>)}
    </Sheet>
  )
}

function ViewSheet({ open, onClose }) {
  const s = useStore(), set = s.set
  return (
    <Sheet open={open} onClose={onClose} title="إعدادات القراءة">
      <div className="stack">
        <div><div className="eyebrow" style={{ marginBottom: '.4rem' }}>طريقة عرض الصفحات</div>
          <Segmented value={s.readerMode} onChange={(readerMode) => set({ readerMode })} options={[{ v: 'flip', l: 'صفحات (قلب الصفحة)' }, { v: 'scroll', l: 'تمرير عمودي' }]} /></div>
        <div><div className="row sp"><span className="eyebrow">حجم الصفحة والخط</span><b className="accent">{ar(Math.round(s.zoom * 100))}٪</b></div>
          <input className="range" type="range" min="0.8" max="1.6" step="0.05" value={s.zoom} onChange={(e) => set({ zoom: +e.target.value })} />
          {s.zoom > 1 && <div className="muted" style={{ fontSize: '.78rem' }}>عند التكبير يمكنك تحريك الصفحة يمينًا ويسارًا، وتُستخدم أزرار الأسهم للتقليب.</div>}</div>
        <div><div className="eyebrow" style={{ marginBottom: '.4rem' }}>ورقة المصحف</div>
          <Segmented value={s.paper} onChange={(paper) => set({ paper })} options={[{ v: 'classic', l: 'كلاسيكي' }, { v: 'cream', l: 'كريمي' }, { v: 'night', l: 'ليلي' }, { v: 'auto', l: 'تلقائي' }]} /></div>
        <div className="list" style={{ margin: 0 }}>
          {s.readerMode === 'flip' && <Item title="ملاءمة الصفحة للشاشة" sub="تصغير الصفحة لتظهر كاملة دون تمرير" right={<Toggle on={s.fitScreen} onChange={(fitScreen) => set({ fitScreen })} />} />}
          <Item title="التفسير عند لمس الآية" sub={TAFSIRS.length ? 'يظهر لوح التفسير فوق الصفحة' : 'لا توجد تفاسير مضافة بعد'} right={<Toggle on={s.tapAyah} onChange={(tapAyah) => set({ tapAyah })} />} />
        </div>
        {TAFSIRS.length > 0 && <div><div className="eyebrow" style={{ marginBottom: '.4rem' }}>التفسير المختار</div><div className="chips">{TAFSIRS.map((t) => <button key={t.id} className={'chip' + ((s.tafsir || TAFSIRS[0].id) === t.id ? ' on' : '')} onClick={() => set({ tafsir: t.id })}>{t.name}</button>)}</div></div>}
      </div>
    </Sheet>
  )
}

export default function Reader() {
  const { lastPage, bookmarks, fitScreen, toggleBookmark, readerMode, zoom, tapAyah } = useStore()
  const { chrome, setChrome, openTafsir } = useUI()
  const [page, setPage] = useState(Math.min(PAGES, Math.max(1, lastPage)) - 1)
  const [nav, setNav] = useState(false), [view, setView] = useState(false), [sel, setSel] = useState(null), [jk, setJk] = useState(0)
  const [ref, m] = useMetrics(16, zoom)
  const change = (p) => { setPage(p); useStore.setState({ lastPage: p + 1 }) }
  const jump = (p) => { change(p); setJk((k) => k + 1); setNav(false) }
  const marked = bookmarks.includes(page + 1)
  const canTap = tapAyah && TAFSIRS.length > 0
  const selKey = sel ? sel.s + ':' + sel.a : null
  const renderPage = (q) => <Fit on={readerMode === 'flip' && fitScreen && zoom <= 1} h={(m?.h || 0) - 200} dep={m?.fs}><MushafPage p={q} {...m} view={null} sel={selKey} onAyah={canTap ? (s, a) => { haptic(); setSel({ s, a }) } : undefined} /></Fit>
  const nav2 = (s, a) => { setSel({ s, a }); const pr = pageRange(s, a)[0]; if (pr !== page) { change(pr); setJk((k) => k + 1) } }
  const flipArrows = readerMode === 'flip' && zoom > 1
  return (
    <div className="app" style={{ position: 'absolute', inset: 0 }}>
      <div className={'topbar' + (chrome ? '' : ' hide')}>
        <button className="item glass" style={{ borderRadius: 20, padding: '.5rem .95rem', minHeight: 0, flex: 1, width: 'auto' }} onClick={() => setNav(true)}>
          <Search size={18} className="accent" /><span className="grow"><div className="t">سورة {NAMES[surahOfPage(page) - 1]}</div><div className="s">الجزء {ar(juzOf(page))} · صفحة {ar(page + 1)}</div></span>
        </button>
        {flipArrows && <><button className="iconbtn glass" onClick={() => page < PAGES - 1 && change(page + 1)} aria-label="التالية"><ChevronLeft size={20} /></button><button className="iconbtn glass" onClick={() => page > 0 && change(page - 1)} aria-label="السابقة"><ChevronRight size={20} /></button></>}
        <button className="iconbtn glass" onClick={() => setView(true)} aria-label="إعدادات القراءة"><SlidersHorizontal size={19} /></button>
        <button className={'iconbtn glass' + (marked ? ' on' : '')} onClick={() => { haptic(); toggleBookmark(page + 1) }} aria-label="علامة"><Bookmark size={20} fill={marked ? 'currentColor' : 'none'} /></button>
      </div>
      <div ref={ref} style={{ flex: 1, minHeight: 0, display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
        {m && (readerMode === 'flip'
          ? <FlipPager page={page} count={PAGES} onPage={change} renderPage={renderPage} w={m.w} h={m.h} disabled={zoom > 1} onTap={() => setChrome(!chrome)} />
          : <ScrollPager page={page} count={PAGES} onPage={change} renderPage={renderPage} w={m.w} h={m.h} fs={m.fs} band={m.band} jumpKey={jk} onTap={() => setChrome(!chrome)} />)}
      </div>
      <NavSheet open={nav} onClose={() => setNav(false)} onJump={jump} />
      <ViewSheet open={view} onClose={() => setView(false)} />
      <AnimatePresence>{sel && <TafsirPanel key="tp" s={sel.s} a={sel.a} onClose={() => setSel(null)} onNav={nav2} onFull={() => { const t = sel; setSel(null); openTafsir(t) }} />}</AnimatePresence>
    </div>
  )
}
