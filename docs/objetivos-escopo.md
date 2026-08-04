# Objetivos e Escopo - Shape

## Objetivo Geral

Desenvolver uma plataforma web para gestao completa de academias, centralizando processos administrativos, financeiros e operacionais em um unico sistema, com foco em organizacao, controle de informacoes, apoio aos professores e melhoria da tomada de decisao pelos gestores.

## Objetivos Especificos

- Permitir o cadastro e gerenciamento de usuarios do sistema.
- Controlar perfis de acesso, como administrador, recepcionista e professor.
- Gerenciar alunos, seus dados cadastrais, status e historico dentro da academia.
- Gerenciar professores e vincular suas responsabilidades a treinos, aulas e acompanhamentos.
- Cadastrar planos oferecidos pela academia.
- Controlar matriculas de alunos em planos.
- Registrar pagamentos e acompanhar situacoes financeiras basicas.
- Criar e organizar treinos para alunos.
- Cadastrar exercicios, grupos musculares e orientacoes de execucao.
- Registrar avaliacoes fisicas e medidas corporais.
- Controlar frequencia de alunos.
- Gerenciar aulas coletivas e agendamentos.
- Controlar equipamentos e registros de manutencao.
- Disponibilizar um dashboard com indicadores relevantes para a gestao.
- Aplicar validacoes e regras de negocio para reduzir inconsistencias.
- Garantir uma interface responsiva e utilizavel em diferentes dispositivos.
- Documentar requisitos, regras de negocio, arquitetura e diagramas do sistema.
- Utilizar o Jira para organizar o progresso do projeto e registrar as entregas parciais.

## Publico-Alvo

O Shape e voltado para academias completas que precisam organizar processos internos e melhorar o controle sobre alunos, equipe, planos, treinos, pagamentos e indicadores.

Usuarios envolvidos:

- administradores e gestores;
- recepcionistas;
- professores e instrutores;
- equipe financeira;
- alunos.

## Personas

### Persona 1 - Gestor da Academia

Perfil:
Responsavel pela administracao geral da academia, acompanhamento de alunos ativos, planos vendidos, pagamentos, desempenho financeiro e produtividade da equipe.

Necessidades:

- visualizar indicadores do negocio;
- acompanhar alunos ativos e inativos;
- identificar pagamentos pendentes;
- controlar planos e matriculas;
- tomar decisoes com base em dados confiaveis.

Como o Shape ajuda:
Centraliza informacoes operacionais e financeiras, reduzindo dependencia de planilhas e facilitando a analise do desempenho da academia.

### Persona 2 - Recepcionista

Perfil:
Profissional que atende alunos, realiza cadastros, acompanha matriculas, confirma pagamentos e ajuda na organizacao da rotina administrativa.

Necessidades:

- cadastrar alunos rapidamente;
- consultar dados de alunos;
- vincular alunos a planos;
- verificar situacao de matricula e pagamento;
- manter informacoes atualizadas.

Como o Shape ajuda:
Oferece uma interface organizada para rotinas frequentes, diminuindo retrabalho e erros de registro.

### Persona 3 - Professor ou Instrutor

Perfil:
Profissional responsavel por orientar alunos, criar treinos, acompanhar evolucao fisica e registrar avaliacoes.

Necessidades:

- consultar alunos sob sua responsabilidade;
- criar e atualizar treinos;
- acompanhar avaliacoes fisicas;
- registrar observacoes sobre evolucao;
- organizar exercicios por objetivo e nivel.

Como o Shape ajuda:
Permite acompanhar o historico do aluno e manter treinos mais organizados, personalizados e rastreaveis.

### Persona 4 - Aluno

Perfil:
Cliente da academia que deseja acompanhar seus treinos, evolucao, frequencia e informacoes relacionadas a sua matricula.

Necessidades:

- consultar treino atual;
- acompanhar plano contratado;
- visualizar progresso fisico;
- receber orientacoes claras;
- ter uma experiencia mais organizada com a academia.

Como o Shape ajuda:
Melhora a transparencia das informacoes e facilita o acompanhamento individual do aluno.

## Escopo Inicial

O escopo inicial contempla os modulos necessarios para demonstrar o funcionamento principal do sistema e atender aos criterios da rubrica.

Incluido no escopo:

- autenticacao de usuarios;
- controle basico de perfis;
- dashboard inicial;
- cadastro de alunos;
- cadastro de professores;
- cadastro de planos;
- matricula de alunos em planos;
- registro basico de pagamentos;
- cadastro de treinos;
- cadastro de exercicios;
- vinculacao de treinos a alunos;
- registro de avaliacoes fisicas;
- registro de medidas corporais;
- controle de frequencia;
- cadastro de aulas coletivas;
- agendamento de aulas;
- cadastro de equipamentos;
- registro de manutencoes;
- listagens com filtros e paginacao quando necessario;
- validacoes de formularios;
- integracao entre frontend, API e banco de dados;
- documentacao tecnica e de gestao do projeto.

## Fora de Escopo Inicial

Algumas funcionalidades sao relevantes para uma plataforma real, mas nao serao prioridade no primeiro ciclo para manter o projeto viavel.

Fora do escopo inicial:

- aplicativo mobile nativo;
- integracao real com gateways de pagamento;
- emissao fiscal;
- catraca fisica ou controle biometrico real;
- chat em tempo real;
- inteligencia artificial para montagem automatica de treinos;
- integracao com wearables ou relogios inteligentes;
- modulo avancado de contabilidade;
- portal publico de vendas;
- sistema multiacademia com franquias complexas;
- envio real de SMS ou WhatsApp;
- assinatura digital de contratos;
- relatorios gerenciais avancados com BI completo.

Esses itens podem ser citados como evolucoes futuras.

## Regras de Negocio Iniciais

- Todo aluno deve estar vinculado a uma academia ou usuario proprietario no sistema.
- Um aluno pode ter apenas uma matricula ativa principal por vez.
- Uma matricula deve estar vinculada a um plano existente.
- Um pagamento deve estar relacionado a uma matricula ou aluno.
- Treinos devem estar vinculados a alunos e podem ser criados por professores.
- Avaliacoes fisicas devem registrar data, aluno e responsavel.
- Equipamentos podem possuir registros de manutencao.
- Usuarios devem acessar apenas informacoes permitidas pelo seu perfil.
- Campos obrigatorios devem ser validados antes do registro no banco.
- Dados sensiveis, como senha, nao devem ser armazenados em texto puro.

## Criterios de Sucesso

O projeto sera considerado bem encaminhado quando:

- houver documentacao clara do problema, objetivos e escopo;
- o DER tiver pelo menos 20 tabelas coerentes com o dominio;
- existir pelo menos um fluxo completo funcionando de ponta a ponta;
- o sistema possuir arquitetura organizada e padronizada;
- as regras de negocio principais forem respeitadas;
- houver evidencias de planejamento e progresso no Jira;
- a dupla conseguir explicar o produto, o processo e as decisoes tecnicas.

## MVP Prioritario

O primeiro MVP deve demonstrar o fluxo principal de uma academia:

1. Usuario realiza login.
2. Usuario acessa o dashboard.
3. Usuario cadastra um plano.
4. Usuario cadastra um aluno.
5. Usuario matricula o aluno em um plano.
6. Usuario registra um pagamento basico.
7. Usuario cria um treino.
8. Usuario vincula o treino ao aluno.
9. Dashboard exibe indicadores iniciais.

Esse MVP atende diretamente a necessidade de demonstrar CRUD, regras de negocio, relacionamento entre tabelas, integracao frontend/API/banco e base para os diagramas UML.
