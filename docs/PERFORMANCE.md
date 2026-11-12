# Performance medida na V1

**A meta de 90–120 FPS não foi validada.** As duas execuções abaixo usam Chromium headless 156.0.8078.79/Linux e ANGLE/SwiftShader (Vulkan por software), não uma GPU física. Elas identificam limitações do laboratório e do protótipo; não representam o Xeon/RX 580 ou outro computador do usuário.

Código gráfico medido: `9448c28`; build de produção local. Diagnóstico expõe 5 processadores lógicos e 32 GiB via navegador, sem modelo de CPU físico confirmado. Viewport inicial 1440×900/DPR 1; P07 usa 390×844 emulado. Tier LOW automático pela identificação do renderer software. Frequência de monitor, FPS apresentado e custo GPU: não medidos.

## Duas execuções, oito cenários

| Cenário | rAF p50 (ms), exec. 1 / 2 | rAF p95 (ms), exec. 1 / 2 | Frames renderizados na janela, 1 / 2 |
| --- | --- | --- | --- |
| P01 — Hero e astronauta em repouso | 200.0 / 183.4 | 200.1 / 200.0 | 17 / 17 |
| P02 — Movimento contínuo do ponteiro | 183.4 / 183.4 | 200.0 / 200.1 | 17 / 17 |
| P03 — Scroll pelo conteúdo e retorno | 16.7 / 16.7 | 200.0 / 233.3 | 12 / 12 |
| P04 — Transição de scroll e reversão próximo ao hero | 200.0 / 200.0 | 233.3 / 250.0 | 16 / 16 |
| P05 — Astronauta: orientação e acomodação | 200.0 / 183.4 | 216.7 / 200.1 | 17 / 17 |
| P06 — Menu e navegação por seções | 200.0 / 216.7 | 316.7 / 333.3 | 16 / 16 |
| P07 — Cena em mobile emulado390×844, toque não físico | 83.3 / 83.3 | 166.6 / 83.4 | 33 / 41 |
| P08 — Ciclos repetidos curtos: não é soak prolongado | 199.9 / 183.3 | 333.3 / 216.7 | 31 / 34 |

Amostras de aproximadamente 3 s, ou 6 s em P08, após aguardar IDLE real. Todos os 16 cenários finais concluíram sem erro de ação. P08 é repetição curta, não teste de horas. Não houve screenshots durante os benchmarks. Os relatórios contêm média, p99, máximo, long tasks, CPU CDP, heap e duração de cada ação em [v1-performance.json](evidence/v1-performance.json).

rAF mede oportunidades de callback, não prova frames apresentados. A navegação pode suspender o renderer fora de tela ou sob menu; por isso rAF e número de renders diferem. A cauda de uma automação lenta pode ultrapassar a janela de amostra: isso é registrado separadamente, e não amplia artificialmente o contador de frames medido. Snapshots CDP de CPU envolvem a janela com overhead de protocolo; não são cronômetro exato de GPU/frame.

## Resultado e limites

A cena LOW ainda é lenta em SwiftShader, inclusive com latências elevadas no desktop. Não se apresenta essa condição como fluidez aprovada. O modo Sem 3D permanece disponível e preserva conteúdo. Não houve validação de 4K, GPU física, monitor 90/120 Hz, energia/temperatura mobile, VRAM ou sessão prolongada. Heap JS antes/depois não demonstra sozinho ausência de vazamento. LCP/INP/CLS de campo também não foram medidos; continuam metas, não resultados.

Orçamentos matemáticos: 60 FPS ≈16,67 ms; 90 ≈11,11 ms; 120 ≈8,33 ms. O projeto não satisfaz essas metas neste renderer software. Medir hardware alvo antes de aceitar arte/custos definitivos.

## Problemas encontrados e corrigidos

- Overflow mobile de 3 px: anéis decorativos escapavam do próprio quadro; correção localizada na área gráfica.
- P08 inicial: saída e reentrada podiam chegar juntas ao IntersectionObserver, mas só o primeiro registro era aplicado. O último estado agora prevalece; regressão no navegador e duas execuções finais sem timeout.
- Instrumento inicial: ação longa contaminava contadores pós-amostra. Schema 2 captura diagnósticos dentro da janela e separa tempo da automação; falha preserva saída não zero.

## Otimizações efetivas

- Three/astronauta em chunk lazy separado, sem bloquear texto HTML.
- Um renderer; meshes estáticos agrupados por material, geometria reutilizada, estrelas em BufferGeometry.
- DPR limitado por tier; geometria reduzida em LOW e menos partículas/linhas.
- Pausa fora de tela, menu, background e movimento reduzido; relógio reiniciado e recursos descartados.
- Sem texturas pesadas, assets externos, render targets de pós-processamento contínuo ou bloom/DOF. PMREM próprio é produzido uma vez por montagem.

Otimizações restantes devem partir de GPU/CPU física. Baixar DPR não resolve automaticamente scripting; reduzir triângulos não elimina custo do visor/material. Não se deve avaliar qualidade final apenas pelo ambiente software.

## Reprodução

Com o build servido em 4175:

```sh
BASE_URL=http://127.0.0.1:4175 PERFORMANCE_OUTPUT=/tmp/deep-code-production-final/performance.json npm run measure
```

Esse formato de variáveis é Bash. No PowerShell, definir `$env:BASE_URL` e `$env:PERFORMANCE_OUTPUT` antes de `npm run measure`. Saída padrão vai para diretório temporário do sistema. Os JSON brutos originais ficam em `/tmp/deep-code-production-final/performance-final-1.json` e `performance-final-2.json`; o resumo sanitizado versionado permite comparar os resultados.
