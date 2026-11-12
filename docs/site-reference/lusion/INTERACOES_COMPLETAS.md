# Matriz funcional de interações

Matriz de **cobertura pendente**, não lista de comportamentos confirmados. E03 impediu visualizar elementos e selecionar alvos reais. `NT` não significa que o recurso não existe.

| Elemento | Página | Evento | Estado inicial | Transformação | Duração | Resultado | Evidência | Confiança |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Documento de entrada | `/` | Navegação HTTPS | Contexto desktop novo | Conexão de túnel falhou antes do HTML | Não medida | Sem conteúdo do site | E02/E03 | Alta, somente quanto ao bloqueio |
| Cursor/cena, se houver | Não localizada | Pointermove lento/rápido, parada e saída | NT | NT | NT | NT | Pendente | Indeterminada |
| Texto/link visível | Não localizado | Hover, focus, clique | NT | NT | NT | NT | Pendente | Indeterminada |
| Botão | Não localizado | Hover, teclado, pointerdown/up | NT | NT | NT | NT | Pendente | Indeterminada |
| Imagem/cartão | Não localizado | Hover, clique, manter pressionado | NT | NT | NT | NT | Pendente | Indeterminada |
| Menu | Não localizado | Abrir, fechar, Escape, Tab | NT | NT | NT | NT | Pendente | Indeterminada |
| Rolagem vertical | Não localizada | Wheel, trackpad, PageDown | NT | NT | NT | NT | Pendente | Indeterminada |
| Área horizontal, se houver | Não localizada | Scroll/drag, Shift+wheel | NT | NT | NT | NT | Pendente | Indeterminada |
| Parallax/câmera, se houver | Não localizada | Pointer e scroll separados | NT | NT | NT | NT | Pendente | Indeterminada |
| Objeto arrastável, se houver | Não localizado | Drag e pointercancel | NT | NT | NT | NT | Pendente | Indeterminada |
| Link interno/projeto | Não localizado | Clique, abrir nova aba, back/forward | NT | NT | NT | NT | Pendente | Indeterminada |
| Controle de áudio | Não localizado | Gesto, mute, retorno à rota | NT | NT | NT | NT | Pendente | Indeterminada |
| Alvo touch | Não localizado | Tap, pan, cancelamento, orientação | NT | NT | NT | NT | Pendente | Indeterminada |
| Foco/skip link | Não localizado | Tab/Shift+Tab/Enter/Escape | NT | NT | NT | NT | Pendente | Indeterminada |
| Loader/fallback de erro | Não localizado | Abertura/fraca conexão/falha de recurso | NT | NT | NT | NT | Pendente | Indeterminada |

## Distinções para a inspeção

- Registrar cursores CSS, DOM e desenhados no canvas separadamente. Comparar atraso entre cursor do sistema e seguidor; não inferir suavização sem trajetória.
- Variar posição e velocidade do mouse independentemente. Repetir a mesma posição vindo de direções distintas para testar memória/inércia.
- Separar hover visual de foco de teclado e de alvo touch. Não disparar um clique por teclado onde não há elemento focável sem registrar essa limitação.
- Testar navegação por URLs e histórico, não apenas cliques que parecem mudar página.
- Observar wheel passivo, inércia e scroll lock do menu; não concluir rolagem horizontal pela presença de um carrossel.
- Registrar loader do próprio site somente após receber conteúdo. A página de erro do navegador desta sessão não é estado de erro projetado pelo Lusion.
- Se houver hold/drag, testar cancelamento e saída do viewport. Não inventar essas interações por associação com sites 3D.

Após acesso, cada linha confirmada deve ganhar seletor/região, estado reproduzível, timeline Txx, evidência e confiança. Linhas que não correspondam a recursos encontrados devem ser marcadas como não encontradas **nas páginas efetivamente testadas**.
