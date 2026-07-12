import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Copy, FileCheck2, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Clause } from '../types';
import { fmtInt } from '../lib/format';
import EconomicsPanel from '../components/EconomicsPanel';
import RequiredTermsWarning from '../components/RequiredTermsWarning';
import RateConDoc from '../components/documents/RateConDoc';
import BolDoc from '../components/documents/BolDoc';
import StatusPill from '../components/StatusPill';

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 py-2 text-sm last:border-0">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-800">{value}</span>
    </div>
  );
}

export default function LoadDetail() {
  const { id } = useParams();
  const { getLoad, getCustomer, getCarrier, requiredClauses, clauses } = useApp();
  const navigate = useNavigate();
  const load = getLoad(id);

  const [warningMissing, setWarningMissing] = useState<Clause[] | null>(null);
  const [doc, setDoc] = useState<'ratecon' | 'bol' | null>(null);
  const [docClauseIds, setDocClauseIds] = useState<string[]>(() => load?.clauseIds ?? []);

  if (!load) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
        Load not found.{' '}
        <button className="font-medium text-blue-600 hover:underline" onClick={() => navigate('/')}>
          Back to dashboard
        </button>
      </div>
    );
  }

  const customer = getCustomer(load.customerId);
  const carrier = getCarrier(load.carrierId);
  const selectedClauses = clauses.filter((c) => load.clauseIds.includes(c.id));

  const openRateCon = (ids: string[]) => {
    setDocClauseIds(ids);
    setWarningMissing(null);
    setDoc('ratecon');
  };

  const handleGenerateRateCon = () => {
    const missing = requiredClauses.filter((c) => !load.clauseIds.includes(c.id));
    if (missing.length > 0) setWarningMissing(missing);
    else openRateCon(load.clauseIds);
  };

  const handleGenerateBol = () => {
    setDocClauseIds(load.clauseIds);
    setDoc('bol');
  };

  const docLoad = { ...load, clauseIds: docClauseIds };

  return (
    <div>
      <button
        onClick={() => navigate('/')}
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
      >
        <ArrowLeft size={16} /> Loads
      </button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">{load.id}</h1>
            <StatusPill status={load.status} />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {load.customerName} · {load.originCity}, {load.originState} → {load.destCity},{' '}
            {load.destState}
          </p>
        </div>
        <button
          onClick={() => navigate('/loads/new', { state: { duplicateFromId: load.id } })}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          <Copy size={16} /> Duplicate this load
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Customer & lane</h2>
            <DetailRow label="Customer" value={customer?.name ?? load.customerName} />
            <DetailRow
              label="Origin"
              value={`${load.originCity}, ${load.originState} ${load.originZip ?? ''}`}
            />
            <DetailRow
              label="Destination"
              value={`${load.destCity}, ${load.destState} ${load.destZip ?? ''}`}
            />
            <DetailRow label="Pickup date" value={load.pickupDate || '—'} />
            <DetailRow label="Delivery date" value={load.deliveryDate || '—'} />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Freight & carrier</h2>
            <DetailRow label="Equipment" value={load.equipment} />
            <DetailRow label="Weight" value={`${fmtInt(load.weightLbs)} lbs`} />
            <DetailRow label="Miles" value={load.miles ? `${fmtInt(load.miles)} mi` : '—'} />
            <DetailRow label="Commodity" value={load.commodity || '—'} />
            <DetailRow
              label="Carrier"
              value={carrier ? `${carrier.name} · ${carrier.mc}` : load.carrierName ?? '—'}
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">Rate confirmation terms</h2>
            {selectedClauses.length === 0 ? (
              <p className="text-sm text-slate-500">No terms selected on this load.</p>
            ) : (
              <ul className="space-y-1.5">
                {selectedClauses.map((c) => (
                  <li key={c.id} className="flex items-center gap-2 text-sm text-slate-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    {c.title}
                    {c.required && (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                        Required
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="space-y-4 lg:sticky lg:top-6">
            <EconomicsPanel
              carrierCost={load.carrierCost}
              marginType={load.marginType}
              marginValue={load.marginValue}
              miles={load.miles}
            >
              <button
                type="button"
                onClick={handleGenerateRateCon}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                <FileCheck2 size={16} /> Generate Rate Confirmation
              </button>
              <button
                type="button"
                onClick={handleGenerateBol}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                <FileText size={16} /> Generate BOL
              </button>
            </EconomicsPanel>
          </div>
        </div>
      </div>

      {warningMissing && (
        <RequiredTermsWarning
          missing={warningMissing}
          onAddAndContinue={() => openRateCon([...load.clauseIds, ...warningMissing.map((c) => c.id)])}
          onGenerateAnyway={() => openRateCon(load.clauseIds)}
          onCancel={() => setWarningMissing(null)}
        />
      )}
      {doc === 'ratecon' && <RateConDoc load={docLoad} onClose={() => setDoc(null)} />}
      {doc === 'bol' && <BolDoc load={docLoad} onClose={() => setDoc(null)} />}
    </div>
  );
}
