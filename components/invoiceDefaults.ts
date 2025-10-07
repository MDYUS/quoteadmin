import { Invoice } from '../types';

export const defaultInvoiceData: Invoice = {
  id: '',
  // The unique invoice number is now generated in the InvoicePage component
  // to ensure it's different for each new invoice.
  invoiceNumber: '',
  invoiceDate: new Date().toISOString().split('T')[0],
  customerName: 'CUSTOMER NAME',
  customerPhone: 'PHONE NUMBER',
  items: [
    { id: 'item-1', description: 'HOME INTERIOR ADVANCE', qty: '1 PAC', amount: 0 },
  ],
};
