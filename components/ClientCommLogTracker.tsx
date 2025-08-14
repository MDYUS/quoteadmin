
import React, { useState } from 'react';
import { useClientCommLogs } from '../hooks/useClientCommLogs';
import ClientCommLogForm from './ClientCommLogForm';
import { ClientCommLog, FileInfo } from '../types';
import { PlusIcon, ChatBubbleIcon, FileIcon, DownloadIcon } from './icons';

interface ClientCommLogTrackerProps {
  setSuccessMessage: (message: string) => void;
}

const FileLink: React.FC<{file: FileInfo}> = ({ file }) => (
    <a href={file.dataUrl} download={file.name} className="text-black hover:text-gray-700 inline-block" title={`Download ${file.name}`}>
        <FileIcon className="h-5 w-5" />
    </a>
);

const ClientCommLogTracker: React.FC<ClientCommLogTrackerProps> = ({ setSuccessMessage }) => {
  const { logs, addLog, updateLog, deleteLog } = useClientCommLogs();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingLog, setEditingLog] = useState<ClientCommLog | null>(null);

  const handleAddClick = () => {
    setEditingLog(null);
    setIsFormVisible(true);
  };

  const handleEditClick = (log: ClientCommLog) => {
    setEditingLog(log);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingLog(null);
  };

  const handleSave = (log: ClientCommLog) => {
    if (editingLog) {
      updateLog(log);
      setSuccessMessage('Log updated successfully!');
    } else {
      addLog(log);
      setSuccessMessage('Log added successfully!');
    }
    setIsFormVisible(false);
    setEditingLog(null);
  };

  const handleDelete = (id: string) => {
    deleteLog(id);
    setSuccessMessage('Log deleted successfully.');
    setIsFormVisible(false);
    setEditingLog(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-black bg-white h-full flex flex-col">
      <div className="flex-shrink-0 flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Client Communication Log</h2>
        <button onClick={handleAddClick} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Add New
        </button>
      </div>

      <div className="flex-grow overflow-auto">
        {logs.length > 0 ? (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {logs.map(log => (
                <div key={log.id} className="bg-white p-4 rounded-lg shadow border border-black flex flex-col space-y-3">
                    <div className="flex-grow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-lg font-bold text-black">{log.clientName}</p>
                                <p className="text-sm text-gray-600">{log.phone}</p>
                            </div>
                        </div>
                        <p className="text-sm text-black mt-1">{log.siteLocation}</p>
                        <div className="mt-3 border-t border-gray-200 pt-3 text-sm space-y-2">
                           <div className="flex justify-between"><span>Floor Plan:</span> <span className="font-medium">{log.floorPlan ? <FileLink file={log.floorPlan} /> : 'N/A'}</span></div>
                           <div className="flex justify-between"><span>Quote:</span> <span className="font-medium">{log.quote ? <FileLink file={log.quote} /> : 'N/A'}</span></div>
                           <div className="flex justify-between"><span>Images:</span> <span className="font-medium">{log.commImages.length} file(s)</span></div>
                           <div className="flex justify-between"><span>Documents:</span> <span className="font-medium">{log.otherDocs.length} file(s)</span></div>
                        </div>
                    </div>
                  <button onClick={() => handleEditClick(log)} className="mt-3 w-full text-center px-4 py-2 bg-white border border-black rounded-md text-sm font-medium text-black hover:bg-gray-100">
                    Edit / Delete
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block border border-black rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-black">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Client</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Site Location</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-black uppercase tracking-wider">Floor Plan</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-black uppercase tracking-wider">Quote</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Comm. Images</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Other Docs</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-black">{log.clientName}</div>
                        <div className="text-sm text-gray-500">{log.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{log.siteLocation}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black text-center">{log.floorPlan ? <FileLink file={log.floorPlan} /> : 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black text-center">{log.quote ? <FileLink file={log.quote} /> : 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{log.commImages.length} file(s)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{log.otherDocs.length} file(s)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEditClick(log)} className="text-black hover:text-gray-700 font-bold">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-16 px-6 h-full flex flex-col justify-center items-center border border-dashed border-black rounded-lg">
            <ChatBubbleIcon className="mx-auto h-12 w-12 text-black" />
            <h3 className="mt-2 text-lg font-medium text-black">No communication logs yet</h3>
            <p className="mt-1 text-sm text-black">Get started by adding a new log.</p>
          </div>
        )}
      </div>

      {isFormVisible && (
        <ClientCommLogForm
          log={editingLog}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ClientCommLogTracker;
