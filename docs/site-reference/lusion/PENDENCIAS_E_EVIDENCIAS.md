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
