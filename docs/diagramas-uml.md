# Diagramas UML da Rubrica - Shape

## Objetivo

Este documento reune os diagramas exigidos pela rubrica: 2 casos de uso, 2 atividades e 2 sequencias. Todos representam funcionalidades reais do Shape e podem ser usados diretamente na apresentacao.

## Caso de Uso 1 - Gestao Principal da Academia

```mermaid
flowchart LR
    gestor["Ator: Gestor da academia"]
    entrar["Entrar no sistema"]
    painel["Visualizar painel de indicadores"]
    planos["Gerenciar planos"]
    alunos["Gerenciar alunos"]
    treinos["Gerenciar treinos"]
    perfil["Atualizar perfil"]

    gestor --> entrar
    gestor --> painel
    gestor --> planos
    gestor --> alunos
    gestor --> treinos
    gestor --> perfil
```

Leitura para apresentacao:
O gestor e o ator principal do MVP. Ele acessa a plataforma, acompanha indicadores e executa os CRUDs principais integrados com API e banco.

## Caso de Uso 2 - Operacao Completa da Academia

```mermaid
flowchart LR
    recepcao["Ator: Recepcao"]
    professor["Ator: Professor"]
    financeiro["Ator: Financeiro"]

    matricula["Registrar matricula"]
    pagamento["Registrar pagamento"]
    avaliacao["Registrar avaliacao fisica"]
    treino["Prescrever treino"]
    aula["Controlar aulas coletivas"]
    frequencia["Registrar frequencia"]

    recepcao --> matricula
    recepcao --> frequencia
    financeiro --> pagamento
    professor --> avaliacao
    professor --> treino
    professor --> aula
```

Leitura para apresentacao:
Mesmo que nem todos os modulos estejam na interface final do MVP, eles aparecem na modelagem com 27 tabelas e sustentam a evolucao do produto para uma academia completa.

## Atividade 1 - Cadastro de Aluno Com Plano

```mermaid
flowchart TD
    inicio([Inicio])
    abrir["Gestor abre /alunos/novo"]
    preencher["Preenche nome, e-mail, CPF, telefone, nascimento, objetivo e plano"]
    validar_front["Frontend valida campos com Zod"]
    erro_front{"Dados validos?"}
    enviar["Frontend envia POST /api/alunos"]
    validar_api["Backend valida CPF, e-mail, plano e duplicidade"]
    erro_api{"Regra aprovada?"}
    salvar["Repository salva aluno no MySQL via Prisma"]
    atualizar["Frontend atualiza cache e volta para /alunos"]
    fim([Fim])

    inicio --> abrir --> preencher --> validar_front --> erro_front
    erro_front -- "Nao" --> preencher
    erro_front -- "Sim" --> enviar --> validar_api --> erro_api
    erro_api -- "Nao" --> preencher
    erro_api -- "Sim" --> salvar --> atualizar --> fim
```

## Atividade 2 - Criacao de Treino Para Aluno

```mermaid
flowchart TD
    inicio([Inicio])
    abrir["Gestor abre /treinos/novo"]
    selecionar["Seleciona aluno e nivel do treino"]
    preencher["Preenche titulo, objetivo, datas e observacoes"]
    validar_front["Frontend valida formulario"]
    datas{"Data final >= data inicial?"}
    enviar["Frontend envia POST /api/treinos"]
    validar_api["Backend confirma aluno e regra de periodo"]
    salvar["Prisma grava treino vinculado ao aluno"]
    painel["Dashboard passa a refletir novo treino"]
    fim([Fim])

    inicio --> abrir --> selecionar --> preencher --> validar_front --> datas
    datas -- "Nao" --> preencher
    datas -- "Sim" --> enviar --> validar_api --> salvar --> painel --> fim
```

## Sequencia 1 - Entrar e Visualizar Painel

```mermaid
sequenceDiagram
    actor Gestor
    participant Frontend
    participant API
    participant AuthService
    participant Banco

    Gestor->>Frontend: Acessa /entrar e envia e-mail/senha
    Frontend->>API: POST /api/autenticacao/entrar
    API->>AuthService: Validar credenciais
    AuthService->>Banco: Buscar usuario por e-mail
    Banco-->>AuthService: Usuario com hash da senha
    AuthService-->>API: Token JWT e usuario
    API-->>Frontend: Resposta autenticada
    Frontend->>Frontend: Salva token e navega para /painel
    Frontend->>API: GET /api/painel/indicadores
    API->>Banco: Consultar alunos, planos e treinos
    Banco-->>API: Indicadores consolidados
    API-->>Frontend: Dados do dashboard
    Frontend-->>Gestor: Exibe cards e graficos
```

## Sequencia 2 - Cadastro de Aluno Com Vinculo a Plano

```mermaid
sequenceDiagram
    actor Gestor
    participant Frontend
    participant API
    participant StudentService
    participant PlanRepository
    participant StudentRepository
    participant Banco

    Gestor->>Frontend: Preenche formulario em /alunos/novo
    Frontend->>API: POST /api/alunos
    API->>StudentService: Validar e criar aluno
    StudentService->>PlanRepository: Verificar se plano existe
    PlanRepository->>Banco: Buscar plano por id e dono
    Banco-->>PlanRepository: Plano encontrado
    StudentService->>StudentRepository: Verificar CPF/e-mail duplicados
    StudentRepository->>Banco: Consultar aluno por CPF/e-mail
    Banco-->>StudentRepository: Sem duplicidade
    StudentService->>StudentRepository: Criar aluno
    StudentRepository->>Banco: INSERT em alunos
    Banco-->>StudentRepository: Aluno criado
    StudentRepository-->>StudentService: Dados do aluno
    StudentService-->>API: Resultado
    API-->>Frontend: 201 Created
    Frontend-->>Gestor: Lista atualizada em /alunos
```
