import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { inputCls } from '../components/form';

export default function Carriers() {
  const { carriers, addCarrier } = useApp();
  const [adding, setAdding] = useState(false);
  const [f, setF] = useState({ name: '', mc: '', dispatchPhone: '' });

  const submit = () => {
    if (!f.name.trim()) return;
    addCarrier(f);
    setF({ name: '', mc: '', dispatchPhone: '' });
    setAdding(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Carriers</h1>
          <p className="text-sm text-slate-500">{carriers.length} carriers</p>
        </div>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Plus size={16} /> Add carrier
        </button>
      </div>

      {adding && (
        <div className="mb-4 grid gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-4">
          <input className={inputCls} placeholder="Carrier name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <input className={inputCls} placeholder="MC number" value={f.mc} onChange={(e) => setF({ ...f, mc: e.target.value })} />
          <input className={inputCls} placeholder="Dispatch phone" value={f.dispatchPhone} onChange={(e) => setF({ ...f, dispatchPhone: e.target.value })} />
          <button type="button" onClick={submit} className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900">
            Add
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Carrier</th>
              <th className="px-4 py-3">MC #</th>
              <th className="px-4 py-3">Dispatch</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {carriers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                <td className="px-4 py-3 text-slate-700">{c.mc}</td>
                <td className="px-4 py-3 text-slate-700">{c.dispatchPhone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
