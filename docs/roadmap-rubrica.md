# Roadmap Oficial da Rubrica - Shape Up

## Objetivo

Este documento e o Artefato de Acompanhamento Oficial do projeto Shape Up. A partir desta etapa, ele deve ser tratado como a fonte da verdade para acompanhar aderencia a rubrica, evidencias ja existentes, lacunas pendentes e proximas entregas.

## Regras de Uso

- Atualizar este arquivo a cada entrega relevante.
- Registrar evidencias reais, como arquivos, rotas, testes, logs estruturados, commits ou itens do Jira.
- Nao marcar um criterio como concluido apenas porque esta documentado; ele precisa ter evidencia verificavel.
- Manter os status em quatro niveis: Concluido, Parcial, Pendente ou Nao verificavel.
- Antes da entrega final, todos os criterios com nota devem estar Concluido ou justificados.

## Rubrica Atualizada Recebida em 23/11/2026

A folha `RubricaDeFatoAtt.pdf` avalia 12 criterios pontuados em tres componentes (3,0 pontos cada; 9,0 no total) e mostra ainda tres linhas NSA sem descricao. As marcas de 100% impressas sao exemplos, nao a avaliacao do Shape Up, conforme confirmado pelo aluno. A matriz especifica da folha atual esta em `docs/checklist-rubrica-atualizada.md`. A matriz R-01 a R-18 abaixo preserva criterios de uma rubrica anterior e nao deve ser usada como contagem da folha atual.

## Ultima Revisao

Data: 24/11/2026.

Validacoes recentes:

- Revisao da rubrica atualizada em 23/11/2026; arquivo de acompanhamento criado em `docs/execucao-final-rubrica-2026-11-23.md`.
- Em 23/11/2026, `npm run lint`, `npm run test` (28 testes: 21 backend e 7 frontend), `npm run build`, `docker compose config --quiet`, parse do workflow YAML e `git diff --check` passaram; o diff exibiu apenas avisos de conversao LF/CRLF do Windows.
- Workflow CI/CD criado em `.github/workflows/ci-cd.yml`; a validacao roda em pushes e pull requests e inclui Chromium + E2E no Compose isolado. O deploy em `main` depende de secrets e servidor remoto.
- Em 23/11/2026, a suite Playwright E2E passou 6/6 em Compose descartavel e isolado. A edicao de plano pela interface/API registrou miss/set TTL 60 s, invalidacao e `plano.atualizado` publicado/consumido; ver `docs/evidencias-redis-2026-11-23.md`.
- Reauditoria de dependencias em 23/11/2026: `npm audit` reportou zero vulnerabilidades apos Prisma 7.10.1 + adapter MariaDB e override restrito de `minimatch`; lint, 28 testes, build, lint mobile, Expo SDK check e E2E 6/6 passaram.
- O comando `npm run e2e` agora usa banco, Redis, rede e volumes proprios, portas aleatorias e remocao delimitada ao projeto temporario. A trava de limpeza rejeitou um `DATABASE_URL` apontando para `shapeup` antes de conectar; a stack principal continuou ativa.
- A stack principal continuou intacta e respondeu `200` em `/`, `/health`, `/api/docs/` e `/api/openapi.json`; MySQL e Redis saudaveis depois da remocao dos volumes E2E.
- Em 24/11/2026, GitHub Actions passou no push e no PR para o pacote final `9923d6d`: lint, 28 testes, Chromium/E2E isolado (6/6), mobile, build e Compose; links em `docs/checklist-rubrica-atualizada.md`.
- `npm audit` foi repetido em 24/11/2026 na branch final e continuou em 0 vulnerabilidades.

