import { useEffect, useRef, useState } from 'react';
import { Brand } from './Brand';
import { Arrow } from './Arrow';
import AudioControl from '../experience/audio/AudioControl';
import { playCue } from '../experience/audio/AudioManager';
export const navigation = [ ['visao', 'O projeto'], ['demonstracao', 'Explore'], ['downloads', 'Disponibilidade'] ] as const;
export function Navigation({ reducedMotion, onMenuChange }: { reducedMotion: boolean; onMenuChange?: (open: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('inicio');
  const [scrolled, setScrolled] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => { onMenuChange?.(open); }, [open, onMenuChange]);
  useEffect(() => {
    let frame = 0;
    const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => setScrolled(scrollY > 40)); };
    update(); window.addEventListener('scroll', update, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); };
  }, []);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);
  useEffect(() => {
    const sections = document.querySelectorAll('main section[id]');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: '-20% 0px -55% 0px' });
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  const navigate = () => { setOpen(false); playCue('navigate'); };
  return <>
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <Brand />
      <nav className="desktop-navigation" aria-label="Navegação principal">
        {navigation.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => playCue('navigate')} aria-current={active === id ? 'location' : undefined}>{label}</a>)}
      </nav>
      <div className="header-tools">
        <AudioControl reducedMotion={reducedMotion} />
        <button ref={trigger} className="menu-trigger" aria-label="Abrir menu" aria-haspopup="dialog" aria-expanded={open} onClick={() => { setOpen(true); playCue('activate'); }}>
          <span>Menu</span><span className="menu-lines" aria-hidden="true"><i /><i /></span>
        </button>
      </div>
    </header>
    <dialog ref={dialog} className="navigation-dialog" aria-label="Menu de navegação" onCancel={() => setOpen(false)} onClose={() => { setOpen(false); trigger.current?.focus(); }} onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div className="menu-top"><span className="mono">DEEP CODE / NAVEGAÇÃO</span><button className="menu-close" aria-label="Fechar menu" onClick={() => setOpen(false)}>Fechar <span aria-hidden="true">×</span></button></div>
      <nav aria-label="Todas as seções">
        {([['inicio','Início'], ...navigation, ['recursos','Possibilidades'], ['modelos','Inteligência artificial'], ['atualizacoes','Atualizações'], ['faq','Perguntas frequentes']] as const).map(([id,label],index) =>
          <a key={id} href={`#${id}`} onClick={navigate}><span className="mono">0{index + 1}</span>{label}<span className="menu-arrow"><Arrow /></span></a>)}
      </nav>
      <p className="menu-bottom mono">UM NOVO ESPAÇO PARA CRIAR.</p>
    </dialog>
  </>;
}
