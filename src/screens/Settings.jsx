import { useState } from 'react'
import { User, Target, Palette, Type, Bell, Download, Upload, Trash2, Info, Share2, Maximize2, Vibrate, Pencil, CalendarDays, ArrowDownUp } from 'lucide-react'
import { Sheet, Segmented, Toggle, Item, Btn } from '../components/ui'
import { Mark } from '../components/Logo'
import { useStore, snapshot } from '../store'
import { useUI } from '../ui-store'
import { ACCENTS, PAPERS } from '../lib/theme'
import { ar } from '../lib/quran'
import { haptic, shareApp, shareText, setReminder } from '../lib/native'
import { VERSION } from '../config'

const Mini = ({ v, min, max, on }) => (
  <div className="row" style={{ gap: '.5rem' }}>
    <button className="iconbtn" style={{ width: '2.2rem', height: '2.2rem', borderRadius: 12 }} onClick={() => { haptic(); on(Math.min(max, v + 1)) }} aria-label="زيادة">+</button>
    <b className="display" style={{ minWidth: '1.6rem', textAlign: 'center', fontSize: '1.2rem' }}>{ar(v)}</b>
    <button className="iconbtn" style={{ width: '2.2rem', height: '2.2rem', borderRadius: 12 }} onClick={() => { haptic(); on(Math.max(min, v - 1)) }} aria-label="إنقاص">−</button>
  </div>
)
const Sec = ({ children }) => <div className="sec">{children}</div>

