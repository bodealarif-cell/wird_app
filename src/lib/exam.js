import { words } from './quran'
// تجاهل التشكيل وعلامات التلاوة، وتوحيد صور الألف والهمزات والياء والتاء المربوطة
const MARKS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED\u0640\u08D3-\u08FF\u200C-\u200F]/g
const norm1 = (c) => {
  c = c.replace(MARKS, '')
  if (!c) return ''
  c = c.replace(/[أإآٱ]/g, 'ا').replace('ؤ', 'و').replace('ئ', 'ي').replace(/[ىی]/g, 'ي').replace('ة', 'ه').replace('ک', 'ك').replace('ء', '')
  return /[\u0621-\u064A]/.test(c) ? c : ''
}
export const norm = (t) => [...t].map(norm1).join('')

// التقدير = الحروف الصحيحة (بأطول تتابع مشترك) ÷ الأكبر من عدد حروف الأصل وحروفك. فيُخصم النقص والزيادة معًا
export function grade(expected, typed) {
  const E = [], map = []
  for (const c of expected) {
    if (c === '\u0670') { map.push(E.length); E.push({ ch: 'ا', opt: true }); continue } // الألف الخنجرية: اختيارية
    const n = norm1(c)
    if (n) { map.push(E.length); E.push({ ch: n, opt: false }) } else map.push(-1)
  }
  const T = [...norm(typed)]
  const n = E.length, m = T.length
  const dp = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1))
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) dp[i][j] = E[i - 1].ch === T[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1])
  const hit = new Array(n).fill(false)
  let i = n, j = m
  while (i > 0 && j > 0) { if (E[i - 1].ch === T[j - 1]) { hit[i - 1] = true; i--; j-- } else if (dp[i - 1][j] >= dp[i][j - 1]) i--; else j-- }
  const M = dp[n][m]
  const eff = n - E.filter((e, k) => e.opt && !hit[k]).length
  const den = Math.max(eff, m)
  const acc = den === 0 ? 1 : Math.min(1, M / den)
  const parts = []
  let last = 'ok'
  ;[...expected].forEach((c, k) => {
    const idx = map[k]
    const st = idx < 0 ? last : hit[idx] ? 'ok' : E[idx].opt ? 'opt' : 'bad'
    last = st; parts.push({ c, st })
  })
  return { acc, parts, right: M, total: eff }
}

const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]] } return a }
// لكل ٥ آيات متتالية من الوردين: آيتان عشوائيتان. نعرض بداية الآية ويكتب الطالب الباقي
export function buildExam(pending) {
  const seen = new Set(), list = []
  pending.flat().forEach(([s, a]) => { const k = s * 1000 + a; if (!seen.has(k)) { seen.add(k); list.push([s, a]) } })
  const qs = []
  for (let i = 0; i < list.length; i += 5) {
    const chunk = list.slice(i, i + 5)
    const k = Math.max(1, Math.round((chunk.length * 2) / 5))
    const pool = chunk.filter(([s, a]) => words(s, a).length >= 2)
    shuffle(pool.length >= k ? pool : chunk).slice(0, k).forEach(([s, a]) => qs.push([s, a]))
  }
  return shuffle(qs).map(([s, a]) => {
    const units = words(s, a), n = units.length
    const cut = n >= 2 ? Math.min(n - 1, Math.max(1, Math.round(n * 0.4))) : 0
    return { s, a, shown: units.slice(0, cut).join(' '), rest: units.slice(cut).join(' ') }
  })
}
