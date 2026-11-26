import React, { useEffect, useState, useCallback } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/src/theme';
import { hasSmsPermission, requestSmsPermission } from '@/src/services/smsReader';

export const SMS_CONSENT_STORAGE_KEY = 'sms_upi_consent_status';

/**
 * Prominent disclosure modal shown once after login on Android,
 * requesting explicit user consent before reading bank/UPI SMS messages.
 */
export default function SmsConsentModal() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    let mounted = true;
    const checkConsent = async () => {
      try {
        const stored = await AsyncStorage.getItem(SMS_CONSENT_STORAGE_KEY);
        if (stored) return;
        const alreadyGranted = await hasSmsPermission();
        if (alreadyGranted) {
          await AsyncStorage.setItem(SMS_CONSENT_STORAGE_KEY, 'granted');
          return;
        }
        if (mounted) setVisible(true);
      } catch {
        // Ignore storage errors
      }
    };
    checkConsent();

    return () => {
      mounted = false;
    };
  }, []);

  const handleAllow = useCallback(async () => {
    setVisible(false);
    try {
      const granted = await requestSmsPermission();
      await AsyncStorage.setItem(SMS_CONSENT_STORAGE_KEY, granted ? 'granted' : 'declined');
    } catch {
      await AsyncStorage.setItem(SMS_CONSENT_STORAGE_KEY, 'declined').catch(() => {});
    }
  }, []);

  const handleDecline = useCallback(async () => {
    setVisible(false);
    await AsyncStorage.setItem(SMS_CONSENT_STORAGE_KEY, 'declined').catch(() => {});
  }, []);

  if (Platform.OS !== 'android' || !visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleDecline}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="shield-checkmark" size={32} color={colors.primary} />
          </View>

          <Text style={styles.title}>SMS Access for UPI Tracking</Text>
          <Text style={styles.body}>
            PingPaisa can scan your SMS inbox for bank and UPI transaction alerts to automatically log your expenses and income.
          </Text>

          <View style={styles.bulletList}>
            <View style={styles.bulletRow}>
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <Text style={styles.bulletText}>Only bank &amp; UPI debit/credit alerts are parsed</Text>
            </View>
            <View style={styles.bulletRow}>
              <Ionicons name="lock-closed" size={18} color={colors.primary} />
              <Text style={styles.bulletText}>OTPs, PINs, CVVs, and personal chats are ignored on your device</Text>
            </View>
            <View style={styles.bulletRow}>
              <Ionicons name="options" size={18} color={colors.muted} />
              <Text style={styles.bulletText}>You can still add or paste transactions manually anytime</Text>
            </View>
          </View>

          <Pressable style={styles.allowBtn} onPress={handleAllow}>
            <Text style={styles.allowText}>Allow SMS &amp; UPI Scan</Text>
          </Pressable>

          <Pressable style={styles.declineBtn} onPress={handleDecline}>
            <Text style={styles.declineText}>Not Now</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    backgroundColor: colors.base,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.heading,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.body,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  bulletList: {
    width: '100%',
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.body,
  },
  allowBtn: {
    width: '100%',
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  allowText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  declineBtn: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  declineText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '500',
  },
});
