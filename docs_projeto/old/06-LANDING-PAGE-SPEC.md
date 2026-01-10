# Compila.dev - Especificação da Landing Page

## 1. Objetivos da Landing Page

### Objetivos Primários
- **Conversão em cadastros:** 10% dos visitantes criam conta
- **Comunicar proposta de valor:** Em 5 segundos, visitante entende o que é
- **Gerar interesse:** Scroll até seção de features
- **Capturar leads:** Email para lista de espera (pré-lançamento)

### Objetivos Secundários
- SEO: Rankear para "desafios programação", "praticar código"
- Social proof: Mostrar credibilidade (betas, depoimentos)
- Viralização: Botões de compartilhamento

---

## 2. Estrutura da Página

### Seções (ordem)

1. **Hero Section** (above the fold)
2. **Social Proof** (logos, números)
3. **Como Funciona** (3 passos)
4. **Features Principais** (grid 3 colunas)
5. **Categorias de Desafios** (6 áreas tech)
6. **Gamificação** (XP, badges, leaderboard)
7. **Depoimentos** (3 cards)
8. **Pricing** (Free vs PRO)
9. **CTA Final** (cadastro)
10. **FAQ** (5-7 perguntas)
11. **Footer**

---

## 3. Seção por Seção - Detalhamento

### 3.1 Hero Section

**Layout:**
```
┌─────────────────────────────────────────────────┐
│  [Logo Compila.dev]           [Login] [Cadastro]│
│                                                  │
│  Compile conhecimento,                          │
│  execute sua carreira                           │
│                                                  │
│  Pratique programação com desafios reais em     │
│  Frontend, Backend, Mobile, IoT e mais.         │
│  100% em português.                             │
│                                                  │
│  [Começar Grátis]  [Ver Desafios]              │
│                                                  │
│  ✓ 500+ desafios    ✓ Sem cartão  ✓ Português  │
│                                                  │
│             [Imagem/Vídeo Hero]                 │
│    Screenshot da plataforma ou demo animado     │
└─────────────────────────────────────────────────┘
```

**Copy:**

**Headline Principal:**
```
Compile conhecimento, 
execute sua carreira
```

**Subheadline:**
```
Pratique programação com desafios reais em Frontend, 
Backend, Mobile, IoT e DevOps. 100% em português.
```

**CTA Primário:** "Começar Grátis" (botão laranja/destaque)
**CTA Secundário:** "Ver Desafios" (botão outline)

**Trust Badges:**
- ✓ 500+ desafios práticos
- ✓ Sem cartão de crédito
- ✓ Totalmente em português

**Hero Visual:**
- **Opção A:** Screenshot da plataforma (dashboard com desafios)
- **Opção B:** Vídeo de 15s mostrando fluxo (escolher desafio → código → feedback)
- **Opção C:** Animação Lottie de código sendo compilado

---

### 3.2 Social Proof

**Layout:** Faixa horizontal logo após hero

```
Junte-se a 1.247 desenvolvedores praticando código em português

[Avatar1] [Avatar2] [Avatar3] [Avatar4] [+1.243]

Confiado por desenvolvedores de:
[Logo Google]  [Logo Nubank]  [Logo iFood]  [Logo MercadoLivre]
```

**Copy:**
```
"Junte-se a X desenvolvedores praticando código em português"
```

**Elementos:**
- Avatares de usuários (rostos desfocados para privacidade)
- Logos de empresas onde alunos trabalham (se tiver permissão)
- Número atualizado em tempo real (via API)

---

### 3.3 Como Funciona

**Layout:** 3 colunas com ícones

```
┌───────────┬───────────┬───────────┐
│   [🎯]    │   [💻]    │   [🚀]    │
│  Escolha  │  Resolva  │  Evolua   │
│           │           │           │
│ Desafio   │ No seu    │ Com XP,   │
│ do seu    │ ambiente  │ badges e  │
│ nível     │ preferido │ portfólio │
└───────────┴───────────┴───────────┘
```

**Copy:**

**Título da Seção:**
```
Como funciona
```

**Passo 1: Escolha**
```
🎯 Escolha seu desafio
Navegue por 500+ desafios em Frontend, Backend, 
Mobile, IoT, DevOps e Data Science.
```

