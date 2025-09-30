import React, { useState } from 'react';
import { usePayments } from '../hooks/usePayments';
import PaymentForm from './PaymentForm';
import { Payment, PaymentStatus } from '../types';
import { PlusIcon, CreditCardIcon } from './icons';
import { formatStatus } from '../utils';

interface PaymentsPageProps {
  currentUserId: string | null;
  setSuccessMessage: (message: string) => void;
  setErrorMessage: (message: string) => void;
}

const PaymentsPage: React.FC<PaymentsPageProps> = ({ currentUserId, setSuccessMessage, setErrorMessage }) => {
  const { payments, addPayment, updatePayment, deletePayment } = usePayments();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);

  const isYusuf = currentUserId === '786786';
  const isAkka = currentUserId === '667733';
  
  const handleAddClick = () => {
    setEditingPayment(null);
    setIsFormVisible(true);
  };

  const handleEditClick = (payment: Payment) => {
    setEditingPayment(payment);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingPayment(null);
  };

  const handleSave = async (payment: Payment) => {
    try {
      if (editingPayment) {
        await updatePayment(payment);
        setSuccessMessage('Payment updated successfully!');
      } else {
        await addPayment(payment);
        setSuccessMessage('Payment added successfully!');
      }
      setIsFormVisible(false);
      setEditingPayment(null);
    } catch (error: any) {
      setErrorMessage(`Failed to save payment: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePayment(id);
      setSuccessMessage('Payment deleted successfully.');
      setIsFormVisible(false);
      setEditingPayment(null);
    } catch (error: any) {
      setErrorMessage(`Failed to delete payment: ${error.message}`);
    }
  };
  
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const StatusBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
    const isPending = status === PaymentStatus.Pending;
    const colorClasses = isPending ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
    return (
      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses}`}>
        {formatStatus(status)}
      </span>
    );
  };

  const getGPayUrl = (payment: Payment) => {
    const UPI_ID = 'yusuf-amaz@ybl'; // Placeholder UPI ID
    const PAYEE_NAME = 'Amaz Interior';
    const notes = encodeURIComponent(payment.description || 'Payment');
    return `gpay://upi/pay?pa=${UPI_ID}&pn=${PAYEE_NAME}&am=${payment.amount}&cu=INR&tn=${notes}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-neutral-900 bg-neutral-100 h-full flex flex-col">
      <div className="flex-shrink-0 flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Payments</h2>
        {isYusuf && (
            <button onClick={handleAddClick} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Add Payment
            </button>
        )}
      </div>

      <div className="flex-grow overflow-auto">
        {payments.length > 0 ? (
          <div className="bg-white shadow-sm sm:rounded-lg border border-neutral-200 overflow-hidden">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Due Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900">{payment.description}</div>
                      <div className="text-sm text-neutral-500">{formatStatus(payment.paymentType)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-800">{formatCurrency(payment.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{formatDate(payment.dueDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={payment.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {isYusuf && <button onClick={() => handleEditClick(payment)} className="text-primary-600 hover:text-primary-800 font-semibold">Edit</button>}
                      {isAkka && payment.status === PaymentStatus.Pending && (
                        <a href={getGPayUrl(payment)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                          Pay Now
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 px-6 h-full flex flex-col justify-center items-center border-2 border-dashed border-neutral-300 rounded-lg bg-white">
            <CreditCardIcon className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-2 text-lg font-medium text-neutral-900">No payments found</h3>
            {isYusuf && <p className="mt-1 text-sm text-neutral-500">Get started by adding a new payment record.</p>}
          </div>
        )}
      </div>

      {isFormVisible && isYusuf && (
        <PaymentForm
          payment={editingPayment}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default PaymentsPage;
