import type { MarginType } from '../types';

export interface Economics {
  customerRate: number;
  marginDollars: number;
  marginPctOfRate: number;
  customerPerMile: number;
  carrierPerMile: number;
}

/**
 * Live quote math for a load. Mirrors the spec exactly and guards
 * divide-by-zero (callers show "—" when miles or customerRate is 0).
 */
export function computeEconomics(
  carrierCost: number,
  marginType: MarginType,
  marginValue: number,
  miles: number,
): Economics {
  const cc = Number.isFinite(carrierCost) ? carrierCost : 0;
  const mv = Number.isFinite(marginValue) ? marginValue : 0;
  const mi = Number.isFinite(miles) ? miles : 0;

  const customerRate = marginType === 'flat' ? cc + mv : cc * (1 + mv / 100);
  const marginDollars = customerRate - cc;
  const marginPctOfRate = customerRate ? (marginDollars / customerRate) * 100 : 0;
  const customerPerMile = mi ? customerRate / mi : 0;
  const carrierPerMile = mi ? cc / mi : 0;

  return { customerRate, marginDollars, marginPctOfRate, customerPerMile, carrierPerMile };
}
