# Animações e interações reais

| Elemento | Input | Resultado implementado |
| --- | --- | --- |
| Câmera/astronauta | Pointermove / saída / scroll | Offset limitado e amortecido por delta time, retorno ao centro |
| Intro | Primeira montagem da cena | Aproximação/acomodação curta; não bloqueia navegação |
| Conteúdo | Entrada na viewport | Reveal de 18 px / opacidade, 650 ms; conteúdo de produção existe antes de JS |
| Menu | Clique / Escape / link | Dialog nativo, foco contido/retornado e URL por hash |
| Cabeçalho | Scroll | Header fixo mais compacto; rAF de UI cancelável |
| Demonstração | Clique, setas, Home/End | Troca de cenário e painel, foco por tablist, anúncio acessível |
| Reiniciar | Botão da demo | Retorna ao primeiro cenário; não executa código do aplicativo |
| FAQ | Clique / teclado | Details nativo, expansão real |
| Qualidade | Select | Auto/Ultra/Alta/Equilibrada/Leve/Sem 3D |
| Movimento | Pausar/retomar / preferência do sistema | Suspensão efetiva do loop ou apresentação estática |
| Som | Gesto explícito / mute | Barramento e cues próprios; nunca em cada pointermove |

CSS usa tempos diferentes para respostas pequenas e entrada de menu; as transformações 3D têm um único dono. Scroll não é sequestrado. Links internos preservam histórico/retorno e continuam disponíveis no HTML. O menu pausa a cena enquanto seu overlay a cobre.

Não há troca real de rotas de aplicação, transição entre múltiplas cenas independentes ou demonstração funcional do aplicativo Windows. Os cenários HTML são conceitos editoriais identificados na tela. Não foram medidas nem copiadas timelines do Lusion.

Com movimento reduzido, smooth scroll/reveals longos e idle são suprimidos; conteúdo e ações permanecem. Eventos, observers, timers e rAF têm cleanup. Testes de comportamento e capturas estão descritos em `TESTES_VALIDACAO.md`.
