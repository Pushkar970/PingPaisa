import React, { useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList, ScrollView, Alert, Platform, Animated as RNAnimated } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Swipeable } from 'react-native-gesture-handler';
import { useIncomeControllerFindAll, useIncomeControllerRemove } from '@/src/api/generated/api';
import Card from '@/src/components/Card';
import SkeletonLoader from '@/src/components/SkeletonLoader';
import { colors, spacing, borderRadius } from '@/src/theme';
import { formatINR } from '@/src/utils/currency';

const CATEGORIES = ['All', 'Salary', 'Freelance', 'Refund', 'Cashback', 'Investment', 'Rental', 'Transfer', 'Gift', 'Reimbursement', 'Interest', 'Dividend', 'Other'];

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

function SwipeableIncomeItem({
  item,
  onPress,
  onDelete,
}: {
  item: any;
  onPress: () => void;
  onDelete: () => void;
}) {
  const swipeableRef = useRef<Swipeable>(null);

  const renderRightActions = (
    _progress: RNAnimated.AnimatedInterpolation<number>,
    dragX: RNAnimated.AnimatedInterpolation<number>,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [1, 0.8, 0],
      extrapolate: 'clamp',
    });
    return (
      <View style={styles.swipeActions}>
        <RNAnimated.View style={[styles.deleteAction, { transform: [{ scale }] }]}>
          <Pressable
            onPress={() => {
              swipeableRef.current?.close();
              onDelete();
            }}
            style={styles.deleteActionInner}
          >
            <Ionicons name="trash-outline" size={22} color={colors.white} />
            <Text style={styles.deleteActionText}>Delete</Text>
          </Pressable>
        </RNAnimated.View>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
      friction={2}
    >
      <Pressable onPress={onPress}>
        <Card style={styles.incomeCard}>
          <View style={styles.incomeContent}>
            <View style={styles.nameRow}>
              <Text style={styles.incomeName}>{item?.title ?? ''}</Text>
              {item?.source === 'sms' && (
                <View style={styles.smsBadge}>
                  <Ionicons name="scan-outline" size={10} color={colors.success} />
                  <Text style={styles.smsBadgeText}>SMS</Text>
                </View>
              )}
            </View>
            <View style={styles.incomeMeta}>
              <View style={styles.chip}>
                <Text style={styles.chipText}>{item?.category ?? ''}</Text>
              </View>
              <Text style={styles.incomeDate}>{new Date(item?.date ?? '').toLocaleDateString()}</Text>
            </View>
          </View>
          <Text style={styles.incomeAmount}>+{formatINR(item?.amount ?? 0)}</Text>
        </Card>
      </Pressable>
    </Swipeable>
  );
}

