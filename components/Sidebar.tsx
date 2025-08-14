
import React from 'react';
import { UsersIcon, DocumentTextIcon, CalendarIcon, ClipboardListIcon, UserCircleIcon, ChatBubbleIcon, DatabaseIcon } from './icons';

type View = 'leads' | 'quote' | 'site-visits' | 'projects' | 'team' | 'client-comm-log' | 'database';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
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
      className={`flex items-center p-3 my-1 text-base rounded-lg transition-colors duration-200 ${
        currentView === view
          ? 'bg-gray-100 text-black font-bold'
          : 'text-black hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="ml-3 whitespace-nowrap">{label}</span>
    </a>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <aside className="w-64 bg-white text-black flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out sm:relative absolute inset-y-0 left-0 z-30 border-r border-black" aria-label="Sidebar">
      <div className="px-4 py-6 border-b border-black">
        <h2 className="text-2xl font-bold text-black text-center">
          Your Family Interior
        </h2>
      </div>
      <div className="flex-grow px-3 py-4">
        <ul className="space-y-2">
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
            view="database"
            currentView={currentView}
            setCurrentView={setCurrentView}
            icon={<DatabaseIcon className="w-6 h-6" />}
            label="Help"
          />
        </ul>
      </div>
      <div className="p-4 text-center text-xs text-black border-t border-black">
        <p>Powered by AMAZ</p>
      </div>
    </aside>
  );
};

export default Sidebar;