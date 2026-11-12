# Plano original — preparação futura, sem iniciar a missão 02/08

**Todas as recomendações deste arquivo são P: propostas, não conclusões sobre o Lusion.** Não foi possível calibrá-las com a referência visual atual devido ao bloqueio E03. Não iniciar a implementação completa com base em comportamentos inventados.

## O que sabemos sobre o produto

Segundo o usuário, trata-se de um aplicativo desktop de programação com IA, em desenvolvimento e sem nome comercial definitivo. Na V2 foi esclarecido que o OpenCode Dev está em repositório separado. Portanto não se verificaram interface, recursos, plataformas, versões, downloads, integrações, licenças, requisitos de sistema ou métricas de eficácia; não cabe procurar nem modificar esse aplicativo nesta missão.

Antes de escrever textos comerciais ou roteiros de demonstração, produzir uma tabela `recurso → implementação verificável → versão → evidência → apresentação permitida`. Qualquer item sem evidência deve ficar fora da apresentação factual do produto. Não disponibilizar executáveis, CTA de download ativo, data de lançamento ou recursos alegadamente implementados.

## Organização de projeto

O usuário confirmou na V2 que `Site-Deep-Code` é destinado exclusivamente ao website. Isso resolve a dúvida da primeira entrega sobre eventual compartilhamento com o aplicativo. Manter esta pesquisa aqui, na branch existente; não há necessidade de recomendar ou criar outro repositório para o site.

## Arquitetura candidata

| Camada | Candidata | Motivo / condição |
| --- | --- | --- |
| Conteúdo e rotas | HTML semântico renderizado no servidor ou estaticamente; framework leve escolhido após escopo | Acessibilidade e leitura sem depender de WebGL |
| Interface | TypeScript com componentes; React se houver benefícios concretos para janelas/demonstrações | Escolha nossa, não stack confirmada do Lusion |
| Renderização | Three.js como candidata inicial sobre WebGL2; WebGPU apenas após avaliação de suporte | Ecossistema e ferramentas; comparar integração direta e abstrações antes de decidir |
| Coreografia | Máquina de estados e fonte de tempo explícita; timeline própria/GSAP se justificar | Entrada, rota, scroll, ponteiro e áudio não devem competir por estado |
| Personagem | Concept, modelagem, rig e animação originais | Silhueta própria e movimento com função narrativa |
| Recursos | Manifesto por cena, preload mínimo, carregamento progressivo, descarte | Controlar memória, loading e falhas |
| Áudio | Web Audio e barramento mestre, habilitação por gesto, persistência controlada | Sincronia e silêncio acessível; sons próprios/licenciados |
| Qualidade | Tiers com DPR limitado, resolução, partículas, sombras e efeitos escalonáveis | Meta de 120/60 conforme hardware e carga real |
| Observabilidade | Marcas de transição, métricas de frame, contexto perdido, erros e fallback | Verificar qualidade em vez de depender de impressão visual |

Não fixar versões nem instalar a stack de produto nesta missão. A escolha deve considerar conhecimento da equipe, conteúdo, orçamento de arte e resultados da auditoria retomada.

## Modelo funcional sugerido

Separar estados de experiência (`entrada`, `carregamento essencial`, `pronto`, `transição`, `fallback`) de preferências (`áudio`, `movimento`, `qualidade`). A interface deve permanecer operável durante degradação gráfica. Manter um proprietário claro para câmera e transformações; compor influências de scroll e mouse em vez de iniciar animações conflitantes.

Carregar apenas a cena necessária à primeira experiência. Aproximar cenas seguintes sob uma política de memória explícita; priorizar cancelamento, recuperação e estabilidade. Evitar canvas por cartão ou vários loops de render desnecessários. São decisões para validar em protótipo, não prova da arquitetura da referência.

## Direção artística inicial

Construir um universo associado à criação de software: profundidade, escala e luz que conduzam a atenção para uma demonstração verificada. O astronauta original é obrigatório conforme a V2 e pode orientar a experiência, mas não deve encobrir texto, impedir navegação ou existir apenas como ornamento pesado. Seu design não dependerá da extração de um personagem da referência.

