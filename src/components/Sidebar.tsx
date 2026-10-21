import { NavLink } from 'react-router-dom';
import { Building2, FileText, LayoutDashboard, PlusCircle, Truck } from 'lucide-react';
import { useApp } from '../context/AppContext';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/loads/new', label: 'New Load', icon: PlusCircle, end: false },
  { to: '/clauses', label: 'Clause Library', icon: FileText, end: false },
  { to: '/customers', label: 'Customers', icon: Building2, end: false },
  { to: '/carriers', label: 'Carriers', icon: Truck, end: false },
];

export default function Sidebar() {
  const { company } = useApp();

  return (
    <aside className="flex w-60 flex-col border-r border-slate-800 bg-slate-900 text-slate-300">
      <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
          {company.logoBadge}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">Northgate Logistics</div>
          <div className="text-xs text-slate-400">Broker Portal</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 px-5 py-4 text-xs text-slate-500">
        {company.mc} · Prototype
      </div>
    </aside>
  );
}
