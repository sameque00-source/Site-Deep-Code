# Lusion — pesquisa funcional e visual, missão 01/08

**Estado: auditoria bloqueada por acesso de rede; não concluída.**

## Retomada V2 — 12/11/2026, 18h30 (Brasília)

**MISSÃO 01/08 BLOQUEADA.** A retomada preservou o commit `9992c6d863409830f3e50f005e36eb31b5dda7f0`; branch local e remota coincidiam e a árvore estava limpa. O rascunho contém os dois domínios solicitados, mas o CONNECT ao Lusion e a API do GitHub continuam recusados em runtime. Não há confirmação de publicação nem ferramenta de publicação disponível. Nenhuma página da referência foi examinada nesta retomada; os registros anteriores permanecem válidos como histórico.

A V2 confirmou que este repositório é exclusivo do site e separado do OpenCode Dev. Não foi procurado código do aplicativo. O astronauta **original** é agora requisito explícito do produto, independentemente de sua presença ainda não verificada na referência.

O coletor recebeu diagnósticos de hosts/etapas, ID de teste, contagem sanitizada de console e espera opcional por seletor visível. Três verificações funcionais em fixture própria, inteiramente local, passaram: coleta com interação e quadros, falha de navegação e falha de ação. Isso valida o instrumento nesses cenários; não valida o Lusion nem sua performance. Evidências E08–E10 e quadro de cobertura estão no [registro de continuação](PENDENCIAS_E_EVIDENCIAS.md#retomada-v2).

Sessão de 12/11/2026, iniciada aproximadamente às 18h15, horário de Brasília. Referência solicitada: <https://lusion.co/>. Nenhuma página da referência foi carregada com sucesso. Este conjunto registra evidências reais da tentativa, prepara a continuação e propõe critérios para uma futura implementação original. Não equivale à engenharia reversa visual solicitada.

## Resultado verificável da primeira entrega

- Repositório: `sameque00-source/Site-Deep-Code`; origem GitHub verificada; leitura Git funcional.
- Estado inicial: branch `work`, HEAD `8dc42ee01c8f2df5635197cbfddb053cc3949404`, igual à `main` remota. Árvore limpa, nenhum arquivo versionado ou arquivo de projeto presente. Histórico: criação e remoção de um TXT de teste. Não há código de aplicativo desktop para examinar nem preservar neste checkout.
- Branch criada: `research/lusion-reference`. Alterações desta missão restritas a esta pasta de documentação e ferramentas de pesquisa.
- Chromium real 156.0.8078.79 + Playwright disponíveis. Tentativa desktop 1440×900 interrompida pelo proxy antes do HTML do site.
- `curl`: CONNECT HTTPS recusado com 403. Playwright: `net::ERR_TUNNEL_CONNECTION_FAILED`. Isso é evidência sobre o ambiente de inspeção, **não sobre disponibilidade ou defeito do Lusion**.
- WebGL2 funciona no navegador de teste local, com SwiftShader. Nenhuma cena ou FPS do Lusion foi observado.
- Rascunho de rede salvo para `lusion.co` e `api.github.com`, preservando o preset existente. Salvar rascunho não aplica nem publica a configuração. A API necessária à PR também foi recusada; acesso Git não prova acesso à API.

## Convenção obrigatória de evidência

| Marca | Significado |
| --- | --- |
| F | Fato diretamente observado; citar ID de evidência |
| M | Medição executada; citar método, população e condições |
| H | Hipótese ainda sem confirmação; não usar como especificação da referência |
| P | Proposta original para nosso projeto; não é achado sobre o Lusion |
| NT | Não testado ou impossível de observar nesta sessão |

Confiança alta em uma falha de conexão não implica confiança em qualquer propriedade da página inacessível. Ausência de evidência não significa ausência de recurso.

## Índice

1. [Mapa do site e cobertura](MAPA_COMPLETO_SITE.md)
2. [Inventário de cenas 3D](INVENTARIO_CENAS_3D.md)
3. [Astronauta](ASTRONAUTA_ANALISE.md)
4. [Animações e timelines](ANIMACOES_TIMELINES.md)
5. [Matriz de interações](INTERACOES_COMPLETAS.md)
6. [Áudio e sincronização](AUDIO_E_SINCRONIZACAO.md)
7. [Arquitetura técnica](ARQUITETURA_TECNICA.md)
8. [Performance e medições](PERFORMANCE_MEDICOES.md)
9. [Responsividade e acessibilidade](RESPONSIVIDADE.md)
10. [Plano original de reconstrução](PLANO_RECONSTRUCAO.md)
11. [Evidências, pendências e retomada](PENDENCIAS_E_EVIDENCIAS.md)

## Artefatos e reprodução

Somente registros textuais sanitizados estão versionados em `evidencias/`. Capturas de tela ficam fora do repositório. A ferramenta [capturar.cjs](tools/capturar.cjs) prepara inventário DOM, metadados de recursos, amostra de rAF e quadros de uma interação escolhida **após observar seus seletores**. Não descobre automaticamente todas as interações nem mede som audível. Consulte suas instruções em [pendências](PENDENCIAS_E_EVIDENCIAS.md).

Não foram extraídos modelos, texturas, áudios, vídeos ou código proprietário para nosso produto. Não houve implementação de site, lançamento, merge ou deploy.

## Critério de conclusão

A missão permanece aberta até a inspeção real das páginas principais, rotas relevantes descobertas, astronauta (ou conclusão fundamentada sobre sua localização), áudio e transições; medições e cobertura responsiva devem vir de sessões válidas. Os arquivos presentes constituem um registro de bloqueio e protocolo de continuação, não uma auditoria visual completa.
