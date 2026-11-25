# Ordem dos Docs Para a Banca - Shape Up

> Para a ultima rubrica recebida, use primeiro `docs/checklist-rubrica-atualizada.md`, `docs/execucao-final-rubrica-2026-11-23.md` e `docs/roadmap-rubrica.md`. O roteiro atualizado da defesa e `docs/roteiro-apresentacao-final.md`; `docs/checklist-rubrica-apresentacao.md` preserva uma rubrica anterior.

## Regra principal

Nao precisa abrir todos os arquivos da pasta `docs`. A pasta tem documentos de entrega, apoio, historico e preparacao interna. Na apresentacao, mostre os arquivos que provam a rubrica e deixe os demais apenas como reserva caso o professor pergunte.

## Ordem recomendada para abrir

### 1. `docs/roteiro-apresentacao-final.md`

Use como guia inicial da fala.

Mostra:
- problema;
- produto;
- arquitetura;
- demonstracao web;
- demonstracao mobile;
- fechamento pela rubrica.

### 2. `docs/checklist-rubrica-atualizada.md`

Use para rastrear os 12 criterios pontuados da folha atual, os links de evidencia e as pendencias de fechamento.

### 3. `docs/execucao-final-rubrica-2026-11-23.md`

Use para defender criterio por criterio da rubrica atualizada.

Mostra:
- o que a banca pode perguntar;
- onde esta a evidencia;
- resposta curta para cada item da rubrica.

Se o professor perguntar "onde esta tal criterio?", este e o melhor arquivo para abrir.

### 4. `contextualizacao-problema.md`

Use para explicar o problema real.

Mostra:
- academias usando planilhas, papel e ferramentas separadas;
- dores do gestor;
- justificativa do Shape Up.

Nao precisa ler inteiro. Mostre rapidamente problema, publico-alvo e proposta.

### 5. `objetivos-escopo.md`

Use para explicar escopo e persona.

Mostra:
- objetivo geral;
- publico-alvo;
- personas;
- o que entra e o que fica como evolucao futura.

Importante para justificar que aluno nao faz login nesta versao.

### 6. `requisitos.md`

Use para RFs e RNFs.

Mostra:
- requisitos funcionais;
- requisitos nao funcionais;
- status de implementacao;
- relacao com a rubrica.

Foque em autenticacao, gestores, planos, alunos, treinos, anexos e mobile.

### 7. `modelagem-der.md`

Use para DER e banco.

Mostra:
- tabelas propostas;
- tabelas prioritarias do MVP;
- diagrama entidade-relacionamento;
- dicionario de dados.

Fala importante: o DER modela uma academia completa; o MVP implementa os fluxos principais.

### 8. `diagramas-uml.md`

Use para os criterios de UML.

Mostra:
- 2 casos de uso;
- 2 diagramas de atividades;
- 2 diagramas de sequencia.

Este arquivo e obrigatorio se a rubrica cobrar diagramas.

### 9. `arquitetura-evidencias.md`

Use para arquitetura e clean code.

Mostra:
- camadas;
- padrao de pastas;
- rotas PT-BR;
- endpoints;
- CRUD integrado;
- boas praticas.

Depois de abrir esse arquivo, se pedirem codigo, va para `frontend`, `backend`, `shared` e `backend/prisma`.

### 10. `validacao-usabilidade-seguranca.md`

Use para testes, seguranca e validacao.

Mostra:
- comandos executados;
- usabilidade;
- compatibilidade;
- JWT, bcrypt e rotas protegidas;
- auditoria de dependencias.

Nao foque em frases de pendencia. Foque no que passou: lint, test, build, E2E, Expo e seguranca.

### 11. `validacao-expo.md`

Use se o professor perguntar do mobile.

Mostra:
- o que foi implementado no Expo;
- como executar;
- validacoes ja feitas;
- escopo do app mobile.

## Arquivos para deixar como apoio

Abra apenas se perguntarem.

- `regras-negocio.md`: bom para explicar regras por modulo.
- `cynefin-abordagem-gestao.md`: bom se cobrarem abordagem de gestao/processo.
- `backlog-jira-inicial.md`: bom se cobrarem Jira, epicos e user stories.
- `auditoria-dependencias.md`: bom se perguntarem seguranca NPM ou vulnerabilidades.
- `roadmap-rubrica.md`: bom como fonte completa de rastreabilidade, mas nao precisa abrir por padrao.
- `mapa-rubrica.md`: historico/resumo da rubrica; o checklist ja e melhor para apresentar.
- `nomenclatura-ptbr.md`: bom se perguntarem por que existem nomes em PT-BR e ingles tecnico.
- `fluxo-git-github.md` e `gitflow.md`: bom se perguntarem fluxo de branch/commits.
- `guia-comandos-dia-a-dia.md`: bom se perguntarem como rodar o projeto.

## Arquivos que eu nao abriria na apresentacao

Estes sao mais internos ou podem puxar a conversa para preparacao, pendencias e bastidores.

- `checklist-qa-interface.md`
- `pacote-final-evidencias.md`
- `preparacao-desenvolvimento.md`
- `roteiro-progresso-4-periodo.md`

Eles podem ficar no repositorio como evidencia de processo, mas nao devem ser o foco da apresentacao.

## Ordem curta se o tempo estiver apertado

Se tiver pouco tempo, abra somente estes:

1. `checklist-rubrica-apresentacao.md`
2. `requisitos.md`
3. `modelagem-der.md`
4. `diagramas-uml.md`
5. `arquitetura-evidencias.md`
6. `validacao-usabilidade-seguranca.md`
7. `validacao-expo.md`

## Frase pronta

"A pasta docs tem documentos principais e documentos de apoio. Para a apresentacao, vou mostrar primeiro os que comprovam diretamente a rubrica: requisitos, DER, UML, arquitetura, validacao e mobile. Os demais ficam como historico de planejamento e apoio caso seja necessario."
