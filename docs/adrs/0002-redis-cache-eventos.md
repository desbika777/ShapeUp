# ADR 0002 - Redis Para Cache-Aside E Pub/Sub

## Status

Aceito.

## Contexto

A Rubrica Nova 5 exige uso de Redis para cache distribuido e mensageria/eventos.
O Shape Up possui consultas frequentes no painel e nas listagens principais, alem
de operacoes de escrita que devem deixar evidencias de eventos de dominio.

## Decisao

Adicionar Redis ao Docker Compose oficial e usar dois padroes:

- cache-aside com TTL para painel e listagens de planos, alunos e treinos;
- Pub/Sub no canal `shapeup:eventos` para publicar e consumir eventos de escrita.

O Redis deve ser resiliente: se estiver indisponivel, a API continua buscando os
dados no MySQL e registra logs estruturados de falha de cache/evento.

## Consequencias

- Leituras frequentes reduzem carga no banco quando o cache esta quente.
- Escritas invalidam chaves do dono da academia para evitar dados desatualizados.
- Logs `evento_publicado` e `evento_consumido` comprovam circulacao de mensagens.
- A stack Docker passa a orquestrar MySQL, Redis, backend, frontend e Nginx.
- O acoplamento com Redis fica concentrado em services pequenos, mantendo clean code.
