# Pacote Final de Evidencias - Shape

## Objetivo

Centralizar o que deve ser aberto, testado, mostrado e fotografado na reta final da entrega. Na proxima execucao, o foco deve ser validar o site em `http://127.0.0.1` para evitar bloqueio de certificado no navegador e registrar evidencias visuais.

## Estado Atual

| Area | Status | Evidencia |
| --- | --- | --- |
| Branch GitHub | Base sincronizada antes da auditoria; nova etapa deve ser commitada apos validacao | `feature/documentacao-rubrica` |
| Upload Multer | Concluido | Tela `/imagens`, endpoint `POST /api/imagens`, validacoes e E2E |
| Refatoracao final | Concluida | `shared`, helper HTTP, app Expo e validadores reutilizados |
| Auditoria NPM | Revisada e validada | `docs/auditoria-dependencias.md` |
| Roteiro final | Concluido | `docs/roteiro-final-apresentacao.md` |
| Expo Go fisico | Pendente controlado | Base tecnica pronta, sem print de celular ainda |

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
| Administrador | `admin@shape.com.br` | `Shape@123` | Criar, editar, excluir e enviar imagem |
| Usuario operacional | `usuario@shape.com.br` | `Usuario@123` | Demonstrar acesso limitado e bloqueio de rotas administrativas |

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
12. Sair e entrar como `usuario@shape.com.br`.
13. Confirmar que a area administrativa nao permite criar/editar/excluir nem acessar `/imagens`.
14. Voltar ao administrador e remover registros de teste, se necessario.

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
| Usuario operacional bloqueado em acao admin | R-14 |
| Terminal com `npm run e2e` passando | R-05 |
| Roadmap oficial aberto | R-08 e rastreabilidade geral |

## Arquivos Para Abrir Na Apresentacao

| Arquivo | Finalidade |
| --- | --- |
| `docs/roadmap-rubrica.md` | Fonte oficial de status por item da rubrica |
| `docs/requisitos.md` | RFs/RNFs e status implementado/planejado |
| `docs/modelagem-der.md` | DER e modelagem do banco |
| `docs/diagramas-uml.md` | Casos de uso, atividades e sequencias |
| `docs/arquitetura-evidencias.md` | Arquitetura e padronizacao |
| `docs/auditoria-dependencias.md` | Evidencia de revisao de seguranca NPM |
| `docs/roteiro-final-apresentacao.md` | Ordem de apresentacao |

## Pendencias Controladas

| Pendencia | Como tratar |
| --- | --- |
| Expo Go em celular fisico | Validar quando houver aparelho/rede disponivel e anexar print ao R-05 |
| Vulnerabilidades residuais de Prisma/Expo | Manter justificativa em `docs/auditoria-dependencias.md`; nao usar `npm audit fix --force` antes da entrega |
| Criterios NSA da rubrica | Confirmar com o professor ou manter justificativa de item nao verificavel |

## Pronto Para a Proxima Execucao

Na proxima execucao, iniciar direto pelo site:

1. Subir Docker se necessario.
2. Abrir `http://127.0.0.1`.
3. Executar o roteiro manual acima.
4. Registrar prints.
5. Atualizar R-05 no roadmap se as evidencias forem coletadas.

## Ultima Validacao Tecnica

Em 10/09/2026, depois da auditoria NPM, passaram:

- `npm run lint`;
- `npm run test`;
- `npm run build`;
- `npm run lint:mobile`;
- `npm run e2e`;
- `npx expo install --check`.
