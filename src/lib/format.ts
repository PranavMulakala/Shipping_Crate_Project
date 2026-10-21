/** Money as USD with 2 decimals. Returns "—" for non-finite input. */
export function usd(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Percent with 1 decimal. Returns "—" for non-finite input. */
export function fmtPct(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return `${n.toFixed(1)}%`;
}

/** Whole-number with thousands separators, e.g. 42000 -> "42,000". */
export function fmtInt(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}
