import React from 'react';
import { Lead } from '../types';
import StatusBadge from './StatusBadge';
import { PlusIcon, FileIcon } from './icons';

interface LeadListProps {
  leads: Lead[];
  onAdd: () => void;
  onEdit: (lead: Lead) => void;
}

const LeadList: React.FC<LeadListProps> = ({ leads, onAdd, onEdit }) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {leads.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {leads.map((lead) => (
            <div 
              key={lead.id} 
              onClick={() => onEdit(lead)} 
              className="bg-white rounded-lg shadow-md hover:shadow-xl cursor-pointer transition-shadow duration-300 flex flex-col justify-between border border-black"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onEdit(lead)}
              aria-label={`View details for ${lead.name}`}
            >
              <div className="p-5">
                <h3 className="text-lg font-bold text-black truncate">{lead.name}</h3>
                <p className="text-sm text-black mt-1">{lead.phone}</p>
              </div>
              <div className="px-5 py-3 bg-white rounded-b-lg border-t border-black">
                <StatusBadge status={lead.status} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-lg shadow-md border border-black">
          <FileIcon className="mx-auto h-12 w-12 text-black" />
          <h3 className="mt-2 text-lg font-medium text-black">No leads yet</h3>
          <p className="mt-1 text-sm text-black">Get started by adding a new lead.</p>
          <div className="mt-6">
            <button onClick={onAdd} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
              Add Lead
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadList;