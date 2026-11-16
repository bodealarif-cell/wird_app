import { useLayoutEffect, useRef, useState } from 'react'
import { loadMetrics, fitFs, dims } from '../lib/mushaf'
export function useMetrics(margin = 16, zoom = 1) {
  const ref = useRef(null)
  const [m, setM] = useState(null)
  useLayoutEffect(() => {
    const el = ref.current; let alive = true
    const calc = async () => {
      await loadMetrics(); if (!alive || !el) return
      const w = el.clientWidth, h = el.clientHeight; if (!w) return
      const d = dims(w - margin, zoom); setM({ ...d, fs: fitFs(d.inner), w, h })
    }
    calc(); const ro = new ResizeObserver(calc); ro.observe(el)
    return () => { alive = false; ro.disconnect() }
  }, [margin, zoom])
  return [ref, m]
}
