import Q from '../data/quran.json'
import L from '../data/layout.json'
import META from '../data/meta.json'

export { Q, L }
export const NAMES = Q.n
export const TYPES = META.t
export const PAGES = L.length
export const ar = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d])
export const ayahCount = (s) => Q.a[s - 1].length
export const words = (s, a) => Q.a[s - 1][a - 1]
export const BASMALA = Q.a[0][0].join(' ')

const PG = {}
L.forEach((pl, pi) => pl.forEach((l) => { if (l[0] === 0) l[1].forEach((r) => { const k = r[0] * 1000 + r[1]; const e = PG[k]; if (e) e[1] = pi; else PG[k] = [pi, pi] }) }))
export const pageRange = (s, a) => PG[s * 1000 + a]
const SP = []
for (let s = 1; s <= 114; s++) SP[s] = PG[s * 1000 + 1][0]
export const surahPage = (s) => SP[s]

export const JUZ_NAMES = ['الأول','الثاني','الثالث','الرابع','الخامس','السادس','السابع','الثامن','التاسع','العاشر','الحادي عشر','الثاني عشر','الثالث عشر','الرابع عشر','الخامس عشر','السادس عشر','السابع عشر','الثامن عشر','التاسع عشر','العشرون','الحادي والعشرون','الثاني والعشرون','الثالث والعشرون','الرابع والعشرون','الخامس والعشرون','السادس والعشرون','السابع والعشرون','الثامن والعشرون','التاسع والعشرون','الثلاثون']
export const juzOf = (p) => { const n = p + 1; return n < 22 ? 1 : Math.min(30, 2 + Math.floor((n - 22) / 20)) }
export const juzPage = (j) => (j === 1 ? 0 : 21 + (j - 2) * 20)
export const surahOfPage = (p) => { const l = L[p].find((x) => x[0] === 0); return l ? l[1][0][0] : 1 }

// الورد: نأخذ n آية بدءًا من المؤشر. في الاتجاه النازل تنتقل السور نزولًا وتبقى الآيات داخل السورة بترتيبها
export function take(s, a, n, dir) {
  const it = []
  while (it.length < n && s >= 1 && s <= 114) {
    it.push([s, a]); a++
    if (a > ayahCount(s)) { s += dir === 'asc' ? 1 : -1; a = 1 }
  }
  return { it, next: s < 1 || s > 114 ? null : { s, a } }
}
export function label(it) {
  const g = []
  it.forEach(([s, a]) => { const l = g[g.length - 1]; if (l && l.s === s) l.b = a; else g.push({ s, a, b: a }) })
  return g.map((x) => `${NAMES[x.s - 1]} ${x.a === x.b ? ar(x.a) : ar(x.a) + '–' + ar(x.b)}`).join(' ثم ')
}
export const wirdPages = (it) => {
  let p1 = 1e9, p2 = 0
  it.forEach(([s, a]) => { const e = PG[s * 1000 + a]; p1 = Math.min(p1, e[0]); p2 = Math.max(p2, e[1]) })
  return [p1, p2]
}

const pad = (n) => String(n).padStart(2, '0')
export const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const weekKey = (d = new Date()) => { const x = new Date(d); x.setDate(x.getDate() - ((x.getDay() + 1) % 7)); return dayKey(x) } // الأسبوع يبدأ السبت
export const weekDays = () => { const x = new Date(); x.setDate(x.getDate() - ((x.getDay() + 1) % 7)); return Array.from({ length: 7 }, (_, i) => { const d = new Date(x); d.setDate(x.getDate() + i); return dayKey(d) }) }
export const DAY_LABELS = ['س', 'ح', 'ن', 'ث', 'ر', 'خ', 'ج']
export const hijri = () => { try { return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date()) } catch { return '' } }

export const GREETINGS = [
  'كل حرف من القرآن بعشر حسنات، فاغتنم يا {n}',
  'الماهر بالقرآن مع الملائكة الكرام البررة، فلا تتوقف يا {n}',
  'خيركم من تعلّم القرآن وعلّمه، فاثبت يا {n}',
  'يا {n}، ورد صغير يدوم خير من كثير ينقطع',
  'أهلًا يا {n}، دقائق هادئة مع كلام ربك تكفي لتبدأ يومك',
  'اقرأ وارتقِ يا {n}، فكل آية تحفظها درجة تصعدها',
  'بارك الله في وقتك يا {n}، ابدأ بورد اليوم وأقبل بقلبك',
  'مرحبًا يا {n}، قلب حاضر في آيات قليلة خير من ساعات مشتتة',
]
export const greeting = (first) => GREETINGS[Math.max(0, Math.floor(Date.now() / 864e5) - (first || 0)) % GREETINGS.length]
