# Identidade visual

Nome oficial fornecido pelo proprietário: **Deep Code**. Não se usa OpenCode Dev como marca comercial do site.

## Logo oficial — bloqueada por ausência do arquivo

Este executor é Linux cloud e não leu `D:\Deep Code`. A implementação usa somente “Deep Code” tipográfico provisório; não foi gerado um símbolo substituto nem favicon fictício. O rodapé identifica o caráter provisório.

Arquivo necessário: a **logo original efetivamente usada pela versão atual do aplicativo**, preferencialmente SVG vetorial autorizado, com proporções/cores intactas. Na ausência de SVG, fornecer o PNG transparente original de maior resolução, sem ampliar raster pequeno para fingir vetor. Se houver várias variantes, identificar a que o aplicativo usa e a apropriada ao fundo escuro.

Integração preparada: colocar o arquivo autorizado em `public/branding/` e definir `logoSrc` em `src/config/brand.ts`, por exemplo `/branding/deep-code.svg`. O componente preserva proporções com `object-fit: contain`. Revisar contraste, tamanhos e variantes antes de criar favicon/Open Graph. Nenhum arquivo com esse nome foi inventado ou declarado importado.

## Tokens provisórios

| Token CSS | Valor | Uso |
| --- | --- | --- |
| `--bg` | `#0b0d10` | Fundo grafite |
| `--ink` | `#f4f1ec` | Texto principal |
| `--muted` | `#a2a4a7` | Informação secundária |
| `--accent` | `#ff6b35` | Acento laranja provisório |
| `--line` | `rgba(244,241,236,.13)` | Divisores |

Tokens ficam em `src/styles/site.css`; os materiais do personagem têm cores próprias no módulo Three e deverão ser harmonizados quando a marca real estiver disponível. Não se alega ter derivado a paleta da logo inacessível.

Space Grotesk Variable e IBM Plex Mono são auto-hospedadas a partir de pacotes Fontsource, licença OFL. Licenças distribuídas em `public/licenses/`. Textos permanecem HTML; setas/controles usam vetores, evitando glyphs ausentes. Não foram usados fontes, texturas, áudio, modelos, screenshots ou identidade do Lusion.
