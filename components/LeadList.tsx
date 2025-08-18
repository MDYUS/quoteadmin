import React from 'react';
import { Lead, LeadStatus } from '../types';
import StatusBadge from './StatusBadge';
import { PlusIcon, FileIcon, PhoneIcon } from './icons';
import { STATUS_OPTIONS } from '../constants';
import { formatStatus } from '../utils';

interface LeadListProps {
  leads: Lead[];
  onAdd: () => void;
  onEdit: (lead: Lead) => void;
  onLeadStatusChange: (leadId: string, newStatus: LeadStatus) => void;
}

const KanbanCard: React.FC<{lead: Lead, onEdit: (lead: Lead) => void}> = ({ lead, onEdit }) => {
    const isRecentlyAdded = lead.status === LeadStatus.RecentlyAdded;

    const cardClasses = [
        "bg-white p-4 rounded-lg shadow border cursor-pointer hover:shadow-lg transition-all duration-200 group",
        isRecentlyAdded 
            ? 'border-red-400 animate-pulse-red-border' 
            : 'border-neutral-200 hover:border-primary-500'
    ].join(' ');

    return (
        <div 
            onClick={() => onEdit(lead)}
            className={cardClasses}
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('leadId', lead.id);
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onEdit(lead)}
            aria-label={`View details for ${lead.name}`}
        >
            <h4 className="font-bold text-neutral-800 text-md truncate">{lead.name}</h4>
            
            <p className="text-sm text-neutral-500 flex items-center gap-2 mt-2">
                <PhoneIcon className="w-4 h-4 text-neutral-400" />
                {lead.phone}
            </p>

            <div className="mt-4 flex justify-between items-center">
                <StatusBadge status={lead.status} />
                {lead.createdAt && (
                    <p className="text-xs text-neutral-400">
                      {new Date(lead.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </p>
                )}
            </div>
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
      [LeadStatus.RecentlyAdded]: 'border-red-500 bg-red-50',
      [LeadStatus.Contacted]: 'border-blue-500 bg-blue-50',
      [LeadStatus.FollowUp]: 'border-yellow-500 bg-yellow-50',
      [LeadStatus.SiteVisit]: 'border-purple-500 bg-purple-50',
      [LeadStatus.Booked]: 'border-green-500 bg-green-50',
    };

    return (
        <div 
            className={`w-80 flex-shrink-0`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className={`h-full bg-neutral-100/70 rounded-xl flex flex-col transition-colors duration-300 ${isOver ? 'bg-primary-100' : ''}`}>
                <div className={`p-4 mb-2 border-t-4 rounded-t-xl ${statusColors[status]}`}>
                  <h3 className="font-bold text-neutral-800 flex justify-between items-center">
                    {formatStatus(status)} 
                    <span className="text-sm font-semibold text-neutral-500 bg-neutral-200 rounded-full px-2 py-0.5">{leads.length}</span>
                  </h3>
                </div>
                <div className="space-y-3 p-4 pt-0 h-full overflow-y-auto">
                    {leads.map(lead => (
                        <KanbanCard key={lead.id} lead={lead} onEdit={onEdit} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const LeadList: React.FC<LeadListProps> = ({ leads, onAdd, onEdit, onLeadStatusChange }) => {
  return (
    <div className="flex h-full flex-col bg-neutral-100">
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
             <div className="flex-grow flex items-center justify-center p-4">
                <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm border border-neutral-200 max-w-md">
                    <FileIcon className="mx-auto h-12 w-12 text-neutral-400" />
                    <h3 className="mt-2 text-lg font-medium text-neutral-900">No leads yet</h3>
                    <p className="mt-1 text-sm text-neutral-500">Get started by adding a new lead.</p>
                    <div className="mt-6">
                        <button onClick={onAdd} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
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