import { useId, useMemo } from 'react'
import { moonSvg } from './moonSvg'
export function Mark({ size = 64 }) {
  const u = 'm' + useId().replace(/:/g, '')
  const html = useMemo(() => moonSvg(u, { attrs: 'width="100%" height="100%"' }), [u])
  return <span className="logo" aria-hidden="true" style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: html }} />
}
