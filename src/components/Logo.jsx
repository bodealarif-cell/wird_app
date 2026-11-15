import { useId } from 'react'
export function Mark({ size = 64 }) {
  const k = useId().replace(/:/g, '')
  return (
    <svg className="logo" width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <linearGradient id={k + 'a'} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#12384A" /><stop offset="1" stopColor="#050A10" /></linearGradient>
        <radialGradient id={k + 'b'} cx=".5" cy=".45" r=".6"><stop offset="0" stopColor="#3CC6D6" stopOpacity=".45" /><stop offset="1" stopColor="#3CC6D6" stopOpacity="0" /></radialGradient>
        <linearGradient id={k + 'c'} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FFF0C4" /><stop offset="1" stopColor="#D6A446" /></linearGradient>
      </defs>
      <rect width="120" height="120" rx="28" fill={`url(#${k}a)`} />
      <rect width="120" height="120" rx="28" fill={`url(#${k}b)`} />
      <rect x=".7" y=".7" width="118.6" height="118.6" rx="27.3" fill="none" stroke="#fff" strokeOpacity=".12" strokeWidth="1.4" />
      <circle cx="60" cy="60" r="40" fill="none" stroke={`url(#${k}c)`} strokeWidth="1.6" opacity=".55" />
      <g fill="rgba(255,255,255,.05)" stroke={`url(#${k}c)`} strokeWidth="3.2" strokeLinejoin="round">
        <rect x="40" y="40" width="40" height="40" />
        <rect x="40" y="40" width="40" height="40" transform="rotate(45 60 60)" />
      </g>
      <circle cx="60" cy="60" r="13" fill="#D6A446" opacity=".14" />
      <circle cx="60" cy="60" r="6.5" fill={`url(#${k}c)`} />
    </svg>
  )
}
