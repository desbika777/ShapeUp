# GitFlow ShapeUp

## Branches permanentes

- `main`: versao estavel, pronta para entrega.
- `dev`: integracao continua das features aprovadas.

## Branches temporarias

- `feature/<descricao-curta>`: novas funcionalidades e melhorias.
- `fix/<descricao-curta>`: correcoes de defeitos.
- `hotfix/<descricao-curta>`: correcoes urgentes criadas a partir de `main`.

## Fluxo recomendado

1. Atualize a `dev`.
2. Crie uma branch a partir dela, por exemplo `feature/nginx-https`.
3. Abra pull request da feature para `dev`.
4. Ao fechar um pacote de entrega, abra pull request de `dev` para `main`.
5. Use commits no formato `tipo: resumo curto`, por exemplo `feat: ampliar testes e2e`.

## Validacoes locais

- `pre-commit`: executa `npm run lint`.
- `commit-msg`: valida o padrao da mensagem de commit.
- `pre-push`: executa `npm run e2e`.
