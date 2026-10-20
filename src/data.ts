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
