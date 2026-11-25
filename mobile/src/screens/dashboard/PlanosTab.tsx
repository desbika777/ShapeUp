import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import type { EntradaPlano, Plano } from '@shape/shared';
import { ActionButton } from '../../components/ActionButton';
import { EmptyMessage } from '../../components/EmptyMessage';
import { Message } from '../../components/Message';
import { OptionGroup } from '../../components/OptionGroup';
import { RecordCard } from '../../components/RecordCard';
import { Section } from '../../components/Section';
import { TextButton } from '../../components/TextButton';
import { TextInputField } from '../../components/TextInputField';
import { apiRequest } from '../../lib/api';
import { formatCurrency, formatPlanStatus } from '../../lib/format';
import { spacing } from '../../theme';
import type { DashboardTabProps } from './types';

type PlanFormState = {
  name: string;
  description: string;
  price: string;
  durationMonths: string;
  status: EntradaPlano['status'];
};

const emptyPlanForm: PlanFormState = {
  name: '',
  description: '',
  price: '',
  durationMonths: '',
  status: 'ATIVO',
};

export function PlanosTab({ apiUrl, data, isAdmin, onRefresh, session }: DashboardTabProps) {
  const [editingPlan, setEditingPlan] = useState<Plano | null>(null);
  const [form, setForm] = useState<PlanFormState>(emptyPlanForm);
  const [feedback, setFeedback] = useState('');
  const [saving, setSaving] = useState(false);

  function updateForm<Key extends keyof PlanFormState>(key: Key, value: PlanFormState[Key]) {
    setFeedback('');
    setForm((current) => ({ ...current, [key]: value }));
  }

  function startEdit(plan: Plano) {
    setEditingPlan(plan);
    setForm({
      description: plan.description,
      durationMonths: String(plan.durationMonths),
      name: plan.name,
      price: String(plan.price),
      status: plan.status,
    });
    setFeedback('');
  }

  function resetForm() {
    setEditingPlan(null);
    setForm(emptyPlanForm);
  }

  async function savePlan() {
    const price = Number(form.price.replace(',', '.'));
    const durationMonths = Number(form.durationMonths);

    if (form.name.trim().length < 2) {
      setFeedback('Informe o nome do plano.');
      return;
    }

    if (form.description.trim().length < 10) {
      setFeedback('A descricao precisa ter pelo menos 10 caracteres.');
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setFeedback('Informe um valor valido.');
      return;
    }

    if (!Number.isInteger(durationMonths) || durationMonths <= 0) {
      setFeedback('Informe a duracao em meses.');
      return;
    }

    setSaving(true);
    setFeedback('');

    const body: EntradaPlano = {
      description: form.description.trim(),
      durationMonths,
      name: form.name.trim(),
      price,
      status: form.status,
    };

    try {
      await apiRequest<Plano>(apiUrl, editingPlan ? `/planos/${editingPlan.id}` : '/planos', {
        body: JSON.stringify(body),
        method: editingPlan ? 'PUT' : 'POST',
        token: session.token,
      });
      resetForm();
      setFeedback(editingPlan ? 'Plano atualizado com sucesso.' : 'Plano cadastrado com sucesso.');
      await onRefresh();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Nao foi possivel salvar o plano.');
    } finally {
      setSaving(false);
    }
  }

  async function deletePlan(plan: Plano) {
    setSaving(true);
    setFeedback('');

    try {
      await apiRequest<void>(apiUrl, `/planos/${plan.id}`, {
        method: 'DELETE',
        token: session.token,
      });
      if (editingPlan?.id === plan.id) resetForm();
      setFeedback('Plano excluido com sucesso.');
      await onRefresh();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Nao foi possivel excluir o plano.');
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete(plan: Plano) {
    Alert.alert('Excluir plano', `Deseja excluir ${plan.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => void deletePlan(plan) },
    ]);
  }

  return (
    <>
      {isAdmin ? (
        <Section title={editingPlan ? 'Editar plano' : 'Novo plano'}>
          <View style={styles.form}>
            <TextInputField label="Nome" value={form.name} onChangeText={(value) => updateForm('name', value)} />
            <TextInputField label="Descricao" value={form.description} onChangeText={(value) => updateForm('description', value)} multiline style={styles.textArea} />
            <View style={styles.formRow}>
              <View style={styles.formColumn}>
                <TextInputField label="Valor" value={form.price} onChangeText={(value) => updateForm('price', value)} keyboardType="decimal-pad" />
              </View>
              <View style={styles.formColumn}>
                <TextInputField label="Meses" value={form.durationMonths} onChangeText={(value) => updateForm('durationMonths', value)} keyboardType="number-pad" />
              </View>
            </View>
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
                <ActionButton loading={saving} onPress={savePlan}>{editingPlan ? 'Salvar plano' : 'Cadastrar plano'}</ActionButton>
              </View>
              {editingPlan ? (
                <View style={styles.formActionSecondary}>
                  <ActionButton variant="secondary" onPress={resetForm}>Cancelar</ActionButton>
                </View>
              ) : null}
            </View>
          </View>
        </Section>
      ) : null}

      <Section title="Planos cadastrados">
        {data.plans.length ? (
          data.plans.map((plan) => (
            <RecordCard
              key={plan.id}
              title={plan.name}
              subtitle={plan.description}
              badge={formatPlanStatus(plan.status)}
              details={[
                { label: 'Valor', value: formatCurrency(plan.price) },
                { label: 'Duracao', value: `${plan.durationMonths} meses` },
              ]}
              actions={isAdmin ? (
                <View style={styles.cardActions}>
                  <TextButton label="Editar" onPress={() => startEdit(plan)} />
                  <TextButton label="Excluir" tone="danger" onPress={() => confirmDelete(plan)} />
                </View>
              ) : undefined}
            />
          ))
        ) : (
          <EmptyMessage>Nenhum plano cadastrado.</EmptyMessage>
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
  formColumn: {
    flex: 1,
    minWidth: 130,
  },
  formRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  textArea: {
    minHeight: 88,
    paddingTop: spacing.sm,
    textAlignVertical: 'top',
  },
});