**Passo 2: Resolva**
```
💻 Code no seu ritmo
Use suas ferramentas preferidas, submeta quando 
estiver pronto. Sem tempo limite.
```

**Passo 3: Evolua**
```
🚀 Receba feedback IA
Análise automática do código, XP, badges e 
destaque no seu portfólio público.
```

---

### 3.4 Features Principais

**Layout:** Grid 2x3

```
┌────────────────────┬────────────────────┐
│ 🎮 Gamificação     │ 🤖 Feedback IA     │
│ XP, levels, badges │ Análise de código  │
├────────────────────┼────────────────────┤
│ 💼 Portfólio       │ ⚔️ Batalhas        │
│ Público + currículo│ Competições live   │
├────────────────────┼────────────────────┤
│ 👥 Comunidades     │ 🛠️ Ferramentas     │
│ Grupos por stack   │ 30+ utils online   │
└────────────────────┴────────────────────┘
```

**Copy:**

**Título:**
```
Tudo que você precisa para evoluir
```

**Feature 1: Gamificação**
```
🎮 Sistema de Gamificação
Ganhe XP, suba de level, conquiste badges e 
apareça no leaderboard. Motivação para não parar.
```

**Feature 2: Feedback IA**
```
🤖 Análise por Inteligência Artificial
Feedback detalhado em português sobre seu código: 
boas práticas, performance, acessibilidade.
```

**Feature 3: Portfólio Público**
```
💼 Portfólio Profissional
URL pública com seus projetos, currículo em PDF 
e analytics de visualizações.
```

**Feature 4: Batalhas**
```
⚔️ Batalhas ao Vivo
Compete com outros devs em tempo real. 
Duelos, squads e torneios.
```

**Feature 5: Comunidades**
```
👥 Comunidades por Stack
Grupos de estudo, eventos ao vivo, 
mentoria coletiva.
```

**Feature 6: Ferramentas**
```
🛠️ Caixa de Ferramentas
Compressor de imagens, formatters, geradores 
de código. Tudo online, sem instalar nada.
```

---

### 3.5 Categorias de Desafios

**Layout:** 6 cards horizontais com preview

```
┌──────────────────────────────────────┐
│ Frontend   [Preview]   120 desafios  │
│ React, Vue, CSS, HTML                │
├──────────────────────────────────────┤
│ Backend    [Preview]   150 desafios  │
│ Node, Python, Java, APIs             │
├──────────────────────────────────────┤
│ Mobile     [Preview]    80 desafios  │
│ Flutter, React Native                │
├──────────────────────────────────────┤
│ IoT        [Preview]    50 desafios  │
│ Arduino, ESP32, MQTT                 │
├──────────────────────────────────────┤
│ DevOps     [Preview]    60 desafios  │
│ Docker, K8s, CI/CD                   │
├──────────────────────────────────────┤
│ Data       [Preview]    40 desafios  │
│ Python, SQL, ETL                     │
└──────────────────────────────────────┘
```

**Copy:**

**Título:**
```
Desafios para todas as áreas
```

**Subtítulo:**
```
Mais de 500 desafios práticos cobrindo todo o 
ecossistema de desenvolvimento moderno.
```

**Frontend:**
```
🎨 Frontend (120 desafios)
De landing pages responsivas a SPAs complexas. 
React, Vue, Next.js, TypeScript.
```

**Backend:**
```
⚙️ Backend (150 desafios)
APIs RESTful, microservices, bancos de dados. 
Node.js, Python, Java, Go.
```

**Mobile:**
```
📱 Mobile (80 desafios)
Apps nativos e cross-platform. 
Flutter, React Native, Swift, Kotlin.
```

**IoT:**
```
🔌 IoT & Embedded (50 desafios)
Sensores, automação, protocolos. 
Arduino, ESP32, Raspberry Pi, MQTT.
```

**DevOps:**
```
🚀 DevOps & Cloud (60 desafios)
Containers, orquestração, IaC. 
Docker, Kubernetes, Terraform, CI/CD.
```

