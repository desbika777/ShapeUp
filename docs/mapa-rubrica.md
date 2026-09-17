# Mapa da Rubrica - Shape Up

> Fonte oficial atual: `docs/roadmap-rubrica.md`.
> Este arquivo fica como historico/resumo. A matriz viva de status, evidencias e proximas acoes deve ser mantida no roadmap oficial.

## Objetivo

Este documento acompanha os criterios da rubrica definitiva do 4o periodo e mostra, com honestidade, o que ja esta pronto no Shape Up, o que esta parcial e o que ainda precisa ser implementado.

## Situacao Atual

Data da ultima revisao: 15/09/2026.

O projeto possui uma base forte: problema contextualizado, objetivos, personas, requisitos, regras de negocio, DER com 27 tabelas, banco em PT-BR, CRUDs integrados, testes automatizados, seed completo, diagramas UML, Cynefin, backlog inicial e fluxo Git/GitHub.

Nesta revisao, a rubrica original `RubricaNova.pdf` foi conferida novamente. Os criterios R-01 a R-15 possuem descricao objetiva; as tres linhas finais NSA continuam sem descricao clara e permanecem como nao verificaveis ate confirmacao do professor.

Na validacao tecnica mais recente de 15/09/2026 passaram:

- `git diff --check`;
- `npm run lint`;
- `npm run test`;
- `npm run build`;
- `npm run e2e`;
- `npm run lint:mobile`;
- `npm exec --workspace mobile -- expo install --check`;
- `npm exec --workspace mobile -- expo export --platform ios --output-dir ..\tmp\expo-export-mobile`.

Na validacao complementar de Expo em 08/09/2026 tambem passou:

- `npm exec --workspace mobile -- expo install --check`.

Observacoes da validacao:

- o build foi revalidado em 15/09/2026 com lazy loading e sem aviso de chunk acima de 500 KB;
- o Browserslist informou que a base `caniuse-lite` esta desatualizada;
- o `npm audit` inicial apontou 29 vulnerabilidades, sem criticas;
- apos correcoes pontuais, remocao de `recharts`, `npm audit fix --omit=dev` e alinhamento do Expo SDK, o audit ficou com 14 vulnerabilidades residuais, sem criticas e sem baixas;
- `nodemailer`, `vitest`, `qs`, `nanoid`, `js-yaml`, `postcss-selector-parser`, `@humanfs/node` e `esbuild` foram tratados sem `--force`;
- o E2E passou com fluxo de upload de anexo pela interface;
- a stack Docker/Nginx/HTTPS serviu `/health`, recebeu upload admin em `/api/imagens` e publicou o arquivo em `/uploads/imagens/...`;
- o app Expo foi criado em `mobile`, passou em `npm run lint:mobile`, `npm exec --workspace mobile -- expo install --check` e gerou bundle iOS com `expo export`;
- a validacao em Expo Go no celular fisico foi realizada em 14/09/2026 apos login no app e no Expo CLI;
- `npm run e2e` agora detecta a stack Docker ativa e usa o perfil Docker/HTTPS para evitar falhas no pre-push.
- o acesso local manual foi ajustado para `http://127.0.0.1`, evitando bloqueio de certificado no navegador durante a apresentacao;
- a branch `feature/documentacao-rubrica` estava sincronizada com o remoto no commit `385095c` antes desta revisao.
- a primeira rodada de QA visual corrigiu autenticacao, layout, painel, listagens, upload e menu mobile, com capturas Playwright sem warnings.
- a segunda rodada ampliou gestores, imagens, tabelas responsivas e app Expo com abas e CRUDs de planos, alunos e treinos.
- a terceira rodada padronizou formularios internos de planos, alunos, treinos e perfil, com capturas desktop/mobile.
- o script `npm run dev:mobile:lan` automatiza a URL da API para o Expo Go quando celular e computador estiverem na mesma rede.

## Resumo Por Criterio

