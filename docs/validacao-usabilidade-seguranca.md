# Validacao de Usabilidade, Funcionalidade, Compatibilidade e Seguranca - Shape Up

## Objetivo

Este documento registra como o Shape Up atende ao criterio da rubrica sobre validacao da aplicacao. Ele pode ser usado como apoio para explicar que a dupla nao apenas codou telas, mas verificou funcionamento, usabilidade e seguranca basica.

## Funcionalidades Validadas

| Fluxo | Evidencia |
| --- | --- |
| Acesso controlado master/cliente | Testes E2E e criacao interna de cliente pela conta master |
| Entrada no sistema | Testes E2E, JWT e tela protegida |
| Recuperacao de senha | Service, token com hash e tela dedicada |
| CRUD de planos | Tela, API, service, repository e testes |
| CRUD de alunos | Tela, API, service, repository e testes |
| CRUD de treinos | Tela, API, service, repository e testes |
| Dashboard | API de indicadores e graficos no frontend |
| Upload de imagens | Tela `/imagens`, Multer, storage local, validacao e testes |
| Aplicativo Expo | Workspace `mobile`, Expo Go, login, painel, abas e CRUDs de planos/alunos/treinos pela API |

## Comandos de Validacao

```powershell
npm run lint
npm run test
npm run build
npm run lint:mobile
npm exec --workspace mobile -- expo install --check
npm run e2e
npm exec --workspace mobile -- expo export --platform ios --output-dir ..\tmp\expo-export-mobile
docker compose -f docker-compose.yml -f docker-compose.dbeaver.yml ps
curl.exe -k https://localhost/health
curl.exe http://127.0.0.1/health
```

## Ultima Execucao Registrada

Data: 10/09/2026, com complementos visuais em 14/09/2026, 15/09/2026 e validacao master/cliente em 16/09/2026.

| Comando | Resultado | Observacao |
| --- | --- | --- |
| `git diff --check` | Passou em 15/09/2026 | Sem espacos finais ou conflitos de diff; apenas avisos normais de CRLF no Windows |
| `npm run lint` | Passou em 16/09/2026 | Shared, backend e frontend sem erro de TypeScript/ESLint |
| `npm run lint:mobile` | Passou em 16/09/2026 | App Expo/React Native sem erro de TypeScript |
| `npm run test` | Passou em 16/09/2026 | 17 testes de backend e 7 testes de frontend |
| `npm run build` | Passou em 16/09/2026 | Build de producao gerado para shared, backend e frontend; chunk principal em cerca de 307 KB |
| `npm exec --workspace mobile -- expo install --check` | Passou em 15/09/2026 | Dependencias do app mobile compativeis com Expo SDK 57 |
| `npm exec --workspace mobile -- expo export --platform ios --output-dir ..\tmp\expo-export-mobile` | Passou em 15/09/2026 | Metro gerou bundle iOS de `mobile/index.ts` |
| `npx expo start --host localhost --clear` | Passou em 08/09/2026 | Metro iniciou e aguardou conexao em `http://localhost:8081` |
| `npm run e2e` | Passou | Detectou Docker ativo e usou o perfil Docker/HTTPS automaticamente |
| `npm run e2e:docker` | Passou em 16/09/2026 | 5 testes ponta a ponta, incluindo acesso controlado, CRUDs e upload de imagem pela interface |
| Fluxo master/cliente via API | Passou em 16/09/2026 | `admin@shape.com.br` retornou `MASTER`; `gestor@shapeup.com.br` retornou `ADMIN`; cliente recebeu 403 em `/usuarios`; master cria clientes e tambem opera planos, alunos, treinos e imagens da propria academia |
| Docker/Nginx/HTTPS | Passou | Stack ativa; `/health` retornou `{"status":"ok"}`, upload admin retornou `201` e `/uploads/imagens/...` retornou `200 OK` com `Content-Type: image/png` |
| Docker/Nginx/HTTP local | Passou | `http://127.0.0.1/health`, `http://127.0.0.1/entrar` e login admin foram validados para teste manual sem bloqueio de certificado |
| Capturas Playwright da interface | Passou em 14/09/2026 | Login, painel, listagens, upload e painel mobile capturados sem warnings de console |
| Capturas dos formularios internos | Passou em 15/09/2026 | Planos, alunos, treinos e perfil revisados em desktop/mobile apos padronizacao visual |
| Auditoria NPM | Revisada | Dependencias diretas corrigidas e riscos residuais documentados em `docs/auditoria-dependencias.md` |
| Expo Go em celular fisico | Passou em 14/09/2026 | App abriu no celular apos login no Expo Go e no Expo CLI; falta apenas print final das abas operacionais |

