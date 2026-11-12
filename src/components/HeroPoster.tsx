/** Arte vetorial original de fallback; nenhuma imagem externa. */
export function HeroPoster() {
  return <svg className="hero-poster" viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <radialGradient id="orbit-halo"><stop stopColor="#ff8a50" stopOpacity=".23"/><stop offset=".48" stopColor="#783a23" stopOpacity=".08"/><stop offset="1" stopColor="#0b0d10" stopOpacity="0"/></radialGradient>
      <linearGradient id="horizon-light" x2="0" y2="1"><stop stopColor="#51555b"/><stop offset=".025" stopColor="#20252c"/><stop offset="1" stopColor="#0b0d10"/></linearGradient>
    </defs>
    <ellipse cx="1040" cy="390" rx="630" ry="600" fill="url(#orbit-halo)"/>
    <g stroke="#aaa298" fill="none" opacity=".12"><ellipse cx="1030" cy="460" rx="340" ry="340"/><ellipse cx="1030" cy="460" rx="420" ry="420"/><ellipse cx="1030" cy="460" rx="470" ry="150" transform="rotate(-35 1030 460)"/></g>
    <ellipse cx="1070" cy="1460" rx="1400" ry="720" fill="url(#horizon-light)"/>
    <g fill="#ccc5ba" opacity=".5">{Array.from({length:36},(_,index) => <circle key={index} cx={(index * 173 + 91) % 1440} cy={(index * 127 + 67) % 710} r={index % 5 === 0 ? 1.1 : .55}/>)}</g>
  </svg>;
}