- Rubrica Nova 5 integrada em 08/10/2026 com foco em arquitetura, Redis, eventos, Docker/Nginx e observabilidade.
- Redis cache-aside validado via Nginx: login seed, duas chamadas em `GET /api/painel/indicadores` e logs `cache_miss`, `cache_set` e `cache_hit` com TTL de 60 segundos.
- Redis Pub/Sub validado via API: `POST /api/planos` retornou `201`, `DELETE /api/planos/{id}` retornou `204`, e os logs registraram `evento_publicado`, `evento_consumido` e `cache_invalidation`.
- Docker Compose validado com MySQL, Redis, backend, frontend e Nginx ativos; `shapeup-redis` ficou `healthy` e `/health` retornou `{"status":"ok"}` via Nginx.
- `npm run lint --workspace backend`, `npm run build --workspace backend`, `npm run test --workspace backend`, `npm run build` e `docker compose config`: passaram em 08/10/2026.
- OpenAPI/Swagger integrado em 29/09/2026: `/api/docs` retornou `200`, `/api/openapi.json` retornou o contrato `Shape Up API 1.1.0`, e os assets `swagger-ui.css`, `swagger-ui-bundle.js` e `swagger-ui-init.js` retornaram `200` via Nginx.
- `npm run lint --workspace backend`: passou em 29/09/2026 apos integracao do Swagger.
- `npm run build --workspace backend`: passou em 29/09/2026 apos integracao do Swagger.
- `npm run test --workspace backend`: passou em 29/09/2026 com 18 testes aprovados.
- Docker Compose do `ShapeUpNew`: backend, MySQL, frontend e Nginx recriados/validados em 29/09/2026; `/health` retornou `{"status":"ok"}` via Nginx.
- `RubricaNova.pdf`: revisada novamente em 14/09/2026 para confirmar os criterios avaliados; as tres linhas finais NSA continuam sem descricao objetiva no texto extraido.
- Branch GitHub: `feature/documentacao-rubrica` sincronizada com `origin/feature/documentacao-rubrica`; pacote final `9923d6d` teve CI aprovado no push e no PR em 24/11/2026.
- Rodada visual/UX de 14/09/2026: autenticacao, layout principal, painel, listagens, upload, gestores e mobile receberam polimento de interface.
- App Expo ampliado em 14/09/2026: deixou de ser apenas painel demonstrativo e passou a ter navegacao por abas com consulta e CRUD administrativo de planos, alunos e treinos.
- `npm exec --workspace mobile -- expo export --platform ios --output-dir ..\tmp\expo-export-mobile`: passou em 15/09/2026; Metro gerou bundle iOS a partir de `mobile/index.ts`.
- `recharts` removido do frontend; painel agora usa visualizacoes em HTML/CSS e nao gera warnings de console nas capturas Playwright.
- `npm run build`: passou em 15/09/2026 sem aviso de chunk acima de 500 KB; chunk principal em torno de 306 KB.
- `npm run lint`: passou em 15/09/2026.
- `npm run test`: passou em 15/09/2026, com 17 testes de backend e 7 testes de frontend.
- `npm run lint:mobile`: passou em 15/09/2026.
- `npm run e2e`: passou em 15/09/2026, com 5 testes Playwright no perfil Docker/HTTPS.
- `git diff --check`: passou em 15/09/2026, restando apenas avisos normais de CRLF no Windows.
- Auditoria NPM atualizada em 15/09/2026: 14 vulnerabilidades residuais, sem criticas e sem baixas; frontend de producao segue com 0 vulnerabilidades.
- Terceira rodada visual de 15/09/2026: formularios web de planos, alunos, treinos e perfil foram padronizados com componentes reutilizaveis, orientacoes laterais, acoes consistentes e capturas desktop/mobile.
- `npm run dev:mobile:lan -- --print-only`: validou em 15/09/2026 a API LAN `http://192.168.100.53:3333/api` para uso no Expo Go quando celular e computador estiverem na mesma rede.
- `npm exec --workspace mobile -- expo install --check`: passou em 15/09/2026 com Expo SDK 57 alinhado.
- `git diff --check`: passou em 10/09/2026.
- `npm run build`: passou em 10/09/2026.
- `npm run lint`: passou em 10/09/2026.
- `npm run test`: passou em 10/09/2026, com 17 testes de backend e 7 testes de frontend.
- `npm run e2e`: passou em 10/09/2026, detectando Docker ativo e usando o perfil Docker/HTTPS.
- `npm run lint:mobile`: passou em 10/09/2026 para o app Expo.
- Auditoria NPM: dependencias diretas `nodemailer` e `vitest` corrigidas; vulnerabilidades baixas zeradas; riscos residuais documentados em `docs/auditoria-dependencias.md`; validacoes completas passaram apos as correcoes.
- `npm exec --workspace mobile -- expo install --check`: passou em 15/09/2026 com dependencias compativeis com Expo SDK 57.
- `npx expo start --host localhost --clear`: Metro iniciou e aguardou conexao em `http://localhost:8081`.
- Docker Compose: stack ativa com MySQL, backend, frontend e Nginx; backend tambem publicado em `0.0.0.0:3333` para Expo Go.
- Docker/Nginx/HTTPS: `/health` retornou `{"status":"ok"}`, `POST /api/imagens` retornou `201` e a URL `/uploads/imagens/...` retornou `200 OK` com `Content-Type: image/png`.
- Docker/Nginx/HTTP local: `http://127.0.0.1/health`, `http://127.0.0.1/entrar` e login admin via `/api/autenticacao/entrar` validados para evitar bloqueio de certificado em teste manual.
- Expo Go em celular fisico: acesso validado em 14/09/2026 apos login no Expo Go e no Expo CLI com a mesma conta; depois disso, o app foi ampliado com abas e fluxos administrativos para a demonstracao mobile.
- Orientacao operacional criada em `docs/guia-comandos-dia-a-dia.md` para reduzir risco de execucao incorreta durante testes e apresentacao.

