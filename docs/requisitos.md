# Requisitos - Shape

## Objetivo

Este documento registra os requisitos funcionais e nao funcionais do Shape, servindo como base para backlog, DER, implementacao, testes e apresentacao da rubrica.

## Escala de Prioridade

- MVP: essencial para a primeira versao demonstravel.
- P1: importante para completar a proposta de academia completa.
- P2: melhoria ou evolucao apos o MVP.

## Requisitos Funcionais

### Autenticacao e Usuarios

| Codigo | Prioridade | Requisito |
| --- | --- | --- |
| RF-001 | MVP | O sistema deve permitir cadastro de usuarios autorizados. |
| RF-002 | MVP | O sistema deve permitir login com email e senha. |
| RF-003 | MVP | O sistema deve proteger rotas internas para usuarios autenticados. |
| RF-004 | MVP | O sistema deve permitir recuperacao de senha por token. |
| RF-005 | P1 | O sistema deve permitir associar usuarios a perfis de acesso. |
| RF-006 | P1 | O sistema deve permitir controlar permissoes por perfil, como administrador, recepcionista, professor e financeiro. |

### Gestao da Academia

| Codigo | Prioridade | Requisito |
| --- | --- | --- |
| RF-007 | MVP | O sistema deve manter dados principais da academia. |
| RF-008 | P1 | O sistema deve permitir configurar informacoes de contato, endereco e status da academia. |
| RF-009 | P1 | O sistema deve permitir que os dados operacionais sejam vinculados a uma academia. |

### Alunos

| Codigo | Prioridade | Requisito |
| --- | --- | --- |
| RF-010 | MVP | O sistema deve permitir cadastrar alunos. |
| RF-011 | MVP | O sistema deve permitir listar alunos com filtros basicos. |
| RF-012 | MVP | O sistema deve permitir consultar detalhes de um aluno. |
| RF-013 | MVP | O sistema deve permitir atualizar dados de um aluno. |
| RF-014 | MVP | O sistema deve permitir inativar um aluno. |
| RF-015 | P1 | O sistema deve manter historico basico do aluno, incluindo matriculas, treinos, avaliacoes e pagamentos. |

### Professores e Funcionarios

| Codigo | Prioridade | Requisito |
| --- | --- | --- |
| RF-016 | P1 | O sistema deve permitir cadastrar professores e funcionarios. |
| RF-017 | P1 | O sistema deve permitir vincular professores a treinos, aulas e avaliacoes fisicas. |
| RF-018 | P1 | O sistema deve permitir consultar professores ativos e inativos. |

### Planos e Matriculas

| Codigo | Prioridade | Requisito |
| --- | --- | --- |
| RF-019 | MVP | O sistema deve permitir cadastrar planos da academia. |
| RF-020 | MVP | O sistema deve permitir editar e inativar planos. |
| RF-021 | MVP | O sistema deve permitir matricular um aluno em um plano. |
| RF-022 | MVP | O sistema deve permitir consultar matriculas ativas, vencidas e canceladas. |
| RF-023 | P1 | O sistema deve impedir que um aluno tenha mais de uma matricula principal ativa ao mesmo tempo. |
| RF-024 | P1 | O sistema deve permitir cancelar uma matricula registrando motivo e data. |

### Financeiro

| Codigo | Prioridade | Requisito |
| --- | --- | --- |
| RF-025 | MVP | O sistema deve permitir registrar pagamentos vinculados a matriculas. |
| RF-026 | MVP | O sistema deve permitir consultar pagamentos pagos, pendentes, vencidos e cancelados. |
| RF-027 | P1 | O sistema deve permitir cadastrar formas de pagamento. |
| RF-028 | P1 | O sistema deve calcular indicadores financeiros basicos para o dashboard. |

### Treinos e Exercicios

| Codigo | Prioridade | Requisito |
| --- | --- | --- |
| RF-029 | MVP | O sistema deve permitir cadastrar treinos para alunos. |
| RF-030 | MVP | O sistema deve permitir vincular treinos a alunos. |
| RF-031 | P1 | O sistema deve permitir cadastrar exercicios. |
| RF-032 | P1 | O sistema deve permitir classificar exercicios por grupo muscular. |
| RF-033 | P1 | O sistema deve permitir montar um treino com exercicios, series, repeticoes, carga, descanso e observacoes. |
| RF-034 | P1 | O sistema deve permitir vincular professores responsaveis a treinos. |

### Avaliacoes Fisicas

| Codigo | Prioridade | Requisito |
| --- | --- | --- |
| RF-035 | P1 | O sistema deve permitir registrar avaliacoes fisicas de alunos. |
| RF-036 | P1 | O sistema deve permitir registrar medidas corporais relacionadas a uma avaliacao fisica. |
| RF-037 | P2 | O sistema deve permitir acompanhar evolucao fisica do aluno ao longo do tempo. |