**Data:**
```
📊 Data & IA (40 desafios)
Pipelines ETL, análise, ML básico. 
Python, SQL, Pandas, scikit-learn.
```

---

### 3.6 Gamificação

**Layout:** Visual interativo

```
┌─────────────────────────────────────┐
│  [Mockup de perfil com XP/Badges]   │
│                                      │
│  Seu progresso visível               │
│                                      │
│  • 10 XP por desafio resolvido       │
│  • Badges por conquistas             │
│  • Apareça no leaderboard            │
│  • Streaks diários                   │
└─────────────────────────────────────┘
```

**Copy:**

**Título:**
```
Acompanhe sua evolução
```

**Subtítulo:**
```
Sistema de XP, badges e leaderboard para 
manter você motivado.
```

**Bullets:**
- ⭐ Ganhe XP a cada desafio completado
- 🏆 Desbloqueie 50+ badges exclusivos
- 📈 Suba no ranking nacional e regional
- 🔥 Mantenha seu streak diário vivo

**CTA:** "Ver meu perfil de exemplo"

---

### 3.7 Depoimentos

**Layout:** 3 cards lado a lado

```
┌─────────────┬─────────────┬─────────────┐
│ [Avatar]    │ [Avatar]    │ [Avatar]    │
│ "Quote..."  │ "Quote..."  │ "Quote..."  │
│             │             │             │
│ - Nome      │ - Nome      │ - Nome      │
│   Cargo     │   Cargo     │   Cargo     │
└─────────────┴─────────────┴─────────────┘
```

**Copy:**

**Título:**
```
O que dizem os desenvolvedores
```

**Depoimento 1:**
```
"Finalmente uma plataforma em português! Os desafios 
são realistas e o feedback da IA me ajudou muito 
a melhorar meu código."

— João Silva
Desenvolvedor Frontend na Nubank
```

**Depoimento 2:**
```
"Consegui minha primeira vaga júnior depois de 
completar 30 desafios e montar meu portfólio. 
O recrutador amou!"

— Maria Santos  
Fullstack Developer na iFood
```

**Depoimento 3:**
```
"Como mentor, recomendo Compila.dev para todos 
meus mentorados. O sistema de batalhas é viciante!"

— Carlos Ferreira
Tech Lead na VTEX
```

---

### 3.8 Pricing

**Layout:** 2 colunas (Free vs PRO)

```
┌──────────────────┬──────────────────┐
│      FREE        │      PRO         │
│     R$ 0         │   R$ 29,90/mês   │
├──────────────────┼──────────────────┤
│ ✓ 50 desafios    │ ✓ 500+ desafios  │
│ ✓ Portfólio      │ ✓ Feedback IA    │
│ ✓ Comunidades    │ ✓ Certificados   │
│ ✓ Ferramentas    │ ✓ Sem anúncios   │
│                  │ ✓ Analytics      │
│                  │                  │
│ [Começar Grátis] │ [Assinar PRO]    │
└──────────────────┴──────────────────┘
```

**Copy:**

**Título:**
```
Comece grátis, evolua quando quiser
```

**Plano FREE:**
```
Gratuito para sempre

✓ 50 desafios selecionados
✓ Portfólio público
✓ 3 comunidades
✓ Ferramentas básicas
✓ XP e badges

[Começar Grátis]
```

**Plano PRO:**
```
R$ 29,90/mês
ou R$ 249/ano (30% off)

✓ Todos os 500+ desafios
✓ Feedback IA detalhado
✓ Comunidades ilimitadas
✓ Certificados verificados
✓ Analytics do portfólio
✓ Ferramentas PRO
✓ Suporte prioritário
✓ Sem anúncios

[Começar teste grátis 7 dias]
Sem cartão de crédito
```

---

### 3.9 CTA Final

**Layout:** Faixa de destaque

```
┌─────────────────────────────────────┐
│                                      │
│  Pronto para compilar seu futuro?    │
│                                      │
│  Junte-se a milhares de devs         │
│  praticando em português             │
│                                      │
│     [Criar Conta Grátis]             │
│                                      │
│  ✓ Sem cartão  ✓ 2 minutos  ✓ Grátis│
└─────────────────────────────────────┘
```

**Copy:**

