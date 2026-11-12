# Arquitetura efetivamente implementada

## Stack e responsabilidades

React 19.3.1, TypeScript 6.0.3, Vite 8.3.8 e Three.js 0.187.0, versões fixadas no lockfile. Vitest 5.1.0, Playwright 1.62.1 e ESLint 10.14.0 sustentam a validação. Não foram adicionados R3F, Drei ou GSAP: nesta versão, Three direto, amortecimento temporal e CSS resolvem a cena sem mecanismos concorrentes.

| Módulo | Responsabilidade |
| --- | --- |
| `src/app/App.tsx` | Composição, preferências, loading/ready/fallback, timeout, retry e lazy import |
| `components/Navigation.tsx` | Menu modal nativo, foco, navegação/hash e header no scroll |
| `components/Brand.tsx` + `config/brand.ts` | Marca tipográfica substituível por arquivo oficial |
| `experience/SpaceExperience.tsx` | Único renderer, câmera, cena, eventos, render loop e descarte |
| `experience/astronaut.ts` | Geometria/material do protótipo original e partes articuladas |
| `experience/performance.ts` | Tiers e política de histerese por intervalos de callback |
| `experience/audio/` | Web Audio, gesto, preferências, fontes e controle acessível |
| `sections/` + `content/` | Conteúdo editorial e demonstração conceitual substituível |
| `scripts/prerender.mjs` | HTML da página gerado durante build, sem servidor SSR em produção |

## Inicialização e falhas

O HTML de produção já contém conteúdo, navegação e posterior gráfico vetorial próprio. Após hidratação, o chunk de Three é solicitado separadamente; só a cena depende dele. Não há percentual simulado de loading. Após 12 segundos sem readiness, ou em falha de chunk/renderer/shader/contexto, permanece a experiência essencial com opção de nova tentativa.

O status `ready` é emitido após construção e primeira renderização; não indica qualidade artística final ou performance aprovada. A falha simulada da API e a perda real de contexto por extensão WebGL são verificações distintas.

## Estado e ciclo de vida

React mantém preferências e controles; transforms por frame ficam em referências/objetos Three, sem setState a cada frame. Um único render loop escreve câmera/personagem e compõe offsets de input/scroll. Ao suspender, cancela rAF; ao retomar, reinicializa o relógio. Geometrias, materiais, PMREM, observers e listeners são liberados no cleanup.

Escolha manual de qualidade é persistida quando storage existe. Falha de storage não bloqueia a interface. A adaptação automática usa janelas e não considera uma cadência de 60 Hz, isoladamente, uma falha. Informações de renderer/software só orientam o tier inicial, não constituem benchmark de hardware.

Diagnósticos locais: `window.__deepCodeExperience` e `window.__deepCodeAudio?.()`. Não contêm credenciais. Não há backend, chamada a modelo de IA, coleta analítica, formulário externo ou download do aplicativo nesta versão.

O site é uma página com URLs por hash e histórico nativo. Não há domínio definitivo/canonical/sitemap inventados. `robots.txt` e metatag mantêm avaliação sem indexação; lançamento precisa de revisão explícita.
