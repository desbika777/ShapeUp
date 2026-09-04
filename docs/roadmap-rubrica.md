# Roadmap Oficial da Rubrica - Shape

## Objetivo

Este documento e o Artefato de Acompanhamento Oficial do projeto Shape. A partir desta etapa, ele deve ser tratado como a fonte da verdade para acompanhar aderencia a rubrica, evidencias ja existentes, lacunas pendentes e proximas entregas.

## Regras de Uso

- Atualizar este arquivo a cada entrega relevante.
- Registrar evidencias reais, como arquivos, rotas, testes, commits, prints ou itens do Jira.
- Nao marcar um criterio como concluido apenas porque esta documentado; ele precisa ter evidencia verificavel.
- Manter os status em quatro niveis: Concluido, Parcial, Pendente ou Nao verificavel.
- Antes da entrega final, todos os criterios com nota devem estar Concluido ou justificados.

## Ultima Revisao

Data: 03/09/2026.

Validacoes recentes:

- `npm run build`: passou em 03/09/2026.
- `npm run lint`: passou em 03/09/2026.
- `npm run test`: passou em 03/09/2026, com 17 testes de backend e 7 testes de frontend.
- `npm run e2e`: passou em 03/09/2026, com 5 testes ponta a ponta, incluindo upload de imagem pela interface.
- Docker Compose: stack ativa com MySQL, backend, frontend e Nginx.
- Docker/Nginx/HTTPS: `/health` retornou `{"status":"ok"}`, `POST /api/imagens` retornou `201` e a URL `/uploads/imagens/...` retornou `200 OK` com `Content-Type: image/png`.
- GitHub: branch `feature/documentacao-rubrica` sincronizado com `origin`.

## Matriz de Rastreabilidade da Rubrica

| ID | Disciplina / Area | Criterio da rubrica | Nota | Status | Evidencia atual | Acao final necessaria |
| --- | --- | --- | --- | --- | --- | --- |
| R-01 | Desenvolvimento para Dispositivos Moveis | Arquitetura e padronizacao de projeto | 0,5 | Concluido | `frontend`, `backend`, `shared`, Docker, Nginx, `docs/arquitetura-evidencias.md` | Manter `build`, `lint` e README coerentes ate a entrega |
| R-02 | Desenvolvimento para Dispositivos Moveis | Componentizacao e boas praticas de desenvolvimento como clean code | 1,0 | Parcial | Componentes em `frontend/src/components`, services/controllers/repositories no backend, tipos em `shared/src` | Fazer revisao final de codigo, reduzir duplicacoes e remover comentarios ou nomes ruins |
| R-03 | Desenvolvimento para Dispositivos Moveis | Ao menos um CRUD completo com comunicacao aplicativo x API x banco | 1,0 | Concluido | CRUDs de planos, alunos e treinos; testes E2E validam planos e alunos | Manter fluxo demonstravel e preparar roteiro de apresentacao |
| R-04 | Desenvolvimento para Dispositivos Moveis | Regra de negocio respeitada entre funcionalidades | 0,5 | Parcial | Validacoes de CPF, e-mail, senha, duplicidade, vinculo com plano, datas de treino, permissoes e imagem | Revisar regras criticas antes da entrega final |
| R-05 | Desenvolvimento para Dispositivos Moveis | Validacao de usabilidade, funcionalidade principal, compatibilidade entre dispositivos e seguranca da aplicacao | 1,0 | Parcial | `docs/validacao-usabilidade-seguranca.md`, Vitest, Supertest, Playwright, JWT, bcrypt, Docker | Gerar evidencias finais de responsividade e atualizar o documento com a execucao de 03/09/2026 |
| R-06 | Engenharia e Analise de Projetos de Software | Contextualizacao do problema e documentacao da evolucao do produto | 1,0 | Concluido | `docs/contextualizacao-problema.md`, `docs/objetivos-escopo.md`, `docs/roteiro-progresso-4-periodo.md` | Fazer leitura final para alinhar texto com a versao atual do produto |
| R-07 | Engenharia e Analise de Projetos de Software | Diagrama entidade-relacionamento | 0,5 | Concluido | `docs/modelagem-der.md` e `backend/prisma/schema.prisma` com 27 tabelas | Atualizar somente se novas tabelas forem criadas para imagens |
| R-08 | Engenharia e Analise de Projetos de Software | Requisitos funcionais e nao funcionais dentro do projeto criado | 1,0 | Parcial | `docs/requisitos.md` com RFs e RNFs organizados | Marcar quais requisitos estao implementados, planejados ou fora do MVP |
| R-09 | Engenharia e Analise de Projetos de Software | Minimo de 2 diagramas de casos de uso | 0,5 | Concluido | `docs/diagramas-uml.md` com 2 casos de uso | Conferir se os diagramas citam funcionalidades demonstraveis |
| R-10 | Engenharia e Analise de Projetos de Software | Minimo de 2 diagramas de atividades | 0,5 | Concluido | `docs/diagramas-uml.md` com 2 atividades | Conferir se os fluxos batem com telas e endpoints atuais |
| R-11 | Engenharia e Analise de Projetos de Software | Minimo de 2 diagramas de sequencia | 0,5 | Concluido | `docs/diagramas-uml.md` com 2 sequencias | Conferir se os participantes representam a arquitetura real |
| R-12 | Tech Forge | Aplicacao recebendo e salvando imagens utilizando Multer | 1,0 | Concluido | `multer` no backend, `POST /api/imagens`, pasta `backend/uploads/imagens`, tela `/imagens` e E2E validado | Manter demonstracao no roteiro final |
| R-13 | Tech Forge | Aplicacao validando imagens recebidas: extensao, tamanho maximo e colisao de nomes | 1,0 | Concluido | Validacao de extensao, MIME type, limite de 2 MB, assinatura real do arquivo e nome unico com UUID | Manter testes automatizados cobrindo recusas |
| R-14 | Tech Forge | Controle funcional de usuario admin e usuario | 2,0 | Concluido | `exigirPerfil(['ADMIN'])` no backend, `AdminRoute` no frontend, seed com ADMIN e USUARIO | Adicionar evidencia nos docs e roteiro de demonstracao com os dois perfis |
| R-15 | Evolucao do projeto | Proposta desenvolvida tem conexao com persona/cliente | 0,2 | Concluido | Personas em `docs/objetivos-escopo.md`; fluxos de gestor, recepcao e professor | Relacionar personas aos fluxos demonstrados na apresentacao |
| R-16 | Evolucao do projeto | Criterio NSA sem descricao clara na rubrica | 0,2 | Nao verificavel | PDF exibe item NSA sem texto descritivo extraido | Confirmar com professor ou manter justificativa no roteiro |
| R-17 | Evolucao do projeto | Criterio NSA sem descricao clara na rubrica | 0,2 | Nao verificavel | PDF exibe item NSA sem texto descritivo extraido | Confirmar com professor ou manter justificativa no roteiro |
| R-18 | Evolucao do projeto | Criterio NSA sem descricao clara na rubrica | 0,2 | Nao verificavel | PDF exibe item NSA sem texto descritivo extraido | Confirmar com professor ou manter justificativa no roteiro |

