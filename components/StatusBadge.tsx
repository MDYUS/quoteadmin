import React from 'react';
import { LeadStatus } from '../types';

interface StatusBadgeProps {
  status: LeadStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border border-black text-black`}>
      {status}
    </span>
  );
};

export default StatusBadge;