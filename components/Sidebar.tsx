
import React from 'react';
import { UsersIcon, DocumentTextIcon, CalendarIcon, ClipboardListIcon, UserCircleIcon, ChatBubbleIcon, LogoutIcon, DatabaseIcon } from './icons';

type View = 'leads' | 'quote' | 'site-visits' | 'projects' | 'team' | 'client-comm-log' | 'lead-history';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  currentUser: string | null;
  onLogout: () => void;
}

const NavItem: React.FC<{
  view: View;
  currentView: View;
  setCurrentView: (view: View) => void;
  icon: React.ReactNode;
  label: string;
}> = ({ view, currentView, setCurrentView, icon, label }) => (
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
      }`}
    >
       <span className={currentView === view ? 'text-white' : 'text-neutral-400 group-hover:text-white'}>
        {icon}
      </span>
      <span className="ml-3 whitespace-nowrap">{label}</span>
    </a>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, currentUser, onLogout }) => {
  return (
    <aside className="w-64 bg-neutral-900 text-neutral-100 flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out h-full" aria-label="Sidebar">
      <div className="px-4 py-6 border-b border-neutral-800">
         <img 
            src="https://amazmodularinterior.com/wp-content/uploads/2024/07/Grey_Orange_Modern_Circle_Class_Logo__7_-removebg-preview-e1739462864846.png" 
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
            view="client-comm-log"
            currentView={currentView}
            setCurrentView={setCurrentView}
            icon={<ChatBubbleIcon className="w-6 h-6" />}
            label="Client Communication Log"
          />
          <NavItem 
            view="lead-history"
            currentView={currentView}
            setCurrentView={setCurrentView}
            icon={<DatabaseIcon className="w-6 h-6" />}
            label="Lead History"
          />
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

      <div className="p-4 text-center text-xs text-neutral-500 border-t border-neutral-800">
        <p>Powered by AMAZ</p>
      </div>
    </aside>
  );
};

export default Sidebar;