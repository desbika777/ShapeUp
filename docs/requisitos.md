# Requisitos - Shape Up

## Objetivo

Este documento registra os requisitos funcionais e nao funcionais do Shape Up, servindo como base para backlog, DER, implementacao, testes e apresentacao da rubrica.

## Escala de Prioridade

- MVP: essencial para a primeira versao demonstravel.
- P1: importante para completar a proposta de academia completa.
- P2: melhoria ou evolucao apos o MVP.

## Requisitos Funcionais

### Autenticacao e Gestores

| Codigo | Prioridade | Requisito |
| --- | --- | --- |
| RF-001 | MVP | O sistema deve permitir cadastro de gestores autorizados. |
| RF-002 | MVP | O sistema deve permitir login com email e senha. |
| RF-003 | MVP | O sistema deve proteger rotas internas para gestores autenticados. |
| RF-004 | MVP | O sistema deve permitir recuperacao de senha por token. |
| RF-005 | P1 | O sistema deve permitir evoluir perfis de acesso para equipe ou alunos. |
| RF-006 | P1 | O sistema deve permitir controlar permissoes por perfil em versoes futuras, como recepcionista, professor, financeiro ou aluno. |

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
| RF-022 | P1 | O sistema deve permitir consultar matriculas ativas, vencidas e canceladas. |
| RF-023 | P1 | O sistema deve impedir que um aluno tenha mais de uma matricula principal ativa ao mesmo tempo. |
| RF-024 | P1 | O sistema deve permitir cancelar uma matricula registrando motivo e data. |

### Financeiro

| Codigo | Prioridade | Requisito |
| --- | --- | --- |
| RF-025 | P1 | O sistema deve permitir registrar pagamentos vinculados a matriculas. |
| RF-026 | P1 | O sistema deve permitir consultar pagamentos pagos, pendentes, vencidos e cancelados. |
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

### Imagens e Arquivos

| Codigo | Prioridade | Requisito |
| --- | --- | --- |
| RF-052 | MVP | O sistema deve permitir que administradores enviem imagens usando upload multipart. |
| RF-053 | MVP | O sistema deve validar imagens recebidas por extensao, MIME type, tamanho maximo e nome unico. |

### Aplicativo Mobile

| Codigo | Prioridade | Requisito |
| --- | --- | --- |
| RF-054 | MVP | O sistema deve possuir um cliente mobile executavel no Expo Go. |
| RF-055 | MVP | O app mobile deve permitir login, consulta de indicadores e operacao dos fluxos principais de planos, alunos e treinos pela API. |

## Requisitos Nao Funcionais

| Codigo | Categoria | Requisito |
| --- | --- | --- |
| RNF-001 | Seguranca | Senhas devem ser armazenadas usando hash seguro. |
| RNF-002 | Seguranca | Rotas protegidas devem exigir token JWT valido. |
| RNF-003 | Seguranca | Gestores devem acessar apenas dados relacionados a sua academia. |
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
| RNF-019 | Seguranca | Arquivos enviados devem aceitar apenas formatos de imagem permitidos e tamanho controlado. |
| RNF-020 | Compatibilidade | O cliente mobile deve permitir configurar a URL da API para execucao em dispositivo fisico pela rede local. |

## Requisitos Prioritarios Para o MVP

Para a primeira entrega funcional, a prioridade deve ser:

- autenticacao;
- dashboard inicial;
- CRUD de alunos;
- CRUD de planos;
- matricula de aluno em plano;
- CRUD de treinos;
- vinculo de treino com aluno;
- upload validado de imagens;
- cliente mobile Expo para demonstracao em dispositivo;
- validacoes principais;
- integracao frontend, API e banco.

## Status de Implementacao Para Entrega