**Título:**
```
Pronto para compilar seu futuro?
```

**Subtítulo:**
```
Junte-se a milhares de desenvolvedores 
praticando código em português.
```

**CTA:** "Criar Conta Grátis"

**Trust badges:**
- ✓ Sem cartão de crédito
- ✓ Cadastro em 2 minutos
- ✓ Cancele quando quiser

---

### 3.10 FAQ

**Copy:**

**Título:**
```
Perguntas Frequentes
```

**Q1: É realmente grátis?**
```
Sim! Você tem acesso a 50 desafios, portfólio público 
e comunidades sem pagar nada. O plano PRO (R$ 29,90/mês) 
desbloqueia recursos avançados.
```

**Q2: Preciso saber inglês?**
```
Não! Toda a plataforma, desafios e feedback estão 100% 
em português brasileiro.
```

**Q3: Que tecnologias posso praticar?**
```
Frontend (React, Vue, Angular), Backend (Node, Python, Java), 
Mobile (Flutter, React Native), IoT (Arduino, ESP32), 
DevOps (Docker, K8s) e Data Science.
```

**Q4: Como funciona o feedback por IA?**
```
Nossa IA analisa seu código e fornece feedback sobre: 
boas práticas, performance, acessibilidade, segurança 
e sugestões de melhoria. Tudo em português.
```

**Q5: Posso usar o portfólio em processos seletivos?**
```
Sim! Seu portfólio tem URL pública (compila.dev/@seunome) 
e você pode exportar currículo em PDF. Muitos recrutadores 
já conhecem a plataforma.
```

**Q6: Como funcionam as batalhas?**
```
São competições ao vivo onde você resolve o mesmo desafio 
que outros devs em tempo real. Há duelos 1v1, times e 
torneios com prêmios.
```

**Q7: Posso cancelar a assinatura PRO?**
```
Sim, a qualquer momento. Você volta para o plano FREE 
mas mantém todo seu progresso e portfólio.
```

---

### 3.11 Footer

**Layout:** 4 colunas

```
┌──────────┬──────────┬──────────┬──────────┐
│ Produto  │ Empresa  │ Recursos │ Legal    │
├──────────┼──────────┼──────────┼──────────┤
│ Desafios │ Sobre    │ Blog     │ Termos   │
│ Batalhas │ Time     │ Docs     │ Privac.  │
│ Vagas    │ Contato  │ Status   │ Cookies  │
│ Pricing  │ Imprensa │ GitHub   │          │
└──────────┴──────────┴──────────┴──────────┘

         [Logo Compila.dev]
         
[LinkedIn] [Twitter] [Discord] [YouTube]

© 2025 Compila.dev - Compile conhecimento, execute sua carreira
```

---

## 4. Design System

### 4.1 Cores

**Primária:**
```
Laranja: #FF6B35 (energia, ação)
```

**Secundária:**
```
Azul Escuro: #1E3A8A (confiança, tech)
```

**Neutras:**
```
Branco: #FFFFFF
Cinza Claro: #F3F4F6
Cinza Médio: #6B7280
Preto: #111827
```

**Feedback:**
```
Sucesso: #10B981
Erro: #EF4444
Aviso: #F59E0B
Info: #3B82F6
```

### 4.2 Tipografia

**Headings:**
```
Font: Inter Bold
H1: 56px (mobile: 36px)
H2: 48px (mobile: 32px)
H3: 36px (mobile: 28px)
```

**Body:**
```
Font: Inter Regular
Body: 18px
Small: 16px
```

**Code:**
```
Font: Fira Code
Size: 16px
```

### 4.3 Espaçamento

```
XS: 8px
S: 16px
M: 24px
L: 48px
XL: 96px
```

### 4.4 Botões

**CTA Primário:**
```
Background: #FF6B35
Text: #FFFFFF
Padding: 16px 32px
Border-radius: 8px
Font-weight: 600
Hover: #E55A2B
```

**CTA Secundário:**
```
Background: transparent
Border: 2px solid #FF6B35
Text: #FF6B35
Padding: 14px 30px
Border-radius: 8px
Hover: Background #FF6B35, Text #FFFFFF
```

---

## 5. Responsividade

