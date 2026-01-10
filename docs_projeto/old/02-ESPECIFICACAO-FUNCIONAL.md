# CodeBR - Especificação Funcional

## 1. Módulo: Sistema de Desafios

### 1.1 Visão Geral
Núcleo da plataforma onde desenvolvedores praticam habilidades através de projetos design-to-code realistas.

### 1.2 Funcionalidades

#### 1.2.1 Catálogo de Desafios
**Como funciona:**
- Desenvolvedores navegam desafios filtrados por dificuldade, tecnologia, tema
- Cada desafio apresenta: preview visual, descrição, requisitos, nível, XP
- Sistema de tags permite busca refinada (responsive, animation, api-integration)

**Regras de negócio:**
- Desafios FREE: disponíveis com preview JPG/PNG
- Desafios PRO: incluem arquivos Figma editáveis
- Dificuldade calculada por: complexidade layout, interações JS, requisitos acessibilidade
- Novos desafios semanalmente (PRO tem acesso primeiro)

**Níveis de dificuldade:**
- **Newbie**: HTML/CSS básico, layout simples (~2h)
- **Junior**: Responsividade, Flexbox/Grid (~4h)
- **Intermediate**: JavaScript interativo, formulários, API (~8h)
- **Advanced**: Animações complexas, SPA com framework (~16h)
- **Expert**: Aplicações completas, performance, acessibilidade (~40h)

#### 1.2.2 Página do Desafio
**Conteúdo:**
- Design preview (desktop/tablet/mobile)
- Descrição e contexto (ex: "E-commerce de sneakers")
- Requisitos funcionais listados
- Critérios de aceitação
- Assets disponíveis (imagens, ícones, fontes)
- Starter files (HTML/CSS boilerplate)
- Guia de estilo (cores, tipografia, espaçamentos)

**Ações disponíveis:**
- Baixar starter files
- Abrir Figma (PRO)
- Começar desafio (cria submission draft)
- Ver soluções da comunidade (após submeter)

#### 1.2.3 Sistema de Submissions
**Fluxo:**
1. Usuário clica "Começar Desafio"
2. Sistema cria submission em draft
3. Usuário desenvolve localmente
4. Submit com: URL live + repo GitHub + screenshots
5. Sistema analisa automaticamente (IA)
6. Submission aparece no feed se aprovada

**Validações automáticas:**
- URL acessível e funcional
- HTML válido (W3C validator)
- Responsividade (teste em 3 breakpoints)
- Lighthouse score (performance, accessibility, SEO)

**Feedback IA:**
- Análise HTML semântico
- Boas práticas CSS
- Problemas de acessibilidade
- Sugestões de melhoria
- Score final 0-100

**Edição de submissions:**
- Usuário pode atualizar URL/repo a qualquer momento
- Re-análise automática
- Histórico de versões mantido

#### 1.2.4 Leaderboard
**Tipos:**
- Por desafio: top 20 melhores scores
- Global: usuários com mais XP
- Semanal/Mensal: resets periódicos
- Por estado: ranking regional

**Critérios de ranking:**
- Score IA (40%)
- Likes da comunidade (30%)
- Qualidade do código (20%)
- Tempo de conclusão (10%)

---

## 2. Módulo: Feed Social

### 2.1 Visão Geral
Timeline estilo Twitter/Instagram onde usuários veem submissions, conquistas e atividades da comunidade.

### 2.2 Funcionalidades

#### 2.2.1 Tipos de Conteúdo
**Submission Posts:**
- Preview da solução
- Informações do desafio
- Score recebido
- Tech stack usada
- Botões: Like, Comentar, Compartilhar

**Achievement Posts:**
- Badges conquistados
- Level ups
- Streak milestones

**Community Posts:**
- Discussões
- Perguntas/respostas
- Compartilhamento de recursos

#### 2.2.2 Algoritmo do Feed
**Para usuários autenticados:**
- 60% conteúdo de quem segue
- 20% trending (alto engagement)
- 15% recomendado (baseado em interesses)
- 5% sponsored/featured

