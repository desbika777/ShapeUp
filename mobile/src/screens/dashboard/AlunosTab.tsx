import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import type { Aluno, EntradaAluno, Plano } from '@shape/shared';
import { isValidCpf, isValidEmail } from '@shape/shared';
import { ActionButton } from '../../components/ActionButton';
import { EmptyMessage } from '../../components/EmptyMessage';
import { Message } from '../../components/Message';
import { OptionGroup } from '../../components/OptionGroup';
import { RecordCard } from '../../components/RecordCard';
import { Section } from '../../components/Section';
import { TextButton } from '../../components/TextButton';
import { TextInputField } from '../../components/TextInputField';
import { apiRequest } from '../../lib/api';
import { formatDate, formatStudentStatus, onlyDigits, toDateInputValue } from '../../lib/format';
import { spacing } from '../../theme';
import type { DashboardTabProps } from './types';

type StudentFormState = {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate: string;
  goal: string;
  status: EntradaAluno['status'];
  planId: string;
};

function createEmptyStudentForm(planId = ''): StudentFormState {
  return {
    birthDate: '',
    cpf: '',
    email: '',
    goal: '',
    name: '',
    phone: '',
    planId,
    status: 'ATIVO',
  };
}

function getInitialPlanId(plans: Plano[]) {
  return plans.find((plan) => plan.status === 'ATIVO')?.id ?? plans[0]?.id ?? '';
}

