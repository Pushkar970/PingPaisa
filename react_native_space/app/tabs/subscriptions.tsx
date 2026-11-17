import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSubscriptionsControllerFindAll, useSubscriptionsControllerFindUpcoming } from '@/src/api/generated/api';
import Card from '@/src/components/Card';
import SkeletonLoader from '@/src/components/SkeletonLoader';
import { colors, spacing, borderRadius } from '@/src/theme';
import { formatINR } from '@/src/utils/currency';

const CATEGORY_COLORS: Record<string, string> = {
  Streaming: '#EF4444', SaaS: '#6366F1', Fitness: '#10B981', Music: '#F59E0B',
  News: '#06B6D4', 'Cloud Storage': '#8B5CF6', Gaming: '#EC4899', 'Food Delivery': '#F97316',
  Education: '#14B8A6', Other: '#64748B',
};

export default function SubscriptionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming'>('active');

  const allSubs = useSubscriptionsControllerFindAll({ page: 1, limit: 100 });
  const upcomingSubs = useSubscriptionsControllerFindUpcoming({ days: 30 });

  useFocusEffect(useCallback(() => {
    allSubs.refetch();
    upcomingSubs.refetch();
  }, []));

  const items = activeTab === 'active' ? (allSubs?.data?.items ?? []) : (upcomingSubs?.data?.items ?? []);
  const totalMonthly = (allSubs?.data?.items ?? []).reduce((sum, s) => {
    const amt = s?.amount ?? 0;
    if (s?.billingCycle === 'weekly') return sum + amt * 4.33;
    if (s?.billingCycle === 'yearly') return sum + amt / 12;
    return sum + amt;
  }, 0);

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Subscriptions</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{formatINR(totalMonthly)}/mo</Text>
        </View>
      </View>

      <View style={styles.tabs}>
        <Pressable style={[styles.tab, activeTab === 'active' && styles.activeTab]} onPress={() => setActiveTab('active')}>
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>Active</Text>
        </Pressable>
        <Pressable style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]} onPress={() => setActiveTab('upcoming')}>
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
        </Pressable>
      </View>

      {allSubs.isLoading ? (
        <View style={styles.skeletonList}>
          {[1, 2, 3].map((i) => <SkeletonLoader key={i} height={80} style={{ marginBottom: spacing.sm }} />)}
        </View>
      ) : items.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="repeat-outline" size={64} color={colors.muted} />
          <Text style={styles.emptyText}>No subscriptions yet</Text>
          <Pressable style={styles.emptyButton} onPress={() => router.push('/subscription/add')}>
            <Text style={styles.emptyButtonText}>Add your first subscription</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item?.id ?? Math.random().toString()}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/subscription/${item?.id}`)}>
              <Card style={styles.subCard}>
                <View style={[styles.colorBar, { backgroundColor: CATEGORY_COLORS[item?.category ?? ''] ?? colors.muted }]} />
                <View style={styles.subContent}>
                  <Text style={styles.subName}>{item?.name ?? ''}</Text>
                  <View style={styles.subMeta}>
                    <View style={styles.chip}>
                      <Text style={styles.chipText}>{item?.category ?? ''}</Text>
                    </View>
                    <Text style={styles.subDate}>Next: {new Date(item?.nextRenewalDate ?? '').toLocaleDateString()}</Text>
                  </View>
                </View>
                <Text style={styles.subAmount}>{formatINR(item?.amount ?? 0)}/{(item?.billingCycle ?? 'mo').slice(0, 2)}</Text>
              </Card>
            </Pressable>
          )}
          contentContainerStyle={{ paddingBottom: spacing.xxl }}
        />
      )}

      <Pressable style={styles.fab} onPress={() => router.push('/subscription/add')}>
        <Ionicons name="add" size={28} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base, paddingHorizontal: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  title: { color: colors.heading, fontSize: 28, fontWeight: '700' },
  badge: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 4, borderRadius: borderRadius.full },
  badgeText: { color: colors.white, fontSize: 13, fontWeight: '600' },
  tabs: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: 4, marginBottom: spacing.md },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: borderRadius.sm },
  activeTab: { backgroundColor: colors.primary },
  tabText: { color: colors.muted, fontSize: 14, fontWeight: '500' },
  activeTabText: { color: colors.white },
  skeletonList: { paddingTop: spacing.md },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: colors.muted, fontSize: 16, marginTop: spacing.md },
  emptyButton: { marginTop: spacing.md, backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: borderRadius.md },
  emptyButtonText: { color: colors.white, fontWeight: '600' },
  subCard: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  colorBar: { width: 4, height: 48, borderRadius: 2, marginRight: spacing.md },
  subContent: { flex: 1 },
  subName: { color: colors.heading, fontSize: 16, fontWeight: '600' },
  subMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: spacing.sm },
  chip: { backgroundColor: colors.surface, paddingHorizontal: 8, paddingVertical: 2, borderRadius: borderRadius.sm },
  chipText: { color: colors.muted, fontSize: 11 },
  subDate: { color: colors.muted, fontSize: 12 },
  subAmount: { color: colors.heading, fontSize: 16, fontWeight: '700' },
  fab: {
    position: 'absolute', bottom: 24, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    elevation: 4,
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
});
