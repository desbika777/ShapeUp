# Regras de Negocio - Shape

## Objetivo

Este documento descreve regras de negocio iniciais do Shape. Elas devem orientar validacoes, services, banco de dados, testes e apresentacao dos fluxos principais.

## Usuarios, Perfis e Acesso

| Codigo | Regra |
| --- | --- |
| RN-001 | Todo usuario deve possuir nome, email, CPF e senha cadastrados. |
| RN-002 | O email de usuario deve ser unico dentro do sistema. |
| RN-003 | O CPF de usuario deve ser unico dentro do sistema. |
| RN-004 | Senhas nao podem ser armazenadas em texto puro. |
| RN-005 | Um usuario pode possuir um ou mais perfis de acesso. |
| RN-006 | Perfis de acesso devem limitar as funcionalidades disponiveis para cada usuario. |
| RN-007 | Usuarios nao autenticados nao podem acessar telas internas do sistema. |
| RN-008 | Tokens de recuperacao de senha devem possuir prazo de expiracao e nao podem ser reutilizados apos uso. |

## Academia

| Codigo | Regra |
| --- | --- |
| RN-009 | Dados operacionais devem estar vinculados a uma academia. |
| RN-010 | Uma academia inativa nao deve permitir novas matriculas. |
| RN-011 | Usuarios devem visualizar apenas dados relacionados a sua academia, exceto perfis administrativos globais se existirem. |

## Alunos

| Codigo | Regra |
| --- | --- |
| RN-012 | Todo aluno deve possuir nome, email, CPF, telefone e data de nascimento. |
| RN-013 | O CPF do aluno deve ser unico dentro da academia. |
| RN-014 | O email do aluno deve ser unico dentro da academia. |
| RN-015 | Um aluno inativo nao deve receber nova matricula sem antes ser reativado. |
| RN-016 | A exclusao fisica de aluno deve ser evitada quando houver historico financeiro, treinos ou avaliacoes; nesses casos, deve-se preferir inativacao. |

## Professores e Funcionarios

| Codigo | Regra |
| --- | --- |
| RN-017 | Professores e funcionarios devem estar vinculados a uma academia. |
| RN-018 | Um professor inativo nao deve ser vinculado a novos treinos, aulas ou avaliacoes. |
| RN-019 | Treinos e avaliacoes podem registrar o professor responsavel para rastreabilidade. |

## Planos e Matriculas

| Codigo | Regra |
| --- | --- |
| RN-020 | Todo plano deve possuir nome, descricao, valor, duracao e status. |
| RN-021 | Planos inativos nao devem ser usados em novas matriculas. |
| RN-022 | Toda matricula deve vincular um aluno a um plano. |
| RN-023 | Um aluno pode possuir apenas uma matricula principal ativa por vez. |
| RN-024 | A data final da matricula deve respeitar a duracao do plano contratado. |
| RN-025 | Matriculas vencidas devem ser identificadas pelo sistema. |
| RN-026 | Cancelamentos de matricula devem registrar data e motivo. |

## Pagamentos

| Codigo | Regra |
| --- | --- |
| RN-027 | Todo pagamento deve estar vinculado a uma matricula. |
| RN-028 | Pagamentos devem possuir valor, data de vencimento, status e forma de pagamento quando aplicavel. |
| RN-029 | Um pagamento nao pode ser marcado como pago sem data de pagamento. |
| RN-030 | Pagamentos vencidos e nao pagos devem ser considerados pendentes ou atrasados. |
| RN-031 | O valor pago nao deve ser negativo. |
| RN-032 | Cancelamentos de pagamento devem preservar historico para conferencia. |

## Treinos e Exercicios

| Codigo | Regra |
| --- | --- |
| RN-033 | Todo treino deve estar vinculado a um aluno. |
| RN-034 | Treinos podem ser vinculados a um professor responsavel. |
| RN-035 | Um treino deve possuir objetivo, nivel, data inicial e status. |
| RN-036 | Exercicios vinculados ao treino devem registrar ordem de execucao. |
| RN-037 | Exercicios de treino podem registrar series, repeticoes, carga, tempo de descanso e observacoes. |
| RN-038 | Um exercicio pode estar vinculado a um ou mais grupos musculares. |
| RN-039 | Exercicios inativos nao devem ser adicionados a novos treinos. |

## Avaliacoes Fisicas e Medidas

| Codigo | Regra |
| --- | --- |
| RN-040 | Toda avaliacao fisica deve estar vinculada a um aluno. |
| RN-041 | Avaliacoes fisicas devem registrar data e responsavel quando aplicavel. |
| RN-042 | Medidas corporais devem estar vinculadas a uma avaliacao fisica. |
| RN-043 | Medidas corporais nao devem aceitar valores negativos. |
| RN-044 | O historico de avaliacoes deve ser preservado para acompanhamento da evolucao do aluno. |

## Frequencia, Aulas e Agenda

| Codigo | Regra |
| --- | --- |
| RN-045 | Registros de frequencia devem estar vinculados a alunos. |
| RN-046 | Uma presenca deve possuir data e horario de registro. |
| RN-047 | Aulas coletivas devem possuir professor responsavel quando necessario. |
| RN-048 | Uma turma ou horario de aula deve possuir capacidade maxima quando houver controle de vagas. |
| RN-049 | Inscricoes em aulas nao devem ultrapassar a capacidade definida. |
| RN-050 | Alunos inativos nao devem ser inscritos em novas aulas. |

## Equipamentos e Manutencoes

| Codigo | Regra |
| --- | --- |
| RN-051 | Todo equipamento deve estar vinculado a uma academia. |
| RN-052 | Equipamentos devem possuir status, como ativo, em manutencao ou inativo. |
| RN-053 | Uma manutencao deve estar vinculada a um equipamento. |
| RN-054 | Equipamentos em manutencao nao devem aparecer como disponiveis para uso. |
| RN-055 | Historico de manutencoes deve ser preservado. |

## Dashboard e Indicadores

| Codigo | Regra |
| --- | --- |
| RN-056 | Indicadores do dashboard devem considerar apenas dados da academia do usuario autenticado. |
| RN-057 | Alunos ativos devem ser calculados a partir do status do aluno e/ou matricula ativa. |
| RN-058 | Receitas devem considerar pagamentos marcados como pagos. |
| RN-059 | Pendencias financeiras devem considerar pagamentos vencidos ainda nao pagos. |
| RN-060 | Indicadores devem ser atualizados com base nos dados persistidos no banco. |

## Validacoes Gerais

| Codigo | Regra |
| --- | --- |
| RN-061 | Campos obrigatorios devem ser validados no frontend e no backend. |
| RN-062 | Datas finais nao devem ser anteriores a datas iniciais. |
| RN-063 | Valores monetarios nao devem ser negativos. |
| RN-064 | Listagens devem respeitar filtros e paginacao quando houver muitos registros. |
| RN-065 | Respostas de erro devem ser padronizadas e compreensiveis. |

## Observacao

As regras podem evoluir durante o desenvolvimento. Quando uma regra for alterada, os requisitos, o DER, os testes e o backlog devem ser revisados para manter consistencia.
