import React, { useCallback, useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useDashboardControllerGetStats, useDashboardControllerGetCategoryBreakdown, useDashboardControllerGetTrends, useDashboardControllerGetSplit, useAiControllerGetSuggestions, useSubscriptionsControllerFindUpcoming } from '@/src/api/generated/api';
import { useAuth } from '@/src/context/AuthContext';
import Card from '@/src/components/Card';
import SkeletonLoader from '@/src/components/SkeletonLoader';
import { colors, spacing, borderRadius } from '@/src/theme';
import { getSelectedBankId } from '@/src/services/indianBanks';
import { formatINR } from '@/src/utils/currency';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - spacing.lg * 2 - spacing.md * 2;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const stats = useDashboardControllerGetStats();
  const breakdown = useDashboardControllerGetCategoryBreakdown({ period: 'month' });
  const trends = useDashboardControllerGetTrends();
  const split = useDashboardControllerGetSplit();
  const suggestions = useAiControllerGetSuggestions();
  const upcoming = useSubscriptionsControllerFindUpcoming({ days: 7 });

  const [refreshing, setRefreshing] = React.useState(false);
  const [hasBankSelected, setHasBankSelected] = useState(true); // default true to avoid flash

  // Check bank selection on focus
  useFocusEffect(useCallback(() => {
    getSelectedBankId().then((id) => setHasBankSelected(!!id)).catch(() => {});
  }, []));

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      stats.refetch(), breakdown.refetch(), trends.refetch(),
      split.refetch(), suggestions.refetch(), upcoming.refetch(),
    ]);
    setRefreshing(false);
  }, []);

  useFocusEffect(useCallback(() => {
    stats.refetch(); breakdown.refetch(); trends.refetch();
    split.refetch(); upcoming.refetch();
  }, []));

  const statsData = stats?.data;
  const breakdownData = breakdown?.data?.items ?? [];
  const trendsData = trends?.data?.items ?? [];
  const splitData = split?.data;
  const suggestionsData = suggestions?.data?.items ?? [];
  const upcomingData = upcoming?.data?.items ?? [];

  const pieData = breakdownData.slice(0, 6).map((item, i) => ({
    name: item?.category ?? 'Other',
    amount: item?.amount ?? 0,
    color: colors.chartColors[i % colors.chartColors.length],
    legendFontColor: colors.body,
    legendFontSize: 12,
  }));

  const barLabels = trendsData.slice(-6).map((t) => {
    const parts = (t?.month ?? '').split('-');
    return parts?.[1] ?? '';
  });
  const barValues = trendsData.slice(-6).map((t) => t?.amount ?? 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxl }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name ?? 'there'}</Text>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>
      </View>

      {/* Bank Selection Banner */}
      {!hasBankSelected && (
        <Pressable style={styles.bankBanner} onPress={() => router.push('/tabs/profile')}>
          <View style={styles.bankBannerLeft}>
            <Ionicons name="business" size={22} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.bankBannerTitle}>Select Your Bank</Text>
              <Text style={styles.bankBannerDesc}>Choose your bank to track only its SMS transactions</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </Pressable>
      )}

      {/* Summary Cards */}
      {stats.isLoading ? (
        <View style={styles.row}>
          <SkeletonLoader height={80} style={{ flex: 1, marginRight: spacing.sm }} />
          <SkeletonLoader height={80} style={{ flex: 1 }} />
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Monthly Spend</Text>
            <Text style={styles.summaryValue}>{formatINR(statsData?.monthlySpend ?? 0)}</Text>
            {(statsData?.monthOverMonthChange ?? 0) !== 0 && (
              <View style={styles.trendRow}>
                <Ionicons name={(statsData?.monthOverMonthChange ?? 0) > 0 ? 'trending-up' : 'trending-down'} size={14} color={(statsData?.monthOverMonthChange ?? 0) > 0 ? colors.error : colors.success} />
                <Text style={[styles.trendText, { color: (statsData?.monthOverMonthChange ?? 0) > 0 ? colors.error : colors.success }]}>
                  {Math.abs(statsData?.monthOverMonthChange ?? 0).toFixed(1)}%
                </Text>
              </View>
            )}
          </Card>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Yearly Spend</Text>
            <Text style={styles.summaryValue}>{formatINR(statsData?.yearlySpend ?? 0)}</Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Monthly Income</Text>
            <Text style={[styles.summaryValue, { color: colors.success }]}>{formatINR(statsData?.monthlyIncome ?? 0)}</Text>
          </Card>
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Net Cash Flow</Text>
            <Text style={[styles.summaryValue, { color: ((statsData?.monthlyIncome ?? 0) - (statsData?.monthlySpend ?? 0)) >= 0 ? colors.success : colors.error }]}>
              {((statsData?.monthlyIncome ?? 0) - (statsData?.monthlySpend ?? 0)) >= 0 ? '+' : ''}{formatINR(Math.abs((statsData?.monthlyIncome ?? 0) - (statsData?.monthlySpend ?? 0)))}
            </Text>
          </Card>
        </ScrollView>
      )}

      {/* Quick Stats */}
      {!stats.isLoading && (
        <View style={styles.quickStatsRow}>
          <Card style={styles.miniCard}>
            <Text style={styles.miniValue}>{statsData?.activeSubscriptionCount ?? 0}</Text>
            <Text style={styles.miniLabel}>Active Subs</Text>
          </Card>
          <Card style={styles.miniCard}>
            <Text style={styles.miniValue} numberOfLines={1}>{(statsData?.biggestSubscription as any)?.name ?? '-'}</Text>
            <Text style={styles.miniLabel}>Biggest Sub</Text>
          </Card>
          <Card style={styles.miniCard}>
            <Text style={styles.miniValue} numberOfLines={1}>{(statsData?.topCategory as any)?.name ?? '-'}</Text>
            <Text style={styles.miniLabel}>Top Category</Text>
          </Card>
        </View>
      )}

      {/* Pie Chart */}
      {pieData.length > 0 && (
        <Card style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Spending by Category</Text>
          <PieChart
            data={pieData}
            width={chartWidth}
            height={200}
            chartConfig={{ color: () => colors.primary, labelColor: () => colors.body, backgroundGradientFrom: colors.card, backgroundGradientTo: colors.card }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="10"
          />
        </Card>
      )}

      {/* Bar Chart */}
      {barValues.length > 0 && (
        <Card style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Monthly Trends</Text>
          <BarChart
            data={{ labels: barLabels, datasets: [{ data: barValues.length > 0 ? barValues : [0] }] }}
            width={chartWidth}
            height={220}
            yAxisLabel="₹"
            yAxisSuffix=""
            chartConfig={{
              backgroundGradientFrom: colors.card,
              backgroundGradientTo: colors.card,
              color: (opacity = 1) => `rgba(17, 24, 39, ${opacity})`,
              labelColor: () => colors.muted,
              barPercentage: 0.6,
              decimalPlaces: 0,
            }}
            style={{ borderRadius: borderRadius.md }}
          />
        </Card>
      )}

      {/* Split */}
      {splitData && (
        <Card style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Subscriptions vs Expenses</Text>
          <View style={styles.splitRow}>
            <View style={styles.splitItem}>
              <View style={[styles.splitDot, { backgroundColor: colors.primary }]} />
              <Text style={styles.splitLabel}>Subscriptions</Text>
              <Text style={styles.splitValue}>{formatINR(splitData?.subscriptionTotal ?? 0)}</Text>
            </View>
            <View style={styles.splitItem}>
              <View style={[styles.splitDot, { backgroundColor: '#2563EB' }]} />
              <Text style={styles.splitLabel}>Expenses</Text>
              <Text style={styles.splitValue}>{formatINR(splitData?.expenseTotal ?? 0)}</Text>
            </View>
          </View>
          <View style={styles.splitBarContainer}>
            <View style={[
              styles.splitBarLeft,
              { flex: Math.max(splitData?.subscriptionTotal ?? 0, 0.01) },
            ]} />
            <View style={[
              styles.splitBarRight,
              { flex: Math.max(splitData?.expenseTotal ?? 0, 0.01) },
            ]} />
          </View>
        </Card>
      )}

      {/* AI Insights */}
      <Card style={styles.chartCard}>
        <View style={styles.sectionHeader}>
          <Ionicons name="sparkles" size={20} color={colors.primary} />
          <Text style={[styles.sectionTitle, { marginBottom: 0, marginLeft: spacing.sm }]}>AI Insights</Text>
          <Pressable style={{ marginLeft: 'auto' }} onPress={() => router.push('/insights')}>
            <Text style={styles.viewAll}>View All</Text>
          </Pressable>
        </View>
        {suggestionsData.length > 0 ? suggestionsData.slice(0, 3).map((s) => (
          <View key={s?.id ?? Math.random().toString()} style={styles.suggestionItem}>
            <Ionicons name={getIconName(s?.icon)} size={20} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={styles.suggestionTitle}>{s?.title ?? ''}</Text>
              <Text style={styles.suggestionDesc} numberOfLines={2}>{s?.description ?? ''}</Text>
            </View>
          </View>
        )) : (
          <Text style={styles.emptyText}>No insights yet. Add some expenses to get started!</Text>
        )}
      </Card>

      {/* Upcoming Renewals */}
      <Card style={styles.chartCard}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Upcoming Renewals</Text>
          <Pressable style={{ marginLeft: 'auto' }} onPress={() => router.push('/tabs/subscriptions')}>
            <Text style={styles.viewAll}>See All</Text>
          </Pressable>
        </View>
        {upcomingData.length > 0 ? upcomingData.slice(0, 5).map((sub) => {
          const daysUntil = Math.ceil((new Date(sub?.nextRenewalDate ?? '').getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          return (
            <View key={sub?.id ?? Math.random().toString()} style={styles.upcomingItem}>
              <View>
                <Text style={styles.upcomingName}>{sub?.name ?? ''}</Text>
                <Text style={styles.upcomingDays}>{daysUntil > 0 ? `in ${daysUntil} day${daysUntil === 1 ? '' : 's'}` : 'Today'}</Text>
              </View>
              <Text style={styles.upcomingAmount}>{formatINR(sub?.amount ?? 0)}</Text>
            </View>
          );
        }) : (
          <Text style={styles.emptyText}>No upcoming renewals</Text>
        )}
      </Card>
    </ScrollView>
  );
}

function getIconName(icon?: string): any {
  switch (icon) {
    case 'warning': return 'warning-outline';
    case 'trending-down': return 'trending-down';
    case 'star': return 'star-outline';
    case 'shield': return 'shield-outline';
    default: return 'bulb-outline';
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  greeting: { color: colors.muted, fontSize: 14 },
  headerTitle: { color: colors.heading, fontSize: 28, fontWeight: '700' },
  row: { flexDirection: 'row', paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  summaryCard: { width: 180, marginRight: spacing.sm, marginLeft: spacing.lg },
  summaryLabel: { color: colors.muted, fontSize: 13 },
  summaryValue: { color: colors.heading, fontSize: 24, fontWeight: '700', marginTop: spacing.xs },
  trendRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs, gap: 4 },
  trendText: { fontSize: 12, fontWeight: '600' },
  quickStatsRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm, marginBottom: spacing.md },
  miniCard: { flex: 1, alignItems: 'center', paddingVertical: spacing.sm },
  miniValue: { color: colors.heading, fontSize: 16, fontWeight: '600' },
  miniLabel: { color: colors.muted, fontSize: 11, marginTop: 2 },
  chartCard: { marginHorizontal: spacing.lg, marginBottom: spacing.md },
  sectionTitle: { color: colors.heading, fontSize: 18, fontWeight: '600', marginBottom: spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  viewAll: { color: colors.primary, fontSize: 14, fontWeight: '500' },
  splitRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.md },
  splitItem: { alignItems: 'center' },
  splitDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 4 },
  splitLabel: { color: colors.muted, fontSize: 12 },
  splitValue: { color: colors.heading, fontSize: 18, fontWeight: '600' },
  splitBarContainer: { flexDirection: 'row', height: 12, borderRadius: 6, overflow: 'hidden' },
  splitBarLeft: { backgroundColor: colors.primary, borderTopLeftRadius: 6, borderBottomLeftRadius: 6 },
  splitBarRight: { backgroundColor: '#2563EB', borderTopRightRadius: 6, borderBottomRightRadius: 6 },
  suggestionItem: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.cardBorder },
  suggestionTitle: { color: colors.heading, fontSize: 14, fontWeight: '600' },
  suggestionDesc: { color: colors.muted, fontSize: 13, marginTop: 2 },
  upcomingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.cardBorder },
  upcomingName: { color: colors.heading, fontSize: 14, fontWeight: '500' },
  upcomingDays: { color: colors.muted, fontSize: 12, marginTop: 2 },
  upcomingAmount: { color: colors.heading, fontSize: 16, fontWeight: '600' },
  emptyText: { color: colors.muted, fontSize: 14, textAlign: 'center', paddingVertical: spacing.md },
  bankBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  bankBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  bankBannerTitle: { color: colors.heading, fontSize: 15, fontWeight: '600' },
  bankBannerDesc: { color: colors.muted, fontSize: 12, marginTop: 2 },
});
