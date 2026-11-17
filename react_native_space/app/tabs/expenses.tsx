import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useExpensesControllerFindAll, useUserControllerGetPlan } from '@/src/api/generated/api';
import Card from '@/src/components/Card';
import SkeletonLoader from '@/src/components/SkeletonLoader';
import { colors, spacing, borderRadius } from '@/src/theme';
import { formatINR } from '@/src/utils/currency';

function getLast12Months(): { label: string; value: string }[] {
  const months: { label: string; value: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    months.push({ label, value });
  }
  return months;
}

export default function ExpensesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const months = getLast12Months();
  const [selectedMonth, setSelectedMonth] = useState(months[0]?.value ?? '');

  const expenses = useExpensesControllerFindAll({ month: selectedMonth, page: 1, limit: 50 });
  const planQuery = useUserControllerGetPlan();

  useFocusEffect(useCallback(() => { expenses.refetch(); planQuery.refetch(); }, [selectedMonth]));

  const items = expenses?.data?.items ?? [];
  const total = items.reduce((s, e) => s + (e?.amount ?? 0), 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Expenses</Text>
        <Text style={styles.total}>{formatINR(total)}</Text>
      </View>

      {/* Limit exceeded warning */}
      {planQuery?.data?.limitExceeded && (
        <View style={styles.limitBanner}>
          <Ionicons name="warning" size={18} color={colors.error} />
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text style={styles.limitBannerTitle}>Monthly Limit Exceeded!</Text>
            <Text style={styles.limitBannerText}>
              You've spent {formatINR(planQuery?.data?.monthlySpent ?? 0)} of your {formatINR(planQuery?.data?.monthlyLimit ?? 0)} limit.
            </Text>
          </View>
        </View>
      )}

      {/* Near limit warning (80-100%) */}
      {!planQuery?.data?.limitExceeded &&
        planQuery?.data?.monthlyLimit != null &&
        (planQuery?.data?.monthlySpent ?? 0) / Number(planQuery.data.monthlyLimit) > 0.8 && (
        <View style={styles.limitBannerWarn}>
          <Ionicons name="alert-circle" size={18} color={colors.warning} />
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text style={styles.limitBannerWarnTitle}>Approaching Monthly Limit</Text>
            <Text style={styles.limitBannerWarnText}>
              You've spent {formatINR(planQuery?.data?.monthlySpent ?? 0)} of your {formatINR(planQuery?.data?.monthlyLimit ?? 0)} limit.
            </Text>
          </View>
        </View>
      )}

      {/* SMS Auto-Sync bar (Android-only feature, shown on all platforms for discoverability) */}
      <Pressable style={styles.autoSyncBar} onPress={() => router.push('/expense/sms-sync')}>
        <View style={styles.smartPasteLeft}>
          <Ionicons name="phone-portrait-outline" size={20} color={colors.primary} />
          <View style={{ marginLeft: spacing.sm }}>
            <Text style={styles.autoSyncTitle}>Auto-Sync SMS</Text>
            <Text style={styles.autoSyncDesc}>Auto-detect bank & UPI transactions from SMS</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      </Pressable>

      <Pressable style={styles.smartPasteBar} onPress={() => router.push('/expense/smart-paste')}>
        <View style={styles.smartPasteLeft}>
          <Ionicons name="scan-outline" size={20} color={colors.accent} />
          <View style={{ marginLeft: spacing.sm }}>
            <Text style={styles.smartPasteTitle}>Smart Paste</Text>
            <Text style={styles.smartPasteDesc}>Paste bank SMS to auto-add expenses</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      </Pressable>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthScroll}>
        {months.map((m) => (
          <Pressable
            key={m.value}
            style={[styles.monthPill, selectedMonth === m.value && styles.monthPillActive]}
            onPress={() => setSelectedMonth(m.value)}
          >
            <Text style={[styles.monthText, selectedMonth === m.value && styles.monthTextActive]}>{m.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {expenses.isLoading ? (
        <View style={styles.skeletonList}>
          {[1, 2, 3].map((i) => <SkeletonLoader key={i} height={60} style={{ marginBottom: spacing.sm }} />)}
        </View>
      ) : items.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="receipt-outline" size={64} color={colors.muted} />
          <Text style={styles.emptyText}>No expenses for this period</Text>
          <Pressable style={styles.emptyButton} onPress={() => router.push('/expense/add')}>
            <Text style={styles.emptyButtonText}>Add Expense</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item?.id ?? Math.random().toString()}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/expense/${item?.id}`)}>
              <Card style={styles.expenseCard}>
                <View style={styles.expenseContent}>
                  <View style={styles.nameRow}>
                    <Text style={styles.expenseName}>{item?.title ?? ''}</Text>
                    {(item as any)?.source === 'sms' && (
                      <View style={styles.smsBadge}>
                        <Ionicons name="scan-outline" size={10} color={colors.accent} />
                        <Text style={styles.smsBadgeText}>SMS</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.expenseMeta}>
                    <View style={styles.chip}>
                      <Text style={styles.chipText}>{item?.category ?? ''}</Text>
                    </View>
                    <Text style={styles.expenseDate}>{new Date(item?.date ?? '').toLocaleDateString()}</Text>
                  </View>
                </View>
                <Text style={styles.expenseAmount}>{formatINR(item?.amount ?? 0)}</Text>
              </Card>
            </Pressable>
          )}
          contentContainerStyle={{ paddingBottom: spacing.xxl }}
        />
      )}

      <Pressable style={styles.fab} onPress={() => router.push('/expense/add')}>
        <Ionicons name="add" size={28} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base, paddingHorizontal: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  title: { color: colors.heading, fontSize: 28, fontWeight: '700' },
  total: { color: colors.primary, fontSize: 18, fontWeight: '700' },
  monthScroll: { marginBottom: spacing.md, maxHeight: 40 },
  monthPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: borderRadius.full, backgroundColor: colors.surface, marginRight: spacing.sm },
  monthPillActive: { backgroundColor: colors.primary },
  monthText: { color: colors.muted, fontSize: 13, fontWeight: '500' },
  monthTextActive: { color: colors.white },
  skeletonList: { paddingTop: spacing.md },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: colors.muted, fontSize: 16, marginTop: spacing.md },
  emptyButton: { marginTop: spacing.md, backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: borderRadius.md },
  emptyButtonText: { color: colors.white, fontWeight: '600' },
  limitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginBottom: spacing.sm,
  },
  limitBannerTitle: { color: colors.error, fontSize: 14, fontWeight: '600' },
  limitBannerText: { color: colors.error, fontSize: 12, marginTop: 1, opacity: 0.8 },
  limitBannerWarn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginBottom: spacing.sm,
  },
  limitBannerWarnTitle: { color: colors.warning, fontSize: 14, fontWeight: '600' },
  limitBannerWarnText: { color: colors.warning, fontSize: 12, marginTop: 1, opacity: 0.8 },
  autoSyncBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(124,58,237,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.2)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginBottom: spacing.sm,
  },
  autoSyncTitle: { color: colors.primary, fontSize: 14, fontWeight: '600' },
  autoSyncDesc: { color: colors.muted, fontSize: 11, marginTop: 1 },
  smartPasteBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(124,58,237,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(124,58,237,0.15)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginBottom: spacing.md,
  },
  smartPasteLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  smartPasteTitle: { color: colors.accent, fontSize: 14, fontWeight: '600' },
  smartPasteDesc: { color: colors.muted, fontSize: 11, marginTop: 1 },
  expenseCard: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  expenseContent: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  expenseName: { color: colors.heading, fontSize: 16, fontWeight: '500' },
  smsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(124,58,237,0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: 3,
  },
  smsBadgeText: { color: colors.accent, fontSize: 9, fontWeight: '600' },
  expenseMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: spacing.sm },
  chip: { backgroundColor: colors.surface, paddingHorizontal: 8, paddingVertical: 2, borderRadius: borderRadius.sm },
  chipText: { color: colors.muted, fontSize: 11 },
  expenseDate: { color: colors.muted, fontSize: 12 },
  expenseAmount: { color: colors.heading, fontSize: 16, fontWeight: '700' },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    elevation: 4,
  },
});
