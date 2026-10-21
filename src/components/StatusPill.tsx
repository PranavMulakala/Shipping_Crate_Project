import type { LoadStatus } from '../types';

const styles: Record<LoadStatus, string> = {
  Quoted: 'bg-slate-100 text-slate-700 ring-slate-200',
  Booked: 'bg-blue-50 text-blue-700 ring-blue-200',
  Delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
};

export default function StatusPill({ status }: { status: LoadStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[status]}`}
    >
      {status}
    </span>
  );
}
