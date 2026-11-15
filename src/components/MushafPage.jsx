import { memo } from 'react'
import { L, NAMES, BASMALA, JUZ_NAMES, ar, words, juzOf, surahOfPage } from '../lib/quran'
import { lineWidths } from '../lib/mushaf'

// view=null: قراءة عادية. view={idx,masked,R,cur,tap}: وضع الورد (كلمات خارج الورد مخفية، وفي الحفظ تُموَّه الكلمات)
function MushafPage({ p, fs, outer, band, pad, inner, view }) {
  const N = lineWidths(p), pl = L[p]
  const lines = pl.map((l, i) => {
    if (l[0] === 1) return !view || view.idx(l[1], 1) >= 0 ? <div className="sh" key={i}><span>سورة {NAMES[l[1] - 1]}</span></div> : <div className="ln" key={i} />
    if (l[0] === 2) {
      const nx = pl.slice(i + 1).find((x) => x[0] === 0)
      return !view || (nx && nx[1][0][1] === 1 && view.idx(nx[1][0][0], 1) >= 0) ? <div className="bs" key={i}>{BASMALA}</div> : <div className="ln" key={i} />
    }
    const nat = (N[i] * fs) / 100, sq = nat > inner ? inner / nat : 1, center = nat < inner * 0.72
    const style = sq < 1 ? { width: nat, transform: `scaleX(${sq})`, transformOrigin: '100% 50%' } : undefined
    return (
      <div key={i} className={'ln' + (center ? ' c' : '')} style={style}>
        {l[1].flatMap(([s, a, w1, w2]) => {
          const ws = words(s, a), idx = view ? view.idx(s, a) : 0, out = []
          const hidden = view && idx < 0, masked = view && idx >= 0 && view.masked && !view.R[idx], cur = view && idx >= 0 && idx === view.cur
          for (let k = w1; k <= w2; k++) {
            out.push(
              <span key={`${s}-${a}-${k}`} className={'w' + (hidden ? ' x' : '') + (masked ? ' m' : '') + (cur ? ' cur' : '')}
                {...(view && idx >= 0 && view.masked ? { 'data-tap': 1, onClick: () => view.tap(idx) } : {})}>
                <span className="t">{ws[k - 1]}</span>{k === ws.length && <span className="ae">{ar(a)}</span>}
              </span>,
            )
          }
          return out
        })}
      </div>
    )
  })
  return (
    <div className="mp" style={{ '--fs': fs + 'px', '--ow': outer + 'px', '--band': band + 'px', '--pad': pad + 'px' }}>
      <div className="mp-in">
        <div className="mp-head"><span className="cart">سورة {NAMES[surahOfPage(p) - 1]}</span><span className="cart">الجزء {JUZ_NAMES[juzOf(p) - 1]}</span></div>
        {lines}
        <div className="mp-foot"><span className="cart pn">{ar(p + 1)}</span></div>
      </div>
    </div>
  )
}
export default memo(MushafPage)
