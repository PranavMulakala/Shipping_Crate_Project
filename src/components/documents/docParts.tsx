import type { ReactNode } from 'react';
import type { Company } from '../../types';

export function DocHeader({ company, title }: { company: Company; title: string }) {
  return (
    <div className="flex items-start justify-between border-b-2 border-slate-800 pb-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white">
          {company.logoBadge}
        </div>
        <div>
          <div className="text-lg font-bold">{company.name}</div>
          <div className="text-xs text-slate-600">{company.address}</div>
          <div className="text-xs text-slate-600">
            {company.mc} · {company.phone} · {company.email}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xl font-bold tracking-tight">{title}</div>
      </div>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">{title}</div>
      <div className="rounded-lg border border-slate-200 p-3">{children}</div>
    </div>
  );
}

export function Row({ k, v }: { k: string; v: ReactNode }) {
  return (
    <div className="flex justify-between gap-3 py-0.5 text-xs">
      <span className="text-slate-500">{k}</span>
      <span className="text-right font-medium text-slate-800">{v}</span>
    </div>
  );
}

export function SignatureBlock({ label }: { label: string }) {
  return (
    <div>
      <div className="h-9 border-b border-slate-400" />
      <div className="mt-1 text-xs font-medium text-slate-700">{label}</div>
      <div className="mt-3 flex gap-4 text-[11px] text-slate-500">
        <div className="flex-1 border-b border-slate-300 pb-1">Signature</div>
        <div className="w-20 border-b border-slate-300 pb-1">Date</div>
      </div>
    </div>
  );
}
