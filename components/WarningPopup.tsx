import React from 'react';
import { Lead } from '../types';
import { XIcon, WarningIcon } from './icons';

interface WarningPopupProps {
  leads: Lead[];
  onClose: () => void;
}

const WarningPopup: React.FC<WarningPopupProps> = ({ leads, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex justify-center items-center p-4" role="alertdialog" aria-modal="true" aria-labelledby="warning-title">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform border-4 border-transparent animate-pop-in animate-pulse-red-border-strong">
        <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center bg-yellow-50 rounded-t-xl">
          <div className="flex items-center gap-3">
            <WarningIcon className="h-8 w-8 text-yellow-500" />
            <h3 id="warning-title" className="text-xl font-semibold text-yellow-900">Action Required</h3>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-700 transition-colors" aria-label="Close">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-neutral-700 mb-4">
            Attention! The following leads have been in 'Recently Added' for over 2 hours. Please contact them soon to avoid losing potential customers.
          </p>
          <div className="max-h-40 overflow-y-auto bg-neutral-50 border border-neutral-200 rounded-lg p-3 space-y-2">
            {leads.map(lead => (
              <div key={lead.id} className="text-sm font-medium text-neutral-800">{lead.name}</div>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 bg-neutral-50 rounded-b-xl flex justify-end items-center">
          <button onClick={onClose} className="px-5 py-2 bg-primary-600 text-white border border-transparent rounded-lg text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningPopup;
