# Checklist de Defesa da Rubrica - Shape Up

## Objetivo

Este documento transforma a rubrica em um guia de defesa para a apresentacao. Ele complementa o roadmap oficial e ajuda a equipe a mostrar evidencias reais sem improvisar respostas.

Fonte: `RubricaNova.pdf`, revisada em 14/09/2026.

## Leitura Executiva

- A rubrica possui 15 criterios com descricao objetiva e 3 linhas NSA sem descricao clara no texto extraido.
- O projeto atende tecnicamente R-01 a R-04 e R-06 a R-15.
- R-05 continua parcial apenas por depender dos prints finais do Expo Go e da coleta oficial de evidencias visuais do site.
- R-16, R-17 e R-18 devem ser tratados como nao verificaveis ate confirmacao do professor, porque o PDF nao descreve o que deve ser entregue.
- A proxima frente de maior impacto e coletar evidencias finais, revisar o diff e preparar commit/push sem introduzir risco na vespera da entrega.

## Matriz Para Defesa

| ID | O que a banca pode perguntar | Evidencia para abrir | Defesa curta | Risco/acao |
| --- | --- | --- | --- | --- |
| R-01 | Como o projeto foi padronizado? | `docs/arquitetura-evidencias.md`, README, Docker, workspaces | O Shape Up separa web, mobile, API, tipos compartilhados, banco e infraestrutura, com comandos padronizados de execucao e validacao. | Manter README e comandos coerentes ate a entrega. |
| R-02 | Onde estao componentizacao e clean code? | `frontend/src/components`, `mobile/src/components`, `backend/src/services`, `shared/src` | Componentes reutilizaveis ficam separados das paginas; regras ficam em services; validacoes sensiveis foram centralizadas no pacote compartilhado. | Manter validacoes passando e evitar refatoracao arriscada antes da entrega. |
| R-03 | Qual CRUD prova app x API x banco? | Telas de planos, alunos e treinos; E2E; Prisma | Planos, alunos e treinos usam frontend, API Express, services, repositories Prisma e MySQL. | Garantir que ao menos um fluxo seja demonstrado sem erro no navegador. |
| R-04 | Quais regras de negocio existem? | `docs/regras-negocio.md`, services, validators | CPF, e-mail, senha forte, vinculo aluno-plano, datas de treino, dono do registro, permissoes e upload sao validados em camadas. | Demonstrar uma regra com sucesso e uma rejeicao controlada. |
| R-05 | Como a equipe validou usabilidade, compatibilidade e seguranca? | `docs/validacao-usabilidade-seguranca.md`, `docs/validacao-expo.md`, `docs/auditoria-dependencias.md` | Foram feitos lint, testes, build, E2E, validacao Expo, export iOS, JWT, bcrypt, rota protegida, upload seguro e revisao de dependencias. | Coletar prints finais no site e no Expo Go. |
| R-06 | Onde esta a evolucao do produto? | `docs/contextualizacao-problema.md`, `docs/objetivos-escopo.md`, `docs/roteiro-progresso-4-periodo.md` | A documentacao mostra problema, escopo, personas, decisao de MVP, evolucao tecnica e caminho de entrega. | Nao prometer que todos os modulos modelados estao implementados. |
| R-07 | Onde esta o DER? | `docs/modelagem-der.md`, `backend/prisma/schema.prisma` | O DER cobre a visao ampla de academia, com 27 tabelas e nomenclatura em PT-BR. | Explicar que algumas tabelas representam evolucao planejada. |
| R-08 | Onde estao RFs e RNFs? | `docs/requisitos.md` | Os requisitos estao classificados por status: implementado, parcial/modelado e planejado. | Manter a fala honesta sobre o que e MVP e o que e evolucao. |
| R-09 | Onde estao 2 casos de uso? | `docs/diagramas-uml.md` | O documento possui casos de uso ligados aos fluxos reais do produto. | Abrir o arquivo antes da apresentacao para conferir renderizacao Mermaid. |
| R-10 | Onde estao 2 diagramas de atividades? | `docs/diagramas-uml.md` | Os fluxos de atividades representam regras e decisoes do sistema. | Relacionar cada fluxo a uma tela demonstravel. |
| R-11 | Onde estao 2 diagramas de sequencia? | `docs/diagramas-uml.md` | Os diagramas mostram a conversa entre usuario, frontend/mobile, API, service, repository e banco. | Conferir se os participantes batem com a arquitetura atual. |
| R-12 | Como a aplicacao recebe e salva imagens com Multer? | Tela `/imagens`, `POST /api/imagens`, `backend/src/middlewares/image-upload-middleware.ts` | O backend usa Multer, salva em `backend/uploads/imagens` e publica o arquivo via `/uploads/imagens`. A tela tambem aceita PDF para documentos operacionais. | Demonstrar upload valido no site. |
| R-13 | Como as imagens sao validadas? | `backend/src/services/image-service.ts`, testes, tela `/imagens` | O sistema valida extensao, MIME type, assinatura real, tamanho maximo e colisao por UUID. | Demonstrar uma tentativa com arquivo invalido. |
| R-14 | Como funciona o acesso administrativo? | Seed, `MasterRoute`, `AdminRoute`, `exigirPerfil(['MASTER'])` e `exigirPerfil(['MASTER', 'ADMIN'])` | A conta master Shape Up cria clientes e tambem administra a propria academia; cada cliente administra somente a propria academia. Aluno com login fica como evolucao futura. | Demonstrar a tela Clientes no master e tambem os CRUDs operacionais. |
| R-15 | Qual e a conexao com persona/cliente? | `docs/objetivos-escopo.md` | O produto foi desenhado para gestor, recepcao e professor de academia, com fluxos alinhados a esses papeis. | Conectar cada demonstracao a uma persona. |
| R-16 | O que significa o primeiro NSA sem descricao? | `RubricaNova.pdf`, `docs/roadmap-rubrica.md` | O PDF nao traz descricao objetiva; a equipe registrou a impossibilidade de verificacao. | Confirmar com professor ou manter justificativa. |
| R-17 | O que significa o segundo NSA sem descricao? | `RubricaNova.pdf`, `docs/roadmap-rubrica.md` | O PDF nao traz descricao objetiva; a equipe registrou a impossibilidade de verificacao. | Confirmar com professor ou manter justificativa. |
| R-18 | O que significa o terceiro NSA sem descricao? | `RubricaNova.pdf`, `docs/roadmap-rubrica.md` | O PDF nao traz descricao objetiva; a equipe registrou a impossibilidade de verificacao. | Confirmar com professor ou manter justificativa. |

