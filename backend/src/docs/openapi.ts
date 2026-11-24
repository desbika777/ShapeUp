export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Shape Up API',
    version: '1.1.0',
    description:
      'Contrato OpenAPI da API do Shape Up, documentando autenticacao, usuarios, planos, alunos, treinos, painel e anexos.',
  },
  servers: [
    {
      url: 'http://localhost:3333/api',
      description: 'Backend local direto',
    },
    {
      url: 'http://localhost/api',
      description: 'Ambiente Docker via Nginx',
    },
    {
      url: 'https://shapeup.local/api',
      description: 'Ambiente Docker via Nginx com HTTPS local',
    },
  ],
  tags: [
    { name: 'Health', description: 'Disponibilidade da API' },
    { name: 'Autenticacao', description: 'Login, recuperacao de senha e sessao do usuario' },
    { name: 'Usuarios', description: 'Gestao de contas pelo perfil master' },
    { name: 'Planos', description: 'CRUD de planos comerciais da academia' },
    { name: 'Alunos', description: 'CRUD de alunos vinculados a planos' },
    { name: 'Treinos', description: 'CRUD de prescricoes de treino' },
    { name: 'Painel', description: 'Indicadores consolidados do dashboard' },
    { name: 'Imagens', description: 'Anexos operacionais enviados por upload' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Verifica se a API esta ativa',
        servers: [{ url: 'http://localhost:3333' }, { url: 'http://localhost' }],
        responses: {
          '200': {
            description: 'API ativa',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/autenticacao/cadastro': {
      post: {
        tags: ['Autenticacao'],
        summary: 'Bloqueia cadastro publico',
        responses: {
          '403': { $ref: '#/components/responses/ForbiddenError' },
        },
      },
    },
    '/autenticacao/entrar': {
      post: {
        tags: ['Autenticacao'],
        summary: 'Realiza login e devolve JWT',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login realizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthResponse' },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
        },
      },
    },
    '/autenticacao/esqueci-senha': {
      post: {
        tags: ['Autenticacao'],
        summary: 'Solicita recuperacao de senha',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ForgotPasswordInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Solicitacao processada',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MessageResponse' },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/autenticacao/redefinir-senha': {
      post: {
        tags: ['Autenticacao'],
        summary: 'Redefine senha usando token enviado por e-mail',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ResetPasswordInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Senha redefinida',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/MessageResponse' },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/usuarios/me': {
      get: {
        tags: ['Autenticacao'],
        summary: 'Retorna o usuario autenticado',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Usuario autenticado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
        },
      },
      put: {
        tags: ['Autenticacao'],
        summary: 'Atualiza dados do perfil autenticado',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateUserInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Perfil atualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '409': { $ref: '#/components/responses/ConflictError' },
        },
      },
    },
    '/usuarios': {
      get: {
        tags: ['Usuarios'],
        summary: 'Lista clientes cadastrados pelo master',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Usuarios encontrados',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/User' },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
        },
      },
      post: {
        tags: ['Usuarios'],
        summary: 'Cria cliente pelo master Shape Up',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateUserInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Cliente criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
          '409': { $ref: '#/components/responses/ConflictError' },
        },
      },
    },
    '/usuarios/{id}': {
      delete: {
        tags: ['Usuarios'],
        summary: 'Remove cliente da plataforma',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          '204': { description: 'Usuario removido' },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
          '404': { $ref: '#/components/responses/NotFoundError' },
        },
      },
    },
    '/planos': {
      get: {
        tags: ['Planos'],
        summary: 'Lista planos com filtros e paginacao',
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/Page' },
          { $ref: '#/components/parameters/PageSize' },
          { $ref: '#/components/parameters/Search' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['ATIVO', 'INATIVO'] } },
        ],
        responses: {
          '200': {
            description: 'Planos encontrados',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedPlans' },
              },
            },
          },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
        },
      },
      post: {
        tags: ['Planos'],
        summary: 'Cria plano comercial',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PlanInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Plano criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Plan' },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
        },
      },
    },
    '/planos/{id}': {
      get: {
        tags: ['Planos'],
        summary: 'Busca plano por ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          '200': {
            description: 'Plano encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Plan' },
              },
            },
          },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '404': { $ref: '#/components/responses/NotFoundError' },
        },
      },
      put: {
        tags: ['Planos'],
        summary: 'Atualiza plano',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/Id' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PlanInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Plano atualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Plan' },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
          '404': { $ref: '#/components/responses/NotFoundError' },
        },
      },
      delete: {
        tags: ['Planos'],
        summary: 'Remove plano sem alunos vinculados',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          '204': { description: 'Plano removido' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
          '404': { $ref: '#/components/responses/NotFoundError' },
          '409': { $ref: '#/components/responses/ConflictError' },
        },
      },
    },
    '/alunos': {
      get: {
        tags: ['Alunos'],
        summary: 'Lista alunos com filtros e paginacao',
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/Page' },
          { $ref: '#/components/parameters/PageSize' },
          { $ref: '#/components/parameters/Search' },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['ATIVO', 'INATIVO'] } },
          { name: 'planId', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'Alunos encontrados',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedStudents' },
              },
            },
          },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
        },
      },
      post: {
        tags: ['Alunos'],
        summary: 'Cria aluno vinculado a um plano',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StudentInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Aluno criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Student' },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
          '409': { $ref: '#/components/responses/ConflictError' },
        },
      },
    },
    '/alunos/{id}': {
      get: {
        tags: ['Alunos'],
        summary: 'Busca aluno por ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          '200': {
            description: 'Aluno encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Student' },
              },
            },
          },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '404': { $ref: '#/components/responses/NotFoundError' },
        },
      },
      put: {
        tags: ['Alunos'],
        summary: 'Atualiza aluno',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/Id' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/StudentInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Aluno atualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Student' },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
          '404': { $ref: '#/components/responses/NotFoundError' },
          '409': { $ref: '#/components/responses/ConflictError' },
        },
      },
      delete: {
        tags: ['Alunos'],
        summary: 'Remove aluno',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          '204': { description: 'Aluno removido' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
          '404': { $ref: '#/components/responses/NotFoundError' },
        },
      },
    },
    '/treinos': {
      get: {
        tags: ['Treinos'],
        summary: 'Lista treinos com filtros e paginacao',
        security: [{ bearerAuth: [] }],
        parameters: [
          { $ref: '#/components/parameters/Page' },
          { $ref: '#/components/parameters/PageSize' },
          { $ref: '#/components/parameters/Search' },
          { name: 'level', in: 'query', schema: { type: 'string', enum: ['INICIANTE', 'INTERMEDIARIO', 'AVANCADO'] } },
          { name: 'studentId', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': {
            description: 'Treinos encontrados',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedWorkouts' },
              },
            },
          },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
        },
      },
      post: {
        tags: ['Treinos'],
        summary: 'Cria treino para aluno cadastrado',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WorkoutInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Treino criado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Workout' },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
        },
      },
    },
    '/treinos/{id}': {
      get: {
        tags: ['Treinos'],
        summary: 'Busca treino por ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          '200': {
            description: 'Treino encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Workout' },
              },
            },
          },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '404': { $ref: '#/components/responses/NotFoundError' },
        },
      },
      put: {
        tags: ['Treinos'],
        summary: 'Atualiza treino',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/Id' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/WorkoutInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Treino atualizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Workout' },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
          '404': { $ref: '#/components/responses/NotFoundError' },
        },
      },
      delete: {
        tags: ['Treinos'],
        summary: 'Remove treino',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          '204': { description: 'Treino removido' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
          '404': { $ref: '#/components/responses/NotFoundError' },
        },
      },
    },
    '/painel/indicadores': {
      get: {
        tags: ['Painel'],
        summary: 'Retorna indicadores do dashboard',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Indicadores consolidados',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/DashboardIndicators' },
              },
            },
          },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
        },
      },
    },
    '/imagens': {
      get: {
        tags: ['Imagens'],
        summary: 'Lista anexos operacionais',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Anexos encontrados',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Attachment' },
                },
              },
            },
          },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
        },
      },
      post: {
        tags: ['Imagens'],
        summary: 'Envia anexo operacional',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: { $ref: '#/components/schemas/AttachmentUploadInput' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Anexo registrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Attachment' },
              },
            },
          },
          '400': { $ref: '#/components/responses/ValidationError' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
        },
      },
    },
    '/imagens/{id}': {
      delete: {
        tags: ['Imagens'],
        summary: 'Remove anexo operacional',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/Id' }],
        responses: {
          '204': { description: 'Anexo removido' },
          '401': { $ref: '#/components/responses/UnauthorizedError' },
          '403': { $ref: '#/components/responses/ForbiddenError' },
          '404': { $ref: '#/components/responses/NotFoundError' },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    parameters: {
      Id: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string' },
      },
      Page: {
        name: 'page',
        in: 'query',
        schema: { type: 'integer', minimum: 1, default: 1 },
      },
      PageSize: {
        name: 'pageSize',
        in: 'query',
        schema: { type: 'integer', minimum: 1, default: 10 },
      },
      Search: {
        name: 'search',
        in: 'query',
        schema: { type: 'string' },
      },
    },
    responses: {
      ValidationError: {
        description: 'Dados invalidos',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
      UnauthorizedError: {
        description: 'Token ausente, invalido ou expirado',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
      ForbiddenError: {
        description: 'Perfil sem permissao',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
      NotFoundError: {
        description: 'Recurso nao encontrado',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
      ConflictError: {
        description: 'Conflito de regra de negocio',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } },
      },
    },
    schemas: {
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', example: 'admin@shapeup.com' },
          password: { type: 'string', format: 'password', example: 'Senha@123' },
        },
      },
      ForgotPasswordInput: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', example: 'cliente@academia.com' },
        },
      },
      ResetPasswordInput: {
        type: 'object',
        required: ['token', 'password', 'confirmPassword'],
        properties: {
          token: { type: 'string', example: 'token-recebido-por-email' },
          password: { type: 'string', format: 'password', example: 'NovaSenha@123' },
          confirmPassword: { type: 'string', format: 'password', example: 'NovaSenha@123' },
        },
      },
      AuthResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          user: { $ref: '#/components/schemas/User' },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cm0000000000000000000000' },
          name: { type: 'string', example: 'Gestor Shape Up' },
          email: { type: 'string', example: 'gestor@academia.com' },
          cpf: { type: 'string', example: '12345678909' },
          perfil: { type: 'string', enum: ['MASTER', 'ADMIN'], example: 'ADMIN' },
          mustChangePassword: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      CreateUserInput: {
        type: 'object',
        required: ['name', 'email', 'password', 'confirmPassword', 'cpf'],
        properties: {
          name: { type: 'string', example: 'Cliente Academia Central' },
          email: { type: 'string', example: 'cliente@academia.com' },
          password: { type: 'string', format: 'password', example: 'Cliente@123' },
          confirmPassword: { type: 'string', format: 'password', example: 'Cliente@123' },
          cpf: { type: 'string', example: '12345678909' },
          perfil: { type: 'string', enum: ['ADMIN', 'MASTER'], example: 'ADMIN' },
        },
      },
      UpdateUserInput: {
        type: 'object',
        required: ['name', 'cpf'],
        properties: {
          name: { type: 'string', example: 'Gestor Atualizado' },
          cpf: { type: 'string', example: '12345678909' },
          currentPassword: { type: 'string', format: 'password', example: 'SenhaAtual@123' },
          password: { type: 'string', format: 'password', example: 'NovaSenha@123' },
          confirmPassword: { type: 'string', format: 'password', example: 'NovaSenha@123' },
        },
      },
      PlanInput: {
        type: 'object',
        required: ['name', 'description', 'price', 'durationMonths', 'status'],
        properties: {
          name: { type: 'string', example: 'Plano Mensal' },
          description: { type: 'string', example: 'Acesso livre a musculacao por um mes' },
          price: { type: 'number', example: 99.9 },
          durationMonths: { type: 'integer', example: 1 },
          status: { type: 'string', enum: ['ATIVO', 'INATIVO'], example: 'ATIVO' },
        },
      },
      Plan: {
        allOf: [
          { $ref: '#/components/schemas/PlanInput' },
          {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'cmplan000000000000000000' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        ],
      },
      StudentInput: {
        type: 'object',
        required: ['name', 'email', 'cpf', 'phone', 'birthDate', 'goal', 'status', 'planId'],
        properties: {
          name: { type: 'string', example: 'Ana Souza' },
          email: { type: 'string', example: 'ana.souza@email.com' },
          cpf: { type: 'string', example: '12345678909' },
          phone: { type: 'string', example: '(11) 99999-9999' },
          birthDate: { type: 'string', format: 'date', example: '1998-04-12' },
          goal: { type: 'string', example: 'Hipertrofia e condicionamento' },
          status: { type: 'string', enum: ['ATIVO', 'INATIVO'], example: 'ATIVO' },
          planId: { type: 'string', example: 'cmplan000000000000000000' },
        },
      },
      Student: {
        allOf: [
          { $ref: '#/components/schemas/StudentInput' },
          {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'cmstudent000000000000000' },
              planName: { type: 'string', example: 'Plano Mensal' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        ],
      },
      WorkoutInput: {
        type: 'object',
        required: ['studentId', 'title', 'objective', 'level', 'notes', 'startDate', 'endDate'],
        properties: {
          studentId: { type: 'string', example: 'cmstudent000000000000000' },
          title: { type: 'string', example: 'Treino A - Superiores' },
          objective: { type: 'string', example: 'Ganho de massa muscular' },
          level: { type: 'string', enum: ['INICIANTE', 'INTERMEDIARIO', 'AVANCADO'], example: 'INTERMEDIARIO' },
          notes: { type: 'string', example: 'Priorizar tecnica e descanso adequado' },
          startDate: { type: 'string', format: 'date', example: '2026-09-28' },
          endDate: { type: 'string', format: 'date', example: '2026-10-28' },
        },
      },
      Workout: {
        allOf: [
          { $ref: '#/components/schemas/WorkoutInput' },
          {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'cmworkout00000000000000' },
              studentName: { type: 'string', example: 'Ana Souza' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        ],
      },
      PaginationMeta: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          pageSize: { type: 'integer', example: 10 },
          totalItems: { type: 'integer', example: 25 },
          totalPages: { type: 'integer', example: 3 },
        },
      },
      PaginatedPlans: {
        type: 'object',
        properties: {
          data: { type: 'array', items: { $ref: '#/components/schemas/Plan' } },
          meta: { $ref: '#/components/schemas/PaginationMeta' },
        },
      },
      PaginatedStudents: {
        type: 'object',
        properties: {
          data: { type: 'array', items: { $ref: '#/components/schemas/Student' } },
          meta: { $ref: '#/components/schemas/PaginationMeta' },
        },
      },
      PaginatedWorkouts: {
        type: 'object',
        properties: {
          data: { type: 'array', items: { $ref: '#/components/schemas/Workout' } },
          meta: { $ref: '#/components/schemas/PaginationMeta' },
        },
      },
      DashboardIndicators: {
        type: 'object',
        properties: {
          totals: {
            type: 'object',
            properties: {
              students: { type: 'integer', example: 42 },
              activePlans: { type: 'integer', example: 3 },
              workouts: { type: 'integer', example: 18 },
              newStudentsThisMonth: { type: 'integer', example: 7 },
            },
          },
          studentsByPlan: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Plano Mensal' },
                students: { type: 'integer', example: 20 },
              },
            },
          },
          workoutsByLevel: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                level: { type: 'string', enum: ['INICIANTE', 'INTERMEDIARIO', 'AVANCADO'] },
                workouts: { type: 'integer', example: 8 },
              },
            },
          },
          recentStudents: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string', example: 'Ana Souza' },
                goal: { type: 'string', example: 'Hipertrofia' },
                status: { type: 'string', enum: ['ATIVO', 'INATIVO'] },
                createdAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
      AttachmentUploadInput: {
        type: 'object',
        required: ['imagem'],
        properties: {
          imagem: { type: 'string', format: 'binary' },
          category: {
            type: 'string',
            enum: ['COMPROVANTE', 'AVALIACAO', 'MANUTENCAO', 'DOCUMENTO', 'OUTRO'],
            example: 'DOCUMENTO',
          },
          description: { type: 'string', maxLength: 180, example: 'Contrato ou comprovante do aluno' },
        },
      },
      Attachment: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'cmattach0000000000000' },
          category: {
            type: 'string',
            enum: ['COMPROVANTE', 'AVALIACAO', 'MANUTENCAO', 'DOCUMENTO', 'OUTRO'],
            example: 'DOCUMENTO',
          },
          description: { type: 'string', nullable: true, example: 'Contrato do aluno' },
          originalName: { type: 'string', example: 'contrato.pdf' },
          fileName: { type: 'string', example: '1699999999999-contrato.pdf' },
          mimeType: { type: 'string', example: 'application/pdf' },
          size: { type: 'integer', example: 102400 },
          extension: { type: 'string', example: '.pdf' },
          relativePath: { type: 'string', example: '/uploads/1699999999999-contrato.pdf' },
          url: { type: 'string', example: 'http://localhost:3333/uploads/1699999999999-contrato.pdf' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      MessageResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Operacao realizada com sucesso.' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Campos invalidos enviados para a requisicao.' },
          details: {
            type: 'array',
            items: { type: 'string' },
            example: ['Informe um e-mail valido.'],
          },
        },
      },
    },
  },
};
