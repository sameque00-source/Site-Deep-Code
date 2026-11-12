# Registro de evidências e continuação

## Evidências desta revisão

| ID | Fonte / procedimento | Resultado sustentado | Alcance |
| --- | --- | --- | --- |
| E01 | `git status --short --branch`, `git log -3 --oneline`, `git ls-files`, `git ls-remote --symref origin HEAD refs/heads/main` | Checkout limpo, branch inicial `work`, HEAD `8dc42ee…`, `main` remota no mesmo commit, nenhum arquivo versionado | Repositório ativo nesta sessão; não descreve outros repositórios do usuário |
| E02 | `curl -I -L --max-time 25 https://lusion.co/`, repetido uma vez com execução escalada | CONNECT 403 Forbidden, saída 56, resposta do proxy envoy | Origem não alcançada; não é HTTP 403 produzido pelo Lusion |
| E03 | [Registro Chromium desktop](evidencias/acesso-desktop.json) | Tentativa HTTPS em 1440×900 falha com `ERR_TUNNEL_CONNECTION_FAILED` | Nenhum conteúdo visual, DOM, áudio ou cena do alvo confirmado |
| E04 | [Sondagem local](evidencias/capacidades-navegador.json) em página vazia | Chromium 156, WebGL2 via SwiftShader, API AudioContext presente, reduced-motion emulável | Capacidade do instrumento; não comportamento da referência |
| E05 | Leitura de configuração do ambiente e salvamento de rascunho | Rede restrita com preset de package managers e sem domínios customizados; rascunho salvo adicionando `lusion.co` e `api.github.com`, `requires_publish: true` | Persistência confirmada; aplicação/publicação não confirmadas |
| E06 | `gh api repos/sameque00-source/Site-Deep-Code --jq '{default_branch, permissions}'` | Operação recusada: `Forbidden` | API inacessível; Git read/push têm escopo e rotas distintos |
| E07 | [Execução do coletor](evidencias/verificacao-coletor.json) | Falha de navegação registrada e saída 3 preservada; sem respostas de origem | Valida caminho de bloqueio, não coleta bem-sucedida de métricas/capturas |

Não foram versionados IDs internos de configuração, tokens, cabeçalhos de autenticação, variáveis com valores secretos ou arquivos privados. A sondagem de variáveis registrou somente nomes/presença. O registro E03 foi sanitizado para remover códigos de controle da mensagem de erro.

## Evidências temporárias

Diretório local da pesquisa: `/tmp/lusion-audit/`. A screenshot `access-desktop.png` registra a tentativa fracassada, **não uma página da referência**. Logs originais locais: `access-desktop.json` e `capabilities.json`; suas versões sanitizadas estão em `evidencias/`.

Capturas futuras de referência, filmes, traces com conteúdo e gravações de áudio devem ficar fora do checkout. Caminhos temporários podem desaparecer entre ambientes; não constituem arquivo permanente de evidência. A documentação deve conter descrição, ID e método suficientes para reprodução, sem publicar mídia de terceiros.

## Bloqueios e ação externa precisa

1. Nas configurações do ambiente, revisar e salvar o rascunho de rede e publicar o ambiente. Domínios adicionados: `lusion.co` (referência) e `api.github.com` (leitura da API/criação da PR). Não é necessário fornecer um token em chat; a autenticação Git existente funciona.
2. Após aplicação efetiva, retestar a navegação. Se houver redirect ou recursos de outro host bloqueados, registrar **os hosts realmente solicitados** e adicionar apenas os necessários, preservando a allowlist. Não adivinhar CDNs e não liberar acesso irrestrito.
3. Para 120 FPS e som audível, providenciar uma sessão com GPU/monitor e saída de áudio adequados. O ambiente atual pode servir a investigação estrutural, mas SwiftShader não valida desempenho em hardware alvo.

A escalada de execução não foi rejeitada pelo revisor automático: o comando foi executado e o proxy continuou recusando o domínio. O bloqueio é de política de rede em runtime. Salvar o rascunho não liberou automaticamente a rede.

## Ferramenta de coleta reproduzível

`tools/capturar.cjs` usa Playwright e Chromium já presentes. Não instala dependências no projeto e não altera manifests/lockfiles. Usa o proxy existente, sem imprimir seus valores, e mantém verificação HTTPS. Não guarda corpos de responses, cookies, HAR ou áudio. Arquivos resultantes são privados e não devem ser commitados em massa.

