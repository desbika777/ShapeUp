# Mapa da Rubrica - Shape

> Fonte oficial atual: `docs/roadmap-rubrica.md`.
> Este arquivo fica como historico/resumo. A matriz viva de status, evidencias e proximas acoes deve ser mantida no roadmap oficial.

## Objetivo

Este documento acompanha os criterios da rubrica definitiva do 4o periodo e mostra, com honestidade, o que ja esta pronto no Shape, o que esta parcial e o que ainda precisa ser implementado.

## Situacao Atual

Data da ultima revisao: 10/09/2026.

O projeto possui uma base forte: problema contextualizado, objetivos, personas, requisitos, regras de negocio, DER com 27 tabelas, banco em PT-BR, CRUDs integrados, testes automatizados, seed completo, diagramas UML, Cynefin, backlog inicial e fluxo Git/GitHub.

Na validacao tecnica de 10/09/2026 passaram:

- `git diff --check`;
- `npm run lint`;
- `npm run test`;
- `npm run build`;
- `npm run e2e`;
- `npm run lint:mobile`.

Na validacao complementar de Expo em 08/09/2026 tambem passou:

- `npx expo install --check`.

Observacoes da validacao:

- o build passou, mas avisou que o bundle principal do frontend ficou acima de 500 KB;
- o Browserslist informou que a base `caniuse-lite` esta desatualizada;
- o `npm audit` inicial apontou 29 vulnerabilidades, sem criticas;
- apos correcoes pontuais, o audit ficou com 21 vulnerabilidades residuais, sem criticas e sem baixas;
- `nodemailer`, `vitest`, `qs`, `nanoid`, `js-yaml`, `postcss-selector-parser`, `@humanfs/node` e `esbuild` foram tratados sem `--force`;
- o E2E passou com fluxo de upload de imagem pela interface;
- a stack Docker/Nginx/HTTPS serviu `/health`, recebeu upload admin em `/api/imagens` e publicou a imagem em `/uploads/imagens/...`;
- o app Expo foi criado em `mobile`, passou em `npm run lint:mobile`, `npx expo install --check` e iniciou o Metro em `http://localhost:8081`;
- a validacao em Expo Go no celular fisico nao foi possivel nesta revisao e permanece como pendencia controlada de R-05;
- `npm run e2e` agora detecta a stack Docker ativa e usa o perfil Docker/HTTPS para evitar falhas no pre-push.

## Resumo Por Criterio

| Criterio da rubrica | Evidencia no projeto | Status atual | Proximo cuidado |
| --- | --- | --- | --- |
| Arquitetura e padronizacao de projeto | `docs/arquitetura-evidencias.md`, workspaces `frontend`, `backend` e `shared` | Concluido em base tecnica | Manter `lint` e `build` passando a cada etapa |
| Componentizacao e boas praticas de desenvolvimento | Componentes em `frontend/src/components`, `mobile/src/components`, services/controllers/repositories em `backend/src` e validadores em `shared/src` | Concluido | Manter lint e evitar refatoracoes arriscadas antes da entrega |
| CRUD completo com aplicativo, API e banco | Planos, alunos e treinos com frontend, API Express, Prisma e MySQL | Concluido | Revalidar E2E |
| Regra de negocio entre funcionalidades | Services validam CPF, duplicidade, vinculo com plano, dono da conta, datas de treino, permissoes e imagens; validadores sensiveis ficam em `shared` | Concluido | Demonstrar regras no roteiro |
| Validacao de usabilidade, funcionalidade, compatibilidade e seguranca | `docs/validacao-usabilidade-seguranca.md`, `docs/validacao-expo.md`, `docs/auditoria-dependencias.md`, Vitest, Supertest, Playwright e Expo check | Parcialmente concluido | Abrir no Expo Go e anexar prints finais |
| Contextualizacao do problema e evolucao do produto | `docs/contextualizacao-problema.md`, `docs/objetivos-escopo.md`, `docs/roteiro-progresso-4-periodo.md` | Concluido | Manter coerente com entregas reais |
| Diagrama entidade-relacionamento | `docs/modelagem-der.md` e `backend/prisma/schema.prisma` com 27 tabelas | Concluido | Atualizar se novas tabelas forem criadas |
| Requisitos funcionais e nao funcionais | `docs/requisitos.md` com status de implementacao | Concluido | Manter coerente com o roteiro final |
| 2 diagramas de casos de uso | `docs/diagramas-uml.md` | Concluido | Nenhum ajuste obrigatorio |
| 2 diagramas de atividades | `docs/diagramas-uml.md` | Concluido | Nenhum ajuste obrigatorio |
| 2 diagramas de sequencia | `docs/diagramas-uml.md` | Concluido | Nenhum ajuste obrigatorio |
| Receber e salvar imagens usando Multer | `POST /api/imagens`, `backend/uploads/imagens`, tela `/imagens` | Concluido | Demonstrar na apresentacao |
| Validar imagens recebidas | Validacao de extensao, MIME type, tamanho maximo, assinatura real e nome unico | Concluido | Manter testes automatizados |
| Controle funcional de usuario admin e usuario | `exigirPerfil(['ADMIN'])`, `AdminRoute`, seed com ADMIN e USUARIO | Concluido | Demonstrar com os dois perfis |
| Conexao com persona/cliente | Personas em `docs/objetivos-escopo.md` | Concluido | Usar as personas para justificar fluxos demonstrados |
| Evolucao do projeto | Roteiro, commits, docs, modelagem ampliada e cliente Expo | Parcialmente concluido | Registrar prints finais do Expo Go e apresentacao |
| Criterio NSA sem descricao clara no PDF | Nao foi possivel identificar pelo texto extraido | Nao verificavel | Confirmar com o professor ou com a planilha original |
| Criterio NSA sem descricao clara no PDF | Nao foi possivel identificar pelo texto extraido | Nao verificavel | Confirmar com o professor ou com a planilha original |

## Itens Ja Fortes

- Problema do projeto bem contextualizado.
- Publico-alvo e personas definidos.
- DER amplo, coerente com academia completa.
- Tabelas fisicas em PT-BR.
- CRUDs principais funcionando em arquitetura separada.
- Regras de negocio concentradas em services.
- Testes automatizados de backend e frontend passando.
- Diagramas UML exigidos ja criados.

## Pendencias Prioritarias

1. Criar ou anexar evidencias do Expo Go em celular fisico.
2. Confirmar os criterios NSA que aparecem sem descricao clara na rubrica.
3. Executar o roteiro de teste dentro do site em `docs/pacote-final-evidencias.md`.
4. Fazer commit/push da auditoria NPM e pacote final de evidencias.

## Roteiro Curto Para Apresentacao

1. Explicar o problema de gestao de academias e a evolucao do Shape.
2. Mostrar objetivos, escopo, personas e requisitos.
3. Apresentar o DER com 27 tabelas e a escolha por PT-BR.
4. Mostrar os diagramas UML exigidos.
5. Demonstrar login, dashboard, CRUD de planos, alunos e treinos.
6. Demonstrar permissao por perfil com usuario ADMIN e USUARIO.
7. Demonstrar upload e validacao de imagem com a tela `/imagens`.
8. Mostrar arquitetura, testes passando, GitHub e evidencias de progresso.
