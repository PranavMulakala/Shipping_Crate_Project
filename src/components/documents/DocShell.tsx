import type { ReactNode } from 'react';
import { ArrowLeft, Printer } from 'lucide-react';

export default function DocShell({
  title,
  onClose,
  toolbarExtra,
  children,
}: {
  title: string;
  onClose: () => void;
  toolbarExtra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-200">
      <div className="no-print flex items-center justify-between gap-4 border-b border-slate-300 bg-white px-6 py-3 shadow-sm">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="hidden text-sm font-semibold text-slate-500 sm:block">{title}</div>
        <div className="flex items-center gap-3">
          {toolbarExtra}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Printer size={16} /> Download PDF
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div
          id="print-area"
          className="mx-auto max-w-[8.5in] bg-white p-[0.6in] text-slate-900 shadow-lg ring-1 ring-slate-300"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