| Grupo | Status | Requisitos | Evidencia |
| --- | --- | --- | --- |
| Autenticacao e gestores | Implementado | RF-001, RF-002, RF-003, RF-004, RF-005 | Cadastro, login, rotas protegidas, recuperacao de senha, criacao de gestor e testes |
| Controle de acesso | Implementado em base da rubrica | RF-006 | MVP focado em gestor ADMIN; acesso de aluno/equipe fica como evolucao futura documentada |
| Gestao da academia | Parcial/modelado | RF-007, RF-009 | Entidade `Academia` existe no DER/schema; dados operacionais ficam vinculados ao usuario proprietario no MVP |
| Gestao da academia | Planejado | RF-008 | Configuracao completa de academia fica como evolucao |
| Alunos | Implementado | RF-010, RF-011, RF-012, RF-013, RF-014 | CRUD de alunos com filtros, status, validacoes e testes |
| Historico do aluno | Parcial/modelado | RF-015 | DER contempla matriculas, treinos, avaliacoes e pagamentos; MVP entrega treinos e vinculo com plano |
| Professores e funcionarios | Planejado | RF-016, RF-017, RF-018 | Modelado no DER, sem tela/API final no MVP |
| Planos e matriculas | Implementado em base do MVP | RF-019, RF-020, RF-021 | CRUD de planos e vinculo aluno-plano funcionando |
| Matriculas formais | Parcial/modelado | RF-022, RF-023, RF-024 | Tabela `matriculas` existe no schema; fluxo completo fica para evolucao |
| Financeiro | Planejado/modelado | RF-025, RF-026, RF-027, RF-028 | Tabelas financeiras existem no DER/schema; telas/API ficam para evolucao |
| Treinos | Implementado | RF-029, RF-030 | CRUD de treinos vinculado a alunos, com validacao de periodo |
| Exercicios | Parcial/modelado | RF-031, RF-032, RF-033, RF-034 | DER contempla exercicios, grupos musculares e composicao do treino; MVP entrega treino resumido |
| Avaliacoes fisicas | Planejado/modelado | RF-035, RF-036, RF-037 | DER contempla avaliacoes e medidas corporais |
| Frequencia, aulas e agenda | Planejado/modelado | RF-038, RF-039, RF-040, RF-041, RF-042 | DER contempla frequencia, aulas e inscricoes |
| Equipamentos | Planejado/modelado | RF-043, RF-044, RF-045 | DER contempla equipamentos e manutencoes |
| Comunicacao | Planejado/modelado | RF-046, RF-047 | DER contempla notificacoes |
| Dashboard | Implementado | RF-048, RF-049 | Painel com indicadores, graficos e alunos recentes |
| Dashboard financeiro | Planejado | RF-050 | Evolucao apos MVP |
| Relatorios | Planejado | RF-051 | Evolucao apos MVP |
| Imagens | Implementado | RF-052, RF-053 | Multer, validacao de imagem, storage local, URL publica e E2E |
| Aplicativo mobile | Implementado em base tecnica | RF-054, RF-055 | Workspace Expo, login, painel, abas e CRUDs de planos/alunos/treinos pela API; falta print final no celular fisico |

| Categoria | Status | Requisitos | Evidencia |
| --- | --- | --- | --- |
| Seguranca | Implementado | RNF-001, RNF-002, RNF-003, RNF-004, RNF-019 | bcrypt, JWT, acesso administrativo do gestor, respostas sem senha e validacao de upload |
| Usabilidade | Implementado | RNF-005, RNF-006 | Formularios com validacao, mensagens, estados vazios e feedback por toast |
| Compatibilidade e responsividade | Parcial com base tecnica | RNF-007, RNF-008, RNF-020 | Web responsiva, Playwright, Expo Go validado em base tecnica e script LAN automatizado; falta print final no celular fisico |
| Performance | Implementado | RNF-009 | Listagens paginadas e filtros principais |
| Manutenibilidade | Implementado | RNF-010, RNF-011 | Camadas separadas, validadores em `shared`, services e repositories |
| Confiabilidade | Implementado | RNF-012, RNF-013 | Zod, AppError e error handler padronizado |
| Testabilidade | Implementado | RNF-014 | Vitest, Supertest, Testing Library, Playwright e lint mobile |
| Portabilidade | Implementado | RNF-015 | Docker Compose, Nginx e override Expo |
| Documentacao | Implementado | RNF-016 | README, roadmap, requisitos, DER, UML e evidencias |
| Auditoria e integridade | Implementado/modelado | RNF-017, RNF-018 | Campos de data e chaves estrangeiras no Prisma |

## Relacao Com a Rubrica

Este documento atende diretamente aos itens de requisitos funcionais e nao funcionais da disciplina de Engenharia e Analise de Projetos de Software. Ele tambem serve de base para:

- backlog no Jira;
- criterios de aceite;
- DER;
- diagramas de caso de uso;
- diagramas de atividade;
- diagramas de sequencia;
- implementacao do CRUD completo integrado.
