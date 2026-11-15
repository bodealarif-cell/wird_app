import { L, Q, ar } from './quran'
let N = null
const FS = {}
// نقيس عرض كل سطر مرة واحدة بخط المصحف نفسه، فنحسب حجم خط موحّد لكل الصفحات دون قياس DOM
export async function loadMetrics() {
  if (N) return N
  try { await document.fonts.load('100px Hafs'); await document.fonts.ready } catch { /* ignore */ }
  const c = document.createElement('canvas').getContext('2d'); c.font = '100px Hafs'
  const m = new Map(); const w = (t) => { let v = m.get(t); if (v === undefined) { v = c.measureText(t).width; m.set(t, v) } return v }
  N = L.map((pl) => pl.map((l) => {
    if (l[0] !== 0) return 0
    let tot = 0, n = 0
    for (const [s, a, w1, w2] of l[1]) { const ws = Q.a[s - 1][a - 1]; for (let k = w1; k <= w2; k++) { tot += w(ws[k - 1]); n++; if (k === ws.length) tot += 12 + w(ar(a)) } }
    return tot + (n - 1) * 30
  }))
  return N
}
export const lineWidths = (p) => N[p]
export function fitFs(inner) {
  const k = Math.round(inner)
  if (FS[k]) return FS[k]
  const all = []; N.forEach((p) => p.forEach((x) => x > 0 && all.push(x))); all.sort((a, b) => b - a)
  return (FS[k] = Math.min(40, (inner * 100) / all[Math.floor(all.length * 0.03)]))
}
export function dims(avail) {
  const outer = Math.min(Math.floor(avail), 580)
  const band = Math.max(9, Math.round(outer * 0.034)), pad = Math.round(outer * 0.016)
  return { outer, band, pad, inner: outer - 2 * (band + 1 + pad) }
}