### Frequencia, Aulas e Agenda

| Codigo | Prioridade | Requisito |
| --- | --- | --- |
| RF-038 | P1 | O sistema deve permitir registrar frequencia de alunos. |
| RF-039 | P1 | O sistema deve permitir cadastrar aulas coletivas. |
| RF-040 | P1 | O sistema deve permitir criar horarios para aulas coletivas. |
| RF-041 | P1 | O sistema deve permitir inscrever alunos em aulas. |
| RF-042 | P2 | O sistema deve controlar limite de vagas por aula. |

### Equipamentos e Manutencoes

| Codigo | Prioridade | Requisito |
| --- | --- | --- |
| RF-043 | P1 | O sistema deve permitir cadastrar equipamentos da academia. |
| RF-044 | P1 | O sistema deve permitir registrar manutencoes de equipamentos. |
| RF-045 | P2 | O sistema deve permitir identificar equipamentos em manutencao, ativos ou inativos. |

### Notificacoes e Comunicacao

| Codigo | Prioridade | Requisito |
| --- | --- | --- |
| RF-046 | P2 | O sistema deve permitir registrar notificacoes internas para usuarios. |
| RF-047 | P2 | O sistema deve permitir notificar situacoes como pagamento pendente, matricula vencendo ou avaliacao agendada. |

### Dashboard e Relatorios

| Codigo | Prioridade | Requisito |
| --- | --- | --- |
| RF-048 | MVP | O sistema deve exibir dashboard com indicadores basicos. |
| RF-049 | MVP | O dashboard deve mostrar total de alunos ativos, planos ativos, treinos e novos alunos do mes. |
| RF-050 | P1 | O dashboard deve exibir indicadores de pagamentos e matriculas. |
| RF-051 | P2 | O sistema deve permitir gerar relatorios simples para acompanhamento da academia. |

## Requisitos Nao Funcionais

| Codigo | Categoria | Requisito |
| --- | --- | --- |
| RNF-001 | Seguranca | Senhas devem ser armazenadas usando hash seguro. |
| RNF-002 | Seguranca | Rotas protegidas devem exigir token JWT valido. |
| RNF-003 | Seguranca | Usuarios devem acessar apenas dados permitidos pelo seu perfil e academia. |
| RNF-004 | Seguranca | Dados sensiveis nao devem ser expostos em respostas da API. |
| RNF-005 | Usabilidade | A interface deve ser clara, organizada e adequada a rotinas administrativas frequentes. |
| RNF-006 | Usabilidade | Formularios devem exibir mensagens de erro compreensiveis. |
| RNF-007 | Compatibilidade | A aplicacao deve funcionar em navegadores modernos. |
| RNF-008 | Responsividade | A interface deve ser utilizavel em desktop, tablet e celular. |
| RNF-009 | Performance | Listagens principais devem usar paginacao ou filtros para evitar carregamento excessivo. |
| RNF-010 | Manutenibilidade | O codigo deve seguir padroes de organizacao, componentizacao e separacao de responsabilidades. |
| RNF-011 | Manutenibilidade | Regras de negocio devem ficar concentradas em services ou camadas equivalentes. |
| RNF-012 | Confiabilidade | Operacoes importantes devem validar dados antes de persistir no banco. |
| RNF-013 | Confiabilidade | O sistema deve tratar erros de API de forma padronizada. |
| RNF-014 | Testabilidade | Funcionalidades essenciais devem possuir testes automatizados quando viavel. |
| RNF-015 | Portabilidade | O ambiente deve poder ser executado com Docker Compose. |
| RNF-016 | Documentacao | O projeto deve manter README, requisitos, DER, regras de negocio e diagramas atualizados. |
| RNF-017 | Auditoria | Alteracoes relevantes devem registrar datas de criacao e atualizacao. |
| RNF-018 | Integridade | Relacionamentos no banco devem usar chaves estrangeiras e restricoes coerentes. |

## Requisitos Prioritarios Para o MVP

Para a primeira entrega funcional, a prioridade deve ser:

- autenticacao;
- dashboard inicial;
- CRUD de alunos;
- CRUD de planos;
- matricula de aluno em plano;
- registro basico de pagamento;
- CRUD de treinos;
- vinculo de treino com aluno;
- validacoes principais;
- integracao frontend, API e banco.

## Relacao Com a Rubrica

Este documento atende diretamente aos itens de requisitos funcionais e nao funcionais da disciplina de Engenharia e Analise de Projetos de Software. Ele tambem serve de base para:

- backlog no Jira;
- criterios de aceite;
- DER;
- diagramas de caso de uso;
- diagramas de atividade;
- diagramas de sequencia;
- implementacao do CRUD completo integrado.
