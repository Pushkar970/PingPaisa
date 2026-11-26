import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIncomeControllerCreate } from '@/src/api/generated/api';
import GradientButton from '@/src/components/GradientButton';
import { colors, spacing, borderRadius } from '@/src/theme';
import { getErrorMessage } from '@/src/api/customFetch';
import { formatAmountInput, parseAmountInput } from '@/src/utils/currency';

const CATEGORIES = ['Salary', 'Freelance', 'Refund', 'Cashback', 'Investment', 'Rental', 'Transfer', 'Gift', 'Reimbursement', 'Interest', 'Dividend', 'Other'];

export default function AddIncomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mutation = useIncomeControllerCreate();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Salary');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSave = useCallback(() => {
    if (!title?.trim()) { setError('Title is required'); return; }
    const parsedAmount = parseAmountInput(amount);
    if (!parsedAmount || parsedAmount <= 0) { setError('Amount must be greater than 0'); return; }
    const parsedDate = new Date(date.trim());
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim()) || isNaN(parsedDate.getTime())) {
      setError('Please enter a valid date (YYYY-MM-DD)');
      return;
    }
    setError('');
    mutation.mutate(
      {
        data: {
          title: title.trim(),
          amount: parsedAmount,
          category,
          date: parsedDate.toISOString(),
          notes: notes?.trim() || undefined,
        },
      },
      {
        onSuccess: () => router.back(),
        onError: (e) => setError(getErrorMessage(e, 'Failed to save')),
      },
    );
  }, [title, amount, category, date, notes, mutation]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxl }} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}><Ionicons name="close" size={28} color={colors.heading} /></Pressable>
        <Text style={styles.title}>Add Income</Text>
        <View style={{ width: 28 }} />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Salary, Freelance, Refund..." placeholderTextColor={colors.muted} />

      <Text style={styles.label}>Amount (₹)</Text>
      <TextInput style={styles.input} value={amount} onChangeText={(t) => setAmount(formatAmountInput(t))} keyboardType="decimal-pad" placeholder="50,000" placeholderTextColor={colors.muted} />

      <Text style={styles.label}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.xs }}>
        {CATEGORIES.map((c) => (
          <Pressable key={c} style={[styles.chip, category === c && styles.chipActive]} onPress={() => setCategory(c)}>
            <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.label}>Date</Text>
      <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" placeholderTextColor={colors.muted} />

      <Text style={styles.label}>Notes (optional)</Text>
      <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} value={notes} onChangeText={setNotes} multiline placeholder="Any notes..." placeholderTextColor={colors.muted} />

      <GradientButton title="Save Income" onPress={handleSave} loading={mutation.isPending} style={{ marginTop: spacing.lg }} />
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
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: borderRadius.full, backgroundColor: colors.surface, marginRight: spacing.sm, borderWidth: 1, borderColor: colors.cardBorder },
  chipActive: { backgroundColor: colors.success, borderColor: colors.success },
  chipText: { color: colors.muted, fontSize: 13 },
  chipTextActive: { color: colors.white },
});
