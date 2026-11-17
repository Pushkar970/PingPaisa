/**
 * Indian currency formatting utilities.
 * Formats numbers using the Indian numbering system: ₹1,25,000.00
 */

/**
 * Format a number into the Indian comma-separated style.
 * e.g. 125000 → "1,25,000"   |   1234567.89 → "12,34,567.89"
 */
export function formatIndianNumber(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  if (isNaN(num)) return '';

  const [intPart, decPart] = num.toString().split('.');
  const isNegative = intPart?.startsWith('-');
  const absInt = isNegative ? intPart?.slice(1) ?? '' : intPart ?? '';

  if (absInt.length <= 3) {
    const formatted = absInt + (decPart != null ? `.${decPart}` : '');
    return isNegative ? `-${formatted}` : formatted;
  }

  // Last 3 digits, then groups of 2
  const last3 = absInt.slice(-3);
  const remaining = absInt.slice(0, -3);
  const groups: string[] = [];
  let i = remaining.length;
  while (i > 0) {
    const start = Math.max(0, i - 2);
    groups.unshift(remaining.slice(start, i));
    i = start;
  }
  const formatted = groups.join(',') + ',' + last3 + (decPart != null ? `.${decPart}` : '');
  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Format a number as Indian Rupees: ₹1,25,000.00
 */
export function formatINR(value: number | string, decimals: number = 2): string {
  const num = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  if (isNaN(num)) return '₹0.00';
  return `₹${formatIndianNumber(num.toFixed(decimals))}`;
}

/**
 * Format an amount input field value as-you-type with Indian commas.
 * Strips non-numeric chars (except . and leading -), formats the integer part.
 * Returns the formatted display string.
 */
export function formatAmountInput(raw: string): string {
  // Strip everything except digits, dot and leading minus
  let cleaned = raw.replace(/[^\d.\-]/g, '');
  // Only one leading minus
  if (cleaned.indexOf('-') > 0) cleaned = cleaned.replace(/-/g, '');
  // Only one decimal point
  const parts = cleaned.split('.');
  if ((parts?.length ?? 0) > 2) {
    cleaned = (parts?.[0] ?? '') + '.' + (parts?.slice(1)?.join('') ?? '');
  }

  const [intPart, decPart] = cleaned.split('.');
  if (!intPart && !decPart) return '';

  const isNegative = intPart?.startsWith('-');
  const absInt = (isNegative ? intPart?.slice(1) : intPart) ?? '';

  // Remove leading zeros (but keep a single "0" for values like "0.5")
  const trimmed = absInt.replace(/^0+/, '') || (decPart != null ? '0' : '');

  if (!trimmed && decPart == null) return '';

  // Format integer part with Indian commas
  let formatted = '';
  if (trimmed.length <= 3) {
    formatted = trimmed;
  } else {
    const last3 = trimmed.slice(-3);
    const remaining = trimmed.slice(0, -3);
    const groups: string[] = [];
    let i = remaining.length;
    while (i > 0) {
      const start = Math.max(0, i - 2);
      groups.unshift(remaining.slice(start, i));
      i = start;
    }
    formatted = groups.join(',') + ',' + last3;
  }

  if (decPart != null) {
    // Allow max 2 decimal digits
    formatted += '.' + decPart.slice(0, 2);
  }

  return (isNegative ? '-' : '') + formatted;
}

/**
 * Parse a formatted Indian amount string back to a plain number.
 * e.g. "1,25,000.50" → 125000.5
 */
export function parseAmountInput(formatted: string): number {
  const cleaned = (formatted ?? '').replace(/,/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}
