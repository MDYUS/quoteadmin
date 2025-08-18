

import React, { useState } from 'react';
import SiteVisitForm from './SiteVisitForm';
import { SiteVisit } from '../types';
import { PlusIcon, CalendarIcon, LocationMarkerIcon, PhoneIcon } from './icons';

interface SiteVisitCalendarProps {
  siteVisits: SiteVisit[];
  addVisit: (visit: SiteVisit) => Promise<void>;
  updateVisit: (visit: SiteVisit) => Promise<void>;
  deleteVisit: (id: string) => Promise<void>;
  setSuccessMessage: (message: string) => void;
  setErrorMessage: (message: string) => void;
}

const SiteVisitCalendar: React.FC<SiteVisitCalendarProps> = ({ 
  siteVisits, 
  addVisit, 
  updateVisit, 
  deleteVisit, 
  setSuccessMessage, 
  setErrorMessage 
}) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingVisit, setEditingVisit] = useState<SiteVisit | null>(null);

  const handleAddClick = () => {
    setEditingVisit(null);
    setIsFormVisible(true);
  };

  const handleEditClick = (visit: SiteVisit) => {
    setEditingVisit(visit);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingVisit(null);
  };

  const handleSave = async (visit: SiteVisit) => {
    try {
      if (editingVisit) {
        await updateVisit(visit);
        setSuccessMessage('Site visit updated successfully!');
      } else {
        await addVisit(visit);
        setSuccessMessage('Site visit added successfully!');
      }
      setIsFormVisible(false);
      setEditingVisit(null);
    } catch (error: any) {
      setErrorMessage(`Failed to save site visit: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteVisit(id);
      setSuccessMessage('Site visit deleted successfully.');
      setIsFormVisible(false);
      setEditingVisit(null);
    } catch (error: any) {
      setErrorMessage(`Failed to delete site visit: ${error.message}`);
    }
  };
  
  const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
      });
  };
  
  const formatTime = (timeString: string) => {
      if (!timeString) return 'N/A';
      const [hour, minute] = timeString.split(':');
      const h = parseInt(hour, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formattedHour = h % 12 === 0 ? 12 : h % 12;
      return `${formattedHour}:${minute} ${ampm}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-neutral-900 bg-neutral-100 h-full flex flex-col">
      <div className="flex-shrink-0 flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <div>
            <h2 className="text-2xl font-bold">Site Visit Calendar</h2>
            <p className="text-neutral-500 text-sm mt-1">Manage all upcoming client meetings and site visits.</p>
        </div>
        <button onClick={handleAddClick} className="inline-flex items-center justify-center sm:justify-start px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Add Site Visit
        </button>
      </div>

      <div className="flex-grow overflow-auto">
        {siteVisits.length > 0 ? (
          <div className="space-y-4">
            {/* Mobile/Tablet Card View */}
            <div className="md:hidden space-y-4">
              {siteVisits.map((visit) => (
                <div key={visit.id} className="bg-white p-4 rounded-lg shadow border border-neutral-200" onClick={() => handleEditClick(visit)}>
                  <div className="flex justify-between items-start">
                      <div>
                          <p className="font-bold text-neutral-800">{visit.clientName}</p>
                          <p className="text-sm font-semibold text-primary-600">{formatDate(visit.date)} at {formatTime(visit.time)}</p>
                      </div>
                  </div>
                  <div className="mt-3 border-t border-neutral-200 pt-3 text-sm space-y-2">
                     <p className="flex items-center gap-2 text-neutral-600"><LocationMarkerIcon className="w-4 h-4 text-neutral-400" /> {visit.location}</p>
                     <p className="flex items-center gap-2 text-neutral-600"><PhoneIcon className="w-4 h-4 text-neutral-400" /> {visit.phone}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white shadow-sm sm:rounded-lg border border-neutral-200 overflow-hidden">
                <table className="min-w-full divide-y divide-neutral-200">
                    <thead className="bg-neutral-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Location</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Visit Date & Time</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Client Phone</th>
                        <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-neutral-200">
                    {siteVisits.map((visit) => (
                        <tr key={visit.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">{visit.clientName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{visit.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                            {formatDate(visit.date)} at {formatTime(visit.time)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">{visit.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => handleEditClick(visit)} className="text-primary-600 hover:text-primary-800 font-semibold">
                            Edit
                            </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
          </div>
        ) : (
            <div className="text-center py-16 px-6 h-full flex flex-col justify-center items-center border-2 border-dashed border-neutral-300 rounded-lg bg-white">
                <CalendarIcon className="mx-auto h-12 w-12 text-neutral-400" />
                <h3 className="mt-2 text-lg font-medium text-neutral-900">No site visits scheduled</h3>
                <p className="mt-1 text-sm text-neutral-500">Add a new site visit to get started.</p>
            </div>
        )}
      </div>

      {isFormVisible && (
        <SiteVisitForm
          visit={editingVisit}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default SiteVisitCalendar;