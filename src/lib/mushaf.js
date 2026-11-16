import { L, Q, ar } from './quran'
let N = null
const FS = {}
const KEY = 'wird-N-v2'
export const fontReady = () => (document.fonts ? document.fonts.load('100px Hafs').catch(() => {}) : Promise.resolve())
// نقيس عرض كل سطر مرة واحدة بخط المصحف ونخزّنه محليًا، فيفتح المصحف فورًا في المرات التالية
export async function loadMetrics() {
  if (N) return N
  await fontReady()
  try { const c = localStorage.getItem(KEY); if (c) { N = JSON.parse(c); return N } } catch { /* ignore */ }
  const c = document.createElement('canvas').getContext('2d'); c.font = '100px Hafs'
  const m = new Map(); const w = (t) => { let v = m.get(t); if (v === undefined) { v = c.measureText(t).width; m.set(t, v) } return v }
  N = L.map((pl) => pl.map((l) => {
    if (l[0] !== 0) return 0
    let tot = 0, n = 0
    for (const [s, a, w1, w2] of l[1]) { const ws = Q.a[s - 1][a - 1]; for (let k = w1; k <= w2; k++) { tot += w(ws[k - 1]); n++; if (k === ws.length) tot += 12 + w(ar(a)) } }
    return Math.round((tot + (n - 1) * 30) * 10) / 10
  }))
  try { localStorage.setItem(KEY, JSON.stringify(N)) } catch { /* ignore */ }
  return N
}
export const lineWidths = (p) => N[p]
export function fitFs(inner) {
  const k = Math.round(inner)
  if (FS[k]) return FS[k]
  const all = []; N.forEach((p) => p.forEach((x) => x > 0 && all.push(x))); all.sort((a, b) => b - a)
  return (FS[k] = Math.min(46, (inner * 100) / all[Math.floor(all.length * 0.03)]))
}
export function dims(avail, zoom = 1) {
  const outer = Math.round(Math.min(Math.floor(avail), 580) * zoom)
  const band = Math.max(10, Math.round(outer * 0.04)), pad = Math.round(outer * 0.018)
  return { outer, band, pad, inner: outer - 2 * (band + 1 + pad) }
}
// ارتفاع الصفحة بالبكسل (يطابق الـCSS تمامًا) لاستخدامه في التمرير الافتراضي
export const pageHeight = (p, fs, band) => Math.round((L[p].length * 2.02 + 4.05) * fs + 2 + 2 * band)
