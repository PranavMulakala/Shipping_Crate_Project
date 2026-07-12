import { useApp } from '../../context/AppContext';
import type { Load } from '../../types';
import { fmtInt, usd } from '../../lib/format';
import DocShell from './DocShell';
import { DocHeader, Row, Section, SignatureBlock } from './docParts';

export default function RateConDoc({ load, onClose }: { load: Load; onClose: () => void }) {
  const { company, getCarrier, clauses } = useApp();
  const carrier = getCarrier(load.carrierId);
  const selected = clauses.filter((c) => load.clauseIds.includes(c.id));

  return (
    <DocShell title="Rate Confirmation" onClose={onClose}>
      <DocHeader company={company} title="RATE CONFIRMATION" />

      <div className="mt-3 flex items-center justify-between text-sm">
        <div>
          Load Reference: <span className="font-semibold">{load.id}</span>
        </div>
        <div className="text-slate-600">Date: {load.date}</div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <Section title="Carrier">
          <div className="font-semibold">{carrier?.name ?? '—'}</div>
          <div className="text-xs text-slate-600">{carrier?.mc ?? ''}</div>
          <div className="text-xs text-slate-600">Dispatch: {carrier?.dispatchPhone ?? '—'}</div>
        </Section>
        <Section title="Equipment & Freight">
          <Row k="Equipment" v={load.equipment} />
          <Row k="Weight" v={`${fmtInt(load.weightLbs)} lbs`} />
          <Row k="Commodity" v={load.commodity || '—'} />
          <Row k="Miles" v={load.miles ? `${fmtInt(load.miles)} mi` : '—'} />
        </Section>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <Section title="Pickup">
          <div className="font-semibold">
            {load.originCity}, {load.originState} {load.originZip ?? ''}
          </div>
          <div className="text-xs text-slate-600">Pickup date: {load.pickupDate || '—'}</div>
        </Section>
        <Section title="Delivery">
          <div className="font-semibold">
            {load.destCity}, {load.destState} {load.destZip ?? ''}
          </div>
          <div className="text-xs text-slate-600">Delivery date: {load.deliveryDate || '—'}</div>
        </Section>
      </div>

      <div className="mt-4 rounded-lg border border-slate-300 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            Agreed Carrier Rate
          </div>
          <div className="text-2xl font-bold">{usd(load.carrierCost)}</div>
        </div>
        <div className="mt-1 text-xs text-slate-600">Payment terms: {company.paymentTerms}</div>
      </div>

      <div className="mt-5">
        <div className="text-sm font-bold uppercase tracking-wide text-slate-700">
          Terms &amp; Conditions
        </div>
        {selected.length === 0 ? (
          <div className="mt-2 text-xs italic text-slate-500">No additional terms selected.</div>
        ) : (
          <ol className="mt-2 space-y-2 text-xs leading-relaxed text-slate-700">
            {selected.map((c, i) => (
              <li key={c.id}>
                <span className="font-semibold">
                  {i + 1}. {c.title}.
                </span>{' '}
                {c.body}
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-8">
        <SignatureBlock label="Broker — Northgate Logistics LLC" />
        <SignatureBlock label={`Carrier — ${carrier?.name ?? ''}`} />
      </div>

      <div className="mt-6 border-t border-slate-200 pt-3 text-center text-[10px] text-slate-400">
        This rate confirmation is a prototype document generated for demonstration purposes.
      </div>
    </DocShell>
  );
}
