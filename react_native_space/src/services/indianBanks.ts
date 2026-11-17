import AsyncStorage from '@react-native-async-storage/async-storage';

export interface IndianBank {
  id: string;
  name: string;
  /** SMS sender code patterns — the part after the 2-letter prefix (e.g. AD-HDFCBK → HDFCBK) */
  senderCodes: string[];
}

/** Comprehensive list of Indian banks with their SMS sender short codes */
export const INDIAN_BANKS: IndianBank[] = [
  { id: 'sbi', name: 'State Bank of India (SBI)', senderCodes: ['SBIINB', 'SBIPSG', 'SBISMS', 'SBIBNK', 'SBICRD', 'SBIUPI'] },
  { id: 'hdfc', name: 'HDFC Bank', senderCodes: ['HDFCBK', 'HDFCBN', 'HDFCRD', 'HDFCCC'] },
  { id: 'icici', name: 'ICICI Bank', senderCodes: ['ICICIB', 'ICICIN', 'ICIBNK', 'ICICRD'] },
  { id: 'axis', name: 'Axis Bank', senderCodes: ['AXISBK', 'AXISBN', 'UTIBAK'] },
  { id: 'kotak', name: 'Kotak Mahindra Bank', senderCodes: ['KOTAKB', 'KMBANK', 'KOTBNK', 'KOTKBK'] },
  { id: 'pnb', name: 'Punjab National Bank (PNB)', senderCodes: ['PNBSMS', 'PUNBNK', 'PNBANK'] },
  { id: 'bob', name: 'Bank of Baroda', senderCodes: ['BOBRDA', 'BOBSMS', 'BARODA'] },
  { id: 'canara', name: 'Canara Bank', senderCodes: ['CANBKK', 'CANBNK', 'CANARA'] },
  { id: 'union', name: 'Union Bank of India', senderCodes: ['UBIOBC', 'UNIBOI', 'UNBINB'] },
  { id: 'boi', name: 'Bank of India', senderCodes: ['BKIDNB', 'BOIBNK', 'BOIIND'] },
  { id: 'iob', name: 'Indian Overseas Bank', senderCodes: ['IOBSMS', 'IOBBNK'] },
  { id: 'cbi', name: 'Central Bank of India', senderCodes: ['CBISMS', 'CBIBNK'] },
  { id: 'indian', name: 'Indian Bank', senderCodes: ['INDBNK', 'IDNBNK'] },
  { id: 'uco', name: 'UCO Bank', senderCodes: ['UCOBKK', 'UCOBNK'] },
  { id: 'psb', name: 'Punjab & Sind Bank', senderCodes: ['PSBINB', 'PNSINB'] },
  { id: 'idbi', name: 'IDBI Bank', senderCodes: ['IDBIBK', 'IDBINB'] },
  { id: 'yes', name: 'Yes Bank', senderCodes: ['YESBKK', 'YESBNK'] },
  { id: 'indusind', name: 'IndusInd Bank', senderCodes: ['IDFCFB', 'INDUSB', 'INDBNK'] },
  { id: 'federal', name: 'Federal Bank', senderCodes: ['FEDBNK', 'FEDBKK'] },
  { id: 'rbl', name: 'RBL Bank', senderCodes: ['RBLBNK', 'RATBKK'] },
  { id: 'bandhan', name: 'Bandhan Bank', senderCodes: ['BDNBNK', 'BANDHN'] },
  { id: 'idfc', name: 'IDFC First Bank', senderCodes: ['IDFCFB', 'IDFCBK'] },
  { id: 'sc', name: 'Standard Chartered Bank', senderCodes: ['SCBANK', 'SCBINB'] },
  { id: 'citi', name: 'Citibank', senderCodes: ['CITIBK', 'CITBNK'] },
  { id: 'hsbc', name: 'HSBC India', senderCodes: ['HSBCBK', 'HSBCIN'] },
  { id: 'dbs', name: 'DBS Bank India', senderCodes: ['DBSBNK', 'DBSINB'] },
  { id: 'deutsche', name: 'Deutsche Bank', senderCodes: ['DEUTBK', 'DEUTSC'] },
  { id: 'barclays', name: 'Barclays Bank', senderCodes: ['BARCLY', 'BRCLAY'] },
  { id: 'au', name: 'AU Small Finance Bank', senderCodes: ['AUSFBL', 'AUBANK'] },
  { id: 'equitas', name: 'Equitas Small Finance Bank', senderCodes: ['EQTSFB', 'EQTBNK'] },
  { id: 'ujjivan', name: 'Ujjivan Small Finance Bank', senderCodes: ['UJJIVN', 'UJJBNK'] },
  { id: 'jk', name: 'Jammu & Kashmir Bank', senderCodes: ['JKBANK', 'JKBBNK'] },
  { id: 'south', name: 'South Indian Bank', senderCodes: ['SIBANK', 'SIBBNK'] },
  { id: 'karnataka', name: 'Karnataka Bank', senderCodes: ['KARBKK', 'KARBNK'] },
  { id: 'kvb', name: 'Karur Vysya Bank', senderCodes: ['KVBANK', 'KVBBNK'] },
  { id: 'tmb', name: 'Tamilnad Mercantile Bank', senderCodes: ['TMBBNK', 'TNMBNK'] },
  { id: 'csb', name: 'CSB Bank (Catholic Syrian)', senderCodes: ['CSBBNK', 'CSBINB'] },
  { id: 'dcb', name: 'DCB Bank', senderCodes: ['DCBBNK', 'DCBINB'] },
  { id: 'nainital', name: 'Nainital Bank', senderCodes: ['NTLBNK'] },
  { id: 'paytm', name: 'Paytm Payments Bank', senderCodes: ['PYTMPB', 'PAYTMB', 'PAYTM'] },
  { id: 'airtel', name: 'Airtel Payments Bank', senderCodes: ['ARTLPB', 'AIRTEL'] },
  { id: 'fino', name: 'Fino Payments Bank', senderCodes: ['FINOPB', 'FINOBN'] },
  { id: 'jio', name: 'Jio Payments Bank', senderCodes: ['JIOPAY', 'JIOBNK'] },
  { id: 'post', name: 'India Post Payments Bank', senderCodes: ['IPPBNK', 'IPPBSM'] },
];

const SELECTED_BANK_KEY = 'selected_bank_id';

/** Get the currently selected bank id, or null */
export async function getSelectedBankId(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(SELECTED_BANK_KEY);
  } catch {
    return null;
  }
}

/** Save the selected bank id */
export async function setSelectedBankId(bankId: string | null): Promise<void> {
  try {
    if (bankId) {
      await AsyncStorage.setItem(SELECTED_BANK_KEY, bankId);
    } else {
      await AsyncStorage.removeItem(SELECTED_BANK_KEY);
    }
  } catch {}
}

/** Get the bank object for a given id */
export function getBankById(id: string): IndianBank | undefined {
  return INDIAN_BANKS.find((b) => b.id === id);
}

/** Check if an SMS sender address matches a specific bank's sender codes */
export function isSenderFromBank(address: string, bank: IndianBank): boolean {
  if (!address) return false;
  const upper = address.toUpperCase();
  return bank.senderCodes.some((code) => upper.includes(code));
}