**Fatores de ranking:**
- Recência (decay temporal)
- Engagement (likes + comentários)
- Qualidade (score do projeto)
- Afinidade com usuário

**Atualização:**
- Real-time para novos posts de seguidos
- Batch refresh a cada 5 min para trending

#### 2.2.3 Interações
**Like:**
- Toggle simples
- Autor ganha +5 XP por like
- Feed se atualiza para priorizar conteúdo similar

**Comentários:**
- Suporte a Markdown
- Code snippets com syntax highlight
- Notificação para autor
- Thread system (respostas aninhadas)

**Compartilhar:**
- Gera link com OG tags otimizadas
- Card preview bonito para LinkedIn/Twitter
- Tracking de origem

---

## 3. Módulo: Batalhas/Rinhas

### 3.1 Visão Geral
Competições ao vivo onde desenvolvedores resolvem mesmo desafio simultaneamente.

### 3.2 Tipos de Batalhas

#### 3.2.1 Duelo 1v1
- Dois participantes
- Desafio médio (4-6h) comprimido em 90min
- Primeiro a submeter com score >80 vence
- Prêmio: 200 XP + badge

#### 3.2.2 Squad Battle
- Times de 3-5 pessoas
- Desafio complexo dividido em módulos
- Colaboração via chat/vídeo integrado
- Votação da comunidade + score IA

#### 3.2.3 Tournament
- Eliminatória com 16-32 participantes
- Rodadas progressivas
- Transmissão ao vivo
- Grande prêmio: destaque no site + mentoria

### 3.3 Mecânicas

#### 3.3.1 Inscrição
- Janela de inscrição 24-48h antes
- Limite de participantes
- Confirmação 1h antes (senão perde vaga)

#### 3.3.2 Durante a Batalha
**Interface:**
- Timer countdown visível
- Chat ao vivo com participantes
- Leaderboard em tempo real
- Indicadores de progresso (quem já submeteu)

**WebSocket events:**
- Participante entrou/saiu
- Submission enviada
- Ranking atualizado
- Tempo restante

#### 3.3.3 Finalização
- Submissões travadas no fim do tempo
- Análise automática (2-5 min)
- Anúncio de vencedor
- Replay disponível

---

## 4. Módulo: Portfólio/Currículo

### 4.1 Visão Geral
Cada usuário tem URL pública (codebr.dev/@username) com portfólio profissional.

### 4.2 Seções

#### 4.2.1 Hero Section
- Nome, headline, localização
- Avatar, links sociais
- CTA "Entre em contato"
- Stats: XP, level, badges

#### 4.2.2 Sobre
- Bio escrita pelo usuário
- Skills destacadas (auto-extraídas de submissions)
- Interesses/especializações

#### 4.2.3 Featured Projects
- Até 6 submissions em destaque
- Grid ou carrossel
- Preview + link para live demo
- Tech stack badges

#### 4.2.4 Experiência Profissional
- Timeline de empregos
- Empresa, cargo, período
- Descrição e conquistas
- Tecnologias usadas

#### 4.2.5 Educação
- Formação acadêmica
- Bootcamps, cursos
- Certificações

#### 4.2.6 Achievements
- Grid de badges conquistados
- Tooltips com descrição

### 4.3 Personalização

#### 4.3.1 Temas Visuais
**Default**: Clean, minimalista, azul/branco
**Dark**: Background escuro, acentos neon
**Creative**: Gradientes, animações
**Minimal**: Tipografia forte, preto/branco

#### 4.3.2 Layouts
**Grid**: Cards 2 colunas
**List**: Timeline vertical
**Masonry**: Pinterest-style

#### 4.3.3 Custom Domain (PRO)
- Conectar domínio próprio
- SSL automático
- Redirecionamento

### 4.4 Geração de Currículo PDF

#### 4.4.1 Templates Disponíveis
**Modern**: 2 colunas, cores sutis
**Classic**: 1 coluna, formal
**Creative**: Assimétrico, ousado
**ATS-Friendly**: Sem gráficos, parser-safe

#### 4.4.2 Processo
1. Usuário seleciona template
2. Escolhe seções para incluir
3. Preview em tempo real
4. Download PDF ou DOCX