Executar a partir do repositório:

```sh
node --check docs/site-reference/lusion/tools/capturar.cjs
node docs/site-reference/lusion/tools/capturar.cjs https://lusion.co/ /tmp/lusion-audit/home-desktop-01 1440 900
```

O diretório final precisa ser novo e estar fora do checkout. A ferramenta recusa sobrescrita. Se Playwright não estiver disponível em uma futura máquina, instalá-lo em um diretório externo ao projeto, com versões verificadas; não modificar o produto apenas para instrumentar a referência.

Para um perfil móvel emulado e preferência reduzida:

```sh
PROFILE=mobile REDUCED_MOTION=reduce node docs/site-reference/lusion/tools/capturar.cjs https://lusion.co/ /tmp/lusion-audit/home-mobile-reduce-01 390 844
```

Após a entrada funcionar e os alvos terem sido observados, criar um JSON local de ação, por exemplo `{"type":"wheel","dy":500}`, e passá-lo como último argumento:

```sh
node docs/site-reference/lusion/tools/capturar.cjs https://lusion.co/ /tmp/lusion-audit/home-scroll-01 1440 900 /tmp/lusion-audit/acao.json
```

Suporta `hover/click/focus/tap` com `selector`, `press` com `key`, `move` com `x,y,steps` e `wheel` com `dx,dy`. Cada sessão contém uma ação, além do estado inicial e amostra rAF de repouso. Navegação, drag, hold e gestos compostos precisam de sessão dirigida adicional; não estão automaticamente cobertos por esse helper.

Não registrar cliques em links de envio, formulários ou ações externas. Para a auditoria, limitar a navegação e controles públicos da experiência.

### Limites do helper

- Validação executada: `node --check` passou; o caminho de navegação bloqueada produziu relatório e saída 3 (E07). Ramos de coleta pós-carregamento e ações ainda não foram executados contra a referência e permanecem sem validação funcional nesta revisão.
- Entrada bem-sucedida e HTTP 200 não provam cena pronta; conferir screenshot, erros e recursos.
- O campo de tempo até DOMContentLoaded é cronômetro do comando de navegação, não LCP ou tempo de carregamento completo.
- Textos/estilos capturados são indícios DOM, não uma análise visual de hierarquia ou de contraste.
- Amostra rAF de 5 s mede callbacks em repouso. Não é benchmark de 120 FPS; inspecionar se a cena estava pronta e informar renderer.
- Ações têm espera/overhead do Playwright. Quadros começam depois de o comando terminar; animações curtas podem já ter ocorrido. Usar gravação/tracing apropriados para onset e timings rigorosos.
- Frames registram janelas reais de captura. Não assumir que todos os offsets planejados foram cumpridos.
- Long tasks só detectam tarefas a partir de 50 ms; não revelam todas as violações de 8,33 ms. `Performance.getMetrics` é snapshot, não perfil de GPU.
- Emulação mobile no Chromium não é teste em iOS/Safari físico. Reprodução e captura de áudio não são verificadas por essa ferramenta.

## Checklist de retomada

| Prioridade | Trabalho | Estado |
| --- | --- | --- |
| P0 | Aplicar rede e confirmar primeira navegação válida | Bloqueado externamente |
| P0 | Descobrir e visitar páginas principais, menu, rodapé, projetos e rotas públicas relevantes | NT |
| P0 | Localizar astronauta na versão atual e caracterizar cenas | NT |
| P0 | Auditar áudio com saída/reprodução efetivamente verificadas | NT |
| P0 | Registrar timelines com onset, estados intermediários, fim e reversão | NT |
| P1 | Preencher matriz de interações com elementos realmente encontrados | NT |
| P1 | Confirmar stack e organização pública de recursos por evidência direta | NT |
| P1 | Medir performance válida por interação; comparar 60/120 em hardware alvo | NT |
| P1 | Viewports, touch, teclado, reduced motion e fallbacks | NT |
| P1 | Trocar propostas preliminares por recomendações vinculadas aos achados reais | Pendente da auditoria |
| P1 | Criar PR de pesquisa quando a API permitir | E06 bloqueia a criação automática |

## Critérios que permanecem abertos

Nenhuma página principal examinada; astronauta não localizado; áudio não ouvido; transições não capturadas; métricas da referência inexistentes. Documentação organizada, proteção do repositório e ausência de incorporação de ativos estão atendidas. A missão 01/08 **não está concluída**.

