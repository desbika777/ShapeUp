# Roteiro de Progresso - Shape

## Objetivo

Evoluir o antigo SHAPEUP para uma nova versao mais madura, limpa e alinhada a rubrica do 4o periodo de TADS. A proposta e reaproveitar a ideia e a base tecnica existente, mas redesenhar o produto com melhor arquitetura, banco mais completo, documentacao forte e entregas parciais bem controladas.

## Principio do projeto

O projeto nao deve ser apenas "um sistema de academia com CRUD". Ele deve parecer uma plataforma real de gestao fitness, com regras de negocio claras, evolucao documentada, arquitetura organizada e rastreabilidade pelo Jira.

## Visao do produto

Nome do app: Shape

Referencias de nome/identidade:

- Shape;
- Shape Up;
- Shape App.

Proposta:
Uma plataforma web para gestao completa de academias, permitindo controlar alunos, planos, matriculas, treinos, avaliacoes fisicas, frequencia, pagamentos, aulas, professores, equipamentos e indicadores do negocio.

## Decisao tecnica inicial

Seguiremos com uma evolucao inteligente do SHAPEUP antigo:

- manter a ideia central do produto;
- aproveitar aprendizados, telas e padroes bons;
- evitar carregar codigo desnecessario ou sujo;
- evoluir a copia limpa do projeto antigo como base tecnica;
- remodelar o banco para atender ao minimo de 20 tabelas;
- documentar a evolucao como uma nova fase do produto;
- implementar por modulos pequenos, testaveis e demonstraveis.

## Stack sugerida

- Frontend: React, Vite, TypeScript, Tailwind CSS, React Router, TanStack Query, React Hook Form e Zod.
- Backend: Node.js, Express, TypeScript, Prisma e MySQL.
- Autenticacao: JWT, senha com hash e controle basico de permissoes.
- Infra: Docker Compose para banco, API e frontend.
- Testes: Vitest, Supertest e Playwright quando fizer sentido.
- Gestao: Jira com epicos, user stories, tasks, bugs e versoes.
- Documentacao: Markdown, diagramas UML/DER e evidencias de progresso.

## Rubrica traduzida em metas

### Engenharia e Analise de Projetos de Software

Entregaveis:

- contextualizacao do problema;
- documentacao da evolucao do produto;
- DER com pelo menos 20 tabelas;
- requisitos funcionais;
- requisitos nao funcionais;
- 2 diagramas de casos de uso;
- 2 diagramas de atividades;
- 2 diagramas de sequencia.

Meta:
Deixar claro que o projeto foi pensado antes de ser codado.

### Arquitetura de Software

Entregaveis:

- arquitetura documentada;
- padrao de pastas;
- componentizacao;
- clean code;
- pelo menos 1 CRUD completo integrado: frontend, API e banco;
- regras de negocio aplicadas;
- validacao de usabilidade, responsividade, compatibilidade e seguranca.

Meta:
Mostrar que o sistema funciona e que o codigo tem padrao profissional.

### Tech Forge

Entregaveis:

- Jira com fluxo real de trabalho;
- epicos, stories, tasks e bugs;
- status atualizados;
- Cynefin aplicado ao projeto;
- justificativa da abordagem escolhida;
- backlog priorizado;
- user stories com criterios de aceite;
- versoes parciais do software.

Meta:
Mostrar gestao de projeto, nao apenas desenvolvimento.

## Fase 0 - Organizacao Inicial

Status: concluida.

Objetivo:
Preparar o projeto para nascer de forma organizada.

Entregaveis:

- criar roteiro de progresso;
- definir nome e escopo inicial;
- decidir se o repositorio sera novo ou baseado na copia limpa do SHAPEUP;
- criar estrutura de documentacao;
- listar os modulos candidatos;
- definir primeiro MVP.

Criterio de pronto:
Todos da dupla entendem o que sera construido, por que sera construido e qual sera a primeira entrega.

## Fase 1 - Descoberta e Escopo

Status: concluida em versao inicial.

Objetivo:
Transformar a ideia em problema, publico-alvo, objetivos e limites.

Atividades:

- escrever a contextualizacao do problema;
- definir personas principais;
- definir dores do usuario;
- definir objetivo geral;
- definir objetivos especificos;
- definir escopo inicial;
- definir fora de escopo;
- classificar o projeto com Cynefin;
- escolher abordagem agil, preditiva ou hibrida.

Entregaveis:

- documento de contextualizacao;
- documento de objetivos, publico-alvo, personas e escopo;
- documento de Cynefin;
- lista inicial de requisitos;
- decisao de abordagem.

Documentos criados:

