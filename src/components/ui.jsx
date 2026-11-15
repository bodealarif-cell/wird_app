import { useId, useEffect } from 'react'
import { motion, AnimatePresence, useDragControls } from 'framer-motion'
import { haptic } from '../lib/native'
import { pushBack } from '../lib/back'

export const Btn = ({ v = 'primary', icon: I, children, onClick, className = '', ...p }) => (
  <button className={`btn ${v} ${className}`} onClick={(e) => { haptic('light'); onClick?.(e) }} {...p}>{I && <I size={19} />}{children}</button>
)
export const Toggle = ({ on, onChange }) => (
  <button role="switch" aria-checked={on} className={'tog' + (on ? ' on' : '')} onClick={() => { haptic(); onChange(!on) }}><i /></button>
)
export function Segmented({ value, options, onChange }) {
  const id = useId()
  return (
    <div className="seg">
      {options.map((o) => (
        <button key={o.v} className={value === o.v ? 'on' : ''} onClick={() => { haptic(); onChange(o.v) }}>
          {value === o.v && <motion.span layoutId={id} className="pill" transition={{ type: 'spring', stiffness: 520, damping: 38 }} />}
          {o.l}
        </button>
      ))}
    </div>
  )
}
export function Stepper({ value, min = 1, max = 60, onChange, fmt = (v) => v }) {
  return (
    <div className="stepper">
      <button aria-label="زيادة" onClick={() => { haptic(); onChange(Math.min(max, value + 1)) }}><span style={{ fontSize: '1.6rem' }}>+</span></button>
      <b>{fmt(value)}</b>
      <button aria-label="إنقاص" onClick={() => { haptic(); onChange(Math.max(min, value - 1)) }}><span style={{ fontSize: '1.6rem' }}>−</span></button>
    </div>
  )
}
export const Item = ({ icon: I, title, sub, right, onClick }) => {
  const C = onClick ? 'button' : 'div'
  return (
    <C className="item" onClick={onClick ? () => { haptic(); onClick() } : undefined}>
      {I && <span className="ic"><I size={19} /></span>}
      <span className="grow"><div className="t">{title}</div>{sub && <div className="s">{sub}</div>}</span>
      {right}
    </C>
  )
}
export function Sheet({ open, onClose, title, children }) {
  const dc = useDragControls()
  useEffect(() => (open ? pushBack(onClose) : undefined), [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="scrim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.div className="sheet" drag="y" dragListener={false} dragControls={dc} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, i) => { if (i.offset.y > 110 || i.velocity.y > 700) onClose() }}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 34, stiffness: 340 }}>
            <div onPointerDown={(e) => dc.start(e)}><div className="grab" /><div className="sheet-h">{title}</div></div>
            <div className="sheet-b">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
