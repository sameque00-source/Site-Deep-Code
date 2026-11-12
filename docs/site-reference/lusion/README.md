# Lusion — pesquisa funcional e visual, missão 01/08

**Estado: auditoria bloqueada por acesso de rede; não concluída.**

## Missão especial — REA e transferência local

**PESQUISA BLOQUEADA — EVIDÊNCIAS INSUFICIENTES.** Na sessão de 12/11/2026 iniciada às 19h35 (Brasília), o executor continuava sendo Linux cloud, não o Windows descrito no pedido. CONNECT/captura Chromium confirmaram novamente a restrição; nenhuma página da referência carregou. Não foi possível acessar os discos D:/E:, confirmar a GPU/RAM do PC ou usar seu Chrome.

O trabalho partiu do HEAD remoto `c5233f4b972f5081df89ba081b8bc0487b2c80b5`, árvore limpa, e continua em `research/lusion-local-rea`, preservando a branch anterior. O nome da branch indica o escopo solicitado, não comprova execução no computador local.

Avanços independentes: REA oficial 6.9.0 instalado isoladamente e validado por CLI/CDP com fixture própria; coletor portátil com sete verificações funcionais locais; procedimento Windows e especificação candidata do astronauta original. Nenhuma tecnologia ou característica visual da referência foi inferida desses testes. Novos registros: E11–E13 em [pendências](PENDENCIAS_E_EVIDENCIAS.md#missão-especial--continuação-rea).

- [REA, validação executada e procedimento Windows](REA_E_EXECUCAO_WINDOWS.md)
- [Especificação candidata do astronauta original](ESPECIFICACAO_ASTRONAUTA_ORIGINAL.md)
- [Arquitetura/jornada/áudio/tiers propostos](PLANO_RECONSTRUCAO.md#complemento-da-missão-especial--propostas-independentes-p)

Os 22 tópicos de entrega do novo pedido foram consolidados nos documentos abaixo, conforme a orientação de evitar duplicação. Isso organiza o pacote; não transforma tópicos bloqueados em pesquisa concluída.

| Tópico solicitado | Documento de destino | Cobertura atual |
| --- | --- | --- |
| 00 Resumo executivo | Este README | Execução e bloqueio reais |
| 01 Ambiente e instalação REA | [REA/Windows](REA_E_EXECUCAO_WINDOWS.md) | CLI Linux verificada; Windows NT |
| 02 Mapa completo | [Mapa](MAPA_COMPLETO_SITE.md) | Bloqueado |
| 03 Identidade visual e layout | [Mapa](MAPA_COMPLETO_SITE.md) | Bloqueado |
| 04 Tipografia e componentes | [Mapa](MAPA_COMPLETO_SITE.md) | Bloqueado |
| 05 Cenas e geometria | [Cenas](INVENTARIO_CENAS_3D.md) | Bloqueado |
| 06 Astronauta e personagens | [Análise](ASTRONAUTA_ANALISE.md) | Referência não localizada |
| 07 Câmera/luz/materiais/shaders | [Cenas](INVENTARIO_CENAS_3D.md) | Bloqueado |
| 08 Animações e timelines | [Timelines](ANIMACOES_TIMELINES.md) | Bloqueado |
| 09 Mouse/scroll/touch | [Interações](INTERACOES_COMPLETAS.md) | Bloqueado na referência |
| 10 Áudio e sincronização | [Áudio](AUDIO_E_SINCRONIZACAO.md) | Nenhum som observado |
| 11 Arquitetura JS | [Arquitetura](ARQUITETURA_TECNICA.md) | Stack da referência NT |
| 12 Rede/carregamento | [Pendências/evidências](PENDENCIAS_E_EVIDENCIAS.md) | Bloqueio confirmado; requests da página NT |
| 13 Performance/FPS | [Performance](PERFORMANCE_MEDICOES.md) | Nenhuma medição do Lusion |
| 14 Responsividade/acessibilidade | [Responsividade](RESPONSIVIDADE.md) | Bloqueado |
| 15 Inventário de evidências | [Registro](PENDENCIAS_E_EVIDENCIAS.md) | E01–E13, com escopos distintos |
| 16 Matriz original | [Plano](PLANO_RECONSTRUCAO.md) | Sem linhas observacionais fictícias; propostas próprias separadas |
| 17 Arquitetura do nosso site | [Plano](PLANO_RECONSTRUCAO.md) | Proposta candidata |
| 18 Astronauta original | [Especificação](ESPECIFICACAO_ASTRONAUTA_ORIGINAL.md) | Proposta candidata, sem asset produzido |
| 19 Implementação Codex | [Plano](PLANO_RECONSTRUCAO.md) | Sequência futura; implementação não iniciada |
| 20 Limitações/pendências | [Registro](PENDENCIAS_E_EVIDENCIAS.md) | Acesso ao Windows e referência ausentes |
| 21 Relatório final | Este README + [registro](PENDENCIAS_E_EVIDENCIAS.md) | Pesquisa bloqueada |

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
| B | Bloqueado por restrição identificada; não equivale a recurso ausente |

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