#### 4.4.3 IA Optimization (PRO)
- Reescreve bullets para passar em ATS
- Adiciona keywords baseado em job description
- Score de compatibilidade com vaga

---

## 5. Módulo: Vagas

### 5.1 Visão Geral
Marketplace conectando desenvolvedores e empresas com matching inteligente.

### 5.2 Para Desenvolvedores

#### 5.2.1 Busca de Vagas
**Filtros:**
- Tecnologias (React, Vue, Angular)
- Nível (Júnior, Pleno, Sênior)
- Tipo (CLT, PJ, Freela)
- Remoto/Híbrido/Presencial
- Faixa salarial
- Localização

**Ordenação:**
- Match score (default)
- Mais recentes
- Maior salário
- Mais aplicações (trending)

#### 5.2.2 Matching Automático
**Algoritmo considera:**
- Skills match (40 pontos)
  - Requisitos obrigatórios: peso 70%
  - Diferenciais: peso 30%
- Experiência (20 pontos)
  - Anos de experiência vs esperado
- XP na plataforma (15 pontos)
  - Usuários ativos e engajados
- Qualidade do portfólio (15 pontos)
  - Completude, projetos featured
- Localização (10 pontos)
  - Remote = sempre match
  - Presencial = mesmo estado

**Notificações:**
- Top 20 matches notificados via email/push
- Digest semanal com novas vagas

#### 5.2.3 Aplicação
**Processo:**
1. Clica "Candidatar-se"
2. Snapshot do portfolio atual
3. Carta de apresentação (opcional)
4. Envia

**Após aplicação:**
- Status tracking (Pendente → Análise → Entrevista → Finalizado)
- Notificações de mudança de status
- Feedback do recrutador (se fornecido)

### 5.3 Para Empresas

#### 5.3.1 Publicação de Vagas
**Informações obrigatórias:**
- Título, descrição
- Requisitos técnicos
- Nível, tipo de contratação
- Localização/remoto

**Informações opcionais:**
- Faixa salarial (incentivado)
- Benefícios
- Processo seletivo
- Cultura da empresa

**Moderação:**
- Review manual de primeira vaga
- Aprovação automática após empresa verificada

#### 5.3.2 Gestão de Candidatos
**Dashboard mostra:**
- Candidatos por status
- Match score de cada um
- Tempo médio de resposta

**Ações disponíveis:**
- Filtrar/ordenar candidatos
- Ver portfólio completo
- Mudar status
- Adicionar notas privadas
- Favoritar/rejeitar

**Matching inteligente:**
- Candidatos ordenados por score
- Destaque para "Perfect Match" (>85%)
- Filtros: apenas com experiência X, sabe tecnologia Y

#### 5.3.3 Analytics
- Views da vaga
- Taxa de aplicação
- Tempo médio para contratação
- Qualidade média dos candidatos

### 5.4 Monetização

**Para empresas:**
- 1 vaga ativa = 1 crédito
- Crédito válido por 60 dias
- Vagas inativas não consomem crédito
- Pacotes com desconto (10 vagas = +2 bônus)

**Planos recorrentes:**
- Básico (R$ 297/mês): 5 créditos/mês
- Premium (R$ 697/mês): 15 créditos/mês + features

---

## 6. Módulo: Comunidades

### 6.1 Visão Geral
Grupos de estudo e networking em torno de tópicos específicos.

### 6.2 Tipos de Comunidades

#### 6.2.1 Study Groups
- Focadas em aprendizado coletivo
- Desafios semanais em grupo
- Sessões de live coding

#### 6.2.2 Tech Stacks
- Ex: "React BR", "Vue.js Brasil"
- Discussões técnicas profundas
- Compartilhamento de recursos

#### 6.2.3 Location-Based
- "Devs São Paulo", "Tech Floripa"
- Eventos presenciais
- Networking local

#### 6.2.4 Career-Focused
- "Primeiro Emprego Dev"
- "Frontend Sênior"
- Mentoria e preparação

### 6.3 Funcionalidades