- `docs/contextualizacao-problema.md`;
- `docs/objetivos-escopo.md`;
- `docs/cynefin-abordagem-gestao.md`;
- `docs/requisitos.md`;
- `docs/regras-negocio.md`.

Criterio de pronto:
Conseguimos explicar o projeto em 2 minutos para um professor sem depender do codigo.

## Fase 2 - Modelagem do Produto

Status: em andamento.

Objetivo:
Projetar o sistema antes de aumentar o codigo.

Atividades:

- definir modulos do sistema;
- definir entidades principais;
- montar DER com minimo de 20 tabelas;
- revisar se as tabelas fazem sentido de negocio;
- escrever requisitos funcionais;
- escrever requisitos nao funcionais;
- definir regras de negocio principais.

Modulos candidatos:

- usuarios e permissoes;
- alunos;
- professores;
- planos;
- matriculas;
- pagamentos;
- treinos;
- exercicios;
- grupos musculares;
- avaliacoes fisicas;
- medidas corporais;
- frequencia;
- aulas coletivas;
- agendamentos;
- equipamentos;
- manutencoes;
- metas;
- notificacoes;
- dashboard;
- relatorios.

Entregaveis:

- DER;
- dicionario de dados;
- requisitos funcionais;
- requisitos nao funcionais;
- regras de negocio.

Progresso atual:

- requisitos funcionais documentados;
- requisitos nao funcionais documentados;
- regras de negocio iniciais documentadas;
- proposta de DER com 27 tabelas criada;
- dicionario de dados resumido criado.

Documento principal:

- `docs/modelagem-der.md`.

Criterio de pronto:
O banco suporta o produto sem parecer inchado artificialmente.

## Fase 3 - Planejamento no Jira

Status: backlog inicial documentado.

Objetivo:
Criar rastreabilidade entre rubrica, backlog e entregas.

Atividades:

- criar epicos por modulo;
- criar user stories;
- criar criterios de aceite;
- criar tasks tecnicas;
- criar bugs quando aparecerem;
- definir versoes parciais.

Epicos iniciais sugeridos:

- Autenticacao e Usuarios;
- Gestao de Alunos;
- Planos e Matriculas;
- Treinos e Exercicios;
- Avaliacoes Fisicas;
- Pagamentos;
- Agenda e Frequencia;
- Dashboard e Relatorios;
- Documentacao e Diagramas;
- Infraestrutura e Qualidade.

Entregaveis:

- quadro Jira criado;
- backlog priorizado;
- sprint ou ciclo inicial definido;
- evidencias para apresentacao.

Progresso atual:

- epicos iniciais definidos;
- user stories iniciais definidas;
- criterios de aceite iniciais definidos;
- versoes parciais propostas.

Documento principal:

- `docs/backlog-jira-inicial.md`.

Criterio de pronto:
Cada funcionalidade importante tem uma story com criterio de aceite.

## Fase 4 - Arquitetura e Base Tecnica

Status: preparacao inicial validada.

Objetivo:
Preparar uma base limpa para evoluir com menos sujeira.

Atividades:

- escolher se vamos criar novo repositorio ou usar a copia limpa;
- revisar estrutura de pastas;
- revisar padrao de componentes;
- revisar padrao de services, controllers e repositories;
- configurar ambiente;
- garantir lint/build/test basicos;
- criar documentacao de arquitetura.

Entregaveis:

- projeto rodando localmente;
- API conectando no banco;
- frontend conectando na API;
- padrao de pastas documentado;
- comandos principais no README.

Preparacao tecnica ja realizada:

- dependencias instaladas;
- pacote compartilhado compilado;
- Prisma Client gerado;
- arquivos `.env` locais configurados;
- Docker Desktop validado;
- MySQL local validado em `127.0.0.1:3307`;
- migrations existentes verificadas;
- seed ajustado e executado com sucesso;
- lint executado com sucesso;
- build executado com sucesso;
- testes automatizados executados com sucesso.

Pendencias tecnicas:

- testar execucao local completa com frontend, API e banco;
- atualizar `schema.prisma` para a nova modelagem;
- criar migration da nova estrutura;
- atualizar seed para a nova estrutura completa.

Criterio de pronto:
Qualquer membro da dupla consegue rodar o projeto seguindo o README.

## Fase 5 - MVP Funcional

Objetivo:
Entregar a primeira versao demonstravel do sistema.

Funcionalidades prioritarias:

- cadastro e login;
- dashboard inicial;
- CRUD de alunos;
- CRUD de planos;
- matricula de aluno em plano;
- CRUD de treinos;
- associacao de treino ao aluno;
- validacoes de formulario;
- protecao de rotas;
- regras basicas de permissao.

Entregaveis:

- MVP navegavel;
- ao menos 1 CRUD completo app x API x banco;
- seed de dados;
- testes essenciais;
- screenshots ou evidencias.

Criterio de pronto:
O sistema pode ser demonstrado de ponta a ponta sem depender de explicacao verbal para funcionar.

## Fase 6 - Diagramas UML

Objetivo:
Documentar os fluxos que mais representam o sistema.

Diagramas sugeridos:

- Caso de uso 1: Administrador gerencia alunos, planos e matriculas.
- Caso de uso 2: Professor gerencia treinos e avaliacoes fisicas.
- Atividade 1: Processo de matricula de aluno.
- Atividade 2: Criacao e atribuicao de treino.
- Sequencia 1: Login e acesso ao dashboard.
- Sequencia 2: Cadastro de aluno com vinculacao a plano.

Entregaveis:

- 2 diagramas de caso de uso;
- 2 diagramas de atividade;
- 2 diagramas de sequencia.

Criterio de pronto:
Os diagramas batem com funcionalidades reais do sistema.

## Fase 7 - Evolucao e Polimento

Objetivo:
Melhorar a qualidade da entrega e reduzir riscos.

Atividades:

- revisar responsividade;
- revisar acessibilidade basica;
- revisar mensagens de erro;
- revisar seguranca;
- melhorar dashboard;
- adicionar filtros e paginacao;
- ajustar regras de negocio;
- limpar codigo duplicado;
- melhorar testes;
- corrigir bugs encontrados.

Entregaveis:

- versao parcial mais completa;
- changelog ou notas de versao;
- evidencias de testes;
- documentacao atualizada.

Criterio de pronto:
O projeto parece consistente, nao apenas funcional.

## Fase 8 - Fechamento e Apresentacao

Objetivo:
Preparar a entrega final para banca/professor.

Atividades:

- revisar rubrica item por item;
- garantir links de GitHub e site;
- preparar roteiro de apresentacao;
- preparar demonstracao;
- separar prints do Jira;
- revisar README;
- revisar documentos;
- testar ambiente do zero.

Entregaveis:

- link do GitHub;
- link do site ou ambiente publicado;
- documentos finais;
- diagramas finais;
- evidencias do Jira;
- apresentacao ou roteiro oral;
- versao final marcada.

Criterio de pronto:
A dupla consegue apresentar o projeto com seguranca, mostrando produto, processo e documentacao.

## Roteiro de comunicacao da dupla

Ritmo recomendado:

- alinhamento rapido no inicio de cada ciclo;
- registrar decisoes importantes no README ou em docs;
- atualizar Jira sempre que iniciar, pausar ou concluir uma tarefa;
- revisar juntos antes de fechar uma versao;
- nao deixar decisao tecnica importante apenas na conversa informal.

Padrao de status:

- A fazer;
- Em andamento;
- Em revisao;
- Bloqueado;
- Concluido.

Quando algo bloquear:

- explicar o problema;
- mostrar onde esta acontecendo;
- dizer o que ja foi tentado;
- propor uma alternativa.

## Primeiro MVP recomendado

O primeiro MVP deve ser pequeno, mas bem amarrado:

1. Usuario faz login.
2. Usuario acessa dashboard.
3. Usuario cria um plano.
4. Usuario cadastra um aluno.
5. Usuario matricula o aluno em um plano.
6. Usuario cria um treino.
7. Usuario vincula o treino ao aluno.
8. Dashboard mostra indicadores basicos.

Esse fluxo ja permite demonstrar:

- autenticacao;
- CRUD;
- relacionamento entre tabelas;
- regras de negocio;
- frontend integrado com API;
- API integrada ao banco;
- navegacao protegida;
- base para diagramas UML.

## Primeiras decisoes pendentes

Decisoes ja tomadas:

- nome do app: Shape;
- foco do produto: academia completa;
- base tecnica: evoluir a copia limpa do SHAPEUP antigo.

Ainda precisamos decidir:

- o Jira sera Scrum com sprints ou Kanban com entregas continuas?
- vamos publicar o frontend/backend ou apenas rodar localmente com evidencias?

## Proxima acao sugerida

Documentos ja criados:

- contextualizacao do problema;
- objetivo geral;
- objetivos especificos;
- publico-alvo;
- escopo;
- fora de escopo;
- analise Cynefin;
- abordagem de gestao escolhida.
- requisitos funcionais;
- requisitos nao funcionais;
- regras de negocio;
- DER proposto com 27 tabelas;
- backlog inicial para Jira.

Proxima acao:

- revisar DER e backlog com a dupla;
- decidir quais tabelas entram na primeira migration;
- iniciar atualizacao do `schema.prisma`.
