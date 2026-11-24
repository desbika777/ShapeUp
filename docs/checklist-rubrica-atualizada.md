# Checklist da Rubrica Atualizada - Shape Up

## Escopo da folha recebida

Fonte: `RubricaDeFatoAtt.pdf`, revisada em 24/11/2026.

A folha avalia tres componentes de 3,0 pontos cada. Sao 12 criterios pontuados, que somam 9,0 pontos, mais tres linhas NSA sem descricao. As marcacoes de 100% e as notas maximas impressas no PDF sao apenas exemplos da rubrica, conforme confirmado pelo aluno; nao representam a avaliacao do Shape Up.

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
| TF-3 | Tech Forge | 1,0 | Backlog Jira priorizado, Stories e criterios de aceite; candidata Jira `1.0.1` e `CHANGELOG.md` | Parcial: versionamento candidato esta preparado; tag/release e revisao da equipe ainda nao ocorreram |

## Campos de identificacao da folha

| Campo | Valor ou pendencia |
| --- | --- |
| Nome completo | Nomes confirmados em conversa; inserir apenas na cópia da folha que será entregue. Os nomes não são publicados neste repositório |
| Link do GitHub | `https://github.com/desbika777/ShapeUp/tree/feature/documentacao-rubrica` |
| Link do site | A equipe informou que não tem hospedagem. `http://127.0.0.1` é apenas local e não serve como link externo para a banca |

## Verificacao remota atual

- Commit funcional `0ea4002` e revisoes documentais intermediarias foram validados em execucoes anteriores.
- CI mais recente da branch passou no commit `3d91bc5`: [push](https://github.com/desbika777/ShapeUp/actions/runs/45468843707) e [PR](https://github.com/desbika777/ShapeUp/actions/runs/45468859357). Ambos executaram lint, 28 testes, E2E Playwright 6/6, verificacao mobile, build e Docker Compose.
- O workflow validou lint, 28 testes, E2E Playwright 6/6, verificacao mobile, build e Docker Compose. O deploy foi ignorado porque ocorre apenas em `main` e depende de secrets/servidor.
- O pre-push local repetiu os 6 E2E e removeu apenas a stack descartavel.
- `npm audit` foi executado novamente em 24/11/2026 e reportou zero vulnerabilidades; isso nao foi executado pelo workflow remoto.
- O PR #1 esta aberto e ainda sem revisoes. Nao ha tag nem release GitHub para `1.0.1`.

## Linhas NSA

A rubrica tem tres linhas identificadas somente como NSA, sem descricao, peso ou entrega associada. Nao inventar criterios para essas linhas. Confirmar com o professor se sao nao aplicaveis ou se ha uma versao detalhada da planilha.

## Condicoes restantes para fechar 100%

1. Inserir os nomes confirmados na cópia da folha e confirmar se a banca aceita demonstração local ou exige URL pública. Se exigir URL pública, a equipe precisa escolher/autorizar um provedor e disponibilizar acesso de implantação.
2. Revisar o PR #1 em equipe e decidir se a versao candidata `1.0.1` deve receber tag e release.
3. Confirmar com o professor o significado das tres linhas NSA.

Este checklist rastreia evidencias e pendencias; nao garante nota e nao substitui a avaliacao do professor.