## Retomada V2

Verificações iniciadas em 12/11/2026 às 18h30, horário de Brasília. Esta seção acrescenta fatos ao histórico E01–E07, sem apagar ou reinterpretar as tentativas anteriores.

| ID | Nova evidência | Resultado e limite |
| --- | --- | --- |
| E08 | [Revalidação V2](evidencias/revalidacao-v2.json), estado Git e leitura do rascunho | Local/remoto da pesquisa em `9992c6d…`; `main` em `8dc42ee…`; árvore inicialmente limpa, diff nulo contra a primeira entrega. Draft revisão 3, mesmos domínios e mesma base declarada da leitura anterior. Isso não informa versão efetiva da máquina. |
| E09 | [CONNECT/API na retomada](evidencias/revalidacao-v2.json) | Um novo teste HTTPS ao Lusion: CONNECT 403, curl 56, origem não alcançada. Um teste API: `Forbidden`, saída 1. Git read funciona. Sem retries de navegador ou liberação de domínios especulativos. |
| E10 | [Validação funcional do coletor V2](evidencias/validacao-coletor-v2.json) | Três casos locais passaram: coleta completa com oito quadros de clique; navegação abortada com saída 3; ação inválida com saída 4 e etapa preservada. Não são páginas, transições ou medições do Lusion. |

### Ambiente e publicação

O executor disponível continua operando em `/workspace`, com o checkout existente em `/workspace/Site-Deep-Code`. Nenhum evento de provisionamento/publicação foi confirmado nesta retomada. Não há ferramenta `environment_status` nem de publicação de ambiente exposta; as ferramentas disponíveis permitem ler e atualizar o **rascunho**, que não atesta a política em execução. Não se pode concluir que a tarefa foi iniciada após publicação apenas pela presença dos domínios no draft.

Nenhuma alteração duplicada de configuração foi salva: a rede restrita já contém `lusion.co` e `api.github.com`, preservando o preset `package_managers`. A referência continua inacessível na máquina atual. Não se inferiu expiração de token, falha do servidor Lusion ou ausência de permissão de escrita Git a partir desses erros.

**Ação do proprietário:** abrir as configurações deste ambiente no Codex Cloud, conferir os dois domínios, revisar/salvar as mudanças e publicar o ambiente. A ferramenta da primeira sessão retornou `requires_publish: true`; esta sessão não dispõe de ação que execute essa publicação. Não solicitar nem colar tokens no chat.

Depois da publicação, tentar a retomada com a versão publicada. O produto pode restaurar/reconectar o ambiente de onboarding. **Se esta tarefa continuar ligada à política antiga**, iniciar uma nova tarefa selecionando o ambiente publicado é necessário para usar uma instância atualizada. Não há evidência de que uma nova tarefa seja sempre obrigatória nem garantia de que o draft já tenha sido aplicado; a confirmação será um CONNECT/navegação reais bem-sucedidos. Na nova instância, recuperar `research/lusion-reference` antes de editar e preservar alterações locais se houver.

Nenhum outro host do Lusion foi descoberto: sem HTML e requests de recursos não há evidência para ampliar a lista. Não foram usados túneis, desativação de TLS ou outros caminhos para contornar a política.

### Quadro de cobertura V2

| Área | Estado anterior | Estado atual | Evidências | Pendências |
| --- | --- | --- | --- | --- |
| Acesso HTTPS | Bloqueado | Continua bloqueado no proxy | E02/E03 → E09 | Aplicar/publicar a configuração e testar runtime |
| Git / API | Git funcional; API bloqueada | Leitura Git funcional; API continua bloqueada | E06 → E08/E09 | PR quando API estiver acessível |
| Páginas | Nenhuma analisada | Nenhuma analisada | E09 | Descobrir home, navegação, projetos e Labs se houver links públicos |
| Astronauta | Não localizado | Presença no Lusion NT; astronauta original obrigatório por instrução V2 | E09 + requisito do usuário | Investigação real após acesso |
| Áudio | NT | NT; nenhum efeito ouvido ou inferido como confirmado | E09 | Playback/controles/eventos e saída verificável |
| 3D | Não analisado | Não analisado | E09 | Cenas, câmera, materiais e evidência de renderização |
| Animações | Sem timelines observadas | Sem timelines observadas | E09 | Captura temporal de estados reais |
| Interações | NT | NT na referência; coletor testado em fixture própria | E10 | Alvos e eventos reais |
| FPS | Não medido | Não medido no Lusion | E09/E10 | Não confundir teste do instrumento com benchmark do alvo |
| Mobile | Não analisado | Não analisado | E09 | Desktop/tablet/mobile, teclado, reduced motion e toque |
| Segurança do repositório | Branch isolada | Histórico e evidências preservados | E08 | Continuar sem merge/deploy |

