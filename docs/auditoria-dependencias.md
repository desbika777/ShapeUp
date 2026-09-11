# Auditoria de Dependencias NPM - Shape

## Objetivo

Registrar a revisao de vulnerabilidades do projeto sem aplicar correcoes arriscadas que possam quebrar a entrega final. Este arquivo serve como evidencia de seguranca e criterio de decisao tecnica.

## Data da Revisao

10/09/2026.

## Resultado Inicial

Antes das correcoes pontuais, `npm audit --json` reportou:

| Severidade | Quantidade |
| --- | ---: |
| Critica | 0 |
| Alta | 13 |
| Moderada | 14 |
| Baixa | 2 |
| Total | 29 |

## Correcoes Aplicadas

| Pacote | Acao | Motivo |
| --- | --- | --- |
| `nodemailer` | Atualizado de `9.0.4` para `9.1.1` no backend | Corrige vulnerabilidades diretas de envio/processamento de e-mail sem mudanca major |
| `vitest` | Atualizado para `4.1.11` no backend e frontend | Corrige vulnerabilidade de ferramenta de teste sem alterar runtime da aplicacao |
| `@humanfs/node` | Override para `0.16.8` | Corrige vulnerabilidade transitiva do ecossistema ESLint |
| `esbuild` | Override para `0.28.1` | Corrige vulnerabilidade transitiva usada por Vite/tsx |
| `js-yaml` | Override para `4.3.2` | Corrige vulnerabilidade transitiva usada por ferramentas |
| `nanoid` | Override para `3.3.19` | Corrige vulnerabilidade transitiva usada por PostCSS |
| `postcss-selector-parser` | Override para `6.1.4` | Corrige vulnerabilidade transitiva usada por Tailwind/PostCSS |
| `qs` | Override para `6.16.0` | Corrige vulnerabilidade transitiva usada por Express/Superagent |

## Resultado Depois Das Correcoes

Depois das correcoes pontuais, `npm audit --json` reportou:

| Severidade | Quantidade |
| --- | ---: |
| Critica | 0 |
| Alta | 11 |
| Moderada | 10 |
| Baixa | 0 |
| Total | 21 |

Leitura por workspace:

| Workspace | Comando | Resultado |
| --- | --- | --- |
| Frontend | `npm audit --workspace frontend --omit=dev --json` | 0 vulnerabilidades em dependencias de producao |
| Backend | `npm audit --workspace backend --omit=dev --json` | 4 vulnerabilidades altas associadas ao bloco Prisma/deepmerge-ts |
| Mobile | `npm audit --workspace mobile --omit=dev --json` | 17 vulnerabilidades associadas ao bloco Expo/React Native/Metro |

## Riscos Residuais Justificados

| Bloco | Situacao | Decisao |
| --- | --- | --- |
| Prisma / `deepmerge-ts` | O audit aponta `prisma@6.19.3` via `@prisma/config` e sugere downgrade para `6.12.0` ou mudancas de linha. | Manter `6.19.3` para preservar compatibilidade com schema, migrations, Prisma Client e Docker. Reavaliar apos a entrega ou quando houver patch estavel sem downgrade. |
| Expo / React Native / Metro | O projeto usa `expo@57.0.21`, ultima versao da linha 57, e `react-native@0.86.3`, ultima versao da linha 0.86. O audit sugere caminho incompativel, incluindo downgrade de Expo para `46.0.21`. | Nao aplicar downgrade. Manter Expo SDK 57 porque foi a versao validada por `npx expo install --check`. |
| `image-size` via Metro | A versao publicada mais recente consultada foi `2.0.2`, ainda dentro da faixa apontada pelo audit. | Aguardar patch upstream. O uso esta concentrado em ferramenta de bundling mobile, nao em endpoint publico do backend. |
| `uuid` via `xcode` do Expo | O pacote vem por `@expo/config-plugins`/`xcode`; a correcao sugerida pelo audit passa por trocar a linha do Expo. | Manter versao compativel com SDK 57 e registrar risco residual. |

## Decisao Tecnica

Nao executar `npm audit fix --force` antes da entrega final. O comando tentaria alterar versoes sensiveis de Expo, React Native e Prisma, com risco maior de quebrar a demonstracao do que de reduzir risco real do MVP.

## Validacao Apos Correcoes

Depois das atualizacoes, os comandos abaixo passaram:

| Comando | Resultado |
| --- | --- |
| `git diff --check` | Passou |
| `npx expo install --check` | Passou |
| `npm run lint` | Passou |
| `npm run test` | Passou com 17 testes de backend e 7 de frontend |
| `npm run build` | Passou, mantendo apenas aviso conhecido de bundle acima de 500 KB |
| `npm run lint:mobile` | Passou |
| `npm run e2e` | Passou com 5 testes Playwright no perfil Docker/HTTPS |

## Comandos Usados

```powershell
npm audit --json
npm audit fix --dry-run --json
npm install nodemailer@9.1.1 --save-exact --workspace backend
npm install vitest@4.1.11 --save-dev --workspace backend --workspace frontend
npm update @humanfs/node esbuild js-yaml nanoid postcss-selector-parser qs
npm audit --workspace frontend --omit=dev --json
npm audit --workspace backend --omit=dev --json
npm audit --workspace mobile --omit=dev --json
npx expo install --check
npm run lint
npm run test
npm run build
npm run lint:mobile
npm run e2e
```