export default function IncomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const months = getLast12Months();
  const [selectedMonth, setSelectedMonth] = useState(months[0]?.value ?? '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const deleteMutation = useIncomeControllerRemove();

  const incomeQuery = useIncomeControllerFindAll({
    month: selectedMonth,
    page: 1,
    limit: 50,
    ...(selectedCategory !== 'All' ? { category: selectedCategory } : {}),
  });

  useFocusEffect(useCallback(() => { incomeQuery.refetch(); }, [selectedMonth, selectedCategory]));

  const items = incomeQuery?.data?.items ?? [];
  const total = items.reduce((s, e) => s + (e?.amount ?? 0), 0);

  const handleDelete = useCallback((id: string, title: string) => {
    const doDelete = () => {
      deleteMutation.mutate(
        { id },
        { onSuccess: () => incomeQuery.refetch() },
      );
    };
    if (Platform.OS === 'web') {
      if (confirm(`Delete "${title}"?`)) doDelete();
    } else {
      Alert.alert('Delete Income', `Delete "${title}"?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: doDelete },
      ]);
    }
  }, [deleteMutation, incomeQuery]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Income</Text>
        <Text style={styles.total}>{formatINR(total)}</Text>
      </View>

      {/* SMS Auto-Sync bar for credit messages */}
      <Pressable style={styles.autoSyncBar} onPress={() => router.push('/income/sms-sync')}>
        <View style={styles.syncLeft}>
          <Ionicons name="phone-portrait-outline" size={20} color={colors.success} />
          <View style={{ marginLeft: spacing.sm }}>
            <Text style={styles.autoSyncTitle}>Auto-Sync Credit SMS</Text>
            <Text style={styles.autoSyncDesc}>Auto-detect salary, refunds & credits from SMS</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      </Pressable>

      {/* Month filter */}
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

      {/* Category filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {CATEGORIES.map((c) => (
          <Pressable
            key={c}
            style={[styles.categoryPill, selectedCategory === c && styles.categoryPillActive]}
            onPress={() => setSelectedCategory(c)}
          >
            <Text style={[styles.categoryPillText, selectedCategory === c && styles.categoryPillTextActive]}>{c}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {incomeQuery.isLoading ? (
        <View style={styles.skeletonList}>
          {[1, 2, 3].map((i) => <SkeletonLoader key={i} height={60} style={{ marginBottom: spacing.sm }} />)}
        </View>
      ) : items.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="wallet-outline" size={64} color={colors.muted} />
          <Text style={styles.emptyText}>No income for this period</Text>
          {selectedCategory !== 'All' && (
            <Text style={styles.emptyHint}>Try clearing the "{selectedCategory}" filter</Text>
          )}
          <Pressable style={styles.emptyButton} onPress={() => router.push('/income/add')}>
            <Text style={styles.emptyButtonText}>Add Income</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item?.id ?? Math.random().toString()}
          renderItem={({ item }) => (
            <SwipeableIncomeItem
              item={item}
              onPress={() => router.push(`/income/${item?.id}`)}
              onDelete={() => handleDelete(item?.id ?? '', item?.title ?? '')}
            />
          )}
          contentContainerStyle={{ paddingBottom: spacing.xxl }}
        />
      )}

      <Pressable style={styles.fab} onPress={() => router.push('/income/add')}>
        <Ionicons name="add" size={28} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base, paddingHorizontal: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  title: { color: colors.heading, fontSize: 28, fontWeight: '700' },
  total: { color: colors.success, fontSize: 18, fontWeight: '700' },
  monthScroll: { marginBottom: spacing.sm, maxHeight: 40 },
  monthPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: borderRadius.full, backgroundColor: colors.surface, marginRight: spacing.sm },
  monthPillActive: { backgroundColor: colors.success },
  monthText: { color: colors.muted, fontSize: 13, fontWeight: '500' },
  monthTextActive: { color: colors.white },
  categoryScroll: { marginBottom: spacing.md, maxHeight: 36 },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: 'transparent',
    marginRight: spacing.xs,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  categoryPillActive: { backgroundColor: 'rgba(22,163,74,0.12)', borderColor: colors.success },
  categoryPillText: { color: colors.muted, fontSize: 12, fontWeight: '500' },
  categoryPillTextActive: { color: colors.success, fontWeight: '600' },
  skeletonList: { paddingTop: spacing.md },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: colors.muted, fontSize: 16, marginTop: spacing.md },
  emptyHint: { color: colors.muted, fontSize: 13, marginTop: spacing.xs, opacity: 0.7 },
  emptyButton: { marginTop: spacing.md, backgroundColor: colors.success, paddingVertical: 12, paddingHorizontal: 24, borderRadius: borderRadius.md },
  emptyButtonText: { color: colors.white, fontWeight: '600' },
  autoSyncBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(22,163,74,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(22,163,74,0.2)',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginBottom: spacing.md,
  },
  syncLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  autoSyncTitle: { color: colors.success, fontSize: 14, fontWeight: '600' },
  autoSyncDesc: { color: colors.muted, fontSize: 11, marginTop: 1 },
  incomeCard: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  incomeContent: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  incomeName: { color: colors.heading, fontSize: 16, fontWeight: '500' },
  smsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(22,163,74,0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    gap: 3,
  },
  smsBadgeText: { color: colors.success, fontSize: 9, fontWeight: '600' },
  incomeMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: spacing.sm },
  chip: { backgroundColor: colors.surface, paddingHorizontal: 8, paddingVertical: 2, borderRadius: borderRadius.sm },
  chipText: { color: colors.muted, fontSize: 11 },
  incomeDate: { color: colors.muted, fontSize: 12 },
  incomeAmount: { color: colors.success, fontSize: 16, fontWeight: '700' },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center',
    elevation: 4,
  },
  // Swipe-to-delete styles
  swipeActions: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: spacing.sm,
  },
  deleteAction: {
    backgroundColor: colors.error,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteActionInner: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  deleteActionText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});