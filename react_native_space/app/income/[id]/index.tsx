import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIncomeControllerFindOne, useIncomeControllerRemove } from '@/src/api/generated/api';
import Card from '@/src/components/Card';
import SkeletonLoader from '@/src/components/SkeletonLoader';
import { colors, spacing, borderRadius } from '@/src/theme';
import { formatINR } from '@/src/utils/currency';

export default function IncomeDetailScreen() {
  const router = useRouter();
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const income = useIncomeControllerFindOne(id as string, { query: { enabled: !!id } });
  useFocusEffect(useCallback(() => { if (id) income.refetch?.(); }, [id]));
  const deleteMutation = useIncomeControllerRemove();

  const handleDelete = useCallback(() => {
    const doDelete = () => {
      deleteMutation.mutate({ id: id as string }, { onSuccess: () => router.back() });
    };
    if (Platform.OS === 'web') { if (confirm('Delete this income?')) doDelete(); }
    else { Alert.alert('Delete', 'Delete this income?', [{ text: 'Cancel' }, { text: 'Delete', style: 'destructive', onPress: doDelete }]); }
  }, [id, deleteMutation]);

  const data = income?.data;
  if (income.isLoading || !data) {
    return <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}><SkeletonLoader height={200} /></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxl }}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.heading} /></Pressable>
        <Pressable onPress={() => router.push(`/income/${id}/edit`)}><Text style={styles.editBtn}>Edit</Text></Pressable>
      </View>

      <Card style={styles.mainCard}>
        <Text style={styles.name}>{data?.title ?? ''}</Text>
        <Text style={styles.amount}>+{formatINR(data?.amount ?? 0)}</Text>
        <View style={styles.chipRow}>
          <View style={styles.chip}><Text style={styles.chipText}>{data?.category ?? ''}</Text></View>
          {(data as any)?.source === 'sms' && (
            <View style={styles.smsBadge}>
              <Ionicons name="scan-outline" size={12} color={colors.success} />
              <Text style={styles.smsBadgeText}>Parsed from SMS</Text>
            </View>
          )}
        </View>
      </Card>

      <Card style={styles.detailCard}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{new Date(data?.date ?? '').toLocaleDateString()}</Text>
        </View>
        {data?.notes && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Notes</Text>
            <Text style={styles.detailValue}>{data.notes}</Text>
          </View>
        )}
      </Card>

      <Pressable style={styles.deleteButton} onPress={handleDelete}>
        <Ionicons name="trash-outline" size={18} color={colors.error} />
        <Text style={styles.deleteText}>Delete Income</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base, paddingHorizontal: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  editBtn: { color: colors.success, fontSize: 16, fontWeight: '600' },
  mainCard: { alignItems: 'center', paddingVertical: spacing.lg, marginBottom: spacing.md },
  name: { color: colors.heading, fontSize: 24, fontWeight: '700' },
  amount: { color: colors.success, fontSize: 32, fontWeight: '700', marginVertical: spacing.sm },
  chipRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  chip: { backgroundColor: colors.surfaceVariant, paddingHorizontal: 12, paddingVertical: 4, borderRadius: borderRadius.full },
  chipText: { color: colors.muted, fontSize: 13 },
  smsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(22,163,74,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  smsBadgeText: { color: colors.success, fontSize: 12, fontWeight: '500' },
  detailCard: { marginBottom: spacing.md },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  detailLabel: { color: colors.muted, fontSize: 14 },
  detailValue: { color: colors.heading, fontSize: 14, fontWeight: '500' },
  deleteButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderWidth: 1, borderColor: colors.error + '40', borderRadius: borderRadius.md, gap: spacing.sm },
  deleteText: { color: colors.error, fontSize: 16, fontWeight: '500' },
});
