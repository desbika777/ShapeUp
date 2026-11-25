# Roteiro da Apresentacao Final - Shape Up

## Objetivo

Apresentar o produto que existe hoje e apontar uma evidencia verificavel para cada grupo da rubrica. Duracao sugerida: 10 a 11 minutos, incluindo uma demonstracao curta.

## Roteiro sugerido

| Parte | Tempo | O que mostrar e explicar | Evidencia |
| --- | ---: | --- | --- |
| 1. Produto e problema | 0:50 | O Shape Up centraliza a gestao administrativa de uma academia: planos, alunos, treinos e anexos. Delimitar o MVP que esta implementado. | README e telas reais |
| 2. Cynefin e abordagem | 0:50 | Classificacao principal como Complexo; adocao de ciclos curtos e abordagem agil com fluxo Kanban para acompanhar o trabalho. | `cynefin-abordagem-gestao.md` |
| 3. Jira | 1:00 | Abrir o mesmo espaco Shape Up; mostrar tipos Workstream, Task, Story e Bug, responsaveis, prioridades, criterios e status reais. | Quadro SU e SU-1 a SU-9 |
| 4. Arquitetura e DDD | 1:30 | Mostrar C4 de contexto/containers, monolito modular, Context Map, bounded contexts e entidades/objetos de valor/agregados. | `rubrica-nova-5-arquitetura-backend.md`, ADRs e diagramas |
| 5. API e dados | 0:45 | Abrir Swagger/OpenAPI, destacar endpoints e justificar MySQL/Prisma. | `/api/docs/`, `/api/openapi.json`, ADR-0003 |
| 6. Qualidade e resiliencia | 0:55 | Explicar metas SLO/SLI como metas ainda nao medidas, logs estruturados, retry/timeout/fallback e circuit breaker Redis. | Documento de arquitetura, codigo e testes |
| 7. Cache Redis e eventos | 1:15 | Mostrar miss, set com TTL, hit, invalidacao depois de update e evento publicado/consumido. | `evidencias-redis-2026-11-23.md` e logs |
| 8. Docker, Nginx, CI/CD e incidentes | 1:15 | Mostrar servicos Compose, Nginx como proxy, healthcheck e runbook. Abrir os workflows verdes da branch `feature/documentacao-rubrica`; explicar que o deploy remoto depende de secrets e servidor. | `docker-compose.yml`, workflow, [CI push](https://github.com/desbika777/ShapeUp/actions/runs/45470720553), [CI PR](https://github.com/desbika777/ShapeUp/actions/runs/45470736338) e runbook |
| 9. Ciclo de vida e versoes | 0:50 | Explicar backlog priorizado, user stories com criterios de aceite e entrega incremental. A versao Jira 1.0.1 existe, mas continua nao lancada. | Jira SU e `backlog-jira-inicial.md` |
| 10. Demonstracao e fechamento | 1:00 | Abrir o sistema em `http://localhost`, percorrer um fluxo curto e concluir retomando o valor do produto e os proximos passos. | Stack local atual |

## Correspondencia com os 12 criterios e 9,0 pontos

| Componente da rubrica | Pontos | Partes do roteiro |
| --- | ---: | --- |
| Arquitetura de Software | 3,0 | Partes 4, 5, 6 e 8 |
| Back-end Avancado | 3,0 | Partes 6, 7 e 8 |
| Tech Forge | 3,0 | Partes 2, 3 e 9 |

## O que aparece no site e o que mostrar como evidencia tecnica

| Evidencia | O professor ve no site? | O que demonstrar |
| --- | --- | --- |
| Gestao de planos, alunos, treinos e anexos | Sim | Entrar com conta de demonstracao e fazer um fluxo curto de consulta/edicao com dados descartaveis |
| Cache Redis, TTL e invalidacao | Nao diretamente | Atualizar um plano e mostrar os logs `cache_miss`, `cache_set`, `cache_hit` e `cache_invalidation` no terminal; a tela continua sendo a mesma |
| Redis Pub/Sub | Nao diretamente | Mostrar `evento_publicado` e `evento_consumido` para `plano.atualizado` nos logs registrados |
| API OpenAPI/Swagger | Em uma pagina tecnica do sistema | Abrir `/api/docs/` e `/api/openapi.json`; explicar que sao documentacao e contrato da API |
| Docker Compose, Nginx e healthcheck | Nao como funcionalidade administrativa | Mostrar `docker compose ps`, a configuracao do proxy e `/health` respondendo `ok` |
| CI/CD, testes e auditoria | Nao | Abrir as execucoes verdes do GitHub Actions; citar `npm audit` com zero vulnerabilidades |
| Arquitetura, DDD, ADRs, Cynefin e backlog | Nao | Apontar os diagramas/documentos e abrir o quadro Shape Up no Jira |

As mudancas de Redis, arquitetura, seguranca, testes e infraestrutura trabalham por tras do produto. Elas nao criam necessariamente novos botoes ou telas: a demonstracao combina o fluxo visivel do site com logs, Swagger, Jira, documentos e GitHub Actions.

### Evidencias a citar dentro dos grupos

- **Arquitetura (3,0):** C4, ADRs e Quality Scenarios (0,5); estilos e DDD (1,0); OpenAPI e decisao de banco (0,5); SLO/SLI, resiliencia e observabilidade (0,5); pipeline, estrategia e runbook (0,5).
- **Back-end Avancado (3,0):** cache-aside, TTL e invalidacao (1,0); Redis Pub/Sub (0,5); Compose e Nginx (1,0); organizacao, logs e erros (0,5).
- **Tech Forge (3,0):** Jira (1,0); Cynefin e abordagem (1,0); ciclo de vida agil, backlog priorizado, user stories, criterios e versoes (1,0).

## Preparacao da demonstracao

- Abrir antes da fala: sistema em `http://localhost`, Swagger em `http://localhost/api/docs/`, Jira e repositorio GitHub.
- No Jira, abrir o board Shape Up e um exemplo de Story, Task e Bug; explicar o fluxo atual de tres status: To Do, In Progress e Done.
- Na API, preferir conta e dados descartaveis de demonstracao. Editar um plano de teste e observar a invalidacao Redis nos logs.
- A suite E2E autenticada passou (6/6) em Compose isolado e comprovou CRUD e invalidacao Pub/Sub na edicao de plano. Para a fala, usar somente dados descartaveis e mostrar os logs ja registrados; nao apontar para dados de producao.
- Se nao houver tempo para alterar dados na hora, usar a evidencia isolada de Redis documentada e explicar que ela usa repositorio fake para nao gravar no banco.
- Nao apresentar SLOs como medidos ou tag como publicada. O workflow GitHub passou no commit `9923d6d`; auditoria de dependencias em `auditoria-dependencias.md`.
- Repositorio configurado no Git: `https://github.com/desbika777/ShapeUp.git`. O aluno informou que o professor ja viu o site em uma banca anterior; nao e necessario criar hospedagem nova para repetir a demonstracao. Recuperar a URL ja usada se a folha exigir um link literal. `localhost` continua sendo somente local.

## Checklist antes da banca

- [ ] Confirmar os links que a planilha da rubrica pede.
- [x] Branch `feature/documentacao-rubrica` publicada; guardar os workflows verdes de push e PR ligados acima.
- [ ] Preparar uma conta/dados descartaveis e validar o fluxo pela interface.
- [ ] Deixar Jira, sistema, Swagger e logs abertos nas abas certas.
- [ ] Ensaiar em ate 11 minutos e dividir falas entre os integrantes.
