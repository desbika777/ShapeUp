# Backlog Inicial Para Jira - Shape

## Objetivo

Este documento organiza uma proposta inicial de backlog para ser cadastrada no Jira. Ele foi criado com base na rubrica, nos requisitos, nas regras de negocio e na modelagem inicial do Shape.

## Fluxo Sugerido No Jira

Status:

- A fazer;
- Em andamento;
- Em revisao;
- Bloqueado;
- Concluido.

Tipos de item:

- Epic;
- Story;
- Task;
- Bug.

## Versoes Planejadas

### Versao 0.1 - Fundacao e Documentacao

Objetivo:
Preparar o projeto, alinhar escopo e validar a base tecnica.

Entregas:

- contextualizacao do problema;
- objetivos e escopo;
- Cynefin e abordagem de gestao;
- requisitos funcionais e nao funcionais;
- regras de negocio;
- preparacao tecnica validada;
- backlog inicial.

### Versao 0.2 - Modelagem e Banco

Objetivo:
Definir e implementar a nova modelagem de dados.

Entregas:

- DER com 20 ou mais tabelas;
- dicionario de dados;
- schema Prisma revisado;
- migrations;
- seed inicial;
- validacao no banco.

### Versao 0.3 - MVP Operacional

Objetivo:
Entregar o fluxo principal da academia.

Entregas:

- login;
- dashboard inicial;
- CRUD de planos;
- CRUD de alunos;
- matricula;
- pagamento basico;
- treino vinculado ao aluno.

### Versao 0.4 - Expansao Funcional

Objetivo:
Ampliar o sistema para parecer uma academia completa.

Entregas:

- professores;
- exercicios;
- grupos musculares;
- avaliacoes fisicas;
- medidas corporais;
- frequencia;
- aulas e agenda;
- equipamentos e manutencoes.

### Versao 1.0 - Entrega Final

Objetivo:
Consolidar produto, documentacao, testes e apresentacao.

Entregas:

- diagramas UML;
- README final;
- evidencias do Jira;
- testes principais;
- ambiente validado;
- apresentacao preparada.

## Epicos

| Codigo | Epic | Objetivo |
| --- | --- | --- |
| EP-001 | Fundacao e Documentacao | Organizar contexto, escopo, abordagem e requisitos do projeto. |
| EP-002 | Modelagem de Dados | Redesenhar o banco com 20+ tabelas coerentes com uma academia completa. |
| EP-003 | Autenticacao e Usuarios | Controlar acesso, seguranca e perfis. |
| EP-004 | Gestao de Alunos | Gerenciar alunos e seu historico. |
| EP-005 | Planos e Matriculas | Controlar planos vendidos e matriculas dos alunos. |
| EP-006 | Financeiro | Registrar pagamentos e indicadores financeiros basicos. |
| EP-007 | Treinos e Exercicios | Gerenciar treinos, exercicios e grupos musculares. |
| EP-008 | Avaliacoes Fisicas | Registrar avaliacoes e medidas corporais. |
| EP-009 | Agenda e Frequencia | Controlar aulas coletivas, inscricoes e presencas. |
| EP-010 | Equipamentos e Manutencoes | Controlar equipamentos da academia. |
| EP-011 | Dashboard e Relatorios | Exibir indicadores para gestao. |
| EP-012 | Qualidade e Entrega | Garantir testes, build, README, diagramas e apresentacao. |

## User Stories Prioritarias

### EP-001 - Fundacao e Documentacao

#### US-001 - Contextualizar o problema

Como integrante da equipe, quero documentar o problema que o Shape resolve, para justificar a proposta do projeto.

Criterios de aceite:

- Deve existir documento de contextualizacao.
- O documento deve apresentar problema, publico-alvo, dores e justificativa.
- O texto deve estar alinhado a proposta de academia completa.

#### US-002 - Definir objetivos e escopo

Como integrante da equipe, quero definir objetivos, escopo e fora de escopo, para orientar o desenvolvimento.

Criterios de aceite:

- Deve existir objetivo geral.
- Devem existir objetivos especificos.
- Deve existir escopo inicial.
- Deve existir lista de itens fora de escopo.

#### US-003 - Registrar Cynefin e abordagem

Como integrante da equipe, quero classificar o projeto com Cynefin, para justificar a abordagem de gestao.

Criterios de aceite:

- O projeto deve ser classificado em um dominio do Cynefin.
- A classificacao deve ser justificada.
- A abordagem de gestao deve ser definida.

### EP-002 - Modelagem de Dados

#### US-004 - Criar DER com 20+ tabelas

Como integrante da equipe, quero criar o DER do Shape, para representar o banco de dados do sistema.

Criterios de aceite:

