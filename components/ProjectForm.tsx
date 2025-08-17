
import React, { useState, useEffect, useMemo } from 'react';
import { Project, ProjectStatus, ProjectType, FileInfo } from '../types';
import { PROJECT_STATUS_OPTIONS, PROJECT_TYPE_OPTIONS } from '../constants';
import { XIcon, TrashIcon, DownloadIcon, FileIcon } from './icons';
import { formatStatus } from '../utils';

interface ProjectFormProps {
  project: Project | null;
  onSave: (project: Project) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSave, onCancel, onDelete }) => {
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<ProjectStatus>(ProjectStatus.JustStarted);
  const [type, setType] = useState<ProjectType>(ProjectType.FullHome);
  const [finalBudget, setFinalBudget] = useState<number>(0);
  const [advanceReceived, setAdvanceReceived] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [floorPlan, setFloorPlan] = useState<FileInfo | null>(null);
  const [quoteFile, setQuoteFile] = useState<FileInfo | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setName(project?.name || '');
    setPhone(project?.phone || '');
    setStatus(project?.status || ProjectStatus.JustStarted);
    setType(project?.type || ProjectType.FullHome);
    setFinalBudget(project?.finalBudget || 0);
    setAdvanceReceived(project?.advanceReceived || 0);
    setDiscountAmount(project?.discountAmount || 0);
    setFloorPlan(project?.floorPlan || null);
    setQuoteFile(project?.quoteFile || null);
    setErrors({});
  }, [project]);

  // Calculated financial values
  const { finalAmount, pendingAmount } = useMemo(() => {
    const final = finalBudget - discountAmount;
    const pending = final - advanceReceived;
    return { finalAmount: final > 0 ? final : 0, pendingAmount: pending > 0 ? pending : 0 };
  }, [finalBudget, discountAmount, advanceReceived]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!phone.trim()) newErrors.phone = 'Phone number is required.';
    if (finalBudget <= 0) newErrors.finalBudget = 'Final Budget must be positive.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFileState: React.Dispatch<React.SetStateAction<FileInfo | null>>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFileState({
          name: file.name,
          dataUrl: reader.result as string,
          type: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!validate()) return;
    const newProject: Project = {
      id: project ? project.id : Date.now().toString(),
      name,
      phone,
      status,
      type,
      finalBudget,
      advanceReceived,
      discountAmount,
      floorPlan,
      quoteFile,
    };
    onSave(newProject);
  };
  
  const handleDelete = () => {
    if (project && window.confirm('Are you sure you want to delete this project?')) {
        onDelete(project.id);
    }
  }

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

  const inputClass = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 bg-white";
  const errorInputClass = `${inputClass} border-red-500`;
  const fileInput = (id: string, file: FileInfo | null, setFile: React.Dispatch<React.SetStateAction<FileInfo | null>>, label: string) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {!file ? (
            <label htmlFor={id} className="mt-1 cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center text-sm text-gray-500 hover:bg-gray-50">
                <FileIcon className="w-8 h-8 mx-auto text-gray-400"/>
                <span>Upload a file</span>
                <input id={id} type="file" onChange={(e) => handleFileChange(e, setFile)} className="sr-only"/>
            </label>
        ) : (
            <div className="mt-1 flex items-center justify-between border border-gray-300 rounded-md p-2">
                <span className="text-sm font-medium text-gray-800 truncate">{file.name}</span>
                <div className="flex items-center space-x-2">
                    <a href={file.dataUrl} download={file.name} className="text-gray-500 hover:text-gray-700"><DownloadIcon/></a>
                    <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-700"><TrashIcon/></button>
                </div>
            </div>
        )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl transform transition-all max-h-full overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold text-gray-900">{project ? 'Edit Project' : 'Add New Project'}</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><XIcon /></button>
        </div>
        
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Column 1: Client Info */}
                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={errors.name ? errorInputClass : inputClass} />
                        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input type="text" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className={errors.phone ? errorInputClass : inputClass} />
                         {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Current Status</label>
                        <select id="status" value={status} onChange={e => setStatus(e.target.value as ProjectStatus)} className={inputClass}>
                            {PROJECT_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{formatStatus(opt)}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                        <select id="type" value={type} onChange={e => setType(e.target.value as ProjectType)} className={inputClass}>
                            {PROJECT_TYPE_OPTIONS.map(opt => <option key={opt} value={opt}>{formatStatus(opt)}</option>)}
                        </select>
                    </div>
                </div>

                {/* Column 2: Financials */}
                <div className="space-y-6">
                    <div>
                        <label htmlFor="finalBudget" className="block text-sm font-medium text-gray-700">Final Budget</label>
                        <input type="number" id="finalBudget" value={finalBudget} onChange={e => setFinalBudget(Number(e.target.value))} className={errors.finalBudget ? errorInputClass : inputClass} />
                        {errors.finalBudget && <p className="text-red-600 text-xs mt-1">{errors.finalBudget}</p>}
                    </div>
                    <div>
                        <label htmlFor="advanceReceived" className="block text-sm font-medium text-gray-700">Total Advance Received</label>
                        <input type="number" id="advanceReceived" value={advanceReceived} onChange={e => setAdvanceReceived(Number(e.target.value))} className={inputClass} />
                    </div>
                     <div>
                        <label htmlFor="discountAmount" className="block text-sm font-medium text-gray-700">Discounted Amount</label>
                        <input type="number" id="discountAmount" value={discountAmount} onChange={e => setDiscountAmount(Number(e.target.value))} className={inputClass} />
                    </div>
                    <div className="space-y-2 pt-2 bg-gray-50 p-3 rounded-md">
                        <div className="flex justify-between text-sm"><span className="font-medium text-gray-600">Final Amount:</span><span className="font-semibold text-gray-800">{formatCurrency(finalAmount)}</span></div>
                        <div className="flex justify-between text-sm font-bold"><span className="text-red-600">Pending Amount:</span><span className="text-red-600">{formatCurrency(pendingAmount)}</span></div>
                    </div>
                </div>

                {/* Column 3: Files */}
                <div className="space-y-6">
                    {fileInput('floorPlan', floorPlan, setFloorPlan, 'Floor Plan Upload')}
                    {fileInput('quoteFile', quoteFile, setQuoteFile, 'Quote Upload')}
                </div>
            </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between items-center sticky bottom-0 border-t border-gray-200">
            <div>
                {project && (
                    <button onClick={handleDelete} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-medium">
                        <TrashIcon/> Delete Project
                    </button>
                )}
            </div>
            <div className="flex space-x-3">
                <button onClick={onCancel} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white border border-transparent rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Save Project</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;