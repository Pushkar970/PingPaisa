import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSubscriptionsControllerCreate } from '@/src/api/generated/api';
import GradientButton from '@/src/components/GradientButton';
import { colors, spacing, borderRadius } from '@/src/theme';
import { getErrorMessage } from '@/src/api/customFetch';
import { formatAmountInput, parseAmountInput } from '@/src/utils/currency';

const CATEGORIES = ['Streaming', 'SaaS', 'Fitness', 'Music', 'News', 'Cloud Storage', 'Gaming', 'Food Delivery', 'Education', 'Other'];
const CYCLES = ['weekly', 'monthly', 'yearly'];

export default function AddSubscriptionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mutation = useSubscriptionsControllerCreate();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Streaming');
  const [amount, setAmount] = useState('');
  const [cycle, setCycle] = useState('monthly');
  const [renewalDate, setRenewalDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSave = useCallback(() => {
    if (!name?.trim()) { setError('Name is required'); return; }
    const parsedAmount = parseAmountInput(amount);
    if (!parsedAmount || parsedAmount <= 0) { setError('Amount must be greater than 0'); return; }
    const parsedDate = new Date(renewalDate.trim());
    if (!/^\d{4}-\d{2}-\d{2}$/.test(renewalDate.trim()) || isNaN(parsedDate.getTime())) {
      setError('Please enter a valid renewal date (YYYY-MM-DD)');
      return;
    }
    setError('');
    mutation.mutate(
      {
        data: {
          name: name.trim(),
          category,
          amount: parsedAmount,
          billingCycle: cycle,
          nextRenewalDate: parsedDate.toISOString(),
          notes: notes?.trim() || undefined,
        },
      },
      {
        onSuccess: () => router.back(),
        onError: (e) => setError(getErrorMessage(e, 'Failed to save')),
      },
    );
  }, [name, category, amount, cycle, renewalDate, notes, mutation]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxl }} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}><Ionicons name="close" size={28} color={colors.heading} /></Pressable>
        <Text style={styles.title}>Add Subscription</Text>
        <View style={{ width: 28 }} />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Netflix, Spotify..." placeholderTextColor={colors.muted} />

      <Text style={styles.label}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
        {CATEGORIES.map((c) => (
          <Pressable key={c} style={[styles.chip, category === c && styles.chipActive]} onPress={() => setCategory(c)}>
            <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.label}>Amount (₹)</Text>
      <TextInput style={styles.input} value={amount} onChangeText={(t) => setAmount(formatAmountInput(t))} keyboardType="decimal-pad" placeholder="199" placeholderTextColor={colors.muted} />

      <Text style={styles.label}>Billing Cycle</Text>
      <View style={styles.cycleRow}>
        {CYCLES.map((c) => (
          <Pressable key={c} style={[styles.cycleChip, cycle === c && styles.cycleChipActive]} onPress={() => setCycle(c)}>
            <Text style={[styles.cycleText, cycle === c && styles.cycleTextActive]}>{c.charAt(0).toUpperCase() + c.slice(1)}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Next Renewal Date</Text>
      <TextInput style={styles.input} value={renewalDate} onChangeText={setRenewalDate} placeholder="YYYY-MM-DD" placeholderTextColor={colors.muted} />

      <Text style={styles.label}>Notes (optional)</Text>
      <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} value={notes} onChangeText={setNotes} multiline placeholder="Any notes..." placeholderTextColor={colors.muted} />

      <GradientButton title="Save Subscription" onPress={handleSave} loading={mutation.isPending} style={{ marginTop: spacing.lg }} />
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
  chipScroll: { flexDirection: 'row', marginBottom: spacing.xs },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: borderRadius.full, backgroundColor: colors.surface, marginRight: spacing.sm, borderWidth: 1, borderColor: colors.cardBorder },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.muted, fontSize: 13 },
  chipTextActive: { color: colors.white },
  cycleRow: { flexDirection: 'row', gap: spacing.sm },
  cycleChip: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: borderRadius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.cardBorder },
  cycleChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  cycleText: { color: colors.muted, fontSize: 14, fontWeight: '500' },
  cycleTextActive: { color: colors.white },
});
