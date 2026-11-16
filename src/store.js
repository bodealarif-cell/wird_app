import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { dayKey, weekKey, label } from './lib/quran'

export const DEFAULTS = {
  onboarded: false, name: '', age: '', goal: '', cap: 5, days: 7, dir: 'asc', ptr: { s: 1, a: 1 }, log: [], first: 0,
  theme: 'auto', accent: 'teal', scale: 1, paper: 'classic', fitScreen: false, haptics: true, reminder: { on: false, time: '20:00' },
  lastPage: 1, bookmarks: [],
  pending: [], exams: [], examEvery: 2, tafsir: '', tapAyah: true, readerMode: 'flip', zoom: 1,
}
export const useStore = create(persist((set) => ({
  ...DEFAULTS,
  set: (p) => set(p),
  finishOnboarding: (p) => set({ ...p, onboarded: true, first: Math.floor(Date.now() / 864e5) }),
  complete: (items, next) => set((s) => ({ log: [...s.log, { d: dayKey(), w: weekKey(), n: items.length, r: label(items) }], ptr: next, pending: [...s.pending, items] })),
  finishExam: (res) => set((s) => ({ exams: [...s.exams, res], pending: [] })),
  toggleBookmark: (p) => set((s) => ({ bookmarks: s.bookmarks.includes(p) ? s.bookmarks.filter((x) => x !== p) : [...s.bookmarks, p].sort((a, b) => a - b) })),
  resetAll: () => set({ ...DEFAULTS }),
  importState: (o) => set({ ...DEFAULTS, ...o, onboarded: true }),
}), { name: 'wird-v2' }))
export const snapshot = () => { const s = useStore.getState(); return Object.fromEntries(Object.keys(DEFAULTS).map((k) => [k, s[k]])) }
