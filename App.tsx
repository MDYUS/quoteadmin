
import React, { useState, useEffect, useRef } from 'react';
import { useLeads } from './hooks/useLeads';
import LeadList from './components/LeadList';
import LeadForm from './components/LeadForm';
import Sidebar from './components/Sidebar';
import QuotePage from './components/QuotePage';
import SiteVisitCalendar from './components/SiteVisitCalendar';
import ProjectTracker from './components/ProjectTracker';
import TeamMemberTracker from './components/TeamMemberTracker';
import PaymentsPage from './components/PaymentsPage';
import LeadHistory from './components/LeadHistory';
import InvoicePage from './components/InvoicePage';
import InvoiceHistoryPage from './components/InvoiceHistoryPage';
import { Lead, LeadStatus, SiteVisit, Payment, PaymentType, PaymentStatus, Invoice } from './types';
import { CheckCircleIcon, MenuIcon, XIcon, PlusIcon, LoadingSpinner, XCircleIcon, BellIcon, ArrowDownTrayIcon, WarningIcon } from './components/icons';
import { useSiteVisits } from './hooks/useSiteVisits';
import { useProjects } from './hooks/useProjects';
import { useTeamMembers } from './hooks/useTeamMembers';
import { usePayments } from './hooks/usePayments';
import { useInvoices } from './hooks/useInvoices';
import LoginPage from './components/LoginPage';
import { formatStatus, playWarningSound } from './utils';
import WarningPopup from './components/WarningPopup';
import PaymentOverduePopup from './components/PaymentOverduePopup';
import PublicLeadEditor from './components/PublicLeadEditor';

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

