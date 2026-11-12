# Áudio e sincronização

**Nenhum som da referência foi ouvido, capturado ou identificado.** A página não carregou (E03). Não se confirmou botão de mute, ambiente, SFX, autoplay, persistência ou sincronização. A existência da API `AudioContext` no navegador local (E04) não prova saída audível nem uso dessa API pelo Lusion.

## Registro de cobertura

| Classe investigada | Evento a verificar | Disparo/duração/sincronia | Alternativa original, se a função for confirmada |
| --- | --- | --- | --- |
| Controle som/silêncio | Primeira entrada, toggle, teclado, troca de rota | NT | Controle persistente acessível, rótulo e estado explícitos |
| Ambiente | Antes/depois de gesto habilitador, repouso | NT | Camadas sintetizadas próprias com movimento lento e faixa dinâmica controlada |
| Hover/foco | Entrar/sair repetidamente em alvos confirmados | NT | Pulso tonal/percussivo curto criado do zero; limitar repetição |
| Clique | Pointerdown versus pointerup e navegação | NT | Transiente sintetizado próprio, variações leves sem copiar timbre/melodia |
| Transição | Saída e entrada de página/cena | NT | Sweep ou textura produzidos para o timing original do projeto |
| Personagem/3D | Movimento, contato e efeitos visuais confirmados | NT | Foley original/licenciado e espacialização apenas quando comunicar posição |
| Navegação e visibilidade | Back/forward, aba oculta, retorno | NT | Barramento persistente, crossfade e suspensão em segundo plano |
| Mute | Mutar durante ambiente e SFX | NT | Ganho mestre com rampa curta; informação continua acessível visualmente |

As alternativas acima são propostas P condicionais. Não indicam que cada classe exista no Lusion.

## Protocolo verificável

1. Abrir contexto novo sem gesto. Registrar estado visível do controle e política de autoplay do navegador. Não usar flag que force autoplay, pois alteraria a primeira experiência.
2. Comparar antes/depois de clique legítimo. Registrar promessas `play()` rejeitadas ou contexto suspenso quando observáveis, sem alterar o código da página para forçar reprodução.
3. Identificar mecanismo por elementos `audio`/`video`, tipos MIME e grafo Web Audio via ferramentas de desenvolvimento. MIME ou arquivo carregado não comprova reprodução; conexão de nó não comprova som audível.
4. Para cada evento, repetir isoladamente e marcar instante do input, início do sinal e término. Separar atraso da ferramenta, scheduling, latência de saída e alinhamento visual.
5. Verificar mute, volume zero, perda de foco, retorno e navegação. Registrar se o estado persiste por rota, sessão ou recarga; não extrapolar.
6. Se houver saída de áudio capturável e autorizada, analisar envelope RMS/ataques e comparar com timestamps visuais; registrar sample rate, latência estimada e incerteza. Sem saída capturada/escutada, não alegar análise sonora completa.

## Limites e propriedade

Sem gravação da sessão ou acesso à saída de som nesta revisão. Não há estimativas de duração, frequências ou nomes de efeitos atribuídos à referência. Nenhum arquivo de áudio foi baixado como ativo, versionado ou preparado para reutilização.

Na futura implementação, o design deve funcionar em silêncio e respeitar o gesto necessário para iniciar som. A criação sonora própria deve partir da função de cada evento, não da cópia de samples ou composição do Lusion.
