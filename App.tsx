

import React, { useState, useEffect, useMemo } from 'react';
import { useLeads } from './hooks/useLeads';
import LeadList from './components/LeadList';
import LeadForm from './components/LeadForm';
import Sidebar from './components/Sidebar';
import QuotePage from './components/QuotePage';
import SiteVisitCalendar from './components/SiteVisitCalendar';
import ProjectTracker from './components/ProjectTracker';
import TeamMemberTracker from './components/TeamMemberTracker';
import ClientCommLogTracker from './components/ClientCommLogTracker';
import LeadHistory from './components/LeadHistory';
import { Lead, LeadStatus, SiteVisit } from './types';
import { CheckCircleIcon, MenuIcon, XIcon, PlusIcon, LoadingSpinner, XCircleIcon } from './components/icons';
import { useSiteVisits } from './hooks/useSiteVisits';
import { useProjects } from './hooks/useProjects';
import { useTeamMembers } from './hooks/useTeamMembers';
import { useClientCommLogs } from './hooks/useClientCommLogs';
import LoginPage from './components/LoginPage';
import { formatStatus } from './utils';


// --- ScheduleVisitModal Component Definition ---
interface ScheduleVisitModalProps {
  lead: Lead;
  onSave: (visitData: { date: string; time: string; location: string }) => void;
  onCancel: () => void;
}

const ScheduleVisitModal: React.FC<ScheduleVisitModalProps> = ({ lead, onSave, onCancel }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setDate(new Date().toISOString().split('T')[0]);
    setLocation(lead.scope || ''); // Prefill location from lead's scope
  }, [lead]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!date) newErrors.date = 'Date is required.';
    if (!time) newErrors.time = 'Time is required.';
    if (!location.trim()) newErrors.location = 'Location is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ date, time, location });
  };

  const inputClass = "mt-1 block w-full border border-neutral-300 rounded-lg shadow-sm p-3 focus:ring-primary-500 focus:border-primary-500 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400";
  const errorInputClass = `${inputClass} border-red-500`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-neutral-900">Schedule Site Visit</h3>
          <button onClick={onCancel} className="text-neutral-400 hover:text-neutral-600">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-neutral-600">For Client: <span className="font-medium text-neutral-900">{lead.name}</span></p>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-neutral-700">Location (Address)</label>
            <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} className={errors.location ? errorInputClass : inputClass} />
            {errors.location && <p className="text-red-600 text-xs mt-1">{errors.location}</p>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-neutral-700">Date</label>
              <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className={errors.date ? errorInputClass : inputClass} />
              {errors.date && <p className="text-red-600 text-xs mt-1">{errors.date}</p>}
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-neutral-700">Time</label>
              <input type="time" id="time" value={time} onChange={e => setTime(e.target.value)} className={errors.time ? errorInputClass : inputClass} />
              {errors.time && <p className="text-red-600 text-xs mt-1">{errors.time}</p>}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-neutral-50 rounded-b-xl flex justify-end items-center space-x-3">
          <button onClick={onCancel} className="px-4 py-2 bg-white border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50">Cancel</button>
          <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white border border-transparent rounded-lg text-sm font-medium hover:bg-primary-700">Schedule & Save</button>
        </div>
      </div>
    </div>
  );
};


type View = 'leads' | 'quote' | 'site-visits' | 'projects' | 'team' | 'client-comm-log' | 'lead-history';

const userNames: Record<string, string> = {
  '786786': 'Yusuf',
  '667733': 'AKKA',
};

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
};


