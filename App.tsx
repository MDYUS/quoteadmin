
import React, { useState, useEffect } from 'react';
import { useLeads } from './hooks/useLeads';
import LeadList from './components/LeadList';
import LeadForm from './components/LeadForm';
import Sidebar from './components/Sidebar';
import QuotePage from './components/QuotePage';
import SiteVisitCalendar from './components/SiteVisitCalendar';
import ProjectTracker from './components/ProjectTracker';
import TeamMemberTracker from './components/TeamMemberTracker';
import ClientCommLogTracker from './components/ClientCommLogTracker';
import DatabaseGeminiPage from './components/DatabaseGeminiPage';
import { Lead } from './types';
import { CheckCircleIcon, MenuIcon, XIcon, PlusIcon } from './components/icons';
import { useSiteVisits } from './hooks/useSiteVisits';
import { useProjects } from './hooks/useProjects';
import { useTeamMembers } from './hooks/useTeamMembers';
import { useClientCommLogs } from './hooks/useClientCommLogs';


type View = 'leads' | 'quote' | 'site-visits' | 'projects' | 'team' | 'client-comm-log' | 'database';

const App: React.FC = () => {
  // Main App State
  const [currentView, setCurrentView] = useState<View>('leads');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Data Hooks
  const { leads, addLead, updateLead, deleteLead, isLoaded: leadsLoaded } = useLeads();
  const { siteVisits } = useSiteVisits();
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useTeamMembers();
  const { logs, addLog, updateLog, deleteLog } = useClientCommLogs();

  // Leads-related state
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const displaySuccessMessage = (message: string) => {
      setSuccessMessage(message);
  }

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Lead handlers
  const handleAddClick = () => {
    setEditingLead(null);
    setIsFormVisible(true);
  };

  const handleEditClick = (lead: Lead) => {
    setEditingLead(lead);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingLead(null);
  };
  
  const handleSave = (lead: Lead) => {
    if (editingLead) {
      updateLead(lead);
      displaySuccessMessage('Lead updated successfully!');
    } else {
      addLead(lead);
      displaySuccessMessage('Lead added successfully!');
    }
    setIsFormVisible(false);
    setEditingLead(null);
  };

  const handleDelete = (id: string) => {
    deleteLead(id);
    displaySuccessMessage('Lead deleted successfully.');
    setIsFormVisible(false);
    setEditingLead(null);
  };
  
  if (!leadsLoaded) { // Use specific loaded state
      return (
        <div className="flex items-center justify-center min-h-screen">
            <p className="text-black text-lg">Loading Application...</p>
        </div>
      )
  }
  
  const viewTitles: Record<View, string> = {
      leads: "Leads Dashboard",
      quote: "Create New Quote",
      'site-visits': "Site Visit Calendar",
      'projects': "Project Tracker",
      'team': "Team Members",
      'client-comm-log': "Client Communication Log",
      'database': "Help"
  }

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      {/* Mobile-first sidebar: translate-x handles sliding in/out */}
      <div className={`fixed inset-0 z-40 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar currentView={currentView} setCurrentView={(v) => {
            setCurrentView(v as View);
            setSidebarOpen(false);
        }} />
      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>}

      <div className="flex-1 flex flex-col overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center sticky top-0 z-20 border-b border-black">
            <button className="text-black md:hidden" onClick={() => setSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? <XIcon /> : <MenuIcon />}
            </button>
            <h1 className="text-xl font-bold text-black hidden md:block">{viewTitles[currentView]}</h1>
            {currentView === 'leads' && (
                <button onClick={handleAddClick} className="flex items-center justify-center px-4 py-2 bg-black text-white rounded-md shadow-sm hover:bg-gray-800 transition-colors text-sm font-medium">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Lead
                </button>
            )}
        </header>

        <main className="flex-1 bg-gray-50 overflow-y-auto">
            {currentView === 'leads' && <LeadList leads={leads} onAdd={handleAddClick} onEdit={handleEditClick} />}
            {currentView === 'quote' && <QuotePage />}
            {currentView === 'site-visits' && <SiteVisitCalendar setSuccessMessage={displaySuccessMessage} />}
            {currentView === 'projects' && <ProjectTracker setSuccessMessage={displaySuccessMessage} />}
            {currentView === 'team' && <TeamMemberTracker setSuccessMessage={displaySuccessMessage} />}
            {currentView === 'client-comm-log' && <ClientCommLogTracker setSuccessMessage={displaySuccessMessage} />}
            {currentView === 'database' && <DatabaseGeminiPage leads={leads} projects={projects} teamMembers={teamMembers} siteVisits={siteVisits} clientLogs={logs} />}
        </main>
      </div>

      {isFormVisible && (
        <LeadForm
          lead={editingLead}
          onSave={handleSave}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
      )}
      
      {successMessage && (
        <div className="fixed top-5 right-5 bg-black text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-fade-in-out">
          <CheckCircleIcon className="h-6 w-6"/>
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  );
};

export default App;