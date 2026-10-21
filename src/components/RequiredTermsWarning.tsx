import { AlertTriangle, X } from 'lucide-react';
import type { Clause } from '../types';

export default function RequiredTermsWarning({
  missing,
  onAddAndContinue,
  onGenerateAnyway,
  onCancel,
}: {
  missing: Clause[];
  onAddAndContinue: () => void;
  onGenerateAnyway: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
        <div className="flex items-start gap-4 border-b border-amber-200 bg-amber-50 p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <AlertTriangle size={22} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold leading-tight text-amber-900">
              This rate confirmation is missing required terms
            </h2>
            <p className="mt-1 text-sm text-amber-800">
              Northgate policy requires these clauses on every carrier rate confirmation. They are
              not currently selected:
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="rounded-md p-1 text-amber-500 transition-colors hover:bg-amber-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          <ul className="space-y-2">
            {missing.map((c) => (
              <li
                key={c.id}
                className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2"
              >
                <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-500" />
                <div>
                  <div className="text-sm font-semibold text-slate-800">{c.title}</div>
                  <div className="text-xs text-slate-500">{c.body}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50 p-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onGenerateAnyway}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
          >
            Generate anyway
          </button>
          <button
            type="button"
            onClick={onAddAndContinue}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-600"
          >
            Add missing terms &amp; continue
          </button>
        </div>
      </div>
    </div>
  );
}
