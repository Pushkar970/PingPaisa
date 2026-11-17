import { Platform, NativeModules, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSelectedBankId, getBankById, isSenderFromBank, INDIAN_BANKS, type IndianBank } from './indianBanks';

const SmsAndroid = Platform.OS === 'android' ? NativeModules?.SmsAndroid : null;

const PROCESSED_SMS_KEY = 'sms_auto_tracker_processed';

export interface RawSms {
  _id: string;
  address: string;
  body: string;
  date: number;
  date_sent: number;
  type: number;
}

export interface FilteredSms {
  id: string;
  address: string;
  body: string;
  date: number;
  hash: string;
}

/** Check if SMS reading is available (Android only, native module present) */
export function isSmsAvailable(): boolean {
  return Platform.OS === 'android' && !!SmsAndroid;
}

/** Request SMS permissions on Android */
export async function requestSmsPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  try {
    const grants = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
    ]);
    return (
      grants[PermissionsAndroid.PERMISSIONS.READ_SMS] === PermissionsAndroid.RESULTS.GRANTED &&
      grants[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] === PermissionsAndroid.RESULTS.GRANTED
    );
  } catch {
    return false;
  }
}

/** Check if SMS permissions are granted */
export async function hasSmsPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  try {
    const read = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);
    return read;
  } catch {
    return false;
  }
}

/** Simple hash of SMS body + date for deduplication */
function hashSms(body: string, date: number): string {
  let h = 0;
  const str = `${body}|${date}`;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h = ((h << 5) - h + c) | 0;
  }
  return h.toString(36);
}

// ─── Indian Bank / UPI SMS Detection ───────────────────────────────────

const DEBIT_REGEX = /(?:debited|deducted|spent|charged|paid|withdrawn|purchase|payment|transferred|txn\s*amt|transaction|\bdr\b|debit)/i;

const AMOUNT_REGEX = /(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{1,2})?)/i;

const CREDIT_REGEX = /(?:credited|received|refund|cashback|reversed|cr\b)/i;

const OTP_REGEX = /(?:otp|one.?time.?password|verification.?code|cvv|pin|passcode)/i;

// Common Indian bank short-code senders: AD-HDFCBK, VM-SBIINB, JD-ICICIB etc.
const BANK_SENDER_REGEX = /^[A-Z]{2}-[A-Z]{3,}/i;

// UPI / NEFT / IMPS / RTGS keywords
const PAYMENT_MODE_REGEX = /\b(?:UPI|NEFT|IMPS|RTGS|POS|ATM|EMI|SI|Auto.?Debit)\b/i;

/** Check if an SMS is a bank debit transaction */
export function isTransactionSms(body: string, address: string): boolean {
  if (!body || body.length < 20) return false;

  // Must NOT be OTP / credit
  if (OTP_REGEX.test(body)) return false;
  if (CREDIT_REGEX.test(body) && !DEBIT_REGEX.test(body)) return false;

  // Must have an amount
  if (!AMOUNT_REGEX.test(body)) return false;

  // Must have a debit keyword OR come from a bank sender with a payment mode
  const isDebit = DEBIT_REGEX.test(body);
  const isBankSender = BANK_SENDER_REGEX.test(address);
  const hasPaymentMode = PAYMENT_MODE_REGEX.test(body);

  return isDebit || (isBankSender && hasPaymentMode);
}

/** Check if an SMS is a bank credit/income transaction */
export function isCreditSms(body: string, address: string): boolean {
  if (!body || body.length < 20) return false;

  // Must NOT be OTP
  if (OTP_REGEX.test(body)) return false;

  // Must have an amount
  if (!AMOUNT_REGEX.test(body)) return false;

  // Must have a credit keyword
  const isCredit = CREDIT_REGEX.test(body);
  const isBankSender = BANK_SENDER_REGEX.test(address);

  // Must be credit and NOT also a debit (some SMS mention both)
  return isCredit && !DEBIT_REGEX.test(body) && (isBankSender || isCredit);
}

/** Read SMS inbox from the last N days, filtered to bank transactions */
export async function readTransactionSms(days: number = 30): Promise<FilteredSms[]> {
  if (!isSmsAvailable()) return [];

  // Load selected bank for filtering
  const bankId = await getSelectedBankId();
  const selectedBank = bankId ? getBankById(bankId) : null;

  const minDate = Date.now() - days * 24 * 60 * 60 * 1000;

  return new Promise((resolve) => {
    try {
      SmsAndroid.list(
        JSON.stringify({ box: 'inbox', minDate }),
        () => resolve([]),
        (_count: number, smsList: string) => {
          try {
            const messages: RawSms[] = JSON.parse(smsList) ?? [];
            const filtered = messages
              .filter((m) => {
                const body = m?.body ?? '';
                const address = m?.address ?? '';
                if (!isTransactionSms(body, address)) return false;
                // If a bank is selected, only include SMS from that bank
                if (selectedBank && !isSenderFromBank(address, selectedBank)) return false;
                return true;
              })
              .map((m) => ({
                id: String(m._id ?? m.date),
                address: m.address ?? '',
                body: m.body ?? '',
                date: m.date ?? Date.now(),
                hash: hashSms(m.body ?? '', m.date ?? 0),
              }));
            resolve(filtered);
          } catch {
            resolve([]);
          }
        },
      );
    } catch {
      resolve([]);
    }
  });
}

