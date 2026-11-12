# Desktop, mobile e acessibilidade

## Cobertura executada

| Perfil | Dimensões CSS / DPR | Resultado |
| --- | --- | --- |
| Desktop, tentativa de entrada | 1440×900; DPR padrão do contexto | Falha de conexão antes do layout (E03) |
| Sondagem local de capacidade | 1440×900 / 1 | WebGL2 e preferência de movimento verificados fora do site (E04) |
| Outros viewports | Não executados no site | Pendente de acesso; repetir o mesmo bloqueio não verificaria responsividade |
| Dispositivo físico | Nenhum | Não disponível nesta sessão |

**Nenhum layout, breakpoint, tratamento mobile ou recurso de acessibilidade do Lusion foi confirmado.**

## Matriz proposta para retomada (P)

| Perfil | Dimensões iniciais | Entrada / cuidado |
| --- | --- | --- |
| Desktop amplo | 1920×1080, DPR 1 | Mouse, teclado, monitor físico com refresh conhecido |
| Desktop base | 1440×900, DPR 1 | Comparação com a tentativa registrada |
| Notebook compacto | 1280×720 | Dobras, menu e conteúdo sem depender de altura grande |
| Tablet | 768×1024 e orientação inversa | Emulação touch; não é teste físico |
| Mobile | 390×844, DPR 3 | Emulação de viewport/input; UA e engine podem não ser Safari |
| Mobile compacto | 360×800 | Legibilidade, alvos e overflow |
| Zoom / movimento reduzido | Zoom real 200%; `prefers-reduced-motion` normal/reduce | Testar separadamente, não simular zoom apenas mudando viewport |

Dimensões são casos de teste, não breakpoints observados. Descobrir breakpoints reais por CSS público/computed e resizing progressivo, quando possível.

## Casos de observação

- Comparar a mesma seção/estado entre dimensões: ordem, alinhamento, títulos, quebra de linha, rodapé, menu, conteúdo fora da tela e elementos fixos.
- Distinguir redução de resolução 3D, reposicionamento de câmera, substituição por vídeo e fallback estático; screenshot isolado não prova qual mecanismo ocorreu.
- Testar hover inexistente, tap, drag versus scroll, pointercancel, orientação e barras móveis do navegador. Emulação não mede pressão térmica, bateria, sensores ou qualidade do driver.
- Percorrer Tab/Shift+Tab e ativar Enter/Espaço onde apropriado; observar foco visível, ordem, controles no canvas, Escape, trapping do modal e restauração de foco.
- Observar semântica DOM/árvore acessível, rótulos de controles, headings, conteúdo alternativo ao canvas e estados de áudio.
- Medir contraste dos pares de texto/fundo nos estados efetivamente renderizados, incluindo fundos animados; não atribuir conformidade WCAG sem medidas e escopo.
- Comparar normal versus movimento reduzido após recarga. Verificar se o conteúdo continua alcançável e se a rolagem não depende da animação.
- Testar mute e início de áudio nos perfis mobile/desktop; diferenças de autoplay devem ser registradas por engine.

## Requisitos originais recomendados (P)

Conteúdo e navegação essenciais em HTML acessível, canvas como camada visual, alternativa estática, redução de movimento, controles de som por teclado e degradação de qualidade por capacidade. Adotar somente depois de projetar os estados reais, sem alegar que são estratégias usadas pelo Lusion.
