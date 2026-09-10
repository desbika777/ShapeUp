# Validacao de Usabilidade, Funcionalidade, Compatibilidade e Seguranca - Shape

## Objetivo

Este documento registra como o Shape atende ao criterio da rubrica sobre validacao da aplicacao. Ele pode ser usado como apoio para explicar que a dupla nao apenas codou telas, mas verificou funcionamento, usabilidade e seguranca basica.

## Funcionalidades Validadas

| Fluxo | Evidencia |
| --- | --- |
| Cadastro de gestor | Testes E2E e validacoes de formulario |
| Entrada no sistema | Testes E2E, JWT e tela protegida |
| Recuperacao de senha | Service, token com hash e tela dedicada |
| CRUD de planos | Tela, API, service, repository e testes |
| CRUD de alunos | Tela, API, service, repository e testes |
| CRUD de treinos | Tela, API, service, repository e testes |
| Dashboard | API de indicadores e graficos no frontend |
| Upload de imagens | Tela `/imagens`, Multer, storage local, validacao e testes |
| Aplicativo Expo | Workspace `mobile`, Expo Go, login, painel e listagens resumidas pela API |

## Comandos de Validacao

```powershell
npm run lint
npm run test
npm run build
npm run lint:mobile
npx expo install --check
npm run e2e
docker compose -f docker-compose.yml -f docker-compose.dbeaver.yml ps
curl.exe -k https://localhost/health
```

## Ultima Execucao Registrada

Data: 10/09/2026.

| Comando | Resultado | Observacao |
| --- | --- | --- |
| `git diff --check` | Passou | Sem espacos finais ou conflitos de diff |
| `npm run lint` | Passou | Shared, backend e frontend sem erro de TypeScript/ESLint |
| `npm run lint:mobile` | Passou | App Expo/React Native sem erro de TypeScript |
| `npm run test` | Passou | 17 testes de backend e 7 testes de frontend |
| `npm run build` | Passou | Build de producao gerado; houve aviso de bundle acima de 500 KB e Browserslist antigo |
| `npx expo install --check` | Passou em 08/09/2026 | Dependencias do app mobile compativeis com Expo SDK 57 |
| `npx expo start --host localhost --clear` | Passou em 08/09/2026 | Metro iniciou e aguardou conexao em `http://localhost:8081` |
| `npm run e2e` | Passou | Detectou Docker ativo e usou o perfil Docker/HTTPS automaticamente |
| `npm run e2e:docker` | Passou | 5 testes ponta a ponta, incluindo upload de imagem pela interface |
| Docker/Nginx/HTTPS | Passou | Stack ativa; `/health` retornou `{"status":"ok"}`, upload admin retornou `201` e `/uploads/imagens/...` retornou `200 OK` com `Content-Type: image/png` |
| `npm install` | Passou com alerta | npm apontou vulnerabilidades para revisao antes da entrega final |
| Expo Go em celular fisico | Pendente controlado | Nao foi possivel validar no aparelho nesta revisao; nao bloqueia commit da base tecnica |

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
- app Expo com tela de login, URL de API editavel, feedback de erro e pull-to-refresh no painel.

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

- `nodemailer` para `9.0.4`;
- `react-router-dom` para `7.18.2`;
- `esbuild` para `0.28.1` via override.

Observacao:
Na revisao de 08/09/2026, o `npm install` concluiu, mas apontou 26 vulnerabilidades entre dependencias diretas e transientes. O risco fica registrado para acompanhamento e deve ser revisado com `npm audit` antes da entrega final, sem aplicar `npm audit fix --force` automaticamente para evitar quebras no Expo, Vite, Prisma ou Playwright.

## Riscos e Melhorias Futuras

| Risco | Plano de melhoria |
| --- | --- |
| Alertas de dependencia informados pelo npm | Rodar `npm audit` antes da entrega final e corrigir sem `--force` quando possivel |
| App Expo ainda precisa de evidencia em celular fisico | Abrir no Expo Go, testar login pela rede local e anexar print ao roteiro final |
| Controle de permissoes deve ser demonstrado na apresentacao | Usar contas ADMIN e USUARIO do seed no roteiro |
| Upload de imagens foi implementado, mas precisa aparecer na demonstracao | Demonstrar tela `/imagens` e uma tentativa de arquivo invalido |
| Ainda nao ha logs visiveis no painel | Criar tela de auditoria |
| Teste E2E cobre CRUDs principais, mas nao todos os modulos novos | Expandir testes conforme novos modulos entrarem |
| Bundle frontend acima de 500 KB | Aplicar code splitting futuramente |

## Conclusao da Apresentacao

O Shape possui validacao tecnica suficiente para demonstrar confiabilidade do MVP. A dupla consegue mostrar nao so que o sistema funciona, mas tambem que existe preocupacao com experiencia do usuario, protecao de acesso, padrao de erro, responsividade e testes automatizados.
