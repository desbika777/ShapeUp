# Checklist de QA Visual e Refatoracao de Interface - Shape Up

## Objetivo

Guiar a proxima etapa de polimento do site para que a interface pareca profissional, consistente e defendivel em banca. Este checklist existe para reforcar R-02 e R-05 sem perder controle de escopo.

## Regra de Execucao

1. Subir a stack Docker.
2. Abrir `http://127.0.0.1`.
3. Validar como master Shape Up e depois como cliente dono da academia.
4. Confirmar que a interface nao promete login de aluno nesta versao.
5. Corrigir uma tela por vez.
6. Rodar validacoes apos as correcoes.
7. Atualizar `docs/roadmap-rubrica.md` com o resultado.

## Atualizacao - 15/09/2026

- Primeira rodada visual executada em autenticacao, layout principal, painel, listagens, upload e mobile.
- Segunda rodada evoluiu gestores, imagens, tabelas responsivas e Expo operacional.
- Terceira rodada revisou os formularios internos web de planos, alunos, treinos e perfil, com componentes compartilhados de formulario, orientacoes laterais e capturas em desktop/mobile.
- O script `npm run dev:mobile:lan` foi criado para iniciar o Expo ja apontando a API para o IP correto da rede local.
- `recharts` foi removido; o painel usa barras proporcionais em HTML/CSS e as capturas Playwright ficaram sem warnings de console.
- O menu mobile do site deixou de ser fixo sobre o conteudo e passou a aparecer como grade horizontal abaixo do cabecalho.
- As tabelas do site agora renderizam cards em viewport mobile.
- O app Expo passou a ter abas e CRUD administrativo de planos, alunos e treinos.
- O build do frontend passou sem aviso de chunk acima de 500 KB depois do lazy loading das paginas.

## Checklist Por Tela

| Tela/fluxo | Padrao esperado | Pontos de inspeccao | Rubrica | Status |
| --- | --- | --- | --- | --- |
| Autenticacao | Visual serio, limpo e coerente com o produto | Login, cadastro, recuperacao e redefinicao com textos consistentes, mensagens claras, foco visivel e responsividade | R-02, R-05, R-14 | Concluido em primeira rodada |
| Layout principal | Navegacao previsivel e sem elementos sobrando | Menu, cabecalho, usuario logado, botao sair, espaco interno, estados ativos e comportamento mobile | R-01, R-02, R-05 | Concluido em primeira rodada |
| Painel | Informacao executiva facil de ler | Cards alinhados, graficos legiveis, metricas reais, estado vazio e ausencia de textos genericos | R-03, R-05, R-15 | Concluido em primeira rodada |
| Planos | CRUD com cara de sistema administrativo | Lista, filtros, paginacao, acoes, formularios, feedback de criacao/edicao/exclusao e valores monetarios | R-03, R-04, R-05 | Concluido em terceira rodada visual |
| Alunos | Fluxo de cadastro seguro e compreensivel | Vinculo com plano, validacao de CPF/e-mail, campos obrigatorios, estados de erro e tabela responsiva | R-03, R-04, R-05 | Concluido em terceira rodada visual |
| Treinos | Relacao clara entre aluno e treino | Escolha de aluno, datas, objetivo, edicao, exclusao e leitura da listagem | R-03, R-04, R-05 | Concluido em terceira rodada visual |
| Imagens | Demonstracao objetiva de Multer e seguranca | Upload valido, preview/link, metadados, erro de arquivo invalido, limite de tamanho e permissao ADMIN | R-05, R-12, R-13, R-14 | Concluido em segunda rodada visual |
| Clientes/perfil | Controle de acesso sem confusao | Master cria cliente, cliente administra propria academia, perfil atual e explicacao de aluno como evolucao futura | R-05, R-14 | Concluido em terceira rodada visual |
| Responsividade | Sem quebra em notebook e celular | Testar largura desktop, tablet e mobile; nao pode haver texto cortado, tabela invisivel ou botoes desalinhados | R-05 | Parcial controlado: principais telas e formularios revisados em desktop/mobile; falta coleta final de prints oficiais |
| App Expo | Experiencia mobile coerente com a proposta | Login, API local, painel, listagens, navegacao, feedback de erro e clareza do escopo demonstrado | R-02, R-03, R-04, R-05 | Concluido em base tecnica: acesso fisico, lint, export iOS e script LAN validados; falta print final no aparelho |
| Estados do sistema | Nenhuma tela parece inacabada | Loading, vazio, erro, sucesso, confirmacao e permissao negada com linguagem profissional | R-02, R-05 | Parcial: componentes base polidos; falta validar estados vazios e erros tela por tela |

## Checklist De Codigo Durante O Polimento

| Area | O que procurar | Acao esperada |
| --- | --- | --- |
| Componentes UI | Componentes duplicados ou com estilos divergentes | Consolidar em componentes existentes antes de criar novos |
| Paginas | JSX muito grande, logica misturada com markup ou nomes ruins | Extrair helpers pequenos somente quando reduzir complexidade real |
| Textos | Frases informais, genericas ou desalinhadas com academia | Padronizar tom profissional e PT-BR |
| Validacoes | Regras repetidas fora de `shared` ou services | Reutilizar validadores existentes |
| Tratamento de erro | Erros crus da API aparecendo para usuario final | Traduzir para mensagens claras sem esconder falhas importantes |
| Estilos | Paleta inconsistente, espacamento aleatorio, cards excessivos | Usar padrao existente e reduzir ruido visual |
| Responsividade | Classes que quebram em mobile | Ajustar grid, overflow, largura minima e quebras de texto |
| Testes | Fluxo alterado sem cobertura E2E/unitaria adequada | Atualizar teste quando houver mudanca de comportamento |

## Definicao De Pronto

- Site abre em `http://127.0.0.1` sem erro de certificado.
- Login master e login do cliente demo funcionam.
- CRUDs principais continuam funcionando.
- Upload valido e arquivo invalido sao demonstraveis.
- Nenhuma tela principal tem aparencia quebrada, texto solto ou estado sem acabamento.
- `npm run lint` passa.
- `npm run build` passa.
- `npm run e2e` passa.
- Roadmap oficial atualizado com a evidencia final.
