import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FileCheck2, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EQUIPMENT_OPTIONS } from '../types';
import type { Clause, Load, MarginType } from '../types';
import { computeEconomics } from '../lib/economics';
import EconomicsPanel from '../components/EconomicsPanel';
import ClauseSelector from '../components/ClauseSelector';
import RequiredTermsWarning from '../components/RequiredTermsWarning';
import RateConDoc from '../components/documents/RateConDoc';
import BolDoc from '../components/documents/BolDoc';
import { Card, Field, inputCls } from '../components/form';

interface FormState {
  customerId: string;
  originCity: string;
  originState: string;
  originZip: string;
  destCity: string;
  destState: string;
  destZip: string;
  equipment: string;
  weight: string;
  miles: string;
  commodity: string;
  pickupDate: string;
  deliveryDate: string;
  carrierId: string;
  carrierCost: string;
  marginType: MarginType;
  marginValue: string;
  reference: string;
}

const emptyForm = (reference: string): FormState => ({
  customerId: '',
  originCity: '',
  originState: '',
  originZip: '',
  destCity: '',
  destState: '',
  destZip: '',
  equipment: 'Van',
  weight: '',
  miles: '',
  commodity: '',
  pickupDate: '',
  deliveryDate: '',
  carrierId: '',
  carrierCost: '',
  marginType: 'percent',
  marginValue: '',
  reference,
});

function loadToForm(src: Load, reference: string): FormState {
  return {
    customerId: src.customerId,
    originCity: src.originCity,
    originState: src.originState,
    originZip: src.originZip ?? '',
    destCity: src.destCity,
    destState: src.destState,
    destZip: src.destZip ?? '',
    equipment: src.equipment,
    weight: String(src.weightLbs),
    miles: String(src.miles),
    commodity: src.commodity ?? '',
    pickupDate: src.pickupDate ?? '',
    deliveryDate: src.deliveryDate ?? '',
    carrierId: src.carrierId ?? '',
    carrierCost: String(src.carrierCost),
    marginType: src.marginType,
    marginValue: String(src.marginValue),
    reference,
  };
}

const num = (s: string): number => {
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};

