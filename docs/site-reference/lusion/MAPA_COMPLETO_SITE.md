# Mapa de páginas e cobertura

**Não existe mapa completo validado nesta revisão.** E03 demonstra que o HTML inicial não foi recebido. Não inferir rotas por convenções comuns de portfólios.

| URL | Origem da informação | Finalidade | Tentativa | Cobertura |
| --- | --- | --- | --- | --- |
| `https://lusion.co/` | Referência fornecida pelo usuário | Entrada da referência solicitada | Chromium desktop 1440×900 e CONNECT via curl | Bloqueada; nenhum conteúdo inspecionado |

## Campos ainda não observados na página inicial

Hierarquia e ordem de seções, textos e títulos, layout, fontes, pesos, escalas, cores, iluminação, canvas, vídeos, objetos 3D, navegação, cursor, controles de áudio, elementos fixos/flutuantes, rodapé e estados de carregamento: **todos NT**. Não há base para declarar que o site tem uma seção, cor, personagem ou biblioteca específica.

## Descoberta após desbloqueio

1. Registrar URL final, título, hora, viewport/DPR, cache e estado de consentimento. Observar a primeira abertura sem clicar antes da captura inicial.
2. Enumerar links públicos visíveis, menu aberto, rodapé e links apresentados após rolagem. Classificar rota interna, página de projeto, domínio externo e ação sem navegação.
3. Visitar cada rota principal descoberta e projetos representativos de mecanismos distintos. Registrar links restantes e justificativa de amostragem; não chamar amostra de cobertura total.
4. Investigar rotas públicas declaradas por `robots.txt`/sitemap somente se necessário. Sua presença não foi testada; não adivinhar URLs de projetos ou diretórios privados.
5. Para projetos externos, inspecionar somente o necessário ao entendimento e registrar novo domínio requerido, sem copiar ativos.

## Ficha por página a preencher com observação

| Campo | Registro necessário |
| --- | --- |
| Identificação | ID, URL canônica observada, finalidade, entrada usada e links de saída |
| Estrutura | Sequência de seções e altura aproximada em viewport; DOM versus canvas |
| Tipografia | Família obtida por CSS computado/fontes carregadas, tamanho, peso, line-height e contraste |
| Arte | Paleta amostrada com contexto, fontes de luz aparentes, objetos, fundo e materiais |
| Mídia | Canvas, vídeo, imagens, fallback; não confundir vídeo com 3D em tempo real |
| Navegação | Header, menu, cursor, foco, retorno, URL/histórico e transição |
| Estados | Primeira abertura, carregamento, pronto, hover, clique, scroll, saída e erro |
| Responsividade | Diferenças em cada viewport e em dispositivo físico quando disponível |
| Evidência | Sessão, screenshot/quadros temporários, seletor ou região visual e confiança |

Uma página só poderá constar como examinada quando os componentes importantes tiverem sido visualizados. Caso o canvas não renderize, registrar página parcialmente examinada mesmo que o texto esteja acessível.
