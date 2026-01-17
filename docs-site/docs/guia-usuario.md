---
title: Guia do usuario
---

# Guia do usuario

Este guia explica o fluxo principal para quem usa o compila.dev no dia a dia.

## Primeiros passos

- Crie sua conta e confirme o login.
- Ajuste seu perfil em `Meu Perfil` (bio, links, localizacao).
- Veja seu nivel e XP para acompanhar sua evolucao.

Veja mais em [Perfil](/perfil) para dicas de preenchimento e seguranca.

## Como resolver um desafio

1. Abra `Desafios de Codigo`.
2. Use filtros (stack e nivel) para encontrar algo adequado.
3. Abra o desafio e leia a descricao.
4. Edite o codigo no editor.
5. Envie a submissao e acompanhe o feedback.

Veja mais em [Desafios](/desafios) para dicas de estudo e progresso.

### Como interpretar o feedback

Depois da submissao, voce vera:

- **Status**: aprovado ou reprovado.
- **Score**: pontuacao do desafio.
- **XP**: experiencia recebida quando aprovado.
- **Resultados de teste**: quais casos passaram e falharam.

Se algum teste falhar, use o erro como pista:

- Revise o requisito associado ao teste.
- Garanta que sua funcao retorna o valor esperado.
- Verifique entradas limite (array vazio, nulo, string vazia).

### Exemplo: submissao aprovada

```
Status: aprovado
Score: 92
XP: +120
Testes: 5/5 passaram
```

**Leitura rapida:** voce passou em todos os testes, ganhou XP completo e pode avancar
para o proximo desafio.

### Exemplo: submissao reprovada

```
Status: reprovado
Score: 48
XP: +0
Testes: 3/5 passaram
Falha: Teste 4 - entrada vazia
```

**Como agir:** ajuste o codigo para tratar a entrada vazia e submeta novamente.
Se o erro persistir, releia os requisitos no enunciado.

### Erros comuns

- **Entrada vazia**: trate arrays/listas vazias e valores nulos.
- **Formato de saida**: confira espacos, quebras de linha e maiusculas.
- **Nome de funcao**: siga exatamente o nome pedido no enunciado.
- **Tipo de retorno**: nao imprima quando o desafio pede `return`.
- **Complexidade**: evite loops desnecessarios em entradas grandes.

## Portfolio publico

- Seu portfolio fica em `/app/portfolio/{username}`.
- Adicione projetos e mantenha as descricoes claras.
- Use links de demo e repositorio para validar seu trabalho.

Veja mais em [Portfolio](/portfolio) para estruturar seus projetos.

### Boas praticas para portfolio

- Inclua um resumo curto com objetivo e stack usada.
- Adicione links de demo e repositorio.
- Use imagens ou gifs para mostrar o resultado.
- Destaque o que voce aprendeu ou o problema que resolveu.

## Feed da comunidade

- Publique progresso, duvidas e conquistas.
- Use comentarios para discutir solucoes.
- Compartilhe posts com o botao "Compartilhar" (link ou share).

Veja mais em [Feed](/feed) para ideias de postagens e networking.

### Posts recomendados

- **Desafio concluido**: mostre o que aprendeu e o ganho de XP.
- **Duvida**: descreva o problema e adicione um snippet curto.
- **Projeto**: publique um resumo e links de demo/codigo.

### Networking no feed

- Responda duvidas de outros usuarios com exemplos simples.
- Peça feedback especifico (ex.: arquitetura, testes, UI).
- Acompanhe tags da sua stack e interaja com frequencia.

## Vagas

- Acesse `Marketplace de Vagas`.
- Filtre por nivel, tipo e remoto.
- Abra a vaga para ler detalhes e aplicar.

Veja mais em [Vagas](/vagas) para dicas de aplicacao e busca.

### Checklist antes de aplicar

- Leia requisitos e confirme se atende ao minimo.
- Ajuste o portfolio com projetos relacionados a vaga.
- Prepare um texto curto de apresentacao (3-5 linhas).
- Garanta que seus links (GitHub/LinkedIn) estao atualizados.

## Dicas rapidas

- Busque desafios que reforcem a stack que voce quer mostrar no portfolio.
- Atualize o perfil sempre que completar um projeto.
- Compartilhe conquistas no feed para ganhar visibilidade.

## Como escolher desafios para a carreira

- Defina sua stack alvo (ex.: frontend React, backend Java).
- Resolva desafios de nivel crescente na mesma stack.
- Misture desafios de logica com desafios de produto real.
- Priorize desafios que gerem algo demonstravel no portfolio.

## Checklist da primeira semana

1. Complete 3 desafios (1 facil, 1 medio, 1 desafiador).
2. Publique 1 post no feed com o que aprendeu.
3. Adicione 1 projeto ao portfolio com demo e repositorio.
4. Ajuste seu perfil (bio + links principais).
