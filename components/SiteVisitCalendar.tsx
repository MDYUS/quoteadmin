
import React, { useState } from 'react';
import { useSiteVisits } from '../hooks/useSiteVisits';
import SiteVisitForm from './SiteVisitForm';
import { SiteVisit } from '../types';
import { PlusIcon, CalendarIcon } from './icons';

interface SiteVisitCalendarProps {
  setSuccessMessage: (message: string) => void;
  setErrorMessage: (message: string) => void;
}

const SiteVisitCalendar: React.FC<SiteVisitCalendarProps> = ({ setSuccessMessage, setErrorMessage }) => {
  const { siteVisits, addVisit, updateVisit, deleteVisit } = useSiteVisits();
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
      const [hour, minute] = timeString.split(':');
      const h = parseInt(hour, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const formattedHour = h % 12 === 0 ? 12 : h % 12;
      return `${formattedHour}:${minute} ${ampm}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-gray-900 bg-gray-100 h-full flex flex-col">
      <div className="flex-shrink-0 flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Site Visit Calendar</h2>
        <button onClick={handleAddClick} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Add Site Visit
        </button>
      </div>

      <div className="flex-grow overflow-hidden bg-white shadow-sm sm:rounded-lg border border-gray-200">
        <div className="h-full overflow-auto">
            {siteVisits.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visit Date & Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Phone</th>
                    <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {siteVisits.map((visit) => (
                    <tr key={visit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{visit.clientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{visit.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(visit.date)} at {formatTime(visit.time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{visit.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEditClick(visit)} className="text-blue-600 hover:text-blue-800 font-semibold">
                        Edit
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            ) : (
            <div className="text-center py-16 px-6 h-full flex flex-col justify-center items-center">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No site visits scheduled</h3>
                <p className="mt-1 text-sm text-gray-500">Add a new site visit to get started.</p>
            </div>
            )}
        </div>
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