## Usabilidade

Pontos aplicados:

- menu lateral no desktop;
- menu inferior no mobile;
- mensagens de sucesso e erro com toast;
- estados de carregamento;
- estado vazio quando nao ha registros;
- confirmacao antes de exclusao;
- formularios com mensagens de validacao claras;
- rotas em PT-BR para facilitar leitura durante a apresentacao.
- app Expo com tela de login, URL de API editavel, feedback de erro, pull-to-refresh, abas e CRUD administrativo em mobile.
- checklist visual criado em `docs/checklist-qa-interface.md` para revisar acabamento de telas, responsividade, textos e estados antes dos prints finais.
- primeira rodada de polimento removeu elementos decorativos excessivos, reduziu cantos de cards/botoes, corrigiu menu mobile e trocou graficos instaveis por barras legiveis.
- terceira rodada de polimento padronizou formularios internos de planos, alunos, treinos e perfil com layout compartilhado, textos de apoio e acoes consistentes.

## Compatibilidade

Pontos aplicados:

- frontend responsivo com Tailwind;
- app Expo/React Native preparado para validacao no Expo Go;
- testes E2E em navegador com Playwright;
- backend separado da interface;
- banco em Docker para reproduzir ambiente local;
- build de producao validado com Vite.

## Seguranca Basica

Pontos aplicados:

- senha salva com bcrypt;
- token JWT para rotas privadas;
- ProtectedRoute no frontend;
- middleware de autenticacao no backend;
- recuperacao de senha com token aleatorio;
- token de recuperacao salvo como hash;
- expiracao de token de recuperacao;
- validacao de e-mail, CPF e senha forte;
- validadores sensiveis centralizados em `shared` e reutilizados por web, mobile e backend;
- upload restrito a administradores;
- validacao de extensao, MIME type, tamanho maximo e assinatura real de imagem;
- nomes unicos para uploads usando UUID;
- respostas de erro padronizadas.

## Audit de Dependencias

Foi executado `npm install` para reconstruir corretamente os links dos workspaces apos a mudanca de pasta do projeto. A validacao corrigiu os links de `@shape/shared`, `@shape/backend` e `@shape/frontend`.

Historicamente tambem foi executado `npm audit fix` sem `--force` para corrigir dependencias vulneraveis sem aplicar quebras arriscadas no projeto. Tambem foram atualizados:

- `nodemailer` para `9.1.1`;
- `react-router-dom` para `7.18.2`;
- `esbuild` para `0.28.1` via override.

Observacao:
Na revisao de 10/09/2026, `nodemailer` e `vitest` foram atualizados e overrides minimos foram aplicados para dependencias transitivas com patch seguro. Na revisao de 14/09/2026, `recharts` foi removido do frontend e `npm audit fix --omit=dev` foi executado sem `--force`. Na revisao de 15/09/2026, o Expo foi alinhado ao SDK 57 e o audit ficou com 14 vulnerabilidades residuais, sem vulnerabilidades criticas ou baixas. Os riscos restantes ficam concentrados em Prisma e Expo/React Native/Metro e estao justificados em `docs/auditoria-dependencias.md`.

## Riscos e Melhorias Futuras

| Risco | Plano de melhoria |
| --- | --- |
| Inconsistencias visuais percebidas no site antes da apresentacao | Revisar prints finais e corrigir apenas regressao visivel antes do commit |
| Alertas residuais de dependencia informados pelo npm | Manter `docs/auditoria-dependencias.md` como justificativa e nao executar `npm audit fix --force` antes da entrega |
| App Expo ainda precisa de prints finais | Abrir no Expo Go, testar as abas pela rede local e anexar prints ao roteiro final |
| Escopo de acesso deve ser demonstrado na apresentacao | Explicar que o master cria clientes, o cliente administra a propria academia e login de aluno e evolucao futura |
| Upload de imagens foi implementado, mas precisa aparecer na demonstracao | Demonstrar tela `/imagens` e uma tentativa de arquivo invalido |
| Ainda nao ha logs visiveis no painel | Criar tela de auditoria |
| Teste E2E cobre CRUDs principais, mas nao todos os modulos novos | Expandir testes conforme novos modulos entrarem |
| Formularios internos ja revisados, mas ainda precisam entrar nos prints oficiais | Registrar evidencias finais de planos, alunos, treinos e perfil em desktop/mobile |

## Conclusao da Apresentacao

O Shape Up possui validacao tecnica suficiente para demonstrar confiabilidade do MVP. A dupla consegue mostrar nao so que o sistema funciona, mas tambem que existe preocupacao com experiencia do gestor, protecao de acesso, padrao de erro, responsividade e testes automatizados.
