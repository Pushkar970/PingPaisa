import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useUserControllerUpgrade } from '@/src/api/generated/api';
import GradientButton from '@/src/components/GradientButton';
import Card from '@/src/components/Card';
import { colors, spacing, borderRadius } from '@/src/theme';

const FEATURES = [
  { name: 'Subscriptions', free: '5', pro: 'Unlimited' },
  { name: 'AI Queries', free: '10/month', pro: 'Unlimited' },
  { name: 'CSV Export', free: false, pro: true },
  { name: 'All Charts', free: 'Basic', pro: 'All' },
];

export default function UpgradeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mutation = useUserControllerUpgrade();

  const handleUpgrade = useCallback(() => {
    mutation.mutate(undefined, { onSuccess: () => router.back() });
  }, [mutation]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxl }}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color={colors.heading} /></Pressable>
        <Text style={styles.title}>Go Pro</Text>
        <View style={{ width: 24 }} />
      </View>

      <LinearGradient colors={colors.gradientPrimary} style={styles.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <Ionicons name="diamond" size={48} color={colors.white} />
        <Text style={styles.heroTitle}>Pro</Text>
        <Text style={styles.heroSubtitle}>Unlock the full experience</Text>
      </LinearGradient>

      <Card style={styles.comparisonCard}>
        <View style={styles.comparisonHeader}>
          <Text style={[styles.colHeader, { flex: 2 }]}>Feature</Text>
          <Text style={styles.colHeader}>Free</Text>
          <Text style={[styles.colHeader, { color: colors.primary }]}>Pro</Text>
        </View>
        {FEATURES.map((f) => (
          <View key={f.name} style={styles.comparisonRow}>
            <Text style={[styles.featureName, { flex: 2 }]}>{f.name}</Text>
            <View style={styles.colCenter}>
              {typeof f.free === 'boolean' ? (
                <Ionicons name={f.free ? 'checkmark-circle' : 'close-circle'} size={20} color={f.free ? colors.success : colors.error} />
              ) : (
                <Text style={styles.featureValue}>{f.free}</Text>
              )}
            </View>
            <View style={styles.colCenter}>
              {typeof f.pro === 'boolean' ? (
                <Ionicons name={f.pro ? 'checkmark-circle' : 'close-circle'} size={20} color={f.pro ? colors.success : colors.error} />
              ) : (
                <Text style={[styles.featureValue, { color: colors.primary }]}>{f.pro}</Text>
              )}
            </View>
          </View>
        ))}
      </Card>

      <View style={{ paddingHorizontal: spacing.lg }}>
        <GradientButton title="Upgrade to Pro" onPress={handleUpgrade} loading={mutation.isPending} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  title: { color: colors.heading, fontSize: 20, fontWeight: '600' },
  hero: { marginHorizontal: spacing.lg, borderRadius: borderRadius.lg, padding: spacing.xl, alignItems: 'center', marginBottom: spacing.lg },
  heroTitle: { color: colors.white, fontSize: 32, fontWeight: '700', marginTop: spacing.sm },
  heroSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 16, marginTop: spacing.xs },
  comparisonCard: { marginHorizontal: spacing.lg, marginBottom: spacing.lg },
  comparisonHeader: { flexDirection: 'row', paddingBottom: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  colHeader: { flex: 1, textAlign: 'center', color: colors.muted, fontSize: 13, fontWeight: '600' },
  comparisonRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.cardBorder },
  featureName: { color: colors.body, fontSize: 14 },
  featureValue: { color: colors.body, fontSize: 14, textAlign: 'center' },
  colCenter: { flex: 1, alignItems: 'center' },
});