#### 6.3.1 Posts e Discussões
**Tipos de post:**
- Discussão aberta
- Pergunta (Q&A format)
- Recurso (link externo)
- Evento (sessão de estudo)

**Features:**
- Markdown com code blocks
- Upvotes (Reddit-style)
- Comentários aninhados
- Pin de posts importantes
- Lock de threads (moderadores)

#### 6.3.2 Eventos/Sessões
**Criação:**
- Título, descrição, data/hora
- Plataforma (Discord, Meet, Zoom)
- Limite de participantes
- Desafio associado (opcional)

**Gestão:**
- Participantes confirmados
- Lembretes automáticos
- Link de acesso 30min antes
- Gravação disponível depois (opcional)

#### 6.3.3 Recursos Compartilhados
**Biblioteca coletiva:**
- Artigos, vídeos, cursos
- Votação da comunidade
- Tags para organização
- Curadoria por moderadores

#### 6.3.4 Moderação
**Papéis:**
- Owner: criador, controle total
- Moderator: pin, lock, ban
- Member: posts, comments

**Ferramentas:**
- Report system
- Ban temporário/permanente
- Auto-moderação (spam detection)
- Logs de ações

### 6.4 Descoberta

**Comunidades sugeridas baseadas em:**
- Skills do usuário
- Desafios completados
- Localização
- Comunidades de pessoas que segue

---

## 7. Módulo: Ferramentas

### 7.1 Visão Geral
Utilitários online para agilizar desenvolvimento frontend.

### 7.2 Categorias

#### 7.2.1 Imagens
**Compressor:**
- Upload múltiplas imagens
- Ajuste de qualidade (slider)
- Preview lado-a-lado
- Download individual ou ZIP

**Resize:**
- Dimensões customizadas
- Aspect ratio locks
- Batch processing

**Converter:**
- PNG ↔ JPG ↔ WebP
- SVG optimizer

**Remove Background (PRO):**
- IA remove fundo
- Transparência PNG

#### 7.2.2 Formatters
**HTML/CSS/JS:**
- Prettier integration
- Configurações customizáveis
- Copia formatado

**JSON:**
- Beautify/minify
- Validação

#### 7.2.3 Geradores
**Gradient:**
- Color pickers duais
- Ângulo ajustável
- CSS copiável

**Box Shadow:**
- Sliders para X, Y, blur, spread
- Preview live
- Multiple shadows

**Color Palette:**
- Gera harmonias (complementar, análogo)
- Export em JSON/CSS

**Lorem Ipsum:**
- Parágrafos/palavras/bytes
- PT-BR ou EN

#### 7.2.4 Conversores
**RGB ↔ HEX:**
- Input em qualquer formato
- Output em todos

**Base64:**
- Encode/decode texto ou imagem

**Markdown → HTML:**
- Preview ao vivo
- Suporte GFM

#### 7.2.5 Validadores
**HTML:**
- W3C validator
- Erros destacados

**CSS:**
- Linting
- Browser compatibility

**JSON:**
- Parse errors
- Formatação

#### 7.2.6 Utilitários
**Diff Checker:**
- Compara código side-by-side
- Highlight de diferenças

**QR Generator:**
- URL para QR code
- Customização de cores

**Hash Generator:**
- MD5, SHA-1, SHA-256
- Uso: verificar integridade

### 7.3 UX das Ferramentas

**Layout padrão:**
1. Input (textarea, upload, sliders)
2. Preview/Output ao vivo
3. Botões: Copiar, Baixar, Limpar

**Features comuns:**
- Histórico (últimas 5 operações)
- Atalhos de teclado
- Responsivo

**Gamificação:**
- Badge "Toolbox Master" (usar 10 ferramentas diferentes)
- +10 XP primeira vez cada ferramenta

---

## 8. Módulo: Gamificação

### 8.1 Sistema de XP

#### 8.1.1 Fontes de XP
| Ação | XP | Frequência |
|------|-----|-----------|
| Completar desafio | 100-500 | Por desafio |
| Primeira submission | +50 | Bônus uma vez |
| Like recebido | 5 | Ilimitado |
| Code review dado | 20 | Por review |
| Streak diário | 10 | Por dia |
| Vencer batalha | 200 | Por vitória |
| Participar batalha | 50 | Por participação |

