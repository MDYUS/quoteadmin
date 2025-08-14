import React, { useState, useEffect } from 'react';
import { SiteVisit } from '../types';
import { XIcon, TrashIcon } from './icons';

interface SiteVisitFormProps {
  visit: SiteVisit | null;
  onSave: (visit: SiteVisit) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
}

const SiteVisitForm: React.FC<SiteVisitFormProps> = ({ visit, onSave, onCancel, onDelete }) => {
  const [clientName, setClientName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setClientName(visit?.clientName || '');
    setLocation(visit?.location || '');
    setDate(visit?.date || new Date().toISOString().split('T')[0]);
    setTime(visit?.time || '');
    setPhone(visit?.phone || '');
    setErrors({});
  }, [visit]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!clientName.trim()) newErrors.clientName = 'Client Name is required.';
    if (!location.trim()) newErrors.location = 'Location is required.';
    if (!date) newErrors.date = 'Date is required.';
    if (!time) newErrors.time = 'Time is required.';
    if (!phone.trim()) newErrors.phone = 'Phone number is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const newVisit: SiteVisit = {
      id: visit ? visit.id : Date.now().toString(),
      clientName,
      location,
      date,
      time,
      phone,
    };
    onSave(newVisit);
  };
  
  const handleDelete = () => {
    if (visit && onDelete && window.confirm('Are you sure you want to delete this site visit?')) {
        onDelete(visit.id);
    }
  }
  
  const inputClass = "mt-1 block w-full border border-black rounded-md shadow-sm p-2 focus:ring-black focus:border-black bg-white";
  const errorInputClass = `${inputClass} border-red-500 border-2`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg transform transition-all border-2 border-black">
        <div className="px-6 py-4 border-b-2 border-black flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold text-black">{visit ? 'Edit Site Visit' : 'Add New Site Visit'}</h3>
          <button onClick={onCancel} className="text-black hover:text-gray-700">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
            <div>
              <label htmlFor="clientName" className="block text-sm font-bold text-black">Client Name</label>
              <input type="text" id="clientName" value={clientName} onChange={e => setClientName(e.target.value)} className={errors.clientName ? errorInputClass : inputClass} />
              {errors.clientName && <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>}
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-bold text-black">Location (Address)</label>
              <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} className={errors.location ? errorInputClass : inputClass} />
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-bold text-black">Site Visit Date</label>
              <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className={errors.date ? errorInputClass : inputClass} />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-bold text-black">Site Visit Time</label>
              <input type="time" id="time" value={time} onChange={e => setTime(e.target.value)} className={errors.time ? errorInputClass : inputClass} />
              {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
            </div>
          </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-black">Client Phone Number</label>
              <input type="text" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className={errors.phone ? errorInputClass : inputClass} />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
        </div>
        <div className="px-6 py-4 bg-white rounded-b-lg flex justify-between items-center sticky bottom-0 border-t-2 border-black">
            <div>
                {visit && onDelete && (
                    <button onClick={handleDelete} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-medium">
                        <TrashIcon/> Delete Visit
                    </button>
                )}
            </div>
            <div className="flex space-x-3">
              <button onClick={onCancel} className="px-4 py-2 bg-white border border-black rounded-md text-sm font-medium text-black hover:bg-gray-100">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-black text-white border border-transparent rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">Save</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SiteVisitForm;
