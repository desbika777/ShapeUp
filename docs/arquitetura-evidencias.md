# Arquitetura e Evidencias Tecnicas - Shape Up

## Objetivo

Este documento mostra como a arquitetura do Shape Up atende a rubrica de Arquitetura de Software: padronizacao, componentizacao, clean code, CRUD integrado, regras de negocio e validacoes.

## Visao em Camadas

```mermaid
flowchart TD
    usuario["Usuario no navegador"]
    celular["Usuario no Expo Go"]
    telas["Frontend React - paginas em PT-BR"]
    mobile["Mobile Expo - React Native"]
    componentes["Componentes reutilizaveis"]
    componentes_mobile["Componentes mobile reutilizaveis"]
    api_client["Cliente API centralizado"]
    rotas["API Express - rotas em PT-BR"]
    controllers["Controllers"]
    services["Services com regras de negocio"]
    repositories["Repositories Prisma"]
    prisma["Prisma ORM"]
    banco["MySQL com tabelas em PT-BR"]

    usuario --> telas
    celular --> mobile
    telas --> componentes
    telas --> api_client
    mobile --> componentes_mobile
    mobile --> api_client
    api_client --> rotas
    rotas --> controllers
    controllers --> services
    services --> repositories
    repositories --> prisma
    prisma --> banco
```

## Padrao de Pastas

| Area | Caminho | Finalidade |
| --- | --- | --- |
| Frontend | `frontend/src/pages` | Paginas visiveis do sistema |
| Componentes | `frontend/src/components` | Elementos reutilizaveis de layout e UI |
| Mobile | `mobile/src/screens` | Telas React Native executadas pelo Expo Go |
| Componentes mobile | `mobile/src/components` | Botao, campo de texto e cards reutilizaveis do app Expo |
| Contexto | `frontend/src/context` | Estado global de autenticacao |
| Cliente API | `frontend/src/lib/api.ts` | Comunicacao HTTP padronizada |
| Cliente API mobile | `mobile/src/lib/api.ts` | Comunicacao HTTP do Expo com tratamento padronizado de erros |
| Backend | `backend/src` | API, regras e persistencia |
| Documentacao API | `backend/src/docs/openapi.ts` | Contrato OpenAPI exibido pelo Swagger em `/api/docs` |
| Cache Redis | `backend/src/services/cache-service.ts` | Cache-aside com TTL e invalidacao por dono da academia |
| Eventos Redis | `backend/src/services/event-bus-service.ts` | Publicacao e consumo de eventos via Pub/Sub |
| Circuit breaker Redis | `backend/src/lib/redis-circuit-breaker.ts` | Abre apos tres falhas, pausa 10 segundos e executa uma sondagem de recuperacao |
| Observabilidade | `backend/src/middlewares/request-observability-middleware.ts` | Logs estruturados com request id, status e duracao |
| ADRs | `docs/adrs` | Decisoes sobre monolito modular, Redis e MySQL/Prisma |
| CI/CD | `.github/workflows/ci-cd.yml` | Lint, testes, build, Compose e deploy remoto condicional |
| Runbook | `docs/runbook-incidentes.md` | Triagem, recuperacao de servicos e rollback simples |
| Controllers | `backend/src/controllers` | Entrada HTTP e validacao inicial |
| Services | `backend/src/services` | Regras de negocio |
| Repositories | `backend/src/repositories` | Acesso ao banco |
| Banco | `backend/prisma` | Schema, migrations e seed |
| Tipos comuns | `shared/src` | Contratos usados por frontend e backend |

## Rotas Visiveis em PT-BR

| Area | Rota |
| --- | --- |
| Entrar | `/entrar` |
| Acesso controlado | `/cadastro` |
| Recuperar senha | `/recuperar-senha` |
| Redefinir senha | `/redefinir-senha` |
| Painel | `/painel` |
| Perfil | `/perfil` |
| Planos | `/planos` |
| Alunos | `/alunos` |
| Treinos | `/treinos` |
| Imagens | `/imagens` |

