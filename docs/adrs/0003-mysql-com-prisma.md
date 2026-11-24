# ADR-0003: MySQL com Prisma como persistencia principal

- Status: Aceita
- Data: 23/11/2026
- Decisores: equipe do Shape Up

## Contexto

O Shape Up possui dados relacionados de academias, usuarios, planos, alunos, treinos e anexos. A equipe precisa manter integridade entre esses registros, aplicar migrations versionadas e consultar dados administrativos com filtros e paginacao.

A base existente ja usa MySQL no Docker Compose e Prisma no backend. Alterar o banco durante o fechamento da rubrica criaria risco de migracao sem ganho funcional para a demonstracao.

## Decisao

Manter MySQL 8.4 como banco relacional principal e Prisma como ORM, camada de acesso e ferramenta de migrations.

## Justificativa

- O modelo possui relacionamentos e chaves estrangeiras que se beneficiam de integridade relacional.
- MySQL ja e o servico de persistencia do ambiente Docker Compose.
- Prisma mantem o schema, as migrations e o client em um fluxo versionado.
- A decisao preserva compatibilidade com os dados, services e repositorios existentes.
- Redis permanece como infraestrutura complementar para cache e eventos, nao como fonte de verdade.

## Alternativas consideradas

- PostgreSQL: atende ao modelo relacional, mas exigiria migracao de infraestrutura, schema, driver e validacao sem necessidade demonstrada pela rubrica atual.
- Banco documental: nao foi escolhido porque os fluxos atuais dependem de relacoes e consultas entre entidades.

## Consequencias

- Migrations devem continuar versionadas em backend/prisma/migrations.
- Mudancas de schema devem ser aplicadas com o fluxo Prisma documentado no README.
- Backups do volume MySQL sao importantes antes de alteracoes de schema ou restauracoes.
- A API deve continuar acessando persistencia por repositories e Prisma, preservando as camadas atuais.

## Evidencias no repositorio

- backend/prisma/schema.prisma
- backend/prisma/migrations/
- backend/src/lib/prisma.ts
- backend/src/repositories/prisma/
- docker-compose.yml
