
import React, { useState } from 'react';
import { UsersIcon, DocumentTextIcon, CalendarIcon, ClipboardListIcon, UserCircleIcon, CreditCardIcon, LogoutIcon, DatabaseIcon, CalculatorIcon, ArrowDownTrayIcon, DevicePhoneMobileIcon, XIcon, ShareIcon } from './icons';
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
  const [showInstallHelp, setShowInstallHelp] = useState(false);

  const onInstallClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if (installPromptEvent) {
          handleInstallPrompt();
      } else {
          // Instead of a generic alert, show the help modal
          setShowInstallHelp(true);
      }
  };

  return (
    <>
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

          {/* Download App - Always Visible */}
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

    {/* Install Instructions Modal */}
    {showInstallHelp && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black bg-opacity-80 p-4" onClick={() => setShowInstallHelp(false)}>
            <div className="bg-white rounded-xl p-6 max-w-sm w-full text-neutral-900 shadow-2xl transform transition-all" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4 border-b border-neutral-200 pb-2">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <ArrowDownTrayIcon className="h-5 w-5 text-primary-600"/>
                        Install App Manually
                    </h3>
                    <button onClick={() => setShowInstallHelp(false)} className="text-neutral-500 hover:text-neutral-700"><XIcon /></button>
                </div>
                
                <div className="space-y-6 text-sm">
                    <p className="text-neutral-600">The automatic installer is not available. Please follow the steps for your device:</p>
                    
                    {/* Android Instructions */}
                    <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                        <p className="font-bold mb-2 flex items-center gap-2 text-neutral-800">
                            🤖 Android (Chrome)
                        </p>
                        <ol className="list-decimal pl-5 space-y-2 text-neutral-700">
                            <li>Tap the <span className="font-bold">three dots (⋮)</span> in the top right corner of the browser.</li>
                            <li>Select <span className="font-bold">"Add to Home screen"</span> or <span className="font-bold">"Install App"</span>.</li>
                            <li>Tap <strong>Install</strong> to confirm.</li>
                        </ol>
                    </div>

                    {/* iOS Instructions */}
                    <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                        <p className="font-bold mb-2 flex items-center gap-2 text-neutral-800">
                            🍎 iOS (Safari)
                        </p>
                        <ol className="list-decimal pl-5 space-y-2 text-neutral-700">
                            <li>Tap the <span className="font-bold">Share icon</span> <ShareIcon className="inline h-4 w-4"/> at the bottom of the screen.</li>
                            <li>Scroll down and tap <span className="font-bold">"Add to Home Screen"</span>.</li>
                            <li>Tap <strong>Add</strong> in the top right.</li>
                        </ol>
                    </div>
                </div>

                <button 
                    onClick={() => setShowInstallHelp(false)} 
                    className="mt-6 w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-700 transition-colors shadow-md"
                >
                    Got it, I'll try that!
                </button>
            </div>
        </div>
    )}
    </>
  );
};

export default Sidebar;
