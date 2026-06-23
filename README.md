# ShapeUp Platform

Sistema completo de gestao para academias com frontend e backend separados, autenticacao JWT, 3 CRUDs completos, dashboard, TypeScript estrito, Prisma, Docker, Nginx com HTTPS local e testes automatizados.

## Stack

- Frontend: React, Vite, TypeScript, React Router, TanStack Query, React Hook Form, Zod, Tailwind CSS, Recharts
- Backend: Node.js, Express, TypeScript, Prisma, MySQL, JWT, bcrypt
- Infra: Docker Compose, MySQL com volume persistente, Nginx como proxy reverso HTTPS
- Shared: tipos globais reutilizados entre front e back
- Testes: Vitest, Testing Library, Supertest, Playwright

## Estrutura

- `frontend`: aplicacao React
- `backend`: API Express + Prisma
- `shared`: tipos compartilhados
- `docker/nginx`: proxy reverso, cabecalhos de seguranca e certificados locais
- `docs/gitflow.md`: padrao de branches e validacoes GitFlow

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
   - `https://localhost`
   - `https://shapeup.local`

Somente o Nginx publica portas externas (`80` e `443`). MySQL, backend e frontend ficam isolados na network interna do Compose.

> Ao usar a stack Docker/Nginx, nao abra `http://localhost:5173`. Esse endereco e apenas do Vite em desenvolvimento local. No Docker, a API passa por `/api` no Nginx; por isso o login deve ser testado em `https://localhost` ou `https://shapeup.local`.

Se o navegador mostrar erro de certificado, instale/confiar no certificado local gerado pelo `mkcert`. Se `shapeup.local` nao abrir, confirme que `127.0.0.1 shapeup.local` existe no arquivo de hosts do Windows. Enquanto o hosts nao estiver configurado, use `https://localhost`.

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

Com a stack ativa, rode:

- `docker compose run --rm migrate npm run prisma:seed --workspace backend`

Credenciais criadas:

- e-mail: `admin@shapeup.com`
- senha: `ShapeUp@123`

## Desenvolvimento local sem proxy

1. Copie `backend/.env.example` para `backend/.env` e `frontend/.env.example` para `frontend/.env`.
2. Aponte `DATABASE_URL` para um MySQL disponivel.
3. Rode:
   - `npm run prisma:generate --workspace backend`
   - `npm run prisma:migrate --workspace backend`
   - `npm run dev:backend`
   - `npm run dev:frontend`

## Scripts principais

- `npm run build`
- `npm run test`
- `npm run lint`
- `npm run e2e`
- `npm run dev:backend`
- `npm run dev:frontend`

Para E2E via Docker/HTTPS:

- instale o Chromium do Playwright se ainda nao existir: `npm exec --workspace frontend playwright install chromium`
- com `shapeup.local` no hosts: `$env:E2E_BASE_URL="https://shapeup.local"; $env:E2E_API_URL="https://shapeup.local/api"; npm run e2e`
- sem permissao de admin para editar hosts no Windows: `$env:E2E_BASE_URL="https://shapeup.local"; $env:E2E_API_URL="https://localhost/api"; $env:E2E_HOST_ALIAS="shapeup.local"; $env:NODE_TLS_REJECT_UNAUTHORIZED="0"; npm run e2e`

## Qualidade e GitFlow

- `pre-commit`: executa `npm run lint`
- `commit-msg`: valida mensagens no formato `tipo: resumo curto`
- `pre-push`: executa `npm run e2e`
- Fluxo de branches documentado em `docs/gitflow.md`

## Cobertura funcional entregue

- autenticacao com JWT e persistencia em `localStorage`
- cadastro, login, consulta e edicao do proprio usuario
- validacao de e-mail, CPF e senha forte
- CRUD de planos, alunos e treinos com paginacao
- relacionamento plano -> aluno e aluno -> treino
- dashboard com KPIs, graficos e alunos recentes
- testes de backend com Supertest
- testes de frontend com Vitest + Testing Library
- testes E2E de login, cadastro e CRUDs de planos e alunos
