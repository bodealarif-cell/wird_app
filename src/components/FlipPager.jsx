import { useLayoutEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

// صفحات يمين/يسار بحركة قلب حقيقية: الكعب على يمين الصفحة، وتُقلب الصفحة بسحب الحافة اليسرى نحو اليمين
export default function FlipPager({ page, count, onPage, renderPage, w, h, disabled, onTap }) {
  const x = useMotionValue(0)
  const busy = useRef(false), st = useRef({ id: null }), supp = useRef(false)
  const rotC = useTransform(x, [0, w], [0, 104])
  const shadeC = useTransform(x, [0, w * 0.6, w], [0, 0.18, 0.5])
  const shadeN = useTransform(x, [0, w], [0.5, 0])
  const rotP = useTransform(x, [-w, 0], [0, 104])
  const shadeP = useTransform(x, [-w, 0], [0, 0.5])
  useLayoutEffect(() => { x.set(0); busy.current = false }, [page, x])

  const go = (dir) => {
    if (busy.current || page + dir < 0 || page + dir > count - 1) { animate(x, 0, { duration: 0.25 }); return }
    busy.current = true
    animate(x, dir > 0 ? w : -w, { duration: 0.44, ease: [0.4, 0.02, 0.2, 1], onComplete: () => onPage(page + dir) })
  }
  const down = (e) => { if (disabled || busy.current) return; supp.current = false; st.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, t0: performance.now(), drag: false } }
  const move = (e) => {
    const s = st.current
    if (s.id !== e.pointerId) return
    const dx = e.clientX - s.x0, dy = e.clientY - s.y0
    if (!s.drag) { if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.3) { s.drag = true; e.currentTarget.setPointerCapture(e.pointerId) } else return }
    let v = dx
    if ((v > 0 && page >= count - 1) || (v < 0 && page <= 0)) v *= 0.15
    x.set(Math.max(-w, Math.min(w, v)))
  }
  const up = (e) => {
    const s = st.current
    if (s.id !== e.pointerId) return
    st.current = { id: null }
    if (!s.drag) return
    supp.current = true
    const v = (e.clientX - s.x0) / Math.max(1, performance.now() - s.t0), cur = x.get()
    if (cur > w * 0.27 || v > 0.55) go(1)
    else if (cur < -w * 0.27 || v < -0.55) go(-1)
    else animate(x, 0, { duration: 0.3, ease: [0.2, 0.8, 0.2, 1] })
  }
  const click = (e) => {
    if (supp.current) { supp.current = false; return }
    const r = e.currentTarget.getBoundingClientRect(), f = (e.clientX - r.left) / r.width
    if (!disabled && f < 0.13) go(1)
    else if (!disabled && f > 0.87) go(-1)
    else onTap?.()
  }
  const layer = (q, style, shade, z) => q >= 0 && q < count && (
    <motion.div key={z} className="flip-layer" style={{ ...style, zIndex: z }}>
      <div className="cellpage" style={{ height: h }}>{renderPage(q)}</div>
      {shade && <motion.div className="flip-shade" style={{ opacity: shade }} />}
    </motion.div>
  )
  return (
    <div className="flip" style={{ width: w, height: h }} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onClick={click}>
      {layer(page + 1, {}, shadeN, 1)}
      {layer(page, { rotateY: rotC, transformOrigin: '100% 50%', transformPerspective: 1900 }, shadeC, 2)}
      {layer(page - 1, { rotateY: rotP, transformOrigin: '100% 50%', transformPerspective: 1900 }, shadeP, 3)}
    </div>
  )
}
