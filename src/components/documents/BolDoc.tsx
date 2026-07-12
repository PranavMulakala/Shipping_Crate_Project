import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { FreightChargeTerms, Load } from '../../types';
import { fmtInt } from '../../lib/format';
import DocShell from './DocShell';
import { DocHeader, Section, SignatureBlock } from './docParts';

const TERMS: FreightChargeTerms[] = ['Prepaid', 'Collect', 'Third-Party'];

export default function BolDoc({ load, onClose }: { load: Load; onClose: () => void }) {
  const { company, getCustomer, getCarrier } = useApp();
  const customer = getCustomer(load.customerId);
  const carrier = getCarrier(load.carrierId);
  const [terms, setTerms] = useState<FreightChargeTerms>(load.freightChargeTerms ?? 'Prepaid');

  const toolbarExtra = (
    <div className="flex items-center gap-1 rounded-lg border border-slate-300 bg-slate-50 p-0.5">
      {TERMS.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => setTerms(t)}
          className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
            terms === t ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-white'
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );

  return (
    <DocShell title="Bill of Lading" onClose={onClose} toolbarExtra={toolbarExtra}>
      <DocHeader company={company} title="BILL OF LADING" />

      <div className="mt-3 flex items-center justify-between text-sm">
        <div>
          BOL #: <span className="font-semibold">{load.id}</span>
        </div>
        <div className="text-slate-600">Date: {load.date}</div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <Section title="Shipper (Ship From)">
          <div className="font-semibold">{customer?.name ?? '—'}</div>
          <div className="text-xs text-slate-600">
            {load.originCity}, {load.originState} {load.originZip ?? ''}
          </div>
          <div className="text-xs text-slate-600">
            {customer ? `${customer.contact} · ${customer.phone}` : ''}
          </div>
        </Section>
        <Section title="Consignee (Ship To)">
          <div className="font-semibold">
            {load.destCity}, {load.destState} {load.destZip ?? ''}
          </div>
          <div className="text-xs text-slate-600">Delivery date: {load.deliveryDate || '—'}</div>
        </Section>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <Section title="Carrier">
          <div className="font-semibold">{carrier?.name ?? '—'}</div>
          <div className="text-xs text-slate-600">
            {carrier?.mc ?? ''} {carrier ? `· Dispatch ${carrier.dispatchPhone}` : ''}
          </div>
        </Section>
        <Section title="Freight Charge Terms">
          <div className="flex gap-4 text-xs">
            {TERMS.map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <span
                  className={`flex h-4 w-4 items-center justify-center border text-[10px] ${
                    terms === t ? 'border-slate-800 bg-slate-800 text-white' : 'border-slate-400'
                  }`}
                >
                  {terms === t ? '✓' : ''}
                </span>
                {t}
              </span>
            ))}
          </div>
        </Section>
      </div>

      <div className="mt-4">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-y border-slate-300 bg-slate-50 text-left">
              <th className="px-2 py-2 font-semibold">Qty / Pieces</th>
              <th className="px-2 py-2 font-semibold">Description of Articles</th>
              <th className="px-2 py-2 font-semibold">Equipment</th>
              <th className="px-2 py-2 text-right font-semibold">Weight</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="px-2 py-3">1 truckload</td>
              <td className="px-2 py-3">{load.commodity || 'General freight'}</td>
              <td className="px-2 py-3">{load.equipment}</td>
              <td className="px-2 py-3 text-right">{fmtInt(load.weightLbs)} lbs</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-6">
        <SignatureBlock label="Shipper" />
        <SignatureBlock label="Carrier" />
        <SignatureBlock label="Consignee" />
      </div>

      <div className="mt-6 border-t border-slate-200 pt-3 text-center text-[10px] text-slate-400">
        This bill of lading is a prototype document generated for demonstration purposes.
      </div>
    </DocShell>
  );
}