Janelas e interações de demonstração devem reproduzir apenas comportamentos reais do aplicativo; quando forem ilustrações, identificá-las claramente. Não usar screenshots fictícios como evidência de produto funcional.

Área de versões/downloads só poderá exibir dados verificados. Preparação estrutural futura não implica lançamento. Nome, logotipo, trilha, materiais, personagem e coreografia precisam de identidade e autoria próprias.

## Matriz de adaptação — dependente de observação

O formato futuro será `Experiência observada | Função visual/interativa | Técnica provável (H ou confirmada) | Implementação original proposta (P) | Complexidade | Risco`. A tabela permanece sem linhas de experiências da referência, pois o acesso continua bloqueado (E09). As candidatas arquiteturais acima não devem ser convertidas em supostos achados para preenchê-la. A primeira linha só deve surgir de uma experiência realmente examinada, com ID de evidência.

## Prioridades futuras, condicionadas à conclusão da missão 01/08

1. **P0 — concluir o bloqueio desta missão:** aplicar a configuração de rede; examinar a referência atual, rotas e personagem; preencher evidências e timelines reais. Não declarar 01 concluída antes disso.
2. **P0 — conteúdo verificável do aplicativo:** em trabalho posterior e escopo autorizado, obter evidências da interface e recursos reais do repositório separado. Definir conteúdo demonstrável sem inventar capacidades ou procurar esse código aqui.
3. **P1 — especificação de experiência:** sitemap próprio, roteiro por estado, direção artística e matriz de interações, incluindo silêncio, teclado, mobile e movimento reduzido. Relacionar cada decisão à função no produto.
4. **P1 — protótipo técnico restrito:** uma cena com arte original provisória, uma transição, uma janela demonstrativa verificada e os fallbacks. Nenhum site definitivo ou deploy nesta missão.
5. **P1 — prova de desempenho:** medir em hardware físico com 60/120 Hz e mobile representativo; comparar fidelidade, custo, tempo de carregamento e memória por tier.
6. **P2 — produção:** somente após decisões anteriores, fechar assets, modelagem, áudio, conteúdo e implementação completa.

## Gates antes da construção completa

- Evidências da referência suficientes para especificar a intenção sem copiar recursos.
- Recursos reais do aplicativo catalogados e aprovados para exposição.
- Personagem e identidade originais definidos, com origem/licença de cada ativo.
- Cena piloto validada em hardware alvo e alternativa acessível funcional.
- Orçamentos de carregamento, memória e frame derivados de medições; 120 FPS tratado como meta condicional.

Nenhum destes gates foi artificialmente dado como cumprido nesta sessão.

## Complemento da missão especial — propostas independentes (P)

O usuário informou que o aplicativo é Windows, baseado no OpenCode e com personalizações próprias. Essa é informação fornecida pelo proprietário, não verificação de funcionalidades ou de uma build. A experiência abaixo é uma candidata de direção; a pesquisa visual da referência permanece bloqueada. Não iniciar implementação definitiva a partir dela.

### Jornada original candidata

| Etapa própria | Função | Conteúdo permitido / cuidado |
| --- | --- | --- |
| Entrada | Apresentar universo e orientação | HTML legível antes do 3D; loading essencial mensurável e opção de avançar |
| Cena com astronauta | Estabelecer presença e foco | Personagem próprio; orientação discreta por input, sem ocultar título/controles |
| Conceito do aplicativo | Explicar finalidade | Nome provisório identificado como tal; sem promessas de recursos não verificados |
| Demonstração | Mostrar uso real | Captura/interface autorizada de versão identificada; diferenciar gravação, ilustração e interação real |
| Recursos e modelos | Explicar capacidades comprovadas | Somente itens com fonte/versão; não inventar provedores, suporte ou disponibilidade |
| Exploração | Permitir escolha de conteúdo | Cards e janelas com navegação semântica, teclado e foco; evitar páginas presas ao canvas |
| Versões e downloads futuros | Preparar informação de lançamento | Dados verificados; nenhum executável ou link ativo sem autorização |
| Encerramento | Concluir narrativa e oferecer navegação | Continuidade visual com conteúdo/rodapé acessível; não exigir som ou animação |

