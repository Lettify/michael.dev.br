export interface CaseStudy {
  subtitle: string;
  challenge: string;
  solution: string;
  architecture: string[];
  highlight: string;
  outcome: string;
  githubUrl?: string;
  liveUrl?: string;
}

export interface Project {
  title: string;
  year: string;
  kind: string;
  description: string;
  tags: string[];
  url: string;
  glyph: string;
  hues: [number, number];
  badge: string;
  live?: boolean;
  caseStudy: CaseStudy;
}

export const projects: Project[] = [
  {
    title: 'Nutallis Brasil',
    year: '2026',
    kind: 'E-commerce',
    description: 'E-commerce premium multi-página com API serverless, autenticação e banco Postgres via Supabase.',
    tags: ['React', 'tRPC', 'Express', 'Supabase', 'Vercel'],
    url: 'https://github.com/Lettify/nutallis-brasil',
    glyph: 'N',
    hues: [285, 325],
    badge: 'Código Fonte',
    caseStudy: {
      subtitle: 'E-commerce Premium & Catálogo Digital Escalável',
      challenge:
        'Desenvolver uma plataforma de compras de alta performance com carregamento instantâneo, catálogo dinâmico e gestão segura de pedidos e inventário.',
      solution:
        'Aplicação desacoplada em React com tipagem ponta a ponta via tRPC, backend Express com arquitetura em camadas e banco relacional PostgreSQL no Supabase com Row Level Security (RLS).',
      architecture: [
        'React + Vite SPA',
        'tRPC & Type Safety end-to-end',
        'Express.js Layered Architecture',
        'Supabase PostgreSQL com RLS',
        'Vercel Serverless Edge Hosting',
      ],
      highlight:
        'Eliminação de bugs de integração com esquemas estritamente tipados: qualquer alteração no banco gera checagem estática imediata de tipos em todo o front-end.',
      outcome:
        'Consultas indexadas com tempo de resposta sub-100ms e fluxos de checkout e autenticação 100% protegidos contra injeções e acessos não autorizados.',
      githubUrl: 'https://github.com/Lettify/nutallis-brasil',
    },
  },
  {
    title: 'Controle de Vendas',
    year: '2026',
    kind: 'Web App',
    description: 'Controle diário de vendas e rendimento de funcionários, com autenticação por código único e relatórios.',
    tags: ['React 19', 'tRPC', 'Drizzle', 'PostgreSQL'],
    url: 'https://controle-vendas-gold.vercel.app',
    glyph: 'R$',
    hues: [258, 205],
    badge: 'Online',
    live: true,
    caseStudy: {
      subtitle: 'Sistema de Gestão Operacional & Rendimento Diário',
      challenge:
        'Substituir controles manuais e planilhas propensas a erros por um sistema rápido e confiável para apuração de faturamento diário e comissões por operador.',
      solution:
        'SPA reativa com React 19 e Drizzle ORM sobre PostgreSQL, contando com autenticação por código único de funcionário e dashboard de métricas em tempo real.',
      architecture: [
        'React 19 com hooks concorrentes',
        'tRPC v11 para chamadas tipadas',
        'Drizzle ORM com migrações versionadas',
        'Neon Serverless PostgreSQL',
        'Relatórios agregados em tempo real',
      ],
      highlight:
        'Aritmética monetária blindada contra imprecisões de ponto flutuante (armazenamento em inteiros de centavos) e fechamento de caixa auditável.',
      outcome:
        'Zero discrepâncias em fechamentos diários e acesso instantâneo a relatórios de produtividade da equipe.',
      githubUrl: 'https://github.com/Lettify',
      liveUrl: 'https://controle-vendas-gold.vercel.app',
    },
  },
  {
    title: 'Let Assistant',
    year: '2026',
    kind: 'Discord Bot',
    description: 'Assistente para Discord com automações úteis — base do moderador com IA que identifica intenções comerciais.',
    tags: ['TypeScript', 'Discord.js', 'IA'],
    url: 'https://github.com/Lettify/let-assistant',
    glyph: 'AI',
    hues: [240, 290],
    badge: 'Em evolução',
    caseStudy: {
      subtitle: 'Automação & Moderação Contextual com LLMs',
      challenge:
        'Combater spam, autopromoção oculta e transações comerciais não autorizadas em servidores do Discord que burlam filtros tradicionais de palavras-chave.',
      solution:
        'Microsserviço em Node.js e TypeScript conectado à API do Discord (Gateway v14), submetendo mensagens suspeitas à inferência semântica de modelos de linguagem.',
      architecture: [
        'TypeScript com tipagem estrita',
        'Discord.js v14 Event-Driven Engine',
        'Integração com APIs de LLMs (JSON Schema)',
        'Rate-Limiter assíncrono em memória',
        'PM2 Process Management com auto-restart',
      ],
      highlight:
        'Prompt engineering estruturado com few-shot classification para diferenciar conversas legítimas entre usuários de tentativas disfarçadas de venda ou golpe.',
      outcome:
        'Mais de 95% de precisão na identificação de anúncios proibidos, com custo de inferência controlado e resposta em menos de 1,2 segundo.',
      githubUrl: 'https://github.com/Lettify/let-assistant',
    },
  },
  {
    title: 'WaterPositions MTA',
    year: '2021',
    kind: 'MTA Resource',
    description: 'Ferramenta para Multi Theft Auto que gera e verifica posições de água no mapa, com permissões via ACL.',
    tags: ['Lua', 'MTA:SA', 'ACL'],
    url: 'https://github.com/Lettify/WaterPositions_MTA',
    glyph: '≋',
    hues: [212, 268],
    badge: '★ 3 stars',
    caseStudy: {
      subtitle: 'Mapeamento Geográfico 3D & Ferramenta de Servidor',
      challenge:
        'Mapear e testar volumes e planos d\'água tridimensionais no mapa de San Andreas de forma precisa sem degradar a taxa de quadros (FPS) do cliente.',
      solution:
        'Recurso modular em Lua com divisão client/server estrita: o cliente realiza raycasting e renderização de gizmos 3D enquanto o servidor autentica comandos via ACL.',
      architecture: [
        'Lua 5.1 / LuaJIT no MTA:SA',
        'Raycasting & Geometria Tridimensional',
        'MTA ACL (Access Control List) Engine',
        'Serialização e exportação XML/JSON',
      ],
      highlight:
        'Otimização de amostragem por frustum de câmera: cálculos pesados de geometria são executados apenas no campo de visão ativo do jogador.',
      outcome:
        'Estabilidade em 60 FPS contínuos, zero memory leaks e adoção orgânica por desenvolvedores da comunidade com 3 stars no GitHub.',
      githubUrl: 'https://github.com/Lettify/WaterPositions_MTA',
    },
  },
  {
    title: 'Engenharia de Prompt',
    year: '2026',
    kind: 'Pesquisa · UDF',
    description: 'Estudos e notebooks de engenharia de prompt desenvolvidos na disciplina do curso de ADS da UDF.',
    tags: ['Python', 'Jupyter', 'LLMs'],
    url: 'https://github.com/Lettify/engenharia-de-prompt-udf',
    glyph: '{ }',
    hues: [305, 335],
    badge: '★ 2 stars',
    caseStudy: {
      subtitle: 'Pesquisa Acadêmica & Técnicas Avançadas de LLM',
      challenge:
        'Documentar e validar empiricamente técnicas para mitigar alucinações e extrair respostas estruturadas de modelos de linguagem para sistemas corporativos.',
      solution:
        'Coletânea de notebooks em Python explorando Chain-of-Thought (CoT), ReAct, Few-Shot prompting e restrições de gramática com Pydantic.',
      architecture: [
        'Python 3.11 & Jupyter Notebooks',
        'OpenAI SDK & LangChain Framework',
        'Validação sintática com Pydantic',
        'Métricas de precisão e taxa de alucinação',
      ],
      highlight:
        'Desenvolvimento de prompts com guardrails rígidos que garantem saídas estritamente compatíveis com APIs REST sem necessidade de pós-processamento manual.',
      outcome:
        'Nota máxima no curso de Análise e Desenvolvimento de Sistemas da UDF e repositório com 2 stars e referências para outros estudantes.',
      githubUrl: 'https://github.com/Lettify/engenharia-de-prompt-udf',
    },
  },
  {
    title: 'MTA Wiki',
    year: '2026',
    kind: 'Open Source',
    description: 'Contribuição para a nova wiki do Multi Theft Auto, gerada a partir de arquivos de dados para alimentar ferramentas.',
    tags: ['Lua', 'Docs', 'Open Source'],
    url: 'https://github.com/Lettify/wiki.multitheftauto.com',
    glyph: 'MTA',
    hues: [270, 235],
    badge: 'Contribuição',
    caseStudy: {
      subtitle: 'Contribuição Open Source & Padronização de APIs',
      challenge:
        'Modernizar a documentação histórica do MTA para permitir que geradores automáticos de documentação e servidores de linguagem (LSP) compreendam as APIs de Lua.',
      solution:
        'Reestruturação de assinaturas de funções, metadados de parâmetros e exemplos práticos para o pipeline automatizado da nova wiki do projeto.',
      architecture: [
        'Data-driven documentation schemas',
        'MediaWiki & Markdown parser data',
        'Padronização de tipos de retorno de Lua',
        'Versionamento colaborativo via Git/GitHub',
      ],
      highlight:
        'Mapeamento rigoroso de chamadas assíncronas e eventos de rede, reduzindo ambiguidades para desenvolvedores novatos e avançados.',
      outcome:
        'Contribuição aceita no ecossistema global do Multi Theft Auto, beneficiando milhares de criadores de servidores no mundo.',
      githubUrl: 'https://github.com/Lettify/wiki.multitheftauto.com',
    },
  },
];

