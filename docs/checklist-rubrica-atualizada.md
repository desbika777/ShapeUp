# Checklist da Rubrica Atualizada - Shape Up

## Escopo da folha recebida

Fonte: `RubricaDeFatoAtt.pdf`, revisada em 24/11/2026.

A folha avalia tres componentes de 3,0 pontos cada. Sao 12 criterios pontuados, que somam 9,0 pontos, mais tres linhas NSA sem descricao. As marcacoes de 100% e as notas maximas impressas no PDF sao apenas exemplos da rubrica, conforme confirmado pelo aluno; nao representam a avaliacao do Shape Up.

Onze dos doze criterios estao integralmente apoiados por evidencia verificavel: 8,0 de 9,0 pontos (89% do peso total quando contamos apenas criterios integralmente fechados). O criterio de ciclo de vida/versionamento tem a candidata `1.0.1` padronizada nos manifests, Jira e changelog, mas permanece parcial/pendente de publicacao formal: nao ha tag nem release GitHub. Se a banca considerar suficiente a preparacao da versao parcial, a avaliacao desse criterio pode ser diferente; nao e possivel prometer nota. O professor ja viu o site em banca anterior, conforme informado pela equipe; hospedagem nova nao e necessaria.

## Criterios pontuados e evidencias

| ID | Componente | Peso | Evidencia verificavel | Estado de fechamento |
| --- | --- | ---: | --- | --- |
| ARQ-1 | Arquitetura de Software | 0,5 | C4 de contexto/containers, ADRs e Quality Scenarios em `docs/rubrica-nova-5-arquitetura-backend.md` e `docs/adrs/` | Concluido; metas estao documentadas como metas, sem alegar medicao |
| ARQ-2 | Arquitetura de Software | 1,0 | Context Map, Bounded Contexts, Entity, Value Objects e Aggregate no documento arquitetural | Concluido |
| ARQ-3 | Arquitetura de Software | 0,5 | OpenAPI/Swagger em `backend/src/docs/openapi.ts`; decisao de MySQL em `docs/adrs/0003-mysql-com-prisma.md` | Concluido |
| ARQ-4 | Arquitetura de Software | 0,5 | SLOs/SLIs, retry, timeout, circuit breaker, fallback e plano de logs/metricas no documento arquitetural | Concluido como documentacao e implementacao; metas ainda nao foram medidas |
| ARQ-5 | Arquitetura de Software | 0,5 | `.github/workflows/ci-cd.yml`, `docs/runbook-incidentes.md` e estrategia de deploy/rollback | CI passou em push e PR; deploy de producao depende de servidor/secrets |
| BE-1 | Back-end Avancado | 1,0 | Cache-aside, TTL, invalidacao em update e logs reais em `docs/evidencias-redis-2026-11-23.md` | Demonstrado em stack E2E isolada |
| BE-2 | Back-end Avancado | 0,5 | Redis Pub/Sub com publicacao, consumo e logs do evento `plano.atualizado` | Demonstrado em stack E2E isolada |
| BE-3 | Back-end Avancado | 1,0 | Docker Compose e Nginx reverse proxy; `/`, `/health`, Swagger e OpenAPI responderam 200 localmente | Concluido e revalidado |
| BE-4 | Back-end Avancado | 0,5 | Modulos, DTOs, services, controllers, logs e tratamento de erros; 28 testes unitarios | Concluido; lint, testes e build passaram no CI remoto |
| TF-1 | Tech Forge | 1,0 | Projeto Jira SU com Workstream, Task, Story e Bug; responsaveis, criterios e status reais; issues `SU-1` a `SU-9` | Concluido para demonstracao; `SU-6` registra o CI atual e continua In Progress ate revisao/tag |
| TF-2 | Tech Forge | 1,0 | `docs/cynefin-abordagem-gestao.md`: classificacao Complexa e escolha agil com Scrum adaptado/Kanban | Concluido em documentacao |
| TF-3 | Tech Forge | 1,0 | Backlog Jira priorizado, Stories com criterios de aceite; versao Jira `1.0.1`, manifests raiz/workspaces/Expo e `CHANGELOG.md` | Parcial/risco de interpretacao: a candidata esta padronizada e validada no CI; a rubrica fala em versoes para lancamentos parciais. Como ainda nao ha tag/release, nao apresentar como lancamento concluido |

## Campos de identificacao da folha

| Campo | Valor ou pendencia |
| --- | --- |
| Nome completo | Preencher na copia entregue: Enzo Gabriel Menezes e Pedro Henrique Rodrigues da Costa. Os nomes nao sao publicados neste repositorio |
| Link do GitHub | `https://github.com/desbika777/ShapeUp/tree/feature/documentacao-rubrica` |
| Link do site | Campo ainda sem URL confirmada. O professor ja viu o site em banca anterior, mas, se a folha exigir um endereco literal, recuperar o mesmo link usado naquela apresentacao. `http://127.0.0.1` e local e nao substitui um link publico |

## Verificacao remota atual

- Commit funcional `0ea4002` e revisoes documentais intermediarias foram validados em execucoes anteriores.
- CI de push e PR passou no commit candidato `d5501c0`: [push](https://github.com/desbika777/ShapeUp/actions/runs/45520211716) e [PR](https://github.com/desbika777/ShapeUp/actions/runs/45520220583). Ambos executaram lint, 28 testes, E2E Playwright 6/6, verificacao mobile, build e Docker Compose.
- O workflow validou lint, 28 testes, E2E Playwright 6/6, verificacao mobile, build e Docker Compose. O deploy foi ignorado porque ocorre apenas em `main` e depende de secrets/servidor.
- No pre-push local de 23/11, o E2E repetiu os 6 testes e removeu apenas a stack descartavel; em 24/11, a nova tentativa foi interrompida antes do E2E por `ECONNRESET` durante `npm ci`.
- `npm audit` foi executado novamente em 24/11/2026 e reportou zero vulnerabilidades; isso nao foi executado pelo workflow remoto.
- O PR #1 esta aberto e ainda sem revisoes. A candidata `1.0.1` passou no CI, mas ainda nao tem tag nem release GitHub; apresentar como versao preparada/candidata.
- A issue Jira `SU-6` continua `In Progress`; o projeto Jira tem a versao `1.0.1` cadastrada com `released=false`. As issues usam o label `release-1-0-1` porque o campo `fixVersions` nao esta exposto para este projeto.
- A tentativa local do pre-push em 24/11 foi interrompida por `ECONNRESET` durante `npm ci`, antes da fase E2E. O CI remoto do commit `d5501c0` executou e aprovou o E2E (6/6), alem das outras etapas; nao confundir a falha local de rede com falha de codigo.

## Linhas NSA

A rubrica tem tres linhas identificadas somente como NSA, sem descricao, peso ou entrega associada. Nao inventar criterios para essas linhas. Confirmar com o professor se sao nao aplicaveis ou se ha uma versao detalhada da planilha.

## Pendencias para fechamento completo

1. Inserir os nomes confirmados na copia da folha. Como o professor ja viu o site na banca anterior, usar a mesma URL previamente apresentada caso o campo exija um endereco literal; nao e necessario contratar hospedagem nova para repetir a demonstracao.
2. Revisar o PR #1 com a equipe. Depois da aprovacao, criar a tag Git e publicar a release parcial `1.0.1` se esse for o entendimento da rubrica. O fluxo continua pendente e nenhum lancamento foi feito.
3. Confirmar com o professor se as tres linhas NSA sao nao aplicaveis ou se existe uma versao detalhada da planilha.

Este checklist rastreia evidencias e pendencias; nao garante nota e nao substitui a avaliacao do professor.
