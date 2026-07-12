import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatusPill from '../components/StatusPill';
import { usd } from '../lib/format';

export default function Dashboard() {
  const { loads } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return loads;
    return loads.filter((l) =>
      [
        l.id,
        l.customerName,
        `${l.originCity} ${l.originState}`,
        `${l.destCity} ${l.destState}`,
        l.equipment,
        l.status,
      ]
        .join(' ')
        .toLowerCase()
        .includes(s),
    );
  }, [loads, q]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Loads</h1>
          <p className="text-sm text-slate-500">{loads.length} active and recent loads</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/loads/new')}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Plus size={16} /> New Load
        </button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search loads, lanes, customers…"
          className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Load #</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Lane</th>
              <th className="px-4 py-3">Equipment</th>
              <th className="px-4 py-3 text-right">Customer Rate</th>
              <th className="px-4 py-3 text-right">Margin</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((l) => {
              const margin = l.customerRate - l.carrierCost;
              return (
                <tr
                  key={l.id}
                  onClick={() => navigate(`/loads/${l.id}`)}
                  className="cursor-pointer transition-colors hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-medium text-slate-900">{l.id}</td>
                  <td className="px-4 py-3 text-slate-700">{l.customerName}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {l.originCity}, {l.originState} → {l.destCity}, {l.destState}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{l.equipment}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">{usd(l.customerRate)}</td>
                  <td className="px-4 py-3 text-right text-emerald-700">{usd(margin)}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={l.status} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">{l.date}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-slate-400">
                  No loads match “{q}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
