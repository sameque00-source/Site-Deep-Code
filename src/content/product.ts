export type CodeTokenKind = 'plain' | 'keyword' | 'string' | 'comment' | 'function' | 'number' | 'type';
export type CodeToken = { text: string; kind?: CodeTokenKind };
export type CodeLine = CodeToken[];

const t = (text: string, kind: CodeTokenKind = 'plain'): CodeToken => ({ text, kind });

export const demoScenarios: {
  id: string;
  label: string;
  file: string;
  path: string;
  prompt: string;
  explanation: string;
  note: string;
  lines: CodeLine[];
}[] = [
  {
    id: 'interface',
    label: 'Interface',
    file: 'Orbit.tsx',
    path: 'src / components / Orbit.tsx',
    prompt: 'Uma ideia começa com uma interface simples.',
    explanation: 'Neste exemplo ilustrativo, um componente transforma uma intenção em uma pequena estrutura de código legível.',
    note: 'Um componente. Um ponto de partida.',
    lines: [
      [t('// Cada grande projeto começa aqui.', 'comment')],
      [],
      [t('type ', 'keyword'), t('OrbitProps', 'type'), t(' = {')],
      [t('  title: '), t('string', 'type'), t(';')],
      [t('};')],
      [],
      [t('export function ', 'keyword'), t('Orbit', 'function'), t('({ title }: '), t('OrbitProps', 'type'), t(') {')],
      [t('  return ', 'keyword'), t('(')],
      [t('    <section ', 'keyword'), t('className'), t('='), t('"workspace"', 'string'), t('>', 'keyword')],
      [t('      <span>', 'keyword'), t('Uma nova perspectiva'), t('</span>', 'keyword')],
      [t('      <h1>', 'keyword'), t('{title}'), t('</h1>', 'keyword')],
      [t('    </section>', 'keyword')],
      [t('  );')],
      [t('}')],
    ],
  },
  {
    id: 'logic',
    label: 'Lógica',
    file: 'motion.ts',
    path: 'src / utils / motion.ts',
    prompt: 'Pequenas decisões dão forma ao movimento.',
    explanation: 'A fórmula deste cenário aproxima um valor de seu destino ao longo do tempo. É código de exemplo, sem conexão com uma sessão de IA.',
    note: 'A intenção ganha estrutura.',
    lines: [
      [t('// Movimento que respeita o tempo.', 'comment')],
      [],
      [t('export function ', 'keyword'), t('approach', 'function'), t('(')],
      [t('  current: '), t('number', 'type'), t(',')],
      [t('  target: '), t('number', 'type'), t(',')],
      [t('  delta: '), t('number', 'type'), t(',')],
      [t(') {')],
      [t('  const ', 'keyword'), t('response = '), t('5', 'number'), t(';')],
      [t('  const ', 'keyword'), t('weight = '), t('1', 'number'), t(' - Math.'), t('exp', 'function'), t('(')],
      [t('    -response * delta,')],
      [t('  );')],
      [],
      [t('  return ', 'keyword'), t('current + (target - current) * weight;')],
      [t('}')],
    ],
  },
  {
    id: 'review',
    label: 'Revisão',
    file: 'quality.ts',
    path: 'src / experience / quality.ts',
    prompt: 'Entender uma mudança também faz parte de criar.',
    explanation: 'Este cenário organiza uma decisão em uma função pequena. A explicação é editorial e foi escrita para esta demonstração conceitual.',
    note: 'Clareza antes do próximo passo.',
    lines: [
      [t('// Primeiro, uma regra compreensível.', 'comment')],
      [],
      [t('type ', 'keyword'), t('Quality', 'type'), t(' = '), t('"balanced"', 'string'), t(' | '), t('"high"', 'string'), t(';')],
      [],
      [t('export function ', 'keyword'), t('chooseQuality', 'function'), t('(')],
      [t('  reducedMotion: '), t('boolean', 'type'), t(',')],
      [t('): '), t('Quality', 'type'), t(' {')],
      [t('  if ', 'keyword'), t('(reducedMotion) {')],
      [t('    return ', 'keyword'), t('"balanced"', 'string'), t(';')],
      [t('  }')],
      [],
      [t('  return ', 'keyword'), t('"high"', 'string'), t(';')],
      [t('}')],
      [t('// Exemplo ilustrativo, não código do app.', 'comment')],
    ],
  },
];

export const productPrinciples = [
  {
    index: '01',
    title: 'Espaço para pensar.',
    text: 'Programação e inteligência artificial no centro da proposta. Uma direção de produto que começa pela clareza.',
    detail: 'CONCEITO DO PRODUTO',
  },
  {
    index: '02',
    title: 'Contexto para criar.',
    text: 'Uma experiência desktop em desenvolvimento para acompanhar o trabalho de quem transforma ideias em software.',
    detail: 'APLICATIVO WINDOWS',
  },
  {
    index: '03',
    title: 'Controle para avançar.',
    text: 'A apresentação dos recursos, integrações e requisitos virá com informações verificadas da versão oficial.',
    detail: 'EM DESENVOLVIMENTO',
  },
];

export const questions = [
  {
    question: 'O que é o Deep Code?',
    answer: 'Deep Code é um aplicativo desktop de programação com inteligência artificial, em desenvolvimento para Windows. Este site apresenta sua direção e uma experiência visual própria.',
  },
  {
    question: 'Já posso baixar o aplicativo?',
    answer: 'Ainda não há um arquivo de download aprovado disponível neste site. A seção de downloads será atualizada quando houver uma versão e informações verificadas para publicação.',
  },
  {
    question: 'A demonstração mostra a interface real?',
    answer: 'Não. A janela interativa desta página é uma demonstração conceitual criada para o site. Não é uma captura do aplicativo e não executa tarefas de programação ou chamadas a modelos de IA.',
  },
  {
    question: 'Quais modelos de IA serão compatíveis?',
    answer: 'A lista de modelos e provedores será publicada após a validação das integrações. Nenhum nome de modelo, preço de serviço ou disponibilidade está sendo anunciado nesta versão do site.',
  },
  {
    question: 'Esta já é a identidade visual definitiva?',
    answer: 'O nome do produto é Deep Code. A marca tipográfica usada aqui é provisória e será substituída pela logo oficial do aplicativo quando o arquivo original estiver disponível para integração.',
  },
  {
    question: 'Preciso ativar o som ou o 3D para navegar?',
    answer: 'Não. O conteúdo e a navegação continuam disponíveis sem áudio e sem a cena 3D. As preferências de movimento e os controles da experiência permitem uma apresentação mais discreta.',
  },
];
