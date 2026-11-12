import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { demoScenarios, productPrinciples, questions } from '../content/product';
import './sections.css';

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {diagonal ? <path d="M6 18 18 6M6 6h12v12" /> : <path d="M4 12h15m-6-6 6 6-6 6" />}
    </svg>
  );
}

function Spark() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 1v22M1 12h22M4.2 4.2l15.6 15.6M4.2 19.8 19.8 4.2" /></svg>;
}

function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return <p className="section-label"><span>{number}</span>{children}</p>;
}

function ConceptDemo() {
  const [selected, setSelected] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const scenario = demoScenarios[selected];

  function select(index: number) {
    setSelected(index);
    setAnnouncement(`Cenário ${demoScenarios[index].label} selecionado.`);
  }

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % demoScenarios.length;
    else if (event.key === 'ArrowLeft') next = (index + demoScenarios.length - 1) % demoScenarios.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = demoScenarios.length - 1;
    else return;
    event.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className="demo-shell">
      <div className="demo-window">
        <div className="demo-titlebar">
          <div className="demo-window-brand"><span className="demo-brand-symbol" aria-hidden="true">/</span> Deep Code <span className="demo-concept-tag">CONCEITO</span></div>
          <div className="demo-window-controls" aria-hidden="true"><span className="demo-control-minimize" /><span className="demo-control-maximize" /><span className="demo-control-close" /></div>
        </div>
        <div className="demo-toolbar">
          <div className="demo-tabs" role="tablist" aria-label="Cenários da demonstração conceitual">
            {demoScenarios.map((item, index) => (
              <button
                key={item.id}
                ref={(node) => { tabRefs.current[index] = node; }}
                role="tab"
                id={`${id}-tab-${index}`}
                aria-controls={`${id}-panel`}
                aria-selected={selected === index}
                tabIndex={selected === index ? 0 : -1}
                onKeyDown={(event) => onTabKey(event, index)}
                onClick={() => select(index)}
              ><span className="demo-tab-dot" aria-hidden="true" />{item.label}</button>
            ))}
          </div>
          <button className="demo-reset" onClick={() => { setSelected(0); setAnnouncement('Demonstração reiniciada. Cenário Interface selecionado.'); }} aria-label="Reiniciar demonstração conceitual">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 7a6 6 0 1 1-.2 5M4 3v4h4" /></svg>
            <span>Reiniciar</span>
          </button>
        </div>
        <div className="demo-workspace" role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${selected}`} tabIndex={0}>
          <aside className="demo-file-tree" aria-label="Arquivos ilustrativos">
            <span className="demo-tree-title">EXPLORADOR</span>
            <span className="demo-tree-project"><span className="demo-tree-chevron" aria-hidden="true" /> my-next-idea</span>
            <span className="demo-tree-folder"><span className="demo-tree-chevron" aria-hidden="true" /> src</span>
            <span className="demo-tree-file demo-tree-file-active"><span className="demo-file-symbol" aria-hidden="true" />{scenario.file}</span>
            <span className="demo-tree-file"><span className="demo-file-symbol" aria-hidden="true" />styles.css</span>
            <span className="demo-tree-file"><span className="demo-file-symbol" aria-hidden="true" />README.md</span>
            <span className="demo-tree-bottom"><span className="demo-small-status" /> ambiente ilustrativo</span>
          </aside>
          <div className="demo-editor">
            <div className="demo-editor-path"><span>{scenario.path}</span><span>TS</span></div>
            <div className="demo-code-scroll" aria-label={`Exemplo de código: ${scenario.file}`}>
              <pre className="demo-code"><code>{scenario.lines.map((line, lineIndex) => (
                <span className="demo-code-line" key={`${scenario.id}-${lineIndex}`}><span className="demo-line-number" aria-hidden="true">{String(lineIndex + 1).padStart(2, '0')}</span><span>{line.length ? line.map((token, tokenIndex) => <span className={`demo-token-${token.kind || 'plain'}`} key={tokenIndex}>{token.text}</span>) : '\u00a0'}</span></span>
              ))}</code></pre>
            </div>
            <div className="demo-editor-note"><span><Arrow /></span><span>{scenario.note}</span></div>
          </div>
          <aside className="demo-assistant" aria-label="Explicação editorial do exemplo">
            <p className="demo-assistant-label"><span className="demo-asterisk"><Spark /></span> PERSPECTIVA</p>
            <h3>{scenario.prompt}</h3>
            <p>{scenario.explanation}</p>
            <div className="demo-assistant-bottom"><span className="demo-small-status" /> Texto editorial, sem execução de IA</div>
          </aside>
        </div>
        <div className="demo-statusbar"><span><span className="demo-branch-symbol" aria-hidden="true" /> exemplo / {scenario.id}</span><span>TypeScript <span className="demo-status-divider">/</span> UTF-8 <span className="demo-status-divider">/</span> Leitura</span></div>
      </div>
      <div className="demo-caption"><span className="demo-caption-index">FIG. 01</span><p>Demonstração conceitual — não é uma captura do aplicativo.</p><span className="demo-caption-tip">Explore as três perspectivas acima.</span></div>
      <p className="section-sr-only" role="status" aria-live="polite">{announcement}</p>
    </div>
  );
}

export default function ProductSections() {
  return (
    <>
      <section className="product-vision section-shell" id="visao" aria-labelledby="vision-heading">
        <SectionLabel number="01 /">UMA NOVA PERSPECTIVA</SectionLabel>
        <div className="product-vision-grid">
          <h2 id="vision-heading">Ideias não têm<br />limites.<br /><span>Seu espaço de<br />criação também<br />não deveria ter.</span></h2>
          <div className="product-vision-aside">
            <div className="product-orbit-diagram" aria-hidden="true"><span className="product-orbit-circle product-orbit-outer" /><span className="product-orbit-circle product-orbit-mid" /><span className="product-orbit-circle product-orbit-inner" /><span className="product-orbit-axis" /><span className="product-orbit-core"><Spark /></span><span className="product-orbit-point" /><span className="product-orbit-coordinate">23° / NEXT POSSIBILITY</span></div>
            <p>Deep Code é um aplicativo Windows em desenvolvimento, com uma proposta dedicada à programação com inteligência artificial.</p>
            <p className="product-secondary-copy">Um novo ponto de partida para explorar o que você pode construir.</p>
            <a className="product-text-link" href="#demonstracao">Explore o conceito <Arrow /></a>
          </div>
        </div>
        <div className="product-vision-footnote"><span>CRIADO PARA IDEIAS EM MOVIMENTO</span><span>DESKTOP / WINDOWS</span></div>
      </section>

      <section className="product-demo-section section-shell" id="demonstracao" aria-labelledby="demo-heading">
        <div className="product-section-heading">
          <div><SectionLabel number="02 /">DO PENSAMENTO AO CÓDIGO</SectionLabel><h2 id="demo-heading">Um novo espaço.<br /><span>Para o próximo passo.</span></h2></div>
          <p>Uma pequena exploração visual do conceito.<br />Escolha um cenário e veja outra perspectiva.</p>
        </div>
        <ConceptDemo />
      </section>

      <section className="product-principles section-shell" id="recursos" aria-labelledby="principles-heading">
        <div className="product-section-heading product-principles-heading"><SectionLabel number="03 /">O QUE NOS MOVE</SectionLabel><h2 id="principles-heading">Menos distância.<br /><span>Mais possibilidade.</span></h2></div>
        <p className="product-principles-intro">Princípios que orientam o projeto. Os recursos específicos serão apresentados com a versão oficial.</p>
        <div className="product-principles-list">{productPrinciples.map((item) => <article className="product-principle" key={item.index}><span className="product-principle-index">{item.index}</span><div><h3>{item.title}</h3><p>{item.text}</p></div><span className="product-principle-detail">{item.detail}</span></article>)}</div>
      </section>

      <section className="product-models section-shell" id="modelos" aria-labelledby="models-heading">
        <div className="product-models-graphic" aria-hidden="true"><span className="product-model-line" /><span className="product-model-node product-model-node-one">01</span><span className="product-model-node product-model-node-two">02</span><span className="product-model-node product-model-node-three">03</span><span className="product-model-node product-model-node-center">DC</span><span className="product-model-orbit" /></div>
        <div className="product-models-copy"><SectionLabel number="04 /">INTELIGÊNCIA EM PERSPECTIVA</SectionLabel><h2 id="models-heading">O seu contexto.<br /><span>Novas conexões.</span></h2><p>A área de modelos reunirá as integrações e os requisitos efetivamente suportados pelo Deep Code.</p><p className="product-secondary-copy">A relação de modelos e provedores será publicada após validação. Sem uma lista de promessas.</p><span className="product-state-label"><span />INTEGRAÇÕES A CONFIRMAR</span></div>
      </section>

      <section className="product-how section-shell" id="como-funciona" aria-labelledby="how-heading">
        <div className="product-section-heading"><div><SectionLabel number="05 /">EXPERIMENTE A PERSPECTIVA</SectionLabel><h2 id="how-heading">Entre. Explore.<br /><span>Imagine o próximo.</span></h2></div><p>Três maneiras de conhecer o conceito deste site.<br />Sem instalação, cadastro ou execução de IA.</p></div>
        <ol className="product-steps"><li><span className="product-step-number">01</span><h3>Explore o universo.</h3><p>Navegue pela experiência. Ajuste o som e o movimento conforme sua preferência.</p><a className="product-text-link" href="#inicio">Voltar ao início <Arrow /></a></li><li><span className="product-step-number">02</span><h3>Troque de perspectiva.</h3><p>Abra a demonstração conceitual e alterne entre interface, lógica e revisão.</p><a className="product-text-link" href="#demonstracao">Ver demonstração <Arrow /></a></li><li><span className="product-step-number">03</span><h3>Conheça a direção.</h3><p>Leia sobre o projeto e confira o estado de preparação da versão pública.</p><a className="product-text-link" href="#downloads">Estado do lançamento <Arrow /></a></li></ol>
      </section>

      <section className="release-section section-shell" id="downloads" aria-labelledby="download-heading">
        <div className="release-panel">
          <div className="release-topline"><span className="product-state-label"><span />EM DESENVOLVIMENTO</span><span className="release-platform">DEEP CODE / WINDOWS</span></div>
          <h2 id="download-heading">O próximo capítulo<br />está em <span>construção.</span></h2>
          <div className="release-bottom"><p>A versão pública está sendo preparada.<br />O download será habilitado com um arquivo aprovado.</p><div><button className="release-download" disabled aria-describedby="download-status">Download indisponível <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5" /></svg></button><span className="release-download-note" id="download-status">Sem versão de lançamento confirmada.</span></div></div>
        </div>
        <div className="release-update" id="atualizacoes"><div><span className="section-label">REGISTRO DE VERSÕES</span><h3>As novidades começam aqui.</h3></div><p>Ainda não há uma versão pública confirmada para este site. As atualizações serão apresentadas com informações verificadas.</p><span className="release-update-mark"><Arrow diagonal /></span></div>
      </section>

      <section className="faq-section section-shell" id="faq" aria-labelledby="faq-heading"><div className="faq-intro"><SectionLabel number="06 /">ANTES DO PRÓXIMO PASSO</SectionLabel><h2 id="faq-heading">Algumas<br /><span>respostas.</span></h2></div><div className="faq-list">{questions.map((item) => <details className="faq-item" key={item.question}><summary>{item.question}<span className="faq-plus" aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div></section>

      <footer className="product-footer section-shell"><div className="product-footer-top"><a href="#inicio" className="product-footer-brand" aria-label="Deep Code, voltar ao início">Deep Code<span className="product-brand-provisional">MARCA TIPOGRÁFICA PROVISÓRIA</span></a><a className="product-footer-back" href="#inicio">De volta à órbita <Arrow diagonal /></a></div><div className="product-footer-bottom"><p>© 2026 Deep Code. Em desenvolvimento.</p><nav aria-label="Navegação do rodapé"><a href="#visao">Visão</a><a href="#demonstracao">Demonstração</a><a href="#downloads">Downloads</a><a href="#faq">FAQ</a><a href="https://github.com/sameque00-source/Site-Deep-Code" target="_blank" rel="noreferrer">GitHub <Arrow diagonal /><span className="section-sr-only"> (abre em nova aba)</span></a></nav><span className="product-footer-coordinate">FEITO PARA O QUE VEM A SEGUIR.</span></div></footer>
    </>
  );
}
