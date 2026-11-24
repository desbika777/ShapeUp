# ADR 0001 - Manter Monolito Modular No Shape Up

## Status

Aceito.

## Contexto

O Shape Up possui frontend web, mobile Expo, API Express, pacote compartilhado,
MySQL, Nginx e Docker Compose. A aplicacao atende uma entrega academica com
fluxos reais de academia, mas ainda e operada por uma equipe pequena.

## Decisao

Manter o backend como monolito modular, separando responsabilidades por
controllers, services, repositories, middlewares e integracoes. Os modulos de
planos, alunos, treinos, imagens, autenticacao, usuarios e painel continuam no
mesmo deploy da API.

## Consequencias

- Menor complexidade operacional para demonstracao e manutencao.
- Transacoes e regras de negocio ficam simples de rastrear.
- Bounded contexts continuam documentados e isolados por modulo, preparando uma
  possivel separacao futura.
- Nao ha custo de rede entre servicos internos.
- Crescimento futuro pode extrair contextos como Pagamentos, Agenda ou
  Notificacoes se houver necessidade real.
