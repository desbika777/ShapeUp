# Preparacao Para Desenvolvimento - Shape

## Objetivo

Este documento organiza o que precisa estar pronto antes de iniciar o desenvolvimento do corpo principal do projeto Shape, usando a rubrica do 4o periodo como guia.

## Estado Atual Verificado

Ferramentas encontradas na maquina:

- Git instalado.
- Node.js instalado.
- npm instalado.
- Docker instalado.
- Docker Compose instalado.
- VS Code CLI instalado.

Situacao atual:

- A copia limpa do projeto antigo existe em `C:\Users\enzog\Desktop\ShapeUP_GitHub_20260623-172713`.
- O repositorio da copia limpa esta sem alteracoes pendentes.
- Existem arquivos `.env.example` na raiz, backend e frontend.
- As dependencias `node_modules` foram instaladas na copia limpa.
- O pacote `shared` foi compilado para gerar os tipos usados por backend e frontend.
- O Prisma Client foi gerado.
- `npm run lint` passou.
- `npm run build` passou.
- `npm run test` passou.
- O Docker Desktop esta instalado e o servico foi validado.
- O MySQL esta rodando no container `shapeup-mysql`.
- O MySQL esta exposto em `127.0.0.1:3307` para uso local e DBeaver.
- Os arquivos `.env` locais foram configurados.
- As migrations existentes foram verificadas com sucesso.
- O seed foi ajustado para carregar `.env` e executado com sucesso.
- O DBeaver nao foi encontrado pelo terminal no caminho comum, mas ele nao e obrigatorio para iniciar.
- O npm apontou vulnerabilidades em dependencias; isso deve ser analisado em uma tarefa tecnica separada antes da entrega final.

## O Que Precisa Estar Aberto

### VS Code

Recomendado: sim.

O VS Code deve estar aberto na pasta:

`C:\Users\enzog\Desktop\ShapeUP_GitHub_20260623-172713`

Motivo:

- facilita acompanhar arquivos;
- permite revisar alteracoes;
- ajuda a dupla entender a estrutura;
- facilita uso do terminal integrado;
- deixa documentacao e codigo no mesmo ambiente.

Observacao:
Eu consigo trabalhar mesmo sem o VS Code aberto, mas para acompanhamento humano ele e recomendado.

### Docker Desktop

Necessario para desenvolvimento com banco e containers: sim.

O Docker Desktop precisa estar aberto antes de rodar comandos como:

```bash
docker compose up
```

Motivo:

- o MySQL do projeto depende do Docker;
- a API pode depender do banco rodando;
- o ambiente completo do projeto usa Docker Compose;
- a demonstracao final pode usar containers.

Situacao atual:
Docker esta instalado, mas o servico nao esta ativo. Antes de subir banco ou ambiente completo, abrir o Docker Desktop e esperar ele ficar com status de running.

### DBeaver

Obrigatorio no inicio: nao.

Recomendado depois que o banco estiver rodando: sim.

Motivo:

- visualizar tabelas;
- conferir dados de seed;
- validar relacionamentos;
- demonstrar o DER na pratica;
- ajudar na depuracao de registros.

No primeiro momento, podemos evoluir modelagem e codigo sem o DBeaver aberto. Ele sera mais util quando o MySQL estiver rodando.

## Preparativos Tecnicos Necessarios

### 1. Centralizar Documentacao e Codigo

Como vamos evoluir a copia limpa do SHAPEUP antigo, a documentacao do Shape deve ficar dentro da pasta real do projeto:

`C:\Users\enzog\Desktop\ShapeUP_GitHub_20260623-172713\docs`

Isso facilita versionamento no GitHub e entrega da rubrica.

### 2. Instalar Dependencias

Status: concluido.

Na pasta raiz do projeto, sera necessario executar:

```bash
npm install
```

Motivo:

- restaurar dependencias do monorepo;
- habilitar scripts de build, lint e test;
- preparar frontend, backend e shared.

### 3. Configurar Variaveis de Ambiente

Status: concluido para desenvolvimento local.

Copiar arquivos de exemplo:

```bash
copy .env.example .env
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env
```

Depois revisar:

- credenciais do MySQL;
- `DATABASE_URL`;
- `JWT_SECRET`;
- URL da API no frontend.

### 4. Subir Banco de Dados

Status: concluido usando Docker Desktop e porta local `3307`.

Com Docker Desktop aberto:

```bash
docker compose up -d mysql
```

Ou, quando quisermos subir tudo:

```bash
docker compose up --build
```

### 5. Rodar Prisma

Status: Prisma Client gerado, migrations verificadas e seed executado.

Depois do banco ativo:

```bash
npm run prisma:generate --workspace backend
npm run prisma:migrate --workspace backend
```

Quando houver seed atualizado:

```bash
npm run prisma:seed --workspace backend
```

### 6. Rodar Validacoes Basicas

Status: lint, build e test passaram.

Antes de mexer pesado no codigo:

```bash
npm run lint
npm run build
npm run test
```

Esses comandos mostram se a base antiga esta saudavel antes das alteracoes.

## Preparativos Pela Rubrica

Antes de implementar novas funcionalidades, precisamos garantir:

- contextualizacao do problema documentada;
- objetivo geral e objetivos especificos definidos;
- escopo e fora de escopo definidos;
- Cynefin e abordagem de gestao definidos;
- requisitos funcionais e nao funcionais iniciados;
- entidades principais levantadas;
- caminho para DER com 20 ou mais tabelas;
- backlog inicial planejado para Jira;
- MVP definido.

## Ordem Recomendada Para Comecar

1. Abrir VS Code na pasta da copia limpa.
2. Revisar requisitos e DER com a dupla.
3. Decidir quais tabelas entram na primeira migration da nova modelagem.
4. Atualizar o `schema.prisma`.
5. Criar migration da nova modelagem.
6. Atualizar seed para a nova estrutura.
7. Comecar implementacao pelo MVP.

Itens ja realizados:

- documentacao sincronizada para a pasta real do projeto;
- dependencias instaladas;
- Prisma Client gerado;
- arquivos `.env` locais configurados;
- MySQL validado com Docker;
- migrations existentes verificadas;
- seed executado com sucesso;
- lint executado com sucesso;
- build executado com sucesso;
- testes executados com sucesso.

## Recomendacao Para Hoje

O melhor proximo passo nao e sair codando imediatamente. A sequencia mais inteligente e:

1. deixar o ambiente pronto;
2. sincronizar documentacao com o repositorio real;
3. criar os requisitos funcionais e nao funcionais;
4. desenhar a modelagem de banco;
5. so entao alterar o Prisma e iniciar o desenvolvimento do MVP.

Essa ordem reduz retrabalho e deixa o projeto muito mais alinhado com a rubrica.
