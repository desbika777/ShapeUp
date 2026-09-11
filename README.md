# Shape - Plataforma de Gestao de Academias

Sistema completo de gestao para academias, evoluido a partir do antigo SHAPEUP e reorganizado para atender a rubrica do 4o periodo de TADS. O projeto possui frontend web, aplicativo mobile Expo, backend separado, autenticacao JWT, rotas em PT-BR, 3 CRUDs completos, dashboard, TypeScript estrito, Prisma, Docker, Nginx com HTTPS local e testes automatizados.

Este repositorio contem a versao final preparada para a rubrica. As instrucoes abaixo servem para reproduzir o ambiente em outra maquina, acessar o banco, executar testes e demonstrar os recursos implementados.

## Evidencias da Rubrica

- `docs/roadmap-rubrica.md`: artefato de acompanhamento oficial com status, evidencias e proximas acoes.
- `docs/mapa-rubrica.md`: mapa criterio por criterio da rubrica.
- `docs/contextualizacao-problema.md`: problema, justificativa e evolucao do produto.
- `docs/requisitos.md`: requisitos funcionais e nao funcionais.
- `docs/modelagem-der.md`: DER com 27 tabelas em PT-BR.
- `docs/diagramas-uml.md`: 2 casos de uso, 2 atividades e 2 sequencias.
- `docs/arquitetura-evidencias.md`: arquitetura, camadas, CRUDs e padronizacao.
- `docs/validacao-usabilidade-seguranca.md`: testes, usabilidade, compatibilidade e seguranca.
- `docs/cynefin-abordagem-gestao.md`: Cynefin e abordagem agil.
- `docs/backlog-jira-inicial.md`: backlog inicial para Jira.
- `docs/nomenclatura-ptbr.md`: padrao de portugues para reduzir duvidas na avaliacao.

## Stack

- Frontend: React, Vite, TypeScript, React Router, TanStack Query, React Hook Form, Zod, Tailwind CSS, Recharts
- Mobile: Expo, React Native, TypeScript e Expo Go
- Backend: Node.js, Express, TypeScript, Prisma, MySQL, JWT, bcrypt
- Infra: Docker Compose, MySQL com volume persistente, Nginx como proxy reverso HTTPS
- Shared: tipos globais e validadores reutilizados por web, mobile e backend
- Testes: Vitest, Testing Library, Supertest, Playwright

## Estrutura

- `frontend`: aplicacao React
- `mobile`: aplicativo Expo/React Native para uso no Expo Go
- `backend`: API Express + Prisma
- `shared`: tipos e validacoes compartilhadas
- `docker/nginx`: proxy reverso, cabecalhos de seguranca e certificados locais
- `docs`: evidencias da rubrica, diagramas, requisitos, DER, Cynefin, Jira e padroes

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

Somente o Nginx publica portas externas (`80` e `443`). MySQL, backend e frontend ficam isolados na network interna do Compose.

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

Com a stack ativa, rode:

- `docker compose run --rm migrate npm run prisma:seed --workspace backend`

Credenciais criadas:

- e-mail: `admin@shape.com.br`
- senha: `Shape@123`

## Desenvolvimento local sem proxy

1. Copie `backend/.env.example` para `backend/.env` e `frontend/.env.example` para `frontend/.env`.
2. Aponte `DATABASE_URL` para um MySQL disponivel.
3. Rode:
   - `npm run prisma:generate --workspace backend`
   - `npm run prisma:migrate --workspace backend`
   - `npm run dev:backend`
   - `npm run dev:frontend`

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

- `npm run e2e` detecta a stack Docker `shapeup-backend` em execucao e usa automaticamente o perfil Docker/HTTPS.
- instale o Chromium do Playwright se ainda nao existir: `npm exec --workspace frontend playwright install chromium`
- comando recomendado para o ambiente Docker/Nginx: `npm run e2e:docker`
- com `shapeup.local` no hosts: `$env:E2E_BASE_URL="https://shapeup.local"; $env:E2E_API_URL="https://shapeup.local/api"; npm run e2e`
- sem permissao de admin para editar hosts no Windows: `$env:E2E_BASE_URL="https://shapeup.local"; $env:E2E_API_URL="https://localhost/api"; $env:E2E_HOST_ALIAS="shapeup.local"; $env:NODE_TLS_REJECT_UNAUTHORIZED="0"; npm run e2e`

## Qualidade e GitFlow

- `pre-commit`: executa `npm run lint`
- `commit-msg`: valida mensagens no formato `tipo: resumo curto`
- `pre-push`: executa `npm run e2e`, com deteccao automatica do perfil Docker/HTTPS quando a stack esta ativa
- Fluxo de branches documentado em `docs/gitflow.md`

## Cobertura funcional entregue

- autenticacao com JWT, opcao "Lembrar meu acesso" e persistencia em `localStorage` ou `sessionStorage`
- rotas visiveis em PT-BR: `/entrar`, `/cadastro`, `/painel`, `/planos`, `/alunos`, `/treinos`
- endpoints da API em PT-BR: `/api/autenticacao/entrar`, `/api/planos`, `/api/alunos`, `/api/treinos`
- cadastro, login, consulta e edicao do proprio usuario
- cliente mobile Expo com login, JWT, painel, planos, alunos e treinos resumidos
- controle funcional entre perfil administrador e usuario operacional
- validacao de e-mail, CPF e senha forte
- CRUD de planos, alunos e treinos com paginacao
- relacionamento plano -> aluno e aluno -> treino
- dashboard com KPIs, graficos e alunos recentes
- upload de imagens com Multer em `/api/imagens`, validando extensao, MIME type, tamanho maximo, assinatura real e nome unico
- testes de backend com Supertest
- testes de frontend com Vitest + Testing Library
- testes E2E de login, cadastro, CRUDs de planos/alunos e upload de imagens
