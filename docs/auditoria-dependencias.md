# Auditoria de Dependencias NPM - Shape Up

## Objetivo

Registrar a revisao de vulnerabilidades do projeto sem aplicar correcoes arriscadas que possam quebrar a entrega final. Este arquivo serve como evidencia de seguranca e criterio de decisao tecnica.

## Data da Revisao

10/09/2026, com atualizacoes complementares em 14/09/2026 e 15/09/2026 apos a refatoracao visual do frontend e a evolucao do app Expo.

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
| `recharts` | Removido do frontend | O painel passou a usar barras proporcionais em HTML/CSS; remove dependencia pesada e reduz bundle |
| `npm audit fix --omit=dev` | Executado sem `--force` em 14/09/2026 e reexecutado em 15/09/2026 | Aplicou correcoes seguras do lockfile e atualizou blocos transitivos de Expo/Metro sem alterar linha major |
| `react-native-safe-area-context` | Instalado com `expo install` | Substitui `SafeAreaView` depreciado do React Native no app Expo |
| `expo` | Atualizado para `~57.0.23` | Alinha dependencias ao Expo SDK 57 conforme `expo install --check` de 15/09/2026 |

## Resultado Depois Das Correcoes

Depois das correcoes pontuais, da limpeza do frontend, do `npm audit fix --omit=dev` e do alinhamento do Expo em 15/09/2026, `npm audit --omit=dev` reportou:

| Severidade | Quantidade |
| --- | ---: |
| Critica | 0 |
| Alta | 4 |
| Moderada | 10 |
| Baixa | 0 |
| Total | 14 |

Leitura por workspace:

| Workspace | Comando | Resultado |
| --- | --- | --- |
| Frontend | `npm audit --workspace frontend --omit=dev --json` | 0 vulnerabilidades em dependencias de producao |
| Backend | `npm audit --workspace backend --omit=dev` | 4 vulnerabilidades altas associadas ao bloco Prisma/deepmerge-ts |
| Mobile | `npm audit --workspace mobile --omit=dev` | 10 vulnerabilidades moderadas associadas ao bloco Expo/React Native/Metro |

Observacao: o audit geral e o audit por workspace podem apresentar contagens diferentes por deduplicacao do npm. Na revisao atual, o total defendivel e 14 vulnerabilidades residuais: 4 altas associadas a Prisma/deepmerge-ts e 10 moderadas associadas a Expo/uuid.

## Riscos Residuais Justificados

| Bloco | Situacao | Decisao |
| --- | --- | --- |
| Prisma / `deepmerge-ts` | O audit aponta `prisma@6.19.3` via `@prisma/config` e sugere downgrade para `6.12.0` ou mudancas de linha. | Manter `6.19.3` para preservar compatibilidade com schema, migrations, Prisma Client e Docker. Reavaliar apos a entrega ou quando houver patch estavel sem downgrade. |
| Expo / React Native / Metro | O projeto usa `expo@~57.0.23` e `react-native@0.86.3`, alinhados ao Expo SDK 57. O audit sugere caminho incompativel, incluindo downgrade de Expo para `46.0.21`. | Nao aplicar downgrade. Manter Expo SDK 57 porque foi a versao validada por `npm exec --workspace mobile -- expo install --check`. |
| `uuid` via `xcode` do Expo | O pacote vem por `@expo/config-plugins`/`xcode`; a correcao sugerida pelo audit passa por trocar a linha do Expo. | Manter versao compativel com SDK 57 e registrar risco residual. |

## Decisao Tecnica

Nao executar `npm audit fix --force` antes da entrega final. O comando tentaria alterar versoes sensiveis de Expo, React Native e Prisma, com risco maior de quebrar a demonstracao do que de reduzir risco real do MVP.

## Validacao Apos Correcoes

Depois das atualizacoes, os comandos abaixo passaram:

| Comando | Resultado |
| --- | --- |
| `git diff --check` | Passou |
| `npm exec --workspace mobile -- expo install --check` | Passou |
| `npm run lint` | Passou |
| `npm run test` | Passou com 17 testes de backend e 7 de frontend |
| `npm run build` | Passou em 15/09/2026 sem aviso de bundle acima de 500 KB; chunk principal ficou em torno de 306 KB |
| `npm run lint:mobile` | Passou |
| `npm run e2e` | Passou com 5 testes Playwright no perfil Docker/HTTPS |
| `expo export --platform ios` | Passou em 15/09/2026 |

## Comandos Usados

```powershell
npm audit --json
npm audit fix --dry-run --json
npm install nodemailer@9.1.1 --save-exact --workspace backend
npm install vitest@4.1.11 --save-dev --workspace backend --workspace frontend
npm update @humanfs/node esbuild js-yaml nanoid postcss-selector-parser qs
npm uninstall recharts --workspace frontend
npm audit --workspace frontend --omit=dev --json
npm audit --workspace backend --omit=dev --json
npm audit --workspace mobile --omit=dev --json
npm audit fix --omit=dev
npm exec --workspace mobile -- expo install react-native-safe-area-context
npm exec --workspace mobile -- expo install --check
npm run lint
npm run test
npm run build
npm run lint:mobile
npm run e2e
npm exec --workspace mobile -- expo export --platform ios --output-dir ..\tmp\expo-export-mobile
```
