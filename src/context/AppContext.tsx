import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Carrier, Clause, Company, Customer, Load } from '../types';
import { company as seedCompany, seedCarriers, seedClauses, seedCustomers, seedLoads } from '../seedData';

interface AppContextValue {
  company: Company;
  customers: Customer[];
  carriers: Carrier[];
  clauses: Clause[];
  loads: Load[];
  requiredClauses: Clause[];
  addCustomer: (c: Omit<Customer, 'id'>) => Customer;
  addCarrier: (c: Omit<Carrier, 'id'>) => Carrier;
  addClause: () => Clause;
  updateClause: (id: string, patch: Partial<Clause>) => void;
  toggleClauseRequired: (id: string) => void;
  getCustomer: (id?: string) => Customer | undefined;
  getCarrier: (id?: string) => Carrier | undefined;
  getClause: (id: string) => Clause | undefined;
  getLoad: (id?: string) => Load | undefined;
  nextLoadRef: () => string;
}

const AppContext = createContext<AppContextValue | null>(null);

// Simple in-memory id generator (no persistence; refresh resets to seed).
let idCounter = 5000;
function newId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(seedCustomers);
  const [carriers, setCarriers] = useState<Carrier[]>(seedCarriers);
  const [clauses, setClauses] = useState<Clause[]>(seedClauses);
  const [loads] = useState<Load[]>(seedLoads);

  const addCustomer = useCallback((c: Omit<Customer, 'id'>) => {
    const created: Customer = { ...c, id: newId('cus') };
    setCustomers((prev) => [...prev, created]);
    return created;
  }, []);

  const addCarrier = useCallback((c: Omit<Carrier, 'id'>) => {
    const created: Carrier = { ...c, id: newId('car') };
    setCarriers((prev) => [...prev, created]);
    return created;
  }, []);

  const addClause = useCallback(() => {
    const created: Clause = { id: newId('cl'), title: 'New clause', body: '', required: false };
    setClauses((prev) => [...prev, created]);
    return created;
  }, []);

  const updateClause = useCallback((id: string, patch: Partial<Clause>) => {
    setClauses((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const toggleClauseRequired = useCallback((id: string) => {
    setClauses((prev) => prev.map((c) => (c.id === id ? { ...c, required: !c.required } : c)));
  }, []);

  const getCustomer = useCallback((id?: string) => customers.find((c) => c.id === id), [customers]);
  const getCarrier = useCallback((id?: string) => carriers.find((c) => c.id === id), [carriers]);
  const getClause = useCallback((id: string) => clauses.find((c) => c.id === id), [clauses]);
  const getLoad = useCallback((id?: string) => loads.find((l) => l.id === id), [loads]);

  const nextLoadRef = useCallback(() => {
    const nums = loads
      .map((l) => parseInt(l.id.replace(/[^0-9]/g, ''), 10))
      .filter((n) => !Number.isNaN(n));
    const max = nums.length ? Math.max(...nums) : 1042;
    return `NG-${max + 1}`;
  }, [loads]);

  const requiredClauses = useMemo(() => clauses.filter((c) => c.required), [clauses]);

  const value: AppContextValue = {
    company: seedCompany,
    customers,
    carriers,
    clauses,
    loads,
    requiredClauses,
    addCustomer,
    addCarrier,
    addClause,
    updateClause,
    toggleClauseRequired,
    getCustomer,
    getCarrier,
    getClause,
    getLoad,
    nextLoadRef,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
