export type Lang = 'pt' | 'en';

export interface Translations {
  nav: {
    about: string;
    expertise: string;
    projects: string;
    stack: string;
    beyond: string;
    contact: string;
    status: string;
    audio: string;
    menu: string;
  };
  hero: {
    portfolio: string;
    role1: string;
    role2: string;
    scrollText: string;
    tagline1: string;
    tagline2: string;
  };
  about: {
    label: string;
    lead: string;
    ghHandle: string;
    ghRepos: string;
    ghFollowers: string;
    p1: string;
    p2: string;
    btn: string;
    statsGithub: string;
    statsRepos: string;
    statsLangs: string;
    statsCuriosity: string;
  };
  bioHud: {
    sectionTitle: string;
    ageLabel: string;
    ageSuffix: string;
    ageSub: string;
    expLabel: string;
    expSuffix: string;
    expSub: string;
    locLabel: string;
    locValue: string;
    locSub: string;
    eduLabel: string;
    eduValue: string;
    eduSub: string;
    gamingLabel: string;
    gamingValue: string;
    gamingSub: string;
  };
  manifesto: {
    label: string;
    quote: string;
  };
  expertise: {
    label: string;
    title: string;
    s1Title: string;
    s1Desc: string;
    s2Title: string;
    s2Desc: string;
    s3Title: string;
    s3Desc: string;
    s4Title: string;
    s4Desc: string;
  };
  work: {
    label: string;
    title: string;
    deepDiveBtn: string;
    moreTitle: string;
    moreSub: string;
  };
  caseStudy: {
    challenge: string;
    solution: string;
    architecture: string;
    highlight: string;
    outcome: string;
    btnLive: string;
    btnGithub: string;
    btnClose: string;
  };
  stack: {
    label: string;
    title: string;
    hint: string;
  };
  beyond: {
    label: string;
    title: string;
    intro: string;
    c1Title: string;
    c1Desc: string;
    c2Title: string;
    c2Desc: string;
    c3Title: string;
    c3Desc: string;
  };
  contact: {
    label: string;
    title: string;
    titleLine1: string;
    titleLine2: string;
    sub: string;
    btnDirect: string;
    btnCopy: string;
    copied: string;
    modalTitle: string;
    modalSub: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    msgLabel: string;
    msgPlaceholder: string;
    btnSubmit: string;
    btnSending: string;
    successMsg: string;
  };
  footer: {
    rights: string;
    backToTop: string;
  };
  toasts: {
    ecoOn: string;
    ecoFps: string;
    ecoMax: string;
    emailCopied: string;
    purple: string;
    chess: string;
    lua: string;
    offline: string;
    online: string;
    appInstalled: string;
    updateAvailable: string;
  };
  pwa: {
    installBtn: string;
  };
}

