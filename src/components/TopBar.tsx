import { useApp } from '../context/AppContext';

export default function TopBar() {
  const { company } = useApp();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="text-sm font-medium text-slate-500">Freight Operations</div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <div className="text-sm font-medium text-slate-800">{company.name}</div>
          <div className="text-xs text-slate-400">Sam Rivera · Broker</div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-white">
          SR
        </div>
      </div>
    </header>
  );
}