## Escopo Pendente Priorizado

| Prioridade | Entrega | Criterios atendidos | Status | Definicao de pronto |
| --- | --- | --- | --- | --- |
| P0 | Implementar upload de imagens com Multer | R-12, R-13, R-04, R-05 | Concluido | Endpoint salva imagem, valida tipo/tamanho/nome, retorna URL/metadados e possui teste |
| P0 | Atualizar evidencias de validacao tecnica | R-05, R-14 | Concluido em base tecnica | `docs/validacao-usabilidade-seguranca.md` registra testes de 03/09/2026, upload e evidencia dos perfis |
| P1 | Revisar requisitos implementados x planejados | R-08 | Parcial | `docs/requisitos.md` diferencia MVP entregue, planejado e evolucao futura |
| P1 | Refatoracao final de qualidade | R-02, R-04, R-05 | Pendente | Codigo revisado, sem duplicacoes obvias, sem nomenclatura confusa e com testes passando |
| P1 | Evidencias de responsividade | R-05 | Parcial | Prints ou anotacoes de desktop/mobile registrados para a apresentacao |
| P2 | Roteiro final de apresentacao | R-03, R-06, R-07, R-09, R-10, R-11, R-14, R-15 | Pendente | Roteiro cobre problema, produto, arquitetura, rubrica, Jira, GitHub e demonstracao |
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
9. Testes automatizados cobrem sucesso, usuario sem permissao, extensao invalida, arquivo falso e tamanho maximo.
10. E2E cobre upload pela tela `/imagens`.
11. Stack Docker/Nginx/HTTPS validada servindo a imagem enviada em `/uploads/imagens/...`.

## Proxima Entrega Recomendada

Executar a refatoracao final de qualidade:

1. Revisar arquivos com muitos comentarios obvios.
2. Ajustar pequenos pontos de nomenclatura e consistencia visual.
3. Atualizar requisitos implementados x planejados.
4. Gerar evidencias de responsividade.
5. Preparar roteiro final de apresentacao.
