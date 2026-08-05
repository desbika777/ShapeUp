# Padrao de Nomenclatura PT-BR - Shape

## Objetivo

Este documento define como o projeto deve usar portugues e termos tecnicos. A meta e reduzir duvidas na leitura do projeto, mostrar autoria da dupla e manter o repositorio facil de explicar.

## Regra Principal

Tudo que representa o dominio da academia deve aparecer em PT-BR sempre que possivel.

Exemplos:

- aluno, alunos;
- plano, planos;
- treino, treinos;
- matricula, matriculas;
- pagamento, pagamentos;
- avaliacao fisica, avaliacoes_fisicas;
- frequencia, registros_frequencia;
- equipamento, equipamentos.

## Onde o PT-BR E Obrigatorio

| Area | Padrao |
| --- | --- |
| Documentacao | PT-BR |
| Comentarios explicativos | PT-BR |
| Tabelas fisicas do banco | PT-BR |
| Rotas do navegador | PT-BR |
| Endpoints da API | PT-BR |
| Nomes de paginas principais | PT-BR |
| Textos visiveis ao usuario | PT-BR |

## Onde o Ingles Pode Permanecer

Alguns termos podem continuar em ingles porque sao convencoes tecnicas:

- `frontend`, `backend`, `shared`;
- `node_modules`, `package.json`, `tsconfig`, `vite`, `eslint`;
- nomes de bibliotecas;
- scripts do npm;
- metodos tecnicos comuns como `login`, `register`, `build`, `test`, `request` e `response`.

Justificativa:
Alterar tudo de uma vez poderia gerar risco alto e pouco ganho. A leitura do repositorio precisa deixar claro que o produto foi pensado pela dupla e tambem segue convencoes reais de desenvolvimento. Quando um nome tecnico continuar em ingles, ele deve ter comentario em portugues ou estar explicado por contexto.

## Mudancas Ja Aplicadas

| Antes | Agora |
| --- | --- |
| `/login` | `/entrar` |
| `/register` | `/cadastro` |
| `/forgot-password` | `/recuperar-senha` |
| `/reset-password` | `/redefinir-senha` |
| `/profile` | `/perfil` |
| `/plans` | `/planos` |
| `/students` | `/alunos` |
| `/workouts` | `/treinos` |
| `/api/auth/login` | `/api/autenticacao/entrar` |
| `/api/plans` | `/api/planos` |
| `/api/students` | `/api/alunos` |
| `/api/workouts` | `/api/treinos` |
| `shapeup-platform` | `shape-platform` |
| `@shapeup/shared` | `@shape/shared` |
| Marca visual `ShapeUp` | Marca visual `Shape` |
| `admin@shapeup.com` | `admin@shape.com.br` |
| Senha seed `ShapeUp@123` | Senha seed `Shape@123` |
| `model Academy` | `model Academia` |
| `model User` | `model Usuario` |
| `model Plan` | `model Plano` |
| `model Student` | `model Aluno` |
| `model Workout` | `model Treino` |
| `PlanStatus`, `StudentStatus`, `WorkoutLevel` | `StatusPlano`, `StatusAluno`, `NivelTreino` |
| `ACTIVE`, `INACTIVE` | `ATIVO`, `INATIVO` |
| `BEGINNER`, `INTERMEDIATE`, `ADVANCED` | `INICIANTE`, `INTERMEDIARIO`, `AVANCADO` |
| `Plan`, `Student`, `Workout` | `Plano`, `Aluno`, `Treino` |
| `IPlanRepository`, `IStudentRepository`, `IWorkoutRepository` | `IRepositorioPlano`, `IRepositorioAluno`, `IRepositorioTreino` |
| `PrismaPlanRepository`, `PrismaStudentRepository`, `PrismaWorkoutRepository` | `RepositorioPrismaPlano`, `RepositorioPrismaAluno`, `RepositorioPrismaTreino` |
| `PlanService`, `StudentService`, `WorkoutService` | `ServicoPlano`, `ServicoAluno`, `ServicoTreino` |

## Arquivos de Pagina Traduzidos

| Area | Caminho atual |
| --- | --- |
| Autenticacao | `frontend/src/pages/autenticacao` |
| Painel | `frontend/src/pages/painel` |
| Perfil | `frontend/src/pages/perfil-page.tsx` |
| Planos | `frontend/src/pages/planos` |
| Alunos | `frontend/src/pages/alunos` |
| Treinos | `frontend/src/pages/treinos` |

## Proximos Candidatos a Revisao

Quando a base estiver estavel, podemos traduzir com mais calma:

- nomes de arquivos herdados, como `plan-service.ts` e `student-controller.ts`;
- nomes de alguns campos internos herdados, como `ownerId`, `createdAt` e `updatedAt`, caso a avaliacao peca uma traducao ainda mais profunda.

Essas alteracoes devem ser feitas em branches pequenas, com testes passando a cada etapa.

## Decisao da Apresentacao

Na apresentacao, a dupla pode explicar que a regra adotada foi: produto, banco fisico, rotas, endpoints, paginas, textos e comentarios em portugues; convencoes de framework e nomes tecnicos internos preservados quando a traducao aumentaria risco sem melhorar a experiencia do usuario.
