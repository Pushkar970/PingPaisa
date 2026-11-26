import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAiControllerGetSuggestions } from '@/src/api/generated/api';
import Card from '@/src/components/Card';
import SkeletonLoader from '@/src/components/SkeletonLoader';
import { colors, spacing, borderRadius } from '@/src/theme';

function getIconName(icon?: string): any {
  switch (icon) {
    case 'warning': return 'warning-outline';
    case 'trending-down': return 'trending-down';
    case 'star': return 'star-outline';
    case 'shield': return 'shield-outline';
    default: return 'bulb-outline';
  }
}

export default function InsightsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const suggestions = useAiControllerGetSuggestions();
  const items = suggestions?.data?.items ?? [];

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.heading} /></Pressable>
        <Text style={styles.title}>AI Insights</Text>
        <View style={{ width: 24 }} />
      </View>

      {suggestions.isLoading ? (
        <View style={{ paddingHorizontal: spacing.lg }}>
          {[1, 2, 3].map((i) => <SkeletonLoader key={i} height={80} style={{ marginBottom: spacing.sm }} />)}
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item?.id ?? Math.random().toString()}
          renderItem={({ item }) => (
            <Card style={styles.insightCard}>
              <Ionicons name={getIconName(item?.icon)} size={24} color={colors.accent} />
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>{item?.title ?? ''}</Text>
                <Text style={styles.insightDesc}>{item?.description ?? ''}</Text>
                <View style={styles.tagRow}>
                  <View style={styles.tag}><Text style={styles.tagText}>{item?.category ?? ''}</Text></View>
                </View>
              </View>
            </Card>
          )}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}
          refreshControl={<RefreshControl refreshing={suggestions.isRefetching} onRefresh={() => suggestions.refetch()} tintColor={colors.primary} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="sparkles" size={48} color={colors.muted} />
              <Text style={styles.emptyText}>No insights available yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  title: { color: colors.heading, fontSize: 20, fontWeight: '600' },
  insightCard: { flexDirection: 'row', marginBottom: spacing.sm, gap: spacing.md },
  insightContent: { flex: 1 },
  insightTitle: { color: colors.heading, fontSize: 16, fontWeight: '600' },
  insightDesc: { color: colors.body, fontSize: 14, marginTop: 4, lineHeight: 20 },
  tagRow: { flexDirection: 'row', marginTop: spacing.sm },
  tag: { backgroundColor: colors.surfaceVariant, paddingHorizontal: 10, paddingVertical: 3, borderRadius: borderRadius.full },
  tagText: { color: colors.muted, fontSize: 11 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyText: { color: colors.muted, fontSize: 16, marginTop: spacing.md },
});
