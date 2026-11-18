import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Pressable, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useExpensesControllerParseSms, useExpensesControllerCreate, userControllerGetPlan } from '@/src/api/generated/api';
import type { ParsedExpenseItemDto } from '@/src/api/generated/schemas';
import GradientButton from '@/src/components/GradientButton';
import Card from '@/src/components/Card';
import { colors, spacing, borderRadius } from '@/src/theme';
import { getErrorMessage } from '@/src/api/customFetch';
import { formatINR } from '@/src/utils/currency';
import * as Clipboard from 'expo-clipboard';

export default function SmartPasteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const parseMutation = useExpensesControllerParseSms();
  const createMutation = useExpensesControllerCreate();

  const [smsText, setSmsText] = useState('');
  const [parsedItems, setParsedItems] = useState<ParsedExpenseItemDto[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [error, setError] = useState('');
  const [step, setStep] = useState<'paste' | 'review'>('paste');
  const [saving, setSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  const handlePasteFromClipboard = useCallback(async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        setSmsText((prev) => (prev ? prev + '\n---\n' + text : text));
      }
    } catch {
      // ignore clipboard errors
    }
  }, []);

  const handleParse = useCallback(() => {
    if (!smsText?.trim()) {
      setError('Please paste at least one bank SMS message');
      return;
    }
    setError('');
    // Split messages by common separators
    const messages = smsText
      .split(/\n---\n|\n\n|(?=(?:Dear|Your|INR|Rs\.))/gi)
      .map((m) => m.trim())
      .filter((m) => m.length > 10);

    if (messages.length === 0) {
      setError('Could not detect any SMS messages. Paste the full SMS text.');
      return;
    }

    parseMutation.mutate(
      { data: { messages } },
      {
        onSuccess: (data) => {
          const items = data?.parsed ?? [];
          if (items.length === 0) {
            setError('No valid transactions found in the pasted text. Make sure you\'re pasting bank debit/payment SMS messages.');
            return;
          }
          setParsedItems(items);
          setSelectedItems(new Set(items.map((_, i) => i)));
          setStep('review');
        },
        onError: (e) => setError(getErrorMessage(e, 'Failed to parse SMS')),
      },
    );
  }, [smsText, parseMutation]);

  const toggleItem = useCallback((index: number) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const handleSaveAll = useCallback(async () => {
    const itemsToSave = parsedItems.filter((_, i) => selectedItems.has(i));
    if (itemsToSave.length === 0) {
      setError('Select at least one expense to save');
      return;
    }
    setSaving(true);
    setError('');
    let saved = 0;
    for (const item of itemsToSave) {
      try {
        await new Promise<void>((resolve, reject) => {
          createMutation.mutate(
            {
              data: {
                title: item?.title ?? 'Unknown',
                amount: item?.amount ?? 0,
                category: item?.category ?? 'Other',
                date: item?.date ?? new Date().toISOString(),
                notes: item?.originalSms ?? item?.notes ?? undefined,
                source: 'sms',
              },
            },
            {
              onSuccess: () => { saved++; resolve(); },
              onError: () => resolve(), // skip failed ones
            },
          );
        });
      } catch {
        // continue
      }
    }
    setSavedCount(saved);
    setSaving(false);
    if (saved > 0) {
      // Check monthly limit
      try {
        const planData = await userControllerGetPlan();
        if (planData?.limitExceeded) {
          Alert.alert(
            '⚠️ Monthly Limit Exceeded',
            `You've spent ${formatINR(planData.monthlySpent ?? 0)} this month, exceeding your ${formatINR(planData.monthlyLimit ?? 0)} monthly limit.`,
            [{ text: 'OK', onPress: () => router.back() }],
          );
          return;
        }
      } catch {}
      if (Platform.OS === 'web') {
        alert(`${saved} expense(s) added successfully!`);
        router.back();
      } else {
        Alert.alert('Success', `${saved} expense(s) added successfully!`, [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } else {
      setError('Failed to save expenses. Please try again.');
    }
  }, [parsedItems, selectedItems, createMutation, router]);

  const getCategoryIcon = (category: string): string => {
    const map: Record<string, string> = {
      Streaming: 'play-circle-outline',
      SaaS: 'cloud-outline',
      Groceries: 'cart-outline',
      Transport: 'car-outline',
      Dining: 'restaurant-outline',
      Shopping: 'bag-outline',
      Bills: 'receipt-outline',
      Health: 'heart-outline',
      Travel: 'airplane-outline',
      Entertainment: 'game-controller-outline',
      Education: 'book-outline',
      Fitness: 'barbell-outline',
      UPI: 'phone-portrait-outline',
      ATM: 'cash-outline',
      Transfer: 'swap-horizontal-outline',
    };
    return (map as any)?.[category] ?? 'ellipse-outline';
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => (step === 'review' ? setStep('paste') : router.back())} hitSlop={12}>
          <Ionicons name={step === 'review' ? 'arrow-back' : 'close'} size={28} color={colors.heading} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {step === 'paste' ? 'Smart Paste' : 'Review Expenses'}
        </Text>
        <View style={{ width: 28 }} />
      </View>

      {step === 'paste' ? (
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Info card */}
          <LinearGradient
            colors={colors.gradientPrimary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.infoCard}
          >
            <Ionicons name="scan-outline" size={32} color={colors.white} />
            <View style={{ flex: 1, marginLeft: spacing.md }}>
              <Text style={styles.infoTitle}>AI-Powered SMS Parser</Text>
              <Text style={styles.infoDesc}>
                Paste your bank transaction SMS messages below. Our AI will extract the merchant, amount, category, and date automatically.
              </Text>
            </View>
          </LinearGradient>

          {/* How it works */}
          <View style={styles.stepsContainer}>
            {[
              { icon: 'copy-outline', label: 'Copy a bank SMS from your messages app' },
              { icon: 'clipboard-outline', label: 'Paste it here (multiple SMS supported)' },
              { icon: 'sparkles-outline', label: 'AI extracts expense details automatically' },
              { icon: 'checkmark-circle-outline', label: 'Review and save to your expenses' },
            ].map((s, i) => (
              <View key={i} style={styles.stepRow}>
                <View style={styles.stepIcon}>
                  <Ionicons name={s.icon as any} size={18} color={colors.accent} />
                </View>
                <Text style={styles.stepText}>{s.label}</Text>
              </View>
            ))}
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Text style={styles.label}>Paste Bank SMS Messages</Text>
          <TextInput
            style={styles.textArea}
            value={smsText}
            onChangeText={setSmsText}
            multiline
            numberOfLines={8}
            placeholder={'Example:\nDear Customer, Rs.499.00 debited from A/c **1234 for UPI-Amazon. Ref 412345678901. If not done by u, call 18001234567.\n\nPaste multiple messages separated by blank lines or ---'}
            placeholderTextColor={colors.muted}
            textAlignVertical="top"
          />

          <Pressable style={styles.pasteButton} onPress={handlePasteFromClipboard}>
            <Ionicons name="clipboard" size={18} color={colors.accent} />
            <Text style={styles.pasteButtonText}>Paste from Clipboard</Text>
          </Pressable>

          <GradientButton
            title="Parse Messages"
            onPress={handleParse}
            loading={parseMutation.isPending}
            style={{ marginTop: spacing.lg }}
          />
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.reviewSummary}>
            Found {parsedItems.length} transaction{parsedItems.length !== 1 ? 's' : ''}. Tap to select/deselect.
          </Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {parsedItems.map((item, index) => {
            const isSelected = selectedItems.has(index);
            return (
              <Pressable key={index} onPress={() => toggleItem(index)}>
                <Card style={[styles.parsedCard, !isSelected && styles.parsedCardDim]}>
                  <View style={styles.parsedCardHeader}>
                    <View style={styles.parsedCardLeft}>
                      <View style={[styles.checkCircle, isSelected && styles.checkCircleActive]}>
                        {isSelected && <Ionicons name="checkmark" size={14} color={colors.white} />}
                      </View>
                      <View style={styles.categoryIconWrap}>
                        <Ionicons name={getCategoryIcon(item?.category ?? '') as any} size={20} color={colors.accent} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.parsedTitle}>{item?.title ?? 'Unknown'}</Text>
                        <View style={styles.parsedMeta}>
                          <View style={styles.categoryChip}>
                            <Text style={styles.categoryChipText}>{item?.category ?? 'Other'}</Text>
                          </View>
                          <Text style={styles.parsedDate}>
                            {new Date(item?.date ?? '').toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.parsedAmount}>
                      {formatINR(item?.amount ?? 0)}
                    </Text>
                  </View>
                  {item?.originalSms ? (
                    <Text style={styles.originalSms} numberOfLines={2}>
                      {item.originalSms}
                    </Text>
                  ) : null}
                </Card>
              </Pressable>
            );
          })}

          <View style={styles.reviewActions}>
            <Pressable
              style={styles.selectAllBtn}
              onPress={() => {
                if (selectedItems.size === parsedItems.length) {
                  setSelectedItems(new Set());
                } else {
                  setSelectedItems(new Set(parsedItems.map((_, i) => i)));
                }
              }}
            >
              <Text style={styles.selectAllText}>
                {selectedItems.size === parsedItems.length ? 'Deselect All' : 'Select All'}
              </Text>
            </Pressable>
          </View>

          <GradientButton
            title={`Save ${selectedItems.size} Expense${selectedItems.size !== 1 ? 's' : ''}`}
            onPress={handleSaveAll}
            loading={saving}
            style={{ marginTop: spacing.md }}
          />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerTitle: { color: colors.heading, fontSize: 20, fontWeight: '600' },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  infoTitle: { color: colors.white, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  infoDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 13, lineHeight: 18 },
  stepsContainer: { marginBottom: spacing.lg },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  stepText: { color: colors.body, fontSize: 14, flex: 1 },
  label: { color: colors.body, fontSize: 14, fontWeight: '500', marginBottom: spacing.xs },
  textArea: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.heading,
    fontSize: 14,
    minHeight: 160,
    lineHeight: 20,
  },
  pasteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  pasteButtonText: { color: colors.accent, fontSize: 14, fontWeight: '600' },
  error: { color: colors.error, fontSize: 14, marginBottom: spacing.md },
  reviewSummary: { color: colors.body, fontSize: 15, marginBottom: spacing.md },
  parsedCard: { marginBottom: spacing.sm, padding: spacing.md },
  parsedCardDim: { opacity: 0.5 },
  parsedCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  parsedCardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  checkCircleActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(17, 24, 39, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  parsedTitle: { color: colors.heading, fontSize: 15, fontWeight: '600' },
  parsedMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: spacing.sm },
  categoryChip: {
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  categoryChipText: { color: colors.muted, fontSize: 11 },
  parsedDate: { color: colors.muted, fontSize: 12 },
  parsedAmount: { color: colors.accent, fontSize: 18, fontWeight: '700' },
  originalSms: {
    color: colors.muted,
    fontSize: 12,
    marginTop: spacing.sm,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  reviewActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: spacing.sm },
  selectAllBtn: { paddingVertical: 8, paddingHorizontal: 12 },
  selectAllText: { color: colors.primary, fontSize: 14, fontWeight: '600' },
});
