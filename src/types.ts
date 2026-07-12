export type MarginType = 'flat' | 'percent';

export type LoadStatus = 'Quoted' | 'Booked' | 'Delivered';

export type FreightChargeTerms = 'Prepaid' | 'Collect' | 'Third-Party';

export const EQUIPMENT_OPTIONS = [
  'Van',
  'Reefer',
  'Flatbed',
  'Step Deck',
  'Power Only',
  'Other',
] as const;

export interface Company {
  name: string;
  mc: string;
  address: string;
  phone: string;
  email: string;
  paymentTerms: string;
  logoBadge: string;
}

export interface Customer {
  id: string;
  name: string;
  city: string;
  state: string;
  contact: string;
  phone: string;
}

export interface Carrier {
  id: string;
  name: string;
  mc: string;
  dispatchPhone: string;
}

export interface Clause {
  id: string;
  title: string;
  body: string;
  required: boolean;
}

export interface Load {
  id: string;
  customerId: string;
  customerName: string;
  originCity: string;
  originState: string;
  originZip?: string;
  destCity: string;
  destState: string;
  destZip?: string;
  equipment: string;
  weightLbs: number;
  miles: number;
  commodity?: string;
  pickupDate?: string;
  deliveryDate?: string;
  carrierId?: string;
  carrierName?: string;
  carrierCost: number;
  marginType: MarginType;
  marginValue: number;
  customerRate: number;
  status: LoadStatus;
  date: string;
  clauseIds: string[];
  freightChargeTerms?: FreightChargeTerms;
}
