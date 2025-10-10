import React from 'react';
import { Invoice } from '../types';
import { PlusIcon, DocumentTextIcon } from './icons';

interface InvoiceHistoryPageProps {
  invoices: Invoice[];
  onEdit: (invoice: Invoice) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  currentUserId: string | null;
}

const InvoiceHistoryPage: React.FC<InvoiceHistoryPageProps> = ({ invoices, onEdit, onDelete, onAddNew, currentUserId }) => {

  const formatCurrency = (amount: number) => {
    if (isNaN(amount)) return '0.00';
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const calculateTotal = (items: Invoice['items']) => {
    return items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-neutral-900 bg-neutral-100 h-full flex flex-col">
      <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <div>
            <h2 className="text-2xl font-bold">Invoice History</h2>
            <p className="text-neutral-500 text-sm mt-1">Manage all your created invoices.</p>
        </div>
        <button onClick={onAddNew} className="inline-flex items-center justify-center sm:justify-start px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700">
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Create New Invoice
        </button>
      </div>

      <div className="flex-grow overflow-auto">
        {invoices.length > 0 ? (
          <div className="bg-white shadow-sm sm:rounded-lg border border-neutral-200 overflow-hidden">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Invoice #</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Customer</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-700">{invoice.invoiceNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">{invoice.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{formatDate(invoice.invoiceDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-neutral-900">₹{formatCurrency(calculateTotal(invoice.items))}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                      <button onClick={() => onEdit(invoice)} className="text-primary-600 hover:text-primary-800 font-semibold">
                        Edit
                      </button>
                      {currentUserId === '786786' && (
                        <button onClick={() => window.confirm('Are you sure?') && onDelete(invoice.id)} className="text-red-600 hover:text-red-800 font-semibold">
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 px-6 h-full flex flex-col justify-center items-center border-2 border-dashed border-neutral-300 rounded-lg bg-white">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-2 text-lg font-medium text-neutral-900">No invoices found</h3>
            <p className="mt-1 text-sm text-neutral-500">Get started by creating a new invoice.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceHistoryPage;