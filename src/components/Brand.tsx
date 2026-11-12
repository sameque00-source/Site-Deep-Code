import { brand } from '../config/brand';
export function Brand() {
  return <a className="brand" href="#inicio" aria-label={brand.logoSrc ? 'Deep Code — início' : 'Deep Code — início; marca tipográfica provisória'}>
    {brand.logoSrc ? <img src={brand.logoSrc} alt={brand.logoAlt} width="132" height="32" /> : <span>Deep Code<span className="brand-period">.</span></span>}
  </a>;
}
