import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { Share } from '@capacitor/share'
import { StatusBar, Style } from '@capacitor/status-bar'
import { SplashScreen } from '@capacitor/splash-screen'
import { App as CapApp } from '@capacitor/app'
import { LocalNotifications } from '@capacitor/local-notifications'
import { SHARE_URL } from '../config'

export const isNative = Capacitor.isNativePlatform()
let hapticsOn = true
export const setHapticsOn = (v) => { hapticsOn = v }
export const haptic = async (kind = 'light') => {
  if (!hapticsOn) return
  try {
    if (isNative) await Haptics.impact({ style: kind === 'heavy' ? ImpactStyle.Heavy : kind === 'medium' ? ImpactStyle.Medium : ImpactStyle.Light })
    else navigator.vibrate?.(kind === 'heavy' ? 18 : 8)
  } catch { /* ignore */ }
}
export const shareApp = async () => {
  const text = 'وِرد: تطبيق يخفي المصحف كله ويُبقي لك ورد اليوم فقط، لتحفظ القرآن بتركيز.'
  const url = SHARE_URL.includes('YOUR-USER') ? undefined : SHARE_URL
  try { await Share.share({ title: 'وِرد', text, url, dialogTitle: 'شارك وِرد' }); return true } catch { return false }
}
export const setBars = async (dark, color) => {
  if (!isNative) { document.querySelector('meta[name=theme-color]')?.setAttribute('content', color); return }
  try { await StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light }); await StatusBar.setBackgroundColor({ color }) } catch { /* ignore */ }
}
export const hideSplash = () => { if (isNative) SplashScreen.hide().catch(() => {}) }
export const onBack = (fn) => { if (!isNative) return () => {}; const h = CapApp.addListener('backButton', fn); return () => h.then((x) => x.remove()) }
export const exitApp = () => CapApp.exitApp()
export const setReminder = async (on, time) => {
  if (!isNative) return on ? 'web' : 'ok'
  try {
    await LocalNotifications.cancel({ notifications: [{ id: 1 }] })
    if (!on) return 'ok'
    const p = await LocalNotifications.requestPermissions()
    if (p.display !== 'granted') return 'denied'
    const [hour, minute] = time.split(':').map(Number)
    await LocalNotifications.schedule({ notifications: [{ id: 1, title: 'وِرد', body: 'حان وقت وردك اليوم. دقائق قليلة بقلب حاضر.', schedule: { on: { hour, minute }, allowWhileIdle: true } }] })
    return 'ok'
  } catch { return 'error' }
}
export const shareText = async (title, text) => { try { await Share.share({ title, text, dialogTitle: title }); return true } catch { try { await navigator.clipboard.writeText(text); return 'copied' } catch { return false } } }