## Matriz de Rastreabilidade da Rubrica

| ID | Disciplina / Area | Criterio da rubrica | Nota | Status | Evidencia atual | Acao final necessaria |
| --- | --- | --- | --- | --- | --- | --- |
| R-01 | Desenvolvimento para Dispositivos Moveis | Arquitetura e padronizacao de projeto | 0,5 | Concluido | `frontend`, `backend`, `shared`, Docker, Nginx, `docs/arquitetura-evidencias.md` | Manter `build`, `lint` e README coerentes ate a entrega |
| R-02 | Desenvolvimento para Dispositivos Moveis | Componentizacao e boas praticas de desenvolvimento como clean code | 1,0 | Concluido | Componentes em `frontend/src/components`, componentes Expo em `mobile/src/components`, services/controllers/repositories no backend, tipos e validadores em `shared/src`, helper HTTP reutilizado | Executar a auditoria visual e de codigo em `docs/checklist-qa-interface.md` para remover inconsistencias antes da banca |
| R-03 | Desenvolvimento para Dispositivos Moveis | Ao menos um CRUD completo com comunicacao aplicativo x API x banco | 1,0 | Concluido | CRUDs de planos, alunos e treinos; testes E2E validam planos e alunos | Manter fluxo demonstravel e preparar roteiro de apresentacao |
| R-04 | Desenvolvimento para Dispositivos Moveis | Regra de negocio respeitada entre funcionalidades | 0,5 | Concluido | Validacoes centralizadas de CPF, e-mail e senha forte em `shared`; services mantem duplicidade, vinculo com plano, datas de treino, permissoes e imagem | Manter testes automatizados e demonstrar regras no roteiro |
| R-05 | Desenvolvimento para Dispositivos Moveis | Validacao de usabilidade, funcionalidade principal, compatibilidade entre dispositivos e seguranca da aplicacao | 1,0 | Parcial | `docs/validacao-usabilidade-seguranca.md`, `docs/validacao-expo.md`, `docs/guia-comandos-dia-a-dia.md`, `docs/auditoria-dependencias.md`, Vitest, Supertest, Playwright, Expo Go validado em celular fisico, Expo export iOS validado, JWT, bcrypt, Docker, rota local `http://127.0.0.1` validada, formularios web capturados em desktop/mobile | Coletar prints finais oficiais do web e Expo no aparelho da apresentacao |
| R-06 | Engenharia e Analise de Projetos de Software | Contextualizacao do problema e documentacao da evolucao do produto | 1,0 | Concluido | `docs/contextualizacao-problema.md`, `docs/objetivos-escopo.md`, `docs/roteiro-progresso-4-periodo.md` | Fazer leitura final para alinhar texto com a versao atual do produto |
| R-07 | Engenharia e Analise de Projetos de Software | Diagrama entidade-relacionamento | 0,5 | Concluido | `docs/modelagem-der.md` e `backend/prisma/schema.prisma` com 27 tabelas | Atualizar somente se novas tabelas forem criadas para imagens |
| R-08 | Engenharia e Analise de Projetos de Software | Requisitos funcionais e nao funcionais dentro do projeto criado | 1,0 | Concluido | `docs/requisitos.md` com RFs, RNFs e status de implementacao por grupo | Manter coerente com roteiro final |
| R-09 | Engenharia e Analise de Projetos de Software | Minimo de 2 diagramas de casos de uso | 0,5 | Concluido | `docs/diagramas-uml.md` com 2 casos de uso | Conferir se os diagramas citam funcionalidades demonstraveis |
| R-10 | Engenharia e Analise de Projetos de Software | Minimo de 2 diagramas de atividades | 0,5 | Concluido | `docs/diagramas-uml.md` com 2 atividades | Conferir se os fluxos batem com telas e endpoints atuais |
| R-11 | Engenharia e Analise de Projetos de Software | Minimo de 2 diagramas de sequencia | 0,5 | Concluido | `docs/diagramas-uml.md` com 2 sequencias | Conferir se os participantes representam a arquitetura real |
| R-12 | Tech Forge | Aplicacao recebendo e salvando imagens utilizando Multer | 1,0 | Concluido | `multer` no backend, `POST /api/imagens`, pasta `backend/uploads/imagens`, tela `/imagens` e E2E validado | Manter demonstracao no roteiro final |
| R-13 | Tech Forge | Aplicacao validando imagens recebidas: extensao, tamanho maximo e colisao de nomes | 1,0 | Concluido | Validacao de extensao, MIME type, limite de 8 MB, assinatura real do arquivo e nome unico com UUID | Manter testes automatizados cobrindo recusas |
| R-14 | Tech Forge | Controle funcional de acesso | 2,0 | Concluido | MVP alinhado ao modelo Shape Up SaaS: auto cadastro publico bloqueado; conta MASTER cria clientes; conta ADMIN gerencia somente a propria academia; acesso de aluno documentado como evolucao futura | Demonstrar a tela Clientes no master e explicar a decisao de escopo |
| R-15 | Evolucao do projeto | Proposta desenvolvida tem conexao com persona/cliente | 0,2 | Concluido | Personas em `docs/objetivos-escopo.md`; fluxos de gestor, recepcao e professor | Relacionar personas aos fluxos demonstrados na apresentacao |
| R-16 | Evolucao do projeto | Criterio NSA sem descricao clara na rubrica | 0,2 | Nao verificavel | PDF exibe item NSA sem texto descritivo extraido | Confirmar com professor ou manter justificativa no roteiro |
| R-17 | Evolucao do projeto | Criterio NSA sem descricao clara na rubrica | 0,2 | Nao verificavel | PDF exibe item NSA sem texto descritivo extraido | Confirmar com professor ou manter justificativa no roteiro |
| R-18 | Evolucao do projeto | Criterio NSA sem descricao clara na rubrica | 0,2 | Nao verificavel | PDF exibe item NSA sem texto descritivo extraido | Confirmar com professor ou manter justificativa no roteiro |

