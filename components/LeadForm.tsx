
import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, FileInfo } from '../types';
import { STATUS_OPTIONS } from '../constants';
import { XIcon, TrashIcon, DownloadIcon, FileIcon } from './icons';

interface LeadFormProps {
  lead: Lead | null;
  onSave: (lead: Lead) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ lead, onSave, onCancel, onDelete }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState('');
  const [scope, setScope] = useState('');
  const [status, setStatus] = useState<LeadStatus>(LeadStatus.Contacted);
  const [details, setDetails] = useState('');
  const [floorPlan, setFloorPlan] = useState<FileInfo | null>(null);
  const [errors, setErrors] = useState<{ name?: string, phone?: string }>({});

  useEffect(() => {
    setName(lead?.name || '');
    setPhone(lead?.phone || '');
    setBudget(lead?.budget || '');
    setScope(lead?.scope || '');
    setStatus(lead?.status || LeadStatus.Contacted);
    setDetails(lead?.details || '');
    setFloorPlan(lead?.floorPlan || null);
    setErrors({});
  }, [lead]);

  const validate = () => {
    const newErrors: { name?: string, phone?: string } = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!phone.trim()) newErrors.phone = 'Phone number is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const newLead: Lead = {
      id: lead ? lead.id : Date.now().toString(),
      name,
      phone,
      budget,
      scope,
      status,
      details,
      floorPlan,
    };
    onSave(newLead);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFloorPlan({
          name: file.name,
          dataUrl: reader.result as string,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    if (lead && window.confirm('Are you sure you want to delete this lead?')) {
        onDelete(lead.id);
    }
  }
  
  const inputClass = "mt-1 block w-full border border-black rounded-md shadow-sm p-2 focus:ring-black focus:border-black bg-white";
  const errorInputClass = `${inputClass} border-2`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all max-h-full overflow-y-auto border-2 border-black">
        <div className="px-6 py-4 border-b-2 border-black flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold text-black">{lead ? 'Edit Lead' : 'Add New Lead'}</h3>
          <button onClick={onCancel} className="text-black hover:text-gray-700">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-black">Name</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={errors.name ? errorInputClass : inputClass} />
              {errors.name && <p className="text-black font-bold text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-black">Phone</label>
              <input type="text" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className={errors.phone ? errorInputClass : inputClass} />
              {errors.phone && <p className="text-black font-bold text-xs mt-1">{errors.phone}</p>}
            </div>
             <div>
              <label htmlFor="budget" className="block text-sm font-bold text-black">Budget</label>
              <input type="text" id="budget" value={budget} onChange={e => setBudget(e.target.value)} placeholder="₹50,000" className={inputClass} />
            </div>
             <div>
              <label htmlFor="scope" className="block text-sm font-bold text-black">For (Project Scope)</label>
              <input type="text" id="scope" value={scope} onChange={e => setScope(e.target.value)} placeholder="Kitchen, Living Room..." className={inputClass} />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-bold text-black">Status</label>
              <select id="status" value={status} onChange={e => setStatus(e.target.value as LeadStatus)} className={inputClass}>
                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-black">Floor Plan</label>
              <div className="mt-1">
                {!floorPlan ? (
                  <label htmlFor="floorPlan" className="cursor-pointer bg-white border-2 border-dashed border-black rounded-md p-4 flex flex-col items-center justify-center text-sm text-black hover:bg-gray-100">
                    <FileIcon className="w-8 h-8 mx-auto text-black"/>
                    <span>Upload a file (PDF, PNG, JPG)</span>
                    <input id="floorPlan" type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} className="sr-only"/>
                  </label>
                ) : (
                  <div className="flex items-center justify-between border border-black rounded-md p-2">
                    <span className="text-sm font-medium text-black truncate">{floorPlan.name}</span>
                    <div className="flex items-center space-x-2">
                      <a href={floorPlan.dataUrl} download={floorPlan.name} className="text-black hover:text-gray-700"><DownloadIcon/></a>
                      <button onClick={() => setFloorPlan(null)} className="text-black hover:text-gray-700"><TrashIcon/></button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="details" className="block text-sm font-bold text-black">Details</label>
            <textarea id="details" value={details} onChange={e => setDetails(e.target.value)} rows={4} className={inputClass}></textarea>
          </div>
        </div>
        <div className="px-6 py-4 bg-white rounded-b-lg flex justify-between items-center sticky bottom-0 border-t-2 border-black">
            <div>
                {lead && (
                    <button onClick={handleDelete} className="flex items-center gap-2 text-sm text-black hover:text-gray-700 font-medium">
                        <TrashIcon/> Delete Lead
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

export default LeadForm;
