# Mapa da Rubrica - Shape

## Objetivo

Este documento traduz a rubrica do 4o periodo em evidencias concretas do projeto Shape. A ideia e facilitar a apresentacao do projeto, mostrando onde cada criterio foi atendido no repositorio, no codigo e na documentacao.

## Conclusao Executiva

O Shape ja possui uma base forte para atender a rubrica: problema contextualizado, requisitos, regras de negocio, DER com 27 tabelas, banco em PT-BR, CRUDs integrados, testes automatizados, seed completo, Cynefin, backlog inicial e fluxo Git/GitHub.

Na validacao de 05/08/2026 passaram `git diff --check`, `npm run lint`, `npm run test`, `npm run build` e `npm run e2e`. Isso confirma a integracao entre frontend, API e banco para os fluxos principais.

Os pontos que mais precisavam de reforco para apresentacao eram:

- diagramas UML formais, agora centralizados em `docs/diagramas-uml.md`;
- evidencias de arquitetura e padronizacao, agora registradas em `docs/arquitetura-evidencias.md`;
- validacao de usabilidade, funcionalidade, compatibilidade e seguranca, agora registrada em `docs/validacao-usabilidade-seguranca.md`;
- padrao de nomenclatura em PT-BR para reduzir duvida visual no VS Code, agora registrado em `docs/nomenclatura-ptbr.md`;
- rotas do frontend e endpoints da API traduzidos para portugues.

## Engenharia e Analise de Projetos de Software

| Criterio da rubrica | Evidencia no projeto | Status |
| --- | --- | --- |
| Contextualizacao do problema e evolucao do produto | `docs/contextualizacao-problema.md`, `docs/objetivos-escopo.md`, `docs/roteiro-progresso-4-periodo.md` | Atendido |
| DER com minimo de 20 tabelas | `docs/modelagem-der.md` e `backend/prisma/schema.prisma` com 27 tabelas de aplicacao | Atendido |
| Requisitos funcionais e nao funcionais | `docs/requisitos.md` | Atendido |
| 2 diagramas de casos de uso | `docs/diagramas-uml.md` | Atendido |
| 2 diagramas de atividades | `docs/diagramas-uml.md` | Atendido |
| 2 diagramas de sequencia | `docs/diagramas-uml.md` | Atendido |

## Arquitetura de Software

| Criterio da rubrica | Evidencia no projeto | Status |
| --- | --- | --- |
| Arquitetura e padronizacao | `docs/arquitetura-evidencias.md`, `backend/src`, `frontend/src`, `shared/src` | Atendido |
| Componentizacao e clean code | Componentes em `frontend/src/components`, services/controllers/repositories em `backend/src` | Atendido |
| CRUD completo com app x API x banco | Planos, alunos e treinos com frontend, API Express e Prisma/MySQL | Atendido |
| Regra de negocio respeitada | `docs/regras-negocio.md` e services do backend | Atendido |
| Validacao de usabilidade, funcionalidade, compatibilidade e seguranca | `docs/validacao-usabilidade-seguranca.md`, Vitest, Supertest, Playwright | Atendido em base tecnica |

## Tech Forge

| Criterio da rubrica | Evidencia no projeto | Status |
| --- | --- | --- |
| Gestao do trabalho via Jira | `docs/backlog-jira-inicial.md` e quadro Jira da dupla | Precisa anexar prints do Jira real |
| Cynefin e abordagem de gestao | `docs/cynefin-abordagem-gestao.md` | Atendido |
| Backlog priorizado e user stories com aceite | `docs/backlog-jira-inicial.md` | Atendido como planejamento |
| Versoes parciais do software | Commits GitHub, branches e futuras tags/releases | Em andamento |

## Pendencias Reais Para Nota Maxima

1. Anexar ou mostrar prints do Jira real com epicos, user stories, tasks, responsaveis e status.
2. Manter commits frequentes no GitHub, com mensagens claras e branch organizada.
3. Preparar link do site ou demonstracao local estavel para preencher o campo "LINK DO SITE".
4. Separar evidencias finais: prints do DER, testes passando, tela do sistema, GitHub e Jira.
5. Revisar se a entrega exige PDF ou apenas repositorio/links.

## Roteiro Curto de Defesa

1. Apresentar o problema de gestao de academias e a evolucao do antigo SHAPEUP para Shape.
2. Mostrar a documentacao de requisitos, regras de negocio e escopo.
3. Mostrar o DER com 27 tabelas e explicar por que o banco esta em PT-BR.
4. Mostrar diagramas UML: casos de uso, atividades e sequencia.
5. Abrir o sistema e demonstrar login, dashboard, CRUD de planos, alunos e treinos.
6. Abrir rapidamente a arquitetura: frontend, API, services, repositories, Prisma e MySQL.
7. Mostrar testes e E2E passando.
8. Mostrar Jira, backlog e fluxo de commits no GitHub.