### Componentes e contratos de estado

`ExperienceDirector` coordena eventos semânticos e resolve conflitos entre rota, scroll e input. `SceneHost` detém renderer e ciclo de vida. Cada cena declara recursos, entrada, atualização, suspensão e descarte; `QualityManager` seleciona capacidades; `AudioBus` controla gesto habilitador, preferência e cues. Esses nomes são contratos conceituais propostos, não módulos existentes.

DOM/rotas devem continuar funcionais se `SceneHost` falhar. Abortos de navegação cancelam requests e timelines da cena anterior; recursos compartilhados precisam de ownership/referências para evitar descarte prematuro. Não criar um renderer novo por card. Pausar atualizações desnecessárias quando oculto, mantendo controles e histórico corretos.

Three.js direto é candidato inicial para uma cena central com controle explícito de custo; React Three Fiber pode ser avaliado se a composição declarativa reduzir complexidade. Não usar ambos como dois motores paralelos. Drei deve entrar por utilitários necessários e custo conhecido. GSAP é candidato para timelines finitas; o scroll e o estado ainda precisam de um único proprietário. React/TypeScript podem estruturar janelas/UI, e Vite é candidato a build; decidir SSR/SSG conforme conteúdo e roteamento antes de fixar o sistema. Nada foi instalado como stack do produto.

### Áudio original

Usar evento semântico único para sincronizar imagem e som; o barramento traduz tempo de experiência para `AudioContext.currentTime`, tratando suspensão/resume e latência de saída. Não agendar som apenas no fim de uma Promise de screenshot ou na conclusão tardia de um callback de UI.

Preferência de mute deve prevalecer sobre mudança de cena. Iniciar áudio somente após gesto quando exigido, expor estado por teclado/leitor de tela e manter compreensão em silêncio. Crossfades precisam de cancelamento e ganho mestre; não acumular fontes órfãs em navegações rápidas. Sons próprios/licenciados com procedência documentada. Sem saída audível real, não declarar sincronização validada.

### Tiers e decisões de desempenho

| Tier proposto | Recursos e restrições | Validação necessária |
| --- | --- | --- |
| Alto | Astronauta detalhado, luz/sombra e efeitos selecionados; meta de 120 em hardware compatível | Refresh real, CPU/GPU, p95/p99 e estabilidade em cenários completos |
| Médio | Menor DPR, efeitos reduzidos e LOD intermediário; meta estável conforme dispositivo | Preservar silhueta, hierarquia e legibilidade, com comparação de qualidade |
| Baixo | Materiais/luz simples, partículas limitadas e cena compacta | Interface responsiva sob interação e loading sem pressão excessiva de memória |
| Sem 3D | Poster/arte própria, HTML e demonstração acessíveis | Mesmo conteúdo e navegação; não apresentar como erro irrecuperável |

Escalonar qualidade com histerese e janela temporal para evitar alternância visível. Os limiares só devem ser fechados após profiling. Reduzir DPR ajuda carga de pixels/pós-processamento; não corrige automaticamente excesso de scripting na main thread. Instancing reduz draw calls quando há repetições compatíveis, mas não resolve overdraw de partículas. LOD ajuda geometria distante; compressão reduz transferência, mas decode e memória de GPU ainda devem ser medidos. Relacionar cada otimização ao gargalo confirmado.

### Plano de trabalho futuro para o Codex

Complexidade qualitativa: alta em direção de arte/astronauta e sincronização de estados; alta em compatibilidade/performance; média na estrutura editorial e versões quando houver dados reais. Não há prazo ou custo comercial estimado sem equipe, conteúdo e hardware alvo definidos.

Ordem: concluir observação → especificar estados com evidências → confirmar conteúdo do produto → produzir concept/asset piloto original → protótipo restrito → medir 60/120 Hz e mobile físico → revisar arte e acessibilidade → construir rotas/conteúdo → regressão audiovisual e degradação. A missão 02/08 permanece não iniciada. A [especificação candidata do astronauta](ESPECIFICACAO_ASTRONAUTA_ORIGINAL.md) detalha estados, rig, materiais, tiers e critérios de aceite sem copiar um personagem da referência.
