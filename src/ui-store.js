import { create } from 'zustand'
export const useUI = create((set) => ({
  tab: 'home', wird: null, chrome: true, toast: null,
  setTab: (tab) => set({ tab, chrome: true }),
  openWird: (wird) => set({ wird }), closeWird: () => set({ wird: null }),
  setChrome: (chrome) => set({ chrome }),
  toastMsg: (m) => { set({ toast: m }); setTimeout(() => set({ toast: null }), 2300) },
}))
