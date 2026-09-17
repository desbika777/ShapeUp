# Pacote Final de Evidencias - Shape Up

## Objetivo

Centralizar o que precisa ser aberto, testado, mostrado e fotografado no dia da apresentacao. O foco e deixar o site, o Expo Go, os testes e a documentacao prontos para consulta rapida.

## Estado Atual

| Area | Status | Evidencia |
| --- | --- | --- |
| Branch GitHub | Sincronizada com o remoto | `feature/documentacao-rubrica` |
| Alinhamento da rubrica | Concluido em base documental | `docs/roadmap-rubrica.md` e `docs/checklist-rubrica-apresentacao.md` |
| Upload Multer | Concluido | Tela `/imagens`, endpoint `POST /api/imagens`, validacoes e E2E |
| Refatoracao final | Concluida | `shared`, helper HTTP, app Expo e validadores reutilizados |
| Auditoria NPM | Revisada e atualizada | `docs/auditoria-dependencias.md`; 14 vulnerabilidades residuais sem criticas/baixas |
| Roteiro final | Concluido | `docs/roteiro-final-apresentacao.md` |
| Guia operacional | Concluido | `docs/guia-comandos-dia-a-dia.md` orienta web, Expo, testes e commit/push |
| QA visual do site | Terceira rodada parcial controlada | Layout, autenticacao, painel, listagens, upload, gestores, perfil, formularios internos e responsividade mobile revisados; falta coleta final dos prints oficiais |
| Expo Go fisico | Validado em base tecnica | Projeto abriu no celular em 14/09/2026; app Expo foi ampliado com abas e CRUDs de planos, alunos e treinos; script LAN criado em 15/09/2026; falta print final quando houver mesma rede |

## Comandos Para Preparar o Ambiente

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

| Perfil | E-mail | Senha | Uso na demonstracao |
| --- | --- | --- | --- |
| Gestor administrador | `admin@shape.com.br` | `Shape@123` | Gerenciar planos, alunos, treinos, imagens, painel e acessos de gestores |

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
| Terminal com `npm run e2e` passando | R-05 |
| Roadmap oficial aberto | R-08 e rastreabilidade geral |

## Arquivos Para Abrir Na Apresentacao

| Arquivo | Finalidade |
| --- | --- |
| `docs/roadmap-rubrica.md` | Fonte oficial de status por item da rubrica |
| `docs/checklist-rubrica-apresentacao.md` | Defesa objetiva de cada criterio da rubrica |
| `docs/checklist-qa-interface.md` | Guia da proxima auditoria visual e de codigo |
| `docs/requisitos.md` | RFs/RNFs e status implementado/planejado |
| `docs/modelagem-der.md` | DER e modelagem do banco |
| `docs/diagramas-uml.md` | Casos de uso, atividades e sequencias |
| `docs/arquitetura-evidencias.md` | Arquitetura e padronizacao |
| `docs/auditoria-dependencias.md` | Evidencia de revisao de seguranca NPM |
| `docs/roteiro-final-apresentacao.md` | Ordem de apresentacao |

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

Em 15/09/2026, depois da auditoria NPM, da evolucao do Expo e da terceira rodada visual do site, passaram:

- `npm run lint`;
- `npm run test`;
- `npm run build`;
- `npm run lint:mobile`;
- `npm run e2e`;
- `npm exec --workspace mobile -- expo install --check`;
- `npm exec --workspace mobile -- expo export --platform ios --output-dir ..\tmp\expo-export-mobile`.
