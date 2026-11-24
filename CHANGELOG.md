# Changelog

Mudancas relevantes do Shape Up, organizadas por versao. Uma versao so e considerada publicada quando o pacote, a tag no GitHub e a release correspondente forem revisados e registrados.

## 1.0.1 — candidata, nao publicada

**Escopo:** fechamento da rubrica atualizada, preservando o projeto Shape Up existente.

### Adicionado

- Cache-aside no Redis com TTL e invalidacao associada a atualizacao de planos.
- Publicacao e consumo de eventos Redis Pub/Sub com logs estruturados.
- Circuit breaker Redis, fallback e observabilidade de requisicoes.
- Contrato OpenAPI/Swagger e documentacao C4, DDD, ADRs, cenarios de qualidade e runbook.
- Workflow CI/CD com lint, testes, E2E Playwright em Compose isolado, verificacao mobile, build e Docker Compose.
- Matriz de evidencia da rubrica, roteiro de demonstracao e apresentacao.
- Runner E2E isolado por execucao, com banco, Redis, rede e volumes descartaveis; o script de limpeza recusa bancos que nao sejam de teste.

### Corrigido e atualizado

- Dependencias atualizadas dentro de faixas compativeis, sem downgrade forcado de Prisma ou Expo.
- Evidencias de arquitetura, fluxo Jira e recuperacao de incidentes alinhadas ao comportamento atual.

### Validacao da candidata

- Em 23/11/2026: lint, 28 testes, build, lint mobile, `expo install --check`, configuracao Compose, verificacoes HTTP locais e `npm run e2e` (6/6) passaram. A suite E2E usa uma stack Compose descartavel com portas aleatorias; a limpeza remove seus volumes e a trava rejeita banco principal.
- Redis foi exercitado em stack descartavel isolada: a edicao de plano pela interface gerou `plano.atualizado`, invalidacao de cache e evento publicado/consumido; TTL observado de 60 s. O teste com repository fake continua como evidencia complementar.
- GitHub Actions passou em 24/11/2026 no commit `c39bf91`, nos eventos de push e PR; tag Git e deploy publico continuam pendentes.
- Auditoria atual: 0 vulnerabilidades em `npm audit`; Prisma 7.10.1 validado com adapter MariaDB; detalhe e escopo em `docs/auditoria-dependencias.md`.

### Estado da versao

- Versao Jira `1.0.1`: criada como nao lancada.
- `package.json` continua em `1.0.0`, que e a versao publicada/declarada antes desta candidata.
- Nao existe tag ou release GitHub publicada para `1.0.1`.
