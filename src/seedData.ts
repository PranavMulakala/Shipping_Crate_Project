import type { Carrier, Clause, Company, Customer, Load } from './types';
import { computeEconomics } from './lib/economics';

export const company: Company = {
  name: 'Northgate Logistics LLC',
  mc: 'MC #1148890',
  address: '4200 Northside Pkwy NW, Atlanta, GA 30327',
  phone: '(404) 555-0142',
  email: 'ops@northgatelogistics.com',
  paymentTerms: 'Net 30 days from receipt of signed POD and invoice.',
  logoBadge: 'NL',
};

export const seedCustomers: Customer[] = [
  { id: 'cus-1', name: 'Georgia Paper Co.', city: 'Marietta', state: 'GA', contact: 'Dana Wells', phone: '(770) 555-0188' },
  { id: 'cus-2', name: 'Peachtree Manufacturing', city: 'Atlanta', state: 'GA', contact: 'Luis Ortiz', phone: '(404) 555-0176' },
  { id: 'cus-3', name: 'Sunbelt Foods Distribution', city: 'Forest Park', state: 'GA', contact: 'Amy Chen', phone: '(678) 555-0121' },
];

export const seedCarriers: Carrier[] = [
  { id: 'car-1', name: 'Rodriguez Trucking LLC', mc: 'MC 998877', dispatchPhone: '(214) 555-0155' },
  { id: 'car-2', name: 'Blue Ridge Transport Inc', mc: 'MC 771230', dispatchPhone: '(615) 555-0133' },
  { id: 'car-3', name: 'Delta Haulers LLC', mc: 'MC 655410', dispatchPhone: '(901) 555-0199' },
];

export const seedClauses: Clause[] = [
  {
    id: 'cl-detention',
    title: 'Detention',
    required: true,
    body: 'Detention billed at $50/hr after 2 hours free time at pickup and delivery; must be documented on the BOL with in/out times.',
  },
  {
    id: 'cl-tonu',
    title: 'Truck Ordered Not Used (TONU)',
    required: true,
    body: 'TONU fee of $150 applies if load is cancelled after carrier dispatch and prior to pickup.',
  },
  {
    id: 'cl-double-brokering',
    title: 'Double-Brokering Prohibited',
    required: true,
    body: 'Carrier may not re-broker, co-broker, or tender this load to any other carrier. Violation voids all payment.',
  },
  {
    id: 'cl-layover',
    title: 'Layover',
    required: false,
    body: 'Layover billed at $200 per 24-hour period when delay is not caused by carrier.',
  },
  {
    id: 'cl-lumper',
    title: 'Lumper Reimbursement',
    required: false,
    body: 'Lumper fees reimbursed with an itemized receipt submitted within 24 hours.',
  },
  {
    id: 'cl-tracking',
    title: 'Tracking / Check Calls',
    required: false,
    body: 'Carrier must accept tracking and provide check calls at pickup, midday, and delivery.',
  },
  {
    id: 'cl-pod',
    title: 'POD Deadline',
    required: false,
    body: 'Signed POD required within 24 hours of delivery; late submission may delay payment.',
  },
  {
    id: 'cl-insurance',
    title: 'Cargo Insurance Requirement',
    required: false,
    body: 'Carrier must maintain minimum $100,000 cargo insurance for the duration of transport.',
  },
];

const custName = (id: string) => seedCustomers.find((c) => c.id === id)?.name ?? '';
const carrName = (id?: string) => seedCarriers.find((c) => c.id === id)?.name;

function mkLoad(l: Omit<Load, 'customerName' | 'carrierName' | 'customerRate'>): Load {
  const econ = computeEconomics(l.carrierCost, l.marginType, l.marginValue, l.miles);
  return {
    ...l,
    customerName: custName(l.customerId),
    carrierName: carrName(l.carrierId),
    customerRate: econ.customerRate,
  };
}

const REQUIRED_IDS = ['cl-detention', 'cl-tonu', 'cl-double-brokering'];

export const seedLoads: Load[] = [
  mkLoad({
    id: 'NG-1042',
    customerId: 'cus-1',
    originCity: 'Atlanta',
    originState: 'GA',
    originZip: '30336',
    destCity: 'Dallas',
    destState: 'TX',
    destZip: '75212',
    equipment: 'Dry Van',
    weightLbs: 42000,
    miles: 795,
    commodity: 'Printing paper (palletized)',
    pickupDate: '2026-07-09',
    deliveryDate: '2026-07-11',
    carrierId: 'car-1',
    carrierCost: 1700,
    marginType: 'percent',
    marginValue: 18,
    status: 'Booked',
    date: '2026-07-09',
    clauseIds: [...REQUIRED_IDS, 'cl-tracking', 'cl-pod'],
    freightChargeTerms: 'Prepaid',
  }),
  mkLoad({
    id: 'NG-1041',
    customerId: 'cus-3',
    originCity: 'Forest Park',
    originState: 'GA',
    originZip: '30297',
    destCity: 'Miami',
    destState: 'FL',
    destZip: '33178',
    equipment: 'Reefer',
    weightLbs: 38000,
    miles: 665,
    commodity: 'Refrigerated foods',
    pickupDate: '2026-07-05',
    deliveryDate: '2026-07-07',
    carrierId: 'car-2',
    carrierCost: 1950,
    marginType: 'flat',
    marginValue: 350,
    status: 'Delivered',
    date: '2026-07-07',
    clauseIds: [...REQUIRED_IDS, 'cl-tracking', 'cl-pod', 'cl-insurance'],
    freightChargeTerms: 'Prepaid',
  }),
  mkLoad({
    id: 'NG-1040',
    customerId: 'cus-2',
    originCity: 'Atlanta',
    originState: 'GA',
    originZip: '30318',
    destCity: 'Charlotte',
    destState: 'NC',
    destZip: '28208',
    equipment: 'Flatbed',
    weightLbs: 44000,
    miles: 245,
    commodity: 'Fabricated steel',
    pickupDate: '2026-07-12',
    deliveryDate: '2026-07-13',
    carrierId: 'car-3',
    carrierCost: 850,
    marginType: 'percent',
    marginValue: 20,
    status: 'Quoted',
    date: '2026-07-10',
    clauseIds: [...REQUIRED_IDS],
    freightChargeTerms: 'Prepaid',
  }),
  mkLoad({
    id: 'NG-1039',
    customerId: 'cus-1',
    originCity: 'Marietta',
    originState: 'GA',
    originZip: '30060',
    destCity: 'Nashville',
    destState: 'TN',
    destZip: '37210',
    equipment: 'Dry Van',
    weightLbs: 40000,
    miles: 250,
    commodity: 'Printing paper (palletized)',
    pickupDate: '2026-07-01',
    deliveryDate: '2026-07-03',
    carrierId: 'car-1',
    carrierCost: 700,
    marginType: 'percent',
    marginValue: 15,
    status: 'Delivered',
    date: '2026-07-03',
    clauseIds: [...REQUIRED_IDS, 'cl-pod'],
    freightChargeTerms: 'Prepaid',
  }),
];
