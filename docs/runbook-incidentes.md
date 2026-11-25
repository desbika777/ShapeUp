# Runbook de Incidentes - Shape Up

Este runbook cobre a demonstracao local e a instalacao por Docker Compose. Execute os comandos a partir da raiz do repositorio. Nao remova volumes para tentar corrigir uma falha.

## 1. Triagem inicial

1. Registre horario, sintoma, tela ou endpoint afetado e ultima alteracao conhecida.
2. Confira o estado dos containers:

   `docker compose ps`

3. Confira logs recentes dos servicos:

   `docker compose logs --tail=100 nginx backend mysql redis`

4. Teste a rota de saude no Windows PowerShell:

   `Invoke-RestMethod http://127.0.0.1/health`

5. Guarde mensagens de erro e requestId dos logs, sem copiar senhas ou tokens.

## 2. API ou site indisponivel

- Confira se nginx, backend e frontend estao ativos em `docker compose ps`.
- Verifique erros do proxy e da API em docker compose logs --tail=100 nginx backend.
- Confira a configuracao do Nginx com `docker compose exec nginx nginx -t`.
- Se apenas o backend estiver travado e MySQL estiver saudavel, reinicie somente a API:

  `docker compose restart backend`

- Teste novamente /health e a rota afetada antes de continuar a demonstracao.

## 3. MySQL indisponivel

- Consulte `docker compose logs --tail=100 mysql`.
- Confira se o healthcheck do MySQL concluiu em `docker compose ps`.
- Reinicie somente o servico se a falha for temporaria:

  `docker compose restart mysql`

- Aguarde o healthcheck e confira novamente os logs do backend.
- Nao use `docker compose down -v`: isso apaga volumes persistentes e pode destruir dados.

## 4. Redis indisponivel

- Consulte `docker compose logs --tail=100 redis backend`.
- O cache e os eventos podem ficar indisponiveis; o backend registra erros e as consultas cacheadas devem recorrer ao MySQL.
- Restaure o servico sem apagar o volume:

  `docker compose up -d redis`

- Confira os logs redis_conectado, redis_circuito_aberto, redis_circuito_meio_aberto, redis_circuito_fechado, cache_*_falhou e eventos antes de repetir a demonstracao.

## 5. Deploy com problema ou rollback simples

1. Suspenda novas demonstracoes e registre o commit que falhou.
2. Identifique o ultimo commit estavel em `git log --oneline`.
3. No servidor de demonstracao, volte temporariamente ao commit estavel:

   `git switch --detach <commit-estavel>`
   `docker compose up -d --build`

4. Verifique `docker compose ps`, logs e /health.
5. Registre a causa e o commit problematico; depois corrija em uma branch e publique nova versao.
6. Se o deploy incluiu migration de banco, confirme compatibilidade antes de voltar o codigo. A migration nao e desfeita pelo rollback da imagem.

## 6. Registro e encerramento

Registre data/hora, impacto, servicos envolvidos, requestId, causa provavel, acao executada, resultado da verificacao e commit/versao restaurada. Encerre somente depois de /health responder e do fluxo principal ser demonstrado novamente.