export default function NewLoad() {
  const { customers, carriers, clauses, loads, requiredClauses, addCustomer, nextLoadRef, getLoad } =
    useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const dupId = (location.state as { duplicateFromId?: string } | null)?.duplicateFromId;
  const dupSrc = dupId ? getLoad(dupId) : undefined;

  const [form, setForm] = useState<FormState>(() =>
    dupSrc ? loadToForm(dupSrc, nextLoadRef()) : emptyForm(nextLoadRef()),
  );
  const [selectedClauseIds, setSelectedClauseIds] = useState<string[]>(() =>
    dupSrc ? [...dupSrc.clauseIds] : [],
  );
  const [warningMissing, setWarningMissing] = useState<Clause[] | null>(null);
  const [doc, setDoc] = useState<{ type: 'ratecon' | 'bol'; load: Load } | null>(null);

  // Quick-add customer inline form
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [qa, setQa] = useState({ name: '', city: '', state: '', contact: '', phone: '' });

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const carrierCost = num(form.carrierCost);
  const marginValue = num(form.marginValue);
  const miles = num(form.miles);

  const buildLoad = (clauseIds: string[]): Load => {
    const cust = customers.find((c) => c.id === form.customerId);
    const carr = carriers.find((c) => c.id === form.carrierId);
    const e = computeEconomics(carrierCost, form.marginType, marginValue, miles);
    return {
      id: form.reference || nextLoadRef(),
      customerId: form.customerId,
      customerName: cust?.name ?? '—',
      originCity: form.originCity || '—',
      originState: form.originState,
      originZip: form.originZip,
      destCity: form.destCity || '—',
      destState: form.destState,
      destZip: form.destZip,
      equipment: form.equipment,
      weightLbs: num(form.weight),
      miles,
      commodity: form.commodity,
      pickupDate: form.pickupDate,
      deliveryDate: form.deliveryDate,
      carrierId: form.carrierId,
      carrierName: carr?.name,
      carrierCost,
      marginType: form.marginType,
      marginValue,
      customerRate: e.customerRate,
      status: 'Quoted',
      date: new Date().toISOString().slice(0, 10),
      clauseIds,
      freightChargeTerms: 'Prepaid',
    };
  };

  const openRateCon = (clauseIds: string[]) => {
    setSelectedClauseIds(clauseIds);
    setWarningMissing(null);
    setDoc({ type: 'ratecon', load: buildLoad(clauseIds) });
  };

  const handleGenerateRateCon = () => {
    const missing = requiredClauses.filter((c) => !selectedClauseIds.includes(c.id));
    if (missing.length > 0) setWarningMissing(missing);
    else openRateCon(selectedClauseIds);
  };

  const handleGenerateBol = () => setDoc({ type: 'bol', load: buildLoad(selectedClauseIds) });

  const toggleClause = (id: string) =>
    setSelectedClauseIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const prefillFromLane = (loadId: string) => {
    const src = getLoad(loadId);
    if (!src) return;
    setForm((f) => ({
      ...f,
      originCity: src.originCity,
      originState: src.originState,
      originZip: src.originZip ?? '',
      destCity: src.destCity,
      destState: src.destState,
      destZip: src.destZip ?? '',
      equipment: src.equipment,
      weight: String(src.weightLbs),
      miles: String(src.miles),
      carrierCost: String(src.carrierCost),
      marginType: src.marginType,
      marginValue: String(src.marginValue),
    }));
  };

  const submitQuickAdd = () => {
    if (!qa.name.trim()) return;
    const created = addCustomer(qa);
    set('customerId', created.id);
    setQa({ name: '', city: '', state: '', contact: '', phone: '' });
    setShowQuickAdd(false);
  };

  // Equipment options: include the current value if it isn't one of the presets
  // (e.g. seed loads use "Dry Van"), so the select renders it correctly.
  const equipmentOptions = (EQUIPMENT_OPTIONS as readonly string[]).includes(form.equipment)
    ? [...EQUIPMENT_OPTIONS]
    : [form.equipment, ...EQUIPMENT_OPTIONS];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">New Load</h1>
        <p className="text-sm text-slate-500">
          Build a quote, then generate a rate confirmation or bill of lading.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT: form */}
        <div className="space-y-6 lg:col-span-2">
          <Card title="Prefill from a past lane" subtitle="Copy lane, equipment, weight, miles, carrier cost and margin from a recent load.">
            <select
              value=""
              onChange={(e) => e.target.value && prefillFromLane(e.target.value)}
              className={inputCls}
            >
              <option value="">Select a past lane…</option>
              {loads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.id} — {l.customerName} · {l.originCity}, {l.originState} → {l.destCity},{' '}
                  {l.destState}
                </option>
              ))}
            </select>
          </Card>

          <Card title="Customer & lane">
            <div className="grid gap-4">
              <Field label="Customer">
                <div className="flex gap-2">
                  <select
                    value={form.customerId}
                    onChange={(e) => set('customerId', e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Select customer…</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} — {c.city}, {c.state}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowQuickAdd((v) => !v)}
                    className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Quick add
                  </button>
                </div>
              </Field>

              {showQuickAdd && (
                <div className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-2">
                  <input className={inputCls} placeholder="Company name" value={qa.name} onChange={(e) => setQa({ ...qa, name: e.target.value })} />
                  <input className={inputCls} placeholder="City" value={qa.city} onChange={(e) => setQa({ ...qa, city: e.target.value })} />
                  <input className={inputCls} placeholder="State" value={qa.state} onChange={(e) => setQa({ ...qa, state: e.target.value })} />
                  <input className={inputCls} placeholder="Contact name" value={qa.contact} onChange={(e) => setQa({ ...qa, contact: e.target.value })} />
                  <input className={inputCls} placeholder="Phone" value={qa.phone} onChange={(e) => setQa({ ...qa, phone: e.target.value })} />
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={submitQuickAdd} className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900">
                      Add customer
                    </button>
                    <button type="button" onClick={() => setShowQuickAdd(false)} className="text-sm text-slate-500 hover:text-slate-700">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid grid-cols-6 gap-2">
                  <Field label="Origin city" className="col-span-3">
                    <input className={inputCls} value={form.originCity} onChange={(e) => set('originCity', e.target.value)} placeholder="Atlanta" />
                  </Field>
                  <Field label="State" className="col-span-1">
                    <input className={inputCls} value={form.originState} onChange={(e) => set('originState', e.target.value)} placeholder="GA" />
                  </Field>
                  <Field label="ZIP" className="col-span-2">
                    <input className={inputCls} value={form.originZip} onChange={(e) => set('originZip', e.target.value)} placeholder="30336" />
                  </Field>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  <Field label="Destination city" className="col-span-3">
                    <input className={inputCls} value={form.destCity} onChange={(e) => set('destCity', e.target.value)} placeholder="Dallas" />
                  </Field>
                  <Field label="State" className="col-span-1">
                    <input className={inputCls} value={form.destState} onChange={(e) => set('destState', e.target.value)} placeholder="TX" />
                  </Field>
                  <Field label="ZIP" className="col-span-2">
                    <input className={inputCls} value={form.destZip} onChange={(e) => set('destZip', e.target.value)} placeholder="75212" />
                  </Field>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Freight">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Equipment">
                <select className={inputCls} value={form.equipment} onChange={(e) => set('equipment', e.target.value)}>
                  {equipmentOptions.map((eq) => (
                    <option key={eq} value={eq}>
                      {eq}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Commodity">
                <input className={inputCls} value={form.commodity} onChange={(e) => set('commodity', e.target.value)} placeholder="Printing paper (palletized)" />
              </Field>
              <Field label="Weight (lbs)">
                <input type="number" min="0" className={inputCls} value={form.weight} onChange={(e) => set('weight', e.target.value)} placeholder="42000" />
              </Field>
              <Field label="Miles">
                <input type="number" min="0" className={inputCls} value={form.miles} onChange={(e) => set('miles', e.target.value)} placeholder="795" />
              </Field>
              <Field label="Pickup date">
                <input type="date" className={inputCls} value={form.pickupDate} onChange={(e) => set('pickupDate', e.target.value)} />
              </Field>
              <Field label="Delivery date">
                <input type="date" className={inputCls} value={form.deliveryDate} onChange={(e) => set('deliveryDate', e.target.value)} />
              </Field>
            </div>
          </Card>

          <Card title="Carrier & pricing">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Carrier">
                <select className={inputCls} value={form.carrierId} onChange={(e) => set('carrierId', e.target.value)}>
                  <option value="">Select carrier…</option>
                  {carriers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.mc}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Load reference">
                <input className={inputCls} value={form.reference} onChange={(e) => set('reference', e.target.value)} placeholder="NG-1043" />
              </Field>
              <Field label="Carrier cost ($)">
                <input type="number" min="0" className={inputCls} value={form.carrierCost} onChange={(e) => set('carrierCost', e.target.value)} placeholder="1700" />
              </Field>
              <Field label={`Margin (${form.marginType === 'flat' ? 'flat $' : 'percent %'})`}>
                <div className="flex gap-2">
                  <div className="flex shrink-0 rounded-lg border border-slate-300 p-0.5">
                    <button type="button" onClick={() => set('marginType', 'flat')} className={`rounded-md px-2.5 py-1 text-xs font-medium ${form.marginType === 'flat' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>
                      Flat $
                    </button>
                    <button type="button" onClick={() => set('marginType', 'percent')} className={`rounded-md px-2.5 py-1 text-xs font-medium ${form.marginType === 'percent' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>
                      %
                    </button>
                  </div>
                  <input type="number" min="0" className={inputCls} value={form.marginValue} onChange={(e) => set('marginValue', e.target.value)} placeholder={form.marginType === 'flat' ? '350' : '18'} />
                </div>
              </Field>
            </div>
          </Card>

          <Card title="Rate confirmation terms" subtitle="Select the clauses to include. Required clauses are tagged.">
            <ClauseSelector clauses={clauses} selected={selectedClauseIds} onToggle={toggleClause} />
          </Card>
        </div>

        {/* RIGHT: sticky economics + actions */}
        <div className="lg:col-span-1">
          <div className="space-y-4 lg:sticky lg:top-6">
            <EconomicsPanel
              carrierCost={carrierCost}
              marginType={form.marginType}
              marginValue={marginValue}
              miles={miles}
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
            <p className="px-1 text-xs text-slate-400">
              This is a prototype. Nothing is saved — refreshing resets to seed data.
            </p>
          </div>
        </div>
      </div>

      {warningMissing && (
        <RequiredTermsWarning
          missing={warningMissing}
          onAddAndContinue={() => openRateCon([...selectedClauseIds, ...warningMissing.map((c) => c.id)])}
          onGenerateAnyway={() => openRateCon(selectedClauseIds)}
          onCancel={() => setWarningMissing(null)}
        />
      )}
      {doc?.type === 'ratecon' && <RateConDoc load={doc.load} onClose={() => setDoc(null)} />}
      {doc?.type === 'bol' && <BolDoc load={doc.load} onClose={() => setDoc(null)} />}
    </div>
  );
}
