# Roteiro Final de Apresentacao - Shape

## Objetivo

Este roteiro organiza a apresentacao final para cobrir a rubrica sem depender de improviso. A ordem prioriza problema, produto, arquitetura, requisitos, validacao tecnica e demonstracao.

## Abertura

1. Apresentar o Shape como sistema de gestao para academias.
2. Explicar o problema: dados espalhados em planilhas, papel, aplicativos de mensagem e sistemas isolados.
3. Conectar o produto as personas: gestor, recepcao e professor.
4. Mostrar que o projeto evoluiu de uma ideia inicial para uma arquitetura com web, mobile Expo, API, banco, Docker e documentacao.

## Engenharia e Analise

1. Mostrar `docs/requisitos.md`.
2. Explicar que os requisitos foram classificados em implementado, parcial/modelado e planejado.
3. Mostrar o DER em `docs/modelagem-der.md` e destacar as 27 tabelas em PT-BR.
4. Mostrar `docs/diagramas-uml.md` com 2 casos de uso, 2 atividades e 2 sequencias.
5. Explicar que funcionalidades como financeiro completo, aulas e equipamentos ficaram modeladas como evolucao, enquanto o MVP foca login, painel, CRUDs, upload e mobile Expo.

## Arquitetura e Qualidade

1. Mostrar `docs/arquitetura-evidencias.md`.
2. Explicar as camadas: frontend, mobile Expo, backend, services, repositories, Prisma e MySQL.
3. Destacar TypeScript nos workspaces, validadores em `shared`, Zod, AppError e separacao controller/service/repository.
4. Citar a refatoracao: CPF, e-mail e senha forte centralizados em `shared`; helper HTTP removendo repeticao nos controllers.
5. Mostrar que `npm run lint`, `npm run test`, `npm run build`, `npm run lint:mobile` e `npm run e2e` passaram.

## Demonstracao Web

1. Abrir `https://localhost`.
2. Entrar com `admin@shape.com.br` e senha `Shape@123`.
3. Mostrar o painel de desempenho.
4. Mostrar CRUD de planos: listar, criar ou editar.
5. Mostrar CRUD de alunos vinculado a plano.
6. Mostrar CRUD de treinos vinculado a aluno.
7. Mostrar tela `/imagens`.
8. Enviar imagem valida e explicar Multer, extensao, MIME type, assinatura real, limite de 2 MB e nome unico.
9. Tentar arquivo invalido para demonstrar validação.
10. Entrar com `usuario@shape.com.br` e senha `Usuario@123`.
11. Demonstrar bloqueio de acao administrativa.

## Demonstracao Mobile Expo

1. Subir a stack com `docker-compose.expo.yml`.
2. Descobrir o IPv4 da maquina.
3. Iniciar `npm run dev:mobile` com `EXPO_PUBLIC_API_URL`.
4. Abrir o Expo Go no celular e escanear o QR Code.
5. Fazer login.
6. Mostrar painel mobile com indicadores, planos, alunos e treinos.
7. Registrar print da tela de login e do painel carregado para evidência final.

## Fechamento Pela Rubrica

| Criterio | Como defender |
| --- | --- |
| Arquitetura e padronizacao | Workspaces `frontend`, `mobile`, `backend`, `shared`, Docker e Nginx |
| Componentizacao e clean code | Componentes web/mobile, services, repositories e validadores compartilhados |
| CRUD app x API x banco | Planos, alunos e treinos com frontend, API e MySQL |
| Regra de negocio | CPF, e-mail, senha, permissoes, vinculos, datas e upload |
| Validacao e seguranca | Testes, JWT, bcrypt, CORS, Nginx HTTPS, upload validado e Expo |
| Auditoria de dependencias | `docs/auditoria-dependencias.md`, correcoes pontuais e justificativa dos riscos residuais |
| Evolucao do produto | Roadmap, requisitos, DER, UML, Jira e commits |
| Multer | `POST /api/imagens` e arquivos em `/uploads/imagens` |
| Validacao de imagens | Extensao, MIME type, assinatura real, tamanho e UUID |
| Admin e usuario | `exigirPerfil`, `AdminRoute`, seed e demonstracao com dois perfis |

## Checklist Antes de Apresentar

- Rodar `npm run lint`.
- Rodar `npm run test`.
- Rodar `npm run build`.
- Rodar `npm run lint:mobile`.
- Rodar `npm run e2e`.
- Confirmar Docker com `docker compose -f docker-compose.yml -f docker-compose.dbeaver.yml -f docker-compose.expo.yml ps`.
- Abrir `https://localhost/health`.
- Abrir `docs/pacote-final-evidencias.md`.
- Abrir o Expo Go no celular e tirar prints.
- Conferir GitHub com branch e commits atualizados.
