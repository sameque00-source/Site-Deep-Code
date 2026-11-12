import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Navigation } from '../components/Navigation';
import { HeroPoster } from '../components/HeroPoster';
import { SceneBoundary } from '../components/SceneBoundary';
import { Arrow } from '../components/Arrow';
import ProductSections from '../sections/ProductSections';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { playCue } from '../experience/audio/AudioManager';
const SpaceExperience = lazy(() => import('../experience/SpaceExperience'));
type Quality = 'auto' | 'ULTRA' | 'HIGH' | 'BALANCED' | 'LOW' | 'FALLBACK';
const qualityChoices: Quality[] = ['auto', 'ULTRA', 'HIGH', 'BALANCED', 'LOW', 'FALLBACK'];
export default function App() {
  const reducedMotion = useReducedMotion();
  const [booted, setBooted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [quality, setQuality] = useState<Quality>('auto');
  const [status, setStatus] = useState<'loading'|'ready'|'fallback'>('loading');
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const sections = document.querySelectorAll<HTMLElement>('main .section-shell');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed'); observer.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -30px 0px', threshold: 0 });
    sections.forEach(section => { section.classList.add('reveal-managed'); observer.observe(section); });
    return () => { observer.disconnect(); sections.forEach(section => section.classList.remove('reveal-managed', 'is-revealed')); };
  }, [reducedMotion]);
  useEffect(() => {
    const forced = new URLSearchParams(location.search).get('graphics') === 'off';
    let saved: string | null = null;
    try { saved = localStorage.getItem('deep-code-quality'); } catch { /* Preferências opcionais. */ }
    if (forced) setQuality('FALLBACK');
    else if (qualityChoices.includes(saved as Quality)) setQuality(saved as Quality);
    setBooted(true);
  }, []);
  const handleStatus = useCallback((next: 'loading'|'ready'|'fallback') => {
    setStatus(next); if (next === 'fallback') setFailed(true);
  }, []);
  const handleError = useCallback(() => { setFailed(true); setStatus('fallback'); }, []);
  useEffect(() => {
    if (!booted || status !== 'loading' || failed || quality === 'FALLBACK') return;
    const timeout = window.setTimeout(handleError, 12000);
    return () => window.clearTimeout(timeout);
  }, [booted, status, failed, quality, handleError]);
  const changeQuality = (value: Quality) => {
    setQuality(value); setFailed(false); setStatus(value === 'FALLBACK' ? 'fallback' : 'loading');
    try { localStorage.setItem('deep-code-quality', value); } catch { /* Preferências opcionais. */ }
  };
  const fallback = quality === 'FALLBACK' || failed;
  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <Navigation reducedMotion={reducedMotion} onMenuChange={setMenuOpen} />
    <main id="conteudo">
      <section id="inicio" className={`hero ${status === 'ready' && !fallback ? 'scene-ready' : ''}`} aria-labelledby="hero-title">
        <div className="hero-world" aria-hidden="true">
          <HeroPoster />
          {booted && !fallback && <SceneBoundary key={retry} onError={handleError}><Suspense fallback={null}><SpaceExperience reducedMotion={reducedMotion} paused={paused || menuOpen} quality={quality} onStatus={handleStatus} /></Suspense></SceneBoundary>}
        </div>
        <div className="hero-coordinates mono" aria-hidden="true"><span>DC — EXPEDITION 001</span><span>23° / NOVAS POSSIBILIDADES</span></div>
        <div className="hero-content">
          <p className="eyebrow"><span className="status-dot"/> UM NOVO ESPAÇO PARA CRIAR</p>
          <h1 id="hero-title">Deep<br/>Code<span className="title-period">.</span></h1>
          <p className="hero-statement">Grandes ideias.<br/><span>Novos horizontes.</span></p>
          <p className="hero-description">Programação com inteligência artificial.<br/>Um aplicativo Windows em desenvolvimento,<br className="desktop-break"/> feito para explorar o que vem a seguir.</p>
          <div className="hero-actions"><a className="button button-primary" href="#demonstracao" onClick={() => playCue('navigate')}>Explorar o conceito <Arrow /></a><a className="text-link" href="#visao">Conheça o projeto <Arrow /></a></div>
        </div>
        <div className="subject-label mono" aria-hidden="true"><span className="crosshair">+</span><div>EXPLORADOR / 001<br/><span>ESTUDO 3D ORIGINAL</span></div></div>
        <div className="hero-bottom">
          <div className="experience-status"><span className="mono">{fallback ? 'EXPERIÊNCIA ESSENCIAL' : status === 'ready' ? 'EXPLORE COM O CURSOR' : 'PREPARANDO O UNIVERSO'}</span><span className="status-caption" role="status">{fallback ? 'O conteúdo continua disponível.' : status === 'ready' ? 'Astronauta original em protótipo.' : 'O conteúdo já está disponível abaixo.'}</span></div>
          <details className="experience-settings"><summary className="mono">Ajustar experiência <span aria-hidden="true">＋</span></summary><div className="settings-panel"><label htmlFor="quality">Qualidade visual</label><select id="quality" value={quality} onChange={e => changeQuality(e.target.value as Quality)}><option value="auto">Automática</option><option value="ULTRA">Ultra</option><option value="HIGH">Alta</option><option value="BALANCED">Equilibrada</option><option value="LOW">Leve</option><option value="FALLBACK">Sem 3D</option></select><button aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? 'Retomar animações' : 'Pausar animações'}</button>{reducedMotion && <p>Movimento reduzido conforme sua preferência.</p>}{failed && <button onClick={() => { setFailed(false); setStatus('loading'); setRetry(retry + 1); }}>Tentar 3D novamente</button>}</div></details>
          <a className="scroll-cue mono" href="#visao"><span>ROLE PARA EXPLORAR</span><span className="scroll-arrow" aria-hidden="true">↓</span></a>
        </div>
      </section>
      <ProductSections />
    </main>
  </>;
}
