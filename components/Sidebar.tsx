
import React from 'react';
import { UsersIcon, DocumentTextIcon, CalendarIcon, ClipboardListIcon, UserCircleIcon, CreditCardIcon, LogoutIcon, DatabaseIcon, CalculatorIcon, ArrowDownTrayIcon, DevicePhoneMobileIcon } from './icons';
import { LOGO_URL } from '../constants';

type View = 'leads' | 'quote' | 'site-visits' | 'projects' | 'team' | 'payments' | 'lead-history' | 'invoice' | 'invoice-history' | 'budget' | 'mobile-noti';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  currentUser: string | null;
  currentUserId: string | null;
  onLogout: () => void;
  installPromptEvent: any;
  handleInstallPrompt: () => void;
}

const NavItem: React.FC<{
  view: View;
  currentView: View;
  setCurrentView: (view: View) => void;
  icon: React.ReactNode;
  label: string;
  className?: string; // Optional extra classes
  textClassName?: string; // Optional text classes
}> = ({ view, currentView, setCurrentView, icon, label, className = '', textClassName = '' }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        setCurrentView(view);
      }}
      className={`flex items-center p-3 my-1 text-base rounded-lg transition-colors duration-200 group ${
        currentView === view
          ? 'bg-primary-600 text-white font-semibold'
          : 'text-neutral-300 hover:bg-neutral-700 hover:text-white'
      } ${className}`}
    >
       <span className={currentView === view ? 'text-white' : `text-neutral-400 group-hover:text-white ${textClassName}`}>
        {icon}
      </span>
      <span className={`ml-3 whitespace-nowrap ${textClassName}`}>{label}</span>
    </a>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, currentUser, currentUserId, onLogout, installPromptEvent, handleInstallPrompt }) => {
  // Yusuf's ID is 786786
  const isAdmin = currentUserId === '786786';

  const onInstallClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if (installPromptEvent) {
          handleInstallPrompt();
      } else {
          alert("App installation is not available right now.\n\nPossible reasons:\n1. The app is already installed.\n2. You are not using a supported browser (Chrome/Edge/Safari).\n3. Use the 'Add to Home Screen' option in your browser menu manually.");
      }
  };

  return (
    <aside className="w-64 bg-neutral-900 text-neutral-100 flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out h-full" aria-label="Sidebar">
      <div className="px-4 py-6 border-b border-neutral-800">
         <img 
            src={LOGO_URL} 
            alt="Amaz Interior Logo" 
            className="h-16 w-auto mx-auto mb-2"
        />
        <h2 className="text-xl font-bold text-white text-center">
          AMAZ Interior
        </h2>
      </div>
      <div className="flex-grow px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          <NavItem 
            view="leads"
            currentView={currentView}
            setCurrentView={setCurrentView}
            icon={<UsersIcon className="w-6 h-6" />}
            label="Leads"
          />
          <NavItem 
            view="quote"
            currentView={currentView}
            setCurrentView={setCurrentView}
            icon={<DocumentTextIcon className="w-6 h-6" />}
            label="Create Quote"
          />
           <NavItem 
            view="invoice"
            currentView={currentView}
            setCurrentView={setCurrentView}
            icon={<DocumentTextIcon className="w-6 h-6" />}
            label="Create Invoice"
          />
          <NavItem 
            view="invoice-history"
            currentView={currentView}
            setCurrentView={setCurrentView}
            icon={<DatabaseIcon className="w-6 h-6" />}
            label="Invoice History"
          />
          <NavItem 
            view="site-visits"
            currentView={currentView}
            setCurrentView={setCurrentView}
            icon={<CalendarIcon className="w-6 h-6" />}
            label="Site Visit Calendar"
          />
           <NavItem 
            view="projects"
            currentView={currentView}
            setCurrentView={setCurrentView}
            icon={<ClipboardListIcon className="w-6 h-6" />}
            label="Project Tracker"
          />
           <NavItem 
            view="team"
            currentView={currentView}
            setCurrentView={setCurrentView}
            icon={<UserCircleIcon className="w-6 h-6" />}
            label="Team Members"
          />
           <NavItem 
            view="payments"
            currentView={currentView}
            setCurrentView={setCurrentView}
            icon={<CreditCardIcon className="w-6 h-6" />}
            label="Payments"
          />
          <NavItem 
            view="budget"
            currentView={currentView}
            setCurrentView={setCurrentView}
            icon={<CalculatorIcon className="w-6 h-6 animate-pulse text-red-500" />}
            label="BUDGET"
            textClassName="text-red-500 animate-pulse font-bold tracking-wider"
          />
          <NavItem 
            view="lead-history"
            currentView={currentView}
            setCurrentView={setCurrentView}
            icon={<DatabaseIcon className="w-6 h-6" />}
            label="Lead History"
          />
          
          {/* Admin Only: Mobile-Noti */}
          {isAdmin && (
             <NavItem 
              view="mobile-noti"
              currentView={currentView}
              setCurrentView={setCurrentView}
              icon={<DevicePhoneMobileIcon className="w-6 h-6 text-yellow-400" />}
              label="MOBILE-NOTI"
              textClassName="text-yellow-400 font-bold"
            />
          )}

          {/* Download App - ALWAYS VISIBLE NOW */}
          <li>
            <a
            href="#"
            onClick={onInstallClick}
            className={`flex items-center p-3 my-1 text-base rounded-lg transition-colors duration-200 ${installPromptEvent ? 'bg-green-600 text-white hover:bg-green-700 font-bold animate-pulse' : 'bg-neutral-800 text-neutral-400 hover:text-white'}`}
            >
            <ArrowDownTrayIcon className="w-6 h-6" />
            <span className="ml-3 whitespace-nowrap">DOWNLOAD APP</span>
            </a>
          </li>
        </ul>
      </div>
      
      <div className="px-3 py-4 border-t border-neutral-800">
        {currentUser && (
            <div className="p-3 bg-neutral-800 rounded-lg text-center mb-3">
                <p className="text-xs text-neutral-400">Logged in as</p>
                <p className="text-sm font-bold text-white">{currentUser}</p>
            </div>
        )}
        <button
            onClick={onLogout}
            className="w-full flex items-center justify-center p-3 text-base rounded-lg transition-colors duration-200 text-neutral-300 bg-neutral-800 hover:bg-neutral-700 hover:text-white"
        >
            <LogoutIcon className="w-6 h-6" />
            <span className="ml-3">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