export default function Settings() {
  const s = useStore()
  const toast = useUI((u) => u.toastMsg)
  const [sheet, setSheet] = useState(null)
  const [paste, setPaste] = useState('')
  const set = s.set
  const remind = async (on, time) => {
    const r = await setReminder(on, time)
    if (r === 'denied') { toast('لم يُمنح إذن الإشعارات'); set({ reminder: { on: false, time } }); return }
    if (r === 'web') toast('التذكير يعمل داخل تطبيق أندرويد فقط')
    else if (r === 'error') toast('تعذّر ضبط التذكير')
    else if (on) toast('تم ضبط التذكير اليومي')
    set({ reminder: { on, time } })
  }
  const backup = async () => { const r = await shareText('نسخة وِرد الاحتياطية', JSON.stringify(snapshot())); if (r === 'copied') toast('تم نسخ النسخة الاحتياطية') }
  const restore = () => { try { const o = JSON.parse(paste); if (typeof o !== 'object' || !o || !('cap' in o)) throw 0; s.importState(o); setSheet(null); setPaste(''); toast('تمت الاستعادة') } catch { toast('النص غير صالح') } }
  return (
    <div className="screen">
      <h1 className="display" style={{ fontSize: '2rem', margin: '.2rem 0 .6rem' }}>الإعدادات</h1>
      <button className="card row" style={{ width: '100%', textAlign: 'start' }} onClick={() => setSheet('profile')}>
        <span className="display" style={{ width: '3.4rem', height: '3.4rem', borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'var(--accent)', color: 'var(--on)', fontSize: '1.5rem', flex: 'none' }}>{(s.name || 'و').trim()[0]}</span>
        <span className="grow"><div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{s.name || 'صاحبي'}</div><div className="muted" style={{ fontSize: '.85rem' }}>{s.goal || 'أضف هدفك'}{s.age ? ` · ${ar(s.age)} سنة` : ''}</div></span>
        <Pencil size={18} className="muted" />
      </button>

      <Sec>الورد</Sec>
      <div className="list">
        <Item icon={Target} title="الكمية اليومية" sub="عدد الآيات في ورد اليوم" right={<Mini v={s.cap} min={1} max={60} on={(cap) => set({ cap })} />} />
        <Item icon={CalendarDays} title="أيام الورد في الأسبوع" sub={`هدفك الأسبوعي ${ar(s.cap * s.days)} آية`} right={<Mini v={s.days} min={1} max={7} on={(days) => set({ days })} />} />
        <div className="item" style={{ display: 'block' }}>
          <div className="row" style={{ marginBottom: '.6rem' }}><span className="ic"><ArrowDownUp size={19} /></span><span><div className="t">اتجاه المسار</div><div className="s">يمكنك تغييره متى شئت</div></span></div>
          <Segmented value={s.dir} onChange={(dir) => set({ dir })} options={[{ v: 'asc', l: 'من الفاتحة نحو الناس' }, { v: 'desc', l: 'من الناس نحو الفاتحة' }]} />
        </div>
      </div>

      <Sec>المظهر</Sec>
      <div className="list">
        <div className="item" style={{ display: 'block' }}>
          <div className="row" style={{ marginBottom: '.6rem' }}><span className="ic"><Palette size={19} /></span><span className="t">سمة التطبيق</span></div>
          <Segmented value={s.theme} onChange={(theme) => set({ theme })} options={[{ v: 'auto', l: 'تلقائي' }, { v: 'dark', l: 'داكن' }, { v: 'light', l: 'فاتح' }]} />
        </div>
        <div className="item" style={{ display: 'block' }}>
          <div className="t" style={{ marginBottom: '.7rem' }}>لون التطبيق</div>
          <div className="row sp">{Object.entries(ACCENTS).map(([k, [d, , n]]) => (
            <button key={k} className="c" onClick={() => { haptic(); set({ accent: k }) }} aria-label={n}>
              <span className={'sw' + (s.accent === k ? ' on' : '')} style={{ margin: '0 auto' }}><span style={{ width: '1.9rem', height: '1.9rem', borderRadius: '50%', background: d, display: 'block' }} /></span>
              <div className="muted" style={{ fontSize: '.7rem', marginTop: '.2rem' }}>{n}</div></button>))}</div>
        </div>
        <div className="item" style={{ display: 'block' }}>
          <div className="row" style={{ marginBottom: '.6rem' }}><span className="ic"><Type size={19} /></span><span className="t">حجم خط الواجهة</span></div>
          <Segmented value={s.scale} onChange={(scale) => set({ scale })} options={[{ v: 0.9, l: 'صغير' }, { v: 1, l: 'عادي' }, { v: 1.12, l: 'كبير' }, { v: 1.25, l: 'أكبر' }]} />
        </div>
        <div className="item" style={{ display: 'block' }}>
          <div className="t" style={{ marginBottom: '.7rem' }}>ورقة المصحف</div>
          <div className="row sp">{[['auto', 'تلقائي'], ...Object.entries(PAPERS).map(([k, v]) => [k, v[2]])].map(([k, n]) => {
            const p = PAPERS[k]
            return (<button key={k} className="c" style={{ flex: 1 }} onClick={() => { haptic(); set({ paper: k }) }}>
              <span style={{ display: 'block', width: '3.1rem', height: '4rem', margin: '0 auto', borderRadius: 8, background: p ? p[0] : 'linear-gradient(135deg,#fff 50%,#0B131B 50%)', border: `4px solid ${p ? p[1] : '#2A9DB5'}`, outline: s.paper === k ? '2px solid var(--accent)' : 'none', outlineOffset: 3 }} />
              <div className="muted" style={{ fontSize: '.72rem', marginTop: '.4rem' }}>{n}</div></button>)
          })}</div>
        </div>
      </div>

      <Sec>القراءة والتجربة</Sec>
      <div className="list">
        <Item icon={Maximize2} title="ملاءمة الصفحة للشاشة" sub="تصغير الصفحة لتظهر كاملة دون تمرير" right={<Toggle on={s.fitScreen} onChange={(fitScreen) => set({ fitScreen })} />} />
        <Item icon={Vibrate} title="الاهتزاز الخفيف" sub="عند الضغط على الأزرار وكشف الآيات" right={<Toggle on={s.haptics} onChange={(haptics) => set({ haptics })} />} />
      </div>

      <Sec>التذكير</Sec>
      <div className="list">
        <Item icon={Bell} title="تذكير يومي بالورد" sub="إشعار هادئ في الوقت الذي تختاره" right={<Toggle on={s.reminder.on} onChange={(on) => remind(on, s.reminder.time)} />} />
        {s.reminder.on && <div className="item"><span className="grow t">وقت التذكير</span><input type="time" value={s.reminder.time} onChange={(e) => remind(true, e.target.value)} style={{ background: 'var(--surface2)', border: '1px solid var(--line)', borderRadius: 12, padding: '.4rem .7rem' }} /></div>}
      </div>

      <Sec>بياناتك</Sec>
      <div className="list">
        <Item icon={Download} title="نسخة احتياطية" sub="شارك بياناتك أو احفظها في ملاحظاتك" onClick={backup} />
        <Item icon={Upload} title="استعادة نسخة" sub="الصق نسخة احتياطية سابقة" onClick={() => setSheet('restore')} />
        <Item icon={Trash2} title="مسح كل البيانات" sub="يعيدك إلى بداية التطبيق" onClick={() => setSheet('reset')} />
      </div>

      <Sec>عن وِرد</Sec>
      <div className="list">
        <Item icon={Share2} title="شارك وِرد مع أصدقائك" onClick={shareApp} />
        <Item icon={Info} title="المصادر والتراخيص" sub={`الإصدار ${VERSION}`} onClick={() => setSheet('about')} />
      </div>

      <Sheet open={sheet === 'profile'} onClose={() => setSheet(null)} title="ملفك الشخصي">
        <label className="field" style={{ marginTop: 0 }}><span>الاسم</span><input value={s.name} onChange={(e) => set({ name: e.target.value })} /></label>
        <label className="field"><span>العمر</span><input type="number" inputMode="numeric" value={s.age} onChange={(e) => set({ age: e.target.value })} /></label>
        <label className="field"><span>الهدف</span><input value={s.goal} onChange={(e) => set({ goal: e.target.value })} /></label>
        <Btn onClick={() => setSheet(null)}>تم</Btn>
      </Sheet>
      <Sheet open={sheet === 'restore'} onClose={() => setSheet(null)} title="استعادة نسخة احتياطية">
        <label className="field" style={{ marginTop: 0 }}><textarea rows={6} value={paste} onChange={(e) => setPaste(e.target.value)} placeholder="الصق هنا النص الذي نسخته سابقًا" dir="ltr" /></label>
        <Btn onClick={restore}>استعادة</Btn>
      </Sheet>
      <Sheet open={sheet === 'reset'} onClose={() => setSheet(null)} title="مسح كل البيانات؟">
        <p className="muted" style={{ marginTop: 0 }}>سيُمسح تقدمك وإعداداتك من هذا الجهاز ولا يمكن التراجع. يُفضّل أخذ نسخة احتياطية أولًا.</p>
        <div className="stack"><Btn v="danger" icon={Trash2} onClick={() => { s.resetAll(); setSheet(null) }}>امسح كل شيء</Btn><Btn v="plain" onClick={() => setSheet(null)}>إلغاء</Btn></div>
      </Sheet>
      <Sheet open={sheet === 'about'} onClose={() => setSheet(null)} title="المصادر والتراخيص">
        <div className="cx" style={{ marginBottom: '1rem' }}><Mark size={64} /></div>
        <div className="stack muted" style={{ fontSize: '.88rem', lineHeight: 1.9 }}>
          <div>نص القرآن الكريم برواية حفص من ملف Quran-Json (AbdAlftahSalem)، ويُدقَّق على مصحف مطبوع موثوق قبل أي استخدام عام.</div>
          <div>تقطيع صفحات مصحف المدينة وأسطره من مستودع zonetecde/mushaf-layout.</div>
          <div>خط المصحف: KFGQPC Uthmanic Script HAFS، ملك لمجمع الملك فهد لطباعة المصحف الشريف، ويُستخدم لعرض نص القرآن فقط.</div>
          <div>خطوط الواجهة: IBM Plex Sans Arabic وReem Kufi (رخصة SIL OFL).</div>
        </div>
      </Sheet>
    </div>
  )
}
