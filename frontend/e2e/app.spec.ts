import { expect, test, type APIRequestContext, type Page, type TestInfo } from '@playwright/test';

const API_URL = process.env.E2E_API_URL ?? 'http://127.0.0.1:3333/api';
const PASSWORD = 'ShapeUp@123';
let sequence = 0;

function nextSeed(testInfo: TestInfo) {
  sequence += 1;
  return Date.now() + testInfo.workerIndex * 10_000 + testInfo.retry * 1_000 + sequence;
}

function validCpf(seed: number) {
  const base = String(100_000_000 + (Math.abs(seed) % 800_000_000)).padStart(9, '0');
  const digits = base.split('').map(Number);

  const first = digits.reduce((sum, digit, index) => sum + digit * (10 - index), 0);
  let firstCheck = (first * 10) % 11;
  firstCheck = firstCheck === 10 ? 0 : firstCheck;

  const secondBase = [...digits, firstCheck];
  const second = secondBase.reduce((sum, digit, index) => sum + digit * (11 - index), 0);
  let secondCheck = (second * 10) % 11;
  secondCheck = secondCheck === 10 ? 0 : secondCheck;

  return `${base}${firstCheck}${secondCheck}`;
}

function managerData(testInfo: TestInfo) {
  const seed = nextSeed(testInfo);
  return {
    name: `Gestor E2E ${seed}`,
    email: `gestor.${seed}@shapeup.test`,
    cpf: validCpf(seed),
    password: PASSWORD,
    confirmPassword: PASSWORD,
  };
}

async function expectApiOk(response: Awaited<ReturnType<APIRequestContext['post']>>) {
  if (!response.ok()) {
    throw new Error(`API retornou ${response.status()}: ${await response.text()}`);
  }
}

async function createManager(request: APIRequestContext, testInfo: TestInfo) {
  const manager = managerData(testInfo);
  const response = await request.post(`${API_URL}/auth/register`, { data: manager });
  await expectApiOk(response);
  const payload = await response.json() as { token: string };
  return { ...manager, token: payload.token };
}

async function createPlan(request: APIRequestContext, token: string, name: string) {
  const response = await request.post(`${API_URL}/plans`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      name,
      description: 'Plano criado para preparar cenarios E2E.',
      price: 149.9,
      durationMonths: 6,
      status: 'ACTIVE',
    },
  });
  await expectApiOk(response);
  return response.json() as Promise<{ id: string; name: string }>;
}

async function findPlanByName(request: APIRequestContext, token: string, name: string) {
  const response = await request.get(`${API_URL}/plans?search=${encodeURIComponent(name)}&page=1&pageSize=20`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  await expectApiOk(response);
  const payload = await response.json() as { data: Array<{ id: string; name: string }> };
  const plan = payload.data.find((item) => item.name === name);

  if (!plan) {
    throw new Error(`Plano ${name} nao encontrado pela API.`);
  }

  return plan;
}

async function createStudent(request: APIRequestContext, token: string, input: { planId: string; seed: number; name?: string }) {
  const response = await request.post(`${API_URL}/students`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      name: input.name ?? `Aluno Apoio ${input.seed}`,
      email: `apoio.${input.seed}@shapeup.test`,
      cpf: validCpf(input.seed + 700),
      phone: '11999997777',
      birthDate: '1996-08-20',
      goal: 'Condicionamento geral com acompanhamento',
      status: 'ACTIVE',
      planId: input.planId,
    },
  });
  await expectApiOk(response);
  return response.json() as Promise<{ id: string; name: string }>;
}

