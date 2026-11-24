# Auditoria de Dependencias NPM - Shape Up

## Objetivo

Registrar a revisao de vulnerabilidades do projeto sem aplicar correcoes arriscadas que possam quebrar a entrega final. Este arquivo serve como evidencia de seguranca e criterio de decisao tecnica.

## Data da Revisao

10/09/2026, com atualizacoes complementares em 14/09/2026, 15/09/2026, 08/10/2026 e 23/11/2026.

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
| `npm audit fix --workspace backend --omit=dev` | Executado sem `--force` em 08/10/2026 | Removeu vulnerabilidades transitivas corrigiveis sem downgrade/major forcado, incluindo a critica apontada no backend |
| `nodemailer` | Atualizado para `10.0.16` no backend | Corrige vulnerabilidades diretas restantes de Nodemailer; `lint` e testes do backend passaram apos a atualizacao |

## Atualizacao Da Rubrica Nova 5

Depois da integracao de Redis, cache-aside, eventos e observabilidade, foi rodada nova auditoria focada no backend:

```powershell
npm audit --workspace backend --omit=dev --json
```

Resultado em 08/10/2026:

| Severidade | Quantidade |
| --- | ---: |
| Critica | 0 |
| Alta | 4 |
| Moderada | 0 |
| Baixa | 0 |
| Total | 4 |

Leitura:

- As vulnerabilidades corrigiveis sem `--force` foram tratadas.
- A vulnerabilidade critica transitiva que apareceu na revisao da Rubrica Nova 5 nao permanece no audit de producao do backend.
- Nodemailer foi atualizado para a linha 10.0.16 e validado com `npm run lint --workspace backend` e `npm run test --workspace backend`.
- As 4 vulnerabilidades residuais estao no bloco Prisma/deepmerge-ts, cujo fix sugerido pelo npm envolve instalar `prisma@6.12.0`, alterando a linha validada do projeto.

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

Observacao: o audit geral e o audit por workspace podem apresentar contagens diferentes por deduplicacao do npm. Os snapshots de 15/09/2026 (14 vulnerabilidades) e 23/11/2026 (8 vulnerabilidades) sao registros historicos; ambos foram supersedidos pela reauditoria final de 23/11/2026, registrada abaixo, com zero vulnerabilidades.

## Riscos Residuais Justificados

| Bloco | Situacao | Decisao |
| --- | --- | --- |
| Prisma / `deepmerge-ts` / `effect` | O snapshot anterior apontava vulnerabilidades altas no Prisma 6 e dependencias transitivas. | Atualizado para Prisma 7.10.1 com adapter MariaDB, config externa, client gerado no backend e migracao isolada validada. `deepmerge-ts` 8.0.2 e `effect` 3.22.1; sem alertas no audit atual. |
| Nodemailer | O audit anterior apontava riscos diretos na linha 9/10.0.8. | Atualizado para `10.0.16` em 08/10/2026; risco direto removido no audit de producao do backend. |
| Expo / `minimatch` via `@expo/fingerprint` | O snapshot anterior apontava vulnerabilidade moderada transitiva. | Mantido Expo SDK 57 e aplicado override compativel para `minimatch` 11.0.9; `expo install --check` passou e o audit atual nao reporta alertas. |

## Decisao Tecnica

As correcoes foram feitas com atualizacao controlada de major do Prisma e um override transitivo de escopo restrito para Expo. Nao foi usado `npm audit fix --force`; a migracao foi validada por lint, testes, build e E2E em Compose isolado antes de publicar.

## Reauditoria Final - 23/11/2026 (vigente)

Resultado de `npm audit` apos a atualizacao controlada do Prisma e as correcoes transitivas:

| Escopo | Resultado |
| --- | --- |
| Auditoria geral (`npm audit`) | 0 vulnerabilidades |
| Backend | 0 vulnerabilidades; Prisma e `@prisma/client` 7.10.1 com `@prisma/adapter-mariadb` 7.10.1 |
| Frontend | 0 vulnerabilidades |
| Mobile | 0 vulnerabilidades; `minimatch` 11.0.9 via override sob `@expo/fingerprint` |

Dependencias relevantes verificadas: `deepmerge-ts` 8.0.2 e `effect` 3.22.1. A verificacao `expo install --check` passou sem alterar o SDK 57. A migracao do Prisma foi exercitada no E2E com MySQL temporario; `npm run lint`, `npm run test` (28 testes), `npm run build`, `npm run lint:mobile` e `npm run e2e` (6/6) passaram. O build web emitiu apenas avisos nao fatais do Rollup sobre comentarios `@__PURE__` em Zod.

Esta auditoria e um snapshot local do lockfile em 23/11/2026. O workflow remoto do GitHub ainda precisa executar apos o push para registrar a validacao na branch.

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
npm install --workspace backend nodemailer@10.0.16
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
