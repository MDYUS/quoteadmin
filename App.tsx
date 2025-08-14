
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
import { CheckCircleIcon, MenuIcon, XIcon, PlusIcon, LoadingSpinner, XCircleIcon } from './components/icons';
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Data Hooks
  const { leads, addLead, updateLead, deleteLead, isLoaded: leadsLoaded, error: leadsError } = useLeads();
  const { siteVisits, isLoaded: visitsLoaded, error: visitsError } = useSiteVisits();
  const { projects, isLoaded: projectsLoaded, error: projectsError } = useProjects();
  const { teamMembers, isLoaded: teamLoaded, error: teamError } = useTeamMembers();
  const { logs, isLoaded: logsLoaded, error: logsError } = useClientCommLogs();

  // Leads-related state
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const displaySuccessMessage = (message: string) => {
      setSuccessMessage(message);
  }

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000); // Errors stay longer
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

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
  
  const handleSave = async (lead: Lead) => {
    try {
      if (editingLead) {
        await updateLead(lead);
        displaySuccessMessage('Lead updated successfully!');
      } else {
        await addLead(lead);
        displaySuccessMessage('Lead added successfully!');
      }
      setIsFormVisible(false);
      setEditingLead(null);
    } catch (error: any) {
        setErrorMessage(`Failed to save lead: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
        await deleteLead(id);
        displaySuccessMessage('Lead deleted successfully.');
        setIsFormVisible(false);
        setEditingLead(null);
    } catch (error: any) {
        setErrorMessage(`Failed to delete lead: ${error.message}`);
    }
  };
  
  const allDataLoaded = leadsLoaded && visitsLoaded && projectsLoaded && teamLoaded && logsLoaded;
  const anyError = leadsError || visitsError || projectsError || teamError || logsError;

  if (anyError) {
      const isRLSError = /permission denied/i.test(anyError);
      return (
        <div className="flex items-center justify-center min-h-screen bg-white text-black p-4">
            <div className="text-center max-w-3xl border-2 border-black p-6 sm:p-8 rounded-lg shadow-lg bg-gray-50">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Application Error</h2>
                
                {isRLSError ? (
                    <div className="text-left space-y-3 text-sm sm:text-base">
                        <p className="font-bold text-lg">Database Access Blocked (Row Level Security)</p>
                        <p>
                            The application was blocked from accessing the database. This is a common security feature in Supabase called <strong>Row Level Security (RLS)</strong>.
                        </p>
                        <p>
                            <strong>To fix this:</strong> You need to create a "policy" in Supabase to allow this app (which is an anonymous user) to read and write data.
                        </p>
                         <p>
                           I can provide the SQL code to fix this. Please ask me to "give the full SQL code to fix the data not showing" and I will provide the necessary script to run in your Supabase SQL Editor.
                         </p>
                    </div>
                ) : (
                    <p>Could not load application data. Please try refreshing the page.</p>
                )}

                <div className="mt-6 p-3 bg-red-100 text-red-700 rounded-md text-left font-mono text-xs sm:text-sm">
                    <strong>Error Details:</strong>
                    <p className="break-words mt-1">{anyError}</p>
                </div>
            </div>
        </div>
      )
  }

  if (!allDataLoaded) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <LoadingSpinner className="h-10 w-10 text-black" />
            <p className="text-black text-lg mt-4">Loading Application Data...</p>
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
      <div className={`fixed inset-0 z-40 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar currentView={currentView} setCurrentView={(v) => {
            setCurrentView(v as View);
            setSidebarOpen(false);
        }} />
      </div>
      
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
            {currentView === 'site-visits' && <SiteVisitCalendar setSuccessMessage={displaySuccessMessage} setErrorMessage={setErrorMessage} />}
            {currentView === 'projects' && <ProjectTracker setSuccessMessage={displaySuccessMessage} setErrorMessage={setErrorMessage} />}
            {currentView === 'team' && <TeamMemberTracker setSuccessMessage={displaySuccessMessage} setErrorMessage={setErrorMessage} />}
            {currentView === 'client-comm-log' && <ClientCommLogTracker setSuccessMessage={displaySuccessMessage} setErrorMessage={setErrorMessage} />}
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

      {errorMessage && (
        <div className="fixed top-5 right-5 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-fade-in-out">
          <XCircleIcon className="h-6 w-6"/>
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default App;
