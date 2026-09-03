# Mapa da Rubrica - Shape

## Objetivo

Este documento acompanha os criterios da rubrica definitiva do 4o periodo e mostra, com honestidade, o que ja esta pronto no Shape, o que esta parcial e o que ainda precisa ser implementado.

## Situacao Atual

Data da ultima revisao: 10/08/2026.

O projeto possui uma base forte: problema contextualizado, objetivos, personas, requisitos, regras de negocio, DER com 27 tabelas, banco em PT-BR, CRUDs integrados, testes automatizados, seed completo, diagramas UML, Cynefin, backlog inicial e fluxo Git/GitHub.

Na validacao tecnica de 10/08/2026 passaram:

- `git diff --check`;
- `npm run lint`;
- `npm run test`;
- `npm run build`.

Observacoes da validacao:

- o build passou, mas avisou que o bundle principal do frontend ficou acima de 500 KB;
- o Browserslist informou que a base `caniuse-lite` esta desatualizada;
- o `npm install` apontou 1 vulnerabilidade baixa;
- o E2E ainda precisa ser executado novamente depois das proximas implementacoes.

## Resumo Por Criterio

| Criterio da rubrica | Evidencia no projeto | Status atual | Proximo cuidado |
| --- | --- | --- | --- |
| Arquitetura e padronizacao de projeto | `docs/arquitetura-evidencias.md`, workspaces `frontend`, `backend` e `shared` | Concluido em base tecnica | Manter `lint` e `build` passando a cada etapa |
| Componentizacao e boas praticas de desenvolvimento | Componentes em `frontend/src/components`, services/controllers/repositories em `backend/src` | Parcialmente concluido | Revisar nomes herdados em ingles apenas quando nao gerar risco |
| CRUD completo com aplicativo, API e banco | Planos, alunos e treinos com frontend, API Express, Prisma e MySQL | Concluido | Revalidar E2E |
| Regra de negocio entre funcionalidades | Services validam CPF, duplicidade, vinculo com plano, dono da conta e datas de treino | Parcialmente concluido | Expandir regras para permissoes e upload |
| Validacao de usabilidade, funcionalidade, compatibilidade e seguranca | `docs/validacao-usabilidade-seguranca.md`, Vitest, Supertest e Playwright | Parcialmente concluido | Atualizar evidencias mobile e rodar E2E final |
| Contextualizacao do problema e evolucao do produto | `docs/contextualizacao-problema.md`, `docs/objetivos-escopo.md`, `docs/roteiro-progresso-4-periodo.md` | Concluido | Manter coerente com entregas reais |
| Diagrama entidade-relacionamento | `docs/modelagem-der.md` e `backend/prisma/schema.prisma` com 27 tabelas | Concluido | Atualizar se novas tabelas forem criadas |
| Requisitos funcionais e nao funcionais | `docs/requisitos.md` | Parcialmente concluido | Separar com clareza requisitos implementados e planejados |
| 2 diagramas de casos de uso | `docs/diagramas-uml.md` | Concluido | Nenhum ajuste obrigatorio |
| 2 diagramas de atividades | `docs/diagramas-uml.md` | Concluido | Nenhum ajuste obrigatorio |
| 2 diagramas de sequencia | `docs/diagramas-uml.md` | Concluido | Nenhum ajuste obrigatorio |
| Receber e salvar imagens usando Multer | Ainda nao implementado | Pendente | Criar endpoint, service, storage e tela de envio |
| Validar imagens recebidas | Ainda nao implementado | Pendente | Validar extensao, tamanho maximo e colisao de nomes |
| Controle funcional de usuario admin e usuario | Tabelas `perfis` e `usuario_perfis`, seed com perfis | Parcialmente concluido | Criar controle real no backend e frontend |
| Conexao com persona/cliente | Personas em `docs/objetivos-escopo.md` | Concluido | Usar as personas para justificar fluxos demonstrados |
| Evolucao do projeto | Roteiro, commits, docs e modelagem ampliada | Parcialmente concluido | Registrar entregas finais e evidencias |
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

1. Implementar controle funcional de admin e usuario.
2. Implementar upload de imagens com Multer.
3. Validar imagens por extensao, tamanho maximo e nome unico.
4. Rodar E2E novamente.
5. Criar ou anexar evidencias de responsividade em dispositivos diferentes.
6. Confirmar os criterios NSA que aparecem sem descricao clara na rubrica.
7. Separar evidencias finais: testes passando, telas, DER, GitHub, Jira e demonstracao.

## Roteiro Curto Para Apresentacao

1. Explicar o problema de gestao de academias e a evolucao do Shape.
2. Mostrar objetivos, escopo, personas e requisitos.
3. Apresentar o DER com 27 tabelas e a escolha por PT-BR.
4. Mostrar os diagramas UML exigidos.
5. Demonstrar login, dashboard, CRUD de planos, alunos e treinos.
6. Demonstrar permissao por perfil quando o controle admin/usuario estiver pronto.
7. Demonstrar upload e validacao de imagem quando o Multer estiver pronto.
8. Mostrar arquitetura, testes passando, GitHub e evidencias de progresso.
