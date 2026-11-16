import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { pageHeight } from '../lib/mushaf'

const TOP = 78, BOTTOM = 120, GAP = 18
// تمرير عمودي سلس لكل المصحف: نرسم صفحات النافذة الحالية فقط ونحسب مواضع الباقي من ارتفاعاتها
export default function ScrollPager({ page, count, onPage, renderPage, w, h, fs, band, jumpKey, onTap }) {
  const ref = useRef(null), raf = useRef(0)
  const [cur, setCur] = useState(page)
  const pre = useMemo(() => { const a = [0]; for (let p = 0; p < count; p++) a.push(a[p] + pageHeight(p, fs, band) + GAP); return a }, [fs, band, count])
  useLayoutEffect(() => { if (ref.current) ref.current.scrollTop = pre[page]; setCur(page) }, [jumpKey, w, pre]) // eslint-disable-line
  const onScroll = () => {
    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      const y = ref.current.scrollTop + h * 0.3 - TOP
      let lo = 0, hi = count - 1
      while (lo < hi) { const m = (lo + hi + 1) >> 1; if (pre[m] <= y) lo = m; else hi = m - 1 }
      if (lo !== cur) { setCur(lo); onPage(lo) }
    })
  }
  const a = Math.max(0, cur - 1), b = Math.min(count - 1, cur + 2), out = []
  for (let p = a; p <= b; p++) out.push(<div key={p} style={{ height: pageHeight(p, fs, band), marginBottom: GAP }}>{renderPage(p)}</div>)
  return (
    <div ref={ref} className="vscroll" style={{ height: h, width: w }} onScroll={onScroll} onClick={onTap}>
      <div style={{ height: pre[count] + TOP + BOTTOM, position: 'relative', minWidth: '100%' }}>
        <div style={{ position: 'absolute', top: TOP + pre[a], left: 0, right: 0 }}>{out}</div>
      </div>
    </div>
  )
}
