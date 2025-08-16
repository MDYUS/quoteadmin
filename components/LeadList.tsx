import React from 'react';
import { Lead, LeadStatus } from '../types';
import StatusBadge from './StatusBadge';
import { PlusIcon, FileIcon } from './icons';
import { STATUS_OPTIONS } from '../constants';

interface LeadListProps {
  leads: Lead[];
  onAdd: () => void;
  onEdit: (lead: Lead) => void;
  onLeadStatusChange: (leadId: string, newStatus: LeadStatus) => void;
}

const isNew = (createdAt: string | undefined): boolean => {
  if (!createdAt) return false;
  const leadDate = new Date(createdAt);
  const now = new Date();
  const oneDay = 24 * 60 * 60 * 1000;
  return (now.getTime() - leadDate.getTime()) < oneDay;
};

const KanbanCard: React.FC<{lead: Lead, onEdit: (lead: Lead) => void}> = ({ lead, onEdit }) => {
    return (
        <div 
            onClick={() => onEdit(lead)}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md hover:border-blue-500 transition-all duration-200"
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('leadId', lead.id);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onEdit(lead)}
            aria-label={`View details for ${lead.name}`}
        >
            {isNew(lead.createdAt) && (
                <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-0.5 rounded-full mb-2 inline-block">
                  New
                </span>
              )}
            <h4 className="font-bold text-gray-800">{lead.name}</h4>
            <p className="text-sm text-gray-600">{lead.phone}</p>
            {lead.createdAt && (
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(lead.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </p>
            )}
        </div>
    );
};

const KanbanColumn: React.FC<{
    status: LeadStatus;
    leads: Lead[];
    onEdit: (lead: Lead) => void;
    onLeadStatusChange: (leadId: string, newStatus: LeadStatus) => void;
}> = ({ status, leads, onEdit, onLeadStatusChange }) => {
    
    const [isOver, setIsOver] = React.useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        setIsOver(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsOver(false);
        const leadId = e.dataTransfer.getData('leadId');
        if (leadId) {
            onLeadStatusChange(leadId, status);
        }
    };
    
    const statusColors: Record<LeadStatus, string> = {
      [LeadStatus.RecentlyAdded]: 'border-gray-500',
      [LeadStatus.Contacted]: 'border-blue-500',
      [LeadStatus.FollowUp]: 'border-yellow-500',
      [LeadStatus.SiteVisit]: 'border-purple-500',
      [LeadStatus.Booked]: 'border-green-500',
    };

    return (
        <div 
            className={`w-72 flex-shrink-0 bg-gray-50 rounded-xl p-3 transition-colors duration-300 ${isOver ? 'bg-blue-100' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className={`px-2 py-1 mb-3 border-l-4 ${statusColors[status]}`}>
              <h3 className="font-bold text-gray-800">{status} <span className="text-sm font-normal text-gray-500">{leads.length}</span></h3>
            </div>
            <div className="space-y-3 h-full overflow-y-auto">
                {leads.map(lead => (
                    <KanbanCard key={lead.id} lead={lead} onEdit={onEdit} />
                ))}
            </div>
        </div>
    );
};

const LeadList: React.FC<LeadListProps> = ({ leads, onAdd, onEdit, onLeadStatusChange }) => {
  return (
    <div className="flex h-full flex-col bg-gray-100">
        {leads.length > 0 ? (
             <div className="flex-grow flex p-4 space-x-4 overflow-x-auto">
                {STATUS_OPTIONS.map(status => (
                    <KanbanColumn
                        key={status}
                        status={status}
                        leads={leads.filter(l => l.status === status)}
                        onEdit={onEdit}
                        onLeadStatusChange={onLeadStatusChange}
                    />
                ))}
            </div>
        ) : (
             <div className="flex-grow flex items-center justify-center">
                <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm border border-gray-200">
                    <FileIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No leads yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by adding a new lead.</p>
                    <div className="mt-6">
                        <button onClick={onAdd} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                        Add Lead
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default LeadList;