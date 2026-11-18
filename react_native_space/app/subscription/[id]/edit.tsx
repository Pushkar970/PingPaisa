import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSubscriptionsControllerFindOne, useSubscriptionsControllerUpdate } from '@/src/api/generated/api';
import GradientButton from '@/src/components/GradientButton';
import SkeletonLoader from '@/src/components/SkeletonLoader';
import { colors, spacing, borderRadius } from '@/src/theme';
import { getErrorMessage } from '@/src/api/customFetch';
import { formatAmountInput, parseAmountInput, formatIndianNumber } from '@/src/utils/currency';

const CATEGORIES = ['Streaming', 'SaaS', 'Fitness', 'Music', 'News', 'Cloud Storage', 'Gaming', 'Food Delivery', 'Education', 'Other'];
const CYCLES = ['weekly', 'monthly', 'yearly'];

export default function EditSubscriptionScreen() {
  const router = useRouter();
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const sub = useSubscriptionsControllerFindOne(id as string, { query: { enabled: !!id } });
  const mutation = useSubscriptionsControllerUpdate();

  const data = sub?.data;
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [cycle, setCycle] = useState('');
  const [renewalDate, setRenewalDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [initialized, setInitialized] = useState(false);

  if (data && !initialized) {
    setName(data?.name ?? '');
    setCategory(data?.category ?? 'Streaming');
    setAmount(data?.amount ? formatIndianNumber(data.amount) : '');
    setCycle(data?.billingCycle ?? 'monthly');
    setRenewalDate((data?.nextRenewalDate ?? '').split('T')[0]);
    setNotes(data?.notes ?? '');
    setInitialized(true);
  }

  const handleSave = useCallback(() => {
    if (!name?.trim()) { setError('Name is required'); return; }
    setError('');
    mutation.mutate(
      {
        id: id as string,
        data: {
          name: name.trim(),
          category,
          amount: parseAmountInput(amount),
          billingCycle: cycle,
          nextRenewalDate: new Date(renewalDate).toISOString(),
          notes: notes?.trim() || undefined,
        },
      },
      {
        onSuccess: () => router.back(),
        onError: (e) => setError(getErrorMessage(e, 'Failed to update')),
      },
    );
  }, [name, category, amount, cycle, renewalDate, notes, id, mutation]);

  if (sub.isLoading) {
    return <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}><SkeletonLoader height={300} /></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxl }} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}><Ionicons name="close" size={28} color={colors.heading} /></Pressable>
        <Text style={styles.title}>Edit Subscription</Text>
        <View style={{ width: 28 }} />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor={colors.muted} />

      <Text style={styles.label}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.xs }}>
        {CATEGORIES.map((c) => (
          <Pressable key={c} style={[styles.chip, category === c && styles.chipActive]} onPress={() => setCategory(c)}>
            <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.label}>Amount (₹)</Text>
      <TextInput style={styles.input} value={amount} onChangeText={(t) => setAmount(formatAmountInput(t))} keyboardType="decimal-pad" placeholderTextColor={colors.muted} />

      <Text style={styles.label}>Billing Cycle</Text>
      <View style={styles.cycleRow}>
        {CYCLES.map((c) => (
          <Pressable key={c} style={[styles.cycleChip, cycle === c && styles.cycleChipActive]} onPress={() => setCycle(c)}>
            <Text style={[styles.cycleText, cycle === c && styles.cycleTextActive]}>{c.charAt(0).toUpperCase() + c.slice(1)}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Next Renewal Date</Text>
      <TextInput style={styles.input} value={renewalDate} onChangeText={setRenewalDate} placeholderTextColor={colors.muted} />

      <Text style={styles.label}>Notes</Text>
      <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} value={notes} onChangeText={setNotes} multiline placeholderTextColor={colors.muted} />

      <GradientButton title="Update Subscription" onPress={handleSave} loading={mutation.isPending} style={{ marginTop: spacing.lg }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base, paddingHorizontal: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  title: { color: colors.heading, fontSize: 20, fontWeight: '600' },
  error: { color: colors.error, fontSize: 14, marginBottom: spacing.md },
  label: { color: colors.body, fontSize: 14, fontWeight: '500', marginBottom: spacing.xs, marginTop: spacing.md },
  input: { backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: 12, color: colors.heading, fontSize: 16 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: borderRadius.full, backgroundColor: colors.surfaceVariant, marginRight: spacing.sm, borderWidth: 1, borderColor: colors.cardBorder },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.muted, fontSize: 13 },
  chipTextActive: { color: colors.white },
  cycleRow: { flexDirection: 'row', gap: spacing.sm },
  cycleChip: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: borderRadius.md, backgroundColor: colors.surfaceVariant, borderWidth: 1, borderColor: colors.cardBorder },
  cycleChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  cycleText: { color: colors.muted, fontSize: 14, fontWeight: '500' },
  cycleTextActive: { color: colors.white },
});
