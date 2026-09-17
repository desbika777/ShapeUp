# Roadmap Oficial da Rubrica - Shape Up

## Objetivo

Este documento e o Artefato de Acompanhamento Oficial do projeto Shape Up. A partir desta etapa, ele deve ser tratado como a fonte da verdade para acompanhar aderencia a rubrica, evidencias ja existentes, lacunas pendentes e proximas entregas.

## Regras de Uso

- Atualizar este arquivo a cada entrega relevante.
- Registrar evidencias reais, como arquivos, rotas, testes, commits, prints ou itens do Jira.
- Nao marcar um criterio como concluido apenas porque esta documentado; ele precisa ter evidencia verificavel.
- Manter os status em quatro niveis: Concluido, Parcial, Pendente ou Nao verificavel.
- Antes da entrega final, todos os criterios com nota devem estar Concluido ou justificados.

## Ultima Revisao

Data: 15/09/2026.

Validacoes recentes:

- `RubricaNova.pdf`: revisada novamente em 14/09/2026 para confirmar os criterios avaliados; as tres linhas finais NSA continuam sem descricao objetiva no texto extraido.
- Branch GitHub: `feature/documentacao-rubrica` sincronizada com `origin/feature/documentacao-rubrica` no commit `385095c` antes desta revisao documental.
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
| R-13 | Tech Forge | Aplicacao validando imagens recebidas: extensao, tamanho maximo e colisao de nomes | 1,0 | Concluido | Validacao de extensao, MIME type, limite de 2 MB, assinatura real do arquivo e nome unico com UUID | Manter testes automatizados cobrindo recusas |
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
| P2 | Roteiro final de apresentacao | R-03, R-06, R-07, R-09, R-10, R-11, R-14, R-15 | Concluido | `docs/roteiro-final-apresentacao.md` cobre problema, produto, arquitetura, rubrica, GitHub e demonstracao |
| P2 | Pacote final de evidencias | R-01 a R-15 | Concluido em base documental | `docs/pacote-final-evidencias.md` organiza comandos, credenciais, prints e roteiro de teste no site; branch sincronizada ate `385095c` |
| P2 | Checklist de defesa da rubrica | R-01 a R-18 | Concluido em base documental | `docs/checklist-rubrica-apresentacao.md` traduz cada criterio em evidencia, fala de defesa, risco e acao |
| P2 | Conferir criterios NSA | R-16, R-17, R-18 | Nao verificavel | Professor confirma significado ou a equipe registra impossibilidade de verificacao |

## Entrega Concluida - Upload de Imagens

Em 03/09/2026, o modulo minimo de upload de imagens foi concluido:

1. Dependencia `multer` adicionada no backend.
2. Pasta `backend/uploads/imagens` criada e protegida por `.gitignore`.
3. Middleware de upload criado com limite de 2 MB.
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

## Proxima Entrega Recomendada

Auditoria visual, UX e limpeza fina do codigo:

1. Rodar a bateria final de validacoes automatizadas.
2. Revisar o diff completo para garantir que nao entrou codigo morto ou arquivo temporario.
3. Coletar prints finais oficiais do site em `http://127.0.0.1`.
4. Validar visualmente as abas novas no Expo Go assim que computador e celular estiverem na mesma rede.
5. Preparar commit/push da rodada de polimento quando a revisao final estiver aprovada.
