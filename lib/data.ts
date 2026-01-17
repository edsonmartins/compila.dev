/**
 * Dados estáticos para a landing page
 */

export const features = [
  {
    icon: "Gamepad2",
    title: "Gamificação",
    description:
      "Ganhe XP, suba de level, conquiste badges e apareça no leaderboard. Motivação para não parar.",
  },
  {
    icon: "Bot",
    title: "Análise por IA",
    description:
      "Feedback detalhado em português sobre seu código: boas práticas, performance, acessibilidade.",
  },
  {
    icon: "Briefcase",
    title: "Portfólio Profissional",
    description:
      "URL pública com seus projetos, currículo em PDF e analytics de visualizações.",
  },
  {
    icon: "Swords",
    title: "Batalhas ao Vivo",
    description:
      "Compete com outros devs em tempo real. Duelos, squads e torneios.",
  },
  {
    icon: "Users",
    title: "Comunidades por Stack",
    description:
      "Grupos de estudo, eventos ao vivo, mentoria coletiva.",
  },
  {
    icon: "Wrench",
    title: "Caixa de Ferramentas",
    description:
      "Compressor de imagens, formatters, geradores de código. Tudo online, sem instalar nada.",
  },
];

export const categories = [
  {
    icon: "Palette",
    title: "Frontend",
    count: 120,
    technologies: "React, Vue, Next.js, TypeScript",
  },
  {
    icon: "Settings",
    title: "Backend",
    count: 150,
    technologies: "Node.js, Python, Java, Go",
  },
  {
    icon: "Smartphone",
    title: "Mobile",
    count: 80,
    technologies: "Flutter, React Native, Swift, Kotlin",
  },
  {
    icon: "Plug",
    title: "IoT & Embedded",
    count: 50,
    technologies: "Arduino, ESP32, Raspberry Pi, MQTT",
  },
  {
    icon: "Rocket",
    title: "DevOps & Cloud",
    count: 60,
    technologies: "Docker, Kubernetes, Terraform, CI/CD",
  },
  {
    icon: "BarChart3",
    title: "Data & IA",
    count: 40,
    technologies: "Python, SQL, Pandas, scikit-learn",
  },
];

export const gamificationBenefits = [
  { icon: "Star", text: "Ganhe XP a cada desafio completado" },
  { icon: "Trophy", text: "Desbloqueie 50+ badges exclusivos" },
  { icon: "TrendingUp", text: "Suba no ranking nacional e regional" },
  { icon: "Flame", text: "Mantenha seu streak diário vivo" },
];

export const testimonials = [
  {
    quote:
      "Finalmente uma plataforma em português! Os desafios são realistas e o feedback da IA me ajudou muito a melhorar meu código.",
    author: "João Silva",
    role: "Desenvolvedor Frontend",
    company: "Nubank",
  },
  {
    quote:
      "Consegui minha primeira vaga júnior depois de completar 30 desafios e montar meu portfólio. O recrutador amou!",
    author: "Maria Santos",
    role: "Fullstack Developer",
    company: "iFood",
  },
  {
    quote:
      "Como mentor, recomendo Compila.dev para todos meus mentorados. O sistema de batalhas é viciante!",
    author: "Carlos Ferreira",
    role: "Tech Lead",
    company: "VTEX",
  },
];

export const pricingPlans = {
  free: {
    name: "FREE",
    price: "R$ 0",
    period: "Gratuito para sempre",
    features: [
      "50 desafios selecionados",
      "Portfólio público",
      "3 comunidades",
      "Ferramentas básicas",
      "XP e badges",
    ],
    cta: "Começar Grátis",
  },
  pro: {
    name: "PRO",
    price: "R$ 29,90",
    period: "por mês ou R$ 249/ano (30% off)",
    badge: "Mais Popular",
    features: [
      "Todos os 500+ desafios",
      "Feedback IA detalhado em português",
      "Comunidades ilimitadas",
      "Certificados verificados para LinkedIn",
      "Analytics completo do portfólio",
      "Ferramentas PRO exclusivas",
      "Suporte prioritário",
      "Sem anúncios",
    ],
    cta: "Começar teste grátis 7 dias",
    note: "Sem cartão de crédito",
  },
};

export const faqItems = [
  {
    question: "É realmente grátis?",
    answer:
      "Sim! Você tem acesso a 50 desafios, portfólio público e comunidades sem pagar nada. O plano PRO (R$ 29,90/mês) desbloqueia recursos avançados.",
  },
  {
    question: "Preciso saber inglês?",
    answer:
      "Não! Toda a plataforma, desafios e feedback estão 100% em português brasileiro.",
  },
  {
    question: "Que tecnologias posso praticar?",
    answer:
      "Frontend (React, Vue, Angular), Backend (Node, Python, Java), Mobile (Flutter, React Native), IoT (Arduino, ESP32), DevOps (Docker, K8s) e Data Science.",
  },
  {
    question: "Como funciona o feedback por IA?",
    answer:
      "Nossa IA analisa seu código e fornece feedback sobre: boas práticas, performance, acessibilidade, segurança e sugestões de melhoria. Tudo em português.",
  },
  {
    question: "Posso usar o portfólio em processos seletivos?",
    answer:
      "Sim! Seu portfólio tem URL pública (compila.dev/@seunome) e você pode exportar currículo em PDF. Muitos recrutadores já conhecem a plataforma.",
  },
  {
    question: "Como funcionam as batalhas?",
    answer:
      "São competições ao vivo onde você resolve o mesmo desafio que outros devs em tempo real. Há duelos 1v1, times e torneios com prêmios.",
  },
  {
    question: "Posso cancelar a assinatura PRO?",
    answer:
      "Sim, a qualquer momento. Você volta para o plano FREE mas mantém todo seu progresso e portfólio.",
  },
];

export const footerLinks = {
  produto: [
    { label: "Desafios", href: "/desafios" },
    { label: "Batalhas", href: "/batalhas" },
    { label: "Vagas", href: "/vagas" },
    { label: "Pricing", href: "/pricing" },
  ],
  empresa: [
    { label: "Sobre", href: "/sobre" },
    { label: "Time", href: "/time" },
    { label: "Contato", href: "/contato" },
    { label: "Imprensa", href: "/imprensa" },
  ],
  recursos: [
    { label: "Blog", href: "/blog" },
    { label: "Docs", href: "/docs" },
    { label: "Status", href: "/status" },
    { label: "GitHub", href: "/github" },
  ],
  legal: [
    { label: "Termos de Uso", href: "/termos" },
    { label: "Privacidade", href: "/privacidade" },
    { label: "Cookies", href: "/cookies" },
  ],
};

export const socialLinks = [
  { name: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
  { name: "Twitter", href: "https://twitter.com", icon: "twitter" },
  { name: "Discord", href: "https://discord.com", icon: "message-square" },
  { name: "YouTube", href: "https://youtube.com", icon: "youtube" },
];

export const companies = [
  { name: "Google", height: "h-8" },
  { name: "Nubank", height: "h-8" },
  { name: "iFood", height: "h-8" },
  { name: "Mercado Livre", height: "h-8" },
];
