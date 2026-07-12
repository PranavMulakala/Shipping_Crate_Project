import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
        on ? 'bg-amber-500' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          on ? 'translate-x-4' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

export default function ClauseLibrary() {
  const { clauses, updateClause, toggleClauseRequired, addClause } = useApp();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Clause Library</h1>
          <p className="text-sm text-slate-500">
            Required clauses trigger the missing-terms warning when generating a rate confirmation.
          </p>
        </div>
        <button
          type="button"
          onClick={addClause}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          <Plus size={16} /> Add clause
        </button>
      </div>

      <div className="space-y-3">
        {clauses.map((c) => (
          <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <input
                value={c.title}
                onChange={(e) => updateClause(c.id, { title: e.target.value })}
                placeholder="Clause title"
                className="min-w-0 flex-1 border-b border-transparent bg-transparent pb-0.5 text-base font-semibold text-slate-900 outline-none transition-colors focus:border-blue-400"
              />
              <label className="flex shrink-0 items-center gap-2 text-xs font-medium text-slate-600">
                Required
                <Toggle on={c.required} onClick={() => toggleClauseRequired(c.id)} />
              </label>
            </div>
            <textarea
              value={c.body}
              onChange={(e) => updateClause(c.id, { body: e.target.value })}
              rows={2}
              placeholder="Clause body text…"
              className="mt-2 w-full resize-y rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-blue-400 focus:bg-white"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