## Endpoints da API em PT-BR

| Funcionalidade | Endpoint |
| --- | --- |
| Cadastro publico bloqueado | `POST /api/autenticacao/cadastro` |
| Criar gestor | `POST /api/usuarios` |
| Entrar | `POST /api/autenticacao/entrar` |
| Esqueci senha | `POST /api/autenticacao/esqueci-senha` |
| Redefinir senha | `POST /api/autenticacao/redefinir-senha` |
| Usuario atual | `GET /api/usuarios/me` |
| Planos | `/api/planos` |
| Alunos | `/api/alunos` |
| Treinos | `/api/treinos` |
| Indicadores | `GET /api/painel/indicadores` |
| Imagens | `POST /api/imagens` |
| Arquivos publicos | `/uploads/imagens/:arquivo` |
| Swagger | `GET /api/docs` |
| OpenAPI JSON | `GET /api/openapi.json` |

## Contrato OpenAPI e Swagger

A API publica um contrato OpenAPI para documentar os principais endpoints do sistema e facilitar testes manuais durante a banca.

Rotas de documentacao:

- `GET /api/docs`: interface Swagger com grupos de autenticacao, usuarios, planos, alunos, treinos, painel e imagens;
- `GET /api/openapi.json`: contrato OpenAPI em JSON para inspecao ou importacao em ferramentas externas.

O Swagger registra:

- autenticacao JWT por Bearer Token;
- payloads de entrada dos formularios principais;
- respostas paginadas;
- erros padronizados de validacao, autorizacao, recurso nao encontrado e conflito;
- upload multipart de anexos operacionais.

## CRUD Integrado Demonstravel

O projeto possui tres CRUDs principais integrados:

- Planos: tela, validacao, API, service, repository e tabela `planos`;
- Alunos: tela, validacao, API, service, repository e tabela `alunos`;
- Treinos: tela, validacao, API, service, repository e tabela `treinos`.

Para a rubrica, basta um CRUD completo, mas o Shape Up entrega mais de um fluxo demonstravel.

## Boas Praticas Presentes

- TypeScript no frontend, backend e shared;
- aplicativo mobile em Expo/React Native para validacao no Expo Go;
- validacoes de CPF, e-mail e senha forte centralizadas em `shared`;
- Zod para validacao de entrada;
- React Hook Form para formularios;
- TanStack Query para cache e sincronizacao de dados;
- Controllers separados de services;
- Repositories isolando Prisma;
- Tratamento padronizado de erros;
- JWT para autenticacao;
- bcrypt para hash de senha;
- migrations versionadas;
- seed para demonstracao;
- testes unitarios e E2E;
- upload multipart com Multer;
- documentacao OpenAPI/Swagger integrada ao backend;
- Redis para cache distribuido e eventos Pub/Sub;
- logs estruturados de requisicao, cache, Redis e eventos;
- invalidacao de cache em operacoes de escrita;
- validacao de extensao, MIME type, assinatura real e tamanho maximo para imagens;
- geracao de nome unico para evitar colisao de arquivos;
- helper HTTP reutilizado para parametros de rota no backend.

## Decisao de Nomenclatura

O dominio do produto foi traduzido para PT-BR nas partes visiveis para apresentacao:

- tabelas fisicas do banco;
- rotas do frontend;
- endpoints da API;
- paginas principais;
- documentacao;
- comentarios explicativos.

Alguns nomes tecnicos permanecem em ingles quando fazem parte do ecossistema ou evitam risco desnecessario:

- `frontend`, `backend`, `shared`;
- nomes de bibliotecas e comandos npm;
- alguns tipos e modelos internos usados por TypeScript/Prisma.

Essa decisao evita quebrar o sistema e mostra criterio tecnico, nao descuido.
