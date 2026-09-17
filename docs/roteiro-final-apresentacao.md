# Roteiro Final de Apresentacao - Shape Up

## Objetivo

Este roteiro organiza a apresentacao final para cobrir a rubrica sem depender de improviso. A ordem prioriza problema, produto, arquitetura, requisitos, validacao tecnica e demonstracao.

## Abertura

1. Apresentar o Shape Up como sistema de gestao para academias.
2. Explicar o problema: dados espalhados em planilhas, papel, aplicativos de mensagem e sistemas isolados.
3. Conectar o produto a persona principal: dono ou gestor da academia que precisa organizar a operacao.
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

1. Abrir `http://127.0.0.1` para teste manual sem erro de certificado, ou `https://localhost` se o certificado local estiver confiavel.
2. Entrar com `admin@shape.com.br` e senha `Shape@123` para mostrar a conta master Shape Up.
3. Abrir `/usuarios` como tela de Clientes e explicar que o master cria uma conta por academia vendida.
4. Entrar com `gestor@shapeup.com.br` e senha `Shape@123` para mostrar a conta cliente.
5. Mostrar o painel de desempenho da academia.
6. Mostrar CRUD de planos: listar, criar ou editar.
7. Mostrar CRUD de alunos vinculado a plano.
8. Mostrar CRUD de treinos vinculado a aluno.
9. Mostrar tela `/imagens`.
10. Enviar imagem ou PDF valido e explicar Multer, extensao, MIME type, assinatura real, limite de 8 MB e nome unico.
11. Tentar arquivo invalido para demonstrar validação.

## Demonstracao Mobile Expo

1. Subir a stack com `docker-compose.expo.yml`.
2. Iniciar `npm run dev:mobile:lan`; o script detecta o IPv4 e configura a URL da API.
3. Se o Expo Go nao encontrar o projeto pela rede local, tentar `npm run dev:mobile:tunnel`.
4. Abrir o Expo Go no celular e escanear o QR Code ou tocar em `Shape Up Mobile`.
5. Fazer login com `gestor@shapeup.com.br`.
6. Mostrar painel mobile, abas de planos, alunos e treinos.
7. Demonstrar que o gestor possui acoes de criacao/edicao/exclusao no app.
8. Registrar print da tela de login, painel carregado e uma aba operacional para evidência final.

## Fechamento Pela Rubrica

| Criterio | Como defender |
| --- | --- |
| Arquitetura e padronizacao | Workspaces `frontend`, `mobile`, `backend`, `shared`, Docker e Nginx |
| Componentizacao e clean code | Componentes web/mobile, services, repositories e validadores compartilhados |
| CRUD app x API x banco | Planos, alunos e treinos com frontend, API e MySQL |
| Regra de negocio | CPF, e-mail, senha, acesso administrativo, vinculos, datas e upload |
| Validacao e seguranca | Testes, JWT, bcrypt, CORS, Nginx HTTPS, upload validado e Expo |
| Auditoria de dependencias | `docs/auditoria-dependencias.md`, correcoes pontuais e justificativa dos riscos residuais |
| Evolucao do produto | Roadmap, requisitos, DER, UML, Jira e commits |
| Multer | `POST /api/imagens` e arquivos em `/uploads/imagens` |
| Validacao de anexos | Extensao, MIME type, assinatura real, tamanho e UUID; imagens atendem diretamente a rubrica e PDFs entram como documento operacional |
| Acesso administrativo | Auto cadastro publico bloqueado; master Shape Up cria clientes; cliente administra apenas a propria academia; alunos sao entidades gerenciadas e acesso de aluno e evolucao futura |

## Checklist Antes de Apresentar

- Rodar `npm run lint`.
- Rodar `npm run test`.
- Rodar `npm run build`.
- Rodar `npm run lint:mobile`.
- Rodar `npm run e2e`.
- Rodar `npm exec --workspace mobile -- expo install --check`.
- Rodar `npm exec --workspace mobile -- expo export --platform ios --output-dir ..\tmp\expo-export-mobile`.
- Confirmar Docker com `docker compose -f docker-compose.yml -f docker-compose.dbeaver.yml -f docker-compose.expo.yml ps`.
- Abrir `http://127.0.0.1/health`.
- Abrir `http://SEU_IP_DA_MAQUINA:3333/health` no navegador do celular.
- Abrir `https://localhost/health`.
- Abrir `docs/pacote-final-evidencias.md`.
- Abrir o Expo Go no celular e tirar prints.
- Conferir GitHub com branch e commits atualizados.
