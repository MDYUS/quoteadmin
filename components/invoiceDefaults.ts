import { Invoice } from '../types';

export const defaultInvoiceData: Invoice = {
  id: '',
  invoiceNumber: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
  invoiceDate: new Date().toISOString().split('T')[0],
  customerName: 'MR.RAVICHANDRAN',
  customerPhone: '8939602000',
  items: [
    { id: 'item-1', description: 'HOME INTERIOR ADVANCE', qty: '1 PAC', amount: 275000.00 },
  ],
};