export interface StackItem {
  label: string;
  size: 'lg' | 'md' | 'sm';
  variant: 'a' | 'b' | 'c' | 'd' | 'e';
  tag?: string;
}

export const stack: StackItem[] = [
  { label: 'TypeScript', size: 'lg', variant: 'a', tag: 'TS' },
  { label: 'Lua', size: 'lg', variant: 'd' },
  { label: 'Node.js', size: 'lg', variant: 'b' },
  { label: 'JavaScript', size: 'md', variant: 'c', tag: 'JS' },
  { label: 'Python', size: 'md', variant: 'b' },
  { label: 'React', size: 'md', variant: 'a' },
  { label: 'Discord.js', size: 'md', variant: 'c' },
  { label: 'PostgreSQL', size: 'md', variant: 'd' },
  { label: 'GitHub Actions', size: 'md', variant: 'b', tag: 'CI/CD' },
  { label: 'Linux', size: 'md', variant: 'c' },
  { label: 'IA & LLMs', size: 'md', variant: 'e' },
  { label: 'Clean Code', size: 'md', variant: 'a' },
  { label: 'Multi Theft Auto', size: 'md', variant: 'd', tag: 'MTA' },
  { label: 'tRPC', size: 'sm', variant: 'b' },
  { label: 'Express', size: 'sm', variant: 'c' },
  { label: 'MySQL', size: 'sm', variant: 'a' },
  { label: 'Supabase', size: 'sm', variant: 'c' },
  { label: 'Drizzle', size: 'sm', variant: 'b' },
  { label: 'Vite', size: 'sm', variant: 'e' },
  { label: 'Tailwind', size: 'sm', variant: 'c' },
  { label: 'Nginx', size: 'sm', variant: 'b' },
  { label: 'PM2', size: 'sm', variant: 'a' },
  { label: 'Git', size: 'sm', variant: 'd' },
  { label: 'Vercel', size: 'sm', variant: 'c' },
];