export function AlunosTab({ apiUrl, data, isAdmin, onRefresh, session }: DashboardTabProps) {
  const [editingStudent, setEditingStudent] = useState<Aluno | null>(null);
  const [form, setForm] = useState<StudentFormState>(() => createEmptyStudentForm(getInitialPlanId(data.plans)));
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  const planOptions = useMemo(
    () => data.plans.map((plan) => ({
      description: plan.status === 'ATIVO' ? 'Disponivel para matricula' : 'Plano inativo',
      disabled: plan.status !== 'ATIVO' && form.planId !== plan.id,
      label: plan.name,
      value: plan.id,
    })),
    [data.plans, form.planId],
  );

  useEffect(() => {
    if (!form.planId && data.plans.length) {
      setForm((current) => ({ ...current, planId: getInitialPlanId(data.plans) }));
    }
  }, [data.plans, form.planId]);

  function updateForm<Key extends keyof StudentFormState>(key: Key, value: StudentFormState[Key]) {
    setFeedback('');
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setEditingStudent(null);
    setForm(createEmptyStudentForm(getInitialPlanId(data.plans)));
  }

  function startEdit(student: Aluno) {
    setEditingStudent(student);
    setForm({
      birthDate: toDateInputValue(student.birthDate),
      cpf: student.cpf,
      email: student.email,
      goal: student.goal,
      name: student.name,
      phone: student.phone,
      planId: student.planId,
      status: student.status,
    });
    setFeedback('');
  }

  async function saveStudent() {
    const normalizedCpf = onlyDigits(form.cpf);

    if (form.name.trim().length < 3) {
      setFeedback('Informe o nome do aluno.');
      return;
    }

    if (!isValidEmail(form.email)) {
      setFeedback('Informe um e-mail valido.');
      return;
    }

    if (!isValidCpf(normalizedCpf)) {
      setFeedback('Informe um CPF valido.');
      return;
    }

    if (form.phone.trim().length < 8) {
      setFeedback('Informe um telefone valido.');
      return;
    }

    if (!form.birthDate) {
      setFeedback('Informe a data de nascimento.');
      return;
    }

    if (form.goal.trim().length < 5) {
      setFeedback('Informe o objetivo do aluno.');
      return;
    }

    if (!form.planId) {
      setFeedback('Selecione um plano.');
      return;
    }

    setSaving(true);
    setFeedback('');

    const body: EntradaAluno = {
      birthDate: form.birthDate,
      cpf: normalizedCpf,
      email: form.email.trim(),
      goal: form.goal.trim(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      planId: form.planId,
      status: form.status,
    };

    try {
      await apiRequest<Aluno>(apiUrl, editingStudent ? `/alunos/${editingStudent.id}` : '/alunos', {
        body: JSON.stringify(body),
        method: editingStudent ? 'PUT' : 'POST',
        token: session.token,
      });
      resetForm();
      setFeedback(editingStudent ? 'Aluno atualizado com sucesso.' : 'Aluno cadastrado com sucesso.');
      await onRefresh();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Nao foi possivel salvar o aluno.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteStudent(student: Aluno) {
    setSaving(true);
    setFeedback('');

    try {
      await apiRequest<void>(apiUrl, `/alunos/${student.id}`, {
        method: 'DELETE',
        token: session.token,
      });
      if (editingStudent?.id === student.id) resetForm();
      setFeedback('Aluno excluido com sucesso.');
      await onRefresh();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Nao foi possivel excluir o aluno.');
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete(student: Aluno) {
    Alert.alert('Excluir aluno', `Deseja excluir ${student.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => void deleteStudent(student) },
    ]);
  }

  return (
    <>
      {isAdmin ? (
        <Section title={editingStudent ? 'Editar aluno' : 'Novo aluno'}>
          <View style={styles.form}>
            <TextInputField label="Nome" value={form.name} onChangeText={(value) => updateForm('name', value)} />
            <TextInputField label="E-mail" autoCapitalize="none" keyboardType="email-address" value={form.email} onChangeText={(value) => updateForm('email', value)} />
            <TextInputField label="CPF" keyboardType="number-pad" value={form.cpf} onChangeText={(value) => updateForm('cpf', value)} />
            <TextInputField label="Telefone" keyboardType="phone-pad" value={form.phone} onChangeText={(value) => updateForm('phone', value)} />
            <TextInputField label="Nascimento" placeholder="AAAA-MM-DD" value={form.birthDate} onChangeText={(value) => updateForm('birthDate', value)} />
            <TextInputField label="Objetivo" value={form.goal} onChangeText={(value) => updateForm('goal', value)} multiline style={styles.textArea} />
            <OptionGroup label="Plano" value={form.planId} onChange={(value) => updateForm('planId', value)} options={planOptions} emptyMessage="Cadastre um plano antes de criar alunos." />
            <OptionGroup
              label="Status"
              value={form.status}
              onChange={(value) => updateForm('status', value)}
              options={[
                { label: 'Ativo', value: 'ATIVO' },
                { label: 'Inativo', value: 'INATIVO' },
              ]}
            />

            {feedback ? <Message tone={feedback.includes('sucesso') ? 'success' : 'danger'} body={feedback} /> : null}

            <View style={styles.formActions}>
              <View style={styles.formActionPrimary}>
                <ActionButton loading={saving} onPress={saveStudent}>{editingStudent ? 'Salvar aluno' : 'Cadastrar aluno'}</ActionButton>
              </View>
              {editingStudent ? (
                <View style={styles.formActionSecondary}>
                  <ActionButton variant="secondary" onPress={resetForm}>Cancelar</ActionButton>
                </View>
              ) : null}
            </View>
          </View>
        </Section>
      ) : null}

      <Section title="Carteira de alunos">
        {data.students.length ? (
          data.students.map((student) => (
            <RecordCard
              key={student.id}
              title={student.name}
              subtitle={student.email}
              badge={formatStudentStatus(student.status)}
              details={[
                { label: 'Plano', value: student.planName ?? '-' },
                { label: 'Objetivo', value: student.goal },
                { label: 'Nascimento', value: formatDate(student.birthDate) },
              ]}
              actions={isAdmin ? (
                <View style={styles.cardActions}>
                  <TextButton label="Editar" onPress={() => startEdit(student)} />
                  <TextButton label="Excluir" tone="danger" onPress={() => confirmDelete(student)} />
                </View>
              ) : undefined}
            />
          ))
        ) : (
          <EmptyMessage>Nenhum aluno cadastrado.</EmptyMessage>
        )}
      </Section>
    </>
  );
}

const styles = StyleSheet.create({
  cardActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  form: {
    gap: spacing.md,
  },
  formActionPrimary: {
    flex: 1,
    minWidth: 170,
  },
  formActionSecondary: {
    minWidth: 120,
  },
  formActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  textArea: {
    minHeight: 88,
    paddingTop: spacing.sm,
    textAlignVertical: 'top',
  },
});