### 5.1 Breakpoints

```
Mobile: < 768px
Tablet: 768px - 1024px
Desktop: > 1024px
```

### 5.2 Mobile-First

**Hero Mobile:**
- Headline menor (36px)
- Imagem hero reduzida
- CTAs full-width
- Stack vertical

**Features Mobile:**
- Grid 1 coluna
- Cards full-width
- Menos padding

**Pricing Mobile:**
- Cards empilhados
- Destaque visual no PRO

---

## 6. Performance

### 6.1 Metas

- **Lighthouse Score:** >90
- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <3s
- **Cumulative Layout Shift:** <0.1

### 6.2 Otimizações

- Lazy loading de imagens
- WebP com fallback
- Minify CSS/JS
- CDN para assets
- Preload de fonts

---

## 7. SEO

### 7.1 Meta Tags

```html
<title>Compila.dev - Pratique programação com desafios reais em português</title>

<meta name="description" content="Mais de 500 desafios de programação em Frontend, Backend, Mobile, IoT e DevOps. Feedback por IA, portfólio público e comunidade brasileira. Comece grátis!">

<meta name="keywords" content="desafios programação, exercícios código, praticar programação, frontend backend mobile, português">

<!-- Open Graph -->
<meta property="og:title" content="Compila.dev - Compile conhecimento, execute sua carreira">
<meta property="og:description" content="Pratique programação com 500+ desafios reais. 100% em português.">
<meta property="og:image" content="https://compila.dev/og-image.png">
<meta property="og:url" content="https://compila.dev">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Compila.dev">
<meta name="twitter:description" content="500+ desafios de programação em português">
<meta name="twitter:image" content="https://compila.dev/twitter-image.png">
```

### 7.2 Structured Data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Compila.dev",
  "url": "https://compila.dev",
  "description": "Plataforma brasileira de desafios de programação",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://compila.dev/desafios?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### 7.3 Palavras-chave Alvo

**Primárias:**
- desafios programação
- exercícios código
- praticar programação
- desafios frontend
- desafios backend

**Secundárias:**
- aprender programação praticando
- portfólio desenvolvedor
- comunidade programadores brasil
- feedback código ia

---

## 8. Conversão e Analytics

### 8.1 Eventos para Rastrear

```javascript
// Google Analytics 4 Events

// Pageview
gtag('event', 'page_view', {
  page_title: 'Home',
  page_location: window.location.href
});

// Cliques em CTAs
gtag('event', 'cta_click', {
  cta_location: 'hero',
  cta_text: 'Começar Grátis'
});

// Scroll depth
gtag('event', 'scroll', {
  percent_scrolled: 50
});

// Video play (hero)
gtag('event', 'video_play', {
  video_title: 'Hero Demo'
});

// FAQ expand
gtag('event', 'faq_expand', {
  question: 'É realmente grátis?'
});
```

### 8.2 A/B Tests

**Teste 1: Headlines**
- Variante A: "Compile conhecimento, execute sua carreira"
- Variante B: "Da prática ao primeiro emprego tech"

**Teste 2: CTA Hero**
- Variante A: "Começar Grátis"
- Variante B: "Ver Desafios Grátis"

**Teste 3: Social Proof**
- Variante A: Número de usuários
- Variante B: Logos de empresas

### 8.3 Heatmaps

Usar Hotjar/Microsoft Clarity para:
- Cliques
- Scroll depth
- Session recordings
- Rage clicks

---

## 9. Acessibilidade (A11y)

### 9.1 Checklist WCAG 2.1 AA

- [ ] Contraste mínimo 4.5:1 (texto)
- [ ] Contraste mínimo 3:1 (elementos gráficos)
- [ ] Navegação por teclado completa
- [ ] Focus indicators visíveis
- [ ] Alt text em todas as imagens
- [ ] Labels em inputs
- [ ] ARIA labels quando necessário
- [ ] Heading hierarchy correta (H1 → H2 → H3)
- [ ] Skip to content link
- [ ] Sem auto-play de vídeos com som

### 9.2 Exemplo: Hero Acessível

