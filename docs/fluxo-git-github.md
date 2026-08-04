# Fluxo Git e GitHub - Shape

## Objetivo

Este documento define o fluxo de versionamento do Shape para manter o historico organizado, facilitar a colaboracao da dupla e gerar evidencias de progresso para a rubrica.

## Branches Principais

### main

Branch estavel do projeto.

Uso:

- manter apenas versoes revisadas;
- receber merges vindos da `dev`;
- representar uma versao pronta para entrega ou apresentacao.

Regra:
Nao desenvolver diretamente na `main`.

### dev

Branch de integracao.

Uso:

- receber funcionalidades finalizadas;
- reunir entregas parciais;
- servir como base para testes antes de ir para `main`.

### feature/*

Branches de trabalho.

Uso:

- documentacao;
- modelagem;
- funcionalidades;
- ajustes tecnicos;
- correcoes pequenas.

Exemplos:

- `feature/documentacao-rubrica`;
- `feature/modelagem-shape`;
- `feature/mvp-alunos-planos`;
- `feature/dashboard-indicadores`;

## Fluxo Recomendado

1. Atualizar a branch base:

```bash
git switch dev
git pull origin dev
```

2. Criar uma branch de feature:

```bash
git switch -c feature/nome-da-feature
```

3. Fazer uma alteracao pequena e coerente.

4. Rodar validacoes quando a alteracao impactar codigo:

```bash
npm run lint
npm run test
npm run build
```

5. Criar commit com mensagem clara:

```bash
git add .
git commit -m "tipo: resumo da alteracao"
```

6. Enviar para o GitHub:

```bash
git push origin feature/nome-da-feature
```

7. Abrir Pull Request para `dev`.

8. Depois de revisado, fazer merge de `dev` para `main` apenas quando a versao estiver estavel.

## Padrao de Commits

Formato:

```text
tipo: resumo curto
```

Tipos sugeridos:

- `docs`: documentacao;
- `feat`: nova funcionalidade;
- `fix`: correcao de bug;
- `chore`: tarefa tecnica ou preparacao;
- `refactor`: melhoria interna sem mudar comportamento;
- `test`: criacao ou ajuste de testes;
- `style`: ajuste visual ou formatacao.

Exemplos:

```bash
git commit -m "docs: adicionar requisitos do projeto"
git commit -m "feat: criar cadastro de alunos"
git commit -m "fix: corrigir validacao de cpf"
git commit -m "chore: configurar ambiente docker"
```

## Politica de Commits Pequenos

A partir deste ponto, cada modificacao relevante deve gerar um commit proprio.

Regras praticas:

- documentacao em commits de `docs`;
- mudancas de banco em commits de `feat` ou `chore`;
- ajustes tecnicos separados de funcionalidades;
- nao misturar varias features no mesmo commit;
- rodar validacoes antes de commit quando houver codigo alterado.

## Estado Atual

Branch atual de trabalho:

- `feature/documentacao-rubrica`

Commits locais criados:

- `docs: estruturar planejamento da rubrica`;
- `chore: preparar seed e arquivos ignorados`.

Observacao:
O push para o GitHub depende de autenticacao local do Git. Se o terminal nao estiver autenticado, os commits ficam salvos localmente ate o login ser configurado.
