import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { inputCls } from '../components/form';

export default function Customers() {
  const { customers, addCustomer } = useApp();
  const [adding, setAdding] = useState(false);
  const [f, setF] = useState({ name: '', city: '', state: '', contact: '', phone: '' });

  const submit = () => {
    if (!f.name.trim()) return;
    addCustomer(f);
    setF({ name: '', city: '', state: '', contact: '', phone: '' });
    setAdding(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Customers</h1>
          <p className="text-sm text-slate-500">{customers.length} shippers</p>
        </div>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Plus size={16} /> Add customer
        </button>
      </div>

      {adding && (
        <div className="mb-4 grid gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-5">
          <input className={inputCls} placeholder="Company name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          <input className={inputCls} placeholder="City" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} />
          <input className={inputCls} placeholder="State" value={f.state} onChange={(e) => setF({ ...f, state: e.target.value })} />
          <input className={inputCls} placeholder="Contact" value={f.contact} onChange={(e) => setF({ ...f, contact: e.target.value })} />
          <div className="flex gap-2">
            <input className={inputCls} placeholder="Phone" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
            <button type="button" onClick={submit} className="shrink-0 rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900">
              Add
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Phone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{c.name}</td>
                <td className="px-4 py-3 text-slate-700">
                  {c.city}
                  {c.city && c.state ? ', ' : ''}
                  {c.state}
                </td>
                <td className="px-4 py-3 text-slate-700">{c.contact}</td>
                <td className="px-4 py-3 text-slate-700">{c.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