## Escopo Pendente Priorizado

| Prioridade | Entrega | Criterios atendidos | Status | Definicao de pronto |
| --- | --- | --- | --- | --- |
| P0 | Implementar upload de imagens com Multer | R-12, R-13, R-04, R-05 | Concluido | Endpoint salva imagem, valida tipo/tamanho/nome, retorna URL/metadados e possui teste |
| P0 | Atualizar evidencias de validacao tecnica | R-05, R-14 | Concluido em base tecnica | `docs/validacao-usabilidade-seguranca.md` registra testes, upload e escopo de acesso administrativo do gestor |
| P1 | Revisar requisitos implementados x planejados | R-08 | Concluido | `docs/requisitos.md` diferencia implementado, parcial/modelado e planejado |
| P1 | Refatoracao final de qualidade | R-02, R-04, R-05 | Concluido | Validadores compartilhados, helper HTTP reutilizado, app Expo componentizado e validacoes passando |
| P1 | Auditoria visual e UX do site | R-02, R-05 | Parcial controlado | Autenticacao, layout, painel, listagens, upload, gestores, perfil, formularios e mobile foram polidos; falta transformar as capturas em evidencias oficiais da apresentacao |
| P1 | Limpeza final de codigo apos auditoria visual | R-02, R-04, R-05 | Parcial controlado | `recharts` removido, rotas carregadas com lazy loading, componentes base padronizados, tabelas responsivas, formularios com layout compartilhado e Expo dividido em componentes/abas | Executar validacoes finais e revisar diff antes do commit |
| P1 | Evidencias de responsividade/Expo Go | R-05 | Parcial | Acesso em celular fisico validado; script LAN criado; `expo export` validado; falta print final do login, painel e abas operacionais quando houver mesma rede |
| P1 | Ampliar experiencia do app Expo | R-02, R-03, R-04, R-05 | Concluido em base tecnica | App mobile possui login, painel, abas de planos/alunos/treinos, leitura de dados e CRUD administrativo consumindo a API com JWT | Validar visualmente no Expo Go e registrar prints para a apresentacao |
| P2 | Roteiro final de apresentacao | Criterios da rubrica atualizada | Concluido | `docs/roteiro-apresentacao-final.md` traz roteiro de 10 a 11 minutos com sequencia de demonstracao, evidencia e limites que devem ser apresentados com precisao |
| P2 | Pacote final de evidencias | R-01 a R-15 | Concluido em base documental | `docs/pacote-final-evidencias.md` organiza comandos, credenciais, prints e roteiro de teste no site; branch sincronizada ate `385095c` |
| P2 | Checklist de defesa da rubrica | R-01 a R-18 | Concluido em base documental | `docs/checklist-rubrica-apresentacao.md` traduz cada criterio em evidencia, fala de defesa, risco e acao |
| P2 | Conferir criterios NSA | R-16, R-17, R-18 | Nao verificavel | Professor confirma significado ou a equipe registra impossibilidade de verificacao |

