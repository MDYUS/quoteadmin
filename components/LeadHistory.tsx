import React, { useState, useMemo } from 'react';
import { Lead } from '../types';
import { DatabaseIcon, DownloadIcon } from './icons';
import StatusBadge from './StatusBadge';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LOGO_URL } from '../constants';
import { imageUrlToBase64 } from '../utils';

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
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const availableYears = useMemo(() => {
    const years = new Set(leads.map(lead => lead.createdAt ? new Date(lead.createdAt).getFullYear() : null).filter((y): y is number => y !== null));
    if (!years.has(new Date().getFullYear())) {
        years.add(new Date().getFullYear());
    }
    // FIX: Add explicit number types to the sort callback parameters to ensure correct type inference.
    return Array.from(years).sort((a: number, b: number) => b - a);
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      if (!lead.createdAt) return false;
      const leadDate = new Date(lead.createdAt);
      // Note: The month from `getMonth()` is 0-indexed (0-11), while `selectedMonth` is 1-indexed (1-12).
      // We adjust the month from the lead's date by adding 1 for a correct comparison.
      return leadDate.getFullYear() === selectedYear && (leadDate.getMonth() + 1) === selectedMonth;
    });
  }, [leads, selectedYear, selectedMonth]);

  const handleGeneratePDF = async () => {
    if (filteredLeads.length === 0) return;
    setIsDownloading(true);

    try {
      const doc = new jsPDF();
      const logoBase64 = await imageUrlToBase64(LOGO_URL);
      const monthName = MONTHS[selectedMonth - 1];
      const year = selectedYear;
      const totalLeads = filteredLeads.length;

      const addLogo = () => {
          const imgWidth = 300;
          const imgHeight = 300;
          const aspectRatio = imgWidth / imgHeight;

          const logoWidth = 30;
          const logoHeight = logoWidth / aspectRatio;
          
          const yPos = 15;
          doc.addImage(logoBase64, 14, yPos, logoWidth, logoHeight);
          return yPos + logoHeight + 5; // new y position
      };

      let yPos = addLogo();

      // Title
      doc.setFontSize(18);
      doc.text(`Lead Report: ${monthName} ${year}`, 14, yPos);
      yPos += 8;

      // Subtitle
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Total Leads This Month: ${totalLeads}`, 14, yPos);
      yPos += 10;

      // Table (Status column removed)
      const head = [['S.No', 'Name', 'Phone', 'Scope', 'Added On']];
      const body = filteredLeads.map((lead, index) => [
        index + 1,
        lead.name,
        lead.phone,
        lead.scope || 'N/A',
        lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-GB') : 'N/A'
      ]);

      autoTable(doc, {
        startY: yPos,
        head: head,
        body: body,
        theme: 'grid',
        headStyles: { fillColor: [30, 58, 138] }, // primary-900 color
        styles: { fontSize: 9 },
        columnStyles: { 0: { cellWidth: 10 } },
      });

      doc.save(`Lead_Report_${monthName}_${year}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Could not generate PDF. An unexpected error occurred.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-neutral-900 bg-neutral-100 h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-6">
        <h2 className="text-2xl font-bold">Lead History & Analytics</h2>
        <p className="text-neutral-600 text-sm mt-1">Review leads from previous months.</p>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 mb-6 bg-white p-4 rounded-lg shadow-sm border border-neutral-200 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="year-select" className="font-medium text-sm text-neutral-700">Year:</label>
          <select id="year-select" value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="p-2 border border-neutral-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500">
            {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="month-select" className="font-medium text-sm text-neutral-700">Month:</label>
          <select id="month-select" value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} className="p-2 border border-neutral-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500">
            {MONTHS.map((month, index) => <option key={month} value={index + 1}>{month}</option>)}
          </select>
        </div>
        <div className="sm:ml-auto flex flex-col sm:flex-row items-center gap-4">
            <div className="text-center sm:text-right">
                <p className="font-bold text-xl text-neutral-800">{filteredLeads.length} Leads</p>
                <p className="text-sm text-neutral-700">in {MONTHS[selectedMonth - 1]} {selectedYear}</p>
            </div>
            <button
                onClick={handleGeneratePDF}
                disabled={isDownloading || filteredLeads.length === 0}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 disabled:cursor-not-allowed transition-colors"
              >
                <DownloadIcon className="h-5 w-5 mr-2" />
                {isDownloading ? 'Downloading...' : 'Download PDF'}
            </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-grow overflow-auto">
        {filteredLeads.length > 0 ? (
          <div>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {filteredLeads.map(lead => (
                <div key={lead.id} className="bg-white p-4 rounded-lg shadow border border-neutral-200">
                  <div className="flex justify-between items-start">
                    <div>
                       <p className="font-bold text-neutral-800">{lead.name}</p>
                       <p className="text-sm text-neutral-600">{lead.phone}</p>
                    </div>
                    <StatusBadge status={lead.status} />
                  </div>
                  <div className="mt-3 border-t border-neutral-200 pt-3 text-sm flex justify-between">
                      <span className="text-neutral-500">Added on:</span>
                      <span className="font-medium text-neutral-700">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-GB') : 'N/A'}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white shadow-sm sm:rounded-lg border border-neutral-200 overflow-hidden">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Phone</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">Added On</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {filteredLeads.map(lead => (
                      <tr key={lead.id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900">{lead.name}</div>
                          <div className="text-sm text-neutral-600">{lead.scope || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">{lead.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={lead.status} /></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-800">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('en-GB') : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 px-6 h-full flex flex-col justify-center items-center bg-white rounded-lg border-2 border-dashed border-neutral-300">
            <DatabaseIcon className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-2 text-lg font-medium text-neutral-900">No leads found</h3>
            <p className="mt-1 text-sm text-neutral-600">There are no leads recorded for {MONTHS[selectedMonth - 1]} {selectedYear}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadHistory;