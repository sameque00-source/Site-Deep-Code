# Astronauta original — especificação candidata

**Classificação integral: P (proposta independente).** Não descreve um personagem observado no Lusion. Nenhuma cena da referência foi alcançada; sua presença continua NT. Este documento atende ao requisito explícito do usuário de um astronauta próprio e não autoriza iniciar a implementação definitiva.

## Função e identidade

O personagem é um explorador que orienta a passagem entre apresentação e demonstração de programação. Deve conduzir o olhar para conteúdo real do aplicativo, sem cobrir texto ou transformar navegação em um jogo obrigatório.

Direção candidata: traje de exploração com painéis técnicos assimétricos, visor de borda descontínua e uma luz de orientação no antebraço. A silhueta deve funcionar em miniatura e em monocromia. Evitar marcas de agências espaciais, logos, decalques e proporções que reproduzam outro personagem. Esses elementos são uma proposta de concept, não assets produzidos ou uma identidade comercial aprovada.

Produzir concept próprio frontal/lateral/traseiro, paleta, mapa de materiais e turnaround antes da modelagem. Nome, logotipo e paleta final do produto continuam em aberto. Revisão de originalidade deve comparar silhueta, traje e coreografia com referências usadas pelo artista.

## Modelagem, materiais e rig

- Malha deformável com loops em ombros, cotovelos, quadris e joelhos; capacete/visor com partes rígidas. Evitar detalhes geométricos que não sobrevivam ao tamanho em tela.
- Rig candidato com root global, quadril, coluna, pescoço/cabeça e cadeias de membros. Dedos individuais somente se os planos próximos justificarem custo. Isso é especificação de produção própria, não alegação de IK/rig da referência.
- Materiais candidatos: tecido fosco, juntas elastoméricas, placas semimetálicas e visor com reflexo de ambiente. Preferir reflexão de ambiente pré-produzida própria antes de introduzir refração/reflexos de tela caros.
- Reutilizar atlas e materiais quando preservar qualidade. Baking de detalhes em normal/occlusion, mapas de dados em espaço linear e cor em sRGB; confirmar fluxo no motor escolhido.
- Entregar arquivos-fonte do artista, modelo web exportado, clips, poses de referência, autoria/licenças e planilha de custos. Não usar nenhum arquivo extraído do Lusion.

## Estados e arbitragem

| Estado próprio | Entrada | Resposta proposta | Interrupção / saída |
| --- | --- | --- | --- |
| A0 — apresentação estática | Antes dos recursos essenciais | Poster original e conteúdo HTML imediatamente legível | Modelo pronto ou permanência no fallback |
| A1 — introdução | Cena pronta e movimento permitido | Entrada breve com acomodação de câmera e pose | Skip disponível; scroll não deve ficar preso |
| A2 — repouso | Introdução encerrada | Oscilação sutil; mãos e luz com variação pequena | Interação, saída de seção, aba oculta |
| A3 — orientação | Ponteiro ou foco em alvo relevante | Cabeça/torso orientam a atenção; sem movimento de olhos presumido dentro de visor opaco | Retorno suave ao repouso |
| A4 — transição narrativa | Navegação/scroll cruza estado da jornada | Pose e câmera conduzem ao conteúdo demonstrativo | Cancelamento/reversão a partir do estado atual |
| A5 — fora de cena | Seção oculta ou aba em background | Render/animação suspensos quando seguro | Restaurar sem salto e sem repetir introdução |
| AF — movimento reduzido/fallback | Preferência ou capacidade inadequada | Pose estática original; conteúdo e controles completos | Reavaliar somente quando preferência/capacidade mudar |

Um único controlador deve escrever a transformação base do personagem; a orientação por input deve compor um offset limitado. Outro controlador é dono da câmera. Timeline de rota, scroll e hover não devem disputar as mesmas propriedades.

## Movimento candidato e limites

Definir velocidade máxima, raio de deslocamento e envelopes de rotação por clip. Como ponto de partida artístico, testar orientação de cabeça de até ±12° no yaw e ±6° no pitch e deslocamento do corpo menor que 2% da altura visível. São limites iniciais propostos, não medições, e devem ser ajustados por legibilidade e conforto.

Usar interpolação dependente de tempo (`dt`) para preservar sensação em 60/120 Hz. Em interrupções, começar da pose corrente, sem reset para o primeiro keyframe. Não integrar indefinidamente durante aba oculta; limitar o passo de retorno. Reentrada de cursor deve evitar teleporte de orientação.

No touch, não depender de hover nem impedir o gesto de scroll. Oferecer reação discreta a foco/ativação de controles reais. Não substituir isso por drag corporal obrigatório. Com movimento reduzido, remover flutuação contínua, parallax e aproximações de câmera; a hierarquia visual deve permanecer clara.

## Orçamentos candidatos, sujeitos a profiling

| Tier | Teto inicial de triângulos do personagem | Texturas: maior dimensão por mapa | Efeitos candidatos |
| --- | --- | --- | --- |
| Alto | 35 mil | 2048 px | Ambiente próprio, sombra controlada, pós-processamento somente após medição |
| Médio | 18 mil | 1024 px | Menos efeitos e sombra simplificada |
| Baixo | 6 mil | 512 px | Iluminação simples, sombra de contato aproximada, sem transparência complexa |
| Sem 3D | Nenhum modelo | Poster responsivo próprio | Navegação e conteúdo HTML completos |

Esses tetos são hipóteses de produção para um primeiro asset, não prova de que atendam 120 FPS. Contar draw calls, ossos influentes, transparência/overdraw, tamanho em tela e custo de shader além dos triângulos. Uma textura RGBA8 2048² com mipmaps completos ocupa aproximadamente 21,3 MiB antes de compressão; portanto o orçamento de mapas deve ser explícito, não derivado apenas do tamanho do arquivo baixado.

## Áudio próprio e critérios de aceite

Som não é necessário para entender o personagem. Após gesto habilitador e com áudio ligado, usar apenas efeitos originais/licenciados que comuniquem mudanças de estado. Não sonorizar cada amostra de pointermove. Um mesmo evento semântico deve coordenar pose, luz, UI e cue de áudio, com cancelamento de cues de uma transição interrompida.

Aceitar o personagem somente após testar: originalidade/autoria, silhueta e materiais em tamanhos reais, ausência de oclusão de texto/foco, transições interrompidas, scroll reverso, toque, movimento reduzido, silêncio, troca de aba, tiers e retenção de memória. Validar frames em GPU física com cenários do site; não validar 120 FPS apenas no visualizador isolado do modelo.
