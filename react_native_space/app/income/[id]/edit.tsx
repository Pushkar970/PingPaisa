import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIncomeControllerFindOne, useIncomeControllerUpdate } from '@/src/api/generated/api';
import GradientButton from '@/src/components/GradientButton';
import SkeletonLoader from '@/src/components/SkeletonLoader';
import { colors, spacing, borderRadius } from '@/src/theme';
import { getErrorMessage } from '@/src/api/customFetch';
import { formatAmountInput, parseAmountInput, formatIndianNumber } from '@/src/utils/currency';

const CATEGORIES = ['Salary', 'Freelance', 'Refund', 'Cashback', 'Investment', 'Rental', 'Transfer', 'Gift', 'Reimbursement', 'Interest', 'Dividend', 'Other'];

export default function EditIncomeScreen() {
  const router = useRouter();
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const income = useIncomeControllerFindOne(id as string, { query: { enabled: !!id } });
  const mutation = useIncomeControllerUpdate();

  const data = income?.data;
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [initialized, setInitialized] = useState(false);

  if (data && !initialized) {
    setTitle(data?.title ?? '');
    setAmount(data?.amount ? formatIndianNumber(data.amount) : '');
    setCategory(data?.category ?? 'Salary');
    setDate((data?.date ?? '').split('T')[0]);
    setNotes(data?.notes ?? '');
    setInitialized(true);
  }

  const handleSave = useCallback(() => {
    if (!title?.trim()) { setError('Title is required'); return; }
    setError('');
    mutation.mutate(
      {
        id: id as string,
        data: {
          title: title.trim(),
          amount: parseAmountInput(amount),
          category,
          date: new Date(date).toISOString(),
          notes: notes?.trim() || undefined,
        },
      },
      {
        onSuccess: () => router.back(),
        onError: (e) => setError(getErrorMessage(e, 'Failed to update')),
      },
    );
  }, [title, amount, category, date, notes, id, mutation]);

  if (income.isLoading) {
    return <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}><SkeletonLoader height={300} /></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxl }} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}><Ionicons name="close" size={28} color={colors.heading} /></Pressable>
        <Text style={styles.headerTitle}>Edit Income</Text>
        <View style={{ width: 28 }} />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholderTextColor={colors.muted} />

      <Text style={styles.label}>Amount (₹)</Text>
      <TextInput style={styles.input} value={amount} onChangeText={(t) => setAmount(formatAmountInput(t))} keyboardType="decimal-pad" placeholderTextColor={colors.muted} />

      <Text style={styles.label}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.xs }}>
        {CATEGORIES.map((c) => (
          <Pressable key={c} style={[styles.chip, category === c && styles.chipActive]} onPress={() => setCategory(c)}>
            <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.label}>Date</Text>
      <TextInput style={styles.input} value={date} onChangeText={setDate} placeholderTextColor={colors.muted} />

      <Text style={styles.label}>Notes</Text>
      <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} value={notes} onChangeText={setNotes} multiline placeholderTextColor={colors.muted} />

      <GradientButton title="Update Income" onPress={handleSave} loading={mutation.isPending} style={{ marginTop: spacing.lg }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base, paddingHorizontal: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  headerTitle: { color: colors.heading, fontSize: 20, fontWeight: '600' },
  error: { color: colors.error, fontSize: 14, marginBottom: spacing.md },
  label: { color: colors.body, fontSize: 14, fontWeight: '500', marginBottom: spacing.xs, marginTop: spacing.md },
  input: { backgroundColor: colors.inputBg, borderWidth: 1, borderColor: colors.inputBorder, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: 12, color: colors.heading, fontSize: 16 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: borderRadius.full, backgroundColor: colors.surfaceVariant, marginRight: spacing.sm, borderWidth: 1, borderColor: colors.cardBorder },
  chipActive: { backgroundColor: colors.success, borderColor: colors.success },
  chipText: { color: colors.muted, fontSize: 13 },
  chipTextActive: { color: colors.white },
});
