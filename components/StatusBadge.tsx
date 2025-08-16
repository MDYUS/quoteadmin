import React from 'react';
import { LeadStatus } from '../types';

interface StatusBadgeProps {
  status: LeadStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusColors: Record<LeadStatus, string> = {
    [LeadStatus.Contacted]: 'bg-blue-100 text-blue-800',
    [LeadStatus.FollowUp]: 'bg-yellow-100 text-yellow-800',
    [LeadStatus.SiteVisit]: 'bg-purple-100 text-purple-800',
    [LeadStatus.Booked]: 'bg-green-100 text-green-800',
  };

  return (
    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;