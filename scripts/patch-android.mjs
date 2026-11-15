// يُشغَّل تلقائيًا أثناء البناء: يضيف أذونات الإشعارات ويثبّت اتجاه الشاشة عموديًا
import fs from 'fs'
const p = 'android/app/src/main/AndroidManifest.xml'
let s = fs.readFileSync(p, 'utf8')
if (!s.includes('POST_NOTIFICATIONS')) s = s.replace('</manifest>', '    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />\n    <uses-permission android:name="android.permission.VIBRATE" />\n</manifest>')
if (!s.includes('screenOrientation')) s = s.replace('android:launchMode="singleTask"', 'android:launchMode="singleTask"\n            android:screenOrientation="portrait"')
fs.writeFileSync(p, s)
console.log('manifest patched')