| Criterio da rubrica | Evidencia no projeto | Status atual | Proximo cuidado |
| --- | --- | --- | --- |
| Arquitetura e padronizacao de projeto | `docs/arquitetura-evidencias.md`, workspaces `frontend`, `backend` e `shared` | Concluido em base tecnica | Manter `lint` e `build` passando a cada etapa |
| Componentizacao e boas praticas de desenvolvimento | Componentes em `frontend/src/components`, `mobile/src/components`, services/controllers/repositories em `backend/src` e validadores em `shared/src` | Concluido | Manter lint e evitar refatoracoes arriscadas antes da entrega |
| CRUD completo com aplicativo, API e banco | Planos, alunos e treinos com frontend, API Express, Prisma e MySQL | Concluido | Revalidar E2E |
| Regra de negocio entre funcionalidades | Services validam CPF, duplicidade, vinculo com plano, dono da conta, datas de treino, permissoes e imagens; validadores sensiveis ficam em `shared` | Concluido | Demonstrar regras no roteiro |
| Validacao de usabilidade, funcionalidade, compatibilidade e seguranca | `docs/validacao-usabilidade-seguranca.md`, `docs/validacao-expo.md`, `docs/auditoria-dependencias.md`, Vitest, Supertest, Playwright, Expo Go e Expo export | Parcialmente concluido | Anexar prints finais do web e do Expo |
| Contextualizacao do problema e evolucao do produto | `docs/contextualizacao-problema.md`, `docs/objetivos-escopo.md`, `docs/roteiro-progresso-4-periodo.md` | Concluido | Manter coerente com entregas reais |
| Diagrama entidade-relacionamento | `docs/modelagem-der.md` e `backend/prisma/schema.prisma` com 27 tabelas | Concluido | Atualizar se novas tabelas forem criadas |
| Requisitos funcionais e nao funcionais | `docs/requisitos.md` com status de implementacao | Concluido | Manter coerente com o roteiro final |
| 2 diagramas de casos de uso | `docs/diagramas-uml.md` | Concluido | Nenhum ajuste obrigatorio |
| 2 diagramas de atividades | `docs/diagramas-uml.md` | Concluido | Nenhum ajuste obrigatorio |
| 2 diagramas de sequencia | `docs/diagramas-uml.md` | Concluido | Nenhum ajuste obrigatorio |
| Receber e salvar imagens usando Multer | `POST /api/imagens`, `backend/uploads/imagens`, tela `/imagens` | Concluido | Demonstrar upload de imagem; o fluxo tambem aceita PDF como anexo operacional |
| Validar imagens recebidas | Validacao de extensao, MIME type, tamanho maximo, assinatura real e nome unico | Concluido | Manter testes automatizados |
| Controle funcional de acesso administrativo | Auto cadastro publico bloqueado; conta master cria clientes em `/usuarios`; `exigirPerfil(['MASTER'])` protege criacao de clientes e `exigirPerfil(['MASTER', 'ADMIN'])` protege a operacao da academia; aluno com login fica como evolucao futura | Concluido | Demonstrar a tela Clientes no master e justificar o escopo do MVP |
| Conexao com persona/cliente | Personas em `docs/objetivos-escopo.md` | Concluido | Usar as personas para justificar fluxos demonstrados |
| Criterio NSA sem descricao clara no PDF | Nao foi possivel identificar pelo texto extraido | Nao verificavel | Confirmar com o professor ou com a planilha original |
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

1. Anexar prints finais do Expo Go em celular fisico.
2. Confirmar os criterios NSA que aparecem sem descricao clara na rubrica.
3. Executar o roteiro de teste dentro do site em `docs/pacote-final-evidencias.md`.
4. Conferir `docs/checklist-qa-interface.md` durante a coleta dos prints finais.
5. Corrigir apenas regressao visivel encontrada antes do commit/push.

## Roteiro Curto Para Apresentacao

1. Explicar o problema de gestao de academias e a evolucao do Shape Up.
2. Mostrar objetivos, escopo, personas e requisitos.
3. Apresentar o DER com 27 tabelas e a escolha por PT-BR.
4. Mostrar os diagramas UML exigidos.
5. Demonstrar login, dashboard, CRUD de planos, alunos e treinos.
6. Demonstrar que o MVP atende o dono da academia cliente e que alunos sao registros gerenciados pela academia.
7. Demonstrar upload e validacao de imagem com a tela `/imagens`.
8. Mostrar arquitetura, testes passando, GitHub e evidencias de progresso.