## Entrega Concluida - Upload de Imagens

Em 03/09/2026, o modulo minimo de upload de imagens foi concluido:

1. Dependencia `multer` adicionada no backend.
2. Pasta `backend/uploads/imagens` criada e protegida por `.gitignore`.
3. Middleware de upload criado com limite de 8 MB.
4. Validacao de PNG, JPG, JPEG e WEBP por extensao e MIME type.
5. Nome unico gerado com UUID para evitar colisao.
6. Endpoint `POST /api/imagens` protegido por token e restrito a ADMIN.
7. Arquivos servidos por `/uploads/imagens`.
8. Assinatura real do arquivo validada no service.
9. Testes automatizados cobrem sucesso, extensao invalida, arquivo falso e tamanho maximo.
10. E2E cobre upload pela tela `/imagens`.
11. Stack Docker/Nginx/HTTPS validada servindo a imagem enviada em `/uploads/imagens/...`.

## Entrega Concluida - Refatoracao e Expo

Em 08/09/2026, a refatoracao final de qualidade foi concluida em base tecnica:

1. Validacoes de e-mail, CPF e senha forte centralizadas no pacote `shared`.
2. Backend e frontend passaram a consumir a mesma fonte de regras sensiveis.
3. Normalizacao de e-mail reaproveitada nos services de autenticacao e alunos.
4. Helper `obterParametroRota` removeu repeticao de `routeId` em controllers.
5. Dependencia `@shape/shared` declarada diretamente nos workspaces consumidores.
6. Workspace `mobile` criado com Expo SDK 57 e React Native.
7. App Expo implementa login, painel, planos, alunos e treinos usando JWT e a API existente.
8. `docker-compose.expo.yml` libera a porta `3333` para teste em celular pela rede local.
9. `npm run lint:mobile` e `npm exec --workspace mobile -- expo install --check` passaram.
10. Metro iniciou com `npx expo start --host localhost --clear`.
11. Em 14/09/2026, a entrada `mobile/index.ts` corrigiu a resolucao do app no monorepo.
12. Em 14/09/2026, o Expo foi ampliado com abas e CRUD administrativo de planos, alunos e treinos.
13. Em 14/09/2026, `expo export --platform ios` gerou bundle com sucesso.

