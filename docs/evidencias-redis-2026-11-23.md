# Evidencia Redis - Shape Up - 23/11/2026

## Escopo da demonstracao

Foram executadas duas demonstracoes em 23/11/2026. A primeira, aproximadamente 21:14 UTC, usou Redis real e repository fake para exercitar `ServicoPlano.update` sem gravar no MySQL. A segunda foi uma suite E2E completa numa stack Docker separada, com banco e Redis proprios e dados descartaveis; a stack e seus volumes foram removidos depois da execucao.

## Resultado observado

| Etapa | Evidencia observada |
| --- | --- |
| Primeira consulta | `cache_miss`, seguido de `cache_set` com TTL de 60 segundos |
| Repeticao da consulta | `cache_hit`; o repositorio foi consultado uma vez |
| Atualizacao do plano | `ServicoPlano.update` chamou a invalidacao do cache do proprietario e publicou `plano.atualizado` |
| Invalidacao | `cache_invalidation` removeu uma chave (`removed: 1`) |
| Consulta depois da atualizacao | Novo `cache_miss` e `cache_set`; o repositorio retornou a segunda versao dos dados |
| Pub/Sub | A API registrou `evento_publicado` e o assinante registrou `evento_consumido` no canal `shapeup:eventos` |

Os valores retornados foram `snapshot: 1` na primeira leitura e no hit, e `snapshot: 2` depois da atualizacao. O teste terminou sem escrita no banco.

## Confirmacao pela interface e API

Em 23/11/2026, os 6 testes Playwright passaram na stack descartavel `shapeup-rubric-e2e`: cadastro controlado/login, CRUD de planos, alunos e treinos e anexos. O teste de planos criou, editou, consultou e removeu um plano pela interface/API. Na edicao, o Redis registrou `cache_invalidation` e a API publicou e consumiu `plano.atualizado` em `shapeup:eventos`. Consultas seguintes registraram `cache_miss` e `cache_set` com `ttlSeconds: 60`.

Os testes usaram uma conta e dados seed dentro de MySQL/Redis isolados do ambiente principal. Ao final, o projeto Compose e os volumes temporarios foram removidos; a stack original permaneceu ativa.

## Trecho dos logs

```text
cache_miss
cache_set ttlSeconds=60
cache_hit
evento_publicado channel=shapeup:eventos type=plano.atualizado
cache_invalidation removed=1
cache_miss
cache_set ttlSeconds=60
evento_consumido channel=shapeup:eventos type=plano.atualizado
```

## Limite da evidencia

A prova de servico com repository fake e complementar. A demonstracao E2E valida tambem os fluxos HTTP e de interface, mas ocorreu numa stack local descartavel, nao num servidor publico. Nao usar dados de producao na defesa.

## Estado da stack apos a prova

A imagem principal do backend contem `redis-circuit-breaker.js`. A stack Compose principal permaneceu ativa; `/`, `/health`, `/api/docs/` e `/api/openapi.json` responderam HTTP 200. MySQL e Redis permaneceram saudaveis depois da remocao do ambiente E2E descartavel.
