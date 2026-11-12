# Performance — medições válidas e lacunas

## Condições reais da sessão

| Condição | Resultado observado | Evidência |
| --- | --- | --- |
| Navegador | Chromium 156.0.8078.79, headless, Linux | E03/E04 |
| Viewport da tentativa | 1440×900 CSS px | E03 |
| DPR na sondagem local | 1 | E04; sondagem separada do site |
| Renderizador local | ANGLE Vulkan / SwiftShader, renderização por software | E04 |
| Processadores lógicos expostos | 5 via `navigator.hardwareConcurrency` | E04; não identifica modelo da CPU |
| Conexão ao alvo | CONNECT 403 / túnel recusado | E02/E03 |
| Conteúdo da referência recebido | Nenhum documento carregado com sucesso | E03 |

## O que não foi medido

FPS do Lusion, frame time, CPU/main thread, GPU, memória do site, bytes transferidos da página, LCP, INP, CLS, tempo de loading, stutter, comportamento por rota e adaptação de qualidade: **NT**. Não há resultados numéricos de performance da referência. O código de erro do curl não é uma medição do servidor de origem.

Não produzir benchmark de uma página em branco, da tela de erro ou de um fallback sem identificar a condição. Não comparar SwiftShader a uma GPU física para concluir que a referência atende ou falha em uma meta de produção.

## Orçamentos matemáticos, não resultados observados

- 120 Hz: `1000 / 120 ≈ 8,33 ms` por oportunidade de frame.
- 60 Hz: `1000 / 60 ≈ 16,67 ms`.

Uma média inferior a 8,33 ms não basta: avaliar percentis, frames perdidos, estabilidade e frequência real de apresentação. Intervalos de `requestAnimationFrame` medem oportunidades de callback e incluem o cadence da tela/navegador, não tempo de GPU nem prova de que um frame foi apresentado.

## Protocolo de profiling após desbloqueio

1. Inventariar GPU/driver, CPU, memória, navegador, refresh físico, viewport/DPR, energia, temperatura e qualidade ativa. Registrar primeiro acesso frio e repetições aquecidas separadamente.
2. Confirmar visualmente que a cena real está renderizando; registrar falhas de shader, WebGL context lost e assets bloqueados. Um teste com fallback deve ter categoria própria.
3. Coletar loading com Network e Navigation/Resource Timing. `transferSize=0` pode significar cache, restrição cross-origin ou outra condição; não interpretar como ausência de custo.
4. Coletar rAF sem screenshots para repouso, mouse, scroll e transição, com duração conhecida. Reportar n, p50/p95/p99, proporção acima de 8,33/16,67 ms e máximo. Limiar ultrapassado não conta frames perdidos com precisão sem referência de vsync.
5. Gravar tracing de Chrome Performance para diagnosticar scripting, style/layout, paint, composição e tarefas longas. A amostra sem tracing serve de referência para avaliar o overhead.
6. Observar métricas CDP `Performance` e heap antes/depois de ciclos de navegação. Heap JS não representa memória total nem VRAM; medir retenção após estabilização, não confundir GC transitório com vazamento.
7. Para GPU, usar ferramentas de profiling compatíveis. `EXT_disjoint_timer_query_webgl2` depende de suporte e de instrumentos ligados ao contexto da aplicação; não se obtém custo GPU real por subtrair FPS do orçamento.
8. Em hardware com 120 Hz, repetir nos tiers alvo e registrar adaptações. Não forçar a flag de Chromium que remove limite de frame para chamar o resultado de experiência física a 120 FPS.

## Meta proposta para o projeto (P)

120 FPS em hardware compatível, fallback estável de 60 e degradação progressiva. O orçamento deve incluir UI, entrada e efeitos além do canvas. Primeira rodada técnica deve definir aparelhos reais e distribuição de custos; não prometer 120 FPS universal.

O helper versionado coleta apenas rAF, long tasks quando suportadas, métricas CDP básicas e metadados de recursos. Não substitui tracing completo, profiling de GPU ou teste em monitor de 120 Hz.
