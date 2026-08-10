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

## Comandos de Validacao

```powershell
npm run lint
npm run test
npm run build
npm run e2e
```

## Ultima Execucao Registrada

Data: 10/08/2026.

| Comando | Resultado | Observacao |
| --- | --- | --- |
| `git diff --check` | Passou | Sem espacos finais ou conflitos de diff |
| `npm run lint` | Passou | Shared, backend e frontend sem erro de TypeScript/ESLint |
| `npm run test` | Passou | 13 testes de backend e 7 testes de frontend |
| `npm run build` | Passou | Build de producao gerado; houve aviso de bundle acima de 500 KB e Browserslist antigo |
| `npm run e2e` | Pendente de nova execucao | Sera executado novamente apos permissao por perfil e upload de imagens |
| `npm install` | Passou com alerta | 1 vulnerabilidade baixa apontada pelo npm |

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

## Compatibilidade

Pontos aplicados:

- frontend responsivo com Tailwind;
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
- respostas de erro padronizadas.

## Audit de Dependencias

Foi executado `npm install` para reconstruir corretamente os links dos workspaces apos a mudanca de pasta do projeto. A validacao corrigiu os links de `@shape/shared`, `@shape/backend` e `@shape/frontend`.

Historicamente tambem foi executado `npm audit fix` sem `--force` para corrigir dependencias vulneraveis sem aplicar quebras arriscadas no projeto. Tambem foram atualizados:

- `nodemailer` para `9.0.4`;
- `react-router-dom` para `7.18.2`;
- `esbuild` para `0.28.1` via override.

Observacao:
Na revisao de 10/08/2026, o `npm install` apontou 1 vulnerabilidade baixa. O risco fica registrado para acompanhamento e deve ser revisado novamente antes da entrega final.

## Riscos e Melhorias Futuras

| Risco | Plano de melhoria |
| --- | --- |
| Alerta baixo de dependencia informado pelo npm | Rodar `npm audit` antes da entrega final e corrigir sem `--force` quando possivel |
| Ainda nao ha controle completo de permissoes por perfil na interface | Evoluir perfis `perfis` e `usuario_perfis` |
| Ainda nao ha upload de imagens com Multer | Criar endpoint de upload e validacoes de arquivo |
| Ainda nao ha logs visiveis no painel | Criar tela de auditoria |
| Teste E2E cobre CRUDs principais, mas nao todos os modulos novos | Expandir testes conforme novos modulos entrarem |
| Bundle frontend acima de 500 KB | Aplicar code splitting futuramente |

## Conclusao da Apresentacao

O Shape possui validacao tecnica suficiente para demonstrar confiabilidade do MVP. A dupla consegue mostrar nao so que o sistema funciona, mas tambem que existe preocupacao com experiencia do usuario, protecao de acesso, padrao de erro, responsividade e testes automatizados.
