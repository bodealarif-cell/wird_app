// يحوّل ملف تفسير شائع الصيغ إلى صيغة وِرد. الاستعمال:
// node scripts/import-tafsir.mjs input.json muyassar "التفسير الميسر" "مجمع الملك فهد"
import fs from 'fs'
const [, , inp, id, name = id, author = ''] = process.argv
if (!inp || !id) { console.log('الاستعمال: node scripts/import-tafsir.mjs input.json id "الاسم" "المؤلف"'); process.exit(1) }
let raw = JSON.parse(fs.readFileSync(inp, 'utf8').replace(/^\uFEFF/, ''))
const t = {}
const put = (s, a, txt) => { (t[s] ||= [])[a - 1] = txt }
if (Array.isArray(raw)) {
  // [{sura|surah|chapter, aya|ayah|verse, text|tafsir}] أو [{id, verses:[...]}]
  for (const r of raw) {
    if (r.verses) r.verses.forEach((v, i) => put(r.id ?? r.sura, v.id ?? i + 1, v.text ?? v.tafsir ?? v))
    else put(+(r.sura ?? r.surah ?? r.chapter), +(r.aya ?? r.ayah ?? r.verse), r.text ?? r.tafsir ?? r.content)
  }
} else if (raw.t) Object.assign(t, raw.t)
else {
  // { "1:1": "..." } أو { "1": { "1": "..." } }
  for (const [k, v] of Object.entries(raw)) {
    if (k.includes(':')) { const [s, a] = k.split(':').map(Number); put(s, a, v) }
    else if (v && typeof v === 'object') Object.entries(v).forEach(([a, txt]) => put(+k, +a, txt))
  }
}
for (const s of Object.keys(t)) t[s] = Array.from(t[s], (x) => x ?? '')
fs.mkdirSync('src/data/tafsir', { recursive: true })
fs.writeFileSync(`src/data/tafsir/${id}.json`, JSON.stringify({ meta: { name, author }, t }))
console.log(`تم: ${Object.keys(t).length} سورة → src/data/tafsir/${id}.json`)