## Entrega Concluida - OpenAPI e Swagger

Em 29/09/2026, a documentacao da API foi integrada ao backend oficial do `ShapeUpNew`:

1. Dependencias `swagger-ui-express` e `@types/swagger-ui-express` adicionadas ao workspace `backend`.
2. Contrato OpenAPI criado em `backend/src/docs/openapi.ts`.
3. Swagger disponibilizado em `GET /api/docs`.
4. JSON OpenAPI disponibilizado em `GET /api/openapi.json`.
5. Contrato cobre autenticacao, usuarios, planos, alunos, treinos, painel e imagens.
6. Autenticacao JWT registrada como Bearer Token no Swagger.
7. Nginx ajustado para permitir a interface do Swagger via `/api/docs`.
8. Backend validado com `lint`, `build` e testes automatizados.
9. Stack Docker/Nginx validada com retorno `200` para Swagger, OpenAPI JSON e assets da interface.

## Proximas Entregas

- [x] Registrar no Jira as stories/tasks, prioridades, responsavel, criterios e transicoes reais.
- [x] Validar a stack atual e os fluxos de UI/API/Redis em E2E isolado; guardar logs sem tocar no banco principal.
- [x] Publicar a branch revisada e registrar uma execucao real de GitHub Actions (push e PR aprovados em `9923d6d`, 24/11/2026).
- [ ] Ensaiar a demonstracao com conta/dados descartaveis; nao usar dados de producao.
- [ ] Criar tag e publicar release 1.0.1 somente depois do CI remoto e revisao da equipe.
- [ ] Configurar deploy por SSH somente se houver servidor da equipe e secrets correspondentes.

## Rubrica Nova 5 - Arquitetura E Back-end Avancado

