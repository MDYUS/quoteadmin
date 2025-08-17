
import React, { useState, useMemo } from 'react';
import { Lead } from '../types';
import { DatabaseIcon } from './icons';
import StatusBadge from './StatusBadge';
import { formatStatus } from '../utils';

interface LeadHistoryProps {
  leads: Lead[];
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const LeadHistory: React.FC<LeadHistoryProps> = ({ leads }) => {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);

  const availableYears = useMemo(() => {
    const years = new Set(leads.map(lead => lead.createdAt ? new Date(lead.createdAt).getFullYear() : null).filter((y): y is number => y !== null));
    if (!years.has(new Date().getFullYear())) {
        years.add(new Date().getFullYear());
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      if (!lead.createdAt) return false;
      const leadDate = new Date(lead.createdAt);
      return leadDate.getFullYear() === selectedYear && (leadDate.getMonth() + 1) === selectedMonth;
    });
  }, [leads, selectedYear, selectedMonth]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-black bg-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <h2 className="text-2xl font-bold">Lead History & Analytics</h2>
        <p className="text-gray-600">Review leads from previous months.</p>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="year-select" className="font-medium text-sm text-gray-700">Year:</label>
          <select id="year-select" value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500">
            {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="month-select" className="font-medium text-sm text-gray-700">Month:</label>
          <select id="month-select" value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} className="p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500">
            {MONTHS.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}
          </select>
        </div>
        <div className="sm:ml-auto text-center sm:text-right">
            <p className="font-bold text-xl text-black">{filteredLeads.length} Leads</p>
            <p className="text-sm text-gray-700">in {MONTHS[selectedMonth - 1]} {selectedYear}</p>
        </div>
      </div>

      {/* Table */}
      <div className="flex-grow overflow-hidden bg-white shadow-sm sm:rounded-lg border border-gray-200">
        <div className="h-full overflow-auto">
          {filteredLeads.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Phone</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Added On</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-black">{lead.name}</div>
                      <div className="text-sm text-gray-600">{lead.scope || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{lead.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={lead.status} /></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-16 px-6 h-full flex flex-col justify-center items-center">
              <DatabaseIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-black">No leads found</h3>
              <p className="mt-1 text-sm text-gray-600">There are no leads recorded for {MONTHS[selectedMonth - 1]} {selectedYear}.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadHistory;
