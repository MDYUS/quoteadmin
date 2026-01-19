
import React, { useState } from 'react';
import { UsersIcon, DocumentTextIcon, CalendarIcon, ClipboardListIcon, UserCircleIcon, CreditCardIcon, LogoutIcon, DatabaseIcon, CalculatorIcon, ArrowDownTrayIcon, DevicePhoneMobileIcon, XIcon, ShareIcon } from './icons';
import { LOGO_URL, APK_DOWNLOAD_URL } from '../constants';

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

  const onApkDownloadClick = (e: React.MouseEvent) => {
      // Check if URL is configured (simple check)
      if (APK_DOWNLOAD_URL.includes('expo.dev/artifacts/eas/....')) {
          e.preventDefault();
          alert("APK file URL is not configured yet.\n\nPlease host your .apk file (e.g., on Supabase Storage or Dropbox) and update the 'APK_DOWNLOAD_URL' in constants.ts");
      }
      // Otherwise, let the anchor tag handle the download natively
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

          {/* DIRECT APK DOWNLOAD - Replaces Install Prompt */}
          <li>
            <a
            href={APK_DOWNLOAD_URL}
            onClick={onApkDownloadClick}
            download="AmazCRM.apk"
            className="flex items-center p-3 my-1 text-base rounded-lg transition-colors duration-200 bg-green-600 text-white hover:bg-green-700 font-bold animate-pulse"
            >
            <ArrowDownTrayIcon className="w-6 h-6" />
            <span className="ml-3 whitespace-nowrap">DOWNLOAD APK</span>
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
    </>
  );
};

export default Sidebar;
