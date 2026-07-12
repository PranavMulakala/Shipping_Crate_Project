import type { ReactNode } from 'react';
import type { MarginType } from '../types';
import { computeEconomics } from '../lib/economics';
import { fmtPct, usd } from '../lib/format';

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className={`mt-0.5 text-lg font-semibold ${accent ? 'text-emerald-700' : 'text-slate-800'}`}>
        {value}
      </dd>
    </div>
  );
}

export default function EconomicsPanel({
  carrierCost,
  marginType,
  marginValue,
  miles,
  children,
}: {
  carrierCost: number;
  marginType: MarginType;
  marginValue: number;
  miles: number;
  children?: ReactNode;
}) {
  const e = computeEconomics(carrierCost, marginType, marginValue, miles);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Customer Rate</div>
      <div className="mt-1 text-4xl font-bold tracking-tight text-slate-900">{usd(e.customerRate)}</div>

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
        <Metric label="Margin $" value={usd(e.marginDollars)} accent />
        <Metric label="Margin % of rate" value={e.customerRate ? fmtPct(e.marginPctOfRate) : '—'} accent />
        <Metric label="Customer $/mi" value={miles ? usd(e.customerPerMile) : '—'} />
        <Metric label="Carrier $/mi" value={miles ? usd(e.carrierPerMile) : '—'} />
      </dl>

      {children && <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">{children}</div>}
    </div>
  );
}
