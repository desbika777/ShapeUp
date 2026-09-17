# Guia de Comandos do Dia a Dia

## Ideia Central

Quando voce estiver trabalhando comigo no Codex, eu posso rodar os comandos tecnicos, validar erros e preparar commits. Quando voce estiver sozinho no Visual Studio Code, use este guia como referencia curta para abrir, testar e apresentar o projeto.

## Abrir o Projeto Web

1. Entrar na pasta do projeto:

```powershell
cd C:\Users\enzog\Desktop\ShapeUpNew
```

2. Subir banco, API e site:

```powershell
docker compose up -d
```

3. Abrir no navegador:

```text
http://127.0.0.1
```

Use `http://127.0.0.1`, nao `https://localhost`.

## Abrir o App no Expo Go

1. Garantir que o Docker esta rodando:

```powershell
docker compose -f docker-compose.yml -f docker-compose.dbeaver.yml -f docker-compose.expo.yml --env-file .env up -d
```

2. Iniciar o Expo ja com a URL correta da API:

```powershell
npm run dev:mobile:lan
```

3. No Expo Go do celular, abrir `Shape Up Mobile` ou escanear o QR Code.
4. Na tela de login, conferir o campo `URL da API`.

O valor deve seguir este formato:

```text
http://SEU_IP_DA_MAQUINA:3333/api
```

Exemplo detectado em 15/09/2026:

```text
http://192.168.100.53:3333/api
```

Se o Expo Go nao encontrar o projeto pela rede local, tente o modo tunnel:

```powershell
npm run dev:mobile:tunnel
```

Mesmo no modo tunnel, a URL da API ainda precisa usar o IP do computador, nao `127.0.0.1`.

## Teste Rapido Da API Para O Celular

No navegador do celular, tente abrir:

```text
http://SEU_IP_DA_MAQUINA:3333/health
```

Se aparecer `{"status":"ok"}`, o celular consegue enxergar a API.

## Testar Antes de Entregar

```powershell
npm run lint
npm run test
npm run lint:mobile
npm run build --workspace frontend
npm run e2e
```

Se algum comando falhar, nao faca commit antes de corrigir ou registrar a pendencia.

## Commits e Push

O ideal e fazer commit somente depois de uma entrega coerente e validada. Fluxo padrao:

```powershell
git status
git add .
git commit -m "mensagem curta da entrega"
git push
```

Durante nossas sessoes, eu posso preparar e executar esse fluxo quando voce pedir. Evite fazer commits aleatorios no meio de uma correcao incompleta.

## Credenciais Locais de Demonstracao

Gestor administrador:

```text
admin@shape.com.br
Shape@123
```