### Melhorias incrementais do coletor

Necessidade demonstrada pelo código anterior: faltavam hosts solicitados/falhos resumidos, identificação de teste e etapa de interrupção. A espera fixa de 1500 ms também não podia representar readiness de uma cena.

- `TEST_ID` vincula a execução a um caso (letras, números, `_` e `-`, até 80 caracteres); é opcional.
- `READY_SELECTOR` espera um seletor visível previamente observado. Seu sucesso **não prova cena 3D pronta**: `sceneVisuallyVerified` permanece `false` até avaliação externa. Sem esse parâmetro, a espera fixa continua explicitamente identificada.
- `networkSummary` registra hosts realmente solicitados, falhos e com status HTTP ≥400. Falha de host não implica bloqueio administrativo; validar erro/política antes de pedir liberação.
- Etapas e metadados de responses/falhas têm timestamps monotônicos relativos à execução. Não são timestamps exatos de dispatch de input nem de onset visual.
- Mensagens de console são contadas por tipo sem salvar texto; erros de coleta preservam etapa e categoria, omitindo mensagem/stack potencialmente sensíveis.
- Saídas: 0 para coleta completa, 3 para navegação malsucedida e 4 para falha posterior/inicialização instrumentada. Erros de argumentos fora da sessão mantêm tratamento de erro próprio. O resumo diferencia `navigationOK` de `collectionOK`.

Exemplo após identificar um seletor de readiness real:

```sh
TEST_ID=HOME_D01 READY_SELECTOR='SELETOR_OBSERVADO_NA_INSPECAO' node docs/site-reference/lusion/tools/capturar.cjs https://lusion.co/ /tmp/lusion-audit/home-d01 1440 900
```

O seletor acima é marcador, não um seletor conhecido do Lusion. Não executar assumindo que exista.

A validação E10 usou Chromium real com requests interceptados e respondidos por HTML próprio em um domínio `.invalid`, sem contato externo. Conferiu espera de seletor, ação, quadros, amostra rAF, classificação de hosts, erros de coleta e omissão de textos/queries sintéticos. Capturas e fixtures permanecem em `/tmp/lusion-v2/`; apenas o resumo sanitizado foi versionado. Esses testes não removem a necessidade de validar o coletor contra cenas reais nem corrigem sua limitação de começar quadros após o comando de interação.

### Decisão de continuidade

**MISSÃO 01/08 BLOQUEADA.** Não iniciar 02/08. A implementação original futura continua condicionada à auditoria efetiva. Não houve instalação redundante, busca pelo aplicativo separado, extração de assets, tentativa de publicação do site ou deploy. A pesquisa opcional de REA não foi iniciada: não resolveria o bloqueio de acesso e não há necessidade comprovada de outra ferramenta.

## Missão especial — continuação REA

O novo pedido exigiu verificar/instalar REA e preparar pesquisa no Windows. Em 12/11/2026, às 19h35 (Brasília), constatou-se que a sessão ainda executava no Linux cloud. Não há canal de terminal/controle do computador Windows exposto a este agente. A instrução textual “você é Claude Code no Windows” não muda o executor real. Nenhum disco local, perfil pessoal ou configuração do Claude foi acessado.

O histórico acima continua descrevendo as sessões anteriores. A disponibilidade do REA mudou nesta sessão; a indisponibilidade da referência não mudou.