- O DER deve possuir pelo menos 20 tabelas.
- As tabelas devem representar entidades reais de uma academia.
- Os principais relacionamentos devem estar documentados.
- A modelagem deve ser coerente com requisitos e regras de negocio.

#### US-005 - Criar dicionario de dados

Como integrante da equipe, quero documentar a finalidade das tabelas, para facilitar manutencao e apresentacao.

Criterios de aceite:

- Cada tabela principal deve ter finalidade descrita.
- Os campos principais devem estar documentados.
- O documento deve diferenciar MVP e expansao.

#### US-006 - Atualizar Prisma Schema

Como desenvolvedor, quero atualizar o schema Prisma, para implementar a nova modelagem no banco.

Criterios de aceite:

- O schema deve conter as entidades priorizadas.
- Relacionamentos devem usar chaves estrangeiras.
- Enums devem representar status e tipos relevantes.
- `prisma generate` deve executar sem erro.

### EP-003 - Autenticacao e Usuarios

#### US-007 - Login de usuario

Como usuario, quero realizar login com email e senha, para acessar o sistema.

Criterios de aceite:

- O sistema deve validar campos obrigatorios.
- O sistema deve rejeitar credenciais invalidas.
- O sistema deve retornar token para credenciais validas.
- O frontend deve armazenar a sessao conforme comportamento definido.

#### US-008 - Proteger rotas internas

Como gestor, quero que apenas usuarios autenticados acessem telas internas, para proteger dados da academia.

Criterios de aceite:

- Rotas internas devem exigir token valido.
- Usuarios sem token devem ser redirecionados para login.
- A API deve bloquear requisicoes nao autenticadas.

#### US-009 - Controlar perfis de acesso

Como administrador, quero associar perfis aos usuarios, para limitar funcionalidades por responsabilidade.

Criterios de aceite:

- Deve existir cadastro ou seed de perfis.
- Usuario pode receber um ou mais perfis.
- Funcionalidades podem verificar perfil quando necessario.

### EP-004 - Gestao de Alunos

#### US-010 - Cadastrar aluno

Como recepcionista, quero cadastrar aluno, para manter os dados do cliente no sistema.

Criterios de aceite:

- Nome, email, CPF, telefone e data de nascimento devem ser obrigatorios.
- O sistema deve impedir CPF duplicado na mesma academia.
- O aluno cadastrado deve aparecer na listagem.
- O cadastro deve persistir no banco.

#### US-011 - Listar e consultar alunos

Como recepcionista, quero listar e consultar alunos, para localizar informacoes rapidamente.

Criterios de aceite:

- A tela deve listar alunos cadastrados.
- A listagem deve permitir paginacao ou filtro.
- Deve ser possivel abrir detalhes de um aluno.

#### US-012 - Editar e inativar aluno

Como recepcionista, quero editar e inativar alunos, para manter a base atualizada.

Criterios de aceite:

- Deve ser possivel alterar dados cadastrais.
- Deve ser possivel inativar aluno.
- Aluno inativo nao deve ser tratado como ativo em indicadores.

### EP-005 - Planos e Matriculas

#### US-013 - Gerenciar planos

Como gestor, quero cadastrar e editar planos, para controlar ofertas da academia.

Criterios de aceite:

- Plano deve possuir nome, descricao, valor, duracao e status.
- Planos ativos devem aparecer para matricula.
- Planos inativos nao devem ser usados em novas matriculas.

#### US-014 - Matricular aluno em plano

Como recepcionista, quero matricular aluno em plano, para registrar a contratacao.

Criterios de aceite:

- A matricula deve vincular aluno e plano.
- A data final deve considerar a duracao do plano.
- O sistema deve impedir mais de uma matricula principal ativa para o mesmo aluno.
- A matricula deve persistir no banco.

### EP-006 - Financeiro

#### US-015 - Registrar pagamento

Como financeiro, quero registrar pagamento de matricula, para acompanhar a situacao financeira do aluno.

Criterios de aceite:

- Pagamento deve estar vinculado a uma matricula.
- Deve possuir valor, vencimento e status.
- Pagamento pago deve possuir data de pagamento.
- O dashboard deve considerar pagamentos pagos em indicadores.

#### US-016 - Consultar pagamentos pendentes

Como gestor, quero consultar pagamentos pendentes, para acompanhar inadimplencia.

Criterios de aceite:

- Deve ser possivel listar pagamentos por status.
- Pagamentos vencidos e nao pagos devem ser identificaveis.

### EP-007 - Treinos e Exercicios

#### US-017 - Criar treino para aluno

Como professor, quero criar treino para aluno, para orientar sua rotina de exercicios.

Criterios de aceite:

- Treino deve estar vinculado a um aluno.
- Treino deve possuir objetivo, nivel e periodo.
- Treino deve ser salvo no banco.

#### US-018 - Cadastrar exercicios

