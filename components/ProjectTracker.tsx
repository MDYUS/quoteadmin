

import React, { useState, useMemo } from 'react';
import { useProjects } from '../hooks/useProjects';
import ProjectForm from './ProjectForm';
import { Project, ProjectStatus } from '../types';
import { PlusIcon, ClipboardListIcon, DownloadIcon } from './icons';

interface ProjectTrackerProps {
  setSuccessMessage: (message: string) => void;
}

const ProjectTracker: React.FC<ProjectTrackerProps> = ({ setSuccessMessage }) => {
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleAddClick = () => {
    setEditingProject(null);
    setIsFormVisible(true);
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingProject(null);
  };

  const handleSave = (project: Project) => {
    if (editingProject) {
      updateProject(project);
      setSuccessMessage('Project updated successfully!');
    } else {
      addProject(project);
      setSuccessMessage('Project added successfully!');
    }
    setIsFormVisible(false);
    setEditingProject(null);
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
    setSuccessMessage('Project deleted successfully.');
    setIsFormVisible(false);
    setEditingProject(null);
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  
  const StatusBadge = ({ status }: { status: ProjectStatus }) => {
    const colorClasses = {
      [ProjectStatus.JustStarted]: 'bg-blue-100 text-blue-800',
      [ProjectStatus.Ongoing]: 'bg-yellow-100 text-yellow-800',
      [ProjectStatus.AlmostDone]: 'bg-green-100 text-green-800',
      [ProjectStatus.Handovered]: 'bg-purple-100 text-purple-800',
    };
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClasses[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-black bg-white h-full flex flex-col">
      <div className="flex-shrink-0 flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Project Tracker</h2>
        <button onClick={handleAddClick} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Add Project
        </button>
      </div>

      <div className="flex-grow overflow-hidden border border-black rounded-lg">
        <div className="h-full overflow-auto">
            {projects.length > 0 ? (
            <table className="min-w-full divide-y divide-black">
                <thead className="bg-gray-50 border-b border-black sticky top-0">
                <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider hidden lg:table-cell">Status</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider hidden md:table-cell">Type</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Pending Amt.</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-black uppercase tracking-wider hidden lg:table-cell">Files</th>
                    <th scope="col" className="relative px-4 py-3"><span className="sr-only">Edit</span></th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => {
                    const finalAmount = project.finalBudget - project.discountAmount;
                    const pendingAmount = finalAmount - project.advanceReceived;
                    return (
                    <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-black">{project.name}</div>
                            <div className="text-sm text-gray-500">{project.phone}</div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                           <StatusBadge status={project.status} />
                        </td>
                         <td className="px-4 py-4 whitespace-nowrap text-sm text-black hidden md:table-cell">{project.type}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-red-600">{formatCurrency(pendingAmount)}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-black hidden lg:table-cell">
                            <div className="flex items-center space-x-2">
                                {project.floorPlan && <a href={project.floorPlan.dataUrl} download={project.floorPlan.name} className="text-black hover:text-gray-700" title={`Download ${project.floorPlan.name}`}><DownloadIcon /></a>}
                                {project.quoteFile && <a href={project.quoteFile.dataUrl} download={project.quoteFile.name} className="text-black hover:text-gray-700" title={`Download ${project.quoteFile.name}`}><DownloadIcon /></a>}
                            </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => handleEditClick(project)} className="text-black hover:text-gray-700 font-bold">Edit</button>
                        </td>
                    </tr>
                )})}
                </tbody>
            </table>
            ) : (
            <div className="text-center py-16 px-6 h-full flex flex-col justify-center items-center">
                <ClipboardListIcon className="mx-auto h-12 w-12 text-black" />
                <h3 className="mt-2 text-lg font-medium text-black">No projects yet</h3>
                <p className="mt-1 text-sm text-black">Get started by adding a new project.</p>
            </div>
            )}
        </div>
      </div>
      
      {isFormVisible && (
        <ProjectForm
          project={editingProject}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ProjectTracker;
