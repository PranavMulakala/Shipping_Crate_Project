import { Check } from 'lucide-react';
import type { Clause } from '../types';

export default function ClauseSelector({
  clauses,
  selected,
  onToggle,
}: {
  clauses: Clause[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {clauses.map((c) => {
        const isSel = selected.includes(c.id);
        return (
          <button
            type="button"
            key={c.id}
            onClick={() => onToggle(c.id)}
            className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
              isSel
                ? 'border-blue-500 bg-blue-50/60 ring-1 ring-blue-200'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                isSel ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
              }`}
            >
              {isSel && <Check size={13} strokeWidth={3} />}
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-800">{c.title}</span>
                {c.required && (
                  <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                    Required
                  </span>
                )}
              </span>
              <span className="mt-0.5 block text-xs leading-snug text-slate-500 line-clamp-2">
                {c.body}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
