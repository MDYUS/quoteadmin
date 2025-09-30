import React from 'react';
import { XIcon, WarningIcon } from './icons';

interface PaymentOverduePopupProps {
  onAcknowledge: (duration: 'today' | 'tomorrow') => void;
}

const PaymentOverduePopup: React.FC<PaymentOverduePopupProps> = ({ onAcknowledge }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[200] flex justify-center items-center p-4" role="alertdialog" aria-modal="true" aria-labelledby="payment-due-title">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform border-4 border-transparent animate-pop-in animate-pulse-red-border-strong">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center gap-3 bg-red-50 rounded-t-xl">
          <WarningIcon className="h-8 w-8 text-red-500" />
          <h3 id="payment-due-title" className="text-xl font-semibold text-red-900">Payment Required</h3>
        </div>
        <div className="p-6">
          <p className="text-neutral-700 mb-4 text-center">
            To serve you best we follow timely payment, so please pay the monthly charge.
          </p>
        </div>
        <div className="px-6 py-4 bg-neutral-50 rounded-b-xl flex flex-col sm:flex-row justify-center items-center gap-3">
          <button 
            onClick={() => onAcknowledge('tomorrow')} 
            className="w-full sm:w-auto px-5 py-2 bg-white text-primary-700 border border-primary-300 rounded-lg text-sm font-medium hover:bg-primary-50 transition-colors"
          >
            I'll Pay Tomorrow
          </button>
          <button 
            onClick={() => onAcknowledge('today')} 
            className="w-full sm:w-auto px-5 py-2 bg-primary-600 text-white border border-transparent rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
          >
            I'll Pay Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentOverduePopup;
