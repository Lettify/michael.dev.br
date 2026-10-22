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

const rawProjects: Record<'pt' | 'en', Project[]> = {
  pt: [
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
  ],
  en: [
    {
      title: 'Nutallis Brasil',
      year: '2026',
      kind: 'E-commerce',
      description: 'Premium multi-page e-commerce with serverless APIs, authentication, and Postgres database via Supabase.',
      tags: ['React', 'tRPC', 'Express', 'Supabase', 'Vercel'],
      url: 'https://github.com/Lettify/nutallis-brasil',
      glyph: 'N',
      hues: [285, 325],
      badge: 'Source Code',
      caseStudy: {
        subtitle: 'Premium E-commerce & Scalable Digital Catalog',
        challenge:
          'Develop a high-performance shopping platform with instant page loads, dynamic catalog inventory, and bulletproof order processing.',
        solution:
          'Decoupled React application with end-to-end type safety via tRPC, layered Express backend architecture, and PostgreSQL on Supabase with Row Level Security (RLS).',
        architecture: [
          'React + Vite SPA',
          'tRPC & Type Safety end-to-end',
          'Express.js Layered Architecture',
          'Supabase PostgreSQL with RLS',
          'Vercel Serverless Edge Hosting',
        ],
        highlight:
          'Elimination of integration regressions through strict schemas: database migrations immediately trigger compile-time type validation across the client app.',
        outcome:
          'Indexed queries delivering sub-100ms response times with checkout and authentication flows strictly protected against injections and unauthorized access.',
        githubUrl: 'https://github.com/Lettify/nutallis-brasil',
      },
    },
    {
      title: 'Controle de Vendas',
      year: '2026',
      kind: 'Web App',
      description: 'Daily sales and employee commission tracker with unique access code authentication and real-time metrics.',
      tags: ['React 19', 'tRPC', 'Drizzle', 'PostgreSQL'],
      url: 'https://controle-vendas-gold.vercel.app',
      glyph: 'R$',
      hues: [258, 205],
      badge: 'Live App',
      live: true,
      caseStudy: {
        subtitle: 'Operational Management & Daily Revenue Metrics',
        challenge:
          'Replace error-prone manual spreadsheets with a fast, reliable internal system for tracking daily sales numbers and operator commissions.',
        solution:
          'Reactive SPA built on React 19 and Drizzle ORM over PostgreSQL, featuring single-code employee authentication and live analytics dashboard.',
        architecture: [
          'React 19 concurrent hooks',
          'tRPC v11 for typed procedures',
          'Drizzle ORM with versioned migrations',
          'Neon Serverless PostgreSQL',
          'Real-time aggregated reporting',
        ],
        highlight:
          'Monetary arithmetic shielded against IEEE-754 floating-point inaccuracies (stored in integer cents) with auditable daily register balancing.',
        outcome:
          'Zero ledger discrepancies in daily closings and instantaneous team productivity reporting.',
        githubUrl: 'https://github.com/Lettify',
        liveUrl: 'https://controle-vendas-gold.vercel.app',
      },
    },
    {
      title: 'Let Assistant',
      year: '2026',
      kind: 'Discord Bot',
      description: 'Helpful Discord automation assistant — AI foundation model that identifies commercial intent and spam.',
      tags: ['TypeScript', 'Discord.js', 'AI'],
      url: 'https://github.com/Lettify/let-assistant',
      glyph: 'AI',
      hues: [240, 290],
      badge: 'In Progress',
      caseStudy: {
        subtitle: 'Automation & Contextual Moderation with LLMs',
        challenge:
          'Combat spam, masked self-promotion, and unauthorized commercial deals in large Discord communities that bypass traditional keyword filters.',
        solution:
          'Node.js and TypeScript microservice hooked to the Discord Gateway v14, submitting flagged messages to semantic LLM inference.',
        architecture: [
          'Strict TypeScript typing',
          'Discord.js v14 Event-Driven Engine',
          'LLM API integration with JSON Schema',
          'In-memory asynchronous rate limiter',
          'PM2 Process Management with auto-restart',
        ],
        highlight:
          'Structured few-shot prompt engineering designed to distinguish authentic member conversations from disguised sales pitches or scams.',
        outcome:
          'Over 95% accuracy in flagging unauthorized advertising, with optimized inference costs and sub-1.2s response latency.',
        githubUrl: 'https://github.com/Lettify/let-assistant',
      },
    },
    {
      title: 'WaterPositions MTA',
      year: '2021',
      kind: 'MTA Resource',
      description: 'Developer utility for Multi Theft Auto to map, render, and verify 3D water boundaries with ACL security permissions.',
      tags: ['Lua', 'MTA:SA', 'ACL'],
      url: 'https://github.com/Lettify/WaterPositions_MTA',
      glyph: '≋',
      hues: [212, 268],
      badge: '★ 3 stars',
      caseStudy: {
        subtitle: '3D Geographic Mapping & Server Utility',
        challenge:
          'Map and inspect complex 3D water volumes in the San Andreas world without degrading the client rendering frame rate.',
        solution:
          'Modular Lua resource with strict client/server division: client handles raycasting and 3D gizmos while the server authorizes commands via ACL.',
        architecture: [
          'Lua 5.1 / LuaJIT in MTA:SA',
          'Raycasting & 3D Geometry',
          'MTA ACL (Access Control List) Engine',
          'XML/JSON serialization and export',
        ],
        highlight:
          'Camera frustum sampling optimization: computationally heavy geometric calculations run solely within the player\'s active field of view.',
        outcome:
          'Solid 60 FPS performance, zero memory leaks, and organic adoption by community developers with 3 stars on GitHub.',
        githubUrl: 'https://github.com/Lettify/WaterPositions_MTA',
      },
    },
    {
      title: 'Engenharia de Prompt',
      year: '2026',
      kind: 'Research · UDF',
      description: 'Studies and experimental Python notebooks on prompt engineering developed during coursework at UDF University.',
      tags: ['Python', 'Jupyter', 'LLMs'],
      url: 'https://github.com/Lettify/engenharia-de-prompt-udf',
      glyph: '{ }',
      hues: [305, 335],
      badge: '★ 2 stars',
      caseStudy: {
        subtitle: 'Academic Research & Advanced LLM Techniques',
        challenge:
          'Empirically benchmark and document methods to prevent hallucinations and extract structured, validated outputs from language models for enterprise systems.',
        solution:
          'Curated Python notebooks exploring Chain-of-Thought (CoT), ReAct pattern, few-shot conditioning, and grammar constraints with Pydantic.',
        architecture: [
          'Python 3.11 & Jupyter Notebooks',
          'OpenAI SDK & LangChain Framework',
          'Pydantic schema validation',
          'Benchmarking hallucination rate & precision',
        ],
        highlight:
          'Engineering prompts with defensive guardrails ensuring outputs strictly conform to REST API contracts without manual post-processing.',
        outcome:
          'Top honors in the Systems Analysis & Development curriculum at UDF and 2 stars on GitHub as a reference for students.',
        githubUrl: 'https://github.com/Lettify/engenharia-de-prompt-udf',
      },
    },
    {
      title: 'MTA Wiki',
      year: '2026',
      kind: 'Open Source',
      description: 'Contribution to the modern Multi Theft Auto wiki, generated from structured data files to power developer tools and language servers.',
      tags: ['Lua', 'Docs', 'Open Source'],
      url: 'https://github.com/Lettify/wiki.multitheftauto.com',
      glyph: 'MTA',
      hues: [270, 235],
      badge: 'Contribution',
      caseStudy: {
        subtitle: 'Open Source Contribution & API Standardization',
        challenge:
          'Modernize legacy MTA documentation so automated tool pipelines and Language Server Protocols (LSP) can parse Lua API signatures.',
        solution:
          'Restructured function definitions, parameter metadata, and code examples for the automated generation pipeline of the project\'s new wiki.',
        architecture: [
          'Data-driven documentation schemas',
          'MediaWiki & Markdown parser data',
          'Lua return type standardization',
          'Collaborative Git/GitHub workflows',
        ],
        highlight:
          'Rigorous mapping of asynchronous events and network calls, eliminating ambiguities for both beginners and senior scripters.',
        outcome:
          'Merged into the global Multi Theft Auto repository ecosystem, benefiting thousands of server creators worldwide.',
        githubUrl: 'https://github.com/Lettify/wiki.multitheftauto.com',
      },
    },
  ],
};

export function getProjects(lang: 'pt' | 'en' = 'pt'): Project[] {
  return rawProjects[lang] || rawProjects.pt;
}

// Backward compatibility alias
export const projects: Project[] = rawProjects.pt;

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
