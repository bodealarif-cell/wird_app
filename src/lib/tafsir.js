// التفاسير ملفات JSON في src/data/tafsir (انظر README هناك). تُحمَّل عند الحاجة فقط ليبقى التطبيق خفيفًا
const metas = import.meta.glob('../data/tafsir/*.json', { eager: true, import: 'meta' })
const loaders = import.meta.glob('../data/tafsir/*.json', { import: 't' })
export const TAFSIRS = Object.entries(metas).map(([p, m]) => ({ id: p.split('/').pop().replace('.json', ''), ...m }))
const cache = {}
const strip = (t) => String(t || '').replace(/<[^>]+>/g, '')
async function load(id) {
  if (!cache[id]) {
    const f = Object.entries(loaders).find(([p]) => p.endsWith('/' + id + '.json'))
    cache[id] = f ? await f[1]() : {}
  }
  return cache[id]
}
export const tafsirOf = async (id, s, a) => strip(((await load(id))[s] || [])[a - 1])
export const tafsirSurah = async (id, s) => ((await load(id))[s] || []).map(strip)
