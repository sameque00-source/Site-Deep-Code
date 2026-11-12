# REA verificado e continuação no Windows

**Escopo executado: Linux do Codex Cloud. Windows e Chrome do computador do usuário não estão conectados a esta sessão.** Os exemplos Windows abaixo são um procedimento de transferência, não registro de execução local. A referência permanece bloqueada pelo proxy (E11).

## Instalação e procedência efetivamente verificadas (F)

E12: [evidência sanitizada do REA](evidencias/rea-cli-verificado.json). Origem pública `morluto/rea`, commit `a8527d43b8439476f5c9d1497315dfe7dd5e1f38`; pacote npm `rea-agents` 6.9.0, licença MIT, requisito Node `^22.23.4 || ^24.22.1 || >=26.12.1`. O Node 24.22.1 desta máquina atende ao requisito. Isso não confirma a versão instalada no Windows.

Fontes fixadas e inspecionadas:

- [package.json](https://github.com/morluto/rea/blob/a8527d43b8439476f5c9d1497315dfe7dd5e1f38/package.json) e [LICENSE](https://github.com/morluto/rea/blob/a8527d43b8439476f5c9d1497315dfe7dd5e1f38/LICENSE): pacote, engines, aliases CLI, licença e dependência opcional.
- [Instalação](https://github.com/morluto/rea/blob/a8527d43b8439476f5c9d1497315dfe7dd5e1f38/docs/getting-started/installation.md), [CLI](https://github.com/morluto/rea/blob/a8527d43b8439476f5c9d1497315dfe7dd5e1f38/docs/getting-started/cli.md) e [browser observation](https://github.com/morluto/rea/blob/a8527d43b8439476f5c9d1497315dfe7dd5e1f38/docs/guides/web/browser-observation.md): modos e contratos.
- [setupCommands.ts](https://github.com/morluto/rea/blob/a8527d43b8439476f5c9d1497315dfe7dd5e1f38/src/cli/setupCommands.ts) e [Setup.ts](https://github.com/morluto/rea/blob/a8527d43b8439476f5c9d1497315dfe7dd5e1f38/src/application/Setup.ts): efeitos de configuração.

`npx rea-agents setup` continua sendo uma entrada oficial, mas configura integrações MCP/skills dos clientes selecionados e pode envolver provedores opcionais. A CLI funciona sem esse setup. Para este escopo foi escolhida a instalação isolada, sem alterar clientes existentes. A inspeção dos trechos relevantes não constitui auditoria completa de todas as dependências do REA.

Comando realmente executado no Linux:

```sh
npm --cache /tmp/lusion-rea-inspection/npm-cache --prefix /tmp/lusion-rea-runtime install --ignore-scripts --omit=optional --no-audit --no-fund --save-exact rea-agents@6.9.0
node /tmp/lusion-rea-runtime/node_modules/rea-agents/scripts/rea.mjs --version
```

Instalação concluída e CLI retornou 6.9.0. Scripts de instalação não foram executados; Frida opcional omitido; TLS e verificação de integridade npm mantidos. O SRI está registrado em E12 e coincide com o lock. O pacote publicado tem aproximadamente 189,6 MB descompactados, com runtime embutido. Não foram instalados decompiladores nativos. Arquivos em `/tmp` não são uma promessa de disponibilidade em futuras máquinas.

## Funcionamento demonstrado, além de exit zero

Um Chromium próprio, com perfil temporário e CDP em `127.0.0.1:9222`, abriu HTML de teste criado por nós em servidor loopback. O binding foi confirmado em `/proc/net/tcp`. Browser e servidor próprios foram encerrados após o teste.

| Comando CLI 6.9.0 testado | Resultado semântico na fixture |
| --- | --- |
| `list-browser-targets ENDPOINT --format json` | Encontrou a página correta, sem alvos pessoais |
| `inspect-web-page ENDPOINT TARGET_ID --observation-ms 500 --format json` | DOM com H1, BUTTON, CANVAS e SCRIPT; um script observado |
| `analyze-web-bundle ENDPOINT TARGET_ID --format json` | Um script analisado sem falha de parsing |
| `capture-web-screenshot ENDPOINT TARGET_ID --format json` | PNG válido 1280×720, digest conferido |
| `observe-web-session ENDPOINT TARGET_ID --observation-ms 4000 --format json` | Navegação real na fixture observada como `same_document_navigation` |

A observação retornou timestamp `null` nesse evento; não demonstra timing preciso. A inspeção foi `policy_filtered` e `attach_limited`, sem texto/source/storage opcionais: não captura integralmente atividade anterior à conexão.

Os comandos CDP acima são de observação. O REA 6.9.0 também anuncia `capture-browser-scenario` com automação Playwright; seu `--help` foi confirmado, mas esse recurso não foi executado. Comparação de capturas não foi testada. Nenhum desses resultados descreve o Lusion.

## Procedimento Windows — ainda não executado

Executar a continuação em um agente realmente aberto no Windows. Não copiar a declaração de identidade “Claude Code no Windows” para uma sessão cloud e assumir que isso transfere o executor. Confirmar `Get-Command node.exe,npm.cmd,git,chrome,pwsh` conforme disponibilidade, versões, espaço e GPU reais. A RX 580/16 GB mencionada pelo usuário não foi verificada nesta sessão.

Manter checkout e evidências privadas separados. Usar diretórios novos sob `D:\Site-Deep-Code-Research`, preservando qualquer conteúdo existente. Não tocar em `E:\opencode-dev`, `D:\Deep Code`, perfis pessoais ou configurações globais. Se um caminho já existir, examinar seu conteúdo antes de reutilizar; não executar reset/clean/pull destrutivo.

### 1. Preparar diretórios e dependências externos

Exemplo PowerShell para uma sessão nova; caminhos e Node devem ser conferidos no computador real. Os comandos não alteram PATH global, política de execução ou ACLs.

```powershell
$ResearchRoot = 'D:\Site-Deep-Code-Research'
if (-not (Test-Path -LiteralPath $ResearchRoot)) {
    New-Item -ItemType Directory -Path $ResearchRoot | Out-Null
}
$SessionStamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$SessionRoot = Join-Path $ResearchRoot ('sessao-' + $SessionStamp)
if (Test-Path -LiteralPath $SessionRoot) { throw 'Sessão já existe; escolha outro nome.' }
New-Item -ItemType Directory -Path $SessionRoot | Out-Null
$ToolsRoot = Join-Path $SessionRoot 'tools'
New-Item -ItemType Directory -Path $ToolsRoot | Out-Null
node.exe --version
npm.cmd --version
# Prossiga somente se Node atender aos engines confirmados acima.
npm.cmd --cache (Join-Path $ToolsRoot 'npm-cache') --prefix $ToolsRoot install --ignore-scripts --omit=optional --no-audit --no-fund --save-exact rea-agents@6.9.0 playwright@1.62.1
if ($LASTEXITCODE -ne 0) { throw 'Instalação falhou; examinar saída antes de continuar.' }
$ReaCli = Join-Path $ToolsRoot 'node_modules\rea-agents\scripts\rea.mjs'
node.exe $ReaCli --version
```

Playwright 1.62.1 é a versão disponível e testada no cloud; a instalação Windows não foi executada. Não baixar outro Chromium se o Chrome instalado for suficiente. Se Node for incompatível, usar runtime isolado verificado em diretório de ferramentas; não substituir automaticamente o runtime dos demais projetos.

### 2. Chrome exclusivo e CDP loopback

Localizar o executável real do Chrome (`Get-Command`, instalação em Program Files ou instalação por usuário) e atribuí-lo a `$ChromePath`. Não confundir o executável com a pasta de perfil. Antes de iniciar, garantir que a porta esteja livre; se ocupada, não matar o processo desconhecido.

```powershell
if (-not (Test-Path -LiteralPath $ChromePath -PathType Leaf)) { throw 'Chrome não localizado.' }
$Port = 9222
if (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue) {
    throw 'Porta ocupada; identificar a sessão ou escolher outra porta.'
}
$ProfilePath = Join-Path $SessionRoot 'chrome-profile'
if (Test-Path -LiteralPath $ProfilePath) { throw 'Perfil já existe; usar um perfil novo.' }
New-Item -ItemType Directory -Path $ProfilePath | Out-Null
$ChromeArgs = @(
    ('--remote-debugging-port=' + $Port),
    '--remote-debugging-address=127.0.0.1',
    ('--user-data-dir="' + $ProfilePath + '"'),
    '--no-first-run', '--no-default-browser-check', 'https://lusion.co/'
)
$AuditChrome = Start-Process -FilePath $ChromePath -ArgumentList $ChromeArgs -PassThru
```

Após iniciar, confirmar com `Get-NetTCPConnection` que os listeners dessa porta são apenas `127.0.0.1`/`::1`, e consultar `http://127.0.0.1:9222/json/version`. O exemplo é um procedimento a validar no Windows, não garantia de que um flag tenha produzido binding seguro. Se houver binding em endereço aberto, parar somente a sessão criada e corrigir antes de conectar ferramentas. Não adicionar `--remote-allow-origins=*`, não desativar TLS e não usar `--no-sandbox` no Chrome Windows.

Observar visualmente: HTTPS válido, documento, cena real, loader encerrado, requests/erros e interatividade. HTTP 200 ou a existência de canvas não bastam. Se a rede local também bloquear, registrar a causa e não simular observações.

### 3. REA na sessão de pesquisa

Depois de conferir o perfil e a origem da aba, usar os comandos testados com o ID exato retornado. `TARGET_ID` é marcador, não identificador conhecido. Salvar saídas em arquivos privados fora do checkout; não publicar dumps integrais, WS URLs, storage ou cookies.

```powershell
node.exe $ReaCli list-browser-targets http://127.0.0.1:9222 --format json
node.exe $ReaCli inspect-web-page http://127.0.0.1:9222 TARGET_ID --observation-ms 500 --format json
node.exe $ReaCli analyze-web-bundle http://127.0.0.1:9222 TARGET_ID --format json
node.exe $ReaCli observe-web-session http://127.0.0.1:9222 TARGET_ID --observation-ms 4000 --format json
```

Durante observação passiva, executar o input real na janela própria ou por automação dirigida já verificada. Esses comandos não acionam automaticamente hover/scroll. Inspecionar o conteúdo semântico dos resultados e suas limitações, além do exit code. Análises estáticas devem se limitar a scripts carregados normalmente e gerar apenas achados sanitizados para o GitHub.

### 4. Coletor Playwright portátil, em sessão separada

O [coletor](tools/capturar.cjs) inicia seu próprio navegador com perfil temporário; **não anexa à aba CDP do REA**. Isso preserva ownership e não permite alegar que ambos analisaram a mesma sessão. O coletor fecha somente o browser que iniciou. Para comparar evidências, repetir o cenário e registrar diferenças de sessão/cache.

Definir `$CheckoutRoot` com o checkout real da branch `research/lusion-local-rea`, depois de verificar `git status` e HEAD. Não sobrescrever checkout existente nem perder trabalho local. Executar com parâmetros de processo/sessão:

```powershell
$env:AUDIT_TOOLS_DIR = $ToolsRoot
$env:AUDIT_HEADED = '1'
$env:CHROMIUM_PATH = $ChromePath
$env:TEST_ID = 'HOME_LOCAL_D01'
$Collector = Join-Path $CheckoutRoot 'docs\site-reference\lusion\tools\capturar.cjs'
$OutputRoot = Join-Path $SessionRoot 'captura-home-d01'
node.exe $Collector https://lusion.co/ $OutputRoot 1440 900
```

`READY_SELECTOR` só deve ser usado depois de observar um seletor que represente uma condição útil; visibilidade não confirma readiness do canvas. `AUDIT_REPO_ROOT` é necessário se o helper for copiado para fora do checkout. A saída deve ser nova e externa ao repositório. Os parâmetros de portabilidade e proteções foram testados em Linux com fixture própria (E13); Windows/macOS/headed continuam NT.

### 5. Encerramento e transferência

Fechar a janela Chrome própria e confirmar encerramento da sessão de pesquisa. Não usar `taskkill /IM chrome.exe`, limpeza global ou exclusão automática de perfis. Manter capturas, traces e observações privadas; extrair apenas descrições, timelines e métricas com contexto para a branch de pesquisa. Nenhuma configuração MCP é necessária para os passos CLI acima. Se MCP for escolhido depois, inspecionar o plano e fazer backup dos arquivos afetados antes de alterar integrações.