| Area | Criterio | Status | Evidencia |
| --- | --- | --- | --- |
| Arquitetura de Software | Documentacao arquitetural com C4, ADRs e Quality Scenarios | Documentado; metricas pendentes | `docs/rubrica-nova-5-arquitetura-backend.md`, `docs/adrs/` |
| Arquitetura de Software | Estilos arquiteturais e DDD | Documentado | Context Map, Bounded Contexts e modelo tatico em `docs/rubrica-nova-5-arquitetura-backend.md` |
| Arquitetura de Software | Integracao, APIs e dados | Implementado | Swagger/OpenAPI em `/api/docs`, ADR-0003 de MySQL/Prisma, Nginx |
| Arquitetura de Software | Qualidade, resiliencia e observabilidade | Implementado; medicao pendente | Logs estruturados, SLOs/SLIs, retry, timeout, circuit breaker Redis, fallback e invalidacao |
| Arquitetura de Software | Entrega continua | CI validado; deploy parcial/condicional | Workflow `.github/workflows/ci-cd.yml` passou no push e PR; runbook existe; deploy requer secrets/servidor |
| Back-end Avancado | Redis cache-aside com TTL e invalidacao | Implementado | `backend/src/services/cache-service.ts`, services de painel/listagens |
| Back-end Avancado | Redis Pub/Sub para eventos | Implementado | `backend/src/services/event-bus-service.ts` |
| Back-end Avancado | Docker Compose + Nginx | Revalidado em 23/11/2026 | `docker compose config` passou; stack ativa e /health, Swagger e OpenAPI responderam 200 via Nginx |
| Back-end Avancado | Boas praticas e observabilidade | Revalidado em 23/11/2026 | Lint, build e 28 testes passaram; logs de cache/eventos encontrados na stack |


## Revisao da Ultima Rubrica - 23/11/2026

A rubrica recebida como RubricaDeFatoAtt.pdf foi revisada integralmente. O trabalho continua no ShapeUpNew e as alteracoes preexistentes do working tree foram preservadas.

### Checklist de fases

- [x] Fase 0: confirmar projeto, branch, working tree e fonte da rubrica.
- [x] Fase 1: mapear todos os criterios e lacunas.
- [x] Fase 2: acrescentar Quality Scenarios, modelo DDD explicito, ADR MySQL, resiliencia, workflow e runbook.
- [x] Fase 3: lint, 28 testes, build, lint mobile, checagem Expo, parse YAML/Compose, bash -n, health/OpenAPI e suite E2E 6/6 em Compose isolado passaram em 23/11/2026; resultados em docs/execucao-final-rubrica-2026-11-23.md.
- [x] Fase 4: Jira, E2E real, workflow remoto e demo local registrados. O professor ja viu o site em uma banca anterior, entao nova hospedagem nao e necessaria para a demonstracao. Permanecem pendentes a revisao da equipe e a decisao sobre tag/release; recuperar a URL anterior se a folha exigir o link literal.
- [x] Fase 5: revisar os criterios e preparar a demonstracao; matriz atualizada e roteiro de 10 a 11 minutos em `docs/roteiro-apresentacao-final.md`.

A matriz detalhada e os resultados por criterio ficam em docs/execucao-final-rubrica-2026-11-23.md.

### Criterios Tech Forge

| Criterio | Status | Evidencia / pendencia |
| --- | --- | --- |
| Gestao do trabalho via Jira | Concluido para demonstracao | Projeto SU real com Workstream, Task, Story e Bug; nove itens com prioridade, responsavel, criterios e status conferidos em 23/11/2026. A versao 1.0.1 existe como nao lancada |
| Cynefin e escolha da abordagem | Documentado | cynefin-abordagem-gestao.md classifica Shape Up como Complexo e justifica Scrum adaptado/Kanban |
| Ciclo de vida, backlog e versoes | Parcial | Backlog, Stories, criterios e candidata Jira 1.0.1 estao registrados; `CHANGELOG.md` descreve a candidata. Tag/release real no GitHub depende da validacao remota e revisao final |

### Entrega continua e incidentes

- Workflow: .github/workflows/ci-cd.yml executa lint, testes, E2E em Compose isolado, build e validacao de Compose em pushes e pull requests; deploy em `main` so ocorre com secrets e servidor configurados.
- Deploy por SSH: condicional a secrets e servidor de demonstracao; sem configuracao, etapa aparece como ignorada.
- Estrategia de rollback e triagem: docs/runbook-incidentes.md.
- Estado desta revisao: CI remoto aprovado em `c39bf91`; deploy remoto nao executado porque depende de servidor e secrets, e tag/release aguardam revisao final da equipe.
