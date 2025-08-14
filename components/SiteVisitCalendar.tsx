
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
    <div className="p-4 sm:p-6 lg:p-8 text-black bg-white h-full flex flex-col">
      <div className="flex-shrink-0 flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Site Visit Calendar</h2>
        <button onClick={handleAddClick} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Add Site Visit
        </button>
      </div>

      <div className="flex-grow overflow-hidden border border-black rounded-lg">
        <div className="h-full overflow-auto">
            {siteVisits.length > 0 ? (
            <table className="min-w-full divide-y divide-black">
                <thead className="bg-gray-50 border-b border-black sticky top-0">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Location</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Visit Date & Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Client Phone</th>
                    <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                    </th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {siteVisits.map((visit) => (
                    <tr key={visit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">{visit.clientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{visit.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {formatDate(visit.date)} at {formatTime(visit.time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{visit.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEditClick(visit)} className="text-black hover:text-gray-700 font-bold">
                        Edit
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            ) : (
            <div className="text-center py-16 px-6 h-full flex flex-col justify-center items-center">
                <CalendarIcon className="mx-auto h-12 w-12 text-black" />
                <h3 className="mt-2 text-lg font-medium text-black">No site visits scheduled</h3>
                <p className="mt-1 text-sm text-black">Add a new site visit to get started.</p>
            </div>
            )}
        </div>
      </div>
      <footer className="flex-shrink-0 text-center text-xs text-black pt-4">
        <p>Powered by Amaz</p>
      </footer>

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
