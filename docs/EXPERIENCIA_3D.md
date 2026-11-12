# Experiência 3D implementada

**PROTÓTIPO:** o astronauta é uma construção procedural original, não um asset final de produção cinematográfica. O hero informa esse status. Não foi extraído modelo de referência nem anunciado acabamento final que a geometria ainda não tem.

## Conteúdo real

`astronaut.ts` produz corpo por loft elíptico, casco/aro de capacete, visor refletivo, painéis arredondados, peito, mochila, juntas, luvas/dedos e botas. Cabeça e braços têm grupos articulados; não há animação esquelética/IK ou GLB nesta versão. Agrupamento por material reduz chamadas de desenho.

Contagem medida diretamente na árvore gerada: **25 meshes / 52.248 triângulos** em high; **25 / 20.632** em low. A cena adiciona planeta, estrelas e, conforme tier, linhas orbitais; os totais do renderer são maiores. Geometria reduzida não equivale a LOD por distância: o detalhe muda conforme tier.

Materiais Standard/Physical distinguem cerâmica, metal, tecido/juntas, visor e peças emissivas. Um ambiente de estúdio procedural próprio passa por PMREM para reflexos; hemisphere, key, fill, rim e luz inferior dão volume. Tone mapping ACES e saída sRGB. Não há bloom, DOF, ray tracing, sombras dinâmicas ou texturas proprietárias.

## Câmera, cena e input

Câmera Perspective, FOV 36° desktop / 40° mobile; resize usa o retângulo real do host. Um controlador compõe base + scroll + input. Ponteiro influencia orientação de cabeça, torso e câmera; idle tem pequena oscilação. Mouseleave/blur retorna o alvo ao centro. Toque não exige hover nem arraste do personagem.

O mobile reserva uma área própria abaixo do texto. Essa mudança foi feita após capturas mostrarem colisão entre personagem e conteúdo. A redução desktop também preserva botas e rodapé do hero. O fundo vetorial original mantém composição quando o canvas está ausente.

## Estados e falhas

Status de recurso: loading/ready/fallback; estados de animação implementados: INTRO, IDLE, LOOK_AT_POINTER, SUSPENDED e FALLBACK. FOCUS/EXIT e coreografias complexas não estão implementados como estados independentes.

Pausa, menu aberto, documento oculto, host fora de tela e movimento reduzido suspendem o loop. Resize/preferência podem solicitar um frame estático. Ao retornar, o delta é limitado para evitar salto. Em taxas muito baixas, a limitação de dt pode desacelerar o movimento em vez de avançar grandes distâncias.

WebGL indisponível, erro de shader/renderização e perda de contexto passam ao fallback HTML, sem tela preta obrigatória. Não há recursos GLB/texturas externos para carregar nesta versão. Import lazy lento tem timeout e retry no shell. Modelagem artística final, rig exportável e materiais com detalhes próximos continuam pendentes.
