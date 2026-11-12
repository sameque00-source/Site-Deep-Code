# Arquitetura técnica: evidência versus hipótese

## Tecnologias da referência

| Tecnologia ou técnica | Resultado | O que seria evidência suficiente |
| --- | --- | --- |
| WebGL / WebGL2 / WebGPU | NT | Contexto/API efetivamente criado pela página, canvas ativo e renderização |
| Three.js ou outro motor | NT | Identificador de versão/import/banner em recurso JS público ou evidência runtime inequívoca |
| GSAP ou outro mecanismo de animação | NT | Import/identificador público verificável, relacionado à execução da página |
| React/Vue/outro framework | NT | Bundle/DOM/runtime com assinatura verificável; distinguir ferramentas embutidas não utilizadas |
| Renderização e gerenciamento de cenas | NT | Canvas e contextos por rota, eventos de troca, recursos e descarte observados |
| Compressão de textura/geometria | NT | Formato e loader observados; extensão isolada não prova uso no caminho ativo |
| Bloom, DOF, reflexos, shaders | NT | Efeito visual observado + confirmação técnica pública quando possível |
| Lazy loading / prefetch / cache | NT | Sequência de requests em primeira entrada, scroll, hover e navegação |
| Qualidade adaptativa | NT | Resolução/efeitos alterados sob condições controladas, com repetição |

Nenhuma biblioteca da referência está confirmada ou sequer inferida a partir de sua aparência nesta revisão: não houve aparência disponível (E03). Não utilizar afirmações históricas ou materiais de terceiros como substituto da versão atual sem identificá-los como fonte secundária.

## Método de investigação pública

- Começar pelo documento e pelos recursos que o navegador solicita normalmente. Usar DevTools Network/Performance e inspecionar JS/CSS públicos apenas na medida necessária a identificar a arquitetura.
- Registrar para cada afirmação URL sanitizada, seletor/trecho identificador mínimo, hora, sessão e confiança. Não armazenar bundles completos no repositório.
- Distinguir carregado, inicializado e efetivamente utilizado. Um decoder ou pacote incluído não prova que a cena em observação dependa dele.
- Comparar primeira visita e visita aquecida; verificar workers, streams, requests após entrada de seção e liberação de recursos entre rotas.
- Separar compressão HTTP (br/gzip), contêiner de imagem/textura (por exemplo KTX2) e compressão de geometria (por exemplo Draco/Meshopt). Nenhum desses formatos foi encontrado nesta sessão.
- Não acessar endpoints privados, source maps não referenciados, diretórios protegidos ou autenticação. Não remover TLS, checksum ou assinatura para obter acesso.

## Ferramentas realmente verificadas

E04: Chromium 156.0.8078.79 headless, WebGL2 disponível sobre ANGLE/SwiftShader. API WebGPU não disponível no contexto local `about:blank` usado na sondagem; isso não determina suporte em uma origem HTTPS segura nem o uso no Lusion. `AudioContext` existe; saída sonora não testada. Emulação de `prefers-reduced-motion: reduce` respondeu corretamente no teste local.

O headless é um navegador real, mas sem GPU física e sem validação humana audiovisual do site. Não extrapolar seus resultados para um desktop de produção ou celular físico.

## Arquitetura do nosso produto

As escolhas propostas estão em [plano de reconstrução](PLANO_RECONSTRUCAO.md). São decisões candidatas para recursos originais, independentes da stack não verificada da referência. Nenhum pacote foi adicionado ao aplicativo ou a uma implementação de site.