async function deleteStudent(request: APIRequestContext, token: string, id: string) {
  const response = await request.delete(`${API_URL}/students/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  await expectApiOk(response);
}

async function authenticate(page: Page, token: string) {
  await page.addInitScript((storedToken) => {
    window.localStorage.setItem('shapeup:token', storedToken);
  }, token);
}

async function fillRegisterForm(page: Page, input: ReturnType<typeof managerData>) {
  await page.getByLabel('Nome completo').fill(input.name);
  await page.getByLabel('E-mail').fill(input.email);
  await page.getByLabel('CPF').fill(input.cpf);
  await page.locator('input[name="password"]').fill(input.password);
  await page.locator('input[name="confirmPassword"]').fill(input.confirmPassword);
}

test.describe('autenticacao', () => {
  test('bloqueia cadastro invalido e cria usuario com sucesso', async ({ page }, testInfo) => {
    await page.goto('/register');

    await page.getByRole('button', { name: 'Cadastrar e entrar' }).click();
    await expect(page.getByText('Informe um nome com ao menos 3 caracteres.')).toBeVisible();
    await expect(page.getByText('Informe um e-mail valido.')).toBeVisible();

    const manager = managerData(testInfo);
    await fillRegisterForm(page, manager);
    await page.getByRole('button', { name: 'Cadastrar e entrar' }).click();

    await expect(page.getByText('Painel de desempenho')).toBeVisible();
  });

  test('exibe falha de login e autentica com credenciais validas', async ({ page, request }, testInfo) => {
    const manager = await createManager(request, testInfo);

    await page.goto('/login');
    await page.getByLabel('E-mail').fill(manager.email);
    await page.getByLabel('Senha').fill('SenhaErrada@123');
    await page.getByRole('button', { name: 'Entrar agora' }).click();
    await expect(page.getByText('Credenciais invalidas.')).toBeVisible();

    await page.getByLabel('Senha').fill(PASSWORD);
    await page.getByRole('button', { name: 'Entrar agora' }).click();
    await expect(page.getByText('Painel de desempenho')).toBeVisible();
  });
});

test.describe('CRUDs principais', () => {
  test('cadastra, edita, lista e exclui planos', async ({ page, request }, testInfo) => {
    const manager = await createManager(request, testInfo);
    const seed = nextSeed(testInfo);
    const planName = `Plano E2E ${seed}`;
    const editedName = `${planName} Plus`;

    await authenticate(page, manager.token);
    await page.goto('/plans');
    await expect(page.getByText('Catalogo comercial da academia')).toBeVisible();

    await page.getByRole('link', { name: 'Novo plano' }).click();
    await page.getByRole('button', { name: 'Salvar plano' }).click();
    await expect(page.getByText('Informe o nome do plano.')).toBeVisible();

    await page.getByLabel('Nome').fill(planName);
    await page.getByLabel('Descricao').fill('Plano E2E com acompanhamento completo.');
    await page.getByLabel('Valor').fill('199.90');
    await page.getByLabel('Duracao (meses)').fill('12');
    await page.getByLabel('Status').selectOption('ACTIVE');
    await page.getByRole('button', { name: 'Salvar plano' }).click();

    await expect(page.getByRole('row', { name: new RegExp(planName) })).toBeVisible();

    await page.getByRole('row', { name: new RegExp(planName) }).getByRole('link', { name: 'Editar' }).click();
    await page.getByLabel('Nome').fill(editedName);
    await page.getByRole('button', { name: 'Salvar plano' }).click();
    await expect(page.getByRole('row', { name: new RegExp(editedName) })).toBeVisible();

    const editedPlan = await findPlanByName(request, manager.token, editedName);
    const linkedStudent = await createStudent(request, manager.token, { planId: editedPlan.id, seed: seed + 100 });
    await page.getByRole('row', { name: new RegExp(editedName) }).getByRole('button', { name: 'Excluir' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Excluir' }).click();
    await expect(page.getByText('Nao e possivel excluir um plano vinculado a alunos.')).toBeVisible();
    await page.getByRole('dialog').getByLabel('Fechar').click();

    await deleteStudent(request, manager.token, linkedStudent.id);
    await page.getByRole('row', { name: new RegExp(editedName) }).getByRole('button', { name: 'Excluir' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Excluir' }).click();
    await expect(page.getByText('Plano excluido')).toBeVisible();
    await expect(page.getByRole('row', { name: new RegExp(editedName) })).toHaveCount(0);
  });

  test('cadastra, edita, lista e exclui alunos', async ({ page, request }, testInfo) => {
    const manager = await createManager(request, testInfo);
    const seed = nextSeed(testInfo);
    const plan = await createPlan(request, manager.token, `Plano Alunos ${seed}`);
    const studentName = `Aluno E2E ${seed}`;
    const editedName = `${studentName} Atualizado`;

    await authenticate(page, manager.token);
    await page.goto('/students');
    await expect(page.getByText('Carteira de alunos')).toBeVisible();

    await page.getByRole('link', { name: 'Novo aluno' }).click();
    await page.getByRole('button', { name: 'Salvar aluno' }).click();
    await expect(page.getByText('Informe o nome do aluno.')).toBeVisible();

    await page.getByLabel('Nome').fill(studentName);
    const studentEmail = `aluno.${seed}@shapeup.test`;
    const studentCpf = validCpf(seed + 200);
    await page.getByLabel('E-mail').fill(studentEmail);
    await page.getByLabel('CPF').fill(studentCpf);
    await page.getByLabel('Telefone').fill('11999998888');
    await page.getByLabel('Nascimento').fill('1998-04-15');
    await page.getByLabel('Objetivo').fill('Hipertrofia com ganho de forca');
    await page.getByLabel('Plano').selectOption(plan.id);
    await page.getByLabel('Status').selectOption('ACTIVE');
    await page.getByRole('button', { name: 'Salvar aluno' }).click();

    await expect(page.getByRole('row', { name: new RegExp(studentName) })).toBeVisible();

    await page.getByRole('link', { name: 'Novo aluno' }).click();
    await page.getByLabel('Nome').fill(`${studentName} Duplicado`);
    await page.getByLabel('E-mail').fill(studentEmail);
    await page.getByLabel('CPF').fill(validCpf(seed + 201));
    await page.getByLabel('Telefone').fill('11999998889');
    await page.getByLabel('Nascimento').fill('1999-05-12');
    await page.getByLabel('Objetivo').fill('Condicionamento fisico geral');
    await page.getByLabel('Plano').selectOption(plan.id);
    await page.getByLabel('Status').selectOption('ACTIVE');
    await page.getByRole('button', { name: 'Salvar aluno' }).click();
    await expect(page.getByText('Ja existe um aluno com este e-mail.')).toBeVisible();
    await page.goto('/students');

    await page.getByRole('row', { name: new RegExp(studentName) }).getByRole('link', { name: 'Editar' }).click();
    await page.getByLabel('Nome').fill(editedName);
    await page.getByRole('button', { name: 'Salvar aluno' }).click();
    await expect(page.getByRole('row', { name: new RegExp(editedName) })).toBeVisible();

    await page.getByRole('row', { name: new RegExp(editedName) }).getByRole('button', { name: 'Excluir' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Excluir' }).click();
    await expect(page.getByText('Aluno excluido')).toBeVisible();
    await expect(page.getByRole('row', { name: new RegExp(editedName) })).toHaveCount(0);
  });
});