const App: React.FC = () => {
  // Main App State
  const [currentView, setCurrentView] = useState<View>('leads');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Data Hooks
  const { leads, addLead, updateLead, deleteLead, isLoaded: leadsLoaded, error: leadsError } = useLeads();
  const { siteVisits, addVisit, updateVisit, deleteVisit, isLoaded: visitsLoaded, error: visitsError } = useSiteVisits();
  const { projects, isLoaded: projectsLoaded, error: projectsError } = useProjects();
  const { teamMembers, isLoaded: teamLoaded, error: teamError } = useTeamMembers();
  const { logs, isLoaded: logsLoaded, error: logsError } = useClientCommLogs();

  // Leads-related state
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [schedulingVisitForLead, setSchedulingVisitForLead] = useState<Lead | null>(null);
  
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

  const handleLeadStatusChange = (leadId: string, newStatus: LeadStatus) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead && lead.status !== newStatus) {
      if (newStatus === LeadStatus.SiteVisit) {
        // Open modal to schedule before updating status
        setSchedulingVisitForLead({ ...lead, status: newStatus });
      } else {
        updateLead({ ...lead, status: newStatus })
          .then(() => displaySuccessMessage(`Status updated for ${lead.name}`))
          .catch(err => setErrorMessage(`Failed to update status: ${err.message}`));
      }
    }
  };
  
  const handleScheduleAndSave = async (visitData: { date: string, time: string, location: string }) => {
    if (!schedulingVisitForLead) return;
  
    try {
      // 1. Create the site visit
      await addVisit({
        id: '', // DB will generate
        clientName: schedulingVisitForLead.name,
        phone: schedulingVisitForLead.phone,
        location: visitData.location,
        date: visitData.date,
        time: visitData.time,
      });
      
      // 2. Update the lead's status
      await updateLead(schedulingVisitForLead);
  
      displaySuccessMessage('Site visit scheduled and lead updated!');
    } catch (err: any) {
      setErrorMessage(`Failed to schedule visit: ${err.message}`);
    } finally {
      setSchedulingVisitForLead(null);
    }
  };

  const handleLoginSuccess = (userId: string) => {
    setIsAuthenticated(true);
    setCurrentUser(userId);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };
  
  const staleLeadsForAlert = useMemo(() => {
    return leads.filter(lead => {
        if (!lead.createdAt) return false;
        
        const leadDate = new Date(lead.createdAt);
        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000;
        const isOverdue = (now.getTime() - leadDate.getTime()) > oneDay;
        
        const isActionableStatus = [
            LeadStatus.RecentlyAdded,
            LeadStatus.Contacted,
            LeadStatus.FollowUp
        ].includes(lead.status);

        return isOverdue && isActionableStatus;
    });
  }, [leads]);
  
  const greetingMessage = useMemo(() => {
    if (!currentUser) return '';
    const greeting = getGreeting();
    const userName = userNames[currentUser];
    return userName ? `${greeting}, ${userName}` : greeting;
  }, [currentUser]);


  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }
  
  const allDataLoaded = leadsLoaded && visitsLoaded && projectsLoaded && teamLoaded && logsLoaded;
  const anyError = leadsError || visitsError || projectsError || teamError || logsError;

  if (anyError) {
      const isRLSError = /permission denied/i.test(anyError);
      return (
        <div className="flex items-center justify-center min-h-screen bg-neutral-100 text-neutral-800 p-4">
            <div className="text-center max-w-3xl bg-white p-6 sm:p-8 rounded-lg shadow-lg">
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

                <div className="mt-6 p-3 bg-red-50 text-red-700 rounded-md text-left font-mono text-xs sm:text-sm">
                    <strong>Error Details:</strong>
                    <p className="break-words mt-1">{anyError}</p>
                </div>
            </div>
        </div>
      )
  }

  if (!allDataLoaded) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-100">
            <LoadingSpinner className="h-10 w-10 text-primary-600" />
            <p className="text-neutral-700 text-lg mt-4">Loading Application Data...</p>
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
      'lead-history': "Lead History & Analytics",
  }

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      <div className={`fixed inset-0 z-40 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar 
            currentView={currentView} 
            setCurrentView={(v) => {
                setCurrentView(v as View);
                setSidebarOpen(false);
            }}
            currentUser={currentUser}
            onLogout={handleLogout}
        />
      </div>
      
      {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-30 md:hidden" onClick={() => setSidebarOpen(false)}></div>}

      <div className="flex-1 flex flex-col overflow-auto">
        <header className="bg-white p-4 flex justify-between items-center sticky top-0 z-20 border-b border-neutral-200">
            <div className="flex items-center gap-4">
                <button className="text-neutral-600 md:hidden" onClick={() => setSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? <XIcon /> : <MenuIcon />}
                </button>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-neutral-900">{viewTitles[currentView]}</h1>
                  <p className="text-sm text-neutral-500">{greetingMessage}</p>
                </div>
            </div>
            {currentView === 'leads' && (
                <button onClick={handleAddClick} className="flex-shrink-0 flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg shadow-sm hover:bg-primary-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Add Lead
                </button>
            )}
        </header>

        <main className="flex-1 bg-neutral-100 overflow-y-auto">
            {currentView === 'leads' && staleLeadsForAlert.length > 0 && (
                <div className="bg-red-100 border-b border-red-200 text-red-800 p-3 text-sm" role="alert">
                    <p className="font-bold">Action Required</p>
                    <p>
                        {staleLeadsForAlert.length} lead(s) require attention. "{staleLeadsForAlert[0].name}" has been in '{formatStatus(staleLeadsForAlert[0].status)}' status for over 24 hours.
                    </p>
                </div>
            )}
            
            {currentView === 'leads' && <LeadList leads={leads} onAdd={handleAddClick} onEdit={handleEditClick} onLeadStatusChange={handleLeadStatusChange} />}
            {currentView === 'quote' && <QuotePage />}
            {currentView === 'site-visits' && <SiteVisitCalendar 
              siteVisits={siteVisits}
              addVisit={addVisit}
              updateVisit={updateVisit}
              deleteVisit={deleteVisit}
              setSuccessMessage={displaySuccessMessage} 
              setErrorMessage={setErrorMessage} 
            />}
            {currentView === 'projects' && <ProjectTracker setSuccessMessage={displaySuccessMessage} setErrorMessage={setErrorMessage} />}
            {currentView === 'team' && <TeamMemberTracker setSuccessMessage={displaySuccessMessage} setErrorMessage={setErrorMessage} />}
            {currentView === 'client-comm-log' && <ClientCommLogTracker setSuccessMessage={displaySuccessMessage} setErrorMessage={setErrorMessage} />}
            {currentView === 'lead-history' && <LeadHistory leads={leads} />}
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

      {schedulingVisitForLead && (
        <ScheduleVisitModal
          lead={schedulingVisitForLead}
          onSave={handleScheduleAndSave}
          onCancel={() => setSchedulingVisitForLead(null)}
        />
      )}
      
      {successMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-neutral-800 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 z-50 animate-fade-in-out">
          <CheckCircleIcon className="h-6 w-6 text-green-400"/>
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 z-50 animate-fade-in-out">
          <XCircleIcon className="h-6 w-6"/>
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};

export default App;