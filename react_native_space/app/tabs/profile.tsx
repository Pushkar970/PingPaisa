import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Platform, Alert, TextInput, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserControllerGetPlan, useUserControllerSetMonthlyLimit, useDashboardControllerGetStats } from '@/src/api/generated/api';
import { useAuth } from '@/src/context/AuthContext';
import Card from '@/src/components/Card';
import { colors, spacing, borderRadius } from '@/src/theme';
import { INDIAN_BANKS, getSelectedBankId, setSelectedBankId, getBankById, type IndianBank } from '@/src/services/indianBanks';
import { formatINR } from '@/src/utils/currency';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const plan = useUserControllerGetPlan();
  const dashStats = useDashboardControllerGetStats();
  const setLimitMutation = useUserControllerSetMonthlyLimit();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [limitInput, setLimitInput] = useState('');
  const [editingLimit, setEditingLimit] = useState(false);

  // Savings goal state
  const [savingsGoal, setSavingsGoal] = useState<number | null>(null);
  const [savingsGoalInput, setSavingsGoalInput] = useState('');
  const [editingSavingsGoal, setEditingSavingsGoal] = useState(false);

  // Bank selection state
  const [selectedBankId, setSelectedBankIdState] = useState<string | null>(null);
  const [bankPickerVisible, setBankPickerVisible] = useState(false);
  const [bankSearch, setBankSearch] = useState('');

  // Load selected bank from AsyncStorage
  useEffect(() => {
    getSelectedBankId().then((id) => {
      if (id) setSelectedBankIdState(id);
    }).catch(() => {});
  }, []);

  const selectedBankObj = useMemo(() => selectedBankId ? getBankById(selectedBankId) : null, [selectedBankId]);

  const filteredBanks = useMemo(() => {
    if (!bankSearch?.trim()) return INDIAN_BANKS;
    const q = bankSearch.trim().toLowerCase();
    return INDIAN_BANKS.filter((b) => b.name.toLowerCase().includes(q));
  }, [bankSearch]);

  const handleSelectBank = useCallback((bank: IndianBank) => {
    setSelectedBankIdState(bank.id);
    setSelectedBankId(bank.id).catch(() => {});
    setBankPickerVisible(false);
    setBankSearch('');
  }, []);

  const handleClearBank = useCallback(() => {
    Alert.alert(
      'Clear Bank Selection',
      'This will track transactions from all banks. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setSelectedBankIdState(null);
            setSelectedBankId(null).catch(() => {});
          },
        },
      ],
    );
  }, []);

  // Load savings goal from AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem('savings_goal').then((val) => {
      if (val) {
        const num = parseFloat(val);
        if (!isNaN(num)) {
          setSavingsGoal(num);
          setSavingsGoalInput(val);
        }
      }
    }).catch(() => {});
  }, []);

  useFocusEffect(useCallback(() => { plan.refetch(); dashStats.refetch(); }, []));

  useEffect(() => {
    if (Platform.OS !== 'web') {
      const checkBiometric = async () => {
        try {
          const SecureStore = require('expo-secure-store');
          const token = await SecureStore.getItemAsync('biometric_token');
          setBiometricEnabled(!!token);
        } catch {}
      };
      checkBiometric();
    }
  }, []);

  const toggleBiometric = useCallback(async (value: boolean) => {
    if (Platform.OS === 'web') return;
    try {
      const SecureStore = require('expo-secure-store');
      const LocalAuth = require('expo-local-authentication');
      if (value) {
        const hasHardware = await LocalAuth.hasHardwareAsync();
        if (!hasHardware) {
          Alert.alert('Not Available', 'Biometric authentication is not supported on this device.');
          return;
        }
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          await SecureStore.setItemAsync('biometric_token', token);
          setBiometricEnabled(true);
        }
      } else {
        await SecureStore.deleteItemAsync('biometric_token');
        setBiometricEnabled(false);
      }
    } catch {}
  }, []);

  const handleExport = useCallback(async () => {
    if (plan?.data?.tier !== 'PRO') {
      router.push('/upgrade');
      return;
    }
    try {
      const baseUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ?? '';
      const token = await AsyncStorage.getItem('auth_token');
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const url = `${baseUrl}/api/export/csv?type=all`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        const blob = await res.blob();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'export.csv';
        a.click();
      } else {
        Alert.alert('Export', 'CSV export will be downloaded.');
      }
    } catch {
      Alert.alert('Error', 'Failed to export data.');
    }
  }, [plan?.data?.tier]);

  // Sync limit input when plan data loads
  useEffect(() => {
    if (plan?.data?.monthlyLimit != null) {
      setLimitInput(String(plan.data.monthlyLimit));
    } else {
      setLimitInput('');
    }
  }, [plan?.data?.monthlyLimit]);

  const handleSaveLimit = useCallback(() => {
    const value = limitInput?.trim();
    const numericLimit = value ? parseFloat(value) : null;
    if (value && (isNaN(numericLimit as number) || (numericLimit as number) < 0)) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive number.');
      return;
    }
    setLimitMutation.mutate(
      { data: { limit: numericLimit } },
      {
        onSuccess: () => {
          setEditingLimit(false);
          plan.refetch();
          Alert.alert(
            numericLimit != null ? 'Limit Set' : 'Limit Removed',
            numericLimit != null
              ? `Monthly expense limit set to ${formatINR(numericLimit)}. You'll be warned when expenses exceed this.`
              : 'Monthly expense limit has been removed.',
          );
        },
        onError: () => Alert.alert('Error', 'Failed to update monthly limit.'),
      },
    );
  }, [limitInput, setLimitMutation, plan]);

  const handleRemoveLimit = useCallback(() => {
    setLimitInput('');
    setLimitMutation.mutate(
      { data: { limit: null as unknown as number } },
      {
        onSuccess: () => {
          setEditingLimit(false);
          plan.refetch();
        },
        onError: () => Alert.alert('Error', 'Failed to remove monthly limit.'),
      },
    );
  }, [setLimitMutation, plan]);

  const handleSaveSavingsGoal = useCallback(() => {
    const val = savingsGoalInput?.trim();
    const num = val ? parseFloat(val) : null;
    if (val && (isNaN(num as number) || (num as number) <= 0)) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive number.');
      return;
    }
    if (num != null) {
      AsyncStorage.setItem('savings_goal', String(num)).catch(() => {});
      setSavingsGoal(num);
    } else {
      AsyncStorage.removeItem('savings_goal').catch(() => {});
      setSavingsGoal(null);
    }
    setEditingSavingsGoal(false);
  }, [savingsGoalInput]);

  const handleRemoveSavingsGoal = useCallback(() => {
    AsyncStorage.removeItem('savings_goal').catch(() => {});
    setSavingsGoal(null);
    setSavingsGoalInput('');
    setEditingSavingsGoal(false);
  }, []);

  const planData = plan?.data;
  const initials = (user?.name ?? '??').split(' ').map((n) => n?.[0] ?? '').join('').toUpperCase().slice(0, 2);

  // Savings calculations
  const monthlyIncome = dashStats?.data?.monthlyIncome ?? 0;
  const monthlySpend = dashStats?.data?.monthlySpend ?? 0;
  const actualSavings = monthlyIncome - monthlySpend;
  const savingsProgress = savingsGoal && savingsGoal > 0 ? Math.max(0, actualSavings / savingsGoal) : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: insets.top + spacing.md, paddingBottom: spacing.xxl }}>
      {/* User Card */}
      <Card style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.userName}>{user?.name ?? ''}</Text>
        <Text style={styles.userEmail}>{user?.email ?? ''}</Text>
      </Card>

      {/* Plan Section */}
      <Card style={styles.section}>
        <View style={styles.planRow}>
          <Text style={styles.sectionTitle}>Plan</Text>
          <View style={[styles.tierBadge, planData?.tier === 'PRO' && styles.proBadge]}>
            <Text style={styles.tierText}>{planData?.tier ?? 'FREE'}</Text>
          </View>
        </View>
        <View style={styles.usageRow}>
          <Text style={styles.usageLabel}>Subscriptions</Text>
          <Text style={styles.usageValue}>
            {planData?.subscriptionCount ?? 0}/{planData?.subscriptionLimit === -1 ? '∞' : planData?.subscriptionLimit ?? 5}
          </Text>
        </View>
        <View style={styles.usageRow}>
          <Text style={styles.usageLabel}>AI Queries (monthly)</Text>
          <Text style={styles.usageValue}>
            {planData?.aiQueriesUsed ?? 0}/{planData?.aiQueriesLimit === -1 ? '∞' : planData?.aiQueriesLimit ?? 10}
          </Text>
        </View>
        {planData?.tier !== 'PRO' && (
          <Pressable style={styles.upgradeButton} onPress={() => router.push('/upgrade')}>
            <Ionicons name="diamond-outline" size={18} color={colors.white} />
            <Text style={styles.upgradeText}>Upgrade to Pro</Text>
          </Pressable>
        )}
      </Card>

      {/* Settings */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>

        {Platform.OS !== 'web' && (
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="finger-print" size={22} color={colors.body} />
              <Text style={styles.settingLabel}>Biometric Login</Text>
            </View>
            <Switch value={biometricEnabled} onValueChange={toggleBiometric} trackColor={{ false: colors.surface, true: colors.primary }} />
          </View>
        )}

        <Pressable style={styles.settingRow} onPress={handleExport}>
          <View style={styles.settingLeft}>
            <Ionicons name="download-outline" size={22} color={colors.body} />
            <Text style={styles.settingLabel}>Export to CSV</Text>
          </View>
          {planData?.tier !== 'PRO' && (
            <View style={styles.proTag}>
              <Ionicons name="lock-closed" size={12} color={colors.warning} />
              <Text style={styles.proTagText}>Pro</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        </Pressable>
      </Card>

      {/* Bank Selection */}
      <Card style={styles.section}>
        <View style={styles.planRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Ionicons name="business" size={20} color={colors.accent} />
            <Text style={styles.sectionTitle}>Your Bank</Text>
          </View>
          {selectedBankObj && (
            <Pressable onPress={handleClearBank}>
              <Ionicons name="close-circle" size={20} color={colors.muted} />
            </Pressable>
          )}
        </View>

        {selectedBankObj ? (
          <Pressable style={styles.bankSelected} onPress={() => setBankPickerVisible(true)}>
            <View style={styles.bankSelectedInfo}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.bankSelectedName}>{selectedBankObj.name}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </Pressable>
        ) : (
          <View>
            <Text style={styles.limitDesc}>
              Select your bank to filter SMS transactions. Only debit and credit messages from the selected bank will be tracked.
            </Text>
            <Pressable style={styles.selectBankBtn} onPress={() => setBankPickerVisible(true)}>
              <Ionicons name="add-circle-outline" size={20} color={colors.white} />
              <Text style={styles.selectBankBtnText}>Select Bank</Text>
            </Pressable>
          </View>
        )}
      </Card>

      {/* Bank Picker Modal */}
      <Modal visible={bankPickerVisible} animationType="slide" transparent onRequestClose={() => setBankPickerVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: insets.bottom + spacing.md }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Your Bank</Text>
              <Pressable onPress={() => { setBankPickerVisible(false); setBankSearch(''); }}>
                <Ionicons name="close" size={24} color={colors.heading} />
              </Pressable>
            </View>

            <View style={styles.bankSearchRow}>
              <Ionicons name="search" size={18} color={colors.muted} />
              <TextInput
                style={styles.bankSearchInput}
                value={bankSearch}
                onChangeText={setBankSearch}
                placeholder="Search banks..."
                placeholderTextColor={colors.muted}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {bankSearch ? (
                <Pressable onPress={() => setBankSearch('')}>
                  <Ionicons name="close-circle" size={18} color={colors.muted} />
                </Pressable>
              ) : null}
            </View>

            <FlatList
              data={filteredBanks}
              keyExtractor={(item) => item.id}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = item.id === selectedBankId;
                return (
                  <Pressable
                    style={[styles.bankItem, isSelected && styles.bankItemSelected]}
                    onPress={() => handleSelectBank(item)}
                  >
                    <View style={styles.bankItemLeft}>
                      <Ionicons
                        name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                        size={20}
                        color={isSelected ? colors.accent : colors.muted}
                      />
                      <Text style={[styles.bankItemName, isSelected && styles.bankItemNameSelected]}>{item.name}</Text>
                    </View>
                    {isSelected && <Ionicons name="checkmark" size={18} color={colors.accent} />}
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <View style={{ paddingVertical: spacing.xl, alignItems: 'center' }}>
                  <Ionicons name="search-outline" size={36} color={colors.muted} />
                  <Text style={{ color: colors.muted, marginTop: spacing.sm, fontSize: 14 }}>No banks found</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>

      {/* Monthly Limit */}
      <Card style={styles.section}>
        <View style={styles.planRow}>
          <Text style={styles.sectionTitle}>Monthly Limit</Text>
          {planData?.monthlyLimit != null && !editingLimit && (
            <Pressable onPress={() => setEditingLimit(true)}>
              <Ionicons name="pencil" size={18} color={colors.accent} />
            </Pressable>
          )}
        </View>

        {planData?.monthlyLimit != null && !editingLimit ? (
          <View>
            <View style={styles.usageRow}>
              <Text style={styles.usageLabel}>Limit</Text>
              <Text style={styles.usageValue}>{formatINR(planData.monthlyLimit)}</Text>
            </View>
            <View style={styles.usageRow}>
              <Text style={styles.usageLabel}>Spent this month</Text>
              <Text style={[styles.usageValue, planData?.limitExceeded && { color: colors.error }]}>
                {formatINR(planData?.monthlySpent ?? 0)}
              </Text>
            </View>
            {/* Progress bar */}
            <View style={styles.limitBarBg}>
              <View
                style={[
                  styles.limitBarFill,
                  {
                    width: `${Math.min(((planData?.monthlySpent ?? 0) / Number(planData.monthlyLimit)) * 100, 100)}%`,
                    backgroundColor: planData?.limitExceeded ? colors.error : (planData?.monthlySpent ?? 0) / Number(planData.monthlyLimit) > 0.8 ? colors.warning : colors.success,
                  },
                ]}
              />
            </View>
            {planData?.limitExceeded && (
              <View style={styles.limitWarning}>
                <Ionicons name="warning" size={16} color={colors.error} />
                <Text style={styles.limitWarningText}>
                  You've exceeded your monthly limit by {formatINR(Number(planData?.monthlySpent ?? 0) - Number(planData.monthlyLimit))}!
                </Text>
              </View>
            )}
            <Pressable style={styles.removeLimitBtn} onPress={handleRemoveLimit}>
              <Text style={styles.removeLimitText}>Remove Limit</Text>
            </Pressable>
          </View>
        ) : (
          <View>
            {!editingLimit && (
              <Text style={styles.limitDesc}>
                Set a monthly spending limit to get warned when your expenses exceed it.
              </Text>
            )}
            <View style={styles.limitInputRow}>
              <Text style={styles.currencySign}>₹</Text>
              <TextInput
                style={styles.limitInput}
                value={limitInput}
                onChangeText={setLimitInput}
                placeholder="e.g. 5000"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={handleSaveLimit}
              />
              <Pressable style={styles.limitSaveBtn} onPress={handleSaveLimit}>
                <Text style={styles.limitSaveBtnText}>
                  {setLimitMutation?.isPending ? 'Saving...' : 'Set Limit'}
                </Text>
              </Pressable>
            </View>
            {editingLimit && (
              <Pressable onPress={() => setEditingLimit(false)} style={{ marginTop: spacing.sm }}>
                <Text style={{ color: colors.muted, fontSize: 13, textAlign: 'center' }}>Cancel</Text>
              </Pressable>
            )}
          </View>
        )}
      </Card>

      {/* Savings Goal Tracker */}
      <Card style={styles.section}>
        <View style={styles.planRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Ionicons name="trending-up" size={20} color={colors.success} />
            <Text style={styles.sectionTitle}>Savings Goal</Text>
          </View>
          {savingsGoal != null && !editingSavingsGoal && (
            <Pressable onPress={() => { setSavingsGoalInput(String(savingsGoal)); setEditingSavingsGoal(true); }}>
              <Ionicons name="pencil" size={18} color={colors.accent} />
            </Pressable>
          )}
        </View>

        {savingsGoal != null && !editingSavingsGoal ? (
          <View>
            <View style={styles.usageRow}>
              <Text style={styles.usageLabel}>Monthly Target</Text>
              <Text style={styles.usageValue}>{formatINR(savingsGoal)}</Text>
            </View>
            <View style={styles.usageRow}>
              <Text style={styles.usageLabel}>Income this month</Text>
              <Text style={[styles.usageValue, { color: colors.success }]}>{formatINR(monthlyIncome)}</Text>
            </View>
            <View style={styles.usageRow}>
              <Text style={styles.usageLabel}>Spent this month</Text>
              <Text style={[styles.usageValue, { color: colors.error }]}>{formatINR(monthlySpend)}</Text>
            </View>
            <View style={styles.usageRow}>
              <Text style={styles.usageLabel}>Actual Savings</Text>
              <Text style={[styles.usageValue, { color: actualSavings >= 0 ? colors.success : colors.error }]}>
                {actualSavings >= 0 ? '+' : ''}{formatINR(Math.abs(actualSavings))}
              </Text>
            </View>

            {/* Progress bar */}
            <View style={styles.savingsBarBg}>
              <View
                style={[
                  styles.savingsBarFill,
                  {
                    width: `${Math.min(savingsProgress * 100, 100)}%`,
                    backgroundColor: savingsProgress >= 1 ? colors.success : savingsProgress >= 0.5 ? colors.warning : colors.error,
                  },
                ]}
              />
            </View>
            <Text style={styles.savingsPercent}>
              {(savingsProgress * 100).toFixed(0)}% of goal reached
            </Text>

            {savingsProgress >= 1 && (
              <View style={styles.savingsSuccess}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.savingsSuccessText}>
                  You've reached your savings goal! 🎉
                </Text>
              </View>
            )}
            {savingsProgress < 1 && actualSavings >= 0 && (
              <View style={styles.savingsInfo}>
                <Ionicons name="information-circle" size={16} color={colors.primary} />
                <Text style={styles.savingsInfoText}>
                  {formatINR(savingsGoal - actualSavings)} more to reach your goal
                </Text>
              </View>
            )}
            {actualSavings < 0 && (
              <View style={styles.savingsWarn}>
                <Ionicons name="warning" size={16} color={colors.error} />
                <Text style={styles.savingsWarnText}>
                  You're spending more than you earn this month
                </Text>
              </View>
            )}

            <Pressable style={styles.removeLimitBtn} onPress={handleRemoveSavingsGoal}>
              <Text style={styles.removeLimitText}>Remove Goal</Text>
            </Pressable>
          </View>
        ) : (
          <View>
            {!editingSavingsGoal && (
              <Text style={styles.limitDesc}>
                Set a monthly savings target. The app will track your progress based on income minus expenses.
              </Text>
            )}
            <View style={styles.limitInputRow}>
              <Text style={styles.currencySign}>₹</Text>
              <TextInput
                style={styles.limitInput}
                value={savingsGoalInput}
                onChangeText={setSavingsGoalInput}
                placeholder="e.g. 10000"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={handleSaveSavingsGoal}
              />
              <Pressable style={[styles.limitSaveBtn, { backgroundColor: colors.success }]} onPress={handleSaveSavingsGoal}>
                <Text style={styles.limitSaveBtnText}>
                  Set Goal
                </Text>
              </Pressable>
            </View>
            {editingSavingsGoal && (
              <Pressable onPress={() => setEditingSavingsGoal(false)} style={{ marginTop: spacing.sm }}>
                <Text style={{ color: colors.muted, fontSize: 13, textAlign: 'center' }}>Cancel</Text>
              </Pressable>
            )}
          </View>
        )}
      </Card>

      {/* Logout */}
      <Pressable style={styles.logoutButton} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color={colors.error} />
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base, paddingHorizontal: spacing.lg },
  userCard: { alignItems: 'center', paddingVertical: spacing.lg, marginBottom: spacing.md },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  avatarText: { color: colors.white, fontSize: 24, fontWeight: '700' },
  userName: { color: colors.heading, fontSize: 20, fontWeight: '600' },
  userEmail: { color: colors.muted, fontSize: 14, marginTop: 2 },
  section: { marginBottom: spacing.md },
  sectionTitle: { color: colors.heading, fontSize: 18, fontWeight: '600', marginBottom: spacing.md },
  planRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  tierBadge: { backgroundColor: colors.surface, paddingHorizontal: 12, paddingVertical: 4, borderRadius: borderRadius.full },
  proBadge: { backgroundColor: colors.primary },
  tierText: { color: colors.heading, fontSize: 13, fontWeight: '600' },
  usageRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  usageLabel: { color: colors.body, fontSize: 14 },
  usageValue: { color: colors.heading, fontSize: 14, fontWeight: '600' },
  upgradeButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, paddingVertical: 12, borderRadius: borderRadius.md, marginTop: spacing.md, gap: spacing.sm },
  upgradeText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.cardBorder },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  settingLabel: { color: colors.body, fontSize: 16 },
  proTag: { flexDirection: 'row', alignItems: 'center', gap: 4, marginRight: spacing.sm },
  proTagText: { color: colors.warning, fontSize: 12, fontWeight: '600' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderWidth: 1, borderColor: colors.error + '40', borderRadius: borderRadius.md, gap: spacing.sm, marginTop: spacing.md },
  logoutText: { color: colors.error, fontSize: 16, fontWeight: '500' },
  version: { color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: spacing.lg },
  limitDesc: { color: colors.muted, fontSize: 13, lineHeight: 20, marginBottom: spacing.md },
  limitInputRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  currencySign: { color: colors.heading, fontSize: 20, fontWeight: '600' },
  limitInput: {
    flex: 1,
    backgroundColor: colors.inputBg,
    color: colors.heading,
    fontSize: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  limitSaveBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderRadius: borderRadius.sm,
  },
  limitSaveBtnText: { color: colors.white, fontSize: 14, fontWeight: '600' },
  limitBarBg: {
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: 3,
    marginTop: spacing.sm,
    overflow: 'hidden' as const,
  },
  limitBarFill: { height: 6, borderRadius: 3 },
  limitWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
    backgroundColor: 'rgba(239,68,68,0.08)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  limitWarningText: { color: colors.error, fontSize: 13, flex: 1 },
  removeLimitBtn: { marginTop: spacing.sm, alignSelf: 'center' as const, paddingVertical: 6 },
  removeLimitText: { color: colors.muted, fontSize: 13, textDecorationLine: 'underline' as const },
  savingsBarBg: {
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: 4,
    marginTop: spacing.md,
    overflow: 'hidden' as const,
  },
  savingsBarFill: { height: 8, borderRadius: 4 },
  savingsPercent: { color: colors.muted, fontSize: 12, textAlign: 'center' as const, marginTop: spacing.xs },
  savingsSuccess: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.xs,
    marginTop: spacing.sm,
    backgroundColor: 'rgba(22,163,74,0.08)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  savingsSuccessText: { color: colors.success, fontSize: 13, flex: 1 },
  savingsInfo: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.xs,
    marginTop: spacing.sm,
    backgroundColor: 'rgba(124,58,237,0.08)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  savingsInfoText: { color: colors.primary, fontSize: 13, flex: 1 },
  savingsWarn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.xs,
    marginTop: spacing.sm,
    backgroundColor: 'rgba(239,68,68,0.08)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  savingsWarnText: { color: colors.error, fontSize: 13, flex: 1 },
  // Bank selection styles
  bankSelected: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  bankSelectedInfo: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.sm,
    flex: 1,
  },
  bankSelectedName: {
    color: colors.heading,
    fontSize: 15,
    fontWeight: '600' as const,
    flex: 1,
  },
  selectBankBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: colors.accent,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  selectBankBtnText: { color: colors.white, fontSize: 15, fontWeight: '600' as const },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end' as const,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.lg,
    maxHeight: '80%' as unknown as number,
  },
  modalHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginBottom: spacing.md,
  },
  modalTitle: { color: colors.heading, fontSize: 20, fontWeight: '700' as const },
  bankSearchRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: colors.inputBg,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    marginBottom: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  bankSearchInput: {
    flex: 1,
    color: colors.heading,
    fontSize: 15,
    paddingVertical: 4,
  },
  bankItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 12,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  bankItemSelected: {
    backgroundColor: 'rgba(124,58,237,0.06)',
    borderRadius: borderRadius.sm,
  },
  bankItemLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.sm,
    flex: 1,
  },
  bankItemName: { color: colors.body, fontSize: 15 },
  bankItemNameSelected: { color: colors.accent, fontWeight: '600' as const },
});