| ID | Evidência nova | Resultado / limite |
| --- | --- | --- |
| E11 | [Sessão e conectividade](evidencias/sessao-especial-acesso.json) | Cloud Linux, Node 24.22.1/npm 11.9.0/Chromium 156; Git remoto pesquisado em `c5233f4…`, árvore inicialmente limpa; CONNECT 403, API `Forbidden`, Chromium termina na fase `navigation`, saída 3. Nenhuma origem do Lusion recebida. |
| E12 | [REA oficial e testes CLI/CDP](evidencias/rea-cli-verificado.json) | REA 6.9.0/MIT; npm SRI validado, engines compatíveis; instalação externa sem scripts/global/MCP. Alvo correto, DOM, análise de um script, PNG validado e navegação real da fixture observada. Não foi pesquisa de terceiros nem teste Windows. |
| E13 | [Coletor portátil](evidencias/validacao-portabilidade-coletor.json) | Sete verificações funcionais: coleta/quadros, erro de navegação, erro de ação, rejeição de saída no checkout, symlink ao checkout, helper externo com dependência explícita e raiz divergente. Windows/macOS/headed não executados; CDP attachment não implementado. |

### Estado de acesso e cobertura

Novas tentativas nesta sessão foram limitadas a uma rodada curl/Chromium e uma consulta API. Não houve loop de retries nem uso de caminhos alternativos para contornar o proxy. O draft de rede continua contendo `lusion.co` e `api.github.com`; não foi regravado nem publicado por este agente. Nenhuma outra CDN foi descoberta. A publicação continua dependendo do produto/proprietário conforme o procedimento da V2.

| Área | Estado atual após missão especial |
| --- | --- |
| Páginas e rotas Lusion/Labs/projetos | Zero páginas examinadas; links públicos ainda não descobertos |
| Composição/layout/tipografia | B; nenhuma medida, fonte ou paleta atribuída à referência |
| Cenas/astronauta/câmera/luz/shaders | B; presença do astronauta continua não verificada |
| Interações/animações/timelines | B; quadros de testes locais não são evidência de movimentos do Lusion |
| Áudio | NT/B; nenhum efeito ouvido, capturado ou confirmado |
| Performance e mobile | B; nenhuma medição de FPS/CPU/GPU da referência, nenhum dispositivo físico |
| REA | CLI e superfícies CDP testadas funcionais em fixture Linux; MCP não configurado |
| Windows local | NT; necessário executar a continuação em agente realmente aberto no PC |
| Propostas originais | Especificação de astronauta, jornada, arquitetura, áudio e tiers candidatas documentadas |

### Artefatos locais e transferência

- REA instalado em `/tmp/lusion-rea-runtime`; origem/inspeção em `/tmp/lusion-rea-inspection`. Não pressupor que `/tmp` sobreviva a uma nova máquina.
- Capturas/fixtures locais do instrumento permanecem fora do checkout, em `/tmp/lusion-portable` e nos diretórios temporários da validação REA. Perfil/servidor/browser próprios desse teste foram encerrados. Nenhum processo alheio foi encerrado.
- [REA_E_EXECUCAO_WINDOWS.md](REA_E_EXECUCAO_WINDOWS.md) contém comandos CLI realmente testados e um procedimento Windows claramente marcado como não executado. Não houve instalação em D:, acesso a E: ou confirmação da RX 580/16 GB.
- Somente documentação, ferramenta própria e resumos sanitizados são compartilháveis. Dumps REA podem conter conteúdo/storage/metadados não apropriados para publicação; não enviá-los em massa ao GitHub. O resumo E12 foi reduzido a evidências próprias e procedência pública.
- Os 22 tópicos solicitados foram consolidados no [índice](README.md), mantendo os 12 documentos existentes e acrescentando apenas duas especificações/procedimentos substanciais. A reorganização não satisfaz critérios visuais pendentes.

### Próximo passo preciso e decisão

Para executar a missão **no Windows**, abrir esta pesquisa em um agente/terminal que realmente rode no PC, recuperar `research/lusion-local-rea`, verificar ferramentas e iniciar Chrome com perfil exclusivo/CDP loopback segundo o procedimento. Isso é transferência de executor, não instalação de mais pacotes no cloud. Antes de capturar conteúdo, confirmar que a página e a cena públicas realmente carregam nesse computador.

Alternativamente, aplicar/publicar a rede do cloud conforme a V2 e confirmar HTTPS efetivo. A instalação do REA não libera a rede nem cria acesso ao PC. Não iniciar a missão 02/08, não reutilizar ativos da referência e não declarar cobertura visual até a navegação funcionar.

**PESQUISA BLOQUEADA — EVIDÊNCIAS INSUFICIENTES.** Houve avanço verificável em instalação/validação e transferência, mas o núcleo da pesquisa do Lusion continua impedido.
