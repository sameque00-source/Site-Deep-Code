# Testes e validação V1

Executados em Linux cloud, Node 24.22.1 e Chromium 156.0.8078.79 headless/SwiftShader. Não são testes físicos do Windows, da RX 580 ou de um smartphone.

| Verificação | Resultado |
| --- | --- |
| Reinstalação por `npm ci --cache /tmp/deep-code-npm-cache --no-audit --no-fund` | Passou, lockfile preservado |
| `npm run typecheck` | Passou, incluindo aplicação, testes e configs |
| `npm run lint` | Passou, zero warnings |
| `npm run test` | 10 testes passaram: 7 áudio, 3 política de qualidade |
| `npm run build` | Passou, incluindo pré-renderização HTML |
| Playwright contra build de produção | 11 passaram, zero falhas/skips/flaky na execução final |
| Profiling final P01–P08 | Duas execuções, 16 cenários válidos; limitações de performance registradas |

## Cobertura real do navegador

1. Conteúdo pré-renderizado navegável com JavaScript desativado.
2. Falha simulada da API WebGL: fallback, conteúdo e downloads desabilitados.
3. Modo Sem 3D: seções/FAQ úteis, nenhum canvas ou executável.
4. Menu mobile: abertura, Escape, retorno de foco e navegação por hash.
5. Layout: sem overflow em 1920×1080, 2560×1440, 1440×900, 1366×768, 1024×768, 768×1024, 390×844, 360×800 e 844×390.
6. Cena WebGL real: draw calls/triângulos, frames, reação ao ponteiro, resize e perda real de contexto usando `WEBGL_lose_context`.
7. Movimento reduzido: cena estática e conteúdo preservado.
8. AudioContext real no Chromium: gesto, fontes ativas e ausência de autoplay após reload.
9. Pausa e retomada: contador de frames para/retoma.
10. Demonstração: abas por clique/setas, foco, painel e reinício.
11. Scroll rápido: saídas/reentradas e retomada do loop.

Os testes unitários de áudio usam mocks para controlar promises e descarte; isso é diferente do teste com AudioContext real. O caso de indisponibilidade gráfica intercepta explicitamente a API; o caso de contexto perdido usa a extensão real. Nenhum deles prova desempenho de GPU física.

## Execução de produção usada

```sh
PLAYWRIGHT_BASE_URL=http://127.0.0.1:4174 PLAYWRIGHT_SERVER_COMMAND='npm run preview -- --host 127.0.0.1 --port 4174 --strictPort' TEST_PRODUCTION=1 DEEP_CODE_ARTIFACTS_DIR=/tmp/deep-code-production-final npm run test:e2e
```

Variáveis inline acima usam Bash. O `npm run test:e2e` padrão inicia/reutiliza dev em 4173 e omite o caso que exige HTML pré-renderizado; para executá-lo, usar build + preview e as variáveis correspondentes. Os artefatos padrão vão para diretório temporário do sistema; `DEEP_CODE_ARTIFACTS_DIR` permite escolher outro destino.

Resumo sanitizado: [v1-validation.json](evidence/v1-validation.json). Relatório bruto/traces/capturas da execução: `/tmp/deep-code-production-final/`. As imagens deste site são próprias, não da referência.

## Falhas identificadas e corrigidas

- Import de fonte inexistente: substituído por WOFF2 latino real auto-hospedado.
- Overflow de 3 px: origem nos anéis decorativos da seção de modelos, corrigido no próprio quadro.
- Visibilidade: usar o último registro do lote de IntersectionObserver evita suspensão obsoleta após scroll rápido.
- Instrumentação: separar frames da janela e tempo da automação; erros agora resultam em saída não zero.
- Smoke dev após `npm ci`: cache otimizado antigo causou 504 e página vazia. Servidor reiniciado; pré-renderizador passou a usar cache independente. A suíte final de produção passou; smoke separado confirma desenvolvimento após reinício.

## Limites

Ainda faltam dispositivos físicos, 4K, avaliação auditiva, contraste/árvore acessível completos, screen readers, teste térmico, soak prolongado, profiling de GPU/VRAM e asset final. Capturas e testes estruturais não constituem aprovação artística cinematográfica. Não se declara conformidade WCAG integral ou prontidão de produção.