#### 8.1.2 Multiplicadores
**Streak:**
- 7+ dias: +20% XP
- 30+ dias: +50% XP
- 100+ dias: +100% XP

**PRO:**
- +15% XP em tudo

**Dificuldade do desafio:**
- Newbie: 1x
- Junior: 1.5x
- Intermediate: 2x
- Advanced: 3x
- Expert: 5x

#### 8.1.3 Níveis
Fórmula: `level = √(totalXP / 100)`

| Level | XP necessário | Título |
|-------|--------------|--------|
| 1 | 0 | Iniciante |
| 5 | 2.500 | Aspirante |
| 10 | 10.000 | Desenvolvedor |
| 20 | 40.000 | Sênior |
| 50 | 250.000 | Arquiteto |
| 100 | 1.000.000 | Lendário |

### 8.2 Sistema de Badges

#### 8.2.1 Categorias
**Progressão:**
- First Blood (primeira submission)
- Century (100 submissions)
- Perfectionist (score 100)

**Expertise:**
- React Master (20 desafios React)
- CSS Guru (15 desafios CSS complexos)
- A11y Champion (10 desafios score 100 acessibilidade)

**Social:**
- Social Butterfly (50 seguidores)
- Helpful (50 code reviews)
- Community Leader (criar comunidade com 100+ membros)

**Competição:**
- Battle Winner (vencer 1 batalha)
- Warrior (vencer 10 batalhas)
- Champion (vencer torneio)

**Streak:**
- Consistent (7 dias)
- Dedicated (30 dias)
- Unstoppable (100 dias)

#### 8.2.2 Raridade
- Common (bronze): maioria
- Rare (prata): ~20% dos usuários
- Epic (ouro): ~5%
- Legendary (diamante): <1%

### 8.3 Leaderboards

#### 8.3.1 Global
- Top 100 por XP total
- Atualização real-time (Redis)
- Histórico mensal

#### 8.3.2 Regional
- Por estado brasileiro
- Incentiva competição local

#### 8.3.3 Temporários
- Weekly: reset segunda
- Monthly: reset dia 1
- Prêmios para top 3

---

## 9. Integrações

### 9.1 GitHub
**Funcionalidades:**
- Login via OAuth
- Fetch repos para submission
- Validar README.md
- Stargazers como social proof

### 9.2 LinkedIn
**Funcionalidades:**
- Login via OAuth
- Import experiência profissional
- Share achievements automaticamente

### 9.3 Discord
**Funcionalidades:**
- Comunidade oficial integrada
- Notificações de batalhas
- Roles baseados em level

### 9.4 Figma (PRO)
**Funcionalidades:**
- Embed de designs
- Download de assets
- Inspect mode

### 9.5 Payment Gateways
**Stripe:**
- Assinaturas recorrentes
- Webhooks para gerenciar status

**Mercado Pago:**
- PIX, boleto
- Preferência brasileira

---

## 10. Notificações

### 10.1 Tipos

#### 10.1.1 Em Tempo Real (WebSocket)
- Novo like
- Novo comentário
- Batalha iniciando
- Level up
- Badge conquistado

#### 10.1.2 Email
- Digest semanal
- Novas vagas com alto match
- Lembretes de eventos
- Anúncios importantes

#### 10.1.3 Push (Mobile)
- Atividade em submission
- Batalha em 30 min
- Resposta em comentário

### 10.2 Preferências
Usuário controla:
- Quais tipos receber
- Frequência de digests
- Silenciar temporariamente

---

## Glossário

**Submission**: Solução de um desafio enviada por usuário
**Match Score**: % de compatibilidade entre usuário e vaga
**Streak**: Dias consecutivos com atividade
**XP**: Experience Points, pontos de experiência
**Badge**: Conquista desbloqueável
**Batalha**: Competição ao vivo
**Rinha**: Sinônimo brasileiro de batalha
**Feed**: Timeline de atividades
**Leaderboard**: Ranking de usuários
**Portfólio**: Página pública do desenvolvedor
