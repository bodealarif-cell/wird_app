import { create } from 'zustand'
let n = 0
export const useUI = create((set) => ({
  tab: 'home', wird: null, exam: null, chrome: true, banner: null, tafsirTarget: null,
  setTab: (tab) => set({ tab, chrome: true }),
  openWird: (wird) => set({ wird }), closeWird: () => set({ wird: null }),
  openExam: (exam) => set({ exam }), closeExam: () => set({ exam: null }),
  setChrome: (chrome) => set({ chrome }),
  openTafsir: (tafsirTarget) => set({ tafsirTarget, tab: 'tafsir', chrome: true }),
  toastMsg: (msg, title = 'وِرد') => { const id = ++n; set({ banner: { id, title, msg } }); setTimeout(() => set((s) => (s.banner && s.banner.id === id ? { banner: null } : s)), 3400) },
  dismissBanner: () => set({ banner: null }),
}))
