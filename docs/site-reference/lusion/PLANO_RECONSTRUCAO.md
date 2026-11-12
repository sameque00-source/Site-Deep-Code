# Plano original — subsídio ao Prompt 02/08

**Todas as recomendações deste arquivo são P: propostas, não conclusões sobre o Lusion.** Não foi possível calibrá-las com a referência visual atual devido ao bloqueio E03. Não iniciar a implementação completa com base em comportamentos inventados.

## O que sabemos sobre o produto

Segundo o usuário, trata-se de um aplicativo desktop de programação com IA, em desenvolvimento e sem nome comercial definitivo. O checkout não contém o aplicativo (E01). Portanto não se verificaram interface, recursos, plataformas, versões, downloads, integrações, licenças, requisitos de sistema ou métricas de eficácia.

Antes de escrever textos comerciais ou roteiros de demonstração, produzir uma tabela `recurso → implementação verificável → versão → evidência → apresentação permitida`. Qualquer item sem evidência deve ficar fora da apresentação factual do produto. Não disponibilizar executáveis, CTA de download ativo, data de lançamento ou recursos alegadamente implementados.

## Organização de projeto

O repositório atual está sem código e comporta a documentação da pesquisa. Não há evidência de que seja exclusivamente o aplicativo. Se o aplicativo vier a ocupar este repositório, manter a pesquisa isolada e recomendar um repositório separado para o site, com CI, dependências, releases e permissões próprios. Não criar outro repositório sem necessidade/escopo definido.

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

Construir um universo associado à criação de software: profundidade, escala e luz que conduzam a atenção para uma demonstração verificada. O personagem original pode orientar a experiência, mas não deve encobrir texto, impedir navegação ou existir apenas como ornamento pesado.

Janelas e interações de demonstração devem reproduzir apenas comportamentos reais do aplicativo; quando forem ilustrações, identificá-las claramente. Não usar screenshots fictícios como evidência de produto funcional.

Área de versões/downloads só poderá exibir dados verificados. Preparação estrutural futura não implica lançamento. Nome, logotipo, trilha, materiais, personagem e coreografia precisam de identidade e autoria próprias.

## Prioridades recomendadas para o Prompt 02/08

1. **P0 — concluir o bloqueio desta missão:** aplicar a configuração de rede; examinar a referência atual, rotas e personagem; preencher evidências e timelines reais. Não declarar 01 concluída antes disso.
2. **P0 — inventário do aplicativo:** identificar o checkout correto e executar uma versão autorizada para confirmar recursos e interface. Definir conteúdo demonstrável sem inventar capacidades.
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
