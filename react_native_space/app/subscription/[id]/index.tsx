import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSubscriptionsControllerFindOne, useSubscriptionsControllerRemove } from '@/src/api/generated/api';
import Card from '@/src/components/Card';
import SkeletonLoader from '@/src/components/SkeletonLoader';
import { colors, spacing, borderRadius } from '@/src/theme';
import { formatINR } from '@/src/utils/currency';

export default function SubscriptionDetailScreen() {
  const router = useRouter();
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const sub = useSubscriptionsControllerFindOne(id as string, { query: { enabled: !!id } });
  useFocusEffect(useCallback(() => { if (id) sub.refetch?.(); }, [id]));
  const deleteMutation = useSubscriptionsControllerRemove();

  const handleDelete = useCallback(() => {
    const doDelete = () => {
      deleteMutation.mutate({ id: id as string }, { onSuccess: () => router.back() });
    };
    if (Platform.OS === 'web') { if (confirm('Delete this subscription?')) doDelete(); }
    else { Alert.alert('Delete', 'Delete this subscription?', [{ text: 'Cancel' }, { text: 'Delete', style: 'destructive', onPress: doDelete }]); }
  }, [id, deleteMutation]);

  const data = sub?.data;

  if (sub.isLoading || !data) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
        <SkeletonLoader height={200} />
      </View>
    );
  }

  const yearlyCost = data?.billingCycle === 'yearly' ? data?.amount : data?.billingCycle === 'weekly' ? (data?.amount ?? 0) * 52 : (data?.amount ?? 0) * 12;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxl }}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.heading} /></Pressable>
        <Pressable onPress={() => router.push(`/subscription/${id}/edit`)}><Text style={styles.editBtn}>Edit</Text></Pressable>
      </View>

      <Card style={styles.mainCard}>
        <Text style={styles.name}>{data?.name ?? ''}</Text>
        <View style={styles.chip}><Text style={styles.chipText}>{data?.category ?? ''}</Text></View>
      </Card>

      <Card style={styles.detailCard}>
        <DetailRow label="Amount" value={formatINR(data?.amount ?? 0)} />
        <DetailRow label="Currency" value={data?.currency ?? 'USD'} />
        <DetailRow label="Billing Cycle" value={data?.billingCycle ?? ''} />
        <DetailRow label="Next Renewal" value={new Date(data?.nextRenewalDate ?? '').toLocaleDateString()} />
        <DetailRow label="Reminders" value={(data?.reminderDaysBefore ?? []).length > 0 ? (data?.reminderDaysBefore ?? []).map((d) => `${d}d before`).join(', ') : 'None'} />
        {data?.notes && <DetailRow label="Notes" value={data.notes} />}
        <DetailRow label="Yearly Cost" value={formatINR(yearlyCost ?? 0)} />
      </Card>

      <Pressable style={styles.deleteButton} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={18} color={colors.error} />
        <Text style={styles.deleteText}>Delete Subscription</Text>
      </Pressable>
    </ScrollView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={drStyles.row}>
      <Text style={drStyles.label}>{label}</Text>
      <Text style={drStyles.value}>{value}</Text>
    </View>
  );
}

const drStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  label: { color: colors.muted, fontSize: 14 },
  value: { color: colors.heading, fontSize: 14, fontWeight: '500', maxWidth: '60%', textAlign: 'right' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base, paddingHorizontal: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  editBtn: { color: colors.primary, fontSize: 16, fontWeight: '600' },
  mainCard: { alignItems: 'center', paddingVertical: spacing.lg, marginBottom: spacing.md },
  name: { color: colors.heading, fontSize: 24, fontWeight: '700' },
  chip: { backgroundColor: colors.surface, paddingHorizontal: 12, paddingVertical: 4, borderRadius: borderRadius.full, marginTop: spacing.sm },
  chipText: { color: colors.muted, fontSize: 13 },
  detailCard: { marginBottom: spacing.md },
  deleteButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderWidth: 1, borderColor: colors.error + '40', borderRadius: borderRadius.md, gap: spacing.sm },
  deleteText: { color: colors.error, fontSize: 16, fontWeight: '500' },
});