export const translations: Record<Lang, Translations> = {
  pt: {
    nav: {
      about: 'Sobre',
      expertise: 'Expertise',
      projects: 'Projetos',
      stack: 'Stack',
      beyond: 'Além do código',
      contact: 'Contato',
      status: '<i></i>Disponível para projetos',
      audio: 'Som',
      menu: 'Menu',
    },
    hero: {
      portfolio: 'Portfólio',
      role1: 'Desenvolvedor <em>Full Stack</em>',
      role2: '& Analista de Sistemas',
      scrollText: 'role para explorar • role para explorar • ',
      tagline1: 'Sistemas robustos, arquiteturas limpas',
      tagline2: 'e experiências que ficam na memória.',
    },
    about: {
      label: 'Sobre mim',
      lead: 'Olá, eu sou o Michael. Construo <em>sistemas robustos</em> e <em>arquiteturas limpas</em> — aliando a precisão do código à compreensão do comportamento humano.',
      ghHandle: '@Lettify · UDF',
      ghRepos: 'repos',
      ghFollowers: 'seguidores',
      p1: 'Graduando em Análise e Desenvolvimento de Sistemas na UDF, baseado em Brasília. Uso minha experiência técnica para criar automações inteligentes e infraestruturas escaláveis — do primeiro commit ao deploy final.',
      p2: 'Lidero, organizo fluxos e estabeleço métricas de evolução técnica. Acredito que tipagem forte e semântica clara valem mais que mil comentários.',
      btn: 'Vamos conversar',
      statsGithub: 'Codando no GitHub desde',
      statsRepos: 'Repositórios públicos',
      statsLangs: 'Linguagens principais',
      statsCuriosity: 'Curiosidade',
    },
    bioHud: {
      sectionTitle: 'Identidade & Especificações',
      ageLabel: 'IDADE & ORIGEM',
      ageSuffix: 'anos',
      ageSub: 'Nascido em 17/08/2002',
      expLabel: 'EXPERIÊNCIA',
      expSuffix: '+ anos',
      expSub: 'No ecossistema dev desde 2016',
      locLabel: 'BASE & LOCALIDADE',
      locValue: 'Brasília, DF',
      locSub: 'Brasil 🇧🇷 · Fuso Horário BRT (UTC-3)',
      eduLabel: 'FORMAÇÃO UNIVERSITÁRIA',
      eduValue: 'Análise e Desenv. de Sistemas',
      eduSub: 'Centro Universitário UDF (Brasília)',
      gamingLabel: 'LAZER & GAMING',
      gamingValue: 'MOBAs & FPS Competitivos',
      gamingSub: 'Estratégia, reflexos rápidos e sinergia de squad',
    },
    manifesto: {
      label: 'Filosofia — Clean Code',
      quote: '“Se você precisa comentar o que uma função faz e quais são seus parâmetros em uma linguagem tipada, o código ainda não está limpo o suficiente.”',
    },
    expertise: {
      label: 'Expertise',
      title: 'O que eu <em>faço</em>',
      s1Title: 'Full Stack Web',
      s1Desc: 'Aplicações completas com tipagem ponta a ponta: React, TypeScript, Node.js, tRPC e PostgreSQL — de plataformas escaláveis a painéis de gestão modernos.',
      s2Title: 'IA & Automação',
      s2Desc: 'Agentes autônomos, engenharia de prompt avançada e bots inteligentes para Discord: moderação contextual com LLMs e integração com APIs modernas.',
      s3Title: 'DevOps & Cloud',
      s3Desc: 'Infraestrutura estável e segura: servidores Linux/Nginx, orquestração com PM2, pipelines de CI/CD automatizados com GitHub Actions e deploy contínuo.',
      s4Title: 'Scripting MTA & Lua',
      s4Desc: 'Sistemas complexos de alta performance para Multi Theft Auto: sanitização SQL, otimização de rede UDP de baixa latência e arquiteturas seguras em Lua.',
    },
    work: {
      label: 'Projetos selecionados',
      title: 'Trabalhos <em>recentes</em>',
      deepDiveBtn: 'Raio-X Técnico',
      moreTitle: 'Ver tudo<br/>no GitHub ↗',
      moreSub: '26 repositórios públicos',
    },
    caseStudy: {
      challenge: 'Desafio Técnico',
      solution: 'Solução de Engenharia',
      architecture: 'Arquitetura & Stack',
      highlight: 'Destaque de Código',
      outcome: 'Métricas & Resultados',
      btnLive: 'Acessar Projeto ↗',
      btnGithub: 'Ver Código Fonte ↗',
      btnClose: 'Fechar Estudo de Caso',
    },
    stack: {
      label: 'Tech stack',
      title: 'Minha <em>caixa</em> de ferramentas',
      hint: '↳ Arraste, jogue, bagunce. Elas aguentam.',
    },
    beyond: {
      label: 'Além do código',
      title: 'Pessoas & <em>estratégia</em>',
      intro: 'Além da tecnologia, estudo <strong>Comportamento Humano e Linguagem Corporal</strong> — o que potencializa minha atuação em cargos estratégicos.',
      c1Title: 'Liderança & Equipes',
      c1Desc: 'Experiência em guiar desenvolvedores e estabelecer métricas de evolução técnica.',
      c2Title: 'Gestão de Projetos',
      c2Desc: 'Visão sistêmica para organizar fluxos de trabalho, da concepção ao deploy final.',
      c3Title: 'Comunicação Clara',
      c3Desc: 'Ponte direta entre visão de produto, times de engenharia e decisões de negócio.',
    },
    contact: {
      label: 'Contato',
      title: 'Vamos criar algo lendário juntos?',
      titleLine1: 'Vamos criar',
      titleLine2: 'algo lendário?',
      sub: 'Disponível para novos projetos, consultorias e posições de alto impacto.',
      btnDirect: 'Enviar Mensagem Direta ✦',
      btnCopy: 'Copiar E-mail ✦',
      copied: 'E-mail copiado ✦ contato@michael.dev.br',
      modalTitle: 'Iniciar Conversa',
      modalSub: 'Preencha os campos abaixo. Respondo com agilidade no mesmo dia.',
      nameLabel: 'Seu Nome / Empresa',
      namePlaceholder: 'Como posso te chamar?',
      emailLabel: 'Seu E-mail Profissional',
      emailPlaceholder: 'seu.email@empresa.com',
      msgLabel: 'Sobre o Projeto ou Oportunidade',
      msgPlaceholder: 'Conte um pouco sobre sua ideia, escopo ou oportunidade...',
      btnSubmit: 'Enviar Mensagem ✦',
      btnSending: 'Transmitindo dados...',
      successMsg: 'Mensagem enviada com sucesso! Respondo em breve.',
    },
    footer: {
      rights: 'Projetado & Construído por Michael Silva. Todos os direitos reservados.',
      backToTop: 'Voltar ao topo ↑',
    },
    toasts: {
      ecoOn: '✦ Modo Eco ativado para poupar bateria',
      ecoFps: '✦ Performance adaptativa ativada',
      ecoMax: '✦ Gráficos em performance máxima',
      emailCopied: 'E-mail copiado ✦ contato@michael.dev.br',
      purple: '💜 Roxo é a melhor cor. Concordo.',
      chess: '♞ Xeque-mate.',
      lua: '🌙 local dev = "Michael"',
      offline: '✦ Modo Offline ativo — Navegação em cache completa',
      online: '✦ Conexão restabelecida ✦ Online',
      appInstalled: '✦ Aplicativo instalado com sucesso!',
      updateAvailable: '✦ Nova versão do portfólio sincronizada',
    },
    pwa: {
      installBtn: '✦ Instalar Aplicativo (PWA)',
    },
  },
  en: {
    nav: {
      about: 'About',
      expertise: 'Expertise',
      projects: 'Projects',
      stack: 'Stack',
      beyond: 'Beyond Code',
      contact: 'Contact',
      status: '<i></i>Available for projects',
      audio: 'Audio',
      menu: 'Menu',
    },
    hero: {
      portfolio: 'Portfolio',
      role1: '<em>Full Stack</em> Developer',
      role2: '& Systems Analyst',
      scrollText: 'scroll to explore • scroll to explore • ',
      tagline1: 'Robust systems, clean architectures,',
      tagline2: 'and memorable interactive digital experiences.',
    },
    about: {
      label: 'About me',
      lead: "Hello, I'm Michael. I engineer <em>robust systems</em> and <em>clean architectures</em> — uniting code precision with human behavior insights.",
      ghHandle: '@Lettify · UDF',
      ghRepos: 'repos',
      ghFollowers: 'followers',
      p1: 'Undergraduate in Systems Analysis & Development at UDF, based in Brasília, Brazil. I leverage deep technical expertise to build intelligent automations and scalable cloud infrastructures — from the initial commit to production deploy.',
      p2: 'I guide engineering squads, organize delivery workflows, and establish technical growth metrics. I firmly believe strong typing and clear semantics beat a thousand comments.',
      btn: "Let's talk",
      statsGithub: 'Coding on GitHub since',
      statsRepos: 'Public repositories',
      statsLangs: 'Primary languages',
      statsCuriosity: 'Curiosity',
    },
    bioHud: {
      sectionTitle: 'Identity & Specifications',
      ageLabel: 'AGE & ORIGIN',
      ageSuffix: 'yrs old',
      ageSub: 'Born Aug 17, 2002',
      expLabel: 'EXPERIENCE',
      expSuffix: '+ yrs',
      expSub: 'In the dev ecosystem since 2016',
      locLabel: 'LOCATION & BASE',
      locValue: 'Brasília, DF',
      locSub: 'Brazil 🇧🇷 · Timezone BRT (UTC-3)',
      eduLabel: 'ACADEMIC DEGREE',
      eduValue: 'Systems Analysis & Dev.',
      eduSub: 'UDF University Center (Brasília)',
      gamingLabel: 'GAMING & INTERESTS',
      gamingValue: 'Competitive MOBAs & FPS',
      gamingSub: 'Team strategy, fast reflexes and squad synergy',
    },
    manifesto: {
      label: 'Philosophy — Clean Code',
      quote: '“If you have to comment what a function does and its parameters in a typed language, the code simply isn’t clean enough yet.”',
    },
    expertise: {
      label: 'Expertise',
      title: 'What I <em>do</em>',
      s1Title: 'Full Stack Web',
      s1Desc: 'End-to-end type-safe web applications: React, TypeScript, Node.js, tRPC, and PostgreSQL — from scalable platforms to modern real-time management dashboards.',
      s2Title: 'AI & Automation',
      s2Desc: 'Autonomous agents, advanced prompt engineering, and intelligent Discord bots: contextual LLM moderation and modern API orchestration.',
      s3Title: 'DevOps & Cloud',
      s3Desc: 'Resilient cloud infrastructure: Linux/Nginx servers, PM2 process management, automated CI/CD pipelines with GitHub Actions, and continuous delivery.',
      s4Title: 'MTA Scripting & Lua',
      s4Desc: 'High-performance complex game systems for Multi Theft Auto: SQL sanitization, low-latency UDP network optimization, and secure Lua architectures.',
    },
    work: {
      label: 'Selected Projects',
      title: 'Recent <em>works</em>',
      deepDiveBtn: 'Technical Deep Dive',
      moreTitle: 'View all on<br/>GitHub ↗',
      moreSub: '26 public repositories',
    },
    caseStudy: {
      challenge: 'Technical Challenge',
      solution: 'Engineering Solution',
      architecture: 'Architecture & Stack',
      highlight: 'Code Highlight',
      outcome: 'Metrics & Results',
      btnLive: 'Open Live App ↗',
      btnGithub: 'View Source Code ↗',
      btnClose: 'Close Case Study',
    },
    stack: {
      label: 'Tech stack',
      title: 'My tool<em>box</em>',
      hint: '↳ Drag, toss, make a mess. They can take it.',
    },
    beyond: {
      label: 'Beyond Code',
      title: 'People & <em>strategy</em>',
      intro: 'Beyond software engineering, I study <strong>Human Behavior and Nonverbal Dynamics</strong> — empowering my communication in strategic leadership roles.',
      c1Title: 'Leadership & Teams',
      c1Desc: 'Experience mentoring developers and establishing technical engineering progression standards.',
      c2Title: 'Project Management',
      c2Desc: 'Systemic mindset for structuring engineering workflows, from inception to production deployment.',
      c3Title: 'Clear Communication',
      c3Desc: 'Direct bridge between product vision, engineering squads, and high-stakes business decisions.',
    },
    contact: {
      label: 'Contact',
      title: "Let's build something legendary together.",
      titleLine1: "Let's build",
      titleLine2: 'something legendary?',
      sub: 'Available for new projects, technical consulting, and high-impact engineering roles.',
      btnDirect: 'Send Direct Message ✦',
      btnCopy: 'Copy E-mail ✦',
      copied: 'E-mail copied ✦ contato@michael.dev.br',
      modalTitle: 'Start a Conversation',
      modalSub: 'Fill out the form below. I respond promptly within the same day.',
      nameLabel: 'Your Name / Company',
      namePlaceholder: 'What should I call you?',
      emailLabel: 'Your Professional E-mail',
      emailPlaceholder: 'your.email@company.com',
      msgLabel: 'About the Project or Opportunity',
      msgPlaceholder: 'Tell me a bit about your project idea, scope, or job opportunity...',
      btnSubmit: 'Send Message ✦',
      btnSending: 'Transmitting payload...',
      successMsg: 'Message sent successfully! I will reply shortly.',
    },
    footer: {
      rights: 'Designed & Engineered by Michael Silva. All rights reserved.',
      backToTop: 'Back to top ↑',
    },
    toasts: {
      ecoOn: '✦ Eco Mode enabled to preserve battery',
      ecoFps: '✦ Adaptive performance engaged',
      ecoMax: '✦ Full graphics performance active',
      emailCopied: 'E-mail copied ✦ contato@michael.dev.br',
      purple: '💜 Purple is the best color. Agreed.',
      chess: '♞ Checkmate.',
      lua: '🌙 local dev = "Michael"',
      offline: '✦ Offline Mode active — Full cache browsing ready',
      online: '✦ Connection restored ✦ Back online',
      appInstalled: '✦ App installed successfully!',
      updateAvailable: '✦ Fresh version of portfolio synced',
    },
    pwa: {
      installBtn: '✦ Install App (PWA)',
    },
  },
};
