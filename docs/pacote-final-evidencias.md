# Pacote Final de Evidencias - Shape Up

> Atualizacao de 24/11/2026: para status atual, use `docs/execucao-final-rubrica-2026-11-23.md`; para a fala, `docs/roteiro-apresentacao-final.md`; para a candidata 1.0.1, `CHANGELOG.md`. Este pacote contem um roteiro operacional anterior e nao substitui essas fontes.

## Objetivo

Centralizar o que precisa ser aberto, testado, mostrado e fotografado no dia da apresentacao. O foco e deixar o site, o Expo Go, os testes e a documentacao prontos para consulta rapida.

## Estado Atual

| Area | Status | Evidencia |
| --- | --- | --- |
| Branch GitHub | Sincronizada; commit `c39bf91` validado nos eventos de push e PR | `feature/documentacao-rubrica`; [push](https://github.com/desbika777/ShapeUp/actions/runs/45458354039) · [PR](https://github.com/desbika777/ShapeUp/actions/runs/45458374598) |
| Alinhamento da rubrica | Matriz revisada; CI remoto passou | `docs/execucao-final-rubrica-2026-11-23.md` |
| Upload Multer | Concluido | Tela `/imagens`, endpoint `POST /api/imagens`, validacoes e E2E |
| Refatoracao final | Concluida | `shared`, helper HTTP, app Expo e validadores reutilizados |
| Auditoria NPM | Passou: 0 vulnerabilidades | `docs/auditoria-dependencias.md`; Prisma 7.10.1 + adapter MariaDB e Expo SDK 57 validado |
| Roteiro final | Concluido | `docs/roteiro-apresentacao-final.md` |
| Guia operacional | Concluido | `docs/guia-comandos-dia-a-dia.md` orienta web, Expo, testes e commit/push |
| E2E da interface | Concluido localmente em ambiente isolado | Playwright 6/6; autenticacao, CRUD de planos/alunos/treinos e anexos; logs Redis/PubSub em `docs/evidencias-redis-2026-11-23.md` |
| Ensaio visual da banca | Pendente | Abrir o ambiente de demonstracao e registrar capturas finais sem usar dados de producao |
| Expo Go fisico | Validado em base tecnica | Projeto abriu no celular em 14/09/2026; app Expo foi ampliado com abas e CRUDs de planos, alunos e treinos; script LAN criado em 15/09/2026; falta print final quando houver mesma rede |

## Comandos Para Preparar o Ambiente

O comando `npm run e2e` usa uma stack isolada e descartavel. Ele nao depende do banco persistente da demonstracao.

```powershell
docker compose -f docker-compose.yml -f docker-compose.dbeaver.yml -f docker-compose.expo.yml --env-file .env up -d --build
curl.exe -k https://localhost/health
curl.exe http://127.0.0.1/health
npm run e2e
```

Se o site nao abrir de primeira, conferir:

```powershell
docker compose -f docker-compose.yml -f docker-compose.dbeaver.yml -f docker-compose.expo.yml ps
```

## Acesso Para Demonstracao

| Perfil | Preparacao | Uso na demonstracao |
| --- | --- | --- |
| Gestor administrador | Seed local descartavel; criar/rotacionar credenciais antes de qualquer deploy | Gerenciar planos, alunos, treinos, imagens e painel |

Observacao para a banca: aluno nao faz login nesta versao. O aluno e um cadastro da academia, e o portal/app do aluno fica como evolucao futura.

## Roteiro de Teste Dentro do Site

1. Abrir `http://127.0.0.1`.
2. Entrar como administrador.
3. Conferir se o painel carrega indicadores e alunos recentes.
4. Abrir `/planos` e validar listagem, filtros e acao administrativa.
5. Criar um plano de teste:
   - nome: `Plano Evidencia Final`;
   - descricao: `Plano criado para validacao final da rubrica`;
   - preco: `199.90`;
   - duracao: `3`;
   - status: ativo.
6. Editar o plano criado e depois excluir ao final do teste.
7. Abrir `/alunos` e validar listagem, filtros e vinculo com plano.
8. Criar um aluno de teste:
   - nome: `Aluno Evidencia Final`;
   - e-mail: `aluno.evidencia.final@shape.com.br`;
   - CPF: `84664101716`;
   - telefone: `11999998888`;
   - objetivo: `Validacao final do fluxo de alunos`;
   - plano: selecionar um plano ativo.
9. Abrir `/treinos` e criar treino vinculado ao aluno de teste.
10. Abrir `/imagens`, enviar uma imagem PNG/JPG valida e conferir URL/metadados.
11. Tentar enviar um arquivo invalido para demonstrar rejeicao de seguranca.
12. Abrir `/usuarios` e confirmar que a tela fala em gestores administrativos, sem prometer outro tipo de acesso nesta versao.
13. Remover registros de teste, se necessario.

## Prints Recomendados

| Evidencia | Criterios cobertos |
| --- | --- |
| Login em `http://127.0.0.1/entrar` | R-05, R-14 |
| Painel carregado | R-03, R-05 |
| Listagem de planos | R-03 |
| Formulario de plano preenchido | R-03, R-04 |
| Listagem de alunos com plano | R-03, R-04 |
| Formulario de treino vinculado a aluno | R-03, R-04 |
| Tela `/imagens` com upload realizado | R-12, R-13 |
| Erro ao enviar arquivo invalido | R-05, R-13 |
| Tela de gestores com acesso administrativo unico | R-14 |
| Relatorio E2E 6/6 e logs Redis de stack isolada | Rubrica atual: CRUD, cache e Pub/Sub |
| Roadmap oficial aberto | R-08 e rastreabilidade geral |

## Arquivos Para Abrir Na Apresentacao

| Arquivo | Finalidade |
| --- | --- |
| `docs/roadmap-rubrica.md` | Fonte oficial de status por item da rubrica |
| `docs/checklist-rubrica-atualizada.md` | Defesa dos 12 criterios pontuados na ultima folha recebida; a rubrica anterior esta em `docs/checklist-rubrica-apresentacao.md` |
| `docs/checklist-qa-interface.md` | Guia da proxima auditoria visual e de codigo |
| `docs/requisitos.md` | RFs/RNFs e status implementado/planejado |
| `docs/modelagem-der.md` | DER e modelagem do banco |
| `docs/diagramas-uml.md` | Casos de uso, atividades e sequencias |
| `docs/arquitetura-evidencias.md` | Arquitetura e padronizacao |
| `docs/auditoria-dependencias.md` | Evidencia de revisao de seguranca NPM |
| `docs/roteiro-apresentacao-final.md` | Roteiro para os tres componentes e 12 criterios (9,0 pontos no total) |

## Pendencias Controladas

| Pendencia | Como tratar |
| --- | --- |
| Prints finais do site | Abrir `http://127.0.0.1`, seguir `docs/checklist-qa-interface.md` e registrar as telas-chave para a apresentacao |
| Expo Go em celular fisico | Acesso inicial ja validado; usar `npm run dev:mobile:lan` e anexar print final das abas operacionais ao R-05 quando houver mesma rede |
| Vulnerabilidades residuais de Prisma/Expo | Manter justificativa em `docs/auditoria-dependencias.md`; nao usar `npm audit fix --force` antes da entrega |
| Criterios NSA da rubrica | Confirmar com o professor ou manter justificativa de item nao verificavel |

## Conferencia Final

Antes da apresentacao:

1. Subir Docker se necessario.
2. Abrir `http://127.0.0.1`.
3. Registrar prints finais das telas principais do site.
4. Validar as abas novas no Expo Go quando houver mesma rede.
5. Rodar validacoes finais.
6. Revisar diff e remover artefatos temporarios.
7. Fazer commit e push dos ajustes finais.

## Ultima Validacao Tecnica

Em 23/11/2026, passaram:

- `npm run lint`;
- `npm run test`;
- `npm run build`;
- `npm run lint:mobile`;
- Playwright E2E 6/6 em stack Docker/MySQL/Redis descartavel isolada;
- `npm exec --workspace mobile -- expo install --check`;
- `npm exec --workspace mobile -- expo export --platform ios --output-dir ..\tmp\expo-export-mobile`.

O workflow GitHub passou para o commit `c39bf91` em 24/11/2026; a candidata Jira 1.0.1 continua nao lancada.
