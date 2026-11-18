import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Animated,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius } from '@/src/theme';
import GradientButton from '@/src/components/GradientButton';
import Card from '@/src/components/Card';
import { getErrorMessage } from '@/src/api/customFetch';
import { formatINR } from '@/src/utils/currency';
import {
  useExpensesControllerParseSms,
  useExpensesControllerCreateBatch,
} from '@/src/api/generated/api';
import { userControllerGetPlan } from '@/src/api/generated/api';
import type { ParsedExpenseItemDto } from '@/src/api/generated/schemas';
import {
  isSmsAvailable,
  hasSmsPermission,
  requestSmsPermission,
  readNewTransactionSms,
  markAsProcessed,
  detectBankFromInbox,
  type FilteredSms,
  type DetectedBank,
} from '@/src/services/smsReader';
import { getSelectedBankId, setSelectedBankId, getBankById } from '@/src/services/indianBanks';

type Step = 'start' | 'detecting' | 'scanning' | 'parsing' | 'review' | 'saving' | 'done';

export default function SmsSyncScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const parseMutation = useExpensesControllerParseSms();
  const batchMutation = useExpensesControllerCreateBatch();

  const [step, setStep] = useState<Step>('start');
  const [error, setError] = useState('');
  const [smsMessages, setSmsMessages] = useState<FilteredSms[]>([]);
  const [parsedItems, setParsedItems] = useState<ParsedExpenseItemDto[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [savedCount, setSavedCount] = useState(0);
  const [smsCount, setSmsCount] = useState(0);
  const [detectedBanks, setDetectedBanks] = useState<DetectedBank[]>([]);
  const [showBankPicker, setShowBankPicker] = useState(false);
  const [currentBankName, setCurrentBankName] = useState<string | null>(null);

  // Load current bank name on mount
  useEffect(() => {
    getSelectedBankId().then((id) => {
      if (id) {
        const bank = getBankById(id);
        setCurrentBankName(bank?.name ?? null);
      }
    }).catch(() => {});
  }, []);

  // Scanning pulse animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (step === 'scanning' || step === 'parsing' || step === 'detecting') {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.15, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    }
  }, [step, pulseAnim]);

  /** Run the actual SMS scan + AI parse (called after bank is set) */
  const runScanAndParse = useCallback(async () => {
    setStep('scanning');
    try {
      const messages = await readNewTransactionSms(30);
      setSmsMessages(messages);
      setSmsCount(messages.length);

      if (messages.length === 0) {
        setStep('start');
        setError('No new bank/UPI transaction SMS found in the last 30 days.');
        return;
      }

      // Parse via AI
      setStep('parsing');
      const bodies = messages.map((m) => m.body);
      parseMutation.mutate(
        { data: { messages: bodies } },
        {
          onSuccess: (data) => {
            const items = data?.parsed ?? [];
            if (items.length === 0) {
              setStep('start');
              setError('Could not parse any transactions from the SMS messages found.');
              return;
            }
            setParsedItems(items);
            setSelectedIndices(new Set(items.map((_, i) => i)));
            setStep('review');
          },
          onError: (err) => {
            setStep('start');
            setError(getErrorMessage(err));
          },
        },
      );
    } catch (e) {
      setStep('start');
      setError(getErrorMessage(e));
    }
  }, [parseMutation]);

  const handleStartScan = useCallback(async () => {
    setError('');

    if (Platform.OS !== 'android') {
      setError('SMS Auto-Sync is available on Android devices only. Use Smart Paste on this platform.');
      return;
    }

    if (!isSmsAvailable()) {
      setError('SMS reading module not available. Please build the app and install on your Android device.');
      return;
    }

    // Check / request permission
    let hasPermission = await hasSmsPermission();
    if (!hasPermission) {
      hasPermission = await requestSmsPermission();
    }
    if (!hasPermission) {
      setError('SMS permission is required to scan your messages. Please grant it in Settings.');
      return;
    }

    // If no bank selected yet, run auto-detection first
    const existingBankId = await getSelectedBankId();
    if (!existingBankId) {
      setStep('detecting');
      try {
        const detected = await detectBankFromInbox(90);
        if (detected.length > 0) {
          setDetectedBanks(detected);
          setShowBankPicker(true);
          return; // wait for user to pick a bank
        }
        // No banks detected — proceed without bank filter
        await runScanAndParse();
      } catch {
        await runScanAndParse();
      }
    } else {
      await runScanAndParse();
    }
  }, [runScanAndParse]);

  /** Called when user picks a detected bank from the picker */
  const handlePickDetectedBank = useCallback(async (detected: DetectedBank) => {
    setShowBankPicker(false);
    await setSelectedBankId(detected.bank.id);
    setCurrentBankName(detected.bank.name);
    // Now run the actual scan (which will filter by selected bank)
    await runScanAndParse();
  }, [runScanAndParse]);

  /** Called when user skips bank selection */
  const handleSkipBankDetection = useCallback(async () => {
    setShowBankPicker(false);
    await runScanAndParse();
  }, [runScanAndParse]);

  const toggleItem = useCallback((index: number) => {
    setSelectedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIndices(new Set(parsedItems.map((_, i) => i)));
  }, [parsedItems]);

  const deselectAll = useCallback(() => {
    setSelectedIndices(new Set());
  }, []);

  const handleSave = useCallback(() => {
    const selected = parsedItems.filter((_, i) => selectedIndices.has(i));
    if (selected.length === 0) {
      Alert.alert('No items selected', 'Please select at least one transaction to save.');
      return;
    }

    setStep('saving');
    const expenses = selected.map((item) => ({
      title: item?.title ?? 'Unknown',
      amount: Number(item?.amount ?? 0),
      category: item?.category ?? 'Other',
      date: item?.date ?? new Date().toISOString(),
      notes: item?.originalSms ?? null,
      source: 'sms',
    }));

    batchMutation.mutate(
      { data: { expenses } },
      {
        onSuccess: async (data) => {
          setSavedCount(data?.count ?? expenses.length);
          // Mark SMS as processed
          const hashes = smsMessages.map((m) => m.hash);
          markAsProcessed(hashes);
          setStep('done');
          // Check monthly limit
          try {
            const planData = await userControllerGetPlan();
            if (planData?.limitExceeded) {
              Alert.alert(
                '⚠️ Monthly Limit Exceeded',
                `You've spent ${formatINR(planData.monthlySpent ?? 0)} this month, exceeding your ${formatINR(planData.monthlyLimit ?? 0)} monthly limit.`,
              );
            }
          } catch {}
        },
        onError: (err) => {
          setStep('review');
          Alert.alert('Save Failed', getErrorMessage(err));
        },
      },
    );
  }, [parsedItems, selectedIndices, smsMessages, batchMutation]);

  const isAndroid = Platform.OS === 'android';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.heading} />
        </Pressable>
        <Text style={styles.headerTitle}>SMS Auto-Sync</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Start State */}
        {step === 'start' && (
          <View style={styles.startContainer}>
            <View style={styles.iconCircle}>
              <LinearGradient
                colors={colors.gradientPrimary}
                style={styles.iconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="phone-portrait-outline" size={48} color={colors.white} />
              </LinearGradient>
            </View>
            <Text style={styles.startTitle}>Auto-Detect Expenses</Text>
            <Text style={styles.startDesc}>
              Scan your SMS inbox for bank and UPI transaction messages. The AI will
              parse them into expenses for you to review and save.
            </Text>

            {!isAndroid && (
              <Card style={styles.warningCard}>
                <Ionicons name="information-circle" size={20} color={colors.warning} />
                <Text style={styles.warningText}>
                  SMS Auto-Sync is an Android-only feature. On this device, use{' '}
                  <Text
                    style={styles.linkText}
                    onPress={() => router.replace('/expense/smart-paste')}
                  >
                    Smart Paste
                  </Text>{' '}
                  to manually paste bank SMS.
                </Text>
              </Card>
            )}

            {error ? (
              <Card style={styles.errorCard}>
                <Ionicons name="alert-circle" size={18} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </Card>
            ) : null}

            {isAndroid && (
              <>
                <GradientButton
                  title="Scan SMS Inbox"
                  onPress={handleStartScan}
                  style={{ marginTop: spacing.lg }}
                />
                <Text style={styles.hint}>
                  Scans last 30 days · Only debit/payment SMS · Skips already tracked
                </Text>
              </>
            )}
          </View>
        )}

        {/* Detecting Banks State */}
        {step === 'detecting' && !showBankPicker && (
          <View style={styles.scanningContainer}>
            <Animated.View style={[styles.scanCircle, { transform: [{ scale: pulseAnim }] }]}>
              <LinearGradient
                colors={colors.gradientAccent}
                style={styles.scanGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="search" size={40} color={colors.white} />
              </LinearGradient>
            </Animated.View>
            <Text style={styles.scanTitle}>Detecting Your Bank...</Text>
            <Text style={styles.scanDesc}>
              Scanning SMS inbox to identify which bank's messages are present
            </Text>
            <ActivityIndicator size="small" color={colors.accent} style={{ marginTop: spacing.md }} />
          </View>
        )}

        {/* Scanning / Parsing State */}
        {(step === 'scanning' || step === 'parsing') && (
          <View style={styles.scanningContainer}>
            <Animated.View style={[styles.scanCircle, { transform: [{ scale: pulseAnim }] }]}>
              <LinearGradient
                colors={colors.gradientAccent}
                style={styles.scanGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons
                  name={step === 'scanning' ? 'phone-portrait-outline' : 'sparkles'}
                  size={40}
                  color={colors.white}
                />
              </LinearGradient>
            </Animated.View>
            <Text style={styles.scanTitle}>
              {step === 'scanning' ? 'Scanning SMS Inbox...' : 'AI Parsing Transactions...'}
            </Text>
            <Text style={styles.scanDesc}>
              {step === 'scanning'
                ? 'Looking for bank and UPI transaction messages'
                : `Found ${smsCount} transaction SMS. AI is extracting details...`}
            </Text>
            <ActivityIndicator size="small" color={colors.accent} style={{ marginTop: spacing.md }} />
          </View>
        )}

        {/* Review State */}
        {step === 'review' && (
          <View>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewTitle}>
                {parsedItems.length} Transaction{parsedItems.length !== 1 ? 's' : ''} Found
              </Text>
              <View style={styles.reviewActions}>
                <Pressable onPress={selectAll} style={styles.actionBtn}>
                  <Text style={styles.actionText}>Select All</Text>
                </Pressable>
                <Text style={styles.actionDivider}>·</Text>
                <Pressable onPress={deselectAll} style={styles.actionBtn}>
                  <Text style={styles.actionText}>Deselect All</Text>
                </Pressable>
              </View>
            </View>

            {parsedItems.map((item, index) => {
              const isSelected = selectedIndices.has(index);
              return (
                <Pressable key={index} onPress={() => toggleItem(index)}>
                  <Card style={[styles.itemCard, isSelected && styles.itemCardSelected]}>
                    <Pressable
                      onPress={() => toggleItem(index)}
                      style={[styles.checkbox, isSelected && styles.checkboxSelected]}
                    >
                      {isSelected && <Ionicons name="checkmark" size={14} color={colors.white} />}
                    </Pressable>
                    <View style={styles.itemContent}>
                      <View style={styles.itemRow}>
                        <Text style={styles.itemTitle} numberOfLines={1}>
                          {item?.title ?? 'Unknown'}
                        </Text>
                        <Text style={styles.itemAmount}>
                          ₹{Number(item?.amount ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </Text>
                      </View>
                      <View style={styles.itemMeta}>
                        <View style={styles.categoryChip}>
                          <Text style={styles.categoryText}>{item?.category ?? 'Other'}</Text>
                        </View>
                        <Text style={styles.itemDate}>
                          {item?.date ? new Date(item.date).toLocaleDateString('en-IN') : ''}
                        </Text>
                      </View>
                      {item?.originalSms ? (
                        <Text style={styles.smsPreview} numberOfLines={2}>
                          {item.originalSms}
                        </Text>
                      ) : null}
                    </View>
                  </Card>
                </Pressable>
              );
            })}

            <View style={styles.reviewFooter}>
              <Text style={styles.selectedCount}>
                {selectedIndices.size} of {parsedItems.length} selected
              </Text>
              <GradientButton
                title={`Save ${selectedIndices.size} Expense${selectedIndices.size !== 1 ? 's' : ''}`}
                onPress={handleSave}
                disabled={selectedIndices.size === 0}
              />
            </View>
          </View>
        )}

        {/* Saving State */}
        {step === 'saving' && (
          <View style={styles.scanningContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.scanTitle}>Saving Expenses...</Text>
          </View>
        )}

        {/* Done State */}
        {step === 'done' && (
          <View style={styles.doneContainer}>
            <View style={styles.doneCircle}>
              <Ionicons name="checkmark-circle" size={72} color={colors.success} />
            </View>
            <Text style={styles.doneTitle}>
              {savedCount} Expense{savedCount !== 1 ? 's' : ''} Saved!
            </Text>
            <Text style={styles.doneDesc}>
              Your bank transactions have been logged. You can edit or delete them anytime from the
              Expenses tab.
            </Text>
            <GradientButton
              title="View Expenses"
              onPress={() => router.replace('/tabs/expenses')}
              style={{ marginTop: spacing.lg }}
            />
            <Pressable
              style={styles.scanAgainBtn}
              onPress={() => {
                setStep('start');
                setSmsMessages([]);
                setParsedItems([]);
                setSelectedIndices(new Set());
                setError('');
              }}
            >
              <Text style={styles.scanAgainText}>Scan Again</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* Auto-detected Bank Picker Modal */}
      <Modal visible={showBankPicker} animationType="slide" transparent onRequestClose={() => setShowBankPicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + spacing.md }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Banks Detected</Text>
              <Pressable onPress={handleSkipBankDetection}>
                <Text style={styles.skipText}>Skip</Text>
              </Pressable>
            </View>
            <Text style={styles.modalDesc}>
              We found transaction SMS from these banks. Select one to track only its messages:
            </Text>
            <FlatList
              data={detectedBanks}
              keyExtractor={(item) => item.bank.id}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.detectedBankItem}
                  onPress={() => handlePickDetectedBank(item)}
                >
                  <View style={styles.detectedBankLeft}>
                    <Ionicons name="business" size={20} color={colors.accent} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.detectedBankName}>{item.bank.name}</Text>
                      <Text style={styles.detectedBankCount}>
                        {item.count} transaction{item.count !== 1 ? 's' : ''} found
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
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
  headerTitle: { color: colors.heading, fontSize: 18, fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },

  // Start
  startContainer: { alignItems: 'center', paddingTop: spacing.xxl },
  iconCircle: { marginBottom: spacing.lg },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startTitle: { color: colors.heading, fontSize: 24, fontWeight: '700', marginBottom: spacing.sm },
  startDesc: {
    color: colors.muted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.md,
  },
  hint: {
    color: colors.muted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.lg,
    borderColor: 'rgba(245,158,11,0.3)',
    borderWidth: 1,
    backgroundColor: 'rgba(245,158,11,0.06)',
  },
  warningText: { color: colors.body, fontSize: 13, flex: 1, lineHeight: 20 },
  linkText: { color: colors.accent, fontWeight: '600' },
  errorCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.md,
    borderColor: 'rgba(239,68,68,0.3)',
    borderWidth: 1,
    backgroundColor: 'rgba(239,68,68,0.06)',
  },
  errorText: { color: colors.error, fontSize: 13, flex: 1 },

  // Scanning
  scanningContainer: { alignItems: 'center', paddingTop: 80 },
  scanCircle: { marginBottom: spacing.lg },
  scanGradient: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanTitle: { color: colors.heading, fontSize: 20, fontWeight: '600', marginBottom: spacing.sm },
  scanDesc: { color: colors.muted, fontSize: 14, textAlign: 'center' },

  // Review
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  reviewTitle: { color: colors.heading, fontSize: 18, fontWeight: '600' },
  reviewActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  actionBtn: { paddingVertical: 4, paddingHorizontal: 6 },
  actionText: { color: colors.accent, fontSize: 13, fontWeight: '500' },
  actionDivider: { color: colors.muted, fontSize: 13 },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
    opacity: 0.6,
  },
  itemCardSelected: { opacity: 1, borderColor: colors.primary, borderWidth: 1.5 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginTop: 2,
  },
  checkboxSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  itemContent: { flex: 1 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: { color: colors.heading, fontSize: 15, fontWeight: '500', flex: 1, marginRight: 8 },
  itemAmount: { color: colors.heading, fontSize: 16, fontWeight: '700' },
  itemMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: spacing.sm },
  categoryChip: {
    backgroundColor: colors.surfaceVariant,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  categoryText: { color: colors.muted, fontSize: 11 },
  itemDate: { color: colors.muted, fontSize: 12 },
  smsPreview: {
    color: 'rgba(148,163,184,0.6)',
    fontSize: 11,
    marginTop: 6,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  reviewFooter: { marginTop: spacing.md, paddingBottom: spacing.xxl },
  selectedCount: {
    color: colors.muted,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: spacing.md,
  },

  // Done
  doneContainer: { alignItems: 'center', paddingTop: 60 },
  doneCircle: { marginBottom: spacing.md },
  doneTitle: { color: colors.heading, fontSize: 24, fontWeight: '700', marginBottom: spacing.sm },
  doneDesc: {
    color: colors.muted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.md,
  },
  scanAgainBtn: { marginTop: spacing.md, paddingVertical: 12 },
  scanAgainText: { color: colors.accent, fontSize: 15, fontWeight: '500' },
  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  modalTitle: { color: colors.heading, fontSize: 20, fontWeight: '700' },
  modalDesc: { color: colors.muted, fontSize: 14, lineHeight: 20, marginBottom: spacing.md },
  skipText: { color: colors.accent, fontSize: 15, fontWeight: '500' },
  detectedBankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  detectedBankLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 },
  detectedBankName: { color: colors.heading, fontSize: 15, fontWeight: '600' },
  detectedBankCount: { color: colors.muted, fontSize: 12, marginTop: 2 },
});
