// أيقونة وِرد: قمر مكتمل ثلاثي الأبعاد خلف لوح زجاجي ضبابي. يُستخدم في التطبيق ويُصدَّر منه ملف الأيقونة.
export function moonSvg(u, o = {}) {
  const { bg = true, rounded = true, moon = true, scale = 1, attrs = '' } = o
  const i = (n) => u + n
  const stars = [[180, 160, 3.2, .9], [820, 210, 2.6, .8], [300, 90, 2, .7], [700, 100, 2.4, .85], [110, 420, 2.2, .6], [920, 470, 2.8, .75], [240, 330, 1.8, .6], [790, 350, 2, .7], [140, 720, 2.4, .6], [900, 780, 2.2, .55], [600, 58, 1.8, .6], [420, 130, 1.6, .5], [60, 250, 1.8, .5], [960, 300, 1.6, .6]]
    .map(([x, y, r, op]) => `<circle cx="${x}" cy="${y}" r="${r * 1.5}" fill="#fff" opacity="${op}"/>`).join('')
  const spark = (x, y, s) => `<path transform="translate(${x} ${y})" d="M0,${-s} L${.18 * s},${-.18 * s} L${s},0 L${.18 * s},${.18 * s} L0,${s} L${-.18 * s},${.18 * s} L${-s},0 L${-.18 * s},${-.18 * s}Z" fill="#fff" opacity=".85"/>`
  const craters = [[600, 360, 62], [420, 330, 40], [560, 560, 74], [380, 520, 50], [670, 500, 34], [470, 640, 30], [640, 640, 26], [330, 400, 24], [520, 250, 28]]
    .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${i('cr')})"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#FFF6D6" stroke-opacity=".28" stroke-width="3"/>`).join('')
  const scene = `<g id="${i('scene')}">
${bg ? `<rect width="1024" height="1024" fill="url(#${i('bg')})"/>${stars}${spark(850, 150, 26)}${spark(170, 250, 18)}` : ''}
${moon ? `<circle cx="512" cy="470" r="480" fill="url(#${i('glow')})"/>
<circle cx="512" cy="470" r="372" fill="url(#${i('warm')})"/>
<circle cx="512" cy="470" r="300" fill="url(#${i('sph')})"/>
<g clip-path="url(#${i('ms')})">
<ellipse cx="440" cy="400" rx="120" ry="76" fill="#C9AC66" opacity=".16" filter="url(#${i('b6')})"/>
<ellipse cx="600" cy="560" rx="100" ry="70" fill="#C9AC66" opacity=".14" filter="url(#${i('b6')})"/>
${craters}
<circle cx="512" cy="470" r="300" fill="url(#${i('shade')})"/>
</g>
<circle cx="512" cy="470" r="297" fill="none" stroke="url(#${i('rim')})" stroke-width="6"/>` : ''}
</g>`
  const glass = moon ? `<g clip-path="url(#${i('gp')})"><use href="#${i('scene')}" filter="url(#${i('b22')})"/><rect x="150" y="650" width="724" height="240" fill="url(#${i('gl')})"/></g>
<rect x="152" y="652" width="720" height="236" rx="92" fill="none" stroke="url(#${i('gb')})" stroke-width="4"/>
<path d="M214 706 Q512 680 810 706" stroke="#fff" stroke-opacity=".55" stroke-width="3.5" fill="none" stroke-linecap="round"/>
<g transform="translate(512 774)" fill="none" stroke="#A9731A" stroke-width="9" stroke-linejoin="round"><rect x="-32" y="-32" width="64" height="64"/><rect x="-32" y="-32" width="64" height="64" transform="rotate(45)"/></g>
<circle cx="512" cy="774" r="10" fill="#A9731A"/>` : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" ${attrs}><defs>
<radialGradient id="${i('bg')}" cx=".5" cy=".28" r=".95"><stop offset="0" stop-color="#1B5568"/><stop offset=".5" stop-color="#08222E"/><stop offset="1" stop-color="#02070B"/></radialGradient>
<radialGradient id="${i('glow')}"><stop offset="0" stop-color="#B5F0F8" stop-opacity=".75"/><stop offset=".55" stop-color="#4FC3D6" stop-opacity=".16"/><stop offset="1" stop-color="#4FC3D6" stop-opacity="0"/></radialGradient>
<radialGradient id="${i('warm')}"><stop offset=".7" stop-color="#FFEDB5" stop-opacity=".42"/><stop offset="1" stop-color="#FFE9A8" stop-opacity="0"/></radialGradient>
<radialGradient id="${i('sph')}" cx=".36" cy=".3" r=".9"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".38" stop-color="#FFFEF4"/><stop offset=".72" stop-color="#FFF2C9"/><stop offset="1" stop-color="#EBCF86"/></radialGradient>
<radialGradient id="${i('shade')}" cx=".7" cy=".78" r=".78"><stop offset=".4" stop-color="#8A6A25" stop-opacity="0"/><stop offset="1" stop-color="#6B4E12" stop-opacity=".36"/></radialGradient>
<radialGradient id="${i('cr')}" cx=".4" cy=".36" r=".7"><stop offset="0" stop-color="#B99B55" stop-opacity=".26"/><stop offset=".75" stop-color="#CDB071" stop-opacity=".1"/><stop offset="1" stop-color="#FFF6D6" stop-opacity=".3"/></radialGradient>
<linearGradient id="${i('rim')}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".5" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#ffd98a" stop-opacity=".5"/></linearGradient>
<linearGradient id="${i('gl')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".4"/><stop offset="1" stop-color="#bfeef5" stop-opacity=".08"/></linearGradient>
<linearGradient id="${i('gb')}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".45" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity=".5"/></linearGradient>
<linearGradient id="${i('gold')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF0C4"/><stop offset="1" stop-color="#D6A446"/></linearGradient>
<filter id="${i('b22')}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="24"/></filter>
<filter id="${i('b6')}"><feGaussianBlur stdDeviation="8"/></filter>
<clipPath id="${i('ms')}"><circle cx="512" cy="470" r="300"/></clipPath>
<clipPath id="${i('gp')}"><rect x="150" y="650" width="724" height="240" rx="96"/></clipPath>
<clipPath id="${i('sq')}"><rect width="1024" height="1024" rx="${rounded ? 228 : 0}"/></clipPath>
</defs><g clip-path="url(#${i('sq')})"><g transform="translate(512 512) scale(${scale}) translate(-512 -512)">${scene}${glass}</g>${bg ? `<ellipse cx="512" cy="-160" rx="700" ry="330" fill="#fff" opacity=".045"/>` : ''}</g></svg>`
}
