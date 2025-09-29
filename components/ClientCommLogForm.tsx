
import React, { useState, useEffect } from 'react';
import { ClientCommLog, FileInfo } from '../types';
import { XIcon, TrashIcon, DownloadIcon, FileIcon } from './icons';

interface ClientCommLogFormProps {
  log: ClientCommLog | null;
  onSave: (log: ClientCommLog) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

const ClientCommLogForm: React.FC<ClientCommLogFormProps> = ({ log, onSave, onCancel, onDelete }) => {
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [siteLocation, setSiteLocation] = useState('');
  const [floorPlan, setFloorPlan] = useState<FileInfo | null>(null);
  const [quote, setQuote] = useState<FileInfo | null>(null);
  const [commImages, setCommImages] = useState<FileInfo[]>([]);
  const [otherDocs, setOtherDocs] = useState<FileInfo[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setClientName(log?.clientName || '');
    setPhone(log?.phone || '');
    setSiteLocation(log?.siteLocation || '');
    setFloorPlan(log?.floorPlan || null);
    setQuote(log?.quote || null);
    setCommImages(log?.commImages || []);
    setOtherDocs(log?.otherDocs || []);
    setErrors({});
  }, [log]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!clientName.trim()) newErrors.clientName = 'Client Name is required.';
    if (!phone.trim()) newErrors.phone = 'Phone number is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const newLog: ClientCommLog = {
      id: log ? log.id : Date.now().toString(),
      clientName,
      phone,
      siteLocation,
      floorPlan,
      quote,
      commImages,
      otherDocs,
    };
    onSave(newLog);
  };
  
  const handleDelete = () => {
    if (log && window.confirm('Are you sure you want to delete this log?')) {
        onDelete(log.id);
    }
  }

  const removeFromFileList = (index: number, files: FileInfo[], setFiles: React.Dispatch<React.SetStateAction<FileInfo[]>>) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const inputClass = "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 bg-white";
  const errorInputClass = `${inputClass} border-red-500`;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl transform transition-all max-h-full overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold text-gray-900">{log ? 'Edit Log' : 'Add New Log'}</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><XIcon /></button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" id="clientName" value={clientName} onChange={e => setClientName(e.target.value)} className={errors.clientName ? errorInputClass : inputClass} />
              {errors.clientName && <p className="text-red-600 text-xs mt-1">{errors.clientName}</p>}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="text" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className={errors.phone ? errorInputClass : inputClass} />
              {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="siteLocation" className="block text-sm font-medium text-gray-700">Site Location</label>
              <input type="text" id="siteLocation" value={siteLocation} onChange={e => setSiteLocation(e.target.value)} className={inputClass} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SingleFileInput id="floorPlan" file={floorPlan} setFile={setFloorPlan} label="Floor Plan" accept=".pdf,.png,.jpg,.jpeg" />
            <SingleFileInput id="quote" file={quote} setFile={setQuote} label="Quote" accept=".pdf,.png,.jpg,.jpeg" />
          </div>

          <MultiFileInput id="commImages" files={commImages} setFiles={setCommImages} removeFile={removeFromFileList} label="Communication Images" accept=".png,.jpg,.jpeg" />
          <MultiFileInput id="otherDocs" files={otherDocs} setFiles={setOtherDocs} removeFile={removeFromFileList} label="Any Other Documents" accept=".pdf,.png,.jpg,.jpeg" />
        </div>

        <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-between items-center sticky bottom-0 border-t border-gray-200">
          <div>
              {log && (
                  <button onClick={handleDelete} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-medium">
                      <TrashIcon/> Delete Log
                  </button>
              )}
          </div>
          <div className="flex space-x-3">
              <button onClick={onCancel} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white border border-transparent rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Save Log</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper sub-components for file inputs
const SingleFileInput = ({ id, file, setFile, label, accept }: { id: string, file: FileInfo | null, setFile: (f: FileInfo | null) => void, label: string, accept: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1">
        {!file ? (
          <label htmlFor={id} className="cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center text-sm text-gray-500 hover:bg-gray-50 h-full">
            <FileIcon className="w-8 h-8 mx-auto text-gray-400"/>
            <span>Upload a file</span>
            <input id={id} type="file" accept={accept} onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                    const reader = new FileReader();
                    reader.onloadend = () => setFile({ name: f.name, dataUrl: reader.result as string, type: f.type });
                    reader.readAsDataURL(f);
                }
            }} className="sr-only"/>
          </label>
        ) : (
          <div className="flex items-center justify-between border border-gray-300 rounded-md p-2">
            <span className="text-sm font-medium text-gray-800 truncate">{file.name}</span>
            <div className="flex items-center space-x-2">
              <a href={file.dataUrl} download={file.name} className="text-gray-500 hover:text-gray-700"><DownloadIcon/></a>
              <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-700"><TrashIcon/></button>
            </div>
          </div>
        )}
      </div>
    </div>
);

const MultiFileInput = ({ id, files, setFiles, removeFile, label, accept }: { id: string, files: FileInfo[], setFiles: React.Dispatch<React.SetStateAction<FileInfo[]>>, removeFile: any, label: string, accept: string }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1 p-4 border-2 border-dashed border-gray-300 rounded-md">
        {files.length > 0 && (
          <div className="space-y-2 mb-4">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md border border-gray-200">
                <span className="text-sm font-medium text-gray-800 truncate">{file.name}</span>
                <div className="flex items-center space-x-2">
                   <a href={file.dataUrl} download={file.name} className="text-gray-500 hover:text-gray-700"><DownloadIcon className="h-4 w-4"/></a>
                   <button onClick={() => removeFile(index, files, setFiles)} className="text-red-500 hover:text-red-700"><TrashIcon className="h-4 w-4"/></button>
                </div>
              </div>
            ))}
          </div>
        )}
        <label htmlFor={id} className="cursor-pointer flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white border border-transparent rounded-md text-sm font-medium hover:bg-blue-700">
          <FileIcon className="w-5 h-5 mr-2"/>
          Add Files
          <input id={id} type="file" multiple accept={accept} onChange={(e) => {
              const selectedFiles = e.target.files;
              if (selectedFiles && selectedFiles.length > 0) {
// FIX: Explicitly type `f` as `File` to help TypeScript's type inference.
                  const filePromises = Array.from(selectedFiles).map((f: File) =>
                      new Promise<FileInfo>(resolve => {
                          const reader = new FileReader();
                          reader.onloadend = () => resolve({ name: f.name, dataUrl: reader.result as string, type: f.type });
                          reader.readAsDataURL(f);
                      })
                  );
                  Promise.all(filePromises).then(newFiles => setFiles([...files, ...newFiles]));
              }
          }} className="sr-only"/>
        </label>
      </div>
    </div>
);


export default ClientCommLogForm;
