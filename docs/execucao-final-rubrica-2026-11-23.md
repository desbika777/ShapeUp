# Execucao da Rubrica Atualizada - Shape Up

Periodo de fechamento: 23 a 25/11/2026.
Projeto oficial: ShapeUpNew, continuacao do repositorio existente.
Fonte avaliada: RubricaDeFatoAtt.pdf, recebida em 23/11/2026.

## Fases de trabalho

- [x] Fase 0 - Confirmar o projeto oficial, ler a rubrica inteira e preservar as alteracoes preexistentes no working tree.
- [x] Fase 1 - Converter os criterios em uma matriz de evidencia e identificar lacunas.
- [x] Fase 2 - Completar evidencias locais: Quality Scenarios, DDD, ADR de banco, resiliencia, workflow CI/CD e runbook.
- [x] Fase 3 - Executar lint, testes, build, validacao YAML/Compose, sintaxe do deploy e checagens HTTP/logs da stack ja ativa; registrar os resultados reais.
- [x] Fase 4 - Fechar evidencia externa e registrar a demonstracao local:
  - [x] Jira real com tipos Story/Task/Bug, responsaveis, criterios e transicoes.
- [x] Cache Redis, invalidacao em atualizacao de plano e Pub/Sub demonstrados em E2E numa stack separada; a prova adicional de servico fake nao gravou no MySQL.
  - [x] Stack Compose reconstruida do codigo/lockfile atual; health, Swagger e OpenAPI respondem 200.
  - [x] Validacoes locais de web/backend/mobile aprovadas.
  - [x] `npm run e2e` executa 6/6 em stack Compose isolada, com MySQL/Redis/volumes descartaveis e portas aleatorias; recursos removidos ao final. A limpeza de E2E recusa bancos que nao sejam de teste.
  - [x] GitHub Actions passou no commit funcional `0ea4002` e novamente no pacote final em `9923d6d`; lint, 28 testes, E2E 6/6, mobile, build e Compose passaram. [CI push](https://github.com/desbika777/ShapeUp/actions/runs/45470720553) · [CI PR](https://github.com/desbika777/ShapeUp/actions/runs/45470736338).
  - [x] Demo local registrada em `http://127.0.0.1`; pagina inicial e `/health` responderam 200 em 24/11. O aluno informou que o professor ja viu o site em uma banca anterior; nao e necessario criar hospedagem nova para repetir a demonstracao. A URL literal anterior nao consta nesta copia do repositorio.
- [x] Fase 5 - Mapear os 12 criterios pontuados (9,0 pontos em tres componentes), separar as tres linhas NSA sem descricao e preparar o roteiro em `roteiro-apresentacao-final.md` e `checklist-rubrica-atualizada.md`.

Cada fase so deve ser marcada como concluida depois de sua evidencia estar registrada abaixo ou em arquivo apontado.

## Matriz de criterios

| Area | Criterio da rubrica | Status | Evidencia atual / proximo passo |
| --- | --- | --- | --- |
| Arquitetura | C4, ADRs e Quality Scenarios | Concluido em documentacao | C4 em rubrica-nova-5-arquitetura-backend.md; ADRs em adrs/; cenarios e metas atualizados no mesmo documento |
| Arquitetura | Estilos e DDD | Concluido em documentacao | Context Map e lista de Entity, Value Objects e Aggregate em rubrica-nova-5-arquitetura-backend.md |
| Arquitetura | OpenAPI e justificativa do banco | Concluido em documentacao | OpenAPI em backend/src/docs/openapi.ts; ADR-0003 justifica MySQL e Prisma |
| Arquitetura | SLOs/SLIs, resiliencia e observabilidade | Implementado e documentado; metricas ainda nao medidas | Retry, timeout, circuit breaker Redis, fallback e logs no documento arquitetural |
| Arquitetura | Pipeline CI/CD, deploy e runbook | CI remoto validado; deploy remoto condicional | GitHub Actions passou no push e PR do pacote final `9923d6d`, incluindo lint, 28 testes, E2E 6/6, mobile, build e Compose. Estrategia e runbook existem; deploy remoto exige secrets e servidor |
| Back-end Avancado | Cache-aside, TTL e invalidacao Redis | Demonstrado em stack E2E isolada | Edicao real de plano pela interface/API invalidou cache; consulta seguinte fez miss e set com TTL de 60 s. Ver `evidencias-redis-2026-11-23.md` |
| Back-end Avancado | Redis Pub/Sub e logs de eventos | Demonstrado em stack E2E isolada | `plano.atualizado` foi publicado e consumido em `shapeup:eventos` durante o E2E, junto aos logs estruturados |
| Back-end Avancado | Docker Compose e Nginx reverso | Revalidado na imagem atual em 23/11/2026 | Backend/frontend reconstruidos; MySQL e Redis saudaveis; `/`, `/health`, `/api/docs/` e `/api/openapi.json` responderam 200 via Nginx |
| Back-end Avancado | Organizacao, logs e tratamento de erros | Revalidado por lint, testes e build em 23/11/2026 | Controllers, services, repositories, schemas, logger e middleware; 28 testes aprovados |
| Tech Forge | Uso real do Jira para issues e fluxo | Concluido para demonstracao do backlog e do fluxo real | Site conectado; projeto SU no espaco Shape Up. O projeto tem Workstream, Task, Sub-task, Story e Bug. SU-1 a SU-9 demonstram tipos, prioridades, responsaveis, criterios de aceite e transicoes reais; estado conferido em 23/11: 4 Done e 5 In Progress. O board usa tres estados: To Do, In Progress e Done. |
| Tech Forge | Cynefin e escolha da abordagem | Concluido em documentacao | docs/cynefin-abordagem-gestao.md classifica o projeto como Complexo e escolhe abordagem agil |
| Tech Forge | Ciclo de vida, backlog, criterios de aceite e versoes | Parcial em fechamento | Backlog priorizado e criterios estao em SU-1 a SU-9; manifests raiz/workspaces/Expo e candidata Jira estao em 1.0.1, com escopo em `CHANGELOG.md`. O projeto nao expoe `fixVersions`, entao os itens usam label `release-1-0-1`; tag/publicacao ainda pendem da revisao final |

## Evidencias externas a coletar

- Estado da integracao Jira em 23/11/2026: conectada ao site `https://enzogamenezes.atlassian.net`.
- Projeto Jira real: Shape Up, chave `SU`; Workstream `SU-1` e itens de fechamento `SU-2` a `SU-9`, todos atribuidos ao responsavel disponivel, com prioridades e criterios de aceite. Link: `https://enzogamenezes.atlassian.net/browse/SU-1`.
- Tipos disponiveis confirmados no mesmo espaco: Workstream, Task, Sub-task, Story e Bug. `SU-7` e uma Story; `SU-8` e um Bug.
- Historico real de transicao, conferido em 23/11/2026: `SU-2`, `SU-4`, `SU-5` e `SU-8` estao Done; `SU-1`, `SU-3`, `SU-6`, `SU-7` e `SU-9` estao In Progress. O quadro exibe os tres estados To Do, In Progress e Done.
- Versao Jira `1.0.1` existe como nao lancada. O projeto business nao expoe o campo `fixVersions` nas issues; as issues foram marcadas com o label `release-1-0-1` e nenhuma release/tag foi declarada como publicada.
- Evidencia Redis atual: `docs/evidencias-redis-2026-11-23.md`; demonstracao via `ServicoPlano.update`, Redis real, repository fake e sem gravacao no MySQL.
- Workflow GitHub Actions aprovado em 24/11/2026 para o pacote final `9923d6d`: [push](https://github.com/desbika777/ShapeUp/actions/runs/45470720553) e [PR](https://github.com/desbika777/ShapeUp/actions/runs/45470736338). Deploy publico continua condicionado a servidor e secrets.
- Evidencia de deploy ou, se nao houver servidor configurado, registro claro da limitacao e demonstracao da estrategia de rollback.
- Demonstracao via Nginx dos fluxos de cache, eventos e OpenAPI; a verificacao atual de `/`, `/health`, Swagger e OpenAPI passou.
- Repositorio remoto configurado: `https://github.com/desbika777/ShapeUp.git`. Site validado nesta maquina em `http://localhost`; o professor ja viu o produto em banca anterior. Recuperar a URL apresentada antes apenas se a folha exigir o link literal.

## Atualizacao da fase 3

| Validacao | Resultado | Data | Evidencia |
| --- | --- | --- | --- |
| npm run lint | Passou | 23/11/2026 | Shared, backend e frontend apos as atualizacoes nao-major |
| npm run test | Passou: 28 testes | 23/11/2026 | Backend: 21; frontend: 7; inclui 3 testes do circuit breaker |
| npm run build | Passou | 23/11/2026 | Shared, backend e frontend; Vite produziu bundle; avisos nao fatais do Rollup sobre comentarios do Zod |
| npm run lint:mobile | Passou | 23/11/2026 | TypeScript do workspace mobile |
| expo install --check | Passou | 23/11/2026 | Expo SDK 57.0.34 alinhado |
| docker compose config --quiet | Passou | 23/11/2026 | Configuracao Compose resolvida |
| Parse do workflow YAML | Passou | 23/11/2026 | Parser js-yaml reconheceu jobs validate e deploy |
| Sintaxe do script de deploy | Passou | 23/11/2026 | bash -n no script extraido do workflow |
| git diff --check | Passou; avisos CRLF do Git | 23/11/2026 | Sem erros de whitespace |
| Workflow GitHub Actions | Passou | 24/11/2026 | Commit `9923d6d`; push e PR passaram lint, 28 testes, Chromium/E2E isolado (6/6), mobile, build e Compose. [Push](https://github.com/desbika777/ShapeUp/actions/runs/45470720553) · [PR](https://github.com/desbika777/ShapeUp/actions/runs/45470736338) |
| Stack atual, `/`, `/health`, Swagger e OpenAPI via Nginx | Passou: 200; Redis e MySQL saudaveis | 23/11/2026 | Imagens backend/frontend reconstruidas do repositorio |
| `npm run e2e` / runner do `pre-push` | Passou: 6/6 testes | 23/11/2026 | Compose isolado, banco/Redis/volumes descartaveis, portas aleatorias; limpeza concluida sem afetar a stack principal |
| Trava de limpeza E2E | Passou | 23/11/2026 | `backend/prisma/cleanup-e2e.ts` rejeitou explicitamente um `DATABASE_URL` apontando para `shapeup` antes de conectar ou apagar dados |
| Redis durante edicao de plano pela interface | Passou | 23/11/2026 | `plano.atualizado` publicado/consumido; invalidação seguida de miss/set TTL 60 s; ver evidencia Redis |
| Cache-aside e invalidacao no update | Passou em demonstracao isolada | 23/11/2026 | `ServicoPlano.update`, Redis real, repository fake; TTL 60 s; `cache_miss`, `cache_set`, `cache_hit`, `cache_invalidation` e novo miss |
| Redis Pub/Sub | Passou em demonstracao isolada | 23/11/2026 | `plano.atualizado` publicado e consumido pelo assinante da API |
| Stack principal para ensaio local | Disponivel | 23/11/2026 | Stack principal permanece ativa; a stack descartavel E2E foi removida sem apagar seus dados |
| Auditoria de dependencias | Passou: 0 vulnerabilidades | 24/11/2026 | `npm audit` repetido na branch final; Prisma 7.10.1 + adapter MariaDB; Expo SDK 57 alinhado; detalhes em `auditoria-dependencias.md` |

## Condicao para encerramento

A fase final so fica concluida quando os criterios da rubrica estiverem apoiados por evidencias verificaveis. Evidencia externa que dependa de acesso da equipe nao deve ser marcada como feita com base apenas neste repositorio.
