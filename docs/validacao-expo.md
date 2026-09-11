# Validacao do Aplicativo Expo - Shape

## Objetivo

Este documento registra como executar o cliente mobile do Shape pelo Expo Go. Ele complementa as evidencias de compatibilidade da rubrica de Desenvolvimento para Dispositivos Moveis.

## O Que Foi Implementado

- Workspace `mobile` com Expo `57.0.21`, Expo SDK 57 e React Native `0.86.3`.
- Tela de login consumindo `POST /api/autenticacao/entrar`.
- Painel mobile consumindo indicadores, planos, alunos e treinos.
- URL da API configuravel por `EXPO_PUBLIC_API_URL` e editavel na propria tela de login.
- Componentes reutilizaveis para botao, campo de texto e card de metrica.
- Reuso de tipos e validadores do pacote `shared`.

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
$env:EXPO_PUBLIC_API_URL="http://SEU_IP_DA_MAQUINA:3333/api"
npm run dev:mobile
```

4. Abrir o Expo Go no celular e escanear o QR Code.

## Validacoes Ja Executadas

| Comando | Resultado | Evidencia |
| --- | --- | --- |
| `npm run lint:mobile` | Passou em 10/09/2026 | TypeScript do app mobile sem erros |
| `npx expo install --check` | Passou em 08/09/2026 | Dependencias compativeis com Expo SDK 57 |
| `npx expo start --host localhost --clear` | Passou | Metro iniciou e aguardou conexao em `http://localhost:8081` |
| `curl.exe http://127.0.0.1:3333/health` | Passou | Backend publicado pelo `docker-compose.expo.yml` para acesso do celular na rede local |
| Expo Go em celular fisico | Pendente controlado | Validacao adiada; a base tecnica segue pronta para teste quando houver aparelho/rede disponivel |

## Checklist Para Evidencia Final

- Abrir o app no Expo Go.
- Entrar com `admin@shape.com.br`.
- Confirmar que o painel carrega indicadores.
- Confirmar que planos, alunos e treinos aparecem nas listagens resumidas.
- Registrar print da tela de login e do painel carregado.
- Se o login falhar no celular, conferir se o celular e o computador estao na mesma rede Wi-Fi e se `EXPO_PUBLIC_API_URL` usa o IPv4 correto.
