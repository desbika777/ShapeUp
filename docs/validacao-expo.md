# Validacao do Aplicativo Expo - Shape Up

## Objetivo

Este documento registra como executar o cliente mobile do Shape Up pelo Expo Go. Ele complementa as evidencias de compatibilidade da rubrica de Desenvolvimento para Dispositivos Moveis.

## O Que Foi Implementado

- Workspace `mobile` com Expo `~57.0.23`, Expo SDK 57 e React Native `0.86.3`.
- Tela de login consumindo `POST /api/autenticacao/entrar`.
- Painel mobile consumindo indicadores, planos, alunos e treinos.
- Navegacao por abas para `Painel`, `Planos`, `Alunos`, `Treinos` e `Conta`.
- CRUD administrativo de planos, alunos e treinos no app Expo, usando as mesmas rotas protegidas por JWT do sistema web.
- URL da API configuravel por `EXPO_PUBLIC_API_URL` e editavel na propria tela de login.
- Componentes reutilizaveis para botao, campo de texto e card de metrica.
- Reuso de tipos e validadores do pacote `shared`.
- Entrada explicita em `mobile/index.ts` para evitar resolucao incorreta do `expo/AppEntry` no monorepo.

## Observacao de Escopo

Em 14/09/2026, o app abriu no Expo Go em celular fisico apos login no Expo Go e no Expo CLI com a mesma conta. A validacao confirma compatibilidade mobile, consumo da API local e autenticacao JWT.

Depois da primeira validacao fisica, o app foi ampliado para uma experiencia administrativa: o gestor autenticado navega por abas, consulta indicadores/listas e consegue cadastrar, editar e excluir planos, alunos e treinos diretamente pelo celular. O objetivo nao e copiar pixel a pixel o layout desktop, e sim oferecer os fluxos principais em uma interface adequada para mobile.

## Como Executar

1. Subir a API com porta liberada para o celular:

```powershell
docker compose -f docker-compose.yml -f docker-compose.dbeaver.yml -f docker-compose.expo.yml --env-file .env up -d --build
```

2. Descobrir o IP local da maquina:

```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' } | Select-Object IPAddress, InterfaceAlias
```

3. Iniciar o Expo apontando para a API:

```powershell
npm run dev:mobile:lan
```

O script detecta o IP local, define `EXPO_PUBLIC_API_URL` e inicia o Expo em modo LAN. Se o Expo Go nao encontrar o projeto na rede local, usar:

```powershell
npm run dev:mobile:tunnel
```

4. Se estiver usando iPhone com Expo Go atual, entrar com a mesma conta Expo no celular e no terminal:

```powershell
npm exec --workspace mobile -- expo login
npm exec --workspace mobile -- expo whoami
```

5. Abrir o Expo Go no celular e escanear o QR Code ou tocar em `Shape Up Mobile` nos servidores de desenvolvimento.

## Validacoes Ja Executadas

| Comando | Resultado | Evidencia |
| --- | --- | --- |
| `npm run lint:mobile` | Passou em 10/09/2026 | TypeScript do app mobile sem erros |
| `npm run lint:mobile` | Passou em 14/09/2026 | TypeScript do app mobile sem erros apos ajuste da entrada `mobile/index.ts` |
| `npm run lint:mobile` | Passou em 15/09/2026 | TypeScript do app mobile sem erros apos abas e CRUDs mobile |
| `npm exec --workspace mobile -- expo install --check` | Passou em 15/09/2026 | Dependencias alinhadas ao Expo SDK 57 apos atualizar `expo` para `~57.0.23` |
| `npm exec --workspace mobile -- expo export --platform ios --output-dir ..\tmp\expo-export-mobile` | Passou em 15/09/2026 | Metro gerou bundle iOS de `mobile/index.ts` |
| `npx expo install --check` | Passou em 08/09/2026 | Dependencias compativeis com Expo SDK 57 |
| `npx expo start --host localhost --clear` | Passou | Metro iniciou e aguardou conexao em `http://localhost:8081` |
| `curl.exe http://127.0.0.1:3333/health` | Passou | Backend publicado pelo `docker-compose.expo.yml` para acesso do celular na rede local |
| `npm exec --workspace mobile -- expo whoami` | Passou em 14/09/2026 | Expo CLI autenticado como `enzinz7` |
| Expo Go em celular fisico | Passou em 14/09/2026 | Projeto mobile do Shape Up apareceu no Expo Go e abriu no aparelho apos login no app e no CLI |

## Checklist Para Evidencia Final

- Abrir o app no Expo Go.
- Entrar com `admin@shape.com.br`.
- Confirmar que o painel carrega indicadores.
- Confirmar que planos, alunos e treinos aparecem nas abas.
- Confirmar que o gestor consegue criar, editar e excluir um plano, aluno e treino de teste.
- Explicar que aluno com login fica como evolucao futura.
- Registrar print da tela de login, painel carregado e uma aba operacional.
- Se o login falhar no celular, conferir se o celular e o computador estao na mesma rede Wi-Fi e se `EXPO_PUBLIC_API_URL` usa o IPv4 correto.
- Antes de abrir o Expo Go, testar no navegador do celular `http://SEU_IP_DA_MAQUINA:3333/health`; o esperado e `{"status":"ok"}`.
