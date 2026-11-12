# Entrega de desenvolvimento — Deep Code V1

## Código real, testado

A branch `feature/deep-code-website-v1` nasce de `13b9af7`, preservando pesquisa e main. A implementação inclui React/TypeScript/Vite, Three lazy, hero e astronauta procedural original, materiais/reflexos/luzes próprios, câmera/input/scroll, menu modal, conteúdo editorial, demonstração HTML interativa, áudio Web Audio opt-in e fallback.

A página contém projeto, possibilidades, demonstração, IA, exploração, downloads desabilitados, atualizações sem release inventada, FAQ e footer. Navegação/histórico usam hashes. Marca oficial textual: Deep Code. A logo do aplicativo está ausente; o componente preparado aceita o arquivo autorizado posteriormente.

## Estado honesto

| Classificação | Resultado |
| --- | --- |
| IMPLEMENTADO E TESTADO | Aplicação executável; build pré-renderizado; navegação/menu/foco; demo; controles de áudio; fallback; cena e perda de contexto; tiers/pause; 9 viewports |
| PROTÓTIPO | Astronauta procedural, direção artística provisória, sons sintetizados e janela demonstrativa conceitual |
| IMPLEMENTADO, NÃO TESTADO EM HARDWARE FÍSICO | Renderização e adaptação gráfica em Windows/mobile/monitores 90–120 Hz |
| BLOQUEADO | Logo original e interface/recursos reais do aplicativo não disponibilizados neste executor cloud |
| PLANEJADO | Asset/rig final, sound design final, validação física, conteúdo comercial confirmado, releases aprovadas e preparação de lançamento |

Dez testes unitários e doze de navegador passaram (11 na suíte completa e um caso adicional de touch emulado); dois runs P01–P08 concluíram após corrigir suspensão e instrumento. Os dados em SwiftShader mostram desempenho baixo; **90–120 FPS não atingidos/validados neste ambiente**. Ver [performance](PERFORMANCE.md) e [testes](TESTES_VALIDACAO.md).

## Arte e identidade

Astronauta high: 25 meshes/52.248 triângulos; low: 25/20.632, antes dos demais objetos da cena. Não há GLB/rig cinematográfico final. Paleta grafite/off-white/laranja e tipografia Space Grotesk/IBM Plex Mono são provisórias, auto-hospedadas e documentadas. Nenhum código, áudio, modelo ou textura do Lusion foi incorporado. A investigação bloqueada não foi repetida.

## Execução e revisão

Comandos no [README](../README.md). Servidor de desenvolvimento em `http://127.0.0.1:4173/`, com atualização automática Vite na máquina executora. Build servido internamente em 4175 para testes; nenhum deploy público. A abertura no navegador do aplicativo foi solicitada; acesso pelo localhost do Windows não foi confirmado.

Prioridades seguintes: importar logo legítima; obter interface/build autorizadas para substituir o conceito; desenvolver asset original final; medir e otimizar em GPU física; revisar áudio, acessibilidade e lançamento. A primeira versão é uma base funcional para avaliação, não uma aprovação automática de produto premium/produção.

A main não foi mesclada e não há executável distribuído, domínio, DNS ou cobrança configurados. As evidências versionadas contêm apenas dados/capturas da implementação própria; pesquisa anterior permanece intacta em `site-reference/`.
