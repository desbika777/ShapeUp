import { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import type { EntradaTreino, NivelTreino, Treino } from '@shape/shared';
import { ActionButton } from '../../components/ActionButton';
import { EmptyMessage } from '../../components/EmptyMessage';
import { Message } from '../../components/Message';
import { OptionGroup } from '../../components/OptionGroup';
import { RecordCard } from '../../components/RecordCard';
import { Section } from '../../components/Section';
import { TextButton } from '../../components/TextButton';
import { TextInputField } from '../../components/TextInputField';
import { apiRequest } from '../../lib/api';
import { formatDate, formatWorkoutLevel, toDateInputValue } from '../../lib/format';
import { spacing } from '../../theme';
import type { DashboardTabProps } from './types';

type WorkoutFormState = {
  studentId: string;
  title: string;
  objective: string;
  level: NivelTreino;
  notes: string;
  startDate: string;
  endDate: string;
};

function createEmptyWorkoutForm(studentId = ''): WorkoutFormState {
  return {
    endDate: '',
    level: 'INICIANTE',
    notes: '',
    objective: '',
    startDate: '',
    studentId,
    title: '',
  };
}

export function TreinosTab({ apiUrl, data, isAdmin, onRefresh, session }: DashboardTabProps) {
  const [editingWorkout, setEditingWorkout] = useState<Treino | null>(null);
  const [form, setForm] = useState<WorkoutFormState>(() => createEmptyWorkoutForm(data.students[0]?.id ?? ''));
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  const studentOptions = useMemo(
    () => data.students.map((student) => ({
      description: student.status === 'ATIVO' ? student.planName ?? 'Aluno ativo' : 'Aluno inativo',
      disabled: student.status !== 'ATIVO' && form.studentId !== student.id,
      label: student.name,
      value: student.id,
    })),
    [data.students, form.studentId],
  );

  useEffect(() => {
    if (!form.studentId && data.students.length) {
      setForm((current) => ({ ...current, studentId: data.students[0].id }));
    }
  }, [data.students, form.studentId]);

  function updateForm<Key extends keyof WorkoutFormState>(key: Key, value: WorkoutFormState[Key]) {
    setFeedback('');
    setForm((current) => ({ ...current, [key]: value }));
  }

  function resetForm() {
    setEditingWorkout(null);
    setForm(createEmptyWorkoutForm(data.students[0]?.id ?? ''));
  }

  function startEdit(workout: Treino) {
    setEditingWorkout(workout);
    setForm({
      endDate: toDateInputValue(workout.endDate),
      level: workout.level,
      notes: workout.notes,
      objective: workout.objective,
      startDate: toDateInputValue(workout.startDate),
      studentId: workout.studentId,
      title: workout.title,
    });
    setFeedback('');
  }

  async function saveWorkout() {
    if (!form.studentId) {
      setFeedback('Selecione um aluno.');
      return;
    }

    if (form.title.trim().length < 3) {
      setFeedback('Informe o titulo do treino.');
      return;
    }

    if (form.objective.trim().length < 5) {
      setFeedback('Informe o objetivo do treino.');
      return;
    }

    if (form.notes.trim().length < 5) {
      setFeedback('Descreva observacoes importantes.');
      return;
    }

    if (!form.startDate || !form.endDate) {
      setFeedback('Informe o periodo do treino.');
      return;
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
      setFeedback('A data final deve ser igual ou posterior a data inicial.');
      return;
    }

    setSaving(true);
    setFeedback('');

    const body: EntradaTreino = {
      endDate: form.endDate,
      level: form.level,
      notes: form.notes.trim(),
      objective: form.objective.trim(),
      startDate: form.startDate,
      studentId: form.studentId,
      title: form.title.trim(),
    };

    try {
      await apiRequest<Treino>(apiUrl, editingWorkout ? `/treinos/${editingWorkout.id}` : '/treinos', {
        body: JSON.stringify(body),
        method: editingWorkout ? 'PUT' : 'POST',
        token: session.token,
      });
      resetForm();
      setFeedback(editingWorkout ? 'Treino atualizado com sucesso.' : 'Treino cadastrado com sucesso.');
      await onRefresh();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Nao foi possivel salvar o treino.');
    } finally {
      setSaving(false);
    }
  }

  async function deleteWorkout(workout: Treino) {
    setSaving(true);
    setFeedback('');

    try {
      await apiRequest<void>(apiUrl, `/treinos/${workout.id}`, {
        method: 'DELETE',
        token: session.token,
      });
      if (editingWorkout?.id === workout.id) resetForm();
      setFeedback('Treino excluido com sucesso.');
      await onRefresh();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Nao foi possivel excluir o treino.');
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete(workout: Treino) {
    Alert.alert('Excluir treino', `Deseja excluir ${workout.title}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => void deleteWorkout(workout) },
    ]);
  }

  return (
    <>
      {isAdmin ? (
        <Section title={editingWorkout ? 'Editar treino' : 'Novo treino'}>
          <View style={styles.form}>
            <OptionGroup label="Aluno" value={form.studentId} onChange={(value) => updateForm('studentId', value)} options={studentOptions} emptyMessage="Cadastre um aluno antes de criar treinos." />
            <OptionGroup
              label="Nivel"
              value={form.level}
              onChange={(value) => updateForm('level', value)}
              options={[
                { label: 'Iniciante', value: 'INICIANTE' },
                { label: 'Intermediario', value: 'INTERMEDIARIO' },
                { label: 'Avancado', value: 'AVANCADO' },
              ]}
            />
            <TextInputField label="Titulo" value={form.title} onChangeText={(value) => updateForm('title', value)} />
            <TextInputField label="Objetivo" value={form.objective} onChangeText={(value) => updateForm('objective', value)} multiline style={styles.textArea} />
            <TextInputField label="Inicio" placeholder="AAAA-MM-DD" value={form.startDate} onChangeText={(value) => updateForm('startDate', value)} />
            <TextInputField label="Fim" placeholder="AAAA-MM-DD" value={form.endDate} onChangeText={(value) => updateForm('endDate', value)} />
            <TextInputField label="Observacoes" value={form.notes} onChangeText={(value) => updateForm('notes', value)} multiline style={styles.textArea} />

            {feedback ? <Message tone={feedback.includes('sucesso') ? 'success' : 'danger'} body={feedback} /> : null}

            <View style={styles.formActions}>
              <View style={styles.formActionPrimary}>
                <ActionButton loading={saving} onPress={saveWorkout}>{editingWorkout ? 'Salvar treino' : 'Cadastrar treino'}</ActionButton>
              </View>
              {editingWorkout ? (
                <View style={styles.formActionSecondary}>
                  <ActionButton variant="secondary" onPress={resetForm}>Cancelar</ActionButton>
                </View>
              ) : null}
            </View>
          </View>
        </Section>
      ) : null}

      <Section title="Treinos prescritos">
        {data.workouts.length ? (
          data.workouts.map((workout) => (
            <RecordCard
              key={workout.id}
              title={workout.title}
              subtitle={workout.objective}
              badge={formatWorkoutLevel(workout.level)}
              details={[
                { label: 'Aluno', value: workout.studentName ?? '-' },
                { label: 'Periodo', value: `${formatDate(workout.startDate)} ate ${formatDate(workout.endDate)}` },
                { label: 'Notas', value: workout.notes },
              ]}
              actions={isAdmin ? (
                <View style={styles.cardActions}>
                  <TextButton label="Editar" onPress={() => startEdit(workout)} />
                  <TextButton label="Excluir" tone="danger" onPress={() => confirmDelete(workout)} />
                </View>
              ) : undefined}
            />
          ))
        ) : (
          <EmptyMessage>Nenhum treino cadastrado.</EmptyMessage>
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