/** Read SMS inbox from the last N days, filtered to credit/income transactions */
export async function readCreditSms(days: number = 30): Promise<FilteredSms[]> {
  if (!isSmsAvailable()) return [];

  // Load selected bank for filtering
  const bankId = await getSelectedBankId();
  const selectedBank = bankId ? getBankById(bankId) : null;

  const minDate = Date.now() - days * 24 * 60 * 60 * 1000;

  return new Promise((resolve) => {
    try {
      SmsAndroid.list(
        JSON.stringify({ box: 'inbox', minDate }),
        () => resolve([]),
        (_count: number, smsList: string) => {
          try {
            const messages: RawSms[] = JSON.parse(smsList) ?? [];
            const filtered = messages
              .filter((m) => {
                const body = m?.body ?? '';
                const address = m?.address ?? '';
                if (!isCreditSms(body, address)) return false;
                // If a bank is selected, only include SMS from that bank
                if (selectedBank && !isSenderFromBank(address, selectedBank)) return false;
                return true;
              })
              .map((m) => ({
                id: String(m._id ?? m.date),
                address: m.address ?? '',
                body: m.body ?? '',
                date: m.date ?? Date.now(),
                hash: hashSms(m.body ?? '', m.date ?? 0),
              }));
            resolve(filtered);
          } catch {
            resolve([]);
          }
        },
      );
    } catch {
      resolve([]);
    }
  });
}

const PROCESSED_CREDIT_SMS_KEY = 'sms_auto_tracker_credit_processed';

/** Get set of already-processed credit SMS hashes */
export async function getProcessedCreditHashes(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(PROCESSED_CREDIT_SMS_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

/** Mark credit SMS hashes as processed */
export async function markCreditAsProcessed(hashes: string[]): Promise<void> {
  try {
    const existing = await getProcessedCreditHashes();
    hashes.forEach((h) => existing.add(h));
    const arr = Array.from(existing).slice(-2000);
    await AsyncStorage.setItem(PROCESSED_CREDIT_SMS_KEY, JSON.stringify(arr));
  } catch {
    // ignore
  }
}

/** Read new (unprocessed) credit transaction SMS */
export async function readNewCreditSms(days: number = 30): Promise<FilteredSms[]> {
  const allSms = await readCreditSms(days);
  const processed = await getProcessedCreditHashes();
  return allSms.filter((sms) => !processed.has(sms.hash));
}

/** Get set of already-processed SMS hashes */
export async function getProcessedHashes(): Promise<Set<string>> {
  try {
    const raw = await AsyncStorage.getItem(PROCESSED_SMS_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

/** Mark SMS hashes as processed */
export async function markAsProcessed(hashes: string[]): Promise<void> {
  try {
    const existing = await getProcessedHashes();
    hashes.forEach((h) => existing.add(h));
    // Keep only last 2000 hashes to prevent unbounded growth
    const arr = Array.from(existing).slice(-2000);
    await AsyncStorage.setItem(PROCESSED_SMS_KEY, JSON.stringify(arr));
  } catch {
    // ignore
  }
}

/** Read new (unprocessed) transaction SMS */
export async function readNewTransactionSms(days: number = 30): Promise<FilteredSms[]> {
  const allSms = await readTransactionSms(days);
  const processed = await getProcessedHashes();
  return allSms.filter((sms) => !processed.has(sms.hash));
}

export interface DetectedBank {
  bank: IndianBank;
  count: number;
}

/**
 * Scan the SMS inbox and detect which Indian bank sender codes are present.
 * Returns banks sorted by message count (most frequent first).
 * Only considers SMS that look like bank/UPI messages (matching BANK_SENDER_REGEX).
 */
export async function detectBankFromInbox(days: number = 90): Promise<DetectedBank[]> {
  if (!isSmsAvailable()) return [];

  const minDate = Date.now() - days * 24 * 60 * 60 * 1000;

  return new Promise((resolve) => {
    try {
      SmsAndroid.list(
        JSON.stringify({ box: 'inbox', minDate }),
        () => resolve([]),
        (_count: number, smsList: string) => {
          try {
            const messages: RawSms[] = JSON.parse(smsList) ?? [];
            const bankCounts = new Map<string, number>();

            for (const msg of messages) {
              const address = msg?.address ?? '';
              if (!BANK_SENDER_REGEX.test(address)) continue;
              // Also require an amount — skip OTPs and promos
              const body = msg?.body ?? '';
              if (!AMOUNT_REGEX.test(body)) continue;
              if (OTP_REGEX.test(body)) continue;

              for (const bank of INDIAN_BANKS) {
                if (isSenderFromBank(address, bank)) {
                  bankCounts.set(bank.id, (bankCounts.get(bank.id) ?? 0) + 1);
                  break; // one SMS → one bank
                }
              }
            }

            const detected: DetectedBank[] = [];
            for (const [bankId, count] of bankCounts) {
              const bank = getBankById(bankId);
              if (bank) detected.push({ bank, count });
            }
            detected.sort((a, b) => b.count - a.count);
            resolve(detected);
          } catch {
            resolve([]);
          }
        },
      );
    } catch {
      resolve([]);
    }
  });
}