## Ordem Segura de Demonstracao

1. Abrir o roadmap oficial e dizer que ele e a fonte da verdade da entrega.
2. Mostrar problema, personas e escopo do MVP.
3. Mostrar arquitetura, DER, requisitos e diagramas.
4. Abrir o site em `http://127.0.0.1`.
5. Demonstrar login master, tela Clientes e criacao controlada de cliente.
6. Entrar como cliente demo e mostrar painel, planos, alunos, treinos e upload.
7. Mostrar testes, auditoria NPM e branch GitHub sincronizada.
8. Mostrar Expo Go com login, painel e abas operacionais; se a rede local falhar, usar `npm run dev:mobile:tunnel` e defender o export iOS validado.

## Pontos Que Nao Devem Ser Prometidos

- Nao dizer que financeiro completo, aulas, equipamentos e matriculas completas estao implementados; esses pontos estao modelados ou planejados.
- Nao dizer que R-05 esta 100% fechado enquanto faltar print final do Expo Go e a coleta oficial de prints do site.
- Nao executar `npm audit fix --force` na vespera da entrega, porque pode quebrar Prisma, Expo ou React Native.
- Nao tentar acessar `https://localhost` em navegador que nao confia no certificado; usar `http://127.0.0.1` para demonstracao local rapida.

## Proxima Acao Obrigatoria

Rodar a bateria final de validacoes, coletar os prints oficiais do site/Expo e revisar o diff antes de preparar commit/push.
