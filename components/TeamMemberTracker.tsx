
import React, { useState } from 'react';
import { useTeamMembers } from '../hooks/useTeamMembers';
import TeamMemberForm from './TeamMemberForm';
import { TeamMember } from '../types';
import { PlusIcon, UserCircleIcon } from './icons';

interface TeamMemberTrackerProps {
  setSuccessMessage: (message: string) => void;
  setErrorMessage: (message: string) => void;
}

const TeamMemberTracker: React.FC<TeamMemberTrackerProps> = ({ setSuccessMessage, setErrorMessage }) => {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useTeamMembers();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const handleAddClick = () => {
    setEditingMember(null);
    setIsFormVisible(true);
  };

  const handleEditClick = (member: TeamMember) => {
    setEditingMember(member);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingMember(null);
  };

  const handleSave = async (member: TeamMember) => {
    try {
      if (editingMember) {
        await updateTeamMember(member);
        setSuccessMessage('Team member updated successfully!');
      } else {
        await addTeamMember(member);
        setSuccessMessage('Team member added successfully!');
      }
      setIsFormVisible(false);
      setEditingMember(null);
    } catch (error: any) {
      setErrorMessage(`Failed to save team member: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTeamMember(id);
      setSuccessMessage('Team member deleted successfully.');
      setIsFormVisible(false);
      setEditingMember(null);
    } catch (error: any) {
      setErrorMessage(`Failed to delete team member: ${error.message}`);
    }
  };
  
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-gray-900 bg-gray-100 h-full flex flex-col">
      <div className="flex-shrink-0 flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Team Members</h2>
        <button onClick={handleAddClick} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Add Member
        </button>
      </div>

      <div className="flex-grow overflow-auto">
        {teamMembers.length > 0 ? (
          <>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {teamMembers.map(member => (
                <div key={member.id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col space-y-3">
                    <div className="flex-grow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-lg font-bold text-gray-900">{member.name}</p>
                                <p className="text-sm text-gray-600">{member.role}</p>
                            </div>
                             <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">ID: {member.employeeId}</p>
                        </div>
                        <div className="mt-3 border-t border-gray-200 pt-3 text-sm space-y-2">
                           <div className="flex justify-between"><span>Salary:</span> <span className="font-medium">{formatCurrency(member.salary)}</span></div>
                           <div className="flex justify-between"><span>Joined:</span> <span className="font-medium">{formatDate(member.joinedDate)}</span></div>
                           <div className="flex justify-between"><span>Current Project:</span> <span className="font-medium">{member.currentProjectFor || 'N/A'}</span></div>
                           <div className="flex justify-between"><span>Projects This Month:</span> <span className="font-medium">{member.projectsDoneThisMonth}</span></div>
                        </div>
                    </div>
                  <button onClick={() => handleEditClick(member)} className="mt-3 w-full text-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Edit / Delete
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white shadow-sm sm:rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name / EID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Project</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Projects Done</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.employeeId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatCurrency(member.salary)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{member.currentProjectFor || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(member.joinedDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-800">{member.projectsDoneThisMonth}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => handleEditClick(member)} className="text-blue-600 hover:text-blue-800 font-semibold">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-16 px-6 h-full flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-lg">
            <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No team members yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new team member.</p>
          </div>
        )}
      </div>

      {isFormVisible && (
        <TeamMemberForm
          member={editingMember}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default TeamMemberTracker;