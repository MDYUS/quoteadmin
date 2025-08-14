import React, { useState, useEffect } from 'react';
import { TeamMember } from '../types';
import { XIcon, TrashIcon } from './icons';

interface TeamMemberFormProps {
  member: TeamMember | null;
  onSave: (member: TeamMember) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ member, onSave, onCancel, onDelete }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [salary, setSalary] = useState<number>(0);
  const [currentProjectFor, setCurrentProjectFor] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [joinedDate, setJoinedDate] = useState('');
  const [projectsDoneThisMonth, setProjectsDoneThisMonth] = useState<number>(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setName(member?.name || '');
    setRole(member?.role || '');
    setSalary(member?.salary || 0);
    setCurrentProjectFor(member?.currentProjectFor || '');
    setEmployeeId(member?.employeeId || '');
    setJoinedDate(member?.joinedDate || new Date().toISOString().split('T')[0]);
    setProjectsDoneThisMonth(member?.projectsDoneThisMonth || 0);
    setErrors({});
  }, [member]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!role.trim()) newErrors.role = 'Role is required.';
    if (!employeeId.trim()) newErrors.employeeId = 'Employee ID is required.';
    if (salary <= 0) newErrors.salary = 'Salary must be a positive number.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = () => {
    if (!validate()) return;
    const newMember: TeamMember = {
      id: member ? member.id : Date.now().toString(),
      name,
      role,
      salary,
      currentProjectFor,
      employeeId,
      joinedDate,
      projectsDoneThisMonth,
    };
    onSave(newMember);
  };
  
  const handleDelete = () => {
    if (member && window.confirm('Are you sure you want to delete this team member?')) {
        onDelete(member.id);
    }
  }

  const inputClass = "mt-1 block w-full border border-black rounded-md shadow-sm p-2 focus:ring-black focus:border-black bg-white";
  const errorInputClass = `${inputClass} border-red-500 border-2`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all max-h-full overflow-y-auto border-2 border-black">
        <div className="px-6 py-4 border-b-2 border-black flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold text-black">{member ? 'Edit Team Member' : 'Add New Team Member'}</h3>
          <button onClick={onCancel} className="text-black hover:text-gray-700"><XIcon /></button>
        </div>
        
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label htmlFor="name" className="block text-sm font-bold text-black">Name</label>
                  <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className={errors.name ? errorInputClass : inputClass} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                  <label htmlFor="role" className="block text-sm font-bold text-black">Role</label>
                  <input type="text" id="role" value={role} onChange={e => setRole(e.target.value)} className={errors.role ? errorInputClass : inputClass} />
                  {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
              </div>
              <div>
                  <label htmlFor="salary" className="block text-sm font-bold text-black">Salary</label>
                  <input type="number" id="salary" value={salary} onChange={e => setSalary(Number(e.target.value))} className={errors.salary ? errorInputClass : inputClass} />
                  {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary}</p>}
              </div>
              <div>
                  <label htmlFor="currentProjectFor" className="block text-sm font-bold text-black">Current Project For (Client Name)</label>
                  <input type="text" id="currentProjectFor" value={currentProjectFor} onChange={e => setCurrentProjectFor(e.target.value)} className={inputClass} />
              </div>
              <div>
                  <label htmlFor="employeeId" className="block text-sm font-bold text-black">Employee ID</label>
                  <input type="text" id="employeeId" value={employeeId} onChange={e => setEmployeeId(e.target.value)} className={errors.employeeId ? errorInputClass : inputClass} />
                  {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>}
              </div>
              <div>
                  <label htmlFor="joinedDate" className="block text-sm font-bold text-black">Joined Date</label>
                  <input type="date" id="joinedDate" value={joinedDate} onChange={e => setJoinedDate(e.target.value)} className={inputClass} />
              </div>
              <div className="md:col-span-2">
                  <label htmlFor="projectsDoneThisMonth" className="block text-sm font-bold text-black">Projects Done This Month</label>
                  <input type="number" id="projectsDoneThisMonth" value={projectsDoneThisMonth} onChange={e => setProjectsDoneThisMonth(Number(e.target.value))} className={inputClass} />
              </div>
            </div>
        </div>

        <div className="px-6 py-4 bg-white rounded-b-lg flex justify-between items-center sticky bottom-0 border-t-2 border-black">
            <div>
                {member && (
                    <button onClick={handleDelete} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-medium">
                        <TrashIcon/> Delete Member
                    </button>
                )}
            </div>
            <div className="flex space-x-3">
                <button onClick={onCancel} className="px-4 py-2 bg-white border border-black rounded-md text-sm font-medium text-black hover:bg-gray-100">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-black text-white border border-transparent rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">Save Member</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberForm;