```html
<section aria-label="Seção principal">
  <h1>Compile conhecimento, execute sua carreira</h1>
  
  <p>
    Pratique programação com desafios reais em Frontend, 
    Backend, Mobile, IoT e DevOps. 100% em português.
  </p>
  
  <div role="group" aria-label="Ações principais">
    <a href="/cadastro" 
       class="btn-primary"
       aria-label="Criar conta gratuita">
      Começar Grátis
    </a>
    
    <a href="/desafios" 
       class="btn-secondary"
       aria-label="Explorar desafios disponíveis">
      Ver Desafios
    </a>
  </div>
</section>
```

---

## 10. Tecnologia Recomendada

### 10.1 Stack Frontend

**Framework:** Next.js 14 (App Router)
- SSG para landing page (super rápido)
- Image optimization automático
- SEO built-in

**Styling:** Tailwind CSS
- Utility-first
- Purge CSS automático
- Responsivo fácil

**Animações:** Framer Motion
- Scroll animations
- Page transitions
- Micro-interactions

**Analytics:** 
- Google Analytics 4
- Plausible (privacy-friendly alternativa)

**A/B Testing:** Vercel Edge Config ou Posthog

### 10.2 Hospedagem

**Vercel** (recomendado)
- Deploy automático
- Edge network global
- Analytics built-in
- Preview deploys

**Alternativa:** Netlify, Cloudflare Pages

---

## 11. Cronograma de Desenvolvimento

### Sprint 1 (Semana 1)
- [ ] Setup Next.js project
- [ ] Design system (cores, tipografia, componentes)
- [ ] Hero section
- [ ] Footer

### Sprint 2 (Semana 2)
- [ ] Features section
- [ ] Categorias de desafios
- [ ] Pricing
- [ ] CTA final

### Sprint 3 (Semana 3)
- [ ] Como funciona
- [ ] Gamificação visual
- [ ] Depoimentos
- [ ] FAQ

### Sprint 4 (Semana 4)
- [ ] Animações
- [ ] Responsividade
- [ ] SEO completo
- [ ] Performance optimization
- [ ] A11y audit
- [ ] Deploy

---

## 12. Checklist Pré-Launch

### Design
- [ ] Todas as seções implementadas
- [ ] Responsivo testado (mobile, tablet, desktop)
- [ ] Animações suaves
- [ ] Loading states
- [ ] Hover states em botões/links

### Conteúdo
- [ ] Copy revisado (sem typos)
- [ ] Imagens otimizadas (WebP)
- [ ] Vídeos comprimidos
- [ ] Alt texts em todas imagens

### SEO
- [ ] Meta tags completos
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] Structured data
- [ ] Open Graph tags

### Performance
- [ ] Lighthouse score >90
- [ ] Images lazy loaded
- [ ] CSS/JS minificados
- [ ] CDN configurado

### Analytics
- [ ] GA4 instalado
- [ ] Eventos configurados
- [ ] Conversões rastreadas

### Legal
- [ ] Cookie banner
- [ ] Links para Termos/Privacidade
- [ ] LGPD compliance

### Testing
- [ ] Cross-browser (Chrome, Safari, Firefox, Edge)
- [ ] Mobile real devices
- [ ] Screen readers
- [ ] Formulários funcionando

---

## 13. Variações para Testes Futuros

### Landing Page para Empresas (B2B)

**Headline:**
```
Encontre desenvolvedores com 
habilidades comprovadas
```

**Features diferentes:**
- Matching inteligente
- Filtros por skills
- Analytics de candidatos

### Landing Page para Bootcamps

**Headline:**
```
Plataforma de ensino prática 
para seus alunos
```

**Features:**
- Dashboard do instrutor
- Desafios customizados
- Progresso da turma

---

## Resumo Executivo

**Landing page Compila.dev** é projetada para:

✅ **Converter visitantes em usuários** (meta 10%)
✅ **Comunicar valor em 5 segundos**
✅ **Ranquear bem no Google** (SEO otimizado)
✅ **Funcionar perfeitamente em mobile** (50%+ tráfego)
✅ **Ser acessível** (WCAG AA)
✅ **Carregar rápido** (Lighthouse >90)

**Próximo passo:** Prototipar no Figma e validar com 10 usuários antes de desenvolver.
