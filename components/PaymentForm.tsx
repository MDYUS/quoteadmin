import React, { useState, useEffect } from 'react';
import { Payment, PaymentType, PaymentStatus } from '../types';
import { XIcon, TrashIcon } from './icons';
import { formatStatus } from '../utils';

interface PaymentFormProps {
  payment: Payment | null;
  onSave: (payment: Payment) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ payment, onSave, onCancel, onDelete }) => {
  const [paymentType, setPaymentType] = useState<PaymentType>(PaymentType.WeeklyBudget);
  const [amount, setAmount] = useState<number>(0);
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.Pending);
  const [paidOn, setPaidOn] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setPaymentType(payment?.paymentType || PaymentType.WeeklyBudget);
    setAmount(payment?.amount || 0);
    setDueDate(payment?.dueDate || new Date().toISOString().split('T')[0]);
    setStatus(payment?.status || PaymentStatus.Pending);
    setPaidOn(payment?.paidOn || null);
    setDescription(payment?.description || '');
    setErrors({});
  }, [payment]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!description.trim()) newErrors.description = 'Description is required.';
    if (amount <= 0) newErrors.amount = 'Amount must be a positive number.';
    if (!dueDate) newErrors.dueDate = 'Due date is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const newPayment: Payment = {
      id: payment ? payment.id : Date.now().toString(),
      paymentType,
      amount,
      dueDate,
      status,
      paidOn: status === PaymentStatus.Paid ? (paidOn || new Date().toISOString().split('T')[0]) : null,
      description,
    };
    onSave(newPayment);
  };

  const handleDelete = () => {
    if (payment && window.confirm('Are you sure you want to delete this payment record?')) {
      onDelete(payment.id);
    }
  };

  const inputClass = "mt-1 block w-full border border-neutral-300 rounded-lg shadow-sm p-3 focus:ring-primary-500 focus:border-primary-500 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400";
  const errorInputClass = `${inputClass} border-red-500`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
        <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-neutral-900">{payment ? 'Edit Payment' : 'Add New Payment'}</h3>
          <button onClick={onCancel} className="text-neutral-400 hover:text-neutral-600"><XIcon /></button>
        </div>
        
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-neutral-700">Description</label>
            <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} className={errors.description ? errorInputClass : inputClass} />
            {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="paymentType" className="block text-sm font-medium text-neutral-700">Payment Type</label>
              <select id="paymentType" value={paymentType} onChange={e => setPaymentType(e.target.value as PaymentType)} className={inputClass}>
                {Object.values(PaymentType).map(type => (
                  <option key={type} value={type}>{formatStatus(type)}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-neutral-700">Amount (INR)</label>
              <input type="number" id="amount" value={amount} onChange={e => setAmount(Number(e.target.value))} className={errors.amount ? errorInputClass : inputClass} />
              {errors.amount && <p className="text-red-600 text-xs mt-1">{errors.amount}</p>}
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-neutral-700">Due Date</label>
              <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} className={errors.dueDate ? errorInputClass : inputClass} />
              {errors.dueDate && <p className="text-red-600 text-xs mt-1">{errors.dueDate}</p>}
            </div>
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-neutral-700">Status</label>
                <select id="status" value={status} onChange={e => setStatus(e.target.value as PaymentStatus)} className={inputClass}>
                    <option value={PaymentStatus.Pending}>Pending</option>
                    <option value={PaymentStatus.Paid}>Paid</option>
                </select>
            </div>
             {status === PaymentStatus.Paid && (
                <div>
                    <label htmlFor="paidOn" className="block text-sm font-medium text-neutral-700">Paid On</label>
                    <input type="date" id="paidOn" value={paidOn || ''} onChange={e => setPaidOn(e.target.value)} className={inputClass} />
                </div>
             )}
          </div>
        </div>

        <div className="px-6 py-4 bg-neutral-50 rounded-b-xl flex justify-between items-center">
          <div>
            {payment && (
              <button onClick={handleDelete} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-medium">
                <TrashIcon /> Delete
              </button>
            )}
          </div>
          <div className="flex space-x-3">
            <button onClick={onCancel} className="px-4 py-2 bg-white border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50">Cancel</button>
            <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white border border-transparent rounded-lg text-sm font-medium hover:bg-primary-700">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
