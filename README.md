# Shape Up - Gestao de Academias

O Shape Up e um sistema para donos de academia organizarem planos, alunos, treinos e anexos operacionais em um unico lugar. O projeto possui site em React, app mobile em Expo, API em Node/Express, banco MySQL com Prisma, autenticacao JWT, Docker, Nginx e testes automatizados.

Este repositorio reune a versao usada na entrega final do projeto. As instrucoes abaixo mostram como subir o ambiente, acessar o banco, rodar testes e apresentar os principais fluxos.

## Escopo do MVP

Nesta versao, o Shape Up e um sistema administrativo para donos de academia. O acesso publico permite login e recuperacao de senha; a conta master da Shape Up cria uma conta de cliente para cada academia vendida. O cliente nao cria outros gestores: ele entra com senha provisoria, define a propria senha no primeiro acesso e gerencia planos, alunos, treinos e anexos da propria academia. Login de aluno fica documentado como evolucao futura.

## Documentacao Principal

- `docs/roadmap-rubrica.md`: acompanhamento da entrega, com status, evidencias e proximas acoes.
- `docs/rubrica-nova-5-arquitetura-backend.md`: nova trilha de arquitetura, Redis, eventos, observabilidade e CI/CD.
- `docs/checklist-rubrica-apresentacao.md`: defesa criterio por criterio da rubrica anterior e riscos conhecidos.
- `docs/contextualizacao-problema.md`: problema, justificativa e evolucao do produto.
- `docs/requisitos.md`: requisitos funcionais e nao funcionais.
- `docs/modelagem-der.md`: DER com 27 tabelas em PT-BR.
- `docs/diagramas-uml.md`: 2 casos de uso, 2 atividades e 2 sequencias.
- `docs/arquitetura-evidencias.md`: arquitetura, camadas, CRUDs e padronizacao.
- `docs/validacao-usabilidade-seguranca.md`: testes, usabilidade, compatibilidade e seguranca.
- `docs/cynefin-abordagem-gestao.md`: Cynefin e abordagem agil.
- `docs/backlog-jira-inicial.md`: backlog inicial para Jira.
- `docs/execucao-final-rubrica-2026-11-23.md`: matriz de evidencia e pendencias da rubrica atualizada.
- `docs/evidencias-redis-2026-11-23.md`: demonstracao atual de cache, invalidacao e Pub/Sub.
- `docs/roteiro-apresentacao-final.md`: ordem sugerida da defesa com correspondencia aos 9 pontos.
- `CHANGELOG.md`: escopo da candidata 1.0.1, criterios de validacao e estado ainda nao publicado.
- `docs/nomenclatura-ptbr.md`: padrao de portugues usado no projeto.

## Stack

- Frontend: React, Vite, TypeScript, React Router, TanStack Query, React Hook Form, Zod, Tailwind CSS
- Mobile: Expo, React Native, TypeScript e Expo Go
- Backend: Node.js, Express, TypeScript, Prisma, MySQL, JWT, bcrypt
- Infra: Docker Compose, MySQL com volume persistente, Redis, Nginx como proxy reverso HTTPS
- Shared: tipos globais e validadores reutilizados por web, mobile e backend
- Testes: Vitest, Testing Library, Supertest, Playwright

## Estrutura

- `frontend`: aplicacao React
- `mobile`: aplicativo Expo/React Native para uso no Expo Go
- `backend`: API Express + Prisma
- `shared`: tipos e validacoes compartilhadas
- `docker/nginx`: proxy reverso, cabecalhos de seguranca e certificados locais
- `docs`: evidencias da rubrica, diagramas, requisitos, DER, Cynefin, Jira e padroes
- `docs/adrs`: decisoes arquiteturais registradas

## Setup com Docker, Nginx e HTTPS

1. Configure variaveis locais:
   - copie `.env.example` para `.env`
   - troque `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD` e `JWT_SECRET`
2. Configure o host local:
   - adicione `127.0.0.1 shapeup.local` ao arquivo de hosts do sistema
3. Gere certificados locais com `mkcert`:
   - `mkcert -install`
   - `mkcert -cert-file docker/nginx/certs/shapeup.local.crt -key-file docker/nginx/certs/shapeup.local.key shapeup.local localhost 127.0.0.1`
4. Suba a stack:
   - `docker compose up --build`
5. Acesse:
   - `http://127.0.0.1` para teste manual sem certificado
   - `https://localhost`
   - `https://shapeup.local`
   - `http://localhost/api/docs` para a documentacao Swagger da API
   - `http://localhost/api/openapi.json` para o contrato OpenAPI em JSON

Somente o Nginx publica portas externas (`80` e `443`). MySQL, backend e frontend ficam isolados na network interna do Compose.
O Redis tambem fica isolado na network interna e e usado pela API para cache-aside com TTL e eventos Pub/Sub.

> Ao usar a stack Docker/Nginx, nao abra `http://localhost:5173`. Esse endereco e apenas do Vite em desenvolvimento local. No Docker, a API passa por `/api` no Nginx; por isso o login deve ser testado em `http://127.0.0.1`, `https://localhost` ou `https://shapeup.local`.

Se o navegador mostrar erro de certificado em `https://localhost`, use `http://127.0.0.1` para teste manual rapido ou instale/confiar no certificado local gerado pelo `mkcert`. Se `shapeup.local` nao abrir, confirme que `127.0.0.1 shapeup.local` existe no arquivo de hosts do Windows.

## Acesso ao MySQL pelo DBeaver

O Compose principal mantem o MySQL isolado, como pedido na rubrica. Para inspecionar o banco localmente no DBeaver, use o override de desenvolvimento:

- `docker compose -f docker-compose.yml -f docker-compose.dbeaver.yml --env-file .env up -d`

Depois configure uma conexao MySQL no DBeaver:

- Host: `127.0.0.1`
- Porta: `3307`
- Database: `shapeup`
- Usuario: `shapeup_app`
- Senha: a mesma variavel `MYSQL_PASSWORD` do arquivo `.env`

## Seed

Com a stack descartavel de desenvolvimento ativa, rode `docker compose run --rm migrate npm run prisma:seed --workspace backend` para preparar dados de demonstracao. As contas geradas pelo seed sao apenas para uso local; nao reutilize esses dados em servidor publico.

## Desenvolvimento local sem proxy

1. Copie `backend/.env.example` para `backend/.env` e `frontend/.env.example` para `frontend/.env`.
2. Aponte `DATABASE_URL` para um MySQL disponivel.
3. Rode:
   - `npm run prisma:generate --workspace backend`
   - `npm run prisma:migrate --workspace backend`
   - `npm run dev:backend`
   - `npm run dev:frontend`

Com o backend local ativo, a documentacao fica disponivel em:

- `http://localhost:3333/api/docs`
- `http://localhost:3333/api/openapi.json`

## Execucao mobile com Expo Go

Para demonstrar no aplicativo Expo Go instalado pela App Store ou Play Store, publique a API em uma porta acessivel pela rede local:

```powershell
docker compose -f docker-compose.yml -f docker-compose.dbeaver.yml -f docker-compose.expo.yml --env-file .env up -d --build
```

Descubra o IPv4 da maquina na rede Wi-Fi:

```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' } | Select-Object IPAddress, InterfaceAlias
```

Depois inicie o Expo apontando para o backend pelo IP da maquina:

```powershell
$env:EXPO_PUBLIC_API_URL="http://SEU_IP_DA_MAQUINA:3333/api"
npm run dev:mobile
```

No celular, abra o Expo Go e leia o QR Code exibido no terminal. O app mobile tambem permite editar a URL da API na tela de login, o que ajuda na demonstracao caso o IP mude.

## Scripts principais

- `npm run build`
- `npm run test`
- `npm run lint`
- `npm run lint:mobile`
- `npm run e2e`
- `npm run e2e:docker`
- `npm run dev:backend`
- `npm run dev:frontend`
- `npm run dev:mobile`

Para E2E via Docker/HTTPS:

- `npm run e2e` sobe uma stack Compose descartavel, com portas aleatorias e banco/Redis proprios, executa Playwright e remove os volumes temporarios ao final.
- instale o Chromium do Playwright se ainda nao existir: `npm exec --workspace frontend playwright install chromium`
- `npm run e2e:docker` e um alias para o mesmo runner isolado.
- O `pre-push` usa esse runner e nao conecta ao banco principal. O script de limpeza avulso recusa bancos sem `e2e` ou `test` no nome.
- Resultado atual: 6/6 testes Playwright passaram em Compose isolado em 23/11/2026; evidencia e logs em `docs/evidencias-redis-2026-11-23.md`.

## Qualidade e GitHub

- `pre-commit`: executa `npm run lint`
- `commit-msg`: aceita mensagem curta simples ou no formato `tipo: resumo curto`
- `pre-push`: executa `npm run e2e`, com deteccao automatica do perfil Docker/HTTPS quando a stack esta ativa
- Fluxo de branches documentado em `docs/gitflow.md`
- Workflow CI/CD com lint, testes, E2E em Compose isolado, build e verificacao do Docker Compose em `.github/workflows/ci-cd.yml`
- Runbook de incidentes e rollback em `docs/runbook-incidentes.md`
- Acompanhamento da rubrica atual e das fases finais em `docs/execucao-final-rubrica-2026-11-23.md`

## Cobertura funcional entregue

- autenticacao com JWT, opcao "Lembrar meu acesso" e persistencia em `localStorage` ou `sessionStorage`
- documentacao OpenAPI/Swagger em `/api/docs` cobrindo autenticacao, usuarios, planos, alunos, treinos, painel e imagens
- Redis cache-aside com TTL para painel e listagens principais
- eventos de dominio via Redis Pub/Sub para escritas de planos, alunos, treinos e anexos
- logs estruturados de requisicoes, cache, Redis, circuit breaker e eventos
- rotas visiveis em PT-BR: `/entrar`, `/cadastro`, `/painel`, `/planos`, `/alunos`, `/treinos`
- endpoints da API em PT-BR: `/api/autenticacao/entrar`, `/api/planos`, `/api/alunos`, `/api/treinos`
- login, consulta e edicao da conta autenticada
- cliente mobile Expo com login, JWT, painel administrativo, planos, alunos e treinos
- criacao interna de clientes pela conta master; auto cadastro publico bloqueado
- validacao de e-mail, CPF e senha forte
- CRUD de planos, alunos e treinos com paginacao
- relacionamento plano -> aluno e aluno -> treino
- dashboard com KPIs, graficos e alunos recentes
- anexos operacionais com Multer em `/api/imagens`, aceitando imagens e PDFs, salvando o arquivo no backend e registrando metadados no banco para listagem e abertura posterior
- testes de backend com Supertest
- testes de frontend com Vitest + Testing Library
- testes E2E de login, acesso controlado, CRUDs de planos/alunos e anexos operacionais com Multer