type View = 'leads' | 'quote' | 'site-visits' | 'projects' | 'team' | 'payments' | 'lead-history' | 'invoice' | 'invoice-history';

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
  // --- New, Robust Share Link Handling ---
  const [sharedLeadId, setSharedLeadId] = useState<string | null>(null);
  const [isCheckingShare, setIsCheckingShare] = useState(true);

  useEffect(() => {
    // This effect runs only once on component mount to check the URL.
    const params = new URLSearchParams(window.location.search);
    const id = params.get('share');
    setSharedLeadId(id);
    setIsCheckingShare(false); // Finished checking
  }, []);
  
  // Main App State
  const [currentView, setCurrentView] = useState<View>('leads');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // State for the warning popup
  const [isWarningPopupVisible, setWarningPopupVisible] = useState(false);
  const [warningLeads, setWarningLeads] = useState<Lead[]>([]);
  const [snoozedLeadIds, setSnoozedLeadIds] = useState<Record<string, number>>({});
  
  // State for month-end notification
  const [isMonthEndNotificationVisible, setIsMonthEndNotificationVisible] = useState(false);
  const [isMonthEndNotificationDismissed, setIsMonthEndNotificationDismissed] = useState(false);
  const [monthlyLeadCount, setMonthlyLeadCount] = useState(0);

  // State for Payment Notifications
  const [isOverduePopupVisible, setOverduePopupVisible] = useState(false);
  const [overduePayment, setOverduePayment] = useState<Payment | null>(null);
  const [isWeeklyNoticeVisible, setWeeklyNoticeVisible] = useState(false);
  const [dueWeeklyPayment, setDueWeeklyPayment] = useState<Payment | null>(null);

  // State for Push Notifications & PWA Installation
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);

  // Data Hooks
  const { leads, addLead, updateLead, deleteLead, isLoaded: leadsLoaded, error: leadsError } = useLeads();
  const { siteVisits, addVisit, updateVisit, deleteVisit } = useSiteVisits();
  const { projects, addProject, updateProject, deleteProject } = useProjects();
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useTeamMembers();
  const { payments } = usePayments();
  const { invoices, addInvoice, updateInvoice, deleteInvoice } = useInvoices();

  // Modal/Form State
  const [isLeadFormVisible, setLeadFormVisible] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isVisitModalVisible, setVisitModalVisible] = useState(false);
  const [leadForVisit, setLeadForVisit] = useState<Lead | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // Effect to handle PWA installation prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
        event.preventDefault();
        // Store the event so it can be triggered later.
        setInstallPromptEvent(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Effect to show success/error messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);
  
  // Effect to check for "Recently Added" leads older than 2 hours
  useEffect(() => {
    const checkLeads = () => {
      const now = Date.now();
      const twoHoursAgo = new Date(now - 2 * 60 * 60 * 1000);
      
      const activeSnoozedIds = Object.keys(snoozedLeadIds).filter(id => snoozedLeadIds[id] > now);

      const overdueLeads = leads.filter(lead => {
        const isOverdue = lead.status === LeadStatus.RecentlyAdded &&
                          lead.createdAt &&
                          new Date(lead.createdAt) < twoHoursAgo;
        const isSnoozed = activeSnoozedIds.includes(lead.id);
        return isOverdue && !isSnoozed;
      });

      if (overdueLeads.length > 0) {
        setWarningLeads(overdueLeads);
        setWarningPopupVisible(true);
      } else {
        if (isWarningPopupVisible) {
          setWarningLeads([]);
          setWarningPopupVisible(false);
        }
      }
    };

    if (leadsLoaded) {
      checkLeads();
    }
    const intervalId = setInterval(checkLeads, 60 * 1000); // Check every minute

    return () => {
      clearInterval(intervalId);
    };
  }, [leads, leadsLoaded, snoozedLeadIds]);

  // Effect to handle the month-end notification
  useEffect(() => {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const currentDay = today.getDate();

    // Show on the last two days of the month
    const shouldShow = currentDay === lastDayOfMonth || currentDay === lastDayOfMonth - 1;

    if (shouldShow) {
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      const count = leads.filter(lead => {
        if (!lead.createdAt) return false;
        const leadDate = new Date(lead.createdAt);
        return leadDate.getMonth() === currentMonth && leadDate.getFullYear() === currentYear;
      }).length;
      
      setMonthlyLeadCount(count);
      setIsMonthEndNotificationVisible(true);
    } else {
      setIsMonthEndNotificationVisible(false);
      setIsMonthEndNotificationDismissed(false); // Reset for next month
    }
  }, [leads]);

    // Effect for checking payment statuses
  useEffect(() => {
    if (!payments.length || !isAuthenticated) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // --- Check for overdue DM Service payment ---
    const lastDismissal = localStorage.getItem('paymentPopupDismissedUntil');
    if (lastDismissal && today.getTime() < parseInt(lastDismissal, 10)) {
        // Still within dismissal period, do nothing.
    } else if (now.getDate() > 10) {
        const overdue = payments.find(p => 
            p.paymentType === PaymentType.DMService &&
            p.status === PaymentStatus.Pending &&
            new Date(p.dueDate).getMonth() === now.getMonth() &&
            new Date(p.dueDate).getFullYear() === now.getFullYear()
        );
        if (overdue) {
            setOverduePayment(overdue);
            setOverduePopupVisible(true);
            return; // Prioritize the blocking popup
        }
    }

    // --- Check for upcoming weekly payment ---
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dueSoon = payments.find(p => 
        p.paymentType === PaymentType.WeeklyBudget &&
        p.status === PaymentStatus.Pending &&
        new Date(p.dueDate).getTime() === tomorrow.getTime()
    );

    if (dueSoon) {
        setDueWeeklyPayment(dueSoon);
        setWeeklyNoticeVisible(true);
    } else {
        setWeeklyNoticeVisible(false);
    }

  }, [payments, isAuthenticated]);

  // Sound triggers for warnings and reminders
  useEffect(() => {
    if (isWarningPopupVisible) playWarningSound();
  }, [isWarningPopupVisible]);

  useEffect(() => {
    if (isOverduePopupVisible) playWarningSound();
  }, [isOverduePopupVisible]);

  useEffect(() => {
    if (isWeeklyNoticeVisible) playWarningSound();
  }, [isWeeklyNoticeVisible]);

  useEffect(() => {
    if (isMonthEndNotificationVisible && !isMonthEndNotificationDismissed) {
        playWarningSound();
    }
  }, [isMonthEndNotificationVisible]);


  const handleCloseWarning = () => {
    const now = Date.now();
    const twoHoursFromNow = now + (2 * 60 * 60 * 1000);
    const newSnoozes: Record<string, number> = {};
    warningLeads.forEach(lead => {
        newSnoozes[lead.id] = twoHoursFromNow;
    });
    
    setSnoozedLeadIds(prev => ({...prev, ...newSnoozes}));
    setWarningPopupVisible(false);
    setWarningLeads([]);
  };

  const handleLogin = (userId: string) => {
    setIsAuthenticated(true);
    setCurrentUser(userNames[userId] || 'User');
    setCurrentUserId(userId);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentUserId(null);
  };

  const handleLeadSave = async (lead: Lead) => {
    try {
      if (editingLead) {
        await updateLead(lead);
        setSuccessMessage('Lead updated successfully!');
      } else {
        await addLead(lead);
        setSuccessMessage('Lead added successfully!');
      }
      setLeadFormVisible(false);
      setEditingLead(null);
    } catch (error: any) {
      setErrorMessage(`Failed to save lead: ${error.message}`);
    }
  };

  const handleInvoiceSave = async (invoice: Invoice) => {
    try {
      if (editingInvoice) {
        await updateInvoice(invoice);
        setSuccessMessage('Invoice updated successfully!');
      } else {
        await addInvoice(invoice);
        setSuccessMessage('Invoice saved successfully!');
      }
      setEditingInvoice(null);
      setCurrentView('invoice-history');
    } catch (error: any) {
      setErrorMessage(`Failed to save invoice: ${error.message}`);
    }
  };

  const handleInvoiceDelete = async (id: string) => {
    try {
      await deleteInvoice(id);
      setSuccessMessage('Invoice deleted successfully.');
    } catch (error: any) {
      setErrorMessage(`Failed to delete invoice: ${error.message}`);
    }
  };


  const handleLeadStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    const leadToUpdate = leads.find(l => l.id === leadId);
    if (leadToUpdate) {
      if (newStatus === LeadStatus.SiteVisit && leadToUpdate.status !== LeadStatus.SiteVisit) {
          setLeadForVisit(leadToUpdate);
          setVisitModalVisible(true);
      } else {
        try {
            await updateLead({ ...leadToUpdate, status: newStatus });
            setSuccessMessage(`Lead status updated to ${formatStatus(newStatus)}.`);
        } catch (error: any) {
            setErrorMessage(`Failed to update lead status: ${error.message}`);
        }
      }
    }
  };

  const handleScheduleVisit = async (visitData: { date: string; time: string; location: string }) => {
    if (!leadForVisit) return;
    try {
      const newVisit: SiteVisit = {
        id: Date.now().toString(),
        clientName: leadForVisit.name,
        phone: leadForVisit.phone,
        location: visitData.location,
        date: visitData.date,
        time: visitData.time,
      };
      await addVisit(newVisit);
      await updateLead({ ...leadForVisit, status: LeadStatus.SiteVisit });

      setSuccessMessage('Site visit scheduled and lead status updated!');
      setVisitModalVisible(false);
      setLeadForVisit(null);
    } catch (error: any) {
      setErrorMessage(`Failed to schedule visit: ${error.message}`);
    }
  };
  
    const handleOverdueAcknowledge = (duration: 'today' | 'tomorrow') => {
        const now = new Date();
        const dismissUntil = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (duration === 'tomorrow') {
            // Dismiss until the start of the day after tomorrow (so it won't show up tomorrow)
            dismissUntil.setDate(dismissUntil.getDate() + 2); 
        } else { // 'today'
            // Dismiss for 24 hours from now
            dismissUntil.setTime(now.getTime() + 24 * 60 * 60 * 1000);
        }

        localStorage.setItem('paymentPopupDismissedUntil', dismissUntil.getTime().toString());
        setOverduePopupVisible(false);
    };


  // --- PWA Installation Logic ---
  const handleInstallPrompt = () => {
    if (!installPromptEvent) return;
    
    // Show the browser's installation prompt
    installPromptEvent.prompt();
    
    installPromptEvent.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        setSuccessMessage('App installed successfully!');
      }
      // The prompt can only be used once; clear the event.
      setInstallPromptEvent(null);
    });
  };

  // Helper function to convert VAPID key
  const urlBase64ToUint8Array = (base64String: string) => {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
          outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
  };

  const subscribeToNotifications = async () => {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
          try {
              const registration = await navigator.serviceWorker.ready;
              const vapidPublicKey = 'BNo5Yg83L2s0EwQfENfVaxnL-Pn5oSA3_s4fLgW_3DB-Nbrf0yIsyvWe_F2fBvA_z4yqWJdZ4fn722aezjF9nB4';

              const subscription = await registration.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
              });
              
              console.log('User is subscribed:', subscription);
              // TODO: Send this 'subscription' object to your backend server.
              setSuccessMessage('Notifications enabled!');
              setNotificationPermission('granted');

          } catch (error) {
              console.error('Failed to subscribe the user: ', error);
              setErrorMessage('Failed to enable notifications.');
              setNotificationPermission('denied');
          }
      }
  };

  const handleEnableNotifications = () => {
      if (notificationPermission === 'granted') {
          setSuccessMessage('Notifications are already enabled.');
          return;
      }
      
      if (notificationPermission === 'denied') {
          setErrorMessage('Permission denied. Please enable notifications in browser settings.');
          return;
      }

      Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
          if (permission === 'granted') {
              subscribeToNotifications();
          } else {
              setErrorMessage('Notification permission was not granted.');
          }
      });
  };
  
  // --- New Rendering Logic ---

  // 1. Render a loading spinner while checking the URL to prevent flashes of incorrect content.
  if (isCheckingShare) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-neutral-100">
        <LoadingSpinner className="h-10 w-10 text-primary-600"/>
      </div>
    );
  }

  // 2. After checking, if a share ID exists, render the public editor.
  if (sharedLeadId) {
    return <PublicLeadEditor leadId={sharedLeadId} />;
  }
  
  // 3. If not a share link, proceed with the normal authentication flow.
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLogin} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'leads':
        return <LeadList leads={leads} onAdd={() => { setEditingLead(null); setLeadFormVisible(true); }} onEdit={(lead) => { setEditingLead(lead); setLeadFormVisible(true); }} onLeadStatusChange={handleLeadStatusChange} />;
      case 'quote':
        return <QuotePage />;
      case 'invoice':
        return <InvoicePage invoiceToEdit={editingInvoice} onSave={handleInvoiceSave} onCancel={() => { setEditingInvoice(null); setCurrentView('invoice-history'); }} />;
      case 'invoice-history':
        return <InvoiceHistoryPage invoices={invoices} onEdit={(invoice) => { setEditingInvoice(invoice); setCurrentView('invoice'); }} onDelete={handleInvoiceDelete} onAddNew={() => { setEditingInvoice(null); setCurrentView('invoice'); }} currentUserId={currentUserId} />;
      case 'site-visits':
        return <SiteVisitCalendar siteVisits={siteVisits} addVisit={addVisit} updateVisit={updateVisit} deleteVisit={deleteVisit} setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />;
      case 'projects':
        return <ProjectTracker setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />;
      case 'team':
        return <TeamMemberTracker setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />;
      case 'payments':
        return <PaymentsPage currentUserId={currentUserId} setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage} />;
      case 'lead-history':
        return <LeadHistory leads={leads} />;
      default:
        return <div className="p-8">Select a view from the sidebar.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-neutral-100 font-sans">
      <div className={`fixed inset-y-0 left-0 z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:flex-shrink-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar currentView={currentView} setCurrentView={(view) => { setCurrentView(view); setSidebarOpen(false); }} currentUser={currentUser} onLogout={handleLogout} />
      </div>
      
      {isSidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"></div>}

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex-shrink-0 bg-white border-b border-neutral-200 shadow-sm">
            <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="md:hidden mr-3 text-neutral-600 hover:text-neutral-900">
                        {isSidebarOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                    </button>
                    <div>
                      <h1 className="text-lg font-semibold text-neutral-800">{getGreeting()}, {currentUser}!</h1>
                      <p className="text-xs text-neutral-500">You are viewing: <span className="font-medium text-neutral-700">{formatStatus(currentView)}</span></p>
                    </div>
                </div>
                 <div className="flex items-center gap-2">
                    {notificationPermission !== 'granted' && 'serviceWorker' in navigator && 'PushManager' in window && (
                      <button 
                        onClick={handleEnableNotifications}
                        title="Enable Notifications"
                        className="inline-flex items-center p-2 border border-neutral-300 rounded-md text-neutral-600 hover:bg-neutral-100 transition-colors"
                      >
                        <BellIcon className="h-5 w-5" />
                      </button>
                    )}
                    {installPromptEvent && (
                        <button
                          onClick={handleInstallPrompt}
                          title="Install App"
                          className="inline-flex items-center justify-center p-2 sm:px-3 sm:py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
                        >
                          <ArrowDownTrayIcon className="h-5 w-5 sm:mr-2" />
                          <span className="hidden sm:inline">Install App</span>
                        </button>
                    )}
                    <button 
                      onClick={() => { setEditingLead(null); setLeadFormVisible(true); }} 
                      title="Add New Lead"
                      className="inline-flex items-center justify-center p-2 sm:px-3 sm:py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700">
                        <PlusIcon className="h-5 w-5 sm:mr-2" />
                        <span className="hidden sm:inline">Add Lead</span>
                    </button>
                 </div>
            </div>
        </header>

        {isMonthEndNotificationVisible && !isMonthEndNotificationDismissed && (
          <div className="flex-shrink-0">
            <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 m-4 rounded-md shadow flex justify-between items-center animate-fade-in">
              <p>This Month's Total Leads: <span className="font-bold text-lg">{monthlyLeadCount}</span></p>
              <button onClick={() => setIsMonthEndNotificationDismissed(true)} className="text-green-600 hover:text-green-800">
                <XIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
        
        {isWeeklyNoticeVisible && dueWeeklyPayment && (
            <div className="flex-shrink-0">
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 m-4 rounded-md shadow flex justify-between items-center animate-fade-in">
                    <div className="flex items-center gap-3">
                        <WarningIcon className="h-6 w-6" />
                        <p>
                            A payment of <span className="font-bold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(dueWeeklyPayment.amount)}</span> for <span className="font-bold">{dueWeeklyPayment.description}</span> is due tomorrow.
                        </p>
                    </div>
                    <button onClick={() => setWeeklyNoticeVisible(false)} className="text-yellow-600 hover:text-yellow-800">
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>
            </div>
        )}

        {!leadsLoaded ? (
          <div className="flex-grow flex items-center justify-center">
            <LoadingSpinner className="h-8 w-8 text-primary-600"/>
          </div>
        ) : leadsError ? (
           <div className="flex-grow flex items-center justify-center p-4">
             <div className="text-center bg-red-50 p-6 rounded-lg border border-red-200">
                <XCircleIcon className="mx-auto h-12 w-12 text-red-400" />
                <h3 className="mt-2 text-lg font-medium text-red-900">Failed to load data</h3>
                <p className="mt-1 text-sm text-red-700">{leadsError}</p>
             </div>
           </div>
        ) : (
          <div className="flex-grow overflow-auto">
            {renderView()}
          </div>
        )}
      </main>

      {isOverduePopupVisible && <PaymentOverduePopup onAcknowledge={handleOverdueAcknowledge} />}

      {isLeadFormVisible && <LeadForm 
          lead={editingLead} 
          onSave={handleLeadSave} 
          onCancel={() => setLeadFormVisible(false)} 
          isDeleting={isDeleting}
          onDelete={async (id) => { 
            setIsDeleting(true);
            try { 
              await deleteLead(id); 
              setLeadFormVisible(false); 
              setSuccessMessage('Lead deleted.'); 
            } catch(e: any) { 
              setErrorMessage(e.message) 
            } finally {
              setIsDeleting(false);
            }
          }} 
      />}
      {isVisitModalVisible && leadForVisit && <ScheduleVisitModal lead={leadForVisit} onSave={handleScheduleVisit} onCancel={() => setVisitModalVisible(false)} />}
      
      {successMessage && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center animate-fade-in-out z-[100]">
          <CheckCircleIcon className="h-5 w-5 mr-2" /> {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="fixed bottom-5 right-5 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center animate-fade-in-out z-[100]">
          <XCircleIcon className="h-5 w-5 mr-2" /> {errorMessage}
        </div>
      )}

      {isWarningPopupVisible && (
        <WarningPopup
          leads={warningLeads}
          onClose={handleCloseWarning}
        />
      )}
    </div>
  );
};

export default App;
