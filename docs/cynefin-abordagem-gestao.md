# Analise Cynefin e Abordagem de Gestao - Shape

## Objetivo do Documento

Este documento registra a analise do projeto Shape com base no Framework Cynefin e justifica a abordagem de gestao escolhida para conduzir o desenvolvimento.

## Resumo do Projeto

O Shape e uma plataforma web para gestao completa de academias. O sistema pretende centralizar processos administrativos, financeiros e operacionais, como controle de alunos, planos, matriculas, pagamentos, treinos, avaliacoes fisicas, frequencia, aulas, professores, equipamentos e indicadores gerenciais.

O projeto sera desenvolvido como evolucao do antigo SHAPEUP, aproveitando a base tecnica anterior, mas com revisao de escopo, remodelagem do banco de dados, melhoria da arquitetura e documentacao mais completa.

## Framework Cynefin

O Framework Cynefin auxilia na classificacao de problemas e projetos conforme seu nivel de previsibilidade, incerteza e complexidade. Ele pode ser dividido nos seguintes dominios:

- Simples: problemas conhecidos, com causa e efeito evidentes.
- Complicado: problemas que exigem analise tecnica, mas possuem solucao previsivel.
- Complexo: problemas com incertezas, necessidade de experimentacao e adaptacao.
- Caotico: problemas urgentes, instaveis e sem relacao clara entre causa e efeito.

## Analise dos Dominios

### Dominio Simples

O Shape nao se encaixa como um projeto simples, pois nao se limita a executar tarefas repetitivas ou regras totalmente conhecidas. Apesar de existirem funcionalidades comuns, como cadastros e listagens, o sistema envolve varias regras de negocio, perfis de usuario, relacionamentos entre entidades e decisoes de arquitetura.

### Dominio Complicado

O projeto possui elementos complicados, pois exige conhecimentos tecnicos de desenvolvimento web, banco de dados, API, autenticacao, modelagem, testes e integracao entre camadas. Muitas solucoes sao conhecidas e podem ser aplicadas com boas praticas.

Exemplos:

- modelagem de dados com muitas entidades;
- criacao de API REST;
- integracao frontend, backend e banco;
- autenticacao com JWT;
- validacoes com regras de negocio;
- organizacao de arquitetura e componentes.

### Dominio Complexo

O projeto se aproxima principalmente do dominio complexo, pois o entendimento do produto pode evoluir durante o desenvolvimento. Uma academia completa possui diferentes usuarios, processos internos e necessidades que podem mudar conforme o escopo fica mais claro.

Existem incertezas sobre:

- quais funcionalidades devem ser priorizadas;
- quais regras de negocio serao mais importantes para a demonstracao;
- como equilibrar escopo academico e viabilidade tecnica;
- como organizar as entregas parciais;
- quais telas e fluxos serao mais relevantes para a banca;
- como manter o banco com 20 ou mais tabelas sem criar entidades artificiais.

Nesse contexto, o projeto exige ciclos de experimentacao, revisao e adaptacao.

### Dominio Caotico

O Shape nao se encaixa no dominio caotico, pois nao se trata de uma situacao emergencial ou sem direcao. Existe uma rubrica clara, uma proposta de produto e uma base tecnica anterior que orientam o desenvolvimento.

## Classificacao Escolhida

O projeto Shape sera classificado no dominio Complexo do Framework Cynefin.

Justificativa:
Embora existam solucoes tecnicas conhecidas para desenvolver sistemas web, o produto envolve muitas partes relacionadas, diferentes usuarios, regras de negocio e necessidade de evolucao progressiva. O escopo precisa ser refinado durante o desenvolvimento para equilibrar qualidade, prazo, rubrica e viabilidade. Por isso, a melhor forma de conduzir o projeto e trabalhar em ciclos curtos, validar entregas parciais e adaptar o backlog conforme o aprendizado da equipe.

## Abordagem de Gestao Escolhida

A abordagem escolhida sera agil, com uso de Scrum adaptado e apoio de Kanban no Jira.

Essa abordagem foi escolhida porque permite:

- organizar o trabalho em ciclos curtos;
- priorizar funcionalidades de maior valor;
- acompanhar o progresso por meio do Jira;
- revisar o escopo a cada entrega parcial;
- transformar requisitos em user stories;
- definir criterios de aceite claros;
- registrar tarefas tecnicas, bugs e melhorias;
- entregar versoes incrementais do software.

## Funcionamento da Abordagem

O projeto sera organizado em epicos, user stories, tasks e bugs.

### Epicos

Representam grandes areas do sistema.

Epicos iniciais:

- Autenticacao e Usuarios;
- Gestao de Alunos;
- Planos e Matriculas;
- Treinos e Exercicios;
- Avaliacoes Fisicas;
- Pagamentos;
- Agenda e Frequencia;
- Equipamentos e Manutencoes;
- Dashboard e Relatorios;
- Documentacao e Diagramas;
- Infraestrutura e Qualidade.

### User Stories

As funcionalidades serao descritas no formato:

Como [tipo de usuario], quero [funcionalidade], para [beneficio].

Exemplo:
Como recepcionista, quero cadastrar um aluno, para manter os dados do cliente registrados no sistema.

### Criterios de Aceite

Cada story importante deve possuir criterios de aceite para indicar quando ela pode ser considerada concluida.

Exemplo:

- O sistema deve exigir nome, email, CPF, telefone e data de nascimento.
- O sistema deve impedir cadastro com CPF duplicado.
- O sistema deve exibir mensagem de erro em caso de dados invalidos.
- O aluno cadastrado deve aparecer na listagem.

### Tasks Tecnicas

As tasks tecnicas serao usadas para atividades de implementacao que nao representam diretamente uma funcionalidade para o usuario, como:

- criar tabela no banco;
- criar migration;
- criar endpoint da API;
- criar componente reutilizavel;
- configurar validacoes;
- criar testes.

### Bugs

Bugs serao registrados quando uma funcionalidade existente apresentar comportamento incorreto.

Exemplos:

- formulario permite enviar campo obrigatorio vazio;
- tela quebra em resolucao menor;
- API retorna dados de outro usuario;
- dashboard exibe contagem incorreta.

## Fluxo no Jira

Fluxo sugerido:

- A fazer;
- Em andamento;
- Em revisao;
- Bloqueado;
- Concluido.

Cada item deve ser movido de acordo com o progresso real da dupla. Isso gera evidencia de acompanhamento e ajuda a demonstrar transparencia no desenvolvimento.

## Versoes Parciais

O projeto sera entregue em versoes incrementais.

### Versao 0.1 - Fundacao

Objetivo:
Organizar documentacao, escopo, arquitetura inicial e base do projeto.

Entregas:

- contextualizacao;
- objetivos e escopo;
- Cynefin e abordagem;
- estrutura inicial do projeto;
- ambiente revisado.

### Versao 0.2 - Modelagem

Objetivo:
Definir o banco de dados e requisitos principais.

Entregas:

- DER com 20 ou mais tabelas;
- dicionario de dados;
- requisitos funcionais;
- requisitos nao funcionais;
- regras de negocio.

### Versao 0.3 - MVP Operacional

Objetivo:
Implementar o fluxo principal da academia.

Entregas:

- login;
- dashboard inicial;
- CRUD de planos;
- CRUD de alunos;
- matricula de aluno em plano;
- registro basico de pagamento;
- treino vinculado ao aluno.

### Versao 0.4 - Expansao

Objetivo:
Ampliar funcionalidades e melhorar a experiencia do usuario.

Entregas:

- professores;
- exercicios;
- avaliacoes fisicas;
- frequencia;
- aulas e agendamentos;
- equipamentos e manutencoes.

### Versao 1.0 - Entrega Final

Objetivo:
Consolidar produto, documentacao e apresentacao.

Entregas:

- sistema navegavel;
- documentacao final;
- diagramas UML;
- evidencias do Jira;
- README revisado;
- testes principais;
- apresentacao preparada.

## Papéis da Equipe

Como a equipe e uma dupla, os papeis podem ser acumulados.

Papeis sugeridos:

- Product Owner: responsavel por priorizar escopo, backlog e valor do produto.
- Scrum Master: responsavel por acompanhar o fluxo, remover impedimentos e manter o Jira atualizado.
- Desenvolvedor Full Stack: responsavel por frontend, backend, banco e integracoes.
- Analista de Requisitos: responsavel por documentar requisitos, regras de negocio e diagramas.

Na pratica, os papeis serao compartilhados entre os integrantes, mas devem estar documentados para demonstrar organizacao.

## Justificativa Final

A abordagem agil com Scrum adaptado e Kanban no Jira e adequada para o Shape porque o projeto possui incertezas de escopo, depende de entregas incrementais e precisa demonstrar progresso constante. Essa forma de trabalho permite que a equipe comece pelo essencial, valide a evolucao do produto, reorganize prioridades e produza evidencias claras para a rubrica.

Assim, a gestao do projeto deixa de ser apenas uma etapa burocratica e passa a apoiar o desenvolvimento real do sistema.
