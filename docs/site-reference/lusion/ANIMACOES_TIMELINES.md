# Animações e linhas do tempo

**Nenhuma animação do Lusion foi capturada. Não há durações ou easings medidos da referência.** O erro de navegação em E03 ocorreu antes do conteúdo; tempo de erro do proxy não é tempo de loading do site.

## Cobertura sistemática pendente

Os IDs abaixo são casos de investigação, não confirmação de que todos esses efeitos existem.

| ID | Estado inicial / gatilho | Quadros e estados a examinar | Fim / reversão | Estado |
| --- | --- | --- | --- | --- |
| T01 | Contexto novo → abrir home | Primeiro paint, loader, primeira cena, interface utilizável | Repouso; nova sessão | NT |
| T02 | Alvo visualmente confirmado → hover | Início, resposta inicial, transformação, estabilização | Pointer fora, retorno | NT |
| T03 | Controle de menu confirmado → clique | Disparo, overlay, itens, foco | Escape/fechar; restauração de foco | NT |
| T04 | Página pronta → scroll | Posições intermediárias, paradas, inversão | Voltar à posição inicial | NT |
| T05 | Link de rota confirmado → clique | Saída, troca de conteúdo/URL, entrada | Voltar/avançar do navegador | NT |
| T06 | Cena pronta → mouse em trajetórias | Corpo, câmera, luz e interface separadamente | Ponteiro parado e mouseleave | NT |
| T07 | Cartão/projeto confirmado → abrir | Thumbnail, expansão, loader, cena/vídeo | Voltar/fechar | NT |
| T08 | Mesmo estado → resize | Reflow, reposicionamento, resolução e fallback | Restaurar dimensões | NT |
| T09 | Controle de som confirmado → clique | Mudança visual e primeiro som | Silenciar/reabrir/navegar | NT |

## Método temporal

1. Registrar sessão, viewport/DPR, URL, cache, preferência de movimento, hardware/renderer e interação exata. Repetir ao menos três vezes quando possível para observar variação.
2. Capturar antes do input. Registrar a marca monotônica do envio do evento e separar envio, dispatch no DOM e primeiro efeito visual; não são o mesmo instante.
3. Amostrar, inicialmente, em 0/50/100/200/400/800/1200/2000 ms após o disparo; adaptar a janela ao movimento observado. Esses números são **plano de amostragem**, não durações do Lusion.
4. Guardar tempo real de início e término de cada screenshot. Screenshot tem custo; o instante do bitmap está dentro dessa janela, não exatamente no offset pretendido.
5. Identificar onset, key poses, overshoot, assentamento e retorno. Se houver movimento contínuo, definir fim da transição separadamente do idle.
6. Para maior precisão, usar screencast/gravação com timestamps e frame tracing numa execução separada. Captura visual altera a carga e não deve compartilhar a sessão de benchmark.

## Análise de curva

Medir uma propriedade observável (posição/opacidade/escala projetada) e normalizar progresso `p(t)`. Comparar diferenças entre amostras para aceleração e desaceleração. Um ajuste aproximado de curva não prova valores de `cubic-bezier`, GSAP, física ou damping internos. Registrar ajuste como H, com erro/resíduos e resolução temporal.

Formato da futura timeline:

`ID | t_input | t_onset | keyframes (tempo real, propriedade) | t_estável | retorno | n | variação | ID de evidência`.

Nenhuma timeline vazia deve ser preenchida com durações convencionais de design para parecer medição. Durações de propostas próprias devem aparecer como P em um documento de implementação futuro.