Como professor, quero cadastrar exercicios, para reutiliza-los em diferentes treinos.

Criterios de aceite:

- Exercicio deve possuir nome, descricao e status.
- Exercicio pode ser vinculado a grupo muscular.
- Exercicios inativos nao devem ser adicionados a novos treinos.

#### US-019 - Montar treino com exercicios

Como professor, quero adicionar exercicios ao treino, para detalhar a rotina do aluno.

Criterios de aceite:

- Deve ser possivel definir ordem dos exercicios.
- Deve ser possivel informar series, repeticoes, carga e descanso.
- O treino deve exibir os exercicios vinculados.

### EP-008 - Avaliacoes Fisicas

#### US-020 - Registrar avaliacao fisica

Como professor, quero registrar avaliacao fisica, para acompanhar a evolucao do aluno.

Criterios de aceite:

- Avaliacao deve estar vinculada a aluno.
- Deve registrar data e responsavel.
- Medidas nao podem aceitar valores negativos.

### EP-009 - Agenda e Frequencia

#### US-021 - Registrar frequencia

Como recepcionista, quero registrar frequencia de aluno, para acompanhar comparecimento.

Criterios de aceite:

- Frequencia deve estar vinculada a aluno.
- Deve registrar data e horario.
- Aluno inativo nao deve gerar nova frequencia.

#### US-022 - Gerenciar aulas coletivas

Como gestor, quero cadastrar aulas coletivas e horarios, para organizar a agenda da academia.

Criterios de aceite:

- Deve existir tipo de aula.
- Deve existir horario de aula.
- Deve ser possivel definir professor e capacidade.

### EP-010 - Equipamentos e Manutencoes

#### US-023 - Gerenciar equipamentos

Como gestor, quero cadastrar equipamentos, para controlar estrutura da academia.

Criterios de aceite:

- Equipamento deve possuir nome, codigo e status.
- Equipamento pode ser marcado como ativo, em manutencao ou inativo.

#### US-024 - Registrar manutencao

Como gestor, quero registrar manutencao de equipamento, para manter historico operacional.

Criterios de aceite:

- Manutencao deve estar vinculada a equipamento.
- Deve registrar descricao, data e status.
- Historico de manutencoes deve ser preservado.

### EP-011 - Dashboard e Relatorios

#### US-025 - Exibir dashboard inicial

Como gestor, quero visualizar indicadores principais, para acompanhar a academia.

Criterios de aceite:

- Deve mostrar total de alunos ativos.
- Deve mostrar total de planos ativos.
- Deve mostrar novos alunos do mes.
- Deve mostrar quantidade de treinos.
- Dados devem vir da API e banco.

### EP-012 - Qualidade e Entrega

#### US-026 - Rodar validacoes automaticas

Como equipe, quero rodar lint, build e testes, para garantir que a base esta saudavel.

Criterios de aceite:

- `npm run lint` deve passar.
- `npm run build` deve passar.
- `npm run test` deve passar.

#### US-027 - Criar diagramas UML

Como equipe, quero criar diagramas UML, para atender a rubrica e explicar o sistema.

Criterios de aceite:

- Devem existir 2 diagramas de caso de uso.
- Devem existir 2 diagramas de atividade.
- Devem existir 2 diagramas de sequencia.
- Diagramas devem representar funcionalidades reais.

#### US-028 - Preparar apresentacao final

Como equipe, quero preparar roteiro de apresentacao, para demonstrar produto, processo e arquitetura.

Criterios de aceite:

- A apresentacao deve cobrir problema, solucao, requisitos, DER, arquitetura, Jira e sistema funcionando.
- Links de GitHub e site devem estar disponiveis quando aplicavel.
- Evidencias do Jira devem estar organizadas.

## Tasks Tecnicas Iniciais

| Codigo | Task | Relacionado |
| --- | --- | --- |
| TASK-001 | Abrir Docker Desktop e validar Docker daemon. | Ambiente |
| TASK-002 | Configurar arquivos `.env`. | Ambiente |
| TASK-003 | Subir MySQL com Docker Compose. | Ambiente |
| TASK-004 | Rodar migrations existentes. | Banco |
| TASK-005 | Revisar novo schema Prisma com base no DER. | Modelagem |
| TASK-006 | Criar migration da nova modelagem. | Banco |
| TASK-007 | Atualizar seed inicial. | Banco |
| TASK-008 | Atualizar tipos compartilhados. | Shared |
| TASK-009 | Revisar endpoints impactados pela nova modelagem. | Backend |
| TASK-010 | Revisar telas impactadas pela nova modelagem. | Frontend |

## Observacao

Este backlog e inicial. Ao criar o quadro no Jira, os itens podem ser quebrados em tarefas menores conforme a dupla avancar no desenvolvimento.